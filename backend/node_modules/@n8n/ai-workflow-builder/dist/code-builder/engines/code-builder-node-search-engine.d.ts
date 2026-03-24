import type { INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import type { CodeBuilderNodeSearchResult } from '../types';
export declare const SCORE_WEIGHTS: {
    readonly CONNECTION_EXACT: 100;
    readonly CONNECTION_IN_EXPRESSION: 50;
};
export declare class CodeBuilderNodeSearchEngine {
    private readonly nodeTypes;
    constructor(nodeTypes: INodeTypeDescription[]);
    searchByName(query: string, limit?: number): CodeBuilderNodeSearchResult[];
    searchByConnectionType(connectionType: NodeConnectionType, limit?: number, nameFilter?: string): CodeBuilderNodeSearchResult[];
    formatResult(result: CodeBuilderNodeSearchResult): string;
    getSubnodesForConnectionType(connectionType: string): string[];
    getRelatedSubnodeIds(nodeIds: string[], excludeNodeIds: Set<string>): Set<string>;
    getNodeType(nodeId: string): INodeTypeDescription | undefined;
    private getConnectionScore;
    static isAiConnectionType(connectionType: string): boolean;
    static getAiConnectionTypes(): NodeConnectionType[];
}
