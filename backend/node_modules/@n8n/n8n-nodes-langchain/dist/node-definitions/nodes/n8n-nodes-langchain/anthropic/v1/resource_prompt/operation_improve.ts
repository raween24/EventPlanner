/**
 * Anthropic Node - Version 1
 * Discriminator: resource=prompt, operation=improve
 */


interface Credentials {
  anthropicApi: CredentialReference;
}

/** Improve a prompt for a model */
export type LcAnthropicV1PromptImproveParams = {
  resource: 'prompt';
  operation: 'improve';
/**
 * Messages that constitute the prompt to be improved
 * @default {"values":[{"content":"","role":"user"}]}
 */
    messages?: {
        /** Values
     */
    values?: Array<{
      /** The content of the message to be sent
       */
      content?: string | Expression<string> | PlaceholderValue;
      /** Role in shaping the model's response, it tells the model how it should behave and interact with the user
       * @default user
       */
      role?: 'user' | 'assistant' | Expression<string>;
    }>;
  };
/**
 * Whether to return a simplified version of the response instead of the raw data
 * @default true
 */
    simplify?: boolean | Expression<boolean>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** The existing system prompt to incorporate, if any
     */
    system?: string | Expression<string> | PlaceholderValue;
    /** Feedback for improving the prompt
     */
    feedback?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcAnthropicV1PromptImproveSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcAnthropicV1PromptImproveNode = {
  type: '@n8n/n8n-nodes-langchain.anthropic';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcAnthropicV1PromptImproveParams> & { subnodes?: LcAnthropicV1PromptImproveSubnodeConfig };
};