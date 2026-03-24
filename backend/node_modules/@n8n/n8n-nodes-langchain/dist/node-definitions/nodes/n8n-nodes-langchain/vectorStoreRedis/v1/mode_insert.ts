/**
 * Redis Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  redis: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreRedisV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreRedisV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreRedisV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV1InsertParams> & { subnodes: LcVectorStoreRedisV1InsertSubnodeConfig };
};