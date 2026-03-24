/**
 * Chat Trigger Node - Version 1.3
 * Runs the workflow when an n8n generated webchat is submitted
 */


export interface LcChatTriggerV13Params {
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
 * The icon of the agent on n8n Chat
 * @displayOptions.show { availableInChat: [true] }
 * @default {"type":"icon","value":"bot"}
 */
    agentIcon?: unknown;
/**
 * The name of the agent on n8n Chat. Name of the workflow is used if left empty.
 * @displayOptions.show { availableInChat: [true] }
 */
    agentName?: string;
/**
 * The description of the agent on n8n Chat
 * @displayOptions.show { availableInChat: [true] }
 */
    agentDescription?: string;
/**
 * Suggested prompts shown to users in n8n Chat Hub to start a conversation with the agent
 * @displayOptions.show { availableInChat: [true] }
 * @default {}
 */
    suggestedPrompts?: {
        /** Prompts
     */
    prompts?: Array<{
      /** Icon
       * @default {"type":"icon","value":"comment"}
       */
      icon?: unknown;
      /** Prompt Text
       */
      text?: string;
    }>;
  };
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
    /** When and how to respond to the chat
     * @displayOptions.show { /availableInChat: [false] }
     * @default lastNode
     */
    responseMode?: 'lastNode' | 'responseNodes' | 'streaming' | Expression<string>;
    /** When and how to respond to the chat
     * @displayOptions.show { /availableInChat: [true] }
     * @default streaming
     */
    responseMode?: 'streaming' | 'lastNode' | 'responseNodes' | Expression<string>;
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
  };
}

export interface LcChatTriggerV13SubnodeConfig {
  /**
   * @displayOptions.show { options.loadPreviousSession: ["memory"] }
   */
  memory: MemoryInstance;
}

export interface LcChatTriggerV13Credentials {
  httpBasicAuth: CredentialReference;
}

interface LcChatTriggerV13NodeBase {
  type: '@n8n/n8n-nodes-langchain.chatTrigger';
  version: 1.3;
  credentials?: LcChatTriggerV13Credentials;
}

export type LcChatTriggerV13ParamsNode = LcChatTriggerV13NodeBase & {
  config: NodeConfig<LcChatTriggerV13Params> & { subnodes: LcChatTriggerV13SubnodeConfig };
};

export type LcChatTriggerV13Node = LcChatTriggerV13ParamsNode;