/**
 * Milvus Vector Store Node - Version 1
 * Discriminator: mode=retrieve
 */


interface Credentials {
  milvusApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreMilvusV1RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  milvusCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
};

export interface LcVectorStoreMilvusV1RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreMilvusV1RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMilvus';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMilvusV1RetrieveParams> & { subnodes: LcVectorStoreMilvusV1RetrieveSubnodeConfig };
};