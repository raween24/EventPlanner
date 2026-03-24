/**
 * Groq Chat Model Node - Version 1
 * Language Model Groq
 */


export interface LcLmChatGroqV1Params {
/**
 * The model which will generate the completion. &lt;a href="https://console.groq.com/docs/models"&gt;Learn more&lt;/a&gt;.
 * @default llama3-8b-8192
 */
    model?: string | Expression<string>;
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
     * @default 0.7
     */
    temperature?: number | Expression<number>;
  };
}

export interface LcLmChatGroqV1Credentials {
  groqApi: CredentialReference;
}

interface LcLmChatGroqV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatGroq';
  version: 1;
  credentials?: LcLmChatGroqV1Credentials;
  isTrigger: true;
}

export type LcLmChatGroqV1ParamsNode = LcLmChatGroqV1NodeBase & {
  config: NodeConfig<LcLmChatGroqV1Params>;
};

export type LcLmChatGroqV1Node = LcLmChatGroqV1ParamsNode;