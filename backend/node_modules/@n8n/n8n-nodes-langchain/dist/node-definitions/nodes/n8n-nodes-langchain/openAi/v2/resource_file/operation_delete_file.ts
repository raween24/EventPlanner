/**
 * OpenAI Node - Version 2
 * Discriminator: resource=file, operation=deleteFile
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Delete a file from the server */
export type LcOpenAiV2FileDeleteFileParams = {
  resource: 'file';
  operation: 'deleteFile';
/**
 * File
 * @default {"mode":"list","value":""}
 */
    fileId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
};

export interface LcOpenAiV2FileDeleteFileSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV2FileDeleteFileNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 2;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV2FileDeleteFileParams> & { subnodes?: LcOpenAiV2FileDeleteFileSubnodeConfig };
};