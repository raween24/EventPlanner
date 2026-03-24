/**
 * Pinecone Vector Store Node - Version 1.1
 * Discriminator: mode=update
 */


interface Credentials {
  pineconeApi: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStorePineconeV11UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  pineconeIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStorePineconeV11UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStorePineconeV11UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStorePinecone';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStorePineconeV11UpdateParams> & { subnodes: LcVectorStorePineconeV11UpdateSubnodeConfig };
};