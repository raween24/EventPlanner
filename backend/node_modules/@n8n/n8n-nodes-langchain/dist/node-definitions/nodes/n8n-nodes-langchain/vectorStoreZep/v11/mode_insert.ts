/**
 * Zep Vector Store Node - Version 1.1
 * Discriminator: mode=insert
 */


interface Credentials {
  zepApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreZepV11InsertParams = {
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

export interface LcVectorStoreZepV11InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreZepV11InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreZep';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreZepV11InsertParams> & { subnodes: LcVectorStoreZepV11InsertSubnodeConfig };
};