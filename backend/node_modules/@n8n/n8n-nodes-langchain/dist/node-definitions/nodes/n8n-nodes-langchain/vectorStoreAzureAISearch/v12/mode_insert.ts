/**
 * Azure AI Search Vector Store Node - Version 1.2
 * Discriminator: mode=insert
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreAzureAISearchV12InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
/**
 * The name of the Azure AI Search index. Will be created automatically if it does not exist.
 * @default n8n-vectorstore
 */
    indexName?: string | Expression<string> | PlaceholderValue;
/**
 * Number of documents to embed in a single batch
 * @default 200
 */
    embeddingBatchSize?: number | Expression<number>;
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

export interface LcVectorStoreAzureAISearchV12InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreAzureAISearchV12InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV12InsertParams> & { subnodes: LcVectorStoreAzureAISearchV12InsertSubnodeConfig };
};