"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsAgentProperties = void 0;
const ai_utilities_1 = require("@n8n/ai-utilities");
const options_1 = require("../options");
const enableStreaminOption = {
    displayName: 'Enable Streaming',
    name: 'enableStreaming',
    type: 'boolean',
    default: true,
    description: 'Whether this agent will stream the response in real-time as it generates text',
};
const maxTokensFromMemoryOption = {
    displayName: 'Max Tokens To Read From Memory',
    name: 'maxTokensFromMemory',
    type: 'hidden',
    default: 0,
    description: 'The maximum number of tokens to read from the chat memory history. Set to 0 to read all history.',
};
exports.toolsAgentProperties = {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    default: {},
    placeholder: 'Add Option',
    options: [
        ...options_1.commonOptions,
        enableStreaminOption,
        (0, ai_utilities_1.getBatchingOptionFields)(undefined, 1),
        maxTokensFromMemoryOption,
    ],
};
//# sourceMappingURL=description.js.map