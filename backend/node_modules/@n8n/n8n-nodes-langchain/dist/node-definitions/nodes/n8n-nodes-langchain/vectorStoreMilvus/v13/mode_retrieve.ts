/**
 * Milvus Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve
 */


interface Credentials {
  milvusApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreMilvusV13RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  milvusCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
};

export interface LcVectorStoreMilvusV13RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreMilvusV13RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMilvus';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMilvusV13RetrieveParams> & { subnodes: LcVectorStoreMilvusV13RetrieveSubnodeConfig };
};