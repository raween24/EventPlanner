import type { User } from '@n8n/db';
import z from 'zod';
import type { ToolDefinition } from '../../mcp.types';
import type { Telemetry } from '../../../../telemetry';
import type { WorkflowBuilderToolsService } from './workflow-builder-tools.service';
declare const inputSchema: {
    queries: z.ZodArray<z.ZodString, "many">;
};
export declare const createSearchWorkflowNodesTool: (user: User, workflowBuilderToolsService: WorkflowBuilderToolsService, telemetry: Telemetry) => ToolDefinition<typeof inputSchema>;
export {};
