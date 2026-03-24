/**
 * MCP Server Trigger Node - Version 1.1
 * Expose n8n tools as an MCP Server endpoint
 */


export interface LcMcpTriggerV11Params {
/**
 * The way to authenticate
 * @default none
 */
    authentication?: 'none' | 'bearerAuth' | 'headerAuth' | Expression<string>;
/**
 * The base path for this MCP server
 */
    path?: string | Expression<string> | PlaceholderValue;
}

export interface LcMcpTriggerV11SubnodeConfig {
  tools?: ToolInstance[];
}

export interface LcMcpTriggerV11Credentials {
  httpBearerAuth: CredentialReference;
  httpHeaderAuth: CredentialReference;
}

interface LcMcpTriggerV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.mcpTrigger';
  version: 1.1;
  credentials?: LcMcpTriggerV11Credentials;
  isTrigger: true;
}

export type LcMcpTriggerV11ParamsNode = LcMcpTriggerV11NodeBase & {
  config: NodeConfig<LcMcpTriggerV11Params> & { subnodes?: LcMcpTriggerV11SubnodeConfig };
};

export type LcMcpTriggerV11Node = LcMcpTriggerV11ParamsNode;