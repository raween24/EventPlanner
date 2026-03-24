/**
 * Zep Vector Store Node - Version 1.3
 * Discriminator: mode=insert
 */


interface Credentials {
  zepApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreZepV13InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  collectionName?: string | Expression<string> | PlaceholderValue;
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

export interface LcVectorStoreZepV13InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreZepV13InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreZep';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreZepV13InsertParams> & { subnodes: LcVectorStoreZepV13InsertSubnodeConfig };
};