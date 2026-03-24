/**
 * OpenAI Node - Version 2.1
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV21FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV21FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV21FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 2.1;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV21FileDeleteFileParams> & { subnodes?: LcOpenAiV21FileDeleteFileSubnodeConfig };
};