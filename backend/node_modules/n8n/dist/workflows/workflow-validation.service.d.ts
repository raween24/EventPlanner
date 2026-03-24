import { CredentialsRepository, WorkflowRepository } from '@n8n/db';
import type { INode, INodes, IConnections, IWorkflowSettings } from 'n8n-workflow';
import type { NodeTypes } from '../node-types';
export interface WorkflowValidationResult {
    isValid: boolean;
    error?: string;
}
export interface SubWorkflowValidationResult extends WorkflowValidationResult {
    invalidReferences?: Array<{
        nodeName: string;
        workflowId: string;
        workflowName?: string;
    }>;
}
export interface WorkflowStatus {
    exists: boolean;
    isPublished: boolean;
    name?: string;
}
export declare class WorkflowValidationService {
    private readonly workflowRepository;
    private readonly credentialsRepository;
    constructor(workflowRepository: WorkflowRepository, credentialsRepository: CredentialsRepository);
    private validateNodeConfiguration;
    private validateNodeParameters;
    validateForActivation(nodes: INodes, connections: IConnections, nodeTypes: NodeTypes): WorkflowValidationResult;
    validateDynamicCredentials(nodes: INode[], nodeTypes: NodeTypes, workflowSettings?: IWorkflowSettings): Promise<WorkflowValidationResult>;
    validateSubWorkflowReferences(workflowId: string, nodes: INode[]): Promise<SubWorkflowValidationResult>;
    private getWorkflowStatus;
    private hasValueProperty;
    private extractWorkflowId;
    private shouldSkipSubWorkflowValidation;
}
