"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFilesColumnToChatHubAgents1771500000002 = void 0;
const table = 'chat_hub_agents';
class AddFilesColumnToChatHubAgents1771500000002 {
    async up({ schemaBuilder: { addColumns, column } }) {
        await addColumns(table, [column('files').json.notNull.default("'[]'")]);
    }
    async down({ schemaBuilder: { dropColumns } }) {
        await dropColumns(table, ['files']);
    }
}
exports.AddFilesColumnToChatHubAgents1771500000002 = AddFilesColumnToChatHubAgents1771500000002;
//# sourceMappingURL=1771500000002-AddFilesColumnToChatHubAgents.js.map