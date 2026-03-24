/**
 * Simple Vector Store Node - Version 1
 * Discriminator: mode=retrieve-as-tool
 */


/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreInMemoryV1RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Name of the vector store
 */
    toolName?: string | Expression<string> | PlaceholderValue;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
/**
 * The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions.
 * @default vector_store_key
 */
    memoryKey?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreInMemoryV1RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreInMemoryV1RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1;
  config: NodeConfig<LcVectorStoreInMemoryV1RetrieveAsToolParams> & { subnodes: LcVectorStoreInMemoryV1RetrieveAsToolSubnodeConfig };
};