/**
 * OpenAI Node - Version 1.8
 * Discriminator: resource=assistant, operation=message
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Send messages to an assistant */
export type LcOpenAiV18AssistantMessageParams = {
  resource: 'assistant';
  operation: 'message';
/**
 * Assistant to respond to the message. You can add, modify or remove assistants in the &lt;a href="https://platform.openai.com/playground?mode=assistant" target="_blank"&gt;playground&lt;/a&gt;.
 * @default {"mode":"list","value":""}
 */
    assistantId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Source for Prompt (User Message)
 * @default auto
 */
    prompt?: 'auto' | 'guardrails' | 'define' | Expression<string>;
/**
 * Prompt (User Message)
 * @displayOptions.show { prompt: ["define"] }
 */
    text?: string | Expression<string> | PlaceholderValue;
/**
 * Memory
 * @default connector
 */
    memory?: 'connector' | 'threadId' | Expression<string>;
/**
 * The ID of the thread to continue, a new thread will be created if not specified
 * @hint If the thread ID is empty or undefined a new thread will be created and included in the response
 * @displayOptions.show { memory: ["threadId"] }
 */
    threadId?: string | Expression<string> | PlaceholderValue;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** Override the default base URL for the API
     * @default https://api.openai.com/v1
     */
    baseURL?: string | Expression<string> | PlaceholderValue;
    /** Maximum number of retries to attempt
     * @default 2
     */
    maxRetries?: number | Expression<number>;
    /** Maximum amount of time a request is allowed to take in milliseconds
     * @default 10000
     */
    timeout?: number | Expression<number>;
    /** Whether to preserve the original tools of the assistant after the execution of this node, otherwise the tools will be replaced with the connected tools, if any, default is true
     * @default true
     */
    preserveOriginalTools?: boolean | Expression<boolean>;
  };
};

export interface LcOpenAiV18AssistantMessageSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV18AssistantMessageNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.8;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV18AssistantMessageParams> & { subnodes?: LcOpenAiV18AssistantMessageSubnodeConfig };
};