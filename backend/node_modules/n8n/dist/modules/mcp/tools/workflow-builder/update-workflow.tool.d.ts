import { type User, type SharedWorkflowRepository } from '@n8n/db';
import z from 'zod';
import type { ToolDefinition } from '../../mcp.types';
import type { CredentialsService } from '../../../../credentials/credentials.service';
import type { NodeTypes } from '../../../../node-types';
import type { UrlService } from '../../../../services/url.service';
import type { Telemetry } from '../../../../telemetry';
import type { WorkflowFinderService } from '../../../../workflows/workflow-finder.service';
import type { WorkflowService } from '../../../../workflows/workflow.service';
declare const inputSchema: {
    workflowId: z.ZodString;
    code: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
};
export declare const createUpdateWorkflowTool: (user: User, workflowFinderService: WorkflowFinderService, workflowService: WorkflowService, urlService: UrlService, telemetry: Telemetry, nodeTypes: NodeTypes, credentialsService: CredentialsService, sharedWorkflowRepository: SharedWorkflowRepository) => ToolDefinition<typeof inputSchema>;
export {};
