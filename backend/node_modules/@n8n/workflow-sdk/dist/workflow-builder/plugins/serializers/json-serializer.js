"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonSerializer = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../constants");
const layout_utils_1 = require("../../layout-utils");
const string_utils_1 = require("../../string-utils");
function serializeNode(mapKey, graphNode, nodePositions) {
    const instance = graphNode.instance;
    if (!instance?.name || !instance.type) {
        return undefined;
    }
    const config = instance.config ?? {};
    const position = config.position ?? nodePositions.get(mapKey) ?? [constants_1.START_X, constants_1.DEFAULT_Y];
    let nodeName;
    if ('_originalName' in config) {
        nodeName = config._originalName;
    }
    else {
        const isAutoRenamed = mapKey !== instance.name &&
            mapKey.startsWith(instance.name + ' ') &&
            /^\d+$/.test(mapKey.slice(instance.name.length + 1));
        nodeName = isAutoRenamed ? mapKey : instance.name;
    }
    const isFromJson = '_originalName' in config;
    let serializedParams;
    if (config.parameters) {
        const parsed = (0, n8n_workflow_1.deepCopy)(config.parameters);
        if (isFromJson) {
            serializedParams = parsed;
        }
        else {
            const normalized = (0, string_utils_1.normalizeResourceLocators)(parsed);
            serializedParams = (0, string_utils_1.escapeNewlinesInExpressionStrings)(normalized);
        }
    }
    const n8nNode = {
        id: instance.id,
        name: nodeName,
        type: instance.type,
        typeVersion: (0, string_utils_1.parseVersion)(instance.version),
        position,
        parameters: serializedParams,
    };
    if (config.credentials) {
        n8nNode.credentials = (0, n8n_workflow_1.deepCopy)(config.credentials);
    }
    if (config.disabled) {
        n8nNode.disabled = config.disabled;
    }
    if (config.notes) {
        n8nNode.notes = config.notes;
    }
    if (config.notesInFlow) {
        n8nNode.notesInFlow = config.notesInFlow;
    }
    if (config.executeOnce) {
        n8nNode.executeOnce = config.executeOnce;
    }
    if (config.retryOnFail) {
        n8nNode.retryOnFail = config.retryOnFail;
    }
    if (config.alwaysOutputData) {
        n8nNode.alwaysOutputData = config.alwaysOutputData;
    }
    if (config.onError) {
        n8nNode.onError = config.onError;
    }
    return n8nNode;
}
function serializeNodeConnections(graphNode, nodeName) {
    let hasConnections = false;
    for (const typeConns of graphNode.connections.values()) {
        if (typeConns.size > 0) {
            hasConnections = true;
            break;
        }
    }
    if (!hasConnections || nodeName === undefined) {
        return undefined;
    }
    const nodeConnections = {};
    for (const [connType, outputMap] of graphNode.connections) {
        if (outputMap.size === 0)
            continue;
        const maxOutput = Math.max(...outputMap.keys());
        const outputArray = [];
        for (let i = 0; i <= maxOutput; i++) {
            const targets = outputMap.get(i) ?? [];
            outputArray[i] = targets.map((target) => ({
                node: target.node,
                type: target.type,
                index: target.index,
            }));
        }
        nodeConnections[connType] = outputArray;
    }
    if (Object.keys(nodeConnections).length === 0) {
        return undefined;
    }
    return nodeConnections;
}
exports.jsonSerializer = {
    id: 'core:json',
    name: 'JSON Serializer',
    format: 'json',
    serialize(ctx) {
        const nodes = [];
        const connections = {};
        const nodePositions = (0, layout_utils_1.calculateNodePositions)(ctx.nodes);
        for (const [mapKey, graphNode] of ctx.nodes) {
            const serializedNode = serializeNode(mapKey, graphNode, nodePositions);
            if (!serializedNode)
                continue;
            nodes.push(serializedNode);
            const nodeName = serializedNode.name;
            const nodeConns = serializeNodeConnections(graphNode, nodeName);
            if (nodeConns && nodeName !== undefined) {
                connections[nodeName] = nodeConns;
            }
        }
        const json = {
            id: ctx.workflowId,
            name: ctx.workflowName,
            nodes,
            connections,
        };
        if (ctx.settings !== undefined) {
            json.settings = ctx.settings;
        }
        if (ctx.pinData && Object.keys(ctx.pinData).length > 0) {
            json.pinData = ctx.pinData;
        }
        if (ctx.meta) {
            json.meta = ctx.meta;
        }
        return json;
    },
};
//# sourceMappingURL=json-serializer.js.map