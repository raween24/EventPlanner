/**
 * Google Gemini Node - Version 1.1
 * Discriminator: resource=fileSearch, operation=createStore
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Create a new File Search store for RAG (Retrieval Augmented Generation) */
export type LcGoogleGeminiV11FileSearchCreateStoreParams = {
  resource: 'fileSearch';
  operation: 'createStore';
/**
 * A human-readable name for the File Search store
 */
    displayName?: string | Expression<string> | PlaceholderValue;
};

export interface LcGoogleGeminiV11FileSearchCreateStoreSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV11FileSearchCreateStoreNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV11FileSearchCreateStoreParams> & { subnodes?: LcGoogleGeminiV11FileSearchCreateStoreSubnodeConfig };
};