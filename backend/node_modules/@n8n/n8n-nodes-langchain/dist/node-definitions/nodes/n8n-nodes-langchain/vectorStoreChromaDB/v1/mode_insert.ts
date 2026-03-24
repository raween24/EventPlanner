/**
 * Chroma Vector Store Node - Version 1
 * Discriminator: mode=insert
 */


interface Credentials {
  chromaSelfHostedApi: CredentialReference;
  chromaCloudApi: CredentialReference;
}

/** Insert documents into vector store */
export type LcVectorStoreChromaDBV1InsertParams = {
  mode: 'insert';
  ragStarterCallout?: unknown;
  authentication?: 'chromaSelfHostedApi' | 'chromaCloudApi' | Expression<string>;
  chromaCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcVectorStoreChromaDBV1InsertSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  documentLoader: DocumentLoaderInstance | DocumentLoaderInstance[];
}

export type LcVectorStoreChromaDBV1InsertNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreChromaDB';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreChromaDBV1InsertParams> & { subnodes: LcVectorStoreChromaDBV1InsertSubnodeConfig };
};