/**
 * Embeddings Google Gemini Node - Version 1
 * Use Google Gemini Embeddings
 */


export interface LcEmbeddingsGoogleGeminiV1Params {
/**
 * The model which will generate the embeddings. &lt;a href="https://developers.generativeai.google/api/rest/generativelanguage/models/list"&gt;Learn more&lt;/a&gt;.
 * @default models/text-embedding-004
 */
    modelName?: string | Expression<string>;
}

export interface LcEmbeddingsGoogleGeminiV1Credentials {
  googlePalmApi: CredentialReference;
}

interface LcEmbeddingsGoogleGeminiV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.embeddingsGoogleGemini';
  version: 1;
  credentials?: LcEmbeddingsGoogleGeminiV1Credentials;
  isTrigger: true;
}

export type LcEmbeddingsGoogleGeminiV1ParamsNode = LcEmbeddingsGoogleGeminiV1NodeBase & {
  config: NodeConfig<LcEmbeddingsGoogleGeminiV1Params>;
};

export type LcEmbeddingsGoogleGeminiV1Node = LcEmbeddingsGoogleGeminiV1ParamsNode;