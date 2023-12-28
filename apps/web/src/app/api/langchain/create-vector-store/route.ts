import { NextRequest } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
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
  const posts = await getAllPosts();
  const pages = await getAllPages();

  // compress posts dynamic zones to string
  const documents = [
    ...posts.map(({ attributes }) => postToDocument(attributes)),
    ...pages.map(({ attributes }) => pageToDocument(attributes)),
  ];
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 256,
    chunkOverlap: 24,
  });
  // recreate vector store
  await splitter.splitDocuments(documents).then((documents) => createVectorStoreWithTypesense(documents));
  return new Response(null, { status: 204 });
}
