"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceRegistrationSchema = void 0;
const zod_1 = require("zod");
const InstanceRegistrationSchemaV1 = zod_1.z
    .object({
    schemaVersion: zod_1.z.literal(1),
    instanceKey: zod_1.z.string(),
    hostId: zod_1.z.string(),
    instanceType: zod_1.z.enum(['main', 'worker', 'webhook']),
    instanceRole: zod_1.z.enum(['leader', 'follower', 'unset']),
    version: zod_1.z.string(),
    registeredAt: zod_1.z.number(),
    lastSeen: zod_1.z.number(),
})
    .passthrough();
exports.instanceRegistrationSchema = zod_1.z.discriminatedUnion('schemaVersion', [
    InstanceRegistrationSchemaV1,
]);
const ClusterVersionMismatchSchema = zod_1.z.object({
    versions: zod_1.z.array(zod_1.z.object({
        version: zod_1.z.string(),
        instances: zod_1.z.array(zod_1.z.object({
            instanceKey: zod_1.z.string(),
            hostId: zod_1.z.string(),
            instanceType: zod_1.z.enum(['main', 'worker', 'webhook']),
            instanceRole: zod_1.z.enum(['leader', 'follower', 'unset']),
        })),
    })),
});
const ClusterInfoResponseSchema = zod_1.z.object({
    instances: zod_1.z.array(exports.instanceRegistrationSchema),
    versionMismatch: ClusterVersionMismatchSchema.nullable(),
});
//# sourceMappingURL=instance-registry-types.js.map