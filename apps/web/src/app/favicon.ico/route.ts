import { env } from '@/env';
import { getSiteMetadata } from '@/strapi/site-metadata';

export async function GET() {
  try {
    const { favicon } = await getSiteMetadata();
    return new Response(null, {
      status: 307, // redirect
      headers: {
        Location: `${env.NEXT_PUBLIC_STRAPI_URL}${favicon.url}?format=ico`,
      },
    });
  } catch (_e) {
    // console.error(e);
    return new Response(null, { status: 404 });
  }
}
