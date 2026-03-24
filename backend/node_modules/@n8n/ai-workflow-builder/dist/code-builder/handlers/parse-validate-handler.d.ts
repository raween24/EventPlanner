import type { Logger } from '@n8n/backend-common';
import type { WorkflowJSON } from '@n8n/workflow-sdk';
import type { ParseAndValidateResult, ValidationWarning } from '../types';
export interface ParseValidateHandlerConfig {
    logger?: Logger;
    generatePinData?: boolean;
}
export declare class ParseValidateHandler {
    private logger?;
    private generatePinData;
    constructor(config?: ParseValidateHandlerConfig);
    private collectValidationIssues;
    validateExistingWorkflow(json: WorkflowJSON): ValidationWarning[];
    parseAndValidate(code: string, currentWorkflow?: WorkflowJSON): Promise<ParseAndValidateResult>;
    getErrorContext(code: string, errorMessage: string): string;
    private detectFixHint;
}
