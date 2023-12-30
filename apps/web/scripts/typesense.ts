import { typesenseClient } from '@/lib/typesense';

const schema = {
  name: process.env.TYPESENSE_COLLECTION_NAME ?? 'langchain',
  fields: [
    {
      name: 'vec',
      type: 'float[]' as const,
      index: true,
      facet: false,
      num_dim: 1536, // 'amazon.titan-embed-text-v1' and 'text-embedding-ada-002' both have 1536 dimensions
    },
    {
      name: 'text',
      type: 'string' as const,
      facet: false,
    },
    {
      name: 'slug',
      type: 'string' as const,
      facet: false,
    },
    {
      name: 'locale',
      type: 'string' as const,
      facet: true,
    },
    {
      name: 'title',
      type: 'string' as const,
      facet: false,
    },
    {
      name: 'type',
      type: 'string' as const,
      facet: true,
    },
  ],
};
// await typesenseClient.collections('langchain').delete();
await typesenseClient.collections().create(schema);
// typesenseClient.collections('langchain').update(schema);
