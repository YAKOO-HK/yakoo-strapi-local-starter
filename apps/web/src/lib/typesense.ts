import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createOpenAI } from '@ai-sdk/openai';
import { Typesense, TypesenseConfig } from '@langchain/community/vectorstores/typesense';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { CacheBackedEmbeddings } from 'langchain/embeddings/cache_backed';
import { LocalFileStore } from 'langchain/storage/file_system';
import { Client } from 'typesense';
import { env } from '@/env';

export function getEmbedding() {
  mkdirSync(join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'openai'), { recursive: true });
  return CacheBackedEmbeddings.fromBytesStore(
    new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
      configuration: {
        baseURL: env.OPENAI_BASE_URL,
      },
    }),
    new LocalFileStore({ rootPath: join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'openai') }),
    {
      namespace: 'text-embedding-3-small',
    }
  );
}

function getOpenAi() {
  return createOpenAI({
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
    baseURL: env.OPENAI_BASE_URL,
    apiKey: env.OPENAI_API_KEY,
  });
}

export function getLanguageModel(options?: { user?: string }) {
  const openai = getOpenAi();
  return openai.languageModel('gpt-4o-mini', options);
}

export function getChatModel(options?: { user?: string }) {
  const openai = getOpenAi();
  return openai.chat('gpt-4o-mini', options);
}

const typesenseClient = new Client({
  nodes: [{ host: env.TYPESENSE_HOST, port: env.TYPESENSE_PORT, protocol: env.TYPESENSE_PROTOCOL }],
  apiKey: env.TYPESENSE_API_KEY,
  numRetries: 3,
  connectionTimeoutSeconds: 60,
});

const typesenseVectorStoreConfig = {
  // Typesense client
  typesenseClient: typesenseClient,
  // Name of the collection to store the vectors in
  schemaName: env.TYPESENSE_COLLECTION_NAME,
  // Optional column names to be used in Typesense
  columnNames: {
    // "vec" is the default name for the vector column in Typesense but you can change it to whatever you want
    vector: 'vec',
    // "text" is the default name for the text column in Typesense but you can change it to whatever you want
    pageContent: 'text',
    // Names of the columns that you will save in your typesense schema and need to be retrieved as metadata when searching
    metadataColumnNames: ['slug', 'locale', 'title', 'type'],
  },
  import: async (data, collectionName) => {
    await typesenseClient
      .collections(collectionName)
      .documents()
      .import(data, { action: 'emplace', dirty_values: 'drop' });
  },
} satisfies TypesenseConfig;

const createVectorStoreWithTypesense = async (documents: Document[] = []) => {
  const embeddings = getEmbedding();
  return Typesense.fromDocuments(documents, embeddings, typesenseVectorStoreConfig);
};

const getVectorStoreWithTypesense = async () => {
  const embeddings = getEmbedding();
  return new Typesense(embeddings, typesenseVectorStoreConfig);
};

export { typesenseClient, createVectorStoreWithTypesense, getVectorStoreWithTypesense };
