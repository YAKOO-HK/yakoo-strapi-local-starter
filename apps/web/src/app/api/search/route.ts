import { unstable_noStore } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import type { Document } from 'langchain/document';
import { uniqBy } from 'lodash-es';
import { env } from '@/env';
import { rateLimitByIp } from '@/lib/rate-limit';
import { getVectorStoreWithTypesense, typesenseClient } from '@/lib/typesense';

const LIMIT = 1;
const TTL = 1000; // 1 seconds
const rateLimit = rateLimitByIp(LIMIT, TTL);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  unstable_noStore();
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  if (!query) {
    return new Response(null, { status: 400 });
  }
  const remaining = rateLimit.getRemaining(req);
  // console.log(`Remaining: ${remaining}`);
  if (remaining < 0) {
    return new Response(null, {
      status: 429,
      headers: {
        'X-Rate-Limit-Limit': `${LIMIT}`,
        'X-Rate-Limit-Remaining': '0',
        'X-Rate-Limit-Reset': `${(new Date().getTime() + TTL) / 1000}`,
      },
    });
  }

  const vectorStore = await getVectorStoreWithTypesense();
  const documentsSimilar = await vectorStore.similaritySearch(query, undefined, { per_page: 10 });
  const documentsText = await typesenseClient.multiSearch
    .perform<{ text: string; slug: string; title: string; locale: string; type: string }[]>({
      searches: [
        {
          collection: env.TYPESENSE_COLLECTION_NAME,
          q: query,
          query_by: 'text,title',
          per_page: 10,
        },
      ],
    })
    .then((response) =>
      response.results.flatMap((result) =>
        (result.hits ?? []).map(
          ({ document }) =>
            ({
              pageContent: document.text,
              metadata: {
                slug: document.slug,
                title: document.title,
                locale: document.locale,
                type: document.type,
              },
            }) as Document
        )
      )
    );

  // console.log({ query, documentsText, documentsSimilar });
  return NextResponse.json(
    {
      documents: uniqBy(
        [...documentsText, ...documentsSimilar].map((document) => document.metadata),
        'slug'
      ),
    },
    {
      headers: {
        'X-Rate-Limit-Limit': `${LIMIT}`,
        'X-Rate-Limit-Remaining': `${remaining}`,
        'X-Rate-Limit-Reset': `${(new Date().getTime() + TTL) / 1000}`,
      },
    }
  );
}
