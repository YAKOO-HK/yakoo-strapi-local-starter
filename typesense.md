# Semantics Search with AWS Bedrock and Typesense (POC)

## Basic Setup

### Typesense Setup

1. Install Typesense server locally: (https://typesense.org/docs/guide/install-typesense.html#option-2-local-machine-self-hosting)
2. Fill in TYPESENSE\_\* variables in .env file

| Variable                        | Description                   | default           |
| ------------------------------- | ----------------------------- | ----------------- |
| TYPESENSE_ENABLED               | Enable Semantic Search and AI | false             |
| TYPESENSE_HOST                  | Host of Typesense server      | localhost         |
| TYPESENSE_PORT                  | Port of Typesense server      | 8108              |
| TYPESENSE_PROTOCOL              | Protocol of Typesense server  | http              |
| TYPESENSE_API_KEY               | API key of Typesense server   |                   |
| TYPESENSE_EMBEDDINGS_CACHE_PATH | Path of embeddings cache      | .cache/embeddings |
| TYPESENSE_EMBEDDINGS_PROVIDER   | 'openai' or 'bedrock'         | bedrock           |

3. Create the "langchain" collection in Typesense:

```bash
cd apps/web
bun scripts/typesense.ts
```

### AWS Bedrock Setup

1. Create ACCESS_KEY and SECRET_KEY in AWS IAM
2. Assign permission of Bedrock to the ACCESS_KEY User
3. Request the following models access in Bedrock of aws console:

- Titan Embeddings G1 - Text
- Llama 2 Chat 13B

4. Fill in AWS\_\* variables in .env file
   | Variable | Description | default |
   | -------------- | -------------- | --------- |
   | AWS_ACCESS_KEY | AWS Access Key | |
   | AWS_SECRET_KEY | AWS Secret Key | |
   | AWS_REGION | AWS Region | us-east-1 |

### OpenAI Setup

1. Create an OpenAI account and create an API key
2. Fill in OPENAI\_\* variables in .env file
   | Variable | Description | default |
   | -------------- | -------------- | --------- |
   | OPENAI_API_KEY | OpenAI API Key | |

### Connect Typesense to your Strapi models

1. Run both Strapi and NextJS
2. /api/revalidate Webhook will create embeddings for your "post" and "page" models and store in Typesense. You may add your own models in the endpoint.
3. POST to /api/langchain/create-vector-store for re-indexing

```bash
curl -H "x-internal-api-secret: XXXXX" -X POST http://localhost:3000/api/langchain/create-vector-store
```

## TODO

Limit Chatbot API

- Rate Limit by IP and/or Session Cookie
- Add CAPTCHA to prevent abuse
