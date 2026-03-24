/**
 * Azure AI Search Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreAzureAISearchV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
/**
 * The name of the Azure AI Search index. Will be created automatically if it does not exist.
 * @default n8n-vectorstore
 */
    indexName?: string | Expression<string> | PlaceholderValue;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Whether to delete and recreate the index before inserting new data. Warning: This will reset any custom index configuration (semantic ranking, analyzers, etc.) to defaults.
     * @default false
     */
    clearIndex?: boolean | Expression<boolean>;
    /** Comma-separated list of metadata keys to store in Azure AI Search. Leave empty to include all metadata. Azure AI Search stores metadata in an "attributes" array format.
     */
    metadataKeysToInsert?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreAzureAISearchV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreAzureAISearchV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV1InsertParams> & { subnodes: LcVectorStoreAzureAISearchV1InsertSubnodeConfig };
};