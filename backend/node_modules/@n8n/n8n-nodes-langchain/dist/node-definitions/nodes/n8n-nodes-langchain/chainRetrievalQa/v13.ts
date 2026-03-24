/**
 * Question and Answer Chain Node - Version 1.3
 * Answer questions about retrieved documents
 */


export interface LcChainRetrievalQaV13Params {
/**
 * Source for Prompt (User Message)
 * @default auto
 */
    promptType?: 'auto' | 'guardrails' | 'define' | Expression<string>;
/**
 * Prompt (User Message)
 * @displayOptions.show { promptType: ["define"] }
 */
    text?: string | Expression<string> | PlaceholderValue;
  options?: {
    /** Template string used for the system prompt. This should include the variable `{context}` for the provided context. For text completion models, you should also include the variable `{question}` for the user’s query.
     */
    systemPromptTemplate?: string | Expression<string> | PlaceholderValue;
    /** Template string used for the system prompt. This should include the variable `{context}` for the provided context. For text completion models, you should also include the variable `{input}` for the user’s query.
     */
    systemPromptTemplate?: string | Expression<string> | PlaceholderValue;
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

export interface LcChainRetrievalQaV13SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
  retriever: RetrieverInstance;
}

interface LcChainRetrievalQaV13NodeBase {
  type: '@n8n/n8n-nodes-langchain.chainRetrievalQa';
  version: 1.3;
}

export type LcChainRetrievalQaV13ParamsNode = LcChainRetrievalQaV13NodeBase & {
  config: NodeConfig<LcChainRetrievalQaV13Params> & { subnodes: LcChainRetrievalQaV13SubnodeConfig };
};

export type LcChainRetrievalQaV13Node = LcChainRetrievalQaV13ParamsNode;