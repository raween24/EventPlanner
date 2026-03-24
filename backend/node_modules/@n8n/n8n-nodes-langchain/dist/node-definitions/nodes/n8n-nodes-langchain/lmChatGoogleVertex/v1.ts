/**
 * Google Vertex Chat Model Node - Version 1
 * Chat Model Google Vertex
 */


export interface LcLmChatGoogleVertexV1Params {
/**
 * Select or enter your Google Cloud project ID
 * @default {"mode":"list","value":""}
 */
    projectId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * The model which will generate the completion. &lt;a href="https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models"&gt;Learn more&lt;/a&gt;.
 * @default gemini-2.5-flash
 */
    modelName?: string | Expression<string> | PlaceholderValue;
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** The maximum number of tokens to generate in the completion
     * @default 2048
     */
    maxOutputTokens?: number | Expression<number>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.
     * @default 0.4
     */
    temperature?: number | Expression<number>;
    /** Used to remove "long tail" low probability responses. Defaults to -1, which disables it.
     * @default 32
     */
    topK?: number | Expression<number>;
    /** Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.
     * @default 1
     */
    topP?: number | Expression<number>;
    /** Safety Settings
     * @default {"values":{"category":"HARM_CATEGORY_HARASSMENT","threshold":"HARM_BLOCK_THRESHOLD_UNSPECIFIED"}}
     */
    safetySettings?: {
        /** Values
     */
    values?: Array<{
      /** The category of harmful content to block
       * @default HARM_CATEGORY_UNSPECIFIED
       */
      category?: 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 'HARM_CATEGORY_DANGEROUS_CONTENT' | Expression<string>;
      /** The threshold of harmful content to block
       * @default HARM_BLOCK_THRESHOLD_UNSPECIFIED
       */
      threshold?: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_NONE' | Expression<string>;
    }>;
  };
    /** Controls reasoning tokens for thinking models. Set to 0 to disable automatic thinking. Set to -1 for dynamic thinking (default).
     * @default -1
     */
    thinkingBudget?: number | Expression<number>;
  };
}

export interface LcLmChatGoogleVertexV1Credentials {
  googleApi: CredentialReference;
}

interface LcLmChatGoogleVertexV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatGoogleVertex';
  version: 1;
  credentials?: LcLmChatGoogleVertexV1Credentials;
  isTrigger: true;
}

export type LcLmChatGoogleVertexV1ParamsNode = LcLmChatGoogleVertexV1NodeBase & {
  config: NodeConfig<LcLmChatGoogleVertexV1Params>;
};

export type LcLmChatGoogleVertexV1Node = LcLmChatGoogleVertexV1ParamsNode;