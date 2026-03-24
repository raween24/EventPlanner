/**
 * Postgres PGVector Store Node - Version 1.3
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  postgres: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStorePGVectorV13RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
/**
 * The table name to store the vectors in. If table does not exist, it will be created.
 * @default n8n_vectors
 */
    tableName?: string | Expression<string> | PlaceholderValue;
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
    /** The method to calculate the distance between two vectors
     * @default cosine
     */
    distanceStrategy?: 'cosine' | 'innerProduct' | 'euclidean' | Expression<string>;
    /** Collection of vectors
     * @default {"values":{"useCollection":false,"collectionName":"n8n","collectionTable":"n8n_vector_collections"}}
     */
    collection?: {
        /** Collection Settings
     */
    values?: {
      /** Use Collection
       * @default false
       */
      useCollection?: boolean | Expression<boolean>;
      /** Collection Name
       * @displayOptions.show { useCollection: [true] }
       * @default n8n
       */
      collectionName?: string | Expression<string> | PlaceholderValue;
      /** Collection Table Name
       * @displayOptions.show { useCollection: [true] }
       * @default n8n_vector_collections
       */
      collectionTableName?: string | Expression<string> | PlaceholderValue;
    };
  };
    /** The names of the columns in the PGVector table
     * @default {"values":{"idColumnName":"id","vectorColumnName":"embedding","contentColumnName":"text","metadataColumnName":"metadata"}}
     */
    columnNames?: {
        /** Column Name Settings
     */
    values?: {
      /** ID Column Name
       * @default id
       */
      idColumnName?: string | Expression<string> | PlaceholderValue;
      /** Vector Column Name
       * @default embedding
       */
      vectorColumnName?: string | Expression<string> | PlaceholderValue;
      /** Content Column Name
       * @default text
       */
      contentColumnName?: string | Expression<string> | PlaceholderValue;
      /** Metadata Column Name
       * @default metadata
       */
      metadataColumnName?: string | Expression<string> | PlaceholderValue;
    };
  };
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

export interface LcVectorStorePGVectorV13RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStorePGVectorV13RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePGVector';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePGVectorV13RetrieveAsToolParams> & { subnodes: LcVectorStorePGVectorV13RetrieveAsToolSubnodeConfig };
};