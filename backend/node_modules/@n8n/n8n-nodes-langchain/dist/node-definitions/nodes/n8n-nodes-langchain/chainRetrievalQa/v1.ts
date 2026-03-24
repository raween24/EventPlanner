/**
 * Question and Answer Chain Node - Version 1
 * Answer questions about retrieved documents
 */


export interface LcChainRetrievalQaV1Params {
/**
 * Query
 * @default ={{ $json.input }}
 */
    query?: string | Expression<string> | PlaceholderValue;
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

export interface LcChainRetrievalQaV1SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
  retriever: RetrieverInstance;
}

interface LcChainRetrievalQaV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.chainRetrievalQa';
  version: 1;
}

export type LcChainRetrievalQaV1ParamsNode = LcChainRetrievalQaV1NodeBase & {
  config: NodeConfig<LcChainRetrievalQaV1Params> & { subnodes: LcChainRetrievalQaV1SubnodeConfig };
};

export type LcChainRetrievalQaV1Node = LcChainRetrievalQaV1ParamsNode;