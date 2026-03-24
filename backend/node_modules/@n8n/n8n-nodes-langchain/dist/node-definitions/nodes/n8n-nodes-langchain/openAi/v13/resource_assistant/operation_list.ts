/**
 * OpenAI Node - Version 1.3
 * Discriminator: resource=assistant, operation=list
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** List assistants in the organization */
export type LcOpenAiV13AssistantListParams = {
  resource: 'assistant';
  operation: 'list';
/**
 * Whether to return a simplified version of the response instead of the raw data
 * @default true
 */
    simplify?: boolean | Expression<boolean>;
};

export interface LcOpenAiV13AssistantListSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV13AssistantListNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV13AssistantListParams> & { subnodes?: LcOpenAiV13AssistantListSubnodeConfig };
};