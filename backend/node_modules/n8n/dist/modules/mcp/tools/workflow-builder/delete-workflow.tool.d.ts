import type { User } from '@n8n/db';
import z from 'zod';
import type { ToolDefinition } from '../../mcp.types';
import type { Telemetry } from '../../../../telemetry';
import type { WorkflowService } from '../../../../workflows/workflow.service';
declare const inputSchema: {
    workflowId: z.ZodString;
};
export declare const createArchiveWorkflowTool: (user: User, workflowService: WorkflowService, telemetry: Telemetry) => ToolDefinition<typeof inputSchema>;
export {};
