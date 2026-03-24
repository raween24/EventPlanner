/**
 * Pinecone Vector Store Node - Version 1.2
 * Discriminator: mode=update
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStorePineconeV12UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStorePineconeV12UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStorePineconeV12UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV12UpdateParams> & { subnodes: LcVectorStorePineconeV12UpdateSubnodeConfig };
};