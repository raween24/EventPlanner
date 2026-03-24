/**
 * Azure AI Search Vector Store Node - Version 1
 * Discriminator: mode=update
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStoreAzureAISearchV1UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
/**
 * The name of the Azure AI Search index. Will be created automatically if it does not exist.
 * @default n8n-vectorstore
 */
    indexName?: string | Expression<string> | PlaceholderValue;
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStoreAzureAISearchV1UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStoreAzureAISearchV1UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV1UpdateParams> & { subnodes: LcVectorStoreAzureAISearchV1UpdateSubnodeConfig };
};