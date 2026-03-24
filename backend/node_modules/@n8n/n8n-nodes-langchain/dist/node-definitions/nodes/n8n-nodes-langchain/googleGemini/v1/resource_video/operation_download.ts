/**
 * Google Gemini Node - Version 1
 * Discriminator: resource=video, operation=download
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Download a generated video from the Google Gemini API using a URL */
export type LcGoogleGeminiV1VideoDownloadParams = {
  resource: 'video';
  operation: 'download';
/**
 * The URL from Google Gemini API to download the video from
 */
    url?: string | Expression<string> | PlaceholderValue;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Put Output in Field
     * @hint The name of the output field to put the binary file data in
     * @default data
     */
    binaryPropertyOutput?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcGoogleGeminiV1VideoDownloadSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV1VideoDownloadNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1;
  credentials?: Credentials;
  config: NodeConfig<LcGoogleGeminiV1VideoDownloadParams> & { subnodes?: LcGoogleGeminiV1VideoDownloadSubnodeConfig };
};