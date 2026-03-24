/**
 * MongoDB Atlas Vector Store Node - Version 1.2
 * Discriminator: mode=insert
 */


interface Credentials {
  mongoDb: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreMongoDBAtlasV12InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  mongoCollection?: { __rl: true; mode: 'list' | 'name'; value: string; cachedResultName?: string };
/**
 * The field with the embedding array
 * @default embedding
 */
    embedding?: string | Expression<string> | PlaceholderValue;
/**
 * The text field of the raw data
 * @default text
 */
    metadata_field?: string | Expression<string> | PlaceholderValue;
/**
 * The name of the vector index
 */
    vectorIndexName?: string | Expression<string> | PlaceholderValue;
/**
 * Number of documents to embed in a single batch
 * @default 200
 */
    embeddingBatchSize?: number | Expression<number>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Whether to clear documents in the namespace before inserting new data
     * @default false
     */
    clearNamespace?: boolean | Expression<boolean>;
    /** Logical partition for documents. Uses metadata.namespace field for filtering.
     */
    namespace?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreMongoDBAtlasV12InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreMongoDBAtlasV12InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMongoDBAtlas';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMongoDBAtlasV12InsertParams> & { subnodes: LcVectorStoreMongoDBAtlasV12InsertSubnodeConfig };
};