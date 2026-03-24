/**
 * Simple Vector Store Node - Version 1.3
 * Discriminator: mode=insert
 */


/** Insert documents into vector store */
export type LcVectorStoreInMemoryV13InsertParams = {
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

export interface LcVectorStoreInMemoryV13InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreInMemoryV13InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.3;
  config: NodeConfig<LcVectorStoreInMemoryV13InsertParams> & { subnodes: LcVectorStoreInMemoryV13InsertSubnodeConfig };
};