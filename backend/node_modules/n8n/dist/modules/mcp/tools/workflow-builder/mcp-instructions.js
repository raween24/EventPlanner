"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMcpInstructions = getMcpInstructions;
const constants_1 = require("./constants");
function getMcpInstructions(isBuilderEnabled) {
    const INTRO = 'This is the official MCP server for n8n, a workflow automation platform.';
    const BUILDER_INSTRUCTIONS = `This MCP server provides tools to build n8n workflows programmatically using the n8n Workflow SDK.

To build n8n workflows, follow these steps in order:

1. Read the SDK reference: Call ${constants_1.MCP_GET_SDK_REFERENCE_TOOL.toolName} (or use the n8n://workflow-sdk/reference resource) to learn the SDK patterns and syntax.

2. Discover nodes: Call ${constants_1.CODE_BUILDER_SEARCH_NODES_TOOL.toolName} with queries for services you need (e.g., ["gmail", "slack", "schedule trigger"]) and utility nodes (e.g., ["set", "if", "merge", "code"]). Note the discriminators (resource/operation/mode) in the results.

3. (Optional) Get suggestions: Call ${constants_1.CODE_BUILDER_GET_SUGGESTED_NODES_TOOL.toolName} with workflow technique categories for curated recommendations.

4. Get type definitions: Call ${constants_1.CODE_BUILDER_GET_NODE_TYPES_TOOL.toolName} with ALL node IDs you plan to use, including discriminators from search results. This returns the exact TypeScript parameter definitions. DO NOT skip this — guessing parameter names creates invalid workflows.

5. Write the workflow code using the SDK patterns from the reference and the exact parameter names from the type definitions. Follow the coding guidelines and design guidance sections of the SDK reference (retrieve them with ${constants_1.MCP_GET_SDK_REFERENCE_TOOL.toolName} using sections "guidelines" and "design").

6. Validate: Call ${constants_1.CODE_BUILDER_VALIDATE_TOOL.toolName} with your full code. Fix any errors and re-validate until valid.

7. Create: Call ${constants_1.MCP_CREATE_WORKFLOW_FROM_CODE_TOOL.toolName} with the validated code to save the workflow to n8n. Include a short \`description\` (1-2 sentences) summarizing what the workflow does — this helps users find and understand their workflows.

8. Update: Call ${constants_1.MCP_UPDATE_WORKFLOW_TOOL.toolName} with the workflow ID and validated code. Follow steps 2-6 to prepare the new code, then call update instead of create.

9. Archive: Call ${constants_1.MCP_ARCHIVE_WORKFLOW_TOOL.toolName} with the workflow ID.`;
    return isBuilderEnabled ? `${INTRO}\n\n${BUILDER_INSTRUCTIONS}` : INTRO;
}
//# sourceMappingURL=mcp-instructions.js.map