"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNodePositions = calculateNodePositions;
const constants_1 = require("./constants");
function calculateNodePositions(nodes) {
    const positions = new Map();
    const hasIncoming = new Set();
    for (const graphNode of nodes.values()) {
        for (const typeConns of graphNode.connections.values()) {
            for (const targets of typeConns.values()) {
                for (const target of targets) {
                    hasIncoming.add(target.node);
                }
            }
        }
    }
    const rootNodes = [...nodes.keys()].filter((name) => !hasIncoming.has(name));
    const visited = new Set();
    const queue = [];
    let y = constants_1.DEFAULT_Y;
    for (const rootName of rootNodes) {
        queue.push({ name: rootName, x: constants_1.START_X, y });
        y += 150;
    }
    while (queue.length > 0) {
        const { name, x, y: nodeY } = queue.shift();
        if (visited.has(name))
            continue;
        visited.add(name);
        const node = nodes.get(name);
        if (node && !node.instance.config?.position) {
            positions.set(name, [x, nodeY]);
        }
        if (node) {
            let branchOffset = 0;
            for (const typeConns of node.connections.values()) {
                for (const targets of typeConns.values()) {
                    for (const target of targets) {
                        if (!visited.has(target.node)) {
                            queue.push({
                                name: target.node,
                                x: x + constants_1.NODE_SPACING_X,
                                y: nodeY + branchOffset * 150,
                            });
                            branchOffset++;
                        }
                    }
                }
            }
        }
    }
    return positions;
}
//# sourceMappingURL=layout-utils.js.map