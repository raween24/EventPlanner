/**
 * AWS Bedrock Chat Model Node - Version 1.1
 * Language Model AWS Bedrock
 */


export interface LcLmChatAwsBedrockV11Params {
/**
 * Choose between on-demand foundation models or inference profiles
 * @default onDemand
 */
    modelSource?: 'onDemand' | 'inferenceProfile' | Expression<string>;
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

export interface LcLmChatAwsBedrockV11Credentials {
  aws: CredentialReference;
}

interface LcLmChatAwsBedrockV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatAwsBedrock';
  version: 1.1;
  credentials?: LcLmChatAwsBedrockV11Credentials;
  isTrigger: true;
}

export type LcLmChatAwsBedrockV11ParamsNode = LcLmChatAwsBedrockV11NodeBase & {
  config: NodeConfig<LcLmChatAwsBedrockV11Params>;
};

export type LcLmChatAwsBedrockV11Node = LcLmChatAwsBedrockV11ParamsNode;