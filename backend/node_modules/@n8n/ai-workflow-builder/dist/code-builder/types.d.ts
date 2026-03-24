import type { Callbacks } from '@langchain/core/callbacks/manager';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { Logger } from '@n8n/backend-common';
import type { WorkflowJSON } from '@n8n/workflow-sdk';
import type { IDisplayOptions, INodeTypeDescription, ITelemetryTrackProperties } from 'n8n-workflow';
export interface SubnodeRequirement {
    connectionType: string;
    required: boolean;
    displayOptions?: IDisplayOptions;
}
export interface CodeBuilderNodeSearchResult {
    name: string;
    displayName: string;
    description: string;
    version: number;
    score: number;
    inputs: INodeTypeDescription['inputs'];
    outputs: INodeTypeDescription['outputs'];
    builderHintMessage?: string;
    subnodeRequirements?: SubnodeRequirement[];
}
export interface WorkflowCodeOutput {
    workflowCode: string;
}
export interface ValidationWarning {
    code: string;
    message: string;
    nodeName?: string;
    parameterPath?: string;
}
export interface ParseAndValidateResult {
    workflow: WorkflowJSON;
    warnings: ValidationWarning[];
}
export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    thinkingTokens: number;
}
export interface CodeBuilderAgentConfig {
    llm: BaseChatModel;
    nodeTypes: INodeTypeDescription[];
    logger?: Logger;
    nodeDefinitionDirs?: string[];
    enableTextEditor?: boolean;
    onTokenUsage?: (usage: TokenUsage) => void;
    callbacks?: Callbacks;
    runMetadata?: Record<string, unknown>;
    onTelemetryEvent?: (event: string, properties: ITelemetryTrackProperties) => void;
    generatePinData?: boolean;
}
