/**
 * Question and Answer Chain Node - Version 1.6
 * Answer questions about retrieved documents
 */


export interface LcChainRetrievalQaV16Params {
/**
 * Source for Prompt (User Message)
 * @default auto
 */
    promptType?: 'auto' | 'guardrails' | 'define' | Expression<string>;
/**
 * Prompt (User Message)
 * @displayOptions.show { promptType: ["guardrails", "auto", "define"] }
 * @default ={{ $json.guardrailsInput }}
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

export interface LcChainRetrievalQaV16SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
  retriever: RetrieverInstance;
}

interface LcChainRetrievalQaV16NodeBase {
  type: '@n8n/n8n-nodes-langchain.chainRetrievalQa';
  version: 1.6;
}

export type LcChainRetrievalQaV16ParamsNode = LcChainRetrievalQaV16NodeBase & {
  config: NodeConfig<LcChainRetrievalQaV16Params> & { subnodes: LcChainRetrievalQaV16SubnodeConfig };
};

export type LcChainRetrievalQaV16Node = LcChainRetrievalQaV16ParamsNode;