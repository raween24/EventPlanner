/**
 * MongoDB Atlas Vector Store Node - Version 1.1
 * Discriminator: mode=retrieve
 */


interface Credentials {
  mongoDb: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreMongoDBAtlasV11RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  mongoCollection?: { __rl: true; mode: 'list' | 'name'; value: string; cachedResultName?: string };
/**
 * The field with the embedding array
 * @default embedding
 */
    embedding?: string | Expression<string> | PlaceholderValue;
/**
 * The text field of the raw data
 * @default text
 */
    metadata_field?: string | Expression<string> | PlaceholderValue;
/**
 * The name of the vector index
 */
    vectorIndexName?: string | Expression<string> | PlaceholderValue;
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
    /** Logical partition for documents. Uses metadata.namespace field for filtering.
     */
    namespace?: string | Expression<string> | PlaceholderValue;
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
    /** MongoDB Atlas Vector Search pre-filter
     * @hint This is a filter applied in the $vectorSearch stage &lt;a href="https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/#atlas-vector-search-pre-filter"&gt;here&lt;/a&gt;
     */
    preFilter?: IDataObject | string | Expression<string>;
    /** MongoDB aggregation pipeline in JSON format
     * @hint Learn more about aggregation pipeline &lt;a href="https://docs.mongodb.com/manual/core/aggregation-pipeline/"&gt;here&lt;/a&gt;
     */
    postFilterPipeline?: IDataObject | string | Expression<string>;
  };
};

export interface LcVectorStoreMongoDBAtlasV11RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreMongoDBAtlasV11RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMongoDBAtlas';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMongoDBAtlasV11RetrieveParams> & { subnodes: LcVectorStoreMongoDBAtlasV11RetrieveSubnodeConfig };
};