import type { NodeTypeParser } from '@n8n/ai-workflow-builder';
import { Logger } from '@n8n/backend-common';
import { LoadNodesAndCredentials } from '../../../../load-nodes-and-credentials';
export declare class WorkflowBuilderToolsService {
    private readonly loadNodesAndCredentials;
    private readonly logger;
    private nodeTypeParser;
    private nodeDefinitionDirs;
    private initPromise;
    constructor(loadNodesAndCredentials: LoadNodesAndCredentials, logger: Logger);
    initialize(): Promise<void>;
    getNodeTypeParser(): NodeTypeParser;
    getNodeDefinitionDirs(): string[];
    private doInitialize;
    private refreshNodeTypes;
    private resolveBuiltinNodeDefinitionDirs;
}
