"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNodeValidator = void 0;
const validation_helpers_1 = require("../../validation-helpers");
const types_1 = require("../types");
exports.setNodeValidator = {
    id: 'core:set-node',
    name: 'Set Node Validator',
    nodeTypes: ['n8n-nodes-base.set'],
    priority: 40,
    validateNode(node, graphNode, ctx) {
        const issues = [];
        const params = node.config?.parameters;
        if (!params) {
            return issues;
        }
        const mapKey = (0, types_1.findMapKey)(graphNode, ctx);
        const originalName = node.name;
        const renamed = (0, types_1.isAutoRenamed)(mapKey, originalName);
        const displayName = renamed ? mapKey : originalName;
        const origForWarning = renamed ? originalName : undefined;
        const nodeRef = (0, types_1.formatNodeRef)(displayName, origForWarning, node.type);
        const assignments = params.assignments;
        if (!assignments?.assignments) {
            return issues;
        }
        for (const assignment of assignments.assignments) {
            if (assignment.name && (0, validation_helpers_1.isCredentialFieldName)(assignment.name)) {
                issues.push({
                    code: 'SET_CREDENTIAL_FIELD',
                    message: `${nodeRef} has a field named "${assignment.name}" which appears to be storing credentials. Use n8n's credential system instead.`,
                    severity: 'warning',
                    nodeName: displayName,
                    originalName: origForWarning,
                });
            }
        }
        return issues;
    },
};
//# sourceMappingURL=set-node-validator.js.map