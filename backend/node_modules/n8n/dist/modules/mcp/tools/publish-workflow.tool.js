"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublishWorkflowTool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const zod_1 = __importDefault(require("zod"));
const mcp_constants_1 = require("../mcp.constants");
const mcp_errors_1 = require("../mcp.errors");
const workflow_validation_utils_1 = require("./workflow-validation.utils");
const inputSchema = zod_1.default.object({
    workflowId: zod_1.default.string().describe('The ID of the workflow to publish'),
    versionId: zod_1.default
        .string()
        .optional()
        .describe('Optional version ID to publish. If not provided, publishes the current draft version.'),
});
const outputSchema = {
    success: zod_1.default.boolean(),
    workflowId: zod_1.default.string(),
    activeVersionId: zod_1.default.string().nullable(),
    error: zod_1.default.string().optional(),
};
const createPublishWorkflowTool = (user, workflowFinderService, workflowService, telemetry) => ({
    name: 'publish_workflow',
    config: {
        description: 'Publish (activate) a workflow to make it available for production execution. This creates an active version from the current draft.',
        inputSchema: inputSchema.shape,
        outputSchema,
        annotations: {
            title: 'Publish Workflow',
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    },
    handler: async ({ workflowId, versionId }) => {
        const telemetryPayload = {
            user_id: user.id,
            tool_name: 'publish_workflow',
            parameters: { workflowId, versionId },
        };
        try {
            await (0, workflow_validation_utils_1.getMcpWorkflow)(workflowId, user, ['workflow:publish'], workflowFinderService);
            const activatedWorkflow = await workflowService.activateWorkflow(user, workflowId, {
                versionId,
            });
            const output = {
                success: true,
                workflowId: activatedWorkflow.id,
                activeVersionId: activatedWorkflow.activeVersionId,
            };
            telemetryPayload.results = {
                success: true,
                data: {
                    workflow_id: workflowId,
                    active_version_id: activatedWorkflow.activeVersionId,
                },
            };
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            return {
                content: [{ type: 'text', text: (0, n8n_workflow_1.jsonStringify)(output) }],
                structuredContent: output,
            };
        }
        catch (er) {
            const error = (0, n8n_workflow_1.ensureError)(er);
            const isAccessError = error instanceof mcp_errors_1.WorkflowAccessError;
            const output = {
                success: false,
                workflowId,
                activeVersionId: null,
                error: error.message,
            };
            telemetryPayload.results = {
                success: false,
                error: error.message,
                error_reason: isAccessError ? error.reason : undefined,
            };
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            return {
                content: [{ type: 'text', text: (0, n8n_workflow_1.jsonStringify)(output) }],
                structuredContent: output,
            };
        }
    },
});
exports.createPublishWorkflowTool = createPublishWorkflowTool;
//# sourceMappingURL=publish-workflow.tool.js.map