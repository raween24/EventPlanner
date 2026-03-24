/**
 * OpenAI Node - Version 1.4
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV14FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV14FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV14FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.4;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV14FileDeleteFileParams> & { subnodes?: LcOpenAiV14FileDeleteFileSubnodeConfig };
};