/**
 * Azure AI Search Vector Store Node - Version 1.2
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  azureAiSearchApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreAzureAISearchV12RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Name of the vector store
 */
    toolName?: string | Expression<string> | PlaceholderValue;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
/**
 * The name of the Azure AI Search index. Will be created automatically if it does not exist.
 * @default n8n-vectorstore
 */
    indexName?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreAzureAISearchV12RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreAzureAISearchV12RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreAzureAISearch';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreAzureAISearchV12RetrieveAsToolParams> & { subnodes: LcVectorStoreAzureAISearchV12RetrieveAsToolSubnodeConfig };
};