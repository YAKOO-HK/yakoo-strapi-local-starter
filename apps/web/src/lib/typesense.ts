import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { BedrockChat } from '@langchain/community/chat_models/bedrock';
import { BedrockEmbeddings } from '@langchain/community/embeddings/bedrock';
import { Bedrock } from '@langchain/community/llms/bedrock';
import { Typesense, TypesenseConfig } from '@langchain/community/vectorstores/typesense';
import { Document } from '@langchain/core/documents';
import { ChatOpenAI, OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { CacheBackedEmbeddings } from 'langchain/embeddings/cache_backed';
import { LocalFileStore } from 'langchain/storage/file_system';
import { Client } from 'typesense';
import { env } from '@/env';

export function getEmbedding() {
  if (env.TYPESENSE_EMBEDDINGS_PROVIDER === 'openai') {
    mkdirSync(join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'openai'), { recursive: true });
    return CacheBackedEmbeddings.fromBytesStore(
      new OpenAIEmbeddings({
        openAIApiKey: env.OPENAI_API_KEY,
        modelName: 'text-embedding-3-small',
      }),
      new LocalFileStore({ rootPath: join(env.TYPESENSE_EMBEDDINGS_CACHE_PATH, 'openai') }),
      {
        namespace: 'text-embedding-3-small',
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
  if (env.TYPESENSE_LLM_PROVIDER === 'openai') {
    return new OpenAI({
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.8,
      maxTokens: 512,
      streaming,
      openAIApiKey: env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    });
  }
  // defaults to bedrock
  return new Bedrock({
    // model: 'meta.llama2-13b-chat-v1',
    model: 'anthropic.claude-3-haiku-20240307-v1:0',
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

export function getChatModel({ streaming = true, maxTokens = 512 }) {
  if (env.TYPESENSE_LLM_PROVIDER === 'openai') {
    return new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.8,
      maxTokens,
      streaming,
      openAIApiKey: env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    });
  }
  // defaults to bedrock
  return new BedrockChat({
    // model: 'meta.llama2-13b-chat-v1',
    model: 'anthropic.claude-3-haiku-20240307-v1:0',
    region: env.AWS_REGION,
    temperature: 0.8,
    maxTokens,
    streaming,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

const embeddings = getEmbedding();

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

export { typesenseClient, createVectorStoreWithTypesense, getVectorStoreWithTypesense };
