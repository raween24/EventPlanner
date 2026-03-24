/**
 * Google Gemini Node - Version 1.1
 * Discriminator: resource=document, operation=analyze
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Take in audio and answer questions about it */
export type LcGoogleGeminiV11DocumentAnalyzeParams = {
  resource: 'document';
  operation: 'analyze';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Text Input
 * @default What's in this document?
 */
    text?: string | Expression<string> | PlaceholderValue;
/**
 * Input Type
 * @default url
 */
    inputType?: 'url' | 'binary' | Expression<string>;
/**
 * URL(s) of the document(s) to analyze, multiple URLs can be added separated by comma
 * @displayOptions.show { inputType: ["url"] }
 */
    documentUrls?: string | Expression<string> | PlaceholderValue;
/**
 * Name of the binary field(s) which contains the document(s), seperate multiple field names with commas
 * @hint The name of the input field containing the binary file data to be processed
 * @displayOptions.show { inputType: ["binary"] }
 * @default data
 */
    binaryPropertyName?: string | Expression<string> | PlaceholderValue;
/**
 * Whether to simplify the response or not
 * @default true
 */
    simplify?: boolean | Expression<boolean>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Fewer tokens will result in shorter, less detailed document description
     * @default 300
     */
    maxOutputTokens?: number | Expression<number>;
  };
};

export interface LcGoogleGeminiV11DocumentAnalyzeSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV11DocumentAnalyzeNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV11DocumentAnalyzeParams> & { subnodes?: LcGoogleGeminiV11DocumentAnalyzeSubnodeConfig };
};