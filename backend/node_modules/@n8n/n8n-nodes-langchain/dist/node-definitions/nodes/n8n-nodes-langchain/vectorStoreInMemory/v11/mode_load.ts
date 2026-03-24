/**
 * Simple Vector Store Node - Version 1.1
 * Discriminator: mode=load
 */


/** Get many ranked documents from vector store for query */
export type LcVectorStoreInMemoryV11LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions.
 * @default vector_store_key
 */
    memoryKey?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreInMemoryV11LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreInMemoryV11LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.1;
  config: NodeConfig<LcVectorStoreInMemoryV11LoadParams> & { subnodes: LcVectorStoreInMemoryV11LoadSubnodeConfig };
};