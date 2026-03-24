/**
 * Information Extractor Node - Version 1
 * Extract information from text in a structured format
 */


export interface LcInformationExtractorV1Params {
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

export interface LcInformationExtractorV1SubnodeConfig {
  model: LanguageModelInstance | LanguageModelInstance[];
}

interface LcInformationExtractorV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.informationExtractor';
  version: 1;
}

export type LcInformationExtractorV1ParamsNode = LcInformationExtractorV1NodeBase & {
  config: NodeConfig<LcInformationExtractorV1Params> & { subnodes: LcInformationExtractorV1SubnodeConfig };
};

export type LcInformationExtractorV1Node = LcInformationExtractorV1ParamsNode;