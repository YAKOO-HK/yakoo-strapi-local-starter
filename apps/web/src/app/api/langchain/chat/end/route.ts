import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export const POST = async () => {
  (await cookies()).delete('langchain-chat-id');
  return NextResponse.json({ uuid: null, history: [], name: '' });
};
