/**
 * Redis Chat Memory Node - Version 1.5
 * Stores the chat history in Redis.
 */


export interface LcMemoryRedisChatV15Params {
/**
 * Session ID
 * @builderHint Use 'Connected Chat Trigger Node' (fromInput) if there is a Chat Trigger node earlier in the workflow. Otherwise use 'Define below' (customKey).
 * @default fromInput
 */
    sessionIdType?: 'fromInput' | 'customKey' | Expression<string>;
/**
 * Session Key From Previous Node
 * @displayOptions.show { sessionIdType: ["fromInput", "customKey"] }
 * @default ={{ $json.sessionId }}
 */
    sessionKey?: string | Expression<string> | PlaceholderValue;
/**
 * For how long the session should be stored in seconds. If set to 0 it will not expire.
 * @default 0
 */
    sessionTTL?: number | Expression<number>;
/**
 * Context Window Length
 * @hint How many past interactions the model receives as context
 * @default 5
 */
    contextWindowLength?: number | Expression<number>;
}

export interface LcMemoryRedisChatV15Credentials {
  redis: CredentialReference;
}

interface LcMemoryRedisChatV15NodeBase {
  type: '@n8n/n8n-nodes-langchain.memoryRedisChat';
  version: 1.5;
  credentials?: LcMemoryRedisChatV15Credentials;
  isTrigger: true;
}

export type LcMemoryRedisChatV15ParamsNode = LcMemoryRedisChatV15NodeBase & {
  config: NodeConfig<LcMemoryRedisChatV15Params>;
};

export type LcMemoryRedisChatV15Node = LcMemoryRedisChatV15ParamsNode;