"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleProjectMembersResponseDto = void 0;
const zod_1 = require("zod");
const zod_class_1 = require("../../zod-class");
const roleProjectMemberSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    firstName: zod_1.z.string().nullable(),
    lastName: zod_1.z.string().nullable(),
    email: zod_1.z.string(),
    role: zod_1.z.string(),
});
class RoleProjectMembersResponseDto extends zod_class_1.Z.class({
    members: zod_1.z.array(roleProjectMemberSchema),
}) {
}
exports.RoleProjectMembersResponseDto = RoleProjectMembersResponseDto;
//# sourceMappingURL=role-project-members-response.dto.js.map