/**
 * MCP Client Node - Version 1
 * Standalone MCP Client
 */


export interface LcMcpClientV1Params {
/**
 * The transport used by your endpoint
 * @default httpStreamable
 */
    serverTransport?: 'httpStreamable' | 'sse' | Expression<string>;
/**
 * The URL of the MCP server to connect to
 */
    endpointUrl?: string | Expression<string> | PlaceholderValue;
/**
 * The way to authenticate with your endpoint
 * @default none
 */
    authentication?: 'bearerAuth' | 'headerAuth' | 'mcpOAuth2Api' | 'multipleHeadersAuth' | 'none' | Expression<string>;
/**
 * The tool to use
 * @default {"mode":"list","value":""}
 */
    tool?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
  inputMode?: 'manual' | 'json';
/**
 * Parameters
 * @displayOptions.show { inputMode: ["manual"] }
 * @default {"mappingMode":"defineBelow","value":null}
 */
    parameters?: string;
/**
 * JSON
 * @displayOptions.show { inputMode: ["json"] }
 */
    jsonInput?: IDataObject | string | Expression<string>;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** Whether to convert images and audio to binary data. If false, images and audio will be returned as base64 encoded strings.
     * @default true
     */
    convertToBinary?: boolean | Expression<boolean>;
    /** Time in ms to wait for tool calls to finish
     * @default 60000
     */
    timeout?: number | Expression<number>;
  };
}

export interface LcMcpClientV1Credentials {
  httpBearerAuth: CredentialReference;
  httpHeaderAuth: CredentialReference;
  mcpOAuth2Api: CredentialReference;
  httpMultipleHeadersAuth: CredentialReference;
}

interface LcMcpClientV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.mcpClient';
  version: 1;
  credentials?: LcMcpClientV1Credentials;
}

export type LcMcpClientV1ParamsNode = LcMcpClientV1NodeBase & {
  config: NodeConfig<LcMcpClientV1Params>;
};

export type LcMcpClientV1Node = LcMcpClientV1ParamsNode;