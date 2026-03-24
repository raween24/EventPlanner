/**
 * OpenAI Node - Version 2
 * Discriminator: resource=conversation, operation=get
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Get a conversation */
export type LcOpenAiV2ConversationGetParams = {
  resource: 'conversation';
  operation: 'get';
/**
 * The ID of the conversation to retrieve
 */
    conversationId?: string | Expression<string> | PlaceholderValue;
};

export interface LcOpenAiV2ConversationGetSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV2ConversationGetNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 2;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV2ConversationGetParams> & { subnodes?: LcOpenAiV2ConversationGetSubnodeConfig };
};