/**
 * OpenAI Node - Version 1.7
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV17FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV17FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV17FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.7;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV17FileDeleteFileParams> & { subnodes?: LcOpenAiV17FileDeleteFileSubnodeConfig };
};