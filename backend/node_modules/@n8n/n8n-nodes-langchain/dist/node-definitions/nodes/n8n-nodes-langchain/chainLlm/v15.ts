/**
 * Basic LLM Chain Node - Version 1.5
 * A simple chain to prompt a large language model
 */


export interface LcChainLlmV15Params {
/**
 * Source for Prompt (User Message)
 * @default auto
 */
    promptType?: 'auto' | 'guardrails' | 'define' | Expression<string>;
/**
 * Prompt (User Message)
 * @displayOptions.show { promptType: ["guardrails"] }
 * @default ={{ $json.guardrailsInput }}
 */
    text?: string | Expression<string> | PlaceholderValue;
/**
 * Require Specific Output Format
 * @default false
 */
    hasOutputParser?: boolean;
/**
 * Enable Fallback Model
 * @default false
 */
    needsFallback?: boolean;
  messages?: {
        /** Prompt
     */
    messageValues?: Array<{
      /** Type Name or ID
       * @default SystemMessagePromptTemplate
       */
      type?: 'AIMessagePromptTemplate' | 'SystemMessagePromptTemplate' | 'HumanMessagePromptTemplate' | Expression<string>;
      /** Message Type
       * @displayOptions.show { type: ["HumanMessagePromptTemplate"] }
       * @default text
       */
      messageType?: 'text' | 'imageBinary' | 'imageUrl' | Expression<string>;
      /** The name of the field in the chain's input that contains the binary image file to be processed
       * @displayOptions.show { messageType: ["imageBinary"] }
       * @default data
       */
      binaryImageDataKey?: string | Expression<string> | PlaceholderValue;
      /** URL to the image to be processed
       * @displayOptions.show { messageType: ["imageUrl"] }
       */
      imageUrl?: string | Expression<string> | PlaceholderValue;
      /** Control how the model processes the image and generates its textual understanding
       * @displayOptions.show { type: ["HumanMessagePromptTemplate"], messageType: ["imageBinary", "imageUrl"] }
       * @default auto
       */
      imageDetail?: 'auto' | 'low' | 'high' | Expression<string>;
      /** Message
       * @displayOptions.hide { messageType: ["imageBinary", "imageUrl"] }
       */
      message?: string | Expression<string> | PlaceholderValue;
    }>;
  };
}

export interface LcChainLlmV15SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
  /**
   * @displayOptions.show { hasOutputParser: [true] }
   */
  outputParser?: OutputParserInstance;
}

interface LcChainLlmV15NodeBase {
  type: '@n8n/n8n-nodes-langchain.chainLlm';
  version: 1.5;
}

export type LcChainLlmV15ParamsNode = LcChainLlmV15NodeBase & {
  config: NodeConfig<LcChainLlmV15Params> & { subnodes: LcChainLlmV15SubnodeConfig };
};

export type LcChainLlmV15Node = LcChainLlmV15ParamsNode;