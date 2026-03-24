/**
 * Simple Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve-as-tool
 */


/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreInMemoryV13RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
/**
 * The key to use to store the vector memory in the workflow data. These keys are shared between workflows.
 * @default {"mode":"list","value":"vector_store_key"}
 */
    memoryKey?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreInMemoryV13RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreInMemoryV13RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.3;
  config: NodeConfig<LcVectorStoreInMemoryV13RetrieveAsToolParams> & { subnodes: LcVectorStoreInMemoryV13RetrieveAsToolSubnodeConfig };
};