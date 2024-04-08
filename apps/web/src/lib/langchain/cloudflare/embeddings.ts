import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';
import { chunkArray } from '@langchain/core/utils/chunk_array';
import { getEnvironmentVariable } from '@langchain/core/utils/env';

// type AiTextEmbeddingsInput = {
//   text: string | string[];
// };

type AiTextEmbeddingsOutput = {
  result: {
    shape: number[];
    data: number[][];
  };
};

export interface CloudflareWorkersAIEmbeddingsParams extends EmbeddingsParams {
  cloudflareAccountId?: string;
  cloudflareApiToken?: string;
  baseUrl?: string;

  /** Model name to use */
  modelName?: string;

  /**
   * The maximum number of documents to embed in a single request.
   */
  batchSize?: number;

  /**
   * Whether to strip new lines from the input text. This is recommended by
   * OpenAI, but may not be suitable for all use cases.
   */
  stripNewLines?: boolean;
}

export class CloudflareWorkersAIEmbeddings extends Embeddings {
  modelName = '@cf/baai/bge-base-en-v1.5';

  batchSize = 50;

  stripNewLines = true;
  cloudflareAccountId?: string;

  cloudflareApiToken?: string;

  baseUrl: string;

  constructor(fields: CloudflareWorkersAIEmbeddingsParams) {
    super(fields);

    this.modelName = fields.modelName ?? this.modelName;
    this.stripNewLines = fields.stripNewLines ?? this.stripNewLines;
    this.cloudflareAccountId = fields?.cloudflareAccountId ?? getEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID');
    this.cloudflareApiToken = fields?.cloudflareApiToken ?? getEnvironmentVariable('CLOUDFLARE_API_TOKEN');
    this.baseUrl =
      fields?.baseUrl ?? `https://api.cloudflare.com/client/v4/accounts/${this.cloudflareAccountId}/ai/run`;
    if (this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.slice(0, -1);
    }
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const batches = chunkArray(this.stripNewLines ? texts.map((t) => t.replace(/\n/g, ' ')) : texts, this.batchSize);

    const batchRequests = batches.map((batch) => this.runEmbedding(batch));
    const batchResponses = await Promise.all(batchRequests);
    const embeddings: number[][] = [];

    for (let i = 0; i < batchResponses.length; i += 1) {
      const batchResponse = batchResponses[i];
      for (let j = 0; j < batchResponse!.length; j += 1) {
        embeddings.push(batchResponse![j]!);
      }
    }

    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const data = await this.runEmbedding([this.stripNewLines ? text.replace(/\n/g, ' ') : text]);
    return data[0] as number[];
  }

  private async runEmbedding(texts: string[]) {
    return this.caller.call(async () => {
      const url = `${this.baseUrl}/${this.modelName}`;
      const headers = {
        Authorization: `Bearer ${this.cloudflareApiToken}`,
        'Content-Type': 'application/json',
      };
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: texts,
        }),
      });
      if (response.ok) {
        const output = (await response.json()) as AiTextEmbeddingsOutput;
        return output.result.data;
      }

      const error = new Error(`Cloudflare Embedding call failed with status code ${response.status}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).response = response;
      throw error;
    });
  }
}
