/**
 * Redis Vector Store Node - Version 1.1
 * Discriminator: mode=retrieve
 */


interface Credentials {
  redis: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreRedisV11RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreRedisV11RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreRedisV11RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV11RetrieveParams> & { subnodes: LcVectorStoreRedisV11RetrieveSubnodeConfig };
};