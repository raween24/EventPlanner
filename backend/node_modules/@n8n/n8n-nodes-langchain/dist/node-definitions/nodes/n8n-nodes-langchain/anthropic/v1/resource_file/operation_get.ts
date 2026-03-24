/**
 * Anthropic Node - Version 1
 * Discriminator: resource=file, operation=get
 */


interface Credentials {
  anthropicApi: CredentialReference;
}

/** Get metadata for a file from the Anthropic API */
export type LcAnthropicV1FileGetParams = {
  resource: 'file';
  operation: 'get';
/**
 * ID of the file to get metadata for
 */
    fileId?: string | Expression<string> | PlaceholderValue;
};

export interface LcAnthropicV1FileGetSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcAnthropicV1FileGetNode = {
  type: '@n8n/n8n-nodes-langchain.anthropic';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcAnthropicV1FileGetParams> & { subnodes?: LcAnthropicV1FileGetSubnodeConfig };
};