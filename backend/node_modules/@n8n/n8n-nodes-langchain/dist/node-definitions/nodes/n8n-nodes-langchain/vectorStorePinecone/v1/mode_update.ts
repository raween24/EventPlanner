/**
 * Pinecone Vector Store Node - Version 1
 * Discriminator: mode=update
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStorePineconeV1UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStorePineconeV1UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStorePineconeV1UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV1UpdateParams> & { subnodes: LcVectorStorePineconeV1UpdateSubnodeConfig };
};