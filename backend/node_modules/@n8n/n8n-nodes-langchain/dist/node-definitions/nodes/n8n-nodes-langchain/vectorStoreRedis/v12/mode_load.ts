/**
 * Redis Vector Store Node - Version 1.2
 * Discriminator: mode=load
 */


interface Credentials {
  redis: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStoreRedisV12LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreRedisV12LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreRedisV12LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV12LoadParams> & { subnodes: LcVectorStoreRedisV12LoadSubnodeConfig };
};