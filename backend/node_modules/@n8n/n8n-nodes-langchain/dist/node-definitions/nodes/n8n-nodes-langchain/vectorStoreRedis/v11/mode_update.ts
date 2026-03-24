/**
 * Redis Vector Store Node - Version 1.1
 * Discriminator: mode=update
 */


interface Credentials {
  redis: CredentialReference;
}

/** Update documents in vector store by ID */
export type LcVectorStoreRedisV11UpdateParams = {
  mode: 'update';
  ragStarterCallout?: unknown;
  redisIndex?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * ID of an embedding entry
 */
    id?: string | Expression<string> | PlaceholderValue;
};

export interface LcVectorStoreRedisV11UpdateSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
}

export type LcVectorStoreRedisV11UpdateNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreRedis';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreRedisV11UpdateParams> & { subnodes: LcVectorStoreRedisV11UpdateSubnodeConfig };
};