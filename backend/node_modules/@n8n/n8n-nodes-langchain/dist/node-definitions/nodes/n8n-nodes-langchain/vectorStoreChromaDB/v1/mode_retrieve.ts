/**
 * Chroma Vector Store Node - Version 1
 * Discriminator: mode=retrieve
 */


interface Credentials {
  chromaSelfHostedApi: CredentialReference;
  chromaCloudApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreChromaDBV1RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  authentication?: 'chromaSelfHostedApi' | 'chromaCloudApi' | Expression<string>;
  chromaCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreChromaDBV1RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreChromaDBV1RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreChromaDB';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreChromaDBV1RetrieveParams> & { subnodes: LcVectorStoreChromaDBV1RetrieveSubnodeConfig };
};