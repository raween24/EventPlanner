/**
 * Supabase Vector Store Node - Version 1.1
 * Discriminator: mode=insert
 */


interface Credentials {
  supabaseApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreSupabaseV11InsertParams = {
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

export interface LcVectorStoreSupabaseV11InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreSupabaseV11InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreSupabaseV11InsertParams> & { subnodes: LcVectorStoreSupabaseV11InsertSubnodeConfig };
};