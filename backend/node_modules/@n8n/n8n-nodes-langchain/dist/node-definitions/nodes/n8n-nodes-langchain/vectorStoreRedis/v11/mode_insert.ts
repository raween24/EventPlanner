/**
 * Redis Vector Store Node - Version 1.1
 * Discriminator: mode=insert
 */


interface Credentials {
  redis: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreRedisV11InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Prefix for Redis keys storing the documents
     */
    keyPrefix?: string | Expression<string> | PlaceholderValue;
    /** Whether existing documents and the index should be overwritten
     * @default false
     */
    overwriteDocuments?: boolean | Expression<boolean>;
    /** The hash key to be used to store the metadata of the document
     */
    metadataKey?: string | Expression<string> | PlaceholderValue;
    /** The hash key to be used to store the content of the document
     */
    contentKey?: string | Expression<string> | PlaceholderValue;
    /** The hash key to be used to store the embedding of the document
     */
    vectorKey?: string | Expression<string> | PlaceholderValue;
    /** Time-to-live for the documents in seconds
     */
    ttl?: number | Expression<number>;
  };
};

export interface LcVectorStoreRedisV11InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreRedisV11InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV11InsertParams> & { subnodes: LcVectorStoreRedisV11InsertSubnodeConfig };
};