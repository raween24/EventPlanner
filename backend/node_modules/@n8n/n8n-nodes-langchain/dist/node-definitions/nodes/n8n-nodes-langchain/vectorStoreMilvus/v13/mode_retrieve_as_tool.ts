/**
 * Milvus Vector Store Node - Version 1.3
 * Discriminator: mode=retrieve-as-tool
 */


interface Credentials {
  milvusApi: CredentialReference;
}

/** Retrieve documents from vector store to be used as tool with AI nodes */
export type LcVectorStoreMilvusV13RetrieveAsToolParams = {
  mode: 'retrieve-as-tool';
  ragStarterCallout?: unknown;
/**
 * Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often
 */
    toolDescription?: string | Expression<string> | PlaceholderValue;
  milvusCollection?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Number of top results to fetch from vector store
 * @default 4
 */
    topK?: number | Expression<number>;
/**
 * Whether or not to include document metadata
 * @default true
 */
    includeDocumentMetadata?: boolean | Expression<boolean>;
/**
 * Whether or not to rerank results
 * @default false
 */
    useReranker?: boolean | Expression<boolean>;
};

export interface LcVectorStoreMilvusV13RetrieveAsToolSubnodeConfig {
  embedding: EmbeddingInstance | EmbeddingInstance[];
  /**
   * @displayOptions.show { useReranker: [true] }
   */
  reranker: RerankerInstance;
}

export type LcVectorStoreMilvusV13RetrieveAsToolNode = {
  type: '@n8n/n8n-nodes-langchain.vectorStoreMilvus';
  version: 1.3;
  credentials?: Credentials;
  config: NodeConfig<LcVectorStoreMilvusV13RetrieveAsToolParams> & { subnodes: LcVectorStoreMilvusV13RetrieveAsToolSubnodeConfig };
};