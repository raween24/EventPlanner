/**
 * Mistral Cloud Chat Model Node - Version 1
 * For advanced usage with an AI chain
 */


export interface LcLmChatMistralCloudV1Params {
/**
 * The model which will generate the completion. &lt;a href="https://docs.mistral.ai/platform/endpoints/"&gt;Learn more&lt;/a&gt;.
 * @default mistral-small
 */
    model?: string | Expression<string>;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).
     * @default -1
     */
    maxTokens?: number | Expression<number>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.
     * @default 0.7
     */
    temperature?: number | Expression<number>;
    /** Maximum number of retries to attempt
     * @default 2
     */
    maxRetries?: number | Expression<number>;
    /** Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.
     * @default 1
     */
    topP?: number | Expression<number>;
    /** Whether to inject a safety prompt before all conversations
     * @default false
     */
    safeMode?: boolean | Expression<boolean>;
    /** The seed to use for random sampling. If set, different calls will generate deterministic results.
     */
    randomSeed?: number | Expression<number>;
  };
}

export interface LcLmChatMistralCloudV1Credentials {
  mistralCloudApi: CredentialReference;
}

interface LcLmChatMistralCloudV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatMistralCloud';
  version: 1;
  credentials?: LcLmChatMistralCloudV1Credentials;
  isTrigger: true;
}

export type LcLmChatMistralCloudV1ParamsNode = LcLmChatMistralCloudV1NodeBase & {
  config: NodeConfig<LcLmChatMistralCloudV1Params>;
};

export type LcLmChatMistralCloudV1Node = LcLmChatMistralCloudV1ParamsNode;