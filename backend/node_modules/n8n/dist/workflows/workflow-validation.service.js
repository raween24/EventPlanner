"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowValidationService = void 0;
const db_1 = require("@n8n/db");
const di_1 = require("@n8n/di");
const typeorm_1 = require("@n8n/typeorm");
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../constants");
let WorkflowValidationService = class WorkflowValidationService {
    constructor(workflowRepository, credentialsRepository) {
        this.workflowRepository = workflowRepository;
        this.credentialsRepository = credentialsRepository;
    }
    validateNodeConfiguration(nodes, connections, nodeTypes) {
        try {
            const connectionsByDestination = (0, n8n_workflow_1.mapConnectionsByDestination)(connections);
            const issuesFound = [];
            for (const node of nodes) {
                try {
                    if (node.disabled)
                        continue;
                    const nodeType = nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
                    if (!nodeType) {
                        issuesFound.push({
                            nodeName: node.name,
                            issues: ['Node type not found'],
                        });
                        continue;
                    }
                    const isNodeTriggerLike = (0, n8n_workflow_1.isTriggerLikeNode)(nodeType);
                    const isConnected = (0, n8n_workflow_1.isNodeConnected)(node.name, connections, connectionsByDestination);
                    if (!isConnected && !isNodeTriggerLike)
                        continue;
                    const nodeIssues = [];
                    const credentialIssues = (0, n8n_workflow_1.validateNodeCredentials)(node, nodeType);
                    for (const issue of credentialIssues) {
                        if (issue.type === 'missing') {
                            nodeIssues.push(`Missing required credential: ${issue.displayName}`);
                        }
                        else if (issue.type === 'not-configured') {
                            nodeIssues.push(`Credential not configured: ${issue.displayName}`);
                        }
                    }
                    const parameterIssues = this.validateNodeParameters(node, nodeType);
                    nodeIssues.push(...parameterIssues);
                    if (nodeIssues.length > 0) {
                        issuesFound.push({
                            nodeName: node.name,
                            issues: nodeIssues,
                        });
                    }
                }
                catch (nodeError) {
                    issuesFound.push({
                        nodeName: node.name,
                        issues: [`Error validating node: ${(0, n8n_workflow_1.ensureError)(nodeError).message}`],
                    });
                }
            }
            if (issuesFound.length === 0) {
                return { isValid: true };
            }
            const errorLines = issuesFound.map((item) => {
                const issuesList = item.issues.map((issue) => `  - ${issue}`).join('\n');
                return `Node "${item.nodeName}":\n${issuesList}`;
            });
            const nodeCount = issuesFound.length;
            const pluralSuffix = nodeCount === 1 ? '' : 's';
            const error = `Cannot publish workflow: ${nodeCount} node${pluralSuffix} have configuration issues:\n\n${errorLines.join('\n\n')}`;
            return {
                isValid: false,
                error,
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: `Workflow validation failed: ${(0, n8n_workflow_1.ensureError)(error).message}`,
            };
        }
    }
    validateNodeParameters(node, nodeType) {
        const issues = [];
        try {
            if (!nodeType.description?.properties) {
                return issues;
            }
            const nodeIssues = n8n_workflow_1.NodeHelpers.getNodeParametersIssues(nodeType.description.properties, node, nodeType.description);
            if (nodeIssues?.parameters) {
                const parameterIssuesCount = Object.keys(nodeIssues.parameters).length;
                if (parameterIssuesCount > 0) {
                    issues.push(`Missing or invalid required parameters (${parameterIssuesCount} issue${parameterIssuesCount === 1 ? '' : 's'})`);
                }
            }
        }
        catch (error) {
            issues.push('Error validating node parameters');
        }
        return issues;
    }
    validateForActivation(nodes, connections, nodeTypes) {
        const triggerValidation = (0, n8n_workflow_1.validateWorkflowHasTriggerLikeNode)(nodes, nodeTypes, constants_1.STARTING_NODES);
        if (!triggerValidation.isValid) {
            return {
                isValid: false,
                error: triggerValidation.error ??
                    'Workflow cannot be activated because it has no trigger node. At least one trigger, webhook, or polling node is required.',
            };
        }
        const nodesArray = Object.values(nodes);
        const configValidation = this.validateNodeConfiguration(nodesArray, connections, nodeTypes);
        if (!configValidation.isValid) {
            return configValidation;
        }
        return { isValid: true };
    }
    async validateDynamicCredentials(nodes, nodeTypes, workflowSettings) {
        const credentialIds = new Set();
        for (const node of nodes) {
            if (node.disabled)
                continue;
            for (const credName of Object.keys(node.credentials ?? {})) {
                const credData = node.credentials?.[credName];
                if (credData?.id) {
                    credentialIds.add(credData.id);
                }
            }
        }
        if (credentialIds.size === 0) {
            return { isValid: true };
        }
        const resolvableCredentials = await this.credentialsRepository.find({
            where: { id: (0, typeorm_1.In)([...credentialIds]), isResolvable: true },
            select: ['id', 'name', 'resolverId'],
        });
        if (resolvableCredentials.length === 0) {
            return { isValid: true };
        }
        const errors = [];
        const workflowResolverId = workflowSettings?.credentialResolverId;
        if (!workflowResolverId) {
            const credentialsWithoutResolver = resolvableCredentials.filter((c) => !c.resolverId);
            if (credentialsWithoutResolver.length > 0) {
                const credNames = credentialsWithoutResolver.map((c) => `"${c.name}"`).join(', ');
                errors.push(`dynamic credentials (${credNames}) require a resolver to be configured.`);
            }
        }
        const hasExtractorHook = nodes.some((node) => {
            if (node.disabled)
                return false;
            const nodeType = nodeTypes.getByNameAndVersion(node.type, node.typeVersion);
            if (!nodeType || !(0, n8n_workflow_1.isTriggerLikeNode)(nodeType))
                return false;
            const hookParams = (0, n8n_workflow_1.toExecutionContextEstablishmentHookParameter)(node.parameters);
            return (hookParams !== null &&
                hookParams.success &&
                hookParams.data.contextEstablishmentHooks.hooks.length > 0);
        });
        if (!hasExtractorHook) {
            const credNames = resolvableCredentials.map((c) => `"${c.name}"`).join(', ');
            errors.push(`dynamic credentials (${credNames}) require a trigger with an identity extractor configured. Please configure an identity extractor on the trigger node.`);
        }
        if (errors.length > 0) {
            return {
                isValid: false,
                error: `Cannot publish workflow: ${errors.join(' ')}`,
            };
        }
        return { isValid: true };
    }
    async validateSubWorkflowReferences(workflowId, nodes) {
        const executeWorkflowNodes = nodes.filter((node) => node.type === 'n8n-nodes-base.executeWorkflow' && !node.disabled);
        if (executeWorkflowNodes.length === 0) {
            return { isValid: true };
        }
        const invalidReferences = [];
        for (const node of executeWorkflowNodes) {
            const subWorkflowId = this.extractWorkflowId(node);
            const source = typeof node.parameters?.source === 'string' ? node.parameters.source : undefined;
            if (this.shouldSkipSubWorkflowValidation(subWorkflowId, source)) {
                continue;
            }
            const status = await this.getWorkflowStatus(workflowId, subWorkflowId);
            if (!status.exists || !status.isPublished) {
                invalidReferences.push({
                    nodeName: node.name,
                    workflowId: subWorkflowId,
                    workflowName: status.exists ? status.name : undefined,
                });
            }
        }
        if (invalidReferences.length > 0) {
            const errorMessages = invalidReferences.map((ref) => {
                const workflowName = ref.workflowName ? ` ("${ref.workflowName}")` : '';
                return `Node "${ref.nodeName}" references workflow ${ref.workflowId}${workflowName} which is not published`;
            });
            return {
                isValid: false,
                error: `Cannot publish workflow: ${errorMessages.join('; ')}. Please publish all referenced sub-workflows first.`,
                invalidReferences,
            };
        }
        return { isValid: true };
    }
    async getWorkflowStatus(parentWorkflowId, subWorkflowId) {
        if (subWorkflowId === parentWorkflowId) {
            return { exists: true, isPublished: true };
        }
        const subWorkflow = await this.workflowRepository.get({ id: subWorkflowId }, { relations: [] });
        if (!subWorkflow) {
            return { exists: false, isPublished: false };
        }
        return {
            exists: true,
            isPublished: subWorkflow.activeVersionId !== null,
            name: subWorkflow.name,
        };
    }
    hasValueProperty(obj) {
        return typeof obj === 'object' && obj !== null && 'value' in obj;
    }
    extractWorkflowId(node) {
        const workflowIdParam = node.parameters?.workflowId;
        if (this.hasValueProperty(workflowIdParam)) {
            return workflowIdParam.value;
        }
        if (typeof workflowIdParam === 'string') {
            return workflowIdParam;
        }
        return undefined;
    }
    shouldSkipSubWorkflowValidation(workflowId, source) {
        if (!workflowId)
            return true;
        if (workflowId.startsWith('='))
            return true;
        if (source && source !== 'database')
            return true;
        return false;
    }
};
exports.WorkflowValidationService = WorkflowValidationService;
exports.WorkflowValidationService = WorkflowValidationService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [db_1.WorkflowRepository,
        db_1.CredentialsRepository])
], WorkflowValidationService);
//# sourceMappingURL=workflow-validation.service.js.map