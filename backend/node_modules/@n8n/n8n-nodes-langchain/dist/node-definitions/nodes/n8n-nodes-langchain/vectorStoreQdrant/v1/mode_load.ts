/**
 * Qdrant Vector Store Node - Version 1
 * Discriminator: mode=load
 */


interface Credentials {
  qdrantApi: CredentialReference;
}

/** Get many ranked documents from vector store for query */
export type LcVectorStoreQdrantV1LoadParams = {
  mode: 'load';
  ragStarterCallout?: unknown;
  qdrantCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Filter pageContent or metadata using this &lt;a href="https://qdrant.tech/documentation/concepts/filtering/" target="_blank"&gt;filtering syntax&lt;/a&gt;
     */
    searchFilterJson?: IDataObject | string | Expression<string>;
    /** The key to use for the content payload in Qdrant. Default is "content".
     * @default content
     */
    contentPayloadKey?: string | Expression<string> | PlaceholderValue;
    /** The key to use for the metadata payload in Qdrant. Default is "metadata".
     * @default metadata
     */
    metadataPayloadKey?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcVectorStoreQdrantV1LoadSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreQdrantV1LoadNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreQdrant';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreQdrantV1LoadParams> & { subnodes: LcVectorStoreQdrantV1LoadSubnodeConfig };
};