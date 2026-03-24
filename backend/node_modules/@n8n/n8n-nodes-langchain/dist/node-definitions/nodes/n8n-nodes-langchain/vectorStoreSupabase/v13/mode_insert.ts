/**
 * Supabase Vector Store Node - Version 1.3
 * Discriminator: mode=insert
 */


interface Credentials {
  supabaseApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreSupabaseV13InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  tableName?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Name of the query to use for matching documents
     * @default match_documents
     */
    queryName?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreSupabaseV13InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreSupabaseV13InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreSupabaseV13InsertParams> & { subnodes: LcVectorStoreSupabaseV13InsertSubnodeConfig };
};