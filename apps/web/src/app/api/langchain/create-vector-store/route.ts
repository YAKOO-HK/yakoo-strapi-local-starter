import { NextRequest } from 'next/server';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { env } from '@/env';
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

  // TODO: Implement secret key
  const posts = await getAllPosts(['sections']);
  const pages = await getAllPages('all', ['sections']);

  // compress posts dynamic zones to string
  const documents = [
    ...posts.map(({ attributes }) => postToDocument(attributes)),
    ...pages.map(({ attributes }) => pageToDocument(attributes)),
  ];
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
