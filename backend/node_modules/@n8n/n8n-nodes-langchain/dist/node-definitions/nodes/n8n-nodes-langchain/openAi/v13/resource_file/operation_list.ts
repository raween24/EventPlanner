/**
 * OpenAI Node - Version 1.3
 * Discriminator: resource=file, operation=list
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** List assistants in the organization */
export type LcOpenAiV13FileListParams = {
  resource: 'file';
  operation: 'list';
/**
 * Options
 * @default {}
 */
    options?: {
    /** Only return files with the given purpose
     * @default any
     */
    purpose?: 'any' | 'assistants' | 'fine-tune' | Expression<string>;
  };
};

export interface LcOpenAiV13FileListSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV13FileListNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV13FileListParams> & { subnodes?: LcOpenAiV13FileListSubnodeConfig };
};