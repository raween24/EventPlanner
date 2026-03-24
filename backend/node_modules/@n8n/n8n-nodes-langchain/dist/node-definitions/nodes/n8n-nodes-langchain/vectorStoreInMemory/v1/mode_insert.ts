/**
 * Simple Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


/** Insert documents into vector store */
export type LcVectorStoreInMemoryV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
/**
 * The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions.
 * @default vector_store_key
 */
    memoryKey?: string | Expression<string> | PlaceholderValue;
/**
 * Whether to clear the store before inserting new data
 * @default false
 */
    clearStore?: boolean | Expression<boolean>;
};

export interface LcVectorStoreInMemoryV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreInMemoryV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreInMemory';
  version: 1;
  config: NodeConfig<LcVectorStoreInMemoryV1InsertParams> & { subnodes: LcVectorStoreInMemoryV1InsertSubnodeConfig };
};