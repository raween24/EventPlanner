/**
 * MCP Server Trigger Node - Version 2
 * Expose n8n tools as an MCP Server endpoint
 */


export interface LcMcpTriggerV2Params {
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

export interface LcMcpTriggerV2SubnodeConfig {
  tools?: ToolInstance[];
}

export interface LcMcpTriggerV2Credentials {
  httpBearerAuth: CredentialReference;
  httpHeaderAuth: CredentialReference;
}

interface LcMcpTriggerV2NodeBase {
  type: '@n8n/n8n-nodes-langchain.mcpTrigger';
  version: 2;
  credentials?: LcMcpTriggerV2Credentials;
  isTrigger: true;
}

export type LcMcpTriggerV2ParamsNode = LcMcpTriggerV2NodeBase & {
  config: NodeConfig<LcMcpTriggerV2Params> & { subnodes?: LcMcpTriggerV2SubnodeConfig };
};

export type LcMcpTriggerV2Node = LcMcpTriggerV2ParamsNode;