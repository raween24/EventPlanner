"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoPopulateNodeCredentials = autoPopulateNodeCredentials;
const n8n_workflow_1 = require("n8n-workflow");
const HTTP_NODE_TYPES = new Set([
    'n8n-nodes-base.httpRequest',
    '@n8n/n8n-nodes-langchain.toolHttpRequest',
    'n8n-nodes-base.httpRequestTool',
]);
async function autoPopulateNodeCredentials(workflow, user, nodeTypes, credentialsService, projectId) {
    const usableCredentials = await credentialsService.getCredentialsAUserCanUseInAWorkflow(user, {
        projectId,
    });
    const credentialsByType = new Map();
    for (const cred of usableCredentials) {
        const list = credentialsByType.get(cred.type) ?? [];
        list.push({ id: cred.id, name: cred.name });
        credentialsByType.set(cred.type, list);
    }
    const assignments = [];
    const skippedHttpNodes = [];
    for (const node of workflow.nodes) {
        if (node.disabled)
            continue;
        if (HTTP_NODE_TYPES.has(node.type)) {
            skippedHttpNodes.push(node.name);
            continue;
        }
        let nodeTypeDescription;
        try {
            const nodeType = nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
            nodeTypeDescription = nodeType.description;
        }
        catch {
            continue;
        }
        const credentialDescriptions = nodeTypeDescription.credentials;
        if (!credentialDescriptions?.length)
            continue;
        const nodeParametersWithDefaults = n8n_workflow_1.NodeHelpers.getNodeParameters(nodeTypeDescription.properties, node.parameters, true, false, node, nodeTypeDescription) ?? node.parameters;
        for (const credDesc of credentialDescriptions) {
            const shouldDisplay = n8n_workflow_1.NodeHelpers.displayParameter(nodeParametersWithDefaults, credDesc, node, nodeTypeDescription);
            if (!shouldDisplay)
                continue;
            const existing = node.credentials?.[credDesc.name];
            if (existing?.id)
                continue;
            const candidates = credentialsByType.get(credDesc.name);
            if (!candidates?.length)
                continue;
            node.credentials = node.credentials ?? {};
            node.credentials[credDesc.name] = {
                id: candidates[0].id,
                name: candidates[0].name,
            };
            assignments.push({
                nodeName: node.name,
                credentialName: candidates[0].name,
                credentialType: credDesc.name,
            });
        }
    }
    return { assignments, skippedHttpNodes };
}
//# sourceMappingURL=credentials-auto-assign.js.map