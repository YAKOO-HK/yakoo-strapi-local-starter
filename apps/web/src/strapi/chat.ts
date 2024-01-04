import type { Message } from 'ai/react';
import * as qs from 'qs';
import { z } from 'zod';
import { env } from '@/env';
import { fetchResponseHandler } from '@/lib/fetch-utils';

export const StartChatSchema = z.object({
  hCaptcha: z.string().trim().min(1, 'Required.'),
  name: z.string().trim().min(1, 'Required.').max(191, 'Too Long.'),
});
export type StartChatBody = z.infer<typeof StartChatSchema>;

export type ChatHistory = {
  id: number;
  attributes: {
    uuid: string;
    name: string;
    history: Array<Message>;
  };
};
export type ChatData = ChatHistory['attributes'];

export type ChatsResponse = {
  data: Array<ChatHistory>;
};

export const getChatByUUID = async (uuid: string) => {
  if (!uuid) return null;
  const query = qs.stringify(
    {
      filters: { uuid: { $eq: uuid } },
      pagination: { pageSize: 1 },
    },
    { encodeValuesOnly: true }
  );
  const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/chats?${query}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    next: { revalidate: 0 },
  }).then(fetchResponseHandler<ChatsResponse>());
  return response.data?.[0] || null;
};

export const updateChat = async (id: number, history: Message[] = []) => {
  await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/chats/${id}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    method: 'PUT',
    body: JSON.stringify({
      data: { history },
    }),
    next: { revalidate: 0 },
  }).then(fetchResponseHandler());
};

export const createChat = async (name: string, uuid: string) => {
  await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.STRAPI_ADMIN_API_TOKEN}` },
    body: JSON.stringify({
      data: {
        name,
        uuid,
        history: [],
      },
    }),
    next: { revalidate: 0 },
  }).then(fetchResponseHandler());
};
