"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetSuggestedNodesTool = createGetSuggestedNodesTool;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const suggested_nodes_data_1 = require("./suggested-nodes-data");
const GetSuggestedNodesSchema = zod_1.z.object({
    categories: zod_1.z
        .array(zod_1.z.string())
        .describe('List of workflow technique categories to get node suggestions for'),
});
function formatCategoryResult(nodeTypeParser, category) {
    const categoryData = suggested_nodes_data_1.suggestedNodesData[category];
    if (!categoryData) {
        return null;
    }
    const nodes = categoryData.nodes.map((node) => {
        const nodeType = nodeTypeParser.getNodeType(node.name);
        if (nodeType) {
            return {
                name: node.name,
                displayName: nodeType.displayName,
                description: nodeType.description,
                note: node.note,
            };
        }
        return {
            name: node.name,
            displayName: '(not found)',
            description: '(not found)',
            note: node.note,
        };
    });
    return {
        category,
        patternHint: categoryData.patternHint,
        nodes,
    };
}
function formatOutput(results) {
    const lines = [];
    for (const result of results) {
        if (!result) {
            lines.push('Category not found\n');
            continue;
        }
        lines.push(`## ${result.category}`);
        lines.push(`patternHint: ${result.patternHint}`);
        lines.push('');
        lines.push('Suggested nodes:');
        for (const node of result.nodes) {
            lines.push(`- ${node.name}`);
            lines.push(`  displayName: ${node.displayName}`);
            lines.push(`  description: ${node.description}`);
            if (node.note) {
                lines.push(`  note: ${node.note}`);
            }
        }
        lines.push('');
    }
    return lines.join('\n');
}
function createGetSuggestedNodesTool(nodeTypeParser) {
    return new tools_1.DynamicStructuredTool({
        name: 'get_suggested_nodes',
        description: `Returns curated node recommendations by workflow technique category.

Available categories: ${suggested_nodes_data_1.categoryList.join(', ')}`,
        schema: GetSuggestedNodesSchema,
        func: async (input) => {
            const results = [];
            for (const category of input.categories) {
                const result = formatCategoryResult(nodeTypeParser, category);
                if (result) {
                    results.push(result);
                }
                else {
                    results.push({
                        category,
                        patternHint: 'Category not found',
                        nodes: [],
                    });
                }
            }
            return formatOutput(results);
        },
    });
}
//# sourceMappingURL=get-suggested-nodes.tool.js.map