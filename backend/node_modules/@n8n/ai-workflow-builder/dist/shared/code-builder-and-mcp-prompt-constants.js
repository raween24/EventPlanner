"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKFLOW_RULES = exports.ADDITIONAL_FUNCTIONS = exports.EXPRESSION_REFERENCE = void 0;
exports.EXPRESSION_REFERENCE = `Available variables inside \`expr('{{ ... }}')\`:

- \`$json\` — current item's JSON data from the immediate predecessor node
- \`$('NodeName').item.json\` — access any node's output by name
- \`$input.first()\` — first item from immediate predecessor
- \`$input.all()\` — all items from immediate predecessor
- \`$input.item\` — current item being processed
- \`$binary\` — binary data of current item from immediate predecessor
- \`$now\` — current date/time (Luxon DateTime). Example: \`$now.toISO()\`
- \`$today\` — start of today (Luxon DateTime). Example: \`$today.plus(1, 'days')\`
- \`$itemIndex\` — index of current item being processed
- \`$runIndex\` — current run index
- \`$execution.id\` — unique execution ID
- \`$execution.mode\` — 'test' or 'production'
- \`$workflow.id\` — workflow ID
- \`$workflow.name\` — workflow name

String composition — variables MUST always be inside \`{{ }}\`, never outside as JS variables:

- \`expr('Hello {{ $json.name }}, welcome!')\` — variable embedded in text
- \`expr('Report for {{ $now.toFormat("MMMM d, yyyy") }} - {{ $json.title }}')\` — multiple variables with method call
- \`expr('{{ $json.firstName }} {{ $json.lastName }}')\` — combining multiple fields
- \`expr('Total: {{ $json.items.length }} items, updated {{ $now.toISO() }}')\` — expressions with method calls
- \`expr('Status: {{ $json.count > 0 ? "active" : "empty" }}')\` — inline ternary

Dynamic data from other nodes — \`$()\` MUST always be inside \`{{ }}\`, never used as plain JavaScript:

- WRONG: \`expr('{{ ' + JSON.stringify($('Source').all().map(i => i.json.name)) + ' }}')\` — $() outside {{ }}
- CORRECT: \`expr('{{ $("Source").all().map(i => ({ option: i.json.name })) }}')\` — $() inside {{ }}
- CORRECT: \`expr('{{ { "fields": [{ "values": $("Fetch Projects").all().map(i => ({ option: i.json.name })) }] } }}')\` — complex JSON inside {{ }}`;
exports.ADDITIONAL_FUNCTIONS = `Additional SDK functions:

- \`placeholder('hint')\` — marks a parameter value for user input. Use directly as the parameter value — never wrap in \`expr()\`, objects, or arrays.
  Example: \`parameters: { url: placeholder('Your API URL (e.g. https://api.example.com/v1)') }\`

- \`sticky('content', nodes?, config?)\` — creates a sticky note on the canvas.
  Example: \`sticky('## Data Processing', [httpNode, setNode], { color: 2 })\`

- \`.output(n)\` — selects a specific output index for multi-output nodes. IF and Switch have dedicated methods (\`onTrue/onFalse\`, \`onCase\`), but \`.output(n)\` works as a generic alternative.
  Example: \`classifier.output(1).to(categoryB)\`

- \`.onError(handler)\` — connects a node's error output to a handler node. Requires \`onError: 'continueErrorOutput'\` in the node config.
  Example: \`httpNode.onError(errorHandler)\` (with \`config: { onError: 'continueErrorOutput' }\`)

- Additional subnode factories (all follow the same pattern as \`languageModel()\` and \`tool()\`):
  \`memory()\`, \`outputParser()\`, \`embeddings()\`, \`vectorStore()\`, \`retriever()\`, \`documentLoader()\`, \`textSplitter()\``;
exports.WORKFLOW_RULES = `Follow these rules strictly when generating workflows:

1. **Always use newCredential() for authentication**
   - When a node needs credentials, always use \`newCredential('Name')\` in the credentials config
   - NEVER use placeholder strings, fake API keys, or hardcoded auth values
   - Example: \`credentials: { slackApi: newCredential('Slack Bot') }\`
   - The credential type must match what the node expects`;
//# sourceMappingURL=code-builder-and-mcp-prompt-constants.js.map