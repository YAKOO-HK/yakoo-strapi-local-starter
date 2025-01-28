import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { ZodError } from 'zod';
import { env } from '@/env';
import { verifyCaptcha } from '@/lib/captcha';
import { withBodyValidation } from '@/lib/middleware/zod-validation';
import { createChat, getChatByUUID, StartChatSchema } from '@/strapi/chat';

export const revalidate = 0;
export const GET = async () => {
  const entry = (await cookies()).get('langchain-chat-id');
  if (!entry?.value) {
    return NextResponse.json({ uuid: null, history: [], name: '' });
  }
  const chat = await getChatByUUID(entry.value);
  if (!chat) {
    return NextResponse.json({ uuid: null, history: [], name: '' });
  }
  // console.log({ uuid: entry?.value, chat: chat.attributes });
  return NextResponse.json(chat);
};

export const POST = withBodyValidation(StartChatSchema, async (_req, body) => {
  const { token, name } = body;
  if (!verifyCaptcha(token)) {
    throw new ZodError([{ path: ['token'], message: 'Captcha is invalid', code: 'custom' }]);
  }
  const uuid = randomUUID();
  await createChat(name, uuid);
  (await cookies()).set('langchain-chat-id', uuid, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
  });
  return NextResponse.json({ uuid });
});
