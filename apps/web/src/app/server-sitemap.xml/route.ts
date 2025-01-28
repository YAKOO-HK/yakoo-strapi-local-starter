import { getServerSideSitemapIndex } from 'next-sitemap';
import { env } from '@/env';
import { locales } from '@/i18n/routing';

export const dynamic = 'force-static';
export async function GET() {
  return getServerSideSitemapIndex(
    locales.map((locale) => {
      const url = new URL(`${locale}/sitemap.xml`, env.NEXT_PUBLIC_SITE_URL);
      return url.toString();
    })
  );
}
