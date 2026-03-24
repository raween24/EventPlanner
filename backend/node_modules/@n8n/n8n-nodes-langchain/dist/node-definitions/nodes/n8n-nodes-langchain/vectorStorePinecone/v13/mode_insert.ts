/**
 * Pinecone Vector Store Node - Version 1.3
 * Discriminator: mode=insert
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStorePineconeV13InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Whether to clear the namespace before inserting new data
     * @default false
     */
    clearNamespace?: boolean | Expression<boolean>;
    /** Partition the records in an index into namespaces. Queries and other operations are then limited to one namespace, so different requests can search different subsets of your index.
     */
    pineconeNamespace?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStorePineconeV13InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStorePineconeV13InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV13InsertParams> & { subnodes: LcVectorStorePineconeV13InsertSubnodeConfig };
};