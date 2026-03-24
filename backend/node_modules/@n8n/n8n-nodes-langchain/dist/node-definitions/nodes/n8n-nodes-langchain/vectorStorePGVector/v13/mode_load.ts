/**
 * Postgres PGVector Store Node - Version 1.3
 * Discriminator: mode=load
 */


interface Credentials {
  postgres: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStorePGVectorV13LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
/**
 * The table name to store the vectors in. If table does not exist, it will be created.
 * @default n8n_vectors
 */
    tableName?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStorePGVectorV13LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStorePGVectorV13LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePGVector';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePGVectorV13LoadParams> & { subnodes: LcVectorStorePGVectorV13LoadSubnodeConfig };
};