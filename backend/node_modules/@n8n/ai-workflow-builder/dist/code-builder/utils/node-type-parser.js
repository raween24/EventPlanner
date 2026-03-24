"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTypeParser = void 0;
const code_builder_node_search_engine_1 = require("../engines/code-builder-node-search-engine");
class NodeTypeParser {
    nodeTypes;
    nodeTypeIndex;
    searchEngine;
    constructor(nodeTypes) {
        this.nodeTypes = nodeTypes;
        this.searchEngine = new code_builder_node_search_engine_1.CodeBuilderNodeSearchEngine(nodeTypes);
        this.nodeTypeIndex = this.buildIndex();
    }
    buildIndex() {
        const index = new Map();
        for (const nodeType of this.nodeTypes) {
            const existing = index.get(nodeType.name) ?? [];
            existing.push(nodeType);
            index.set(nodeType.name, existing);
        }
        return index;
    }
    isTriggerNode(nodeType) {
        if (nodeType.group.includes('trigger')) {
            return true;
        }
        return (nodeType.name.toLowerCase().includes('trigger') ||
            nodeType.name.toLowerCase().includes('webhook'));
    }
    searchNodeTypes(query, limit = 5) {
        const results = this.searchEngine.searchByName(query, limit);
        return results.map((result) => {
            const nodeType = this.getNodeType(result.name, result.version);
            return {
                id: result.name,
                displayName: result.displayName,
                description: result.description,
                version: result.version,
                isTrigger: nodeType ? this.isTriggerNode(nodeType) : false,
            };
        });
    }
    getNodeType(nodeId, version) {
        const versions = this.nodeTypeIndex.get(nodeId);
        if (!versions || versions.length === 0) {
            return null;
        }
        if (version !== undefined) {
            const match = versions.find((v) => {
                const nodeVersions = Array.isArray(v.version) ? v.version : [v.version];
                return nodeVersions.includes(version);
            });
            return match ?? null;
        }
        return versions.reduce((latest, current) => {
            const latestMax = Array.isArray(latest.version)
                ? Math.max(...latest.version)
                : latest.version;
            const currentMax = Array.isArray(current.version)
                ? Math.max(...current.version)
                : current.version;
            return currentMax > latestMax ? current : latest;
        });
    }
}
exports.NodeTypeParser = NodeTypeParser;
//# sourceMappingURL=node-type-parser.js.map