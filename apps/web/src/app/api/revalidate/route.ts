import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log('revalidateTag', body.model);
  if (typeof body.model === 'string' && body.model) {
    revalidateTag(body.model);
  }

  return new NextResponse(null, { status: 204 });
};
