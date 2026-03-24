"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEditorHandler = void 0;
exports.formatCodeWithLineNumbers = formatCodeWithLineNumbers;
exports.findDivergenceContext = findDivergenceContext;
const text_editor_types_1 = require("./text-editor.types");
const WORKFLOW_FILE_PATH = '/workflow.js';
const PREVIEW_MAX_LENGTH = 80;
function truncatePreview(str) {
    if (str.length <= PREVIEW_MAX_LENGTH)
        return str;
    return str.slice(0, PREVIEW_MAX_LENGTH) + '...';
}
function formatCodeWithLineNumbers(code) {
    const lines = code.split('\n');
    return lines.map((line, i) => `${i + 1}: ${line}`).join('\n');
}
const MIN_PREFIX_LENGTH = 10;
const CONTEXT_LINES = 3;
const OLD_STR_CONTEXT_LENGTH = 40;
function escapeWhitespace(str) {
    return str.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r');
}
function findDivergenceContext(code, searchStr) {
    let lo = 0;
    let hi = searchStr.length;
    while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (code.includes(searchStr.substring(0, mid))) {
            lo = mid;
        }
        else {
            hi = mid - 1;
        }
    }
    const matchLength = lo;
    if (matchLength < MIN_PREFIX_LENGTH)
        return undefined;
    const matchPos = code.indexOf(searchStr.substring(0, matchLength));
    const divergePos = matchPos + matchLength;
    const percentage = Math.round((matchLength / searchStr.length) * 100);
    const codeUpToDiverge = code.substring(0, divergePos);
    const divergeLine = codeUpToDiverge.split('\n').length;
    const oldStrRemainder = searchStr.substring(matchLength, matchLength + OLD_STR_CONTEXT_LENGTH);
    const oldStrPrefix = searchStr.substring(Math.max(0, matchLength - 20), matchLength);
    const codeLines = code.split('\n');
    const startLine = Math.max(0, divergeLine - CONTEXT_LINES);
    const endLine = Math.min(codeLines.length, divergeLine + 1);
    const fileContext = codeLines
        .slice(startLine, endLine)
        .map((line, i) => `    ${startLine + i + 1}: ${line}`)
        .join('\n');
    return (`Closest match (${percentage}% of old_str matched, diverges at line ${divergeLine}):\n` +
        `  old_str: ...${escapeWhitespace(oldStrPrefix)}>>> ${escapeWhitespace(oldStrRemainder)}\n` +
        `  file:\n${fileContext}`);
}
class TextEditorHandler {
    code = null;
    constructor() { }
    execute(command) {
        if (command.command === 'create' && command.path !== WORKFLOW_FILE_PATH) {
            throw new Error('Cannot create multiple workflows. You can only extend the existing workflow at /workflow.js.');
        }
        this.validatePath(command.path);
        let result;
        switch (command.command) {
            case 'view':
                result = this.handleView(command);
                break;
            case 'create':
                result = this.handleCreate(command);
                break;
            case 'str_replace':
                result = this.handleStrReplace(command);
                break;
            case 'insert':
                result = this.handleInsert(command);
                break;
            default:
                result = `Unknown command: ${command.command}`;
        }
        return result;
    }
    validatePath(path) {
        if (path !== WORKFLOW_FILE_PATH) {
            throw new text_editor_types_1.InvalidPathError(path);
        }
    }
    handleView(command) {
        if (!this.code) {
            throw new text_editor_types_1.FileNotFoundError();
        }
        const lines = this.code.split('\n');
        if (command.view_range) {
            const [start, rawEnd] = command.view_range;
            const end = rawEnd === -1 ? lines.length : rawEnd;
            if (start < 1 || start > lines.length) {
                throw new text_editor_types_1.InvalidLineNumberError(start, lines.length);
            }
            if (end < start) {
                throw new text_editor_types_1.InvalidViewRangeError(start, end, lines.length);
            }
            const startIdx = start - 1;
            const endIdx = Math.min(end, lines.length);
            const selectedLines = lines.slice(startIdx, endIdx);
            return selectedLines.map((line, i) => `${startIdx + i + 1}: ${line}`).join('\n');
        }
        return formatCodeWithLineNumbers(this.code);
    }
    handleCreate(command) {
        this.code = command.file_text;
        return 'File created successfully.';
    }
    handleStrReplace(command) {
        if (this.code === null) {
            throw new text_editor_types_1.FileNotFoundError();
        }
        const { old_str, new_str } = command;
        const count = this.countOccurrences(this.code, old_str);
        if (count === 0) {
            const normalized = old_str.endsWith('\n') ? old_str.slice(0, -1) : old_str + '\n';
            const normalizedCount = this.countOccurrences(this.code, normalized);
            if (normalizedCount === 1) {
                const escapedNew = new_str.replace(/\$/g, '$$$$');
                this.code = this.code.replace(normalized, escapedNew);
                return 'Edit applied successfully.';
            }
            const context = findDivergenceContext(this.code, old_str);
            throw new text_editor_types_1.NoMatchFoundError(old_str, context);
        }
        if (count > 1) {
            throw new text_editor_types_1.MultipleMatchesError(count);
        }
        const escapedNewStr = new_str.replace(/\$/g, '$$$$');
        this.code = this.code.replace(old_str, escapedNewStr);
        return 'Edit applied successfully.';
    }
    handleInsert(command) {
        if (this.code === null) {
            throw new text_editor_types_1.FileNotFoundError();
        }
        const { insert_line, insert_text } = command;
        const lines = this.code.split('\n');
        if (insert_line < 0 || insert_line > lines.length) {
            throw new text_editor_types_1.InvalidLineNumberError(insert_line, lines.length);
        }
        lines.splice(insert_line, 0, insert_text);
        this.code = lines.join('\n');
        return 'Text inserted successfully.';
    }
    countOccurrences(text, search) {
        if (search.length === 0) {
            return 0;
        }
        let count = 0;
        let pos = 0;
        while ((pos = text.indexOf(search, pos)) !== -1) {
            count++;
            pos += search.length;
        }
        return count;
    }
    executeBatch(replacements) {
        if (this.code === null) {
            throw new text_editor_types_1.FileNotFoundError();
        }
        if (replacements.length === 0) {
            return 'No replacements to apply.';
        }
        const snapshot = this.code;
        const results = [];
        for (let i = 0; i < replacements.length; i++) {
            const { old_str, new_str } = replacements[i];
            const preview = truncatePreview(old_str);
            const count = this.countOccurrences(this.code, old_str);
            if (count === 0) {
                this.code = snapshot;
                results.push({
                    index: i,
                    old_str: preview,
                    status: 'failed',
                    error: new text_editor_types_1.NoMatchFoundError(old_str).message,
                });
                for (let j = i + 1; j < replacements.length; j++) {
                    results.push({
                        index: j,
                        old_str: truncatePreview(replacements[j].old_str),
                        status: 'not_attempted',
                    });
                }
                return results;
            }
            if (count > 1) {
                this.code = snapshot;
                results.push({
                    index: i,
                    old_str: preview,
                    status: 'failed',
                    error: new text_editor_types_1.MultipleMatchesError(count).message,
                });
                for (let j = i + 1; j < replacements.length; j++) {
                    results.push({
                        index: j,
                        old_str: truncatePreview(replacements[j].old_str),
                        status: 'not_attempted',
                    });
                }
                return results;
            }
            const escapedNewStr = new_str.replace(/\$/g, '$$$$');
            this.code = this.code.replace(old_str, escapedNewStr);
            results.push({ index: i, old_str: preview, status: 'success' });
        }
        return `All ${replacements.length} replacements applied successfully.`;
    }
    getWorkflowCode() {
        return this.code;
    }
    setWorkflowCode(code) {
        this.code = code;
    }
    hasWorkflowCode() {
        return this.code !== null;
    }
    clearWorkflowCode() {
        this.code = null;
    }
}
exports.TextEditorHandler = TextEditorHandler;
//# sourceMappingURL=text-editor-handler.js.map