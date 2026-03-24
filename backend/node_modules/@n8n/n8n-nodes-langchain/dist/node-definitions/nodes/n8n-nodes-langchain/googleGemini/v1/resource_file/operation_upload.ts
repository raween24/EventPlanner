/**
 * Google Gemini Node - Version 1
 * Discriminator: resource=file, operation=upload
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Upload a file to the Google Gemini API for later use */
export type LcGoogleGeminiV1FileUploadParams = {
  resource: 'file';
  operation: 'upload';
/**
 * Input Type
 * @default url
 */
    inputType?: 'url' | 'binary' | Expression<string>;
/**
 * URL of the file to upload
 * @displayOptions.show { inputType: ["url"] }
 */
    fileUrl?: string | Expression<string> | PlaceholderValue;
/**
 * Name of the binary property which contains the file
 * @hint The name of the input field containing the binary file data to be processed
 * @displayOptions.show { inputType: ["binary"] }
 * @default data
 */
    binaryPropertyName?: string | Expression<string> | PlaceholderValue;
};

export interface LcGoogleGeminiV1FileUploadSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV1FileUploadNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV1FileUploadParams> & { subnodes?: LcGoogleGeminiV1FileUploadSubnodeConfig };
};