/**
 * OpenAI Node - Version 1.8
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV18FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV18FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV18FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.8;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV18FileDeleteFileParams> & { subnodes?: LcOpenAiV18FileDeleteFileSubnodeConfig };
};