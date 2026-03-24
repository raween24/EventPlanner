/**
 * OpenAI Node - Version 1.7
 * Discriminator: resource=assistant, operation=list
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** List assistants in the organization */
export type LcOpenAiV17AssistantListParams = {
  resource: 'assistant';
  operation: 'list';
/**
 * Whether to return a simplified version of the response instead of the raw data
 * @default true
 */
    simplify?: boolean | Expression<boolean>;
};

export interface LcOpenAiV17AssistantListSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV17AssistantListNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.7;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV17AssistantListParams> & { subnodes?: LcOpenAiV17AssistantListSubnodeConfig };
};