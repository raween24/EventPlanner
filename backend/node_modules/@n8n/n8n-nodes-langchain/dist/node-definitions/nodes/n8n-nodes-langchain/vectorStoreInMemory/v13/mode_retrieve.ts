/**
 * Simple Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve
 */


/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreInMemoryV13RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. These keys are shared between workflows.
 * @default {"mode":"list","value":"vector_store_key"}
 */
    memoryKey?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
};

export interface LcVectorStoreInMemoryV13RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreInMemoryV13RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.3;
  config: NodeConfig<LcVectorStoreInMemoryV13RetrieveParams> & { subnodes: LcVectorStoreInMemoryV13RetrieveSubnodeConfig };
};