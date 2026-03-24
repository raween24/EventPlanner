import { z } from 'zod';
export declare const ExecutionRedactionQueryDtoSchema: z.ZodObject<{
    redactExecutionData: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    redactExecutionData: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    redactExecutionData: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
}, z.ZodTypeAny, "passthrough">>;
export type ExecutionRedactionQueryDto = z.output<typeof ExecutionRedactionQueryDtoSchema>;
