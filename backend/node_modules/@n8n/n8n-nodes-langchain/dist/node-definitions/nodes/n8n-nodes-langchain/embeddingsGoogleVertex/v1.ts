/**
 * Embeddings Google Vertex Node - Version 1
 * Use Google Vertex Embeddings
 */


export interface LcEmbeddingsGoogleVertexV1Params {
/**
 * Select or enter your Google Cloud project ID
 * @default {"mode":"list","value":""}
 */
    projectId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * The model which will generate the embeddings. &lt;a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/text-embeddings-api"&gt;Learn more&lt;/a&gt;.
 * @default text-embedding-005
 */
    modelName?: string | Expression<string> | PlaceholderValue;
}

export interface LcEmbeddingsGoogleVertexV1Credentials {
  googleApi: CredentialReference;
}

interface LcEmbeddingsGoogleVertexV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.embeddingsGoogleVertex';
  version: 1;
  credentials?: LcEmbeddingsGoogleVertexV1Credentials;
  isTrigger: true;
}

export type LcEmbeddingsGoogleVertexV1ParamsNode = LcEmbeddingsGoogleVertexV1NodeBase & {
  config: NodeConfig<LcEmbeddingsGoogleVertexV1Params>;
};

export type LcEmbeddingsGoogleVertexV1Node = LcEmbeddingsGoogleVertexV1ParamsNode;