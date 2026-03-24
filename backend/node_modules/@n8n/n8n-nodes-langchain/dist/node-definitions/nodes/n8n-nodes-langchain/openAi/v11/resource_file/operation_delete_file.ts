/**
 * OpenAI Node - Version 1.1
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV11FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV11FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV11FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV11FileDeleteFileParams> & { subnodes?: LcOpenAiV11FileDeleteFileSubnodeConfig };
};