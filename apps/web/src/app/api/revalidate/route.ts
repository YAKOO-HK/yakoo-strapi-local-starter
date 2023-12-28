import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getVectorStoreWithTypesense, typesenseClient } from '@/lib/typesense';
import { pageToDocument, postToDocument } from '@/strapi/langchain';

async function indexTypesense(body: any) {
  const vectorStore = await getVectorStoreWithTypesense();
  if (['entry.create', 'entry.update', 'entry.delete', 'entry.publish', 'entry.unpublish'].includes(body.event)) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 256,
      chunkOverlap: 24,
    });
    if (body.model === 'post' && body.entry?.slug) {
      await typesenseClient
        .collections('langchain')
        .documents()
        .delete({
          filter_by: `slug:=${body.entry.slug} && type:=post`,
        }); // delete old entries
      if (body.event !== 'entry.delete' && body.entry.publishedAt) {
        await splitter
          .splitDocuments([postToDocument(body.entry)])
          .then((documents) => vectorStore.addDocuments(documents));
      }
    } else if (body.model === 'page' && body.entry?.slug) {
      await typesenseClient
        .collections('langchain')
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
