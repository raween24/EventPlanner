"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTriggerNodeType = isTriggerNodeType;
exports.formatNodeResult = formatNodeResult;
exports.createCodeBuilderSearchTool = createCodeBuilderSearchTool;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const resource_operation_extractor_1 = require("../../utils/resource-operation-extractor");
const discriminator_utils_1 = require("../utils/discriminator-utils");
const TRIGGER_NODE_TYPES = new Set([
    'n8n-nodes-base.webhook',
    'n8n-nodes-base.cron',
    'n8n-nodes-base.emailReadImap',
    'n8n-nodes-base.telegramBot',
    'n8n-nodes-base.start',
]);
function isTriggerNodeType(type) {
    if (TRIGGER_NODE_TYPES.has(type)) {
        return true;
    }
    return type.toLowerCase().includes('trigger');
}
function formatBuilderHint(nodeTypeParser, nodeId, version) {
    const nodeType = nodeTypeParser.getNodeType(nodeId, version);
    const hint = nodeType?.builderHint?.message;
    if (!hint)
        return '';
    return `  @builderHint ${hint}`;
}
function getDirectRelatedNodeIds(nodeTypeParser, nodeId, version) {
    const nodeType = nodeTypeParser.getNodeType(nodeId, version);
    const relatedNodes = nodeType?.builderHint?.relatedNodes;
    if (!relatedNodes)
        return [];
    return relatedNodes.map((r) => r.nodeType);
}
function getRelatedNodesWithHints(nodeTypeParser, nodeId, version) {
    const nodeType = nodeTypeParser.getNodeType(nodeId, version);
    return nodeType?.builderHint?.relatedNodes;
}
function formatRelatedNodesWithHints(relatedNodes) {
    if (relatedNodes.length === 0)
        return '';
    const lines = ['  @relatedNodes'];
    for (const related of relatedNodes) {
        lines.push(`    - ${related.nodeType}: "${related.relationHint}"`);
    }
    return lines.join('\n');
}
function collectAllRelatedNodeIds(nodeTypeParser, initialNodeIds, excludeNodeIds) {
    const allRelated = new Set();
    const visited = new Set();
    for (const node of initialNodeIds) {
        visited.add(node.id);
    }
    for (const id of excludeNodeIds) {
        visited.add(id);
    }
    const queue = [...initialNodeIds];
    while (queue.length > 0) {
        const current = queue.shift();
        const relatedIds = getDirectRelatedNodeIds(nodeTypeParser, current.id, current.version);
        for (const relatedId of relatedIds) {
            if (visited.has(relatedId)) {
                continue;
            }
            visited.add(relatedId);
            allRelated.add(relatedId);
            const relatedNodeType = nodeTypeParser.getNodeType(relatedId);
            if (relatedNodeType) {
                const relatedVersion = Array.isArray(relatedNodeType.version)
                    ? relatedNodeType.version[relatedNodeType.version.length - 1]
                    : relatedNodeType.version;
                queue.push({ id: relatedId, version: relatedVersion });
            }
        }
    }
    return allRelated;
}
const CONNECTION_TYPE_TO_SDK = {
    ai_tool: { fn: 'tool()', subnodeField: 'subnodes.tools' },
    ai_vectorStore: { fn: 'vectorStore()', subnodeField: 'subnodes.vectorStore' },
    ai_retriever: { fn: 'retriever()', subnodeField: 'subnodes.retriever' },
    ai_languageModel: { fn: 'languageModel()', subnodeField: 'subnodes.model' },
    ai_memory: { fn: 'memory()', subnodeField: 'subnodes.memory' },
    ai_outputParser: { fn: 'outputParser()', subnodeField: 'subnodes.outputParser' },
    ai_embedding: { fn: 'embeddings()', subnodeField: 'subnodes.embeddings' },
    ai_document: { fn: 'documentLoader()', subnodeField: 'subnodes.documentLoader' },
    ai_textSplitter: { fn: 'textSplitter()', subnodeField: 'subnodes.textSplitter' },
};
const MODE_DISPLAY_NAME_OVERRIDES = {
    retrieve: {
        'Retrieve Documents (As Vector Store for Chain/Tool)': 'Retrieve Documents (As Vector Store for Chain)',
    },
};
function formatModeForDisplay(mode, showSdkMapping) {
    const lines = [];
    const displayName = MODE_DISPLAY_NAME_OVERRIDES[mode.value]?.[mode.displayName] ?? mode.displayName;
    let firstLine = `      - ${mode.value}: "${displayName}"`;
    if (showSdkMapping) {
        const sdkMapping = mode.outputConnectionType
            ? CONNECTION_TYPE_TO_SDK[mode.outputConnectionType]
            : undefined;
        if (sdkMapping) {
            const fnWithMode = sdkMapping.fn.replace('()', `({ mode: '${mode.value}' })`);
            firstLine += ` → use ${fnWithMode} for ${sdkMapping.subnodeField}`;
        }
        else {
            firstLine += ' → use node()';
        }
    }
    lines.push(firstLine);
    if (mode.description) {
        lines.push(`        ${mode.description}`);
    }
    if (mode.builderHint) {
        lines.push(`        @builderHint ${mode.builderHint.message}`);
    }
    return lines.join('\n');
}
function getDiscriminatorInfo(nodeTypeParser, nodeId, version) {
    const nodeType = nodeTypeParser.getNodeType(nodeId, version);
    if (!nodeType) {
        return { type: 'none' };
    }
    const resourceOps = (0, resource_operation_extractor_1.extractResourceOperations)(nodeType, version, undefined, {
        fields: { description: true, builderHint: true },
    });
    if (resourceOps && resourceOps.resources.length > 0) {
        const resources = resourceOps.resources
            .filter((r) => r.value !== '__CUSTOM_API_CALL__')
            .map((r) => ({
            value: r.value,
            description: r.description,
            builderHint: r.builderHint,
            operations: r.operations
                .filter((op) => op.value !== '__CUSTOM_API_CALL__')
                .map((op) => ({
                value: op.value,
                description: op.description,
                builderHint: op.builderHint,
            })),
        }));
        if (resources.length > 0) {
            return { type: 'resource_operation', resources };
        }
    }
    const operationOnly = (0, discriminator_utils_1.extractOperationOnlyDiscriminator)(nodeType, version);
    if (operationOnly && operationOnly.operations.length > 0) {
        const operations = operationOnly.operations
            .filter((op) => op.value !== '__CUSTOM_API_CALL__')
            .map((op) => ({
            value: op.value,
            description: op.description,
            builderHint: op.builderHint,
        }));
        if (operations.length > 0) {
            return { type: 'operation', operations };
        }
    }
    const modeInfo = (0, discriminator_utils_1.extractModeDiscriminator)(nodeType, version);
    if (modeInfo && modeInfo.modes.length > 0) {
        return { type: 'mode', modes: modeInfo.modes };
    }
    return { type: 'none' };
}
function formatResourceOperationLines(resources, nodeId) {
    const lines = ['    resource:'];
    for (const resource of resources) {
        lines.push(`      - ${resource.value}:`);
        if (resource.description) {
            lines.push(`          ${resource.description}`);
        }
        if (resource.builderHint) {
            lines.push(`          @builderHint ${resource.builderHint.message}`);
        }
        lines.push('          operations:');
        for (const op of resource.operations) {
            lines.push(`            - ${op.value}`);
            if (op.description) {
                lines.push(`              ${op.description}`);
            }
            if (op.builderHint) {
                lines.push(`              @builderHint ${op.builderHint.message}`);
            }
        }
    }
    const firstResource = resources[0];
    const firstOp = firstResource?.operations[0]?.value || 'get';
    lines.push('');
    lines.push('  Use get_node_types with discriminators:');
    lines.push(`    get_node_types({ nodeIds: [{ nodeId: "${nodeId}", resource: "${firstResource?.value}", operation: "${firstOp}" }] })`);
    return lines;
}
function formatOperationLines(operations, nodeId) {
    const lines = ['    operation:'];
    for (const op of operations) {
        lines.push(`      - ${op.value}`);
        if (op.description) {
            lines.push(`        ${op.description}`);
        }
        if (op.builderHint) {
            lines.push(`        @builderHint ${op.builderHint.message}`);
        }
    }
    const firstOp = operations[0]?.value ?? 'default';
    lines.push('');
    lines.push('  Use get_node_types with discriminators:');
    lines.push(`    get_node_types({ nodeIds: [{ nodeId: "${nodeId}", operation: "${firstOp}" }] })`);
    return lines;
}
function formatModeLines(modes, nodeId) {
    const lines = ['    mode:'];
    const hasSubnodeModes = modes.some((m) => m.outputConnectionType);
    for (const mode of modes) {
        lines.push(formatModeForDisplay(mode, hasSubnodeModes));
    }
    const firstMode = modes[0];
    lines.push('');
    lines.push('  Use get_node_types with discriminators:');
    lines.push(`    get_node_types({ nodeIds: [{ nodeId: "${nodeId}", mode: "${firstMode.value}" }] })`);
    return lines;
}
function formatDiscriminatorInfo(info, nodeId) {
    if (info.type === 'none') {
        return '  Discriminators: none (use node directly without resource/operation/mode)';
    }
    const lines = ['  Discriminators:'];
    if (info.type === 'resource_operation' && info.resources) {
        lines.push(...formatResourceOperationLines(info.resources, nodeId));
    }
    else if (info.type === 'operation' && info.operations) {
        lines.push(...formatOperationLines(info.operations, nodeId));
    }
    else if (info.type === 'mode' && info.modes) {
        lines.push(...formatModeLines(info.modes, nodeId));
    }
    return lines.join('\n');
}
function formatNodeResult(nodeTypeParser, nodeId, version) {
    const nodeType = nodeTypeParser.getNodeType(nodeId, version);
    if (!nodeType)
        return undefined;
    const resolvedVersion = version ?? (Array.isArray(nodeType.version) ? Math.max(...nodeType.version) : nodeType.version);
    const triggerTag = isTriggerNodeType(nodeId) ? ' [TRIGGER]' : '';
    const basicInfo = `- ${nodeId}${triggerTag}\n  Display Name: ${nodeType.displayName}\n  Version: ${resolvedVersion}\n  Description: ${nodeType.description}`;
    const builderHint = formatBuilderHint(nodeTypeParser, nodeId, resolvedVersion);
    const relatedNodesWithHints = getRelatedNodesWithHints(nodeTypeParser, nodeId, resolvedVersion);
    const discInfo = getDiscriminatorInfo(nodeTypeParser, nodeId, resolvedVersion);
    const discStr = formatDiscriminatorInfo(discInfo, nodeId);
    const parts = [basicInfo];
    if (builderHint)
        parts.push(builderHint);
    if (relatedNodesWithHints && relatedNodesWithHints.length > 0) {
        const relatedNodesStr = formatRelatedNodesWithHints(relatedNodesWithHints);
        if (relatedNodesStr)
            parts.push(relatedNodesStr);
    }
    if (discStr)
        parts.push(discStr);
    return parts.join('\n');
}
function createCodeBuilderSearchTool(nodeTypeParser) {
    return (0, tools_1.tool)(async (input) => {
        const allResults = [];
        for (const query of input.queries) {
            const results = nodeTypeParser.searchNodeTypes(query, 5);
            if (results.length === 0) {
                allResults.push(`## "${query}"\nNo nodes found. Try a different search term.`);
            }
            else {
                const shownNodeIds = new Set(results.map((node) => node.id));
                const allNodeLines = [];
                let totalRelatedCount = 0;
                for (const node of results) {
                    const triggerTag = node.isTrigger ? ' [TRIGGER]' : '';
                    const basicInfo = `- ${node.id}${triggerTag}\n  Display Name: ${node.displayName}\n  Version: ${node.version}\n  Description: ${node.description}`;
                    const builderHint = formatBuilderHint(nodeTypeParser, node.id, node.version);
                    const relatedNodesWithHints = getRelatedNodesWithHints(nodeTypeParser, node.id, node.version);
                    const discInfo = getDiscriminatorInfo(nodeTypeParser, node.id, node.version);
                    const discStr = formatDiscriminatorInfo(discInfo, node.id);
                    const parts = [basicInfo];
                    if (builderHint)
                        parts.push(builderHint);
                    if (relatedNodesWithHints && relatedNodesWithHints.length > 0) {
                        const relatedNodesStr = formatRelatedNodesWithHints(relatedNodesWithHints);
                        if (relatedNodesStr)
                            parts.push(relatedNodesStr);
                    }
                    else {
                        const relatedNodeIds = collectAllRelatedNodeIds(nodeTypeParser, [{ id: node.id, version: node.version }], shownNodeIds);
                        if (discStr)
                            parts.push(discStr);
                        allNodeLines.push(parts.join('\n'));
                        for (const relatedId of relatedNodeIds) {
                            const nodeType = nodeTypeParser.getNodeType(relatedId);
                            if (nodeType) {
                                const version = Array.isArray(nodeType.version)
                                    ? nodeType.version[nodeType.version.length - 1]
                                    : nodeType.version;
                                const relatedTriggerTag = isTriggerNodeType(relatedId) ? ' [TRIGGER]' : '';
                                const relatedBasicInfo = `- ${relatedId}${relatedTriggerTag} [RELATED]\n  Display Name: ${nodeType.displayName}\n  Version: ${version}\n  Description: ${nodeType.description}`;
                                const relatedBuilderHint = formatBuilderHint(nodeTypeParser, relatedId, version);
                                const relatedDiscInfo = getDiscriminatorInfo(nodeTypeParser, relatedId, version);
                                const relatedDiscStr = formatDiscriminatorInfo(relatedDiscInfo, relatedId);
                                const relatedParts = [relatedBasicInfo];
                                if (relatedBuilderHint)
                                    relatedParts.push(relatedBuilderHint);
                                if (relatedDiscStr)
                                    relatedParts.push(relatedDiscStr);
                                allNodeLines.push(relatedParts.join('\n'));
                                shownNodeIds.add(relatedId);
                                totalRelatedCount++;
                            }
                        }
                        continue;
                    }
                    if (discStr)
                        parts.push(discStr);
                    allNodeLines.push(parts.join('\n'));
                }
                const countSuffix = totalRelatedCount > 0 ? ` (+ ${totalRelatedCount} related)` : '';
                allResults.push(`## "${query}"\nFound ${results.length} nodes${countSuffix}:\n\n${allNodeLines.join('\n\n')}`);
            }
        }
        const response = allResults.join('\n\n---\n\n');
        return response;
    }, {
        name: 'search_nodes',
        description: 'Search for n8n nodes by name or service. Accepts multiple search queries and returns separate result lists for each. Use this when you need to find nodes for specific integrations or services (e.g., ["salesforce", "http", "gmail"]).',
        schema: zod_1.z.object({
            queries: zod_1.z
                .array(zod_1.z.string())
                .describe('Array of search queries (e.g., ["salesforce", "http", "gmail"])'),
        }),
    });
}
//# sourceMappingURL=code-builder-search.tool.js.map