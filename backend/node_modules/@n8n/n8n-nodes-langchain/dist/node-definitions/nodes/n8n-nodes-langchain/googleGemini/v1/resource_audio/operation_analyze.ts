/**
 * Google Gemini Node - Version 1
 * Discriminator: resource=audio, operation=analyze
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Take in audio and answer questions about it */
export type LcGoogleGeminiV1AudioAnalyzeParams = {
  resource: 'audio';
  operation: 'analyze';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Text Input
 * @default What's in this audio?
 */
    text?: string | Expression<string> | PlaceholderValue;
/**
 * Input Type
 * @default url
 */
    inputType?: 'url' | 'binary' | Expression<string>;
/**
 * URL(s) of the audio(s) to analyze, multiple URLs can be added separated by comma
 * @displayOptions.show { inputType: ["url"] }
 */
    audioUrls?: string | Expression<string> | PlaceholderValue;
/**
 * Name of the binary field(s) which contains the audio(s), seperate multiple field names with commas
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
    /** Fewer tokens will result in shorter, less detailed audio description
     * @default 300
     */
    maxOutputTokens?: number | Expression<number>;
  };
};

export interface LcGoogleGeminiV1AudioAnalyzeSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV1AudioAnalyzeNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV1AudioAnalyzeParams> & { subnodes?: LcGoogleGeminiV1AudioAnalyzeSubnodeConfig };
};