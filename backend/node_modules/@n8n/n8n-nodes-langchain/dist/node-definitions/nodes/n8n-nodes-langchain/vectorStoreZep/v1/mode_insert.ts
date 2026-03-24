/**
 * Zep Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  zepApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreZepV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  collectionName?: string | Expression<string> | PlaceholderValue;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Whether to allow using characters from the Unicode surrogate blocks
     * @default 1536
     */
    embeddingDimensions?: number | Expression<number>;
    /** Whether to automatically embed documents when they are added
     * @default true
     */
    isAutoEmbedded?: boolean | Expression<boolean>;
  };
};

export interface LcVectorStoreZepV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreZepV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreZep';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreZepV1InsertParams> & { subnodes: LcVectorStoreZepV1InsertSubnodeConfig };
};