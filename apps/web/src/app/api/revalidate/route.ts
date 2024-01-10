import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { env } from '@/env';
import { getVectorStoreWithTypesense, typesenseClient } from '@/lib/typesense';
import { pageToDocument, postToDocument } from '@/strapi/langchain';

/**
 * This function indexes the Strapi entry in Typesense.
 * For this template, we demonstrate with the `post` and `page` models, each with specific logic to compress to text.
 * TODO: consider a more generic approach
 * @param body body of the webhook, which should be a Strapi entry
 */
async function indexTypesense(body: any) {
  const vectorStore = await getVectorStoreWithTypesense();
  if (['entry.create', 'entry.update', 'entry.delete', 'entry.publish', 'entry.unpublish'].includes(body.event)) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
      separators: ['\n\n', '  \n', '\n', ' ', ''],
      keepSeparator: false,
    });
    if (body.model === 'post' && body.entry?.slug) {
      await typesenseClient
        .collections(env.TYPESENSE_COLLECTION_NAME)
        .documents()
        .delete({
          filter_by: `slug:=${body.entry.slug} && type:=post`,
        }); // delete old entries
      if (body.event !== 'entry.delete' && body.entry.publishedAt) {
        await splitter.splitDocuments([postToDocument(body.entry)]).then((documents) => {
          // console.log('documents', documents);
          return vectorStore.addDocuments(documents);
        });
      }
    } else if (body.model === 'page' && body.entry?.slug) {
      await typesenseClient
        .collections(env.TYPESENSE_COLLECTION_NAME)
        .documents()
        .delete({
          filter_by: `slug:=${body.entry.slug} && type:=page`,
        }); // delete old entries
      if (body.event !== 'entry.delete' && body.entry.publishedAt) {
        await splitter
          .splitDocuments([pageToDocument(body.entry)])
          .then((documents) => vectorStore.addDocuments(documents));
      }
    }
  }
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log('revalidateTag', body.model, body.event);
  if (typeof body.model === 'string' && body.model) {
    revalidateTag(body.model);
    // console.log('webhook body', body);
    if (env.TYPESENSE_ENABLED) {
      await indexTypesense(body);
    }
  }
  return new NextResponse(null, { status: 204 });
};
