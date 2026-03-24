/**
 * Qdrant Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve
 */


interface Credentials {
  qdrantApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as vector store with AI nodes */
export type LcVectorStoreQdrantV13RetrieveParams = {
  mode: 'retrieve';
  ragStarterCallout?: unknown;
  qdrantCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreQdrantV13RetrieveSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreQdrantV13RetrieveNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreQdrant';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreQdrantV13RetrieveParams> & { subnodes: LcVectorStoreQdrantV13RetrieveSubnodeConfig };
};