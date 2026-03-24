/**
 * OpenAI Node - Version 1.7
 * Discriminator: resource=file, operation=list
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** List assistants in the organization */
export type LcOpenAiV17FileListParams = {
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

export interface LcOpenAiV17FileListSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV17FileListNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.7;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV17FileListParams> & { subnodes?: LcOpenAiV17FileListSubnodeConfig };
};