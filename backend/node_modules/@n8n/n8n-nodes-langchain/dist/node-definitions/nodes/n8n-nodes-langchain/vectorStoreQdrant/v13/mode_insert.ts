/**
 * Qdrant Vector Store Node - Version 1.3
 * Discriminator: mode=insert
 */


interface Credentials {
  qdrantApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreQdrantV13InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  qdrantCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** JSON options for creating a collection. &lt;a href="https://qdrant.tech/documentation/concepts/collections"&gt;Learn more&lt;/a&gt;.
     */
    collectionConfig?: IDataObject | string | Expression<string>;
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

export interface LcVectorStoreQdrantV13InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreQdrantV13InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreQdrant';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreQdrantV13InsertParams> & { subnodes: LcVectorStoreQdrantV13InsertSubnodeConfig };
};