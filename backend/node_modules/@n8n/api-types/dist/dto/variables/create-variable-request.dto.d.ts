import { z } from 'zod';
export declare const NEW_VARIABLE_KEY_REGEX: RegExp;
export declare const strictVariableKeySchema: z.ZodString;
declare const CreateVariableRequestDto_base: import("../..").ZodClass<{
    value: string;
    type: "string";
} & {
    key: string;
    projectId?: string | undefined;
}, {
    type: z.ZodDefault<z.ZodEnum<["string"]>>;
    value: z.ZodString;
} & {
    key: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
}>;
export declare class CreateVariableRequestDto extends CreateVariableRequestDto_base {
}
export {};
