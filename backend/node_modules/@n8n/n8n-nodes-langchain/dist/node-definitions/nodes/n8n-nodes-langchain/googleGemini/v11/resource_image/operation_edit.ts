/**
 * Google Gemini Node - Version 1.1
 * Discriminator: resource=image, operation=edit
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Upload one or more images and apply edits based on a prompt */
export type LcGoogleGeminiV11ImageEditParams = {
  resource: 'image';
  operation: 'edit';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Instruction describing how to edit the image
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Add one or more binary fields to include images with your prompt
 * @default {"values":[{"binaryPropertyName":"data"}]}
 */
    images?: {
        /** Image
     */
    values?: Array<{
      /** The name of the binary field containing the image data
       * @default data
       */
      binaryPropertyName?: string | Expression<string> | PlaceholderValue;
    }>;
  };
/**
 * Options
 * @default {}
 */
    options?: {
    /** Put Output in Field
     * @hint The name of the output field to put the binary file data in
     * @default edited
     */
    binaryPropertyOutput?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcGoogleGeminiV11ImageEditSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV11ImageEditNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV11ImageEditParams> & { subnodes?: LcGoogleGeminiV11ImageEditSubnodeConfig };
};