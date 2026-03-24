import { z } from 'zod';
declare const roleProjectMemberSchema: z.ZodObject<{
    userId: z.ZodString;
    firstName: z.ZodNullable<z.ZodString>;
    lastName: z.ZodNullable<z.ZodString>;
    email: z.ZodString;
    role: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: string;
    email: string;
    userId: string;
    firstName: string | null;
    lastName: string | null;
}, {
    role: string;
    email: string;
    userId: string;
    firstName: string | null;
    lastName: string | null;
}>;
export type RoleProjectMember = z.infer<typeof roleProjectMemberSchema>;
declare const RoleProjectMembersResponseDto_base: import("../../zod-class").ZodClass<{
    members: {
        role: string;
        email: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
    }[];
}, {
    members: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        firstName: z.ZodNullable<z.ZodString>;
        lastName: z.ZodNullable<z.ZodString>;
        email: z.ZodString;
        role: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
        email: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
    }, {
        role: string;
        email: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
    }>, "many">;
}>;
export declare class RoleProjectMembersResponseDto extends RoleProjectMembersResponseDto_base {
}
export type RoleProjectMembersResponse = InstanceType<typeof RoleProjectMembersResponseDto>;
export {};
