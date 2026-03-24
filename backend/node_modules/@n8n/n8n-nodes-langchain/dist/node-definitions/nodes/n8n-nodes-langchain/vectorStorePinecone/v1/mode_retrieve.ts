/**
 * Pinecone Vector Store Node - Version 1
 * Discriminator: mode=retrieve
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStorePineconeV1RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStorePineconeV1RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStorePineconeV1RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV1RetrieveParams> & { subnodes: LcVectorStorePineconeV1RetrieveSubnodeConfig };
};