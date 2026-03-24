/**
 * Pinecone Vector Store Node - Version 1
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStorePineconeV1RetrieveAsToolParams = {
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
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Partition the records in an index into namespaces. Queries and other operations are then limited to one namespace, so different requests can search different subsets of your index.
     */
    pineconeNamespace?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStorePineconeV1RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStorePineconeV1RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV1RetrieveAsToolParams> & { subnodes: LcVectorStorePineconeV1RetrieveAsToolSubnodeConfig };
};