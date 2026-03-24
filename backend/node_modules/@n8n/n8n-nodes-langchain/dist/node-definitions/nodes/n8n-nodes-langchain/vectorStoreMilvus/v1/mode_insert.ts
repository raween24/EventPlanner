/**
 * Milvus Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  milvusApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreMilvusV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  milvusCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreMilvusV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreMilvusV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMilvus';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMilvusV1InsertParams> & { subnodes: LcVectorStoreMilvusV1InsertSubnodeConfig };
};