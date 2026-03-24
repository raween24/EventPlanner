import type { User } from '@n8n/db';
import type { Scope } from '@n8n/permissions';
import type { WorkflowFinderService } from '../../../workflows/workflow-finder.service';
export type FoundWorkflow = NonNullable<Awaited<ReturnType<WorkflowFinderService['findWorkflowForUser']>>>;
export type GetMcpWorkflowOptions = {
    includeActiveVersion?: boolean;
};
export declare function getMcpWorkflow(workflowId: string, user: User, scopes: Scope[], workflowFinderService: WorkflowFinderService, options?: GetMcpWorkflowOptions): Promise<FoundWorkflow>;
