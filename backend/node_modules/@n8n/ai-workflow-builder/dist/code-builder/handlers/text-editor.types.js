"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchReplacementError = exports.FileNotFoundError = exports.FileExistsError = exports.InvalidPathError = exports.InvalidViewRangeError = exports.InvalidLineNumberError = exports.MultipleMatchesError = exports.NoMatchFoundError = void 0;
class NoMatchFoundError extends Error {
    constructor(_searchStr, nearMatchContext) {
        const base = 'No exact match found for str_replace. The old_str content was not found in the file.';
        const message = nearMatchContext ? `${base}\n${nearMatchContext}` : base;
        super(message);
        this.name = 'NoMatchFoundError';
    }
}
exports.NoMatchFoundError = NoMatchFoundError;
class MultipleMatchesError extends Error {
    constructor(count) {
        super(`Found ${count} matches. Please provide more context to make the replacement unique.`);
        this.name = 'MultipleMatchesError';
    }
}
exports.MultipleMatchesError = MultipleMatchesError;
class InvalidLineNumberError extends Error {
    constructor(line, maxLine) {
        super(`Invalid line number ${line}. File has ${maxLine} lines (valid range: 0-${maxLine}).`);
        this.name = 'InvalidLineNumberError';
    }
}
exports.InvalidLineNumberError = InvalidLineNumberError;
class InvalidViewRangeError extends Error {
    constructor(start, end, maxLine) {
        super(`Invalid view range: end (${end}) must be >= start (${start}). File has ${maxLine} lines (valid range: 1-${maxLine}).`);
        this.name = 'InvalidViewRangeError';
    }
}
exports.InvalidViewRangeError = InvalidViewRangeError;
class InvalidPathError extends Error {
    constructor(path) {
        super(`Invalid path "${path}". Only /workflow.js is supported.`);
        this.name = 'InvalidPathError';
    }
}
exports.InvalidPathError = InvalidPathError;
class FileExistsError extends Error {
    constructor() {
        super('File already exists. Use text editor tools to modify existing content.');
        this.name = 'FileExistsError';
    }
}
exports.FileExistsError = FileExistsError;
class FileNotFoundError extends Error {
    constructor() {
        super('No workflow code exists yet. Use create first.');
        this.name = 'FileNotFoundError';
    }
}
exports.FileNotFoundError = FileNotFoundError;
class BatchReplacementError extends Error {
    failedIndex;
    totalCount;
    cause;
    constructor(failedIndex, totalCount, cause) {
        super(`Batch replacement failed at index ${failedIndex} of ${totalCount}: ${cause.message}. All changes have been rolled back.`);
        this.name = 'BatchReplacementError';
        this.failedIndex = failedIndex;
        this.totalCount = totalCount;
        this.cause = cause;
    }
}
exports.BatchReplacementError = BatchReplacementError;
//# sourceMappingURL=text-editor.types.js.map