/**
 * Google Gemini Node - Version 1.1
 * Discriminator: resource=video, operation=generate
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Creates an image from a text prompt */
export type LcGoogleGeminiV11VideoGenerateParams = {
  resource: 'video';
  operation: 'generate';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * A text description of the desired video
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Whether to return the video as a binary file or a URL that can be used to download the video later
 * @default video
 */
    returnAs?: 'video' | 'url' | Expression<string>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** How many videos to generate
     * @default 1
     */
    sampleCount?: number | Expression<number>;
    /** Length of the generated video in seconds. Supported only by certain models.
     * @default 8
     */
    durationSeconds?: number | Expression<number>;
    /** Aspect Ratio
     * @default 16:9
     */
    aspectRatio?: '16:9' | '9:16' | Expression<string>;
    /** Person Generation
     * @default dont_allow
     */
    personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all' | Expression<string>;
    /** Put Output in Field
     * @hint The name of the output field to put the binary file data in
     * @default data
     */
    binaryPropertyOutput?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcGoogleGeminiV11VideoGenerateSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV11VideoGenerateNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV11VideoGenerateParams> & { subnodes?: LcGoogleGeminiV11VideoGenerateSubnodeConfig };
};