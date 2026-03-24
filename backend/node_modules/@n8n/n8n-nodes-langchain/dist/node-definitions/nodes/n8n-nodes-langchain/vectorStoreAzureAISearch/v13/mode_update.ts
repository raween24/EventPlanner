/**
 * Azure AI Search Vector Store Node - Version 1.3
 * Discriminator: mode=update
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStoreAzureAISearchV13UpdateParams = {
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

export interface LcVectorStoreAzureAISearchV13UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStoreAzureAISearchV13UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV13UpdateParams> & { subnodes: LcVectorStoreAzureAISearchV13UpdateSubnodeConfig };
};