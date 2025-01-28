import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/strapi/posts';
import { StrapiLocale } from '@/strapi/strapi';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') ?? 'post';
  const locale = (searchParams.get('locale') ?? 'en') as StrapiLocale; // TODO: validate locale
  if (!slug) {
    return new Response(null, { status: 404 });
  }
  if (type === 'post') {
    const post = await getPostBySlug(slug, locale);
    if (!post) {
      return new Response(null, { status: 404 });
    }
    return NextResponse.json({ url: `/posts/${post.category?.slug ?? '-'}/${post.slug}` });
  } else if (type === 'page') {
    return NextResponse.json({ url: `/${slug}` });
  }
  return new Response(null, { status: 404 });
}
