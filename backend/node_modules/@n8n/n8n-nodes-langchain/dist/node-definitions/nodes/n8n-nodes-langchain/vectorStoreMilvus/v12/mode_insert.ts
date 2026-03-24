/**
 * Milvus Vector Store Node - Version 1.2
 * Discriminator: mode=insert
 */


interface Credentials {
  milvusApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreMilvusV12InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  milvusCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Whether to clear the collection before inserting new data
     * @default false
     */
    clearCollection?: boolean | Expression<boolean>;
  };
};

export interface LcVectorStoreMilvusV12InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreMilvusV12InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMilvus';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMilvusV12InsertParams> & { subnodes: LcVectorStoreMilvusV12InsertSubnodeConfig };
};