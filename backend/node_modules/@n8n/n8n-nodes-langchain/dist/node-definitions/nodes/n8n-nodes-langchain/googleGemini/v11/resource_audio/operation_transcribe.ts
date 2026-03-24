/**
 * Google Gemini Node - Version 1.1
 * Discriminator: resource=audio, operation=transcribe
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Transcribes audio into the text */
export type LcGoogleGeminiV11AudioTranscribeParams = {
  resource: 'audio';
  operation: 'transcribe';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Input Type
 * @default url
 */
    inputType?: 'url' | 'binary' | Expression<string>;
/**
 * URL(s) of the audio(s) to transcribe, multiple URLs can be added separated by comma
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
    /** The start time of the audio in MM:SS or HH:MM:SS format
     */
    startTime?: string | Expression<string> | PlaceholderValue;
    /** The end time of the audio in MM:SS or HH:MM:SS format
     */
    endTime?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcGoogleGeminiV11AudioTranscribeSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV11AudioTranscribeNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV11AudioTranscribeParams> & { subnodes?: LcGoogleGeminiV11AudioTranscribeSubnodeConfig };
};