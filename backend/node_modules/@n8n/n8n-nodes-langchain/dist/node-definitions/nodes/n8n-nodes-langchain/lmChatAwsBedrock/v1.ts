/**
 * AWS Bedrock Chat Model Node - Version 1
 * Language Model AWS Bedrock
 */


export interface LcLmChatAwsBedrockV1Params {
/**
 * The model which will generate the completion. &lt;a href="https://docs.aws.amazon.com/bedrock/latest/userguide/foundation-models.html"&gt;Learn more&lt;/a&gt;.
 * @displayOptions.hide { modelSource: ["inferenceProfile"] }
 */
    model?: string | Expression<string>;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** The maximum number of tokens to generate in the completion
     * @default 2000
     */
    maxTokensToSample?: number | Expression<number>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.
     * @default 0.7
     */
    temperature?: number | Expression<number>;
  };
}

export interface LcLmChatAwsBedrockV1Credentials {
  aws: CredentialReference;
}

interface LcLmChatAwsBedrockV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatAwsBedrock';
  version: 1;
  credentials?: LcLmChatAwsBedrockV1Credentials;
  isTrigger: true;
}

export type LcLmChatAwsBedrockV1ParamsNode = LcLmChatAwsBedrockV1NodeBase & {
  config: NodeConfig<LcLmChatAwsBedrockV1Params>;
};

export type LcLmChatAwsBedrockV1Node = LcLmChatAwsBedrockV1ParamsNode;