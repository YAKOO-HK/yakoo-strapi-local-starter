import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Document } from 'langchain/document';
import { BedrockEmbeddings } from 'langchain/embeddings/bedrock';
import { CacheBackedEmbeddings } from 'langchain/embeddings/cache_backed';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Bedrock } from 'langchain/llms/bedrock';
import { OpenAI } from 'langchain/llms/openai';
import { LocalFileStore } from 'langchain/storage/file_system';
import { Typesense, TypesenseConfig } from 'langchain/vectorstores/typesense';
import { Client } from 'typesense';
import { env } from '@/env';

export function getEmbedding() {
  if (env.TYPESENSE_EMBEDDINGS_PROVIDER === 'openai') {
    mkdirSync(join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'openai'), { recursive: true });
    return CacheBackedEmbeddings.fromBytesStore(
      new OpenAIEmbeddings({
        openAIApiKey: env.OPENAI_API_KEY,
        modelName: 'text-embedding-ada-002',
      }),
      new LocalFileStore({ rootPath: join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'openai') }),
      {
        namespace: 'text-embedding-ada-002',
      }
    );
  }
  // defaults to bedrock
  mkdirSync(join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'bedrock'), { recursive: true });
  return CacheBackedEmbeddings.fromBytesStore(
    new BedrockEmbeddings({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      model: 'amazon.titan-embed-text-v1', // Default value
    }),
    new LocalFileStore({ rootPath: join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'bedrock') }),
    {
      namespace: 'amazon.titan-embed-text-v1',
    }
  );
}

export function getLLM({ streaming = true }) {
  if (env.TYPESENSE_EMBEDDINGS_PROVIDER === 'openai') {
    return new OpenAI({
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 0.8,
      maxTokens: 512,
      streaming,
      openAIApiKey: env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    });
  }
  // defaults to bedrock
  return new Bedrock({
    model: 'meta.llama2-13b-chat-v1',
    region: env.AWS_REGION,
    temperature: 0.8,
    maxTokens: 512,
    streaming,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

const embeddings = getEmbedding();
const llm = getLLM({ streaming: true });

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

const createVectorStoreWithTypesense = async (documents: Document[] = []) =>
  Typesense.fromDocuments(documents, embeddings, typesenseVectorStoreConfig);

const getVectorStoreWithTypesense = async () => new Typesense(embeddings, typesenseVectorStoreConfig);

export { typesenseClient, llm, createVectorStoreWithTypesense, getVectorStoreWithTypesense };
