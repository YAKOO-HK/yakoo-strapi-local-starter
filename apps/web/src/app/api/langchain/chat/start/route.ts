import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { ZodError } from 'zod';
import { verifyCaptcha } from '@/lib/hCaptcha';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { createChat, getChatByUUID, StartChatSchema } from '@/strapi/chat';

export const revalidate = 0;
export const GET = async () => {
  const entry = cookies().get('langchain-chat-id');
  if (!entry?.value) {
    return NextResponse.json({ uuid: null, history: [], name: '' });
  }
  const chat = await getChatByUUID(entry.value);
  if (!chat) {
    return NextResponse.json({ uuid: null, history: [], name: '' });
  }
  // console.log({ uuid: entry?.value, chat: chat.attributes });
  return NextResponse.json(chat.attributes);
};

export const POST = withBodyValidation(StartChatSchema, async (_req, body) => {
  const { hCaptcha, name } = body;
  if (!verifyCaptcha(hCaptcha)) {
    throw new ZodError([{ path: ['hCaptcha'], message: 'hCaptcha is invalid', code: 'custom' }]);
  }
  const uuid = randomUUID();
  await createChat(name, uuid);
  cookies().set('langchain-chat-id', uuid, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'strict',
    secure: true,
  });
  return NextResponse.json({ uuid });
});
