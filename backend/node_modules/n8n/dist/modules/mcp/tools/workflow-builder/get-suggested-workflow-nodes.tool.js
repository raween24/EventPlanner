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
exports.createGetSuggestedWorkflowNodesTool = void 0;
const zod_1 = __importDefault(require("zod"));
const mcp_constants_1 = require("../../mcp.constants");
const constants_1 = require("./constants");
const inputSchema = {
    categories: zod_1.default
        .array(zod_1.default.string())
        .min(1)
        .describe('Workflow technique categories. Available: chatbot, notification, scheduling, data_transformation, data_persistence, data_extraction, document_processing, form_input, content_generation, triage, scraping_and_research'),
};
const outputSchema = {
    suggestions: zod_1.default
        .string()
        .describe('Curated node recommendations with pattern hints and configuration guidance'),
};
const createGetSuggestedWorkflowNodesTool = (user, workflowBuilderToolsService, telemetry) => ({
    name: constants_1.CODE_BUILDER_GET_SUGGESTED_NODES_TOOL.toolName,
    config: {
        description: 'Get curated node recommendations for workflow technique categories. Returns recommended nodes with pattern hints and configuration guidance. Use after analyzing what kind of workflow to build.',
        inputSchema,
        outputSchema,
        annotations: {
            title: constants_1.CODE_BUILDER_GET_SUGGESTED_NODES_TOOL.displayTitle,
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    },
    handler: async ({ categories }) => {
        const telemetryPayload = {
            user_id: user.id,
            tool_name: constants_1.CODE_BUILDER_GET_SUGGESTED_NODES_TOOL.toolName,
            parameters: { categories },
        };
        try {
            const { createGetSuggestedNodesTool } = await Promise.resolve().then(() => __importStar(require('@n8n/ai-workflow-builder')));
            const nodeTypeParser = workflowBuilderToolsService.getNodeTypeParser();
            const suggestTool = createGetSuggestedNodesTool(nodeTypeParser);
            const result = await suggestTool.invoke({ categories });
            telemetryPayload.results = {
                success: true,
                data: { categoryCount: categories.length },
            };
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            return {
                content: [{ type: 'text', text: result }],
                structuredContent: { suggestions: result },
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
exports.createGetSuggestedWorkflowNodesTool = createGetSuggestedWorkflowNodesTool;
//# sourceMappingURL=get-suggested-workflow-nodes.tool.js.map