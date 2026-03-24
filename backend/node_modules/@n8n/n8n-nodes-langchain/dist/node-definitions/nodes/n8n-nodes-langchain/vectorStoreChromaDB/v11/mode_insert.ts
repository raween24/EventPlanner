/**
 * Chroma Vector Store Node - Version 1.1
 * Discriminator: mode=insert
 */


interface Credentials {
  chromaSelfHostedApi: CredentialReference;
  chromaCloudApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreChromaDBV11InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  authentication?: 'chromaSelfHostedApi' | 'chromaCloudApi' | Expression<string>;
  chromaCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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
    /** Whether to clear the collection before inserting new data
     * @default false
     */
    clearCollection?: boolean | Expression<boolean>;
  };
};

export interface LcVectorStoreChromaDBV11InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreChromaDBV11InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreChromaDB';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreChromaDBV11InsertParams> & { subnodes: LcVectorStoreChromaDBV11InsertSubnodeConfig };
};