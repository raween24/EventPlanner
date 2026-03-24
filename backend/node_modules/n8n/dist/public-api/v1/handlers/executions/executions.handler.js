"use strict";
const db_1 = require("@n8n/db");
const di_1 = require("@n8n/di");
const typeorm_1 = require("@n8n/typeorm");
const n8n_workflow_1 = require("n8n-workflow");
const active_executions_1 = require("../../../../active-executions");
const concurrency_control_service_1 = require("../../../../concurrency/concurrency-control.service");
const aborted_execution_retry_error_1 = require("../../../../errors/aborted-execution-retry.error");
const missing_execution_stop_error_1 = require("../../../../errors/missing-execution-stop.error");
const queued_execution_retry_error_1 = require("../../../../errors/queued-execution-retry.error");
const not_found_error_1 = require("../../../../errors/response-errors/not-found.error");
const event_service_1 = require("../../../../events/event.service");
const execution_persistence_1 = require("../../../../executions/execution-persistence");
const execution_redaction_proxy_service_1 = require("../../../../executions/execution-redaction-proxy.service");
const execution_service_1 = require("../../../../executions/execution.service");
function isRedactableExecution(execution) {
    return 'data' in execution && 'workflowData' in execution;
}
const global_middleware_1 = require("../../shared/middlewares/global.middleware");
const pagination_service_1 = require("../../shared/services/pagination.service");
const workflows_service_1 = require("../workflows/workflows.service");
const executions_service_1 = require("./executions.service");
module.exports = {
    deleteExecution: [
        (0, global_middleware_1.apiKeyHasScope)('execution:delete'),
        async (req, res) => {
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:delete']);
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const { id } = req.params;
            const execution = await di_1.Container.get(db_1.ExecutionRepository).getExecutionInWorkflowsForPublicApi(id, sharedWorkflowsIds, false);
            if (!execution) {
                return res.status(404).json({ message: 'Not Found' });
            }
            if (execution.status === 'running') {
                return res.status(400).json({
                    message: 'Cannot delete a running execution',
                });
            }
            if (execution.status === 'new') {
                di_1.Container.get(concurrency_control_service_1.ConcurrencyControlService).remove({
                    executionId: execution.id,
                    mode: execution.mode,
                });
            }
            await di_1.Container.get(execution_persistence_1.ExecutionPersistence).hardDelete({
                workflowId: execution.workflowId,
                executionId: execution.id,
                storedAt: execution.storedAt,
            });
            execution.id = id;
            return res.json((0, n8n_workflow_1.replaceCircularReferences)(execution));
        },
    ],
    getExecution: [
        (0, global_middleware_1.apiKeyHasScope)('execution:read'),
        async (req, res) => {
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:read']);
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const { id } = req.params;
            const { includeData = false } = req.query;
            const execution = await di_1.Container.get(db_1.ExecutionRepository).getExecutionInWorkflowsForPublicApi(id, sharedWorkflowsIds, includeData);
            if (!execution) {
                return res.status(404).json({ message: 'Not Found' });
            }
            if (includeData && isRedactableExecution(execution)) {
                await di_1.Container.get(execution_redaction_proxy_service_1.ExecutionRedactionServiceProxy).processExecution(execution, {
                    user: req.user,
                });
            }
            di_1.Container.get(event_service_1.EventService).emit('user-retrieved-execution', {
                userId: req.user.id,
                publicApi: true,
            });
            return res.json((0, n8n_workflow_1.replaceCircularReferences)(execution));
        },
    ],
    getExecutions: [
        (0, global_middleware_1.apiKeyHasScope)('execution:list'),
        global_middleware_1.validCursor,
        async (req, res) => {
            const { lastId = undefined, limit = 100, status = undefined, includeData = false, workflowId = undefined, projectId, } = req.query;
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:read'], projectId);
            if (!sharedWorkflowsIds.length || (workflowId && !sharedWorkflowsIds.includes(workflowId))) {
                return res.status(200).json({ data: [], nextCursor: null });
            }
            const runningExecutionsIds = di_1.Container.get(active_executions_1.ActiveExecutions)
                .getActiveExecutions()
                .map(({ id }) => id);
            const filters = {
                status,
                limit,
                lastId,
                includeData,
                workflowIds: workflowId ? [workflowId] : sharedWorkflowsIds,
                excludedExecutionsIds: status !== 'running' ? runningExecutionsIds : undefined,
            };
            const executions = await di_1.Container.get(db_1.ExecutionRepository).getExecutionsForPublicApi(filters);
            const newLastId = !executions.length ? '0' : executions.slice(-1)[0].id;
            filters.lastId = newLastId;
            const count = await di_1.Container.get(db_1.ExecutionRepository).getExecutionsCountForPublicApi(filters);
            if (includeData) {
                const redactableExecutions = executions.filter(isRedactableExecution);
                await di_1.Container.get(execution_redaction_proxy_service_1.ExecutionRedactionServiceProxy).processExecutions(redactableExecutions, { user: req.user });
            }
            di_1.Container.get(event_service_1.EventService).emit('user-retrieved-all-executions', {
                userId: req.user.id,
                publicApi: true,
            });
            return res.json({
                data: (0, n8n_workflow_1.replaceCircularReferences)(executions),
                nextCursor: (0, pagination_service_1.encodeNextCursor)({
                    lastId: newLastId,
                    limit,
                    numberOfNextRecords: count,
                }),
            });
        },
    ],
    retryExecution: [
        (0, global_middleware_1.apiKeyHasScope)('execution:retry'),
        async (req, res) => {
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:read']);
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            try {
                const retriedExecution = await di_1.Container.get(execution_service_1.ExecutionService).retry(req, sharedWorkflowsIds);
                di_1.Container.get(event_service_1.EventService).emit('user-retried-execution', {
                    userId: req.user.id,
                    publicApi: true,
                });
                return res.json((0, n8n_workflow_1.replaceCircularReferences)(retriedExecution));
            }
            catch (error) {
                if (error instanceof queued_execution_retry_error_1.QueuedExecutionRetryError ||
                    error instanceof aborted_execution_retry_error_1.AbortedExecutionRetryError) {
                    return res.status(409).json({ message: error.message });
                }
                else if (error instanceof not_found_error_1.NotFoundError) {
                    return res.status(404).json({ message: error.message });
                }
                else {
                    throw error;
                }
            }
        },
    ],
    getExecutionTags: [
        (0, global_middleware_1.apiKeyHasScope)('executionTags:list'),
        async (req, res) => {
            const { id } = req.params;
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:read']);
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const execution = await di_1.Container.get(db_1.ExecutionRepository).getExecutionInWorkflowsForPublicApi(id, sharedWorkflowsIds, false);
            if (!execution) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const tags = await (0, executions_service_1.getExecutionTags)(id);
            return res.json(tags);
        },
    ],
    updateExecutionTags: [
        (0, global_middleware_1.apiKeyHasScope)('executionTags:update'),
        async (req, res) => {
            const { id } = req.params;
            const newTagIds = req.body.map((tag) => tag.id);
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:update']);
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const execution = await di_1.Container.get(db_1.ExecutionRepository).getExecutionInWorkflowsForPublicApi(id, sharedWorkflowsIds, false);
            if (!execution) {
                return res.status(404).json({ message: 'Not Found' });
            }
            try {
                const updatedTags = await (0, executions_service_1.updateExecutionTags)(id, newTagIds);
                const tags = (0, executions_service_1.mapAnnotationTags)(updatedTags);
                return res.json(tags);
            }
            catch (error) {
                if (error instanceof typeorm_1.QueryFailedError) {
                    return res.status(404).json({ message: 'Some tags not found' });
                }
                throw error;
            }
        },
    ],
    stopExecution: [
        (0, global_middleware_1.apiKeyHasScope)('execution:stop'),
        async (req, res) => {
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:execute']);
            if (!sharedWorkflowsIds.length) {
                return res.status(404).json({ message: 'Not Found' });
            }
            const { id } = req.params;
            try {
                const stopResult = await di_1.Container.get(execution_service_1.ExecutionService).stop(id, sharedWorkflowsIds);
                return res.json((0, n8n_workflow_1.replaceCircularReferences)(stopResult));
            }
            catch (error) {
                if (error instanceof missing_execution_stop_error_1.MissingExecutionStopError) {
                    return res.status(404).json({ message: 'Not Found' });
                }
                else if (error instanceof not_found_error_1.NotFoundError) {
                    return res.status(404).json({ message: error.message });
                }
                else {
                    throw error;
                }
            }
        },
    ],
    stopManyExecutions: [
        (0, global_middleware_1.apiKeyHasScope)('execution:stop'),
        async (req, res) => {
            const { status: rawStatus, workflowId, startedAfter, startedBefore } = req.body;
            const status = rawStatus.map((x) => (x === 'queued' ? 'new' : x));
            if (!status || status.length === 0) {
                return res.status(400).json({
                    message: 'Status filter is required. Please provide at least one status to stop executions.',
                    example: {
                        status: ['running', 'waiting', 'queued'],
                    },
                });
            }
            const sharedWorkflowsIds = await (0, workflows_service_1.getSharedWorkflowIds)(req.user, ['workflow:execute']);
            if (!sharedWorkflowsIds.length) {
                return res.json({ stopped: 0 });
            }
            if (workflowId && workflowId !== 'all' && !sharedWorkflowsIds.includes(workflowId)) {
                return res.status(404).json({ message: 'Workflow not found or not accessible' });
            }
            const filter = {
                workflowId: workflowId ?? 'all',
                status,
                startedAfter,
                startedBefore,
            };
            const stopped = await di_1.Container.get(execution_service_1.ExecutionService).stopMany(filter, sharedWorkflowsIds);
            return res.json({ stopped });
        },
    ],
};
//# sourceMappingURL=executions.handler.js.map