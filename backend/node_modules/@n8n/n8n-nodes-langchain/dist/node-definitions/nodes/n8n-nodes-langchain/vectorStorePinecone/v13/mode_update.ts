/**
 * Pinecone Vector Store Node - Version 1.3
 * Discriminator: mode=update
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStorePineconeV13UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStorePineconeV13UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStorePineconeV13UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV13UpdateParams> & { subnodes: LcVectorStorePineconeV13UpdateSubnodeConfig };
};