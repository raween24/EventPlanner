/**
 * Supabase Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve
 */


interface Credentials {
  supabaseApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreSupabaseV13RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  tableName?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Name of the query to use for matching documents
     * @default match_documents
     */
    queryName?: string | Expression<string> | PlaceholderValue;
    /** Metadata to filter the document by
     * @default {}
     */
    metadata?: {
        /** Fields to Set
     */
    metadataValues?: Array<{
      /** Name
       */
      name?: string | Expression<string> | PlaceholderValue;
      /** Value
       */
      value?: string | Expression<string> | PlaceholderValue;
    }>;
  };
  };
};

export interface LcVectorStoreSupabaseV13RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreSupabaseV13RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreSupabaseV13RetrieveParams> & { subnodes: LcVectorStoreSupabaseV13RetrieveSubnodeConfig };
};