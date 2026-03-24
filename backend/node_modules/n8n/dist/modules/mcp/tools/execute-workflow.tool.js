"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWorkflow = exports.createExecuteWorkflowTool = void 0;
const constants_1 = require("@n8n/constants");
const n8n_workflow_1 = require("n8n-workflow");
const zod_1 = __importDefault(require("zod"));
const mcp_constants_1 = require("../mcp.constants");
const mcp_errors_1 = require("../mcp.errors");
const mcp_utils_1 = require("../mcp.utils");
const workflow_validation_utils_1 = require("./workflow-validation.utils");
const WORKFLOW_EXECUTION_TIMEOUT_MS = 5 * constants_1.Time.minutes.toMilliseconds;
const inputSchema = zod_1.default.object({
    workflowId: zod_1.default.string().describe('The ID of the workflow to execute'),
    executionMode: zod_1.default
        .enum(['manual', 'production'])
        .optional()
        .default('production')
        .describe('Use "manual" to test the current version of the workflow. Use "production" to execute the published (active) version.'),
    inputs: zod_1.default
        .discriminatedUnion('type', [
        zod_1.default.object({
            type: zod_1.default.literal('chat'),
            chatInput: zod_1.default.string().describe('Input for chat-based workflows'),
        }),
        zod_1.default.object({
            type: zod_1.default.literal('form'),
            formData: zod_1.default.record(zod_1.default.unknown()).describe('Input data for form-based workflows'),
        }),
        zod_1.default.object({
            type: zod_1.default.literal('webhook'),
            webhookData: zod_1.default
                .object({
                method: zod_1.default
                    .enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
                    .optional()
                    .default('GET')
                    .describe('HTTP method (defaults to GET)'),
                query: zod_1.default.record(zod_1.default.string()).optional().describe('Query string parameters'),
                body: zod_1.default
                    .record(zod_1.default.unknown())
                    .optional()
                    .describe('Request body data (main webhook payload)'),
                headers: zod_1.default
                    .record(zod_1.default.string())
                    .optional()
                    .describe('HTTP headers (e.g., authorization, content-type)'),
            })
                .describe('Input data for webhook-based workflows'),
        }),
    ])
        .optional()
        .describe('Inputs to provide to the workflow.'),
});
const outputSchema = {
    executionId: zod_1.default.string().nullable(),
    status: zod_1.default
        .enum(['success', 'error', 'running', 'waiting', 'canceled', 'crashed', 'new', 'unknown'])
        .describe('The status of the execution'),
    error: zod_1.default.string().optional().describe('Error message if the execution failed'),
};
const createExecuteWorkflowTool = (user, workflowFinderService, activeExecutions, workflowRunner, telemetry, mcpService) => ({
    name: 'execute_workflow',
    config: {
        description: 'Execute a workflow by ID. Returns execution ID and status. To get the full execution results, use the get_execution tool with the returned execution ID. Before executing always ensure you know the input schema by first using the get_workflow_details tool and consulting workflow description',
        inputSchema: inputSchema.shape,
        outputSchema,
        annotations: {
            title: 'Execute Workflow',
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    },
    handler: async ({ workflowId, executionMode, inputs }) => {
        const telemetryPayload = {
            user_id: user.id,
            tool_name: 'execute_workflow',
            parameters: { workflowId, executionMode, inputs: getInputMetaData(inputs) },
        };
        try {
            const output = await (0, exports.executeWorkflow)(user, workflowFinderService, activeExecutions, workflowRunner, mcpService, workflowId, inputs, executionMode);
            telemetryPayload.results = {
                success: output.status === 'success',
                data: {
                    executionId: output.executionId,
                    status: output.status,
                },
            };
            if (output.status === 'error' && output.error) {
                telemetryPayload.results.error = output.error;
            }
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            return {
                content: [{ type: 'text', text: (0, n8n_workflow_1.jsonStringify)(output) }],
                structuredContent: output,
            };
        }
        catch (er) {
            const error = (0, n8n_workflow_1.ensureError)(er);
            const isTimeout = error instanceof mcp_errors_1.McpExecutionTimeoutError;
            const isAccessError = error instanceof mcp_errors_1.WorkflowAccessError;
            const errorInfo = {
                message: error.message || 'Unknown error',
                name: error.constructor.name,
            };
            if ('extra' in error && error.extra) {
                errorInfo.extra = error.extra;
            }
            if (error.cause) {
                errorInfo.cause =
                    error.cause instanceof Error ? error.cause.message : (0, n8n_workflow_1.jsonStringify)(error.cause);
            }
            const output = {
                executionId: isTimeout ? error.executionId : null,
                status: 'error',
                error: isTimeout
                    ? `Workflow execution timed out after ${WORKFLOW_EXECUTION_TIMEOUT_MS / constants_1.Time.milliseconds.toSeconds} seconds (Enforced MCP timeout)`
                    : (error.message ?? `${error.constructor.name}: (no message)`),
            };
            telemetryPayload.results = {
                success: false,
                error: isTimeout ? 'Workflow execution timed out' : errorInfo,
                error_reason: isAccessError ? error.reason : undefined,
            };
            telemetry.track(mcp_constants_1.USER_CALLED_MCP_TOOL_EVENT, telemetryPayload);
            return {
                content: [{ type: 'text', text: (0, n8n_workflow_1.jsonStringify)(output) }],
                structuredContent: output,
            };
        }
    },
});
exports.createExecuteWorkflowTool = createExecuteWorkflowTool;
const executeWorkflow = async (user, workflowFinderService, activeExecutions, workflowRunner, mcpService, workflowId, inputs, executionMode = 'production') => {
    const workflow = await (0, workflow_validation_utils_1.getMcpWorkflow)(workflowId, user, ['workflow:execute'], workflowFinderService, { includeActiveVersion: true });
    const runData = await buildRunData(workflow, user.id, workflowId, executionMode, inputs, mcpService);
    const executionId = await workflowRunner.run(runData);
    const data = await waitForExecutionResult(executionId, activeExecutions, mcpService);
    const hasError = data.status === 'error' || data.data.resultData?.error;
    return {
        executionId,
        status: hasError ? 'error' : data.status,
        error: hasError
            ? (data.data.resultData?.error?.message ?? 'Execution completed with errors')
            : undefined,
    };
};
exports.executeWorkflow = executeWorkflow;
const getVersionDataForExecution = (workflow, workflowId, executionMode) => {
    if (executionMode === 'production' && !workflow.activeVersionId) {
        throw new mcp_errors_1.WorkflowAccessError(`Workflow '${workflowId}' has no published (active) version to execute`, 'workflow_not_active');
    }
    const nodes = executionMode === 'production' ? (workflow.activeVersion?.nodes ?? []) : (workflow.nodes ?? []);
    const connections = executionMode === 'production'
        ? (workflow.activeVersion?.connections ?? {})
        : (workflow.connections ?? {});
    return { nodes, connections };
};
const buildRunData = async (workflow, userId, workflowId, executionMode, inputs, mcpService) => {
    const { nodes, connections } = getVersionDataForExecution(workflow, workflowId, executionMode);
    const triggerNode = (0, mcp_utils_1.findMcpSupportedTrigger)(nodes, executionMode);
    if (!triggerNode) {
        throw new mcp_errors_1.WorkflowAccessError(`Only workflows with the following trigger nodes can be executed: ${getSupportedTriggerNamesForMode(executionMode).join(', ')}.`, 'unsupported_trigger');
    }
    const mcpMessageId = `mcp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const isManualExecution = executionMode === 'manual';
    const runData = {
        executionMode: isManualExecution ? 'manual' : getExecutionModeForTrigger(triggerNode),
        workflowData: { ...workflow, nodes, connections },
        userId,
        isMcpExecution: mcpService.isQueueMode,
        mcpType: 'service',
        mcpSessionId: mcpMessageId,
        mcpMessageId,
    };
    runData.startNodes = [{ name: triggerNode.name, sourceData: null }];
    const triggerPinData = await getPinDataForTrigger(triggerNode, inputs);
    const workflowPinData = isManualExecution ? (workflow.pinData ?? {}) : {};
    runData.pinData = { ...triggerPinData, ...workflowPinData };
    runData.executionData = (0, n8n_workflow_1.createRunExecutionData)({
        startData: {},
        resultData: {
            pinData: runData.pinData,
            runData: {},
        },
        executionData: {
            contextData: {},
            metadata: {},
            nodeExecutionStack: [
                {
                    node: triggerNode,
                    data: {
                        main: [runData.pinData[triggerNode.name]],
                    },
                    source: null,
                },
            ],
            waitingExecution: {},
            waitingExecutionSource: {},
        },
    });
    return runData;
};
const waitForExecutionResult = async (executionId, activeExecutions, mcpService) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new mcp_errors_1.McpExecutionTimeoutError(executionId, WORKFLOW_EXECUTION_TIMEOUT_MS));
        }, WORKFLOW_EXECUTION_TIMEOUT_MS);
    });
    const resultPromise = mcpService.isQueueMode
        ? mcpService.createPendingResponse(executionId).promise
        : activeExecutions.getPostExecutePromise(executionId);
    try {
        const data = await Promise.race([resultPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        if (data === undefined) {
            throw new n8n_workflow_1.UnexpectedError('Workflow did not return any data');
        }
        return data;
    }
    catch (error) {
        if (timeoutId)
            clearTimeout(timeoutId);
        if (mcpService.isQueueMode) {
            mcpService.removePendingResponse(executionId);
        }
        if (error instanceof mcp_errors_1.McpExecutionTimeoutError) {
            try {
                const cancellationError = new n8n_workflow_1.TimeoutExecutionCancelledError(error.executionId);
                activeExecutions.stopExecution(error.executionId, cancellationError);
            }
            catch (stopError) {
                throw new n8n_workflow_1.UnexpectedError(`Failed to stop timed-out execution [id: ${error.executionId}]: ${(0, n8n_workflow_1.ensureError)(stopError).message}`);
            }
        }
        throw error;
    }
};
const getExecutionModeForTrigger = (node) => {
    switch (node.type) {
        case n8n_workflow_1.WEBHOOK_NODE_TYPE:
            return 'webhook';
        case n8n_workflow_1.CHAT_TRIGGER_NODE_TYPE:
            return 'chat';
        case n8n_workflow_1.MANUAL_TRIGGER_NODE_TYPE:
            return 'manual';
        case n8n_workflow_1.FORM_TRIGGER_NODE_TYPE:
            return 'trigger';
        default:
            return 'trigger';
    }
};
const getPinDataForTrigger = async (node, inputs) => {
    switch (node.type) {
        case n8n_workflow_1.MANUAL_TRIGGER_NODE_TYPE:
            return {
                [node.name]: [{ json: {} }],
            };
        case n8n_workflow_1.WEBHOOK_NODE_TYPE: {
            const webhookData = inputs?.type === 'webhook' ? inputs.webhookData : undefined;
            return {
                [node.name]: [
                    {
                        json: {
                            headers: webhookData?.headers ?? {},
                            query: webhookData?.query ?? {},
                            body: webhookData?.body ?? {},
                        },
                    },
                ],
            };
        }
        case n8n_workflow_1.CHAT_TRIGGER_NODE_TYPE:
            if (!inputs || inputs.type !== 'chat')
                return {};
            return {
                [node.name]: [
                    {
                        json: {
                            sessionId: `mcp-session-${Date.now()}`,
                            action: 'sendMessage',
                            chatInput: inputs.chatInput,
                        },
                    },
                ],
            };
        case n8n_workflow_1.FORM_TRIGGER_NODE_TYPE:
            if (!inputs || inputs.type !== 'form')
                return {};
            return {
                [node.name]: [
                    {
                        json: {
                            submittedAt: new Date().toISOString(),
                            formMode: 'mcp',
                            ...(inputs.formData ?? {}),
                        },
                    },
                ],
            };
        case n8n_workflow_1.SCHEDULE_TRIGGER_NODE_TYPE: {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const moment = (await Promise.resolve().then(() => __importStar(require('moment-timezone')))).default;
            const momentTz = moment.tz(timezone);
            return {
                [node.name]: [
                    {
                        json: {
                            timestamp: momentTz.toISOString(true),
                            'Readable date': momentTz.format('MMMM Do YYYY, h:mm:ss a'),
                            'Readable time': momentTz.format('h:mm:ss a'),
                            'Day of week': momentTz.format('dddd'),
                            Year: momentTz.format('YYYY'),
                            Month: momentTz.format('MMMM'),
                            'Day of month': momentTz.format('DD'),
                            Hour: momentTz.format('HH'),
                            Minute: momentTz.format('mm'),
                            Second: momentTz.format('ss'),
                            Timezone: `${timezone} (UTC${momentTz.format('Z')})`,
                        },
                    },
                ],
            };
        }
        default:
            return {};
    }
};
const getSupportedTriggerNamesForMode = (executionMode) => {
    return executionMode === 'production'
        ? Object.values(mcp_constants_1.SUPPORTED_PRODUCTION_MCP_TRIGGERS)
        : Object.values(mcp_constants_1.SUPPORTED_MCP_TRIGGERS);
};
const getInputMetaData = (inputs) => {
    if (!inputs) {
        return undefined;
    }
    switch (inputs.type) {
        case 'chat':
            return {
                type: 'chat',
                parameter_count: 1,
            };
        case 'form':
            return {
                type: 'form',
                parameter_count: Object.keys(inputs.formData ?? {}).length,
            };
        case 'webhook':
            return {
                type: 'webhook',
                parameter_count: [
                    inputs.webhookData?.body ? Object.keys(inputs.webhookData.body).length : 0,
                    inputs.webhookData?.query ? Object.keys(inputs.webhookData.query).length : 0,
                    inputs.webhookData?.headers ? Object.keys(inputs.webhookData.headers).length : 0,
                ].reduce((a, b) => a + b, 0),
            };
        default:
            return undefined;
    }
};
//# sourceMappingURL=execute-workflow.tool.js.map