/**
 * Supabase Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  supabaseApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreSupabaseV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  tableName?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreSupabaseV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreSupabaseV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreSupabaseV1InsertParams> & { subnodes: LcVectorStoreSupabaseV1InsertSubnodeConfig };
};