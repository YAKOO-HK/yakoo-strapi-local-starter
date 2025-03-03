import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateText, streamText } from 'ai';
import { formatDocumentsAsString } from 'langchain/util/document';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { env } from '@/env';
import { getChatModel, getLanguageModel, getVectorStoreWithTypesense } from '@/lib/typesense';
import { getChatByUUID, updateChat } from '@/strapi/chat';

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

export async function POST(req: Request) {
  const uuid = (await cookies()).get('langchain-chat-id')?.value ?? '';
  const chatHistory = await getChatByUUID(uuid);
  if (!chatHistory) {
    return new NextResponse('Chat History Not Found', { status: 400 });
  }
  if (chatHistory.history.length >= 40) {
    // (user + assistant) x 20 = 40
    return new NextResponse('Limit Exceeded', { status: 400 });
  }

  // Extract the `prompt` from the body of the request
  const data = MessagesSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(data.error, { status: 400 });
  }
  const messages = data.data.messages;
  let question = messages.slice(-1)[0]!.content;
  if (env.TYPESENSE_CONVERSATIONAL_RETRIEVAL_QA_ENABLED && messages.length > 1) {
    const r = await generateText({
      model: getLanguageModel({ user: uuid }),
      messages: [
        {
          role: 'user',
          content:
            'Given the following conversation, rephrase the last question to be a standalone question with background information in the same language. It should be a maximum of three sentences long.',
        },
        ...messages,
      ],
    });
    question = r.text;
  }
  const vectorStore = await getVectorStoreWithTypesense();
  const retriever = vectorStore.asRetriever(5); // pick 5 top relevant documents
  const relevantDocs = await retriever.invoke(question);

  const chatModel = getChatModel({ user: uuid });
  const result = streamText({
    model: chatModel,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful and honest assistant. Always answer in shortest possible way, skip all the unnecessary words.\n' +
          `Use the following pieces of context answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n` +
          `<Context>${formatDocumentsAsString(relevantDocs)}</Context>`,
      },
      ...messages.slice(0, messages.length - 1),
      {
        role: 'user',
        content: question,
      },
    ],
    onFinish: async ({ text }) => {
      await updateChat(chatHistory.documentId, [
        ...messages.map((message) => ({ ...message, id: message.id || nanoid() })),
        { id: nanoid(), role: 'assistant', content: text, createdAt: new Date() },
      ]);
    },
    providerOptions: {
      openai: { maxTokens: 512, temperature: 0.8 },
    },
  });
  return result.toDataStreamResponse();
}
