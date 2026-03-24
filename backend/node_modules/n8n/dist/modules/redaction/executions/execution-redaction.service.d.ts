import { Logger } from '@n8n/backend-common';
import type { ExecutionRedaction, ExecutionRedactionOptions, RedactableExecution } from '../../../executions/execution-redaction';
import { EventService } from '../../../events/event.service';
import { WorkflowFinderService } from '../../../workflows/workflow-finder.service';
import { FullItemRedactionStrategy } from './strategies/full-item-redaction.strategy';
import { NodeDefinedFieldRedactionStrategy } from './strategies/node-defined-field-redaction.strategy';
export declare class ExecutionRedactionService implements ExecutionRedaction {
    private readonly logger;
    private readonly workflowFinderService;
    private readonly eventService;
    private readonly fullItemRedactionStrategy;
    private readonly nodeDefinedFieldRedactionStrategy;
    constructor(logger: Logger, workflowFinderService: WorkflowFinderService, eventService: EventService, fullItemRedactionStrategy: FullItemRedactionStrategy, nodeDefinedFieldRedactionStrategy: NodeDefinedFieldRedactionStrategy);
    init(): Promise<void>;
    processExecution(execution: RedactableExecution, options: ExecutionRedactionOptions): Promise<RedactableExecution>;
    processExecutions(executions: RedactableExecution[], options: ExecutionRedactionOptions): Promise<void>;
    private buildPipeline;
    private policyAllowsReveal;
    private resolvePolicy;
}
