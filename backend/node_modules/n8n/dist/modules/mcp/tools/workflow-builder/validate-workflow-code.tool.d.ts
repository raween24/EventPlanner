import type { User } from '@n8n/db';
import z from 'zod';
import type { ToolDefinition } from '../../mcp.types';
import type { Telemetry } from '../../../../telemetry';
declare const inputSchema: {
    code: z.ZodString;
};
export declare const createValidateWorkflowCodeTool: (user: User, telemetry: Telemetry) => ToolDefinition<typeof inputSchema>;
export {};
