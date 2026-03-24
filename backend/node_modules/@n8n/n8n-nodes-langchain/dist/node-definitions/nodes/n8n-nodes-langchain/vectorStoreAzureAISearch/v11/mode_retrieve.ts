/**
 * Azure AI Search Vector Store Node - Version 1.1
 * Discriminator: mode=retrieve
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreAzureAISearchV11RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
/**
 * The name of the Azure AI Search index. Will be created automatically if it does not exist.
 * @default n8n-vectorstore
 */
    indexName?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreAzureAISearchV11RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreAzureAISearchV11RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV11RetrieveParams> & { subnodes: LcVectorStoreAzureAISearchV11RetrieveSubnodeConfig };
};