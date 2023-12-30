import { NextResponse } from 'next/server';
import { env } from 'process';
import { StreamingTextResponse } from 'ai';
import { experimental_buildLlama2Prompt as buildLlama2Prompt } from 'ai/prompts';
import {
  ChatMessagePromptTemplate,
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
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

// TODO: move this to @/lib/typesense
function getPrompt(messages: ChatMessage[]) {
  if (env.TYPESENSE_EMBEDDINGS_PROVIDER === 'openai') {
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'You are a helpful and honest assistant. Always answer in shortest possible way, skip all the unnecessary words. ' +
          `Use the following pieces of context answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.` +
          `Context:\n{context}`
      ),
      ...(messages
        .map((message) => {
          if (message.role === 'user') {
            return ChatMessagePromptTemplate.fromTemplate(message.content, 'user');
          } else if (message.role === 'assistant') {
            return ChatMessagePromptTemplate.fromTemplate(message.content, 'assistant');
          }
          return null;
        })
        .filter(Boolean) as ChatMessagePromptTemplate[]),
    ]);
  }
  return PromptTemplate.fromTemplate(
    buildLlama2Prompt([
      {
        role: 'system',
        content:
          'You are a helpful and honest assistant. You can only speak English and never answer in other language. Keep the answer short and precise, skip all the unnecessary words. ' +
          `Use the following pieces of context to answer the question at the end but they may or may not relevant to the question. Only pick relevant information. If you don't know the answer, just say that you don't know, don't try to make up an answer.:\n{context}`,
      },
      ...messages,
    ])
  );
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
        console.log('context', serialized);
        return serialized;
      },
      // chat_history: async () => {
      //   const history = [];
      //   for (const message of messages) {
      //     if (message.role === 'user') {
      //       history.push(`User: ${message.content}`);
      //     } else if (message.role === 'assistant') {
      //       history.push(`Assistant: ${message.content}`);
      //     }
      //   }
      //   return history.join('\n');
      // },
    },
    prompt,
    llm,
    new BytesOutputParser(),
  ]);
  const stream = await chain.stream({});
  return new StreamingTextResponse(stream);
}
