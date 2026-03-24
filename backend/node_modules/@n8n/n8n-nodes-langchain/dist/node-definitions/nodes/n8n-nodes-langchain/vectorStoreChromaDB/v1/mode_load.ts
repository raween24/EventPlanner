/**
 * Chroma Vector Store Node - Version 1
 * Discriminator: mode=load
 */


interface Credentials {
  chromaSelfHostedApi: CredentialReference;
  chromaCloudApi: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStoreChromaDBV1LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
  authentication?: 'chromaSelfHostedApi' | 'chromaCloudApi' | Expression<string>;
  chromaCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreChromaDBV1LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreChromaDBV1LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreChromaDB';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreChromaDBV1LoadParams> & { subnodes: LcVectorStoreChromaDBV1LoadSubnodeConfig };
};