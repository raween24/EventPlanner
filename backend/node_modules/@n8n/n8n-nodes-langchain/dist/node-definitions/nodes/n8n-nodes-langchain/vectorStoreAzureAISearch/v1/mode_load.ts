/**
 * Azure AI Search Vector Store Node - Version 1
 * Discriminator: mode=load
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStoreAzureAISearchV1LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
/**
 * The name of the Azure AI Search index. Will be created automatically if it does not exist.
 * @default n8n-vectorstore
 */
    indexName?: string | Expression<string> | PlaceholderValue;
/**
 * Search prompt to retrieve matching documents from the vector store using similarity-based ranking
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Number of top results to fetch from vector store
 * @default 4
 */
    topK?: number | Expression<number>;
/**
 * Whether or not to include document metadata
 * @default true
 */
    includeDocumentMetadata?: boolean | Expression<boolean>;
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** The type of search query to perform
     * @default hybrid
     */
    queryType?: 'vector' | 'hybrid' | 'semanticHybrid' | Expression<string>;
    /** Filter results using OData syntax. Use metadata/fieldName for metadata fields. &lt;a href="https://learn.microsoft.com/en-us/azure/search/search-query-odata-filter" target="_blank"&gt;Learn more&lt;/a&gt;.
     */
    filter?: string | Expression<string> | PlaceholderValue;
    /** Name of the semantic configuration for semantic ranking (optional)
     * @displayOptions.show { queryType: ["semanticHybrid"] }
     */
    semanticConfiguration?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreAzureAISearchV1LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreAzureAISearchV1LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV1LoadParams> & { subnodes: LcVectorStoreAzureAISearchV1LoadSubnodeConfig };
};