"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBuilderNodeSearchEngine = exports.SCORE_WEIGHTS = void 0;
const utils_1 = require("@n8n/utils");
const n8n_workflow_1 = require("n8n-workflow");
function isNodeConnectionType(value) {
    return Object.values(n8n_workflow_1.NodeConnectionTypes).includes(value);
}
const DEFAULT_SUBNODES = {
    ai_languageModel: ['@n8n/n8n-nodes-langchain.lmChatOpenAi'],
    ai_memory: ['@n8n/n8n-nodes-langchain.memoryBufferWindow'],
    ai_embedding: ['@n8n/n8n-nodes-langchain.embeddingsOpenAi'],
    ai_vectorStore: ['@n8n/n8n-nodes-langchain.vectorStoreInMemory'],
};
const NODE_SEARCH_KEYS = [
    { key: 'displayName', weight: 1.5 },
    { key: 'name', weight: 1.3 },
    { key: 'codex.alias', weight: 1.0 },
    { key: 'description', weight: 0.7 },
];
function getTypeName(nodeName) {
    if (!nodeName)
        return '';
    const lastDotIndex = nodeName.lastIndexOf('.');
    return lastDotIndex >= 0 ? nodeName.substring(lastDotIndex + 1) : nodeName;
}
exports.SCORE_WEIGHTS = {
    CONNECTION_EXACT: 100,
    CONNECTION_IN_EXPRESSION: 50,
};
function getLatestVersion(version) {
    return Array.isArray(version) ? Math.max(...version) : version;
}
function extractSubnodeRequirements(inputs) {
    if (!inputs)
        return [];
    return Object.entries(inputs).map(([connectionType, config]) => ({
        connectionType,
        required: config.required,
        ...(config.displayOptions && { displayOptions: config.displayOptions }),
    }));
}
function dedupeNodes(nodes) {
    const dedupeCache = {};
    nodes.forEach((node) => {
        const cachedNodeType = dedupeCache[node.name];
        if (!cachedNodeType) {
            dedupeCache[node.name] = node;
            return;
        }
        const cachedVersion = getLatestVersion(cachedNodeType.version);
        const nextVersion = getLatestVersion(node.version);
        if (nextVersion > cachedVersion) {
            dedupeCache[node.name] = node;
        }
    });
    return Object.values(dedupeCache);
}
class CodeBuilderNodeSearchEngine {
    nodeTypes;
    constructor(nodeTypes) {
        this.nodeTypes = dedupeNodes(nodeTypes);
    }
    searchByName(query, limit = 20) {
        const searchResults = (0, utils_1.sublimeSearch)(query, this.nodeTypes, NODE_SEARCH_KEYS);
        const queryLower = query.toLowerCase().trim();
        const fuzzyResultNames = new Set(searchResults.map((r) => r.item.name));
        const typeNameMatches = this.nodeTypes
            .filter((node) => {
            if (fuzzyResultNames.has(node.name))
                return false;
            return getTypeName(node.name).toLowerCase() === queryLower;
        })
            .map((item) => ({ item, score: 0 }));
        const allResults = [...searchResults, ...typeNameMatches];
        allResults.sort((a, b) => {
            const exactA = getTypeName(a.item.name).toLowerCase() === queryLower;
            const exactB = getTypeName(b.item.name).toLowerCase() === queryLower;
            if (exactA && !exactB)
                return -1;
            if (!exactA && exactB)
                return 1;
            return b.score - a.score;
        });
        return allResults
            .slice(0, limit)
            .map(({ item, score, }) => {
            const subnodeRequirements = extractSubnodeRequirements(item.builderHint?.inputs);
            return {
                name: item.name,
                displayName: item.displayName,
                description: item.description ?? 'No description available',
                version: getLatestVersion(item.version),
                inputs: item.inputs,
                outputs: item.outputs,
                score,
                ...(item.builderHint?.message && { builderHintMessage: item.builderHint.message }),
                ...(subnodeRequirements.length > 0 && { subnodeRequirements }),
            };
        });
    }
    searchByConnectionType(connectionType, limit = 20, nameFilter) {
        const nodesWithConnectionType = this.nodeTypes
            .map((nodeType) => {
            const connectionScore = this.getConnectionScore(nodeType, connectionType);
            return connectionScore > 0 ? { nodeType, connectionScore } : null;
        })
            .filter((result) => Boolean(result));
        if (!nameFilter) {
            return nodesWithConnectionType
                .sort((a, b) => b.connectionScore - a.connectionScore)
                .slice(0, limit)
                .map(({ nodeType, connectionScore }) => {
                const subnodeRequirements = extractSubnodeRequirements(nodeType.builderHint?.inputs);
                return {
                    name: nodeType.name,
                    displayName: nodeType.displayName,
                    version: getLatestVersion(nodeType.version),
                    description: nodeType.description ?? 'No description available',
                    inputs: nodeType.inputs,
                    outputs: nodeType.outputs,
                    score: connectionScore,
                    ...(nodeType.builderHint?.message && {
                        builderHintMessage: nodeType.builderHint.message,
                    }),
                    ...(subnodeRequirements.length > 0 && { subnodeRequirements }),
                };
            });
        }
        const nodeTypesOnly = nodesWithConnectionType.map((result) => result.nodeType);
        const nameFilteredResults = (0, utils_1.sublimeSearch)(nameFilter, nodeTypesOnly, NODE_SEARCH_KEYS);
        return nameFilteredResults
            .slice(0, limit)
            .map(({ item, score: nameScore }) => {
            const connectionResult = nodesWithConnectionType.find((result) => result.nodeType.name === item.name);
            const connectionScore = connectionResult?.connectionScore ?? 0;
            const subnodeRequirements = extractSubnodeRequirements(item.builderHint?.inputs);
            return {
                name: item.name,
                version: getLatestVersion(item.version),
                displayName: item.displayName,
                description: item.description ?? 'No description available',
                inputs: item.inputs,
                outputs: item.outputs,
                score: connectionScore + nameScore,
                ...(item.builderHint?.message && { builderHintMessage: item.builderHint.message }),
                ...(subnodeRequirements.length > 0 && { subnodeRequirements }),
            };
        });
    }
    formatResult(result) {
        const parts = [
            '		<node>',
            `			<node_name>${result.name}</node_name>`,
            `			<node_version>${result.version}</node_version>`,
            `			<node_description>${result.description}</node_description>`,
            `			<node_inputs>${typeof result.inputs === 'object' ? JSON.stringify(result.inputs) : result.inputs}</node_inputs>`,
            `			<node_outputs>${typeof result.outputs === 'object' ? JSON.stringify(result.outputs) : result.outputs}</node_outputs>`,
        ];
        if (result.builderHintMessage) {
            parts.push(`			<builder_hint>${result.builderHintMessage}</builder_hint>`);
        }
        if (result.subnodeRequirements && result.subnodeRequirements.length > 0) {
            parts.push('			<subnode_requirements>');
            for (const req of result.subnodeRequirements) {
                const requiredStr = req.required ? 'required' : 'optional';
                if (req.displayOptions) {
                    parts.push(`				<requirement type="${req.connectionType}" status="${requiredStr}"><display_options>${JSON.stringify(req.displayOptions)}</display_options></requirement>`);
                }
                else {
                    parts.push('				<requirement type="' +
                        req.connectionType +
                        '" status="' +
                        requiredStr +
                        '" />');
                }
            }
            parts.push('			</subnode_requirements>');
        }
        parts.push('		</node>');
        return '\n' + parts.join('\n');
    }
    getSubnodesForConnectionType(connectionType) {
        return DEFAULT_SUBNODES[connectionType] ?? [];
    }
    getRelatedSubnodeIds(nodeIds, excludeNodeIds) {
        const allRelated = new Set();
        const visited = new Set(excludeNodeIds);
        for (const nodeId of nodeIds) {
            visited.add(nodeId);
        }
        const queue = [...nodeIds];
        while (queue.length > 0) {
            const currentNodeId = queue.shift();
            const nodeType = this.nodeTypes.find((n) => n.name === currentNodeId);
            if (!nodeType?.builderHint?.inputs)
                continue;
            for (const connectionType of Object.keys(nodeType.builderHint.inputs)) {
                const subnodeIds = this.getSubnodesForConnectionType(connectionType);
                for (const subnodeId of subnodeIds) {
                    if (visited.has(subnodeId))
                        continue;
                    visited.add(subnodeId);
                    allRelated.add(subnodeId);
                    queue.push(subnodeId);
                }
            }
        }
        return allRelated;
    }
    getNodeType(nodeId) {
        return this.nodeTypes.find((n) => n.name === nodeId);
    }
    getConnectionScore(nodeType, connectionType) {
        const outputs = nodeType.outputs;
        if (Array.isArray(outputs)) {
            if (outputs.includes(connectionType)) {
                return exports.SCORE_WEIGHTS.CONNECTION_EXACT;
            }
        }
        else if (typeof outputs === 'string') {
            if (outputs.includes(connectionType)) {
                return exports.SCORE_WEIGHTS.CONNECTION_IN_EXPRESSION;
            }
        }
        return 0;
    }
    static isAiConnectionType(connectionType) {
        return connectionType.startsWith('ai_');
    }
    static getAiConnectionTypes() {
        return Object.values(n8n_workflow_1.NodeConnectionTypes).filter((type) => isNodeConnectionType(type) && CodeBuilderNodeSearchEngine.isAiConnectionType(type));
    }
}
exports.CodeBuilderNodeSearchEngine = CodeBuilderNodeSearchEngine;
//# sourceMappingURL=code-builder-node-search-engine.js.map