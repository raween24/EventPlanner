/**
 * Postgres PGVector Store Node - Version 1.3
 * Discriminator: mode=insert
 */


interface Credentials {
  postgres: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStorePGVectorV13InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
/**
 * The table name to store the vectors in. If table does not exist, it will be created.
 * @default n8n_vectors
 */
    tableName?: string | Expression<string> | PlaceholderValue;
/**
 * Number of documents to embed in a single batch
 * @default 200
 */
    embeddingBatchSize?: number | Expression<number>;
/**
 * Options
 * @default {}
 */
    options?: {
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
  };
};

export interface LcVectorStorePGVectorV13InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStorePGVectorV13InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePGVector';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePGVectorV13InsertParams> & { subnodes: LcVectorStorePGVectorV13InsertSubnodeConfig };
};