/**
 * Simple Vector Store Node - Version 1.2
 * Discriminator: mode=insert
 */


/** Insert documents into vector store */
export type LcVectorStoreInMemoryV12InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. These keys are shared between workflows.
 * @default {"mode":"list","value":"vector_store_key"}
 */
    memoryKey?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Number of documents to embed in a single batch
 * @default 200
 */
    embeddingBatchSize?: number | Expression<number>;
/**
 * Whether to clear the store before inserting new data
 * @default false
 */
    clearStore?: boolean | Expression<boolean>;
};

export interface LcVectorStoreInMemoryV12InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreInMemoryV12InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.2;
  config: NodeConfig<LcVectorStoreInMemoryV12InsertParams> & { subnodes: LcVectorStoreInMemoryV12InsertSubnodeConfig };
};