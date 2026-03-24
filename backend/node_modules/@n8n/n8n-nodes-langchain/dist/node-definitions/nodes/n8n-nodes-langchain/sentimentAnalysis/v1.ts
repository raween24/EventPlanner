/**
 * Sentiment Analysis Node - Version 1
 * Analyze the sentiment of your text
 */


export interface LcSentimentAnalysisV1Params {
/**
 * Use an expression to reference data in previous nodes or enter static text
 */
    inputText?: string | Expression<string> | PlaceholderValue;
  options?: {
    /** A comma-separated list of categories to analyze
     * @default Positive, Neutral, Negative
     */
    categories?: string;
    /** String to use directly as the system prompt template
     * @default You are highly intelligent and accurate sentiment analyzer. Analyze the sentiment of the provided text. Categorize it into one of the following: {categories}. Use the provided formatting instructions. Only output the JSON.
     */
    systemPromptTemplate?: string | Expression<string> | PlaceholderValue;
    /** Whether to include sentiment strength and confidence scores in the output
     * @default false
     */
    includeDetailedResults?: boolean | Expression<boolean>;
    /** Whether to enable auto-fixing (may trigger an additional LLM call if output is broken)
     * @default true
     */
    enableAutoFixing?: boolean | Expression<boolean>;
    /** Batch processing options for rate limiting
     * @default {}
     */
    batching?: {
    /** How many items to process in parallel. This is useful for rate limiting, but might impact the log output ordering.
     * @default 5
     */
    batchSize?: number | Expression<number>;
    /** Delay in milliseconds between batches. This is useful for rate limiting.
     * @default 0
     */
    delayBetweenBatches?: number | Expression<number>;
  };
  };
}

export interface LcSentimentAnalysisV1SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
}

interface LcSentimentAnalysisV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.sentimentAnalysis';
  version: 1;
}

export type LcSentimentAnalysisV1ParamsNode = LcSentimentAnalysisV1NodeBase & {
  config: NodeConfig<LcSentimentAnalysisV1Params> & { subnodes: LcSentimentAnalysisV1SubnodeConfig };
};

export type LcSentimentAnalysisV1Node = LcSentimentAnalysisV1ParamsNode;