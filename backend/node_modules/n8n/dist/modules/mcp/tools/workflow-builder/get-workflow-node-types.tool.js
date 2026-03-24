"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetWorkflowNodeTypesTool = void 0;
const zod_1 = __importDefault(require("zod"));
const mcp_constants_1 = require("../../mcp.constants");
const constants_1 = require("./constants");
const nodeIdWithDiscriminators = zod_1.default.object({
    nodeId: zod_1.default.string().describe('The node type ID (e.g. "n8n-nodes-base.gmail")'),
    version: zod_1.default.string().optional().describe('Specific version (e.g. "2.1")'),
    resource: zod_1.default.string().optional().describe('Resource discriminator (e.g. "message")'),
    operation: zod_1.default.string().optional().describe('Operation discriminator (e.g. "send")'),
    mode: zod_1.default.string().optional().describe('Mode discriminator'),
});
const inputSchema = {
    nodeIds: zod_1.default
        .array(zod_1.default.union([zod_1.default.string(), nodeIdWithDiscriminators]))
        .min(1)
        .describe('Node IDs to get type definitions for. Use plain strings for simple nodes, or objects with discriminators from search results.'),
};
const outputSchema = {
    definitions: zod_1.default.string().describe('TypeScript type definitions for the requested nodes'),
};
const createGetWorkflowNodeTypesTool = (user, workflowBuilderToolsService, telemetry) => ({
    name: constants_1.CODE_BUILDER_GET_NODE_TYPES_TOOL.toolName,
    config: {
        description: 'Get TypeScript type definitions for n8n nodes. Returns exact parameter names and structures. MUST be called before writing workflow code — guessing parameter names creates invalid workflows. Include discriminators (resource/operation/mode) from search results.',
        inputSchema,
        outputSchema,
        annotations: {
            title: constants_1.CODE_BUILDER_GET_NODE_TYPES_TOOL.displayTitle,
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    },
    handler: async ({ nodeIds }) => {
        const telemetryPayload = {
            user_id: user.id,
            tool_name: constants_1.CODE_BUILDER_GET_NODE_TYPES_TOOL.toolName,
            parameters: { nodeIdCount: nodeIds.length },
        };
        try {
            const { createCodeBuilderGetTool } = await Promise.resolve().then(() => __importStar(require('@n8n/ai-workflow-builder')));
            const nodeDefinitionDirs = workflowBuilderToolsService.getNodeDefinitionDirs();
            const getTool = createCodeBuilderGetTool({ nodeDefinitionDirs });
            const result = await getTool.invoke({ nodeIds });
            telemetryPayload.results = { success: true, data: { nodeIdCount: nodeIds.length } };
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            return {
                content: [{ type: 'text', text: result }],
                structuredContent: { definitions: result },
            };
        }
        catch (error) {
            telemetryPayload.results = {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            throw error;
        }
    },
});
exports.createGetWorkflowNodeTypesTool = createGetWorkflowNodeTypesTool;
//# sourceMappingURL=get-workflow-node-types.tool.js.map