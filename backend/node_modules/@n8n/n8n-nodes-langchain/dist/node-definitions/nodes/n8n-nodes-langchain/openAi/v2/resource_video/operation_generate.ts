/**
 * OpenAI Node - Version 2
 * Discriminator: resource=video, operation=generate
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Creates audio from a text prompt */
export type LcOpenAiV2VideoGenerateParams = {
  resource: 'video';
  operation: 'generate';
/**
 * Model
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * The prompt to generate a video from
 * @default A video of a cat playing with a ball
 */
    prompt?: string | Expression<string> | PlaceholderValue;
/**
 * Clip duration in seconds
 * @default 4
 */
    seconds?: number | Expression<number>;
/**
 * Output resolution formatted as width x height. 1024x1792 and 1792x1024 are only supported by Sora 2 Pro.
 * @default 1280x720
 */
    size?: '720x1280' | '1280x720' | '1024x1792' | '1792x1024' | Expression<string>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Optional image reference that guides generation
     * @default data
     */
    binaryPropertyNameReference?: string | Expression<string> | PlaceholderValue;
    /** Time to wait for the video to be generated in seconds
     * @default 300
     */
    waitTime?: number | Expression<number>;
    /** Output Field Name
     * @hint The name of the output field to put the binary file data in
     * @default data
     */
    fileName?: string | Expression<string> | PlaceholderValue;
  };
};

export interface LcOpenAiV2VideoGenerateSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV2VideoGenerateNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 2;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV2VideoGenerateParams> & { subnodes?: LcOpenAiV2VideoGenerateSubnodeConfig };
};