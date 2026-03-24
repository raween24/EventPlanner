import type { INodeTypeDescription } from 'n8n-workflow';
export interface ParsedNodeType {
    id: string;
    displayName: string;
    description: string;
    version: number;
    isTrigger: boolean;
}
export declare class NodeTypeParser {
    private nodeTypes;
    private nodeTypeIndex;
    private searchEngine;
    constructor(nodeTypes: INodeTypeDescription[]);
    private buildIndex;
    private isTriggerNode;
    searchNodeTypes(query: string, limit?: number): ParsedNodeType[];
    getNodeType(nodeId: string, version?: number): INodeTypeDescription | null;
}
