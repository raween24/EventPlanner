/**
 * Google Gemini Node - Version 1
 * Discriminator: resource=video, operation=analyze
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Take in audio and answer questions about it */
export type LcGoogleGeminiV1VideoAnalyzeParams = {
  resource: 'video';
  operation: 'analyze';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Text Input
 * @default What's in this video?
 */
    text?: string | Expression<string> | PlaceholderValue;
/**
 * Input Type
 * @default url
 */
    inputType?: 'url' | 'binary' | Expression<string>;
/**
 * URL(s) of the video(s) to analyze, multiple URLs can be added separated by comma
 * @displayOptions.show { inputType: ["url"] }
 */
    videoUrls?: string | Expression<string> | PlaceholderValue;
/**
 * Name of the binary field(s) which contains the video(s), seperate multiple field names with commas
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
    /** Fewer tokens will result in shorter, less detailed video description
     * @default 300
     */
    maxOutputTokens?: number | Expression<number>;
  };
};

export interface LcGoogleGeminiV1VideoAnalyzeSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV1VideoAnalyzeNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV1VideoAnalyzeParams> & { subnodes?: LcGoogleGeminiV1VideoAnalyzeSubnodeConfig };
};