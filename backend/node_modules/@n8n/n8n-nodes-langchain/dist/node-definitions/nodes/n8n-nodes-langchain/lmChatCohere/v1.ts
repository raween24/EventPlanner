/**
 * Cohere Chat Model Node - Version 1
 * For advanced usage with an AI chain
 */


export interface LcLmChatCohereV1Params {
/**
 * The model which will generate the completion. &lt;a href="https://docs.cohere.com/docs/models"&gt;Learn more&lt;/a&gt;.
 * @default command-a-03-2025
 */
    model?: string | Expression<string>;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.
     * @default 0.7
     */
    temperature?: number | Expression<number>;
    /** Maximum number of retries to attempt
     * @default 2
     */
    maxRetries?: number | Expression<number>;
  };
}

export interface LcLmChatCohereV1Credentials {
  cohereApi: CredentialReference;
}

interface LcLmChatCohereV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatCohere';
  version: 1;
  credentials?: LcLmChatCohereV1Credentials;
  isTrigger: true;
}

export type LcLmChatCohereV1ParamsNode = LcLmChatCohereV1NodeBase & {
  config: NodeConfig<LcLmChatCohereV1Params>;
};

export type LcLmChatCohereV1Node = LcLmChatCohereV1ParamsNode;