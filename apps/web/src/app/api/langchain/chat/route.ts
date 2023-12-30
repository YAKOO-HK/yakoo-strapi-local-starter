import { NextResponse } from 'next/server';
import { env } from 'process';
import { StreamingTextResponse } from 'ai';
import { experimental_buildLlama2Prompt as buildLlama2Prompt } from 'ai/prompts';
import { ChatPromptTemplate, PromptTemplate } from 'langchain/prompts';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { formatDocumentsAsString } from 'langchain/util/document';
import { z } from 'zod';
import { getVectorStoreWithTypesense, llm } from '@/lib/typesense';
import { UnwrapArray } from '@/types/helpers';

const MessagesSchema = z.object({
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
type ChatMessage = UnwrapArray<z.infer<typeof MessagesSchema>['messages']>;

const SYSTEM_INSTRUCTION = {
  role: 'system',
  content:
    'You are a helpful and honest assistant. You can only speak English and never answer in other language. Always answer in shortest possible way, skip all the unnecessary words. ' +
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.:\n{context}`,
} as const;

// TODO: move this to @/lib/typesense
function getPrompt(messages: ChatMessage[]) {
  if (env.TYPESENSE_EMBEDDINGS_PROVIDER === 'openai') {
    return ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_INSTRUCTION.content],
      ...(messages
        .map((message) => {
          if (message.role === 'assistant') {
            return ['assistant', message.content];
          } else if (message.role === 'user') {
            return ['user', message.content];
          }
          return null;
        })
        .filter((x) => !!x) as [string, string][]),
    ]);
  }
  return PromptTemplate.fromTemplate(buildLlama2Prompt([SYSTEM_INSTRUCTION, ...messages]));
}

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const data = MessagesSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(data.error, { status: 400 });
  }

  const { messages } = data.data; // TODO: pick only last 5 messages?
  const lastMessage = messages.slice(-1)[0]!;
  const vectorStore = await getVectorStoreWithTypesense();
  const retriever = vectorStore.asRetriever(5); // pick 5 top relevant documents
  const prompt = getPrompt(messages);
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
