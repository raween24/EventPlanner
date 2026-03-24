/**
 * Qdrant Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  qdrantApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreQdrantV13RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
  qdrantCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreQdrantV13RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreQdrantV13RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreQdrant';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreQdrantV13RetrieveAsToolParams> & { subnodes: LcVectorStoreQdrantV13RetrieveAsToolSubnodeConfig };
};