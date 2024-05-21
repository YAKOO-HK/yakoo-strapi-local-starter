import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { nanoid, StreamingTextResponse } from 'ai';
import { formatDocumentsAsString } from 'langchain/util/document';
import { z } from 'zod';
import { env } from '@/env';
import { getChatModel, getVectorStoreWithTypesense } from '@/lib/typesense';
import { getChatByUUID, updateChat } from '@/strapi/chat';
import { UnwrapArray } from '@/types/helpers';

const MessagesSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string().trim().optional(),
        content: z.string().trim(),
        role: z.enum(['user', 'system', 'assistant']),
        createdAt: z.coerce.date().optional(),
      })
    )
    .min(1),
});
type ChatMessage = UnwrapArray<z.infer<typeof MessagesSchema>['messages']>;

function getPrompt(messages: ChatMessage[]) {
  if (env.TYPESENSE_LLM_PROVIDER === 'openai') {
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        'You are a helpful and honest assistant. Always answer in shortest possible way, skip all the unnecessary words.\n' +
          `Use the following pieces of context answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. \n` +
          `Context:\n{context}`
      ),
      ...(messages
        .map((message) => {
          if (message.role === 'user') {
            return new HumanMessage(message.content);
          } else if (message.role === 'assistant') {
            return new AIMessage(message.content);
          }
          return null;
        })
        .filter(Boolean) as (HumanMessage | AIMessage)[]),
    ]);
  }
  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'You are a helpful and honest assistant. Always answer in shortest possible way, skip all the unnecessary words.\n' +
        `Use the following pieces of context answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. \n` +
        `Context:\n{context}`
    ),
    ...(messages
      .map((message) => {
        if (message.role === 'user') {
          return new HumanMessage(message.content);
        } else if (message.role === 'assistant') {
          return new AIMessage(message.content);
        }
        return null;
      })
      .filter(Boolean) as (HumanMessage | AIMessage)[]),
  ]);
}

function getStandaloneQuestionPrompt(messages: ChatMessage[]) {
  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'Given the following conversation, rephrase the last question to be a standalone question with background information in the same language. It should be a maximum of three sentences long.'
    ),
    ...(messages
      .map((message) => {
        if (message.role === 'user') {
          return new HumanMessage(message.content);
        } else if (message.role === 'assistant') {
          return new AIMessage(message.content);
        }
        return null;
      })
      .filter(Boolean) as (HumanMessage | AIMessage)[]),
    new AIMessage('Standalone question:'),
  ]);
}

export async function POST(req: Request) {
  const uuid = cookies().get('langchain-chat-id')?.value ?? '';
  const chatHistory = await getChatByUUID(uuid);
  if (!chatHistory) {
    return new NextResponse('Chat History Not Found', { status: 400 });
  }
  if (chatHistory.attributes.history.length >= 40) {
    // (user + assistant) x 20 = 40
    return new NextResponse('Limit Exceeded', { status: 400 });
  }

  // Extract the `prompt` from the body of the request
  const data = MessagesSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(data.error, { status: 400 });
  }

  const { messages } = data.data;
  let question = messages.slice(-1)[0]!.content;
  if (env.TYPESENSE_CONVERSATIONAL_RETRIEVAL_QA_ENABLED && messages.length > 1) {
    question = await RunnableSequence.from([
      getStandaloneQuestionPrompt(messages),
      getChatModel({ streaming: false, maxTokens: 256, temperature: 0.5 }) as BaseChatModel,
      new StringOutputParser(),
    ]).invoke({});
  }
  // console.log({ question });
  const vectorStore = await getVectorStoreWithTypesense();
  const retriever = vectorStore.asRetriever(5); // pick 5 top relevant documents
  const relevantDocs = await retriever.invoke(question);
  const prompt = getPrompt(messages);
  const chain = RunnableSequence.from([
    {
      userName: () => chatHistory.attributes.name,
      context: async () => {
        const serialized = formatDocumentsAsString(relevantDocs);
        // console.log('context', serialized);
        return serialized;
      },
    },
    prompt,
    getChatModel({ streaming: true }) as BaseChatModel,
    new StringOutputParser(),
  ]);
  const stream = await chain.stream(
    {},
    {
      callbacks: [
        {
          async handleChainEnd(outputs, runId, parentRunId) {
            // console.log({ runId, parentRunId, outputs: JSON.stringify(outputs) });
            // check that main chain (without parent) is finished:
            if (parentRunId == null) {
              // console.log(JSON.stringify(outputs));
              await updateChat(chatHistory.id, [
                ...messages.map((message) => ({ ...message, id: message.id || nanoid() })),
                { id: nanoid(), role: 'assistant', content: outputs.output, createdAt: new Date() },
              ]);
            }
          },
        },
      ],
    }
  );
  return new StreamingTextResponse(stream);
}
