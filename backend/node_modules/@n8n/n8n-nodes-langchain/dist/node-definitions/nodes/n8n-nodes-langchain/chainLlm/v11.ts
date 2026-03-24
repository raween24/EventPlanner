/**
 * Basic LLM Chain Node - Version 1.1
 * A simple chain to prompt a large language model
 */


export interface LcChainLlmV11Params {
/**
 * Prompt
 * @default ={{ $json.chat_input }}
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Prompt (User Message)
 * @builderHint Use expressions to include dynamic data from previous nodes (e.g., "={{ $json.input }}"). Static text prompts ignore incoming data.
 * @displayOptions.show { promptType: ["define"] }
 */
    text?: string | Expression<string> | PlaceholderValue;
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

export interface LcChainLlmV11SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
  /**
   * @displayOptions.show { hasOutputParser: [true] }
   */
  outputParser?: OutputParserInstance;
}

interface LcChainLlmV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.chainLlm';
  version: 1.1;
}

export type LcChainLlmV11ParamsNode = LcChainLlmV11NodeBase & {
  config: NodeConfig<LcChainLlmV11Params> & { subnodes: LcChainLlmV11SubnodeConfig };
};

export type LcChainLlmV11Node = LcChainLlmV11ParamsNode;