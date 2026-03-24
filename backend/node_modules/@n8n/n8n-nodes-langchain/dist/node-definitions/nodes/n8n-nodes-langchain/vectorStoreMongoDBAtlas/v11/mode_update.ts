/**
 * MongoDB Atlas Vector Store Node - Version 1.1
 * Discriminator: mode=update
 */


interface Credentials {
  mongoDb: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStoreMongoDBAtlasV11UpdateParams = {
  mode: 'update';
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
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStoreMongoDBAtlasV11UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStoreMongoDBAtlasV11UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMongoDBAtlas';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMongoDBAtlasV11UpdateParams> & { subnodes: LcVectorStoreMongoDBAtlasV11UpdateSubnodeConfig };
};