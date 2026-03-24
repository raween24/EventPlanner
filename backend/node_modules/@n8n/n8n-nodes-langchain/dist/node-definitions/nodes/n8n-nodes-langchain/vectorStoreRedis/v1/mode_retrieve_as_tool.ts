/**
 * Redis Vector Store Node - Version 1
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  redis: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreRedisV1RetrieveAsToolParams = {
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
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** The comma-separated list of words by which to apply additional full-text metadata filtering
     */
    metadataFilter?: string | Expression<string> | PlaceholderValue;
    /** Prefix for Redis keys storing the documents
     */
    keyPrefix?: string | Expression<string> | PlaceholderValue;
    /** The hash key to be used to store the metadata of the document
     */
    metadataKey?: string | Expression<string> | PlaceholderValue;
    /** The hash key to be used to store the content of the document
     */
    contentKey?: string | Expression<string> | PlaceholderValue;
    /** The hash key to be used to store the embedding of the document
     */
    vectorKey?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreRedisV1RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreRedisV1RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV1RetrieveAsToolParams> & { subnodes: LcVectorStoreRedisV1RetrieveAsToolSubnodeConfig };
};