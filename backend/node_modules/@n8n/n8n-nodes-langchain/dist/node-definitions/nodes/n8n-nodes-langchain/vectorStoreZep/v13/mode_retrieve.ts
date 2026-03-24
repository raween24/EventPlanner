/**
 * Zep Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve
 */


interface Credentials {
  zepApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreZepV13RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  collectionName?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreZepV13RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreZepV13RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreZep';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreZepV13RetrieveParams> & { subnodes: LcVectorStoreZepV13RetrieveSubnodeConfig };
};