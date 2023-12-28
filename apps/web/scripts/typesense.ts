import { typesenseClient } from '@/lib/typesense';

const schema = {
  name: 'langchain',
  fields: [
    {
      name: 'vec',
      type: 'float[]' as const,
      index: true,
      facet: false,
      num_dim: 1536, // 'amazon.titan-embed-text-v1'
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
