/**
 * Google Gemini Node - Version 1
 * Discriminator: resource=image, operation=generate
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Creates an image from a text prompt */
export type LcGoogleGeminiV1ImageGenerateParams = {
  resource: 'image';
  operation: 'generate';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * A text description of the desired image(s)
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Number of images to generate. Not supported by Gemini models, supported by Imagen models.
     * @default 1
     */
    sampleCount?: number | Expression<number>;
    /** Put Output in Field
     * @hint The name of the output field to put the binary file data in
     * @default data
     */
    binaryPropertyOutput?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcGoogleGeminiV1ImageGenerateSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV1ImageGenerateNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV1ImageGenerateParams> & { subnodes?: LcGoogleGeminiV1ImageGenerateSubnodeConfig };
};