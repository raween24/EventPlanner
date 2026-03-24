"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardrailsV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const execute_1 = require("../actions/execute");
const description_1 = require("../description");
const configureNodeInputs_1 = require("../helpers/configureNodeInputs");
class GuardrailsV2 {
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            version: [2],
            inputs: `={{(${configureNodeInputs_1.configureNodeInputsV2})($parameter)}}`,
            outputs: `={{
		((parameters) => {
			const operation = parameters.operation ?? 'classify';

			if (operation === 'classify') {
				return [{displayName: "Pass", type: "${n8n_workflow_1.NodeConnectionTypes.Main}"}, {displayName: "Fail", type: "${n8n_workflow_1.NodeConnectionTypes.Main}"}]
			}

			return [{ displayName: "", type: "${n8n_workflow_1.NodeConnectionTypes.Main}"}]
		})($parameter)
	}}`,
            defaults: {
                name: 'Guardrails',
            },
            properties: description_1.propertiesDescription,
            builderHint: {
                inputs: {
                    ai_languageModel: {
                        required: true,
                        displayOptions: {
                            show: {
                                '/guardrails.(jailbreak|nsfw|topicalAlignment|custom)': [
                                    { _cnd: { exists: true } },
                                ],
                            },
                        },
                    },
                },
                message: 'Classify operation has two outputs: output 0 (Pass) for items that passed all guardrail checks, output 1 (Fail) for items that failed. Use .output(index).to() to connect from a specific output. @example guardrails.output(0).to(passNode) and guardrails.output(1).to(failNode). Sanitize operation has only one output.',
            },
        };
    }
    async execute() {
        return await execute_1.execute.call(this);
    }
}
exports.GuardrailsV2 = GuardrailsV2;
//# sourceMappingURL=GuardrailsV2.node.js.map