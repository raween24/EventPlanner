/**
 * MongoDB Atlas Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  mongoDb: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreMongoDBAtlasV1InsertParams = {
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

export interface LcVectorStoreMongoDBAtlasV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreMongoDBAtlasV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMongoDBAtlas';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMongoDBAtlasV1InsertParams> & { subnodes: LcVectorStoreMongoDBAtlasV1InsertSubnodeConfig };
};