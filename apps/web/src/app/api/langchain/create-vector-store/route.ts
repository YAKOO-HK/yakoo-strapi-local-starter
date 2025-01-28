import { NextRequest } from 'next/server';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from 'langchain/document';
import { env } from '@/env';
import { locales } from '@/i18n/routing';
import { createVectorStoreWithTypesense } from '@/lib/typesense';
import { pageToDocument, postToDocument } from '@/strapi/langchain';
import { getAllPages } from '@/strapi/pages';
import { getAllPosts } from '@/strapi/posts';

export async function POST(req: NextRequest) {
  if (req.headers.get('x-internal-api-secret') !== env.INTERNAL_API_SECRET) {
    return new Response(null, { status: 401 });
  }
  if (!env.TYPESENSE_ENABLED) {
    return new Response(null, { status: 501 });
  }

  const documents: Document[] = [];
  for (const locale of locales) {
    const posts = await getAllPosts(locale, ['sections']);
    const pages = await getAllPages(locale, ['sections']);

    documents.push(
      ...posts.map((attributes) => postToDocument(attributes)), // compress posts dynamic zones to string
      ...pages.map((attributes) => pageToDocument(attributes))
    );
  }
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ['\n\n', '  \n', '\n', '  ', ' ', ''],
    keepSeparator: false,
  });
  // recreate vector store
  await splitter.splitDocuments(documents).then((documents) => createVectorStoreWithTypesense(documents));
  return new Response(null, { status: 204 });
}
