/**
 * Supabase Vector Store Node - Version 1.2
 * Discriminator: mode=update
 */


interface Credentials {
  supabaseApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStoreSupabaseV12UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  tableName?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Name of the query to use for matching documents
     * @default match_documents
     */
    queryName?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreSupabaseV12UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStoreSupabaseV12UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreSupabaseV12UpdateParams> & { subnodes: LcVectorStoreSupabaseV12UpdateSubnodeConfig };
};