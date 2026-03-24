/**
 * LangChain Code Node - Version 1
 * LangChain Code Node
 */


export interface LcCodeV1Params {
  code?: {
        /** Execute
     */
    execute?: {
      /** JavaScript - Execute
       * @hint This code will only run and return data if a "Main" input & output got created.
       */
      code?: string;
    };
        /** Supply Data
     */
    supplyData?: {
      /** JavaScript - Supply Data
       * @hint This code will only run and return data if an output got created which is not "Main".
       */
      code?: string;
    };
  };
/**
 * The input to add
 * @default {}
 */
    inputs?: {
        /** Input
     */
    input?: Array<{
      /** The type of the input
       */
      type?: 'ai_chain' | 'ai_document' | 'ai_embedding' | 'ai_languageModel' | 'ai_memory' | 'ai_outputParser' | 'ai_textSplitter' | 'ai_tool' | 'ai_vectorStore' | 'main';
      /** How many nodes of this type are allowed to be connected. Set it to -1 for unlimited.
       * @default -1
       */
      maxConnections?: number;
      /** Whether the input needs a connection
       * @default false
       */
      required?: boolean;
    }>;
  };
/**
 * The output to add
 * @default {}
 */
    outputs?: {
        /** Output
     */
    output?: Array<{
      /** The type of the input
       */
      type?: 'ai_chain' | 'ai_document' | 'ai_embedding' | 'ai_languageModel' | 'ai_memory' | 'ai_outputParser' | 'ai_textSplitter' | 'ai_tool' | 'ai_vectorStore' | 'main';
    }>;
  };
}

export interface LcCodeV1SubnodeConfig {
  documentLoader?: DocumentLoaderInstance | DocumentLoaderInstance[];
  embedding?: EmbeddingInstance | EmbeddingInstance[];
  model?: LanguageModelInstance | LanguageModelInstance[];
  memory?: MemoryInstance;
  outputParser?: OutputParserInstance;
  textSplitter?: TextSplitterInstance;
  tools?: ToolInstance[];
  vectorStore?: VectorStoreInstance;
}

interface LcCodeV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.code';
  version: 1;
}

export type LcCodeV1ParamsNode = LcCodeV1NodeBase & {
  config: NodeConfig<LcCodeV1Params> & { subnodes?: LcCodeV1SubnodeConfig };
};

export type LcCodeV1Node = LcCodeV1ParamsNode;