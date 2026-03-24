import { z } from 'zod';
declare const AiTruncateMessagesRequestDto_base: import("../../zod-class").ZodClass<{
    workflowId: string;
    messageId: string;
    codeBuilder?: boolean | undefined;
}, {
    workflowId: z.ZodString;
    messageId: z.ZodString;
    codeBuilder: z.ZodOptional<z.ZodBoolean>;
}>;
export declare class AiTruncateMessagesRequestDto extends AiTruncateMessagesRequestDto_base {
}
export {};
