"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMcpWorkflow = getMcpWorkflow;
const mcp_errors_1 = require("../mcp.errors");
async function getMcpWorkflow(workflowId, user, scopes, workflowFinderService, options) {
    const workflow = await workflowFinderService.findWorkflowForUser(workflowId, user, scopes, {
        includeActiveVersion: options?.includeActiveVersion,
    });
    if (!workflow) {
        throw new mcp_errors_1.WorkflowAccessError("Workflow not found or you don't have permission to access it.", 'no_permission');
    }
    if (workflow.isArchived) {
        throw new mcp_errors_1.WorkflowAccessError(`Workflow '${workflowId}' is archived and cannot be accessed.`, 'workflow_archived');
    }
    if (!workflow.settings?.availableInMCP) {
        throw new mcp_errors_1.WorkflowAccessError('Workflow is not available in MCP. Enable MCP access in workflow settings.', 'not_available_in_mcp');
    }
    return workflow;
}
//# sourceMappingURL=workflow-validation.utils.js.map