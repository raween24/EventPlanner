/**
 * Weaviate Vector Store Node - Version 1
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  weaviateApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreWeaviateV1RetrieveAsToolParams = {
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
  weaviateCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Filter pageContent or metadata using this &lt;a href="https://weaviate.io/" target="_blank"&gt;filtering syntax&lt;/a&gt;
     */
    searchFilterJson?: IDataObject | string | Expression<string>;
    /** Select the metadata to retrieve along the content
     * @default source,page
     */
    metadataKeys?: string | Expression<string> | PlaceholderValue;
    /** Provide a query text to combine vector search with a keyword/text search
     */
    hybridQuery?: string | Expression<string> | PlaceholderValue;
    /** Whether to show the score fused between hybrid and vector search explanation
     * @default false
     */
    hybridExplainScore?: boolean | Expression<boolean>;
    /** Select the fusion type for combining vector and keyword search results
     * @default RelativeScore
     */
    fusionType?: 'RelativeScore' | 'Ranked' | Expression<string>;
    /** Limit result groups by detecting sudden jumps in score
     */
    autoCutLimit?: number | Expression<number>;
    /** Change the relative weights of the keyword and vector components. 1.0 = pure vector, 0.0 = pure keyword.
     * @default 0.5
     */
    alpha?: number | Expression<number>;
    /** Comma-separated list of properties to include in the query with optionally weighted values, e.g., "question^2,answer"
     */
    queryProperties?: string | Expression<string> | PlaceholderValue;
    /** Set the maximum allowable distance for the vector search component
     */
    maxVectorDistance?: number | Expression<number>;
    /** Tenant Name. Collection must have been created with tenant support enabled.
     */
    tenant?: string | Expression<string> | PlaceholderValue;
    /** The key in the document that contains the embedded text
     * @default text
     */
    textKey?: string | Expression<string> | PlaceholderValue;
    /** Whether to skip init checks while instantiating the client
     * @default false
     */
    skip_init_checks?: boolean | Expression<boolean>;
    /** Number of timeout seconds for initial checks
     * @default 2
     */
    timeout_init?: number | Expression<number>;
    /** Number of timeout seconds for inserts
     * @default 90
     */
    timeout_insert?: number | Expression<number>;
    /** Number of timeout seconds for queries
     * @default 30
     */
    timeout_query?: number | Expression<number>;
    /** Proxy to use for GRPC
     */
    proxy_grpc?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreWeaviateV1RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreWeaviateV1RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreWeaviate';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreWeaviateV1RetrieveAsToolParams> & { subnodes: LcVectorStoreWeaviateV1RetrieveAsToolSubnodeConfig };
};