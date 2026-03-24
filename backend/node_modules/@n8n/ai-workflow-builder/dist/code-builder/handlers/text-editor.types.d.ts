export interface ViewCommand {
    command: 'view';
    path: string;
    view_range?: [number, number];
}
export interface CreateCommand {
    command: 'create';
    path: string;
    file_text: string;
}
export interface StrReplaceCommand {
    command: 'str_replace';
    path: string;
    old_str: string;
    new_str: string;
}
export interface InsertCommand {
    command: 'insert';
    path: string;
    insert_line: number;
    insert_text: string;
}
export type TextEditorCommand = ViewCommand | CreateCommand | StrReplaceCommand | InsertCommand;
export interface TextEditorToolCall {
    name: 'str_replace_based_edit_tool';
    args: TextEditorCommand;
    id: string;
}
export interface TextEditorResult {
    content: string;
}
export declare class NoMatchFoundError extends Error {
    constructor(_searchStr: string, nearMatchContext?: string);
}
export declare class MultipleMatchesError extends Error {
    constructor(count: number);
}
export declare class InvalidLineNumberError extends Error {
    constructor(line: number, maxLine: number);
}
export declare class InvalidViewRangeError extends Error {
    constructor(start: number, end: number, maxLine: number);
}
export declare class InvalidPathError extends Error {
    constructor(path: string);
}
export declare class FileExistsError extends Error {
    constructor();
}
export declare class FileNotFoundError extends Error {
    constructor();
}
export interface StrReplacement {
    old_str: string;
    new_str: string;
}
export interface BatchReplaceResult {
    index: number;
    old_str: string;
    status: 'success' | 'failed' | 'not_attempted';
    error?: string;
}
export declare class BatchReplacementError extends Error {
    readonly failedIndex: number;
    readonly totalCount: number;
    readonly cause: NoMatchFoundError | MultipleMatchesError;
    constructor(failedIndex: number, totalCount: number, cause: NoMatchFoundError | MultipleMatchesError);
}
