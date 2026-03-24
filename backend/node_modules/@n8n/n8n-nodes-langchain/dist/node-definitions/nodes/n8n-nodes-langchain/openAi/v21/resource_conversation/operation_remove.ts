/**
 * OpenAI Node - Version 2.1
 * Discriminator: resource=conversation, operation=remove
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Remove a conversation */
export type LcOpenAiV21ConversationRemoveParams = {
  resource: 'conversation';
  operation: 'remove';
/**
 * The ID of the conversation to delete
 */
    conversationId?: string | Expression<string> | PlaceholderValue;
};

export interface LcOpenAiV21ConversationRemoveSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV21ConversationRemoveNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 2.1;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV21ConversationRemoveParams> & { subnodes?: LcOpenAiV21ConversationRemoveSubnodeConfig };
};