import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/strapi/posts';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') ?? 'post';
  if (!slug) {
    return new Response(null, { status: 404 });
  }
  if (type === 'post') {
    const post = await getPostBySlug(slug);
    if (!post) {
      return new Response(null, { status: 404 });
    }
    return NextResponse.json(
      `/posts/${post.attributes.category?.data?.attributes.slug ?? '-'}/${post.attributes.slug}`
    );
  }
  return new Response(null, { status: 404 });
}
