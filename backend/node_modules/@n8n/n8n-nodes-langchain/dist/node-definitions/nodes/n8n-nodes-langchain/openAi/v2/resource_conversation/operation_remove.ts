/**
 * OpenAI Node - Version 2
 * Discriminator: resource=conversation, operation=remove
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Remove a conversation */
export type LcOpenAiV2ConversationRemoveParams = {
  resource: 'conversation';
  operation: 'remove';
/**
 * The ID of the conversation to delete
 */
    conversationId?: string | Expression<string> | PlaceholderValue;
};

export interface LcOpenAiV2ConversationRemoveSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV2ConversationRemoveNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 2;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV2ConversationRemoveParams> & { subnodes?: LcOpenAiV2ConversationRemoveSubnodeConfig };
};