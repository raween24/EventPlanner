/**
 * Chroma Vector Store Node - Version 1.2
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  chromaSelfHostedApi: CredentialReference;
  chromaCloudApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreChromaDBV12RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Name of the vector store
 */
    toolName?: string | Expression<string> | PlaceholderValue;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
  authentication?: 'chromaSelfHostedApi' | 'chromaCloudApi' | Expression<string>;
  chromaCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreChromaDBV12RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreChromaDBV12RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreChromaDB';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreChromaDBV12RetrieveAsToolParams> & { subnodes: LcVectorStoreChromaDBV12RetrieveAsToolSubnodeConfig };
};