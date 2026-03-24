import type { TextEditorCommand, StrReplacement, BatchReplaceResult } from './text-editor.types';
export declare function formatCodeWithLineNumbers(code: string): string;
export declare function findDivergenceContext(code: string, searchStr: string): string | undefined;
export declare class TextEditorHandler {
    private code;
    constructor();
    execute(command: TextEditorCommand): string;
    private validatePath;
    private handleView;
    private handleCreate;
    private handleStrReplace;
    private handleInsert;
    private countOccurrences;
    executeBatch(replacements: StrReplacement[]): string | BatchReplaceResult[];
    getWorkflowCode(): string | null;
    setWorkflowCode(code: string): void;
    hasWorkflowCode(): boolean;
    clearWorkflowCode(): void;
}
