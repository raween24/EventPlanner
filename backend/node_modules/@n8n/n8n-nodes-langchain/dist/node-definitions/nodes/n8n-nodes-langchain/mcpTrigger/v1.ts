/**
 * MCP Server Trigger Node - Version 1
 * Expose n8n tools as an MCP Server endpoint
 */


export interface LcMcpTriggerV1Params {
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

export interface LcMcpTriggerV1SubnodeConfig {
  tools?: ToolInstance[];
}

export interface LcMcpTriggerV1Credentials {
  httpBearerAuth: CredentialReference;
  httpHeaderAuth: CredentialReference;
}

interface LcMcpTriggerV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.mcpTrigger';
  version: 1;
  credentials?: LcMcpTriggerV1Credentials;
  isTrigger: true;
}

export type LcMcpTriggerV1ParamsNode = LcMcpTriggerV1NodeBase & {
  config: NodeConfig<LcMcpTriggerV1Params> & { subnodes?: LcMcpTriggerV1SubnodeConfig };
};

export type LcMcpTriggerV1Node = LcMcpTriggerV1ParamsNode;