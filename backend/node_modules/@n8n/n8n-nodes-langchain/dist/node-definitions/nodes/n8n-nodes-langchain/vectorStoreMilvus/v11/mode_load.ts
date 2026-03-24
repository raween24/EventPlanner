/**
 * Milvus Vector Store Node - Version 1.1
 * Discriminator: mode=load
 */


interface Credentials {
  milvusApi: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStoreMilvusV11LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
  milvusCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
};

export interface LcVectorStoreMilvusV11LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreMilvusV11LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMilvus';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMilvusV11LoadParams> & { subnodes: LcVectorStoreMilvusV11LoadSubnodeConfig };
};