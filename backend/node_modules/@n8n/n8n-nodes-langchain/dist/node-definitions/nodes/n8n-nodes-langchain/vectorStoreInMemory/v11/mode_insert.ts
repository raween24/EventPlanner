/**
 * Simple Vector Store Node - Version 1.1
 * Discriminator: mode=insert
 */


/** Insert documents into vector store */
export type LcVectorStoreInMemoryV11InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions.
 * @default vector_store_key
 */
    memoryKey?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreInMemoryV11InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreInMemoryV11InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1.1;
  config: NodeConfig<LcVectorStoreInMemoryV11InsertParams> & { subnodes: LcVectorStoreInMemoryV11InsertSubnodeConfig };
};