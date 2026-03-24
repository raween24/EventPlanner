/**
 * MongoDB Chat Memory Node - Version 1
 * Stores the chat history in MongoDB collection.
 */


export interface LcMemoryMongoDbChatV1Params {
/**
 * Session ID
 * @builderHint Use 'Connected Chat Trigger Node' (fromInput) if there is a Chat Trigger node earlier in the workflow. Otherwise use 'Define below' (customKey).
 * @default fromInput
 */
    sessionIdType?: 'fromInput' | 'customKey' | Expression<string>;
/**
 * Session Key From Previous Node
 * @displayOptions.show { sessionIdType: ["fromInput"] }
 * @default ={{ $json.sessionId }}
 */
    sessionKey?: string | Expression<string> | PlaceholderValue;
/**
 * The collection name to store the chat history in. If collection does not exist, it will be created.
 * @default n8n_chat_histories
 */
    collectionName?: string | Expression<string> | PlaceholderValue;
/**
 * The database name to store the chat history in. If not provided, the database from credentials will be used.
 */
    databaseName?: string | Expression<string> | PlaceholderValue;
/**
 * Context Window Length
 * @hint How many past interactions the model receives as context
 * @default 5
 */
    contextWindowLength?: number | Expression<number>;
}

export interface LcMemoryMongoDbChatV1Credentials {
  mongoDb: CredentialReference;
}

interface LcMemoryMongoDbChatV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.memoryMongoDbChat';
  version: 1;
  credentials?: LcMemoryMongoDbChatV1Credentials;
  isTrigger: true;
}

export type LcMemoryMongoDbChatV1ParamsNode = LcMemoryMongoDbChatV1NodeBase & {
  config: NodeConfig<LcMemoryMongoDbChatV1Params>;
};

export type LcMemoryMongoDbChatV1Node = LcMemoryMongoDbChatV1ParamsNode;