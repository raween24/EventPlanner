/**
 * OpenAI Chat Model Node - Version 1.1
 * For advanced usage with an AI chain
 */


export interface LcLmChatOpenAiV11Params {
/**
 * The model which will generate the completion. &lt;a href="https://beta.openai.com/docs/models/overview"&gt;Learn more&lt;/a&gt;.
 * @builderHint Always default to latest mini model gpt-5-mini
 * @default gpt-5-mini
 */
    model?: string | Expression<string>;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** Override the default base URL for the API
     * @default https://api.openai.com/v1
     */
    baseURL?: string | Expression<string> | PlaceholderValue;
    /** Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim
     * @default 0
     */
    frequencyPenalty?: number | Expression<number>;
    /** The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 32,768).
     * @default -1
     */
    maxTokens?: number | Expression<number>;
    /** Response Format
     * @default text
     */
    responseFormat?: 'text' | 'json_object' | Expression<string>;
    /** Response Format
     * @displayOptions.show { /responsesApiEnabled: [false] }
     * @default text
     */
    responseFormat?: 'text' | 'json_object' | Expression<string>;
    /** Response Format
     * @displayOptions.show { /responsesApiEnabled: [true] }
     * @default {"textOptions":[{"type":"text"}]}
     */
    textFormat?: {
        /** Text
     */
    textOptions?: {
      /** Type
       */
      type?: 'text' | 'json_schema' | 'json_object' | Expression<string>;
      /** Verbosity
       * @default medium
       */
      verbosity?: 'low' | 'medium' | 'high' | Expression<string>;
      /** The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
       * @displayOptions.show { type: ["json_schema"] }
       * @default my_schema
       */
      name?: string | Expression<string> | PlaceholderValue;
      /** The schema of the response format
       * @displayOptions.show { type: ["json_schema"] }
       */
      schema?: IDataObject | string | Expression<string>;
      /** The description of the response format
       * @displayOptions.show { type: ["json_schema"] }
       */
      description?: string | Expression<string> | PlaceholderValue;
      /** Whether to require that the AI will always generate responses that match the provided JSON Schema
       * @displayOptions.show { type: ["json_schema"] }
       * @default false
       */
      strict?: boolean | Expression<boolean>;
    };
  };
    /** Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics
     * @default 0
     */
    presencePenalty?: number | Expression<number>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.
     * @default 0.7
     */
    temperature?: number | Expression<number>;
    /** Controls the amount of reasoning tokens to use. A value of "low" will favor speed and economical token usage, "high" will favor more complete reasoning at the cost of more tokens generated and slower responses.
     * @displayOptions.show { /model: [{"_cnd":{"regex":"(^o1([-\\d]+)?$)|(^o[3-9].*)|(^gpt-5.*)"}}] }
     * @default medium
     */
    reasoningEffort?: 'low' | 'medium' | 'high' | Expression<string>;
    /** Maximum amount of time a request is allowed to take in milliseconds
     * @default 60000
     */
    timeout?: number | Expression<number>;
    /** Maximum number of retries to attempt
     * @default 2
     */
    maxRetries?: number | Expression<number>;
    /** Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.
     * @default 1
     */
    topP?: number | Expression<number>;
    /** The conversation that this response belongs to. Input items and output items from this response are automatically added to this conversation after this response completes.
     * @displayOptions.show { /responsesApiEnabled: [true] }
     */
    conversationId?: string | Expression<string> | PlaceholderValue;
    /** Used by OpenAI to cache responses for similar requests to optimize your cache hit rates
     * @displayOptions.show { /responsesApiEnabled: [true] }
     */
    promptCacheKey?: string | Expression<string> | PlaceholderValue;
    /** A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user.
     * @displayOptions.show { /responsesApiEnabled: [true] }
     */
    safetyIdentifier?: string | Expression<string> | PlaceholderValue;
    /** The service tier to use for the request
     * @displayOptions.show { /responsesApiEnabled: [true] }
     * @default auto
     */
    serviceTier?: 'auto' | 'flex' | 'default' | 'priority' | Expression<string>;
    /** Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard. Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.
     * @displayOptions.show { /responsesApiEnabled: [true] }
     * @default {}
     */
    metadata?: IDataObject | string | Expression<string>;
    /** An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability
     * @displayOptions.show { /responsesApiEnabled: [true] }
     * @default 0
     */
    topLogprobs?: number | Expression<number>;
    /** Configure the reusable prompt template configured via OpenAI Dashboard. &lt;a href="https://platform.openai.com/docs/guides/prompt-engineering#reusable-prompts"&gt;Learn more&lt;/a&gt;.
     * @displayOptions.show { /responsesApiEnabled: [true] }
     * @default {"promptOptions":[{"promptId":""}]}
     */
    promptConfig?: {
        /** Prompt
     */
    promptOptions?: {
      /** The unique identifier of the prompt template to use
       */
      promptId?: string | Expression<string> | PlaceholderValue;
      /** Optional version of the prompt template
       */
      version?: string | Expression<string> | PlaceholderValue;
      /** Variables to be substituted into the prompt template
       * @default {}
       */
      variables?: IDataObject | string | Expression<string>;
    };
  };
  };
}

export interface LcLmChatOpenAiV11Credentials {
  openAiApi: CredentialReference;
}

interface LcLmChatOpenAiV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatOpenAi';
  version: 1.1;
  credentials?: LcLmChatOpenAiV11Credentials;
  isTrigger: true;
}

export type LcLmChatOpenAiV11ParamsNode = LcLmChatOpenAiV11NodeBase & {
  config: NodeConfig<LcLmChatOpenAiV11Params>;
};

export type LcLmChatOpenAiV11Node = LcLmChatOpenAiV11ParamsNode;