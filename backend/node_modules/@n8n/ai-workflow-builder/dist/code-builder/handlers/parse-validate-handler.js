"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseValidateHandler = void 0;
const workflow_sdk_1 = require("@n8n/workflow-sdk");
const extract_code_1 = require("../utils/extract-code");
class ParseValidateHandler {
    logger;
    generatePinData;
    constructor(config = {}) {
        this.logger = config.logger;
        this.generatePinData = config.generatePinData ?? true;
    }
    collectValidationIssues(issues, allWarnings, context, logLevel) {
        if (issues.length === 0)
            return;
        if (logLevel === 'warn') {
            this.logger?.warn(`Graph validation ${context.toLowerCase()}`, {
                [context.toLowerCase()]: issues.map((i) => i.message),
            });
        }
        else {
            this.logger?.info(`Graph validation ${context.toLowerCase()}`, {
                [context.toLowerCase()]: issues.map((i) => i.message),
            });
        }
        for (const issue of issues) {
            allWarnings.push({
                code: issue.code,
                message: issue.message,
                nodeName: issue.nodeName,
            });
        }
    }
    validateExistingWorkflow(json) {
        if (json.nodes.length === 0) {
            return [];
        }
        const builder = workflow_sdk_1.workflow.fromJSON(json);
        const allWarnings = [];
        const graphValidation = builder.validate();
        this.collectValidationIssues(graphValidation.errors, allWarnings, 'GRAPH VALIDATION ERRORS', 'warn');
        this.collectValidationIssues(graphValidation.warnings, allWarnings, 'GRAPH VALIDATION WARNINGS', 'info');
        return allWarnings;
    }
    async parseAndValidate(code, currentWorkflow) {
        const codeToParse = (0, extract_code_1.stripImportStatements)(code);
        try {
            this.logger?.debug('Parsing WorkflowCode', { codeLength: codeToParse.length });
            const builder = (0, workflow_sdk_1.parseWorkflowCodeToBuilder)(codeToParse);
            builder.regenerateNodeIds();
            const allWarnings = [];
            const graphValidation = builder.validate();
            this.collectValidationIssues(graphValidation.errors, allWarnings, 'GRAPH VALIDATION ERRORS', 'warn');
            this.collectValidationIssues(graphValidation.warnings, allWarnings, 'GRAPH VALIDATION WARNINGS', 'info');
            const json = builder.toJSON();
            const validationResult = (0, workflow_sdk_1.validateWorkflow)(json);
            this.collectValidationIssues(validationResult.errors, allWarnings, 'JSON VALIDATION ERRORS', 'warn');
            this.collectValidationIssues(validationResult.warnings, allWarnings, 'JSON VALIDATION WARNINGS', 'info');
            if (this.generatePinData) {
                builder.generatePinData({ beforeWorkflow: currentWorkflow });
            }
            const workflowJson = builder.toJSON();
            this.logger?.debug('Parsed workflow', {
                id: workflowJson.id,
                name: workflowJson.name,
                nodeCount: workflowJson.nodes.length,
            });
            return { workflow: workflowJson, warnings: allWarnings };
        }
        catch (error) {
            this.logger?.error('Failed to parse WorkflowCode', {
                error: error instanceof Error ? error.message : String(error),
                code: code.substring(0, 500),
            });
            throw new Error(`Failed to parse generated workflow code: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getErrorContext(code, errorMessage) {
        const lineMatch = errorMessage.match(/(?:line|Line)\s*(\d+)/i);
        if (!lineMatch) {
            const lines = code.split('\n').slice(0, 10);
            return `Code context:\n${lines.map((l, i) => `${i + 1}: ${l}`).join('\n')}`;
        }
        const errorLine = parseInt(lineMatch[1], 10);
        const lines = code.split('\n');
        const start = Math.max(0, errorLine - 4);
        const end = Math.min(lines.length, errorLine + 3);
        const context = lines
            .slice(start, end)
            .map((l, i) => {
            const lineNum = start + i + 1;
            const marker = lineNum === errorLine ? '> ' : '  ';
            return `${marker}${lineNum}: ${l}`;
        })
            .join('\n');
        const contextText = `Code around line ${errorLine}:\n${context}`;
        const hint = this.detectFixHint(lines, errorLine);
        if (hint) {
            return `${contextText}\n\n${hint}`;
        }
        return contextText;
    }
    detectFixHint(lines, errorLine) {
        const searchStart = Math.max(0, errorLine - 5);
        const searchEnd = Math.min(lines.length, errorLine + 5);
        const nearbyCode = lines.slice(searchStart, searchEnd).join('\n');
        if (/expr\s*\(\s*`[^`]*\$\{\{/.test(nearbyCode)) {
            return ("HINT: The '$' before '{{' inside a backtick template literal is interpreted as JS template interpolation. " +
                "Use single quotes instead of backticks for expr(), e.g. expr('Amount: ${{ $json.amount }}'). " +
                'Fix ALL occurrences in the file at once.');
        }
        return null;
    }
}
exports.ParseValidateHandler = ParseValidateHandler;
//# sourceMappingURL=parse-validate-handler.js.map