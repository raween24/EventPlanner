import z from 'zod';
declare const CredentialsGetManyRequestQuery_base: import("../../zod-class").ZodClass<{
    includeGlobal: boolean;
    includeData?: boolean | undefined;
    includeScopes?: boolean | undefined;
    onlySharedWithMe?: boolean | undefined;
    externalSecretsStore?: string | undefined;
}, {
    includeScopes: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
    includeData: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
    onlySharedWithMe: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
    includeGlobal: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>>;
    externalSecretsStore: z.ZodOptional<z.ZodString>;
}>;
export declare class CredentialsGetManyRequestQuery extends CredentialsGetManyRequestQuery_base {
}
export {};
