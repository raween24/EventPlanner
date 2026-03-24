/**
 * Information Extractor Node - Version 1.1
 * Extract information from text in a structured format
 */


export interface LcInformationExtractorV11Params {
/**
 * The text to extract information from
 */
    text?: string | Expression<string> | PlaceholderValue;
/**
 * How to specify the schema for the desired output
 * @default fromAttributes
 */
    schemaType?: 'fromAttributes' | 'fromJson' | 'manual';
/**
 * Example JSON object to use to generate the schema
 * @displayOptions.show { schemaType: ["fromJson"] }
 */
    jsonSchemaExample?: IDataObject | string;
/**
 * Schema to use for the function
 * @hint Use &lt;a target="_blank" href="https://json-schema.org/"&gt;JSON Schema&lt;/a&gt; format (&lt;a target="_blank" href="https://json-schema.org/learn/miscellaneous-examples.html"&gt;examples&lt;/a&gt;). $refs syntax is currently not supported.
 * @displayOptions.show { schemaType: ["manual"] }
 */
    inputSchema?: IDataObject | string | Expression<string>;
/**
 * Attributes
 * @displayOptions.show { schemaType: ["fromAttributes"] }
 * @default {}
 */
    attributes?: {
        /** Attribute List
     */
    attributes?: Array<{
      /** Attribute to extract
       */
      name?: string | Expression<string> | PlaceholderValue;
      /** Data type of the attribute
       * @default string
       */
      type?: 'boolean' | 'date' | 'number' | 'string' | Expression<string>;
      /** Describe your attribute
       */
      description?: string | Expression<string> | PlaceholderValue;
      /** Whether attribute is required
       * @default false
       */
      required?: boolean | Expression<boolean>;
    }>;
  };
  options?: {
    /** String to use directly as the system prompt template
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

export interface LcInformationExtractorV11SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
}

interface LcInformationExtractorV11NodeBase {
  type: '@n8n/n8n-nodes-langchain.informationExtractor';
  version: 1.1;
}

export type LcInformationExtractorV11ParamsNode = LcInformationExtractorV11NodeBase & {
  config: NodeConfig<LcInformationExtractorV11Params> & { subnodes: LcInformationExtractorV11SubnodeConfig };
};

export type LcInformationExtractorV11Node = LcInformationExtractorV11ParamsNode;