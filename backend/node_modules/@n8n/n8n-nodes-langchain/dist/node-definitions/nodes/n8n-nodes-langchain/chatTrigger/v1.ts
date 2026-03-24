/**
 * Chat Trigger Node - Version 1
 * Runs the workflow when an n8n generated webchat is submitted
 */


export interface LcChatTriggerV1Params {
/**
 * Whether the chat should be publicly available or only accessible through the manual chat interface
 * @default false
 */
    public?: boolean | Expression<boolean>;
/**
 * Mode
 * @displayOptions.show { public: [true] }
 * @default hostedChat
 */
    mode?: 'hostedChat' | 'webhook' | Expression<string>;
/**
 * The way to authenticate
 * @displayOptions.show { public: [true] }
 * @default none
 */
    authentication?: 'basicAuth' | 'n8nUserAuth' | 'none' | Expression<string>;
/**
 * Default messages shown at the start of the chat, one per line
 * @displayOptions.show { mode: ["hostedChat"], public: [true] }
 */
    initialMessages?: string | Expression<string> | PlaceholderValue;
/**
 * Whether to make the agent available in n8n Chat Hub for n8n instance users to chat with
 * @default false
 */
    availableInChat?: boolean;
/**
 * Options
 * @displayOptions.show { public: [false] }
 * @default {}
 */
    options?: {
    /** Whether to allow file uploads in the chat
     * @default false
     */
    allowFileUploads?: boolean | Expression<boolean>;
    /** Allowed file types for upload. Comma-separated list of &lt;a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types" target="_blank"&gt;MIME types&lt;/a&gt;.
     * @default *
     */
    allowedFilesMimeTypes?: string | Expression<string> | PlaceholderValue;
    /** Comma-separated list of URLs allowed for cross-origin non-preflight requests. Use * (default) to allow all origins.
     * @displayOptions.show { /mode: ["hostedChat", "webhook"] }
     * @default *
     */
    allowedOrigins?: string | Expression<string> | PlaceholderValue;
    /** Shown as placeholder text in the chat input field
     * @displayOptions.show { /mode: ["hostedChat"] }
     * @default Type your question..
     */
    inputPlaceholder?: string | Expression<string> | PlaceholderValue;
    /** If loading messages of a previous session should be enabled
     * @builderHint Set to 'memory' to persist conversation history across sessions
     * @default notSupported
     */
    loadPreviousSession?: 'notSupported' | 'memory' | 'manually' | Expression<string>;
    /** Whether to show the welcome screen at the start of the chat
     * @displayOptions.show { /mode: ["hostedChat"] }
     * @default false
     */
    showWelcomeScreen?: boolean | Expression<boolean>;
    /** Shown as part of the welcome screen, in the middle of the chat window
     * @displayOptions.show { showWelcomeScreen: [true], /mode: ["hostedChat"] }
     * @default New Conversation
     */
    getStarted?: string | Expression<string> | PlaceholderValue;
    /** Shown at the top of the chat, under the title
     * @displayOptions.show { /mode: ["hostedChat"] }
     * @default Start a chat. We're here to help you 24/7.
     */
    subtitle?: string | Expression<string> | PlaceholderValue;
    /** Shown at the top of the chat
     * @displayOptions.show { /mode: ["hostedChat"] }
     * @default Hi there! 👋
     */
    title?: string | Expression<string> | PlaceholderValue;
    /** Override default styling of the public chat interface with CSS
     * @displayOptions.show { /mode: ["hostedChat"] }
     */
    customCss?: string | Expression<string> | PlaceholderValue;
    /** When and how to respond to the webhook
     * @default lastNode
     */
    responseMode?: 'lastNode' | 'responseNode' | Expression<string>;
  };
}

export interface LcChatTriggerV1SubnodeConfig {
  /**
   * @displayOptions.show { options.loadPreviousSession: ["memory"] }
   */
  memory: MemoryInstance;
}

export interface LcChatTriggerV1Credentials {
  httpBasicAuth: CredentialReference;
}

interface LcChatTriggerV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.chatTrigger';
  version: 1;
  credentials?: LcChatTriggerV1Credentials;
}

export type LcChatTriggerV1ParamsNode = LcChatTriggerV1NodeBase & {
  config: NodeConfig<LcChatTriggerV1Params> & { subnodes: LcChatTriggerV1SubnodeConfig };
};

export type LcChatTriggerV1Node = LcChatTriggerV1ParamsNode;