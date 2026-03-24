/**
 * Anthropic Chat Model Node - Version 1.3
 * Language Model Anthropic
 */


export interface LcLmChatAnthropicV13Params {
/**
 * The model. Choose from the list, or specify an ID. &lt;a href="https://docs.anthropic.com/claude/docs/models-overview"&gt;Learn more&lt;/a&gt;.
 * @default {"mode":"list","value":"claude-sonnet-4-5-20250929","cachedResultName":"Claude Sonnet 4.5"}
 */
    model?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
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

export interface LcLmChatAnthropicV13Credentials {
  anthropicApi: CredentialReference;
}

interface LcLmChatAnthropicV13NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic';
  version: 1.3;
  credentials?: LcLmChatAnthropicV13Credentials;
  isTrigger: true;
}

export type LcLmChatAnthropicV13ParamsNode = LcLmChatAnthropicV13NodeBase & {
  config: NodeConfig<LcLmChatAnthropicV13Params>;
};

export type LcLmChatAnthropicV13Node = LcLmChatAnthropicV13ParamsNode;