"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetWorkflowSdkReferenceTool = void 0;
const zod_1 = __importDefault(require("zod"));
const mcp_constants_1 = require("../../mcp.constants");
const constants_1 = require("./constants");
const sdk_reference_content_1 = require("./sdk-reference-content");
const VALID_SECTIONS = [
    'patterns',
    'expressions',
    'functions',
    'rules',
    'import',
    'guidelines',
    'design',
    'all',
];
const inputSchema = {
    section: zod_1.default
        .enum(VALID_SECTIONS)
        .optional()
        .describe('Optional section to retrieve: "patterns", "expressions", "functions", "rules", "import", "guidelines", "design", or "all" (default)'),
};
const outputSchema = {
    reference: zod_1.default.string().describe('SDK reference documentation content for the requested section'),
};
const createGetWorkflowSdkReferenceTool = (user, telemetry) => ({
    name: constants_1.MCP_GET_SDK_REFERENCE_TOOL.toolName,
    config: {
        description: 'Get the n8n Workflow SDK reference documentation including patterns, expression syntax, and rules. Call this FIRST before building workflows to learn the SDK.',
        inputSchema,
        outputSchema,
        annotations: {
            title: constants_1.MCP_GET_SDK_REFERENCE_TOOL.displayTitle,
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    },
    handler: async ({ section }) => {
        const telemetryPayload = {
            user_id: user.id,
            tool_name: constants_1.MCP_GET_SDK_REFERENCE_TOOL.toolName,
            parameters: { section },
        };
        const content = (0, sdk_reference_content_1.getSdkReferenceContent)(section);
        telemetryPayload.results = { success: true };
        telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
        return {
            content: [{ type: 'text', text: content }],
            structuredContent: { reference: content },
        };
    },
});
exports.createGetWorkflowSdkReferenceTool = createGetWorkflowSdkReferenceTool;
//# sourceMappingURL=get-workflow-sdk-reference.tool.js.map