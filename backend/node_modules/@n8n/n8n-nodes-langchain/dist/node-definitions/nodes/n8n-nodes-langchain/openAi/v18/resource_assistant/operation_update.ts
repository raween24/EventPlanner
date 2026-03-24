/**
 * OpenAI Node - Version 1.8
 * Discriminator: resource=assistant, operation=update
 */


interface Credentials {
  openAiApi: CredentialReference;
}

/** Update an existing assistant */
export type LcOpenAiV18AssistantUpdateParams = {
  resource: 'assistant';
  operation: 'update';
/**
 * Assistant to respond to the message. You can add, modify or remove assistants in the &lt;a href="https://platform.openai.com/playground?mode=assistant" target="_blank"&gt;playground&lt;/a&gt;.
 * @default {"mode":"list","value":""}
 */
    assistantId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Options
 * @default {}
 */
    options?: {
    /** Whether to enable the code interpreter that allows the assistants to write and run Python code in a sandboxed execution environment, find more &lt;a href="https://platform.openai.com/docs/assistants/tools/code-interpreter" target="_blank"&gt;here&lt;/a&gt;
     * @default false
     */
    codeInterpreter?: boolean | Expression<boolean>;
    /** The description of the assistant. The maximum length is 512 characters.
     */
    description?: string | Expression<string> | PlaceholderValue;
    /** The files to be used by the assistant, there can be a maximum of 20 files attached to the assistant. You can use expression to pass file IDs as an array or comma-separated string.
     * @hint Add more files by using the 'Upload a File' operation, any existing files not selected here will be removed.
     * @default []
     */
    file_ids?: string[];
    /** The system instructions that the assistant uses. The maximum length is 32768 characters.
     */
    instructions?: string | Expression<string> | PlaceholderValue;
    /** Whether to augments the assistant with knowledge from outside its model, such as proprietary product information or documents, find more &lt;a href="https://platform.openai.com/docs/assistants/tools/knowledge-retrieval" target="_blank"&gt;here&lt;/a&gt;
     * @default false
     */
    knowledgeRetrieval?: boolean | Expression<boolean>;
    /** Model
     * @default {"mode":"list","value":""}
     */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
    /** The name of the assistant. The maximum length is 256 characters.
     */
    name?: string | Expression<string> | PlaceholderValue;
    /** Whether to remove all custom tools (functions) from the assistant
     * @default false
     */
    removeCustomTools?: boolean | Expression<boolean>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive. We generally recommend altering this or temperature but not both.
     * @default 1
     */
    temperature?: number | Expression<number>;
    /** An alternative to sampling with temperature, controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.
     * @default 1
     */
    topP?: number | Expression<number>;
  };
};

export interface LcOpenAiV18AssistantUpdateSubnodeConfig {
  tools?: ToolInstance[];
  memory?: MemoryInstance;
}

export type LcOpenAiV18AssistantUpdateNode = {
  type: '@n8n/n8n-nodes-langchain.openAi';
  version: 1.8;
  credentials?: Credentials;
  config: NodeConfig<LcOpenAiV18AssistantUpdateParams> & { subnodes?: LcOpenAiV18AssistantUpdateSubnodeConfig };
};