/**
 * Anthropic Chat Model Node - Version 1.1
 * Language Model Anthropic
 */


export interface LcLmChatAnthropicV11Params {
/**
 * The model which will generate the completion. &lt;a href="https://docs.anthropic.com/claude/docs/models-overview"&gt;Learn more&lt;/a&gt;.
 * @default claude-2
 */
    model?: 'claude-3-5-sonnet-20241022' | 'claude-3-opus-20240229' | 'claude-3-5-sonnet-20240620' | 'claude-3-sonnet-20240229' | 'claude-3-5-haiku-20241022' | 'claude-3-haiku-20240307' | 'claude-2' | 'claude-2.1' | 'claude-instant-1.2' | 'claude-instant-1' | Expression<string>;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** The maximum number of tokens to generate in the completion
     * @default 4096
     */
    maxTokensToSample?: number | Expression<number>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.
     * @displayOptions.hide { thinking: [true] }
     * @default 0.7
     */
    temperature?: number | Expression<number>;
    /** Used to remove "long tail" low probability responses. Defaults to -1, which disables it.
     * @displayOptions.hide { thinking: [true] }
     * @default -1
     */
    topK?: number | Expression<number>;
    /** Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.
     * @displayOptions.hide { thinking: [true] }
     * @default 1
     */
    topP?: number | Expression<number>;
    /** Whether to enable thinking mode for the model
     * @default false
     */
    thinking?: boolean | Expression<boolean>;
    /** The maximum number of tokens to use for thinking
     * @displayOptions.show { thinking: [true] }
     * @default 1024
     */
    thinkingBudget?: number | Expression<number>;
  };
}

export interface LcLmChatAnthropicV11Credentials {
  anthropicApi: CredentialReference;
}

interface LcLmChatAnthropicV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic';
  version: 1.1;
  credentials?: LcLmChatAnthropicV11Credentials;
  isTrigger: true;
}

export type LcLmChatAnthropicV11ParamsNode = LcLmChatAnthropicV11NodeBase & {
  config: NodeConfig<LcLmChatAnthropicV11Params>;
};

export type LcLmChatAnthropicV11Node = LcLmChatAnthropicV11ParamsNode;