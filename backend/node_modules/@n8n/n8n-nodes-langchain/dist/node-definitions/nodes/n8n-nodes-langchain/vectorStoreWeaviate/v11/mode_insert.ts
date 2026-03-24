/**
 * Weaviate Vector Store Node - Version 1.1
 * Discriminator: mode=insert
 */


interface Credentials {
  weaviateApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreWeaviateV11InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  weaviateCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Whether to clear the Collection/Tenant before inserting new data
     * @default false
     */
    clearStore?: boolean | Expression<boolean>;
  };
};

export interface LcVectorStoreWeaviateV11InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreWeaviateV11InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreWeaviate';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreWeaviateV11InsertParams> & { subnodes: LcVectorStoreWeaviateV11InsertSubnodeConfig };
};