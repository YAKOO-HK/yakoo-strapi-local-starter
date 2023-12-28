import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
import { experimental_buildLlama2Prompt as buildLlama2Prompt } from 'ai/prompts';
import { PromptTemplate } from 'langchain/prompts';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { formatDocumentsAsString } from 'langchain/util/document';
import { z } from 'zod';
import { getVectorStoreWithTypesense, llm } from '@/lib/typesense';

const MessageSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string().trim().optional(),
        content: z.string().trim(),
        role: z.enum(['user', 'system', 'assistant']),
        createdAt: z.date().optional(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const data = MessageSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(data.error, { status: 400 });
  }

  const { messages } = data.data; // TODO: pick only last 5 messages?
  const lastMessage = messages.slice(-1)[0]!;
  const vectorStore = await getVectorStoreWithTypesense();
  const retriever = vectorStore.asRetriever(5); // pick 5 top relevant documents

  const prompt = PromptTemplate.fromTemplate(
    buildLlama2Prompt([
      {
        role: 'system',
        content:
          'You are a helpful and honest assistant. You can only speak English and never answer in other language. Always answer in shortest possible way, skip all the unnecessary words. ' +
          `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.:\n{context}`,
      },
      ...messages,
    ])
  );
  const chain = RunnableSequence.from([
    {
      context: async () => {
        const relevantDocs = await retriever.getRelevantDocuments(lastMessage.content);
        const serialized = formatDocumentsAsString(relevantDocs);
        return serialized;
      },
    },
    prompt,
    llm,
    new BytesOutputParser(),
  ]);
  const stream = await chain.stream({});
  return new StreamingTextResponse(stream);
}
