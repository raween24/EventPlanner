import type { User } from '@n8n/db';
import z from 'zod';
import type { ToolDefinition } from '../../mcp.types';
import type { Telemetry } from '../../../../telemetry';
declare const inputSchema: {
    section: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
};
export declare const createGetWorkflowSdkReferenceTool: (user: User, telemetry: Telemetry) => ToolDefinition<typeof inputSchema>;
export {};
