/**
 * MongoDB Atlas Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  mongoDb: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreMongoDBAtlasV13RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreMongoDBAtlasV13RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreMongoDBAtlasV13RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMongoDBAtlas';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMongoDBAtlasV13RetrieveAsToolParams> & { subnodes: LcVectorStoreMongoDBAtlasV13RetrieveAsToolSubnodeConfig };
};