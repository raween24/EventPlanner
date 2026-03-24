/**
 * OpenAI Node - Version 1.3
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV13FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV13FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV13FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV13FileDeleteFileParams> & { subnodes?: LcOpenAiV13FileDeleteFileSubnodeConfig };
};