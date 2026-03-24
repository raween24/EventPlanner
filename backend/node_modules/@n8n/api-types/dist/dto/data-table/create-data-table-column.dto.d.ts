import { z } from 'zod';
declare const CreateDataTableColumnDto_base: import("../../zod-class").ZodClass<{
    type: "string" | "number" | "boolean" | "date";
    name: string;
    csvColumnName?: string | undefined;
}, {
    name: z.ZodString;
    type: z.ZodEnum<["string", "number", "boolean", "date"]>;
    csvColumnName: z.ZodOptional<z.ZodString>;
}>;
export declare class CreateDataTableColumnDto extends CreateDataTableColumnDto_base {
}
export {};
