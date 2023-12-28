import { NextRequest, NextResponse } from 'next/server';
import { uniqBy } from 'lodash-es';
import { getVectorStoreWithTypesense } from '@/lib/typesense';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  if (!query) {
    return new Response(null, { status: 400 });
  }
  const vectorStore = await getVectorStoreWithTypesense();
  const documents = await vectorStore.similaritySearch(query, undefined, { per_page: 10 });
  return NextResponse.json({
    documents: uniqBy(
      documents.map((document) => document.metadata),
      'slug'
    ),
  });
}
