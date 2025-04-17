import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/env';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const draft = await draftMode();
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('url');
  const status = url.searchParams.get('status');
  const secret = url.searchParams.get('secret');
  // console.log('preview', { redirectUrl, status, secret });
  if (secret !== env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Access Denied' }, { status: 401 });
  }
  if (!redirectUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }
  if (status === 'draft') {
    draft.enable();
  } else {
    draft.disable();
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectUrl,
    },
  });
}
