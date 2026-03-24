import type { User } from '@n8n/db';
import type { IWorkflowBase } from 'n8n-workflow';
import type { CredentialsService } from '../../../../credentials/credentials.service';
import type { NodeTypes } from '../../../../node-types';
export interface CredentialAssignment {
    nodeName: string;
    credentialName: string;
    credentialType: string;
}
export interface AutoAssignResult {
    assignments: CredentialAssignment[];
    skippedHttpNodes: string[];
}
export declare function autoPopulateNodeCredentials(workflow: IWorkflowBase, user: User, nodeTypes: NodeTypes, credentialsService: CredentialsService, projectId: string): Promise<AutoAssignResult>;
