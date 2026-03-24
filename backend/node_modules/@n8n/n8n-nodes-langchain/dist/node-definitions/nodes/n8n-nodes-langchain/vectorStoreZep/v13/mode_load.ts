/**
 * Zep Vector Store Node - Version 1.3
 * Discriminator: mode=load
 */


interface Credentials {
  zepApi: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStoreZepV13LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
  collectionName?: string | Expression<string> | PlaceholderValue;
/**
 * Search prompt to retrieve matching documents from the vector store using similarity-based ranking
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Number of top results to fetch from vector store
 * @default 4
 */
    topK?: number | Expression<number>;
/**
 * Whether or not to include document metadata
 * @default true
 */
    includeDocumentMetadata?: boolean | Expression<boolean>;
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
    /** Whether to allow using characters from the Unicode surrogate blocks
     * @default 1536
     */
    embeddingDimensions?: number | Expression<number>;
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

export interface LcVectorStoreZepV13LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreZepV13LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreZep';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreZepV13LoadParams> & { subnodes: LcVectorStoreZepV13LoadSubnodeConfig };
};