/**
 * Supabase Vector Store Node - Version 1.2
 * Discriminator: mode=retrieve
 */


interface Credentials {
  supabaseApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreSupabaseV12RetrieveParams = {
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

export interface LcVectorStoreSupabaseV12RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreSupabaseV12RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreSupabaseV12RetrieveParams> & { subnodes: LcVectorStoreSupabaseV12RetrieveSubnodeConfig };
};