/**
 * OpenAI Node - Version 1
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV1FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV1FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV1FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV1FileDeleteFileParams> & { subnodes?: LcOpenAiV1FileDeleteFileSubnodeConfig };
};