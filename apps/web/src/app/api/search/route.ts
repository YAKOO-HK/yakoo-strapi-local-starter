import { NextRequest, NextResponse } from 'next/server';
import { uniqBy } from 'lodash-es';
import { rateLimitByIp } from '@/lib/rate-limit';
import { getVectorStoreWithTypesense } from '@/lib/typesense';

const LIMIT = 1;
const TTL = 1000; // 1 seconds
const rateLimit = rateLimitByIp(LIMIT, TTL);

export async function GET(req: NextRequest) {
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
  const documents = await vectorStore.similaritySearch(query, undefined, { per_page: 10 });
  return NextResponse.json(
    {
      documents: uniqBy(
        documents.map((document) => document.metadata),
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
