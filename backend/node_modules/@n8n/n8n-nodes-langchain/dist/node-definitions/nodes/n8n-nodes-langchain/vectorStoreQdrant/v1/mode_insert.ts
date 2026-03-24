/**
 * Qdrant Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  qdrantApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreQdrantV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  qdrantCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreQdrantV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreQdrantV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreQdrant';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreQdrantV1InsertParams> & { subnodes: LcVectorStoreQdrantV1InsertSubnodeConfig };
};