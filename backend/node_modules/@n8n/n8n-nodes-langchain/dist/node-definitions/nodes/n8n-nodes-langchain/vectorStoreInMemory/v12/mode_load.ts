/**
 * Simple Vector Store Node - Version 1.2
 * Discriminator: mode=load
 */


/** Get many ranked documents from vector store for query */
export type LcVectorStoreInMemoryV12LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. These keys are shared between workflows.
 * @default {"mode":"list","value":"vector_store_key"}
 */
    memoryKey?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreInMemoryV12LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreInMemoryV12LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.2;
  config: NodeConfig<LcVectorStoreInMemoryV12LoadParams> & { subnodes: LcVectorStoreInMemoryV12LoadSubnodeConfig };
};