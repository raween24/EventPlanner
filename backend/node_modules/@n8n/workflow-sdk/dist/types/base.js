"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeConnections = normalizeConnections;
exports.generateUniqueName = generateUniqueName;
exports.isNodeChain = isNodeChain;
exports.isNodeInstance = isNodeInstance;
function normalizeConnections(connections) {
    for (const nodeConns of Object.values(connections)) {
        for (const [connType, outputs] of Object.entries(nodeConns)) {
            if (!Array.isArray(outputs))
                continue;
            for (let i = 0; i < outputs.length; i++) {
                const slot = outputs[i];
                if (!Array.isArray(slot))
                    continue;
                if (slot.length > 0 && slot.length <= 3 && typeof slot[0] === 'string') {
                    outputs[i] = [
                        {
                            node: slot[0],
                            type: slot[1] ?? 'main',
                            index: slot[2] ?? 0,
                        },
                    ];
                }
            }
            nodeConns[connType] = outputs;
        }
    }
    for (const nodeConns of Object.values(connections)) {
        for (const outputs of Object.values(nodeConns)) {
            if (!Array.isArray(outputs))
                continue;
            for (const slot of outputs) {
                if (!Array.isArray(slot))
                    continue;
                for (const conn of slot) {
                    if (typeof conn === 'object' && conn !== null && conn.index === undefined) {
                        conn.index = 0;
                    }
                }
            }
        }
    }
}
function generateUniqueName(baseName, exists) {
    let counter = 2;
    let uniqueName = `${baseName} ${counter}`;
    while (exists(uniqueName)) {
        counter++;
        uniqueName = `${baseName} ${counter}`;
    }
    return uniqueName;
}
function isNodeChain(value) {
    if (value === null || typeof value !== 'object')
        return false;
    if (!('_isChain' in value))
        return false;
    const isChainValue = value._isChain;
    return isChainValue === true;
}
function isNodeInstance(value) {
    if (value === null || typeof value !== 'object')
        return false;
    if (!('type' in value && 'version' in value && 'config' in value && 'to' in value)) {
        return false;
    }
    const toProp = value.to;
    return typeof toProp === 'function';
}
//# sourceMappingURL=base.js.map