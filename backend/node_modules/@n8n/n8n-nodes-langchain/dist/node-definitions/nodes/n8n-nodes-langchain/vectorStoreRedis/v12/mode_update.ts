/**
 * Redis Vector Store Node - Version 1.2
 * Discriminator: mode=update
 */


interface Credentials {
  redis: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStoreRedisV12UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStoreRedisV12UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStoreRedisV12UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1.2;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV12UpdateParams> & { subnodes: LcVectorStoreRedisV12UpdateSubnodeConfig };
};