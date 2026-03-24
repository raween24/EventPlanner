/**
 * Simple Vector Store Node - Version 1.1
 * Discriminator: mode=retrieve
 */


/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreInMemoryV11RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions.
 * @default vector_store_key
 */
    memoryKey?: string | Expression<string> | PlaceholderValue;
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
};

export interface LcVectorStoreInMemoryV11RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreInMemoryV11RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.1;
  config: NodeConfig<LcVectorStoreInMemoryV11RetrieveParams> & { subnodes: LcVectorStoreInMemoryV11RetrieveSubnodeConfig };
};