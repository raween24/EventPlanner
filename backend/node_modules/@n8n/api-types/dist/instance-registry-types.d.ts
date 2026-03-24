import { z } from 'zod';
export declare const instanceRegistrationSchema: z.ZodDiscriminatedUnion<"schemaVersion", [z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    instanceKey: z.ZodString;
    hostId: z.ZodString;
    instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
    instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
    version: z.ZodString;
    registeredAt: z.ZodNumber;
    lastSeen: z.ZodNumber;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    schemaVersion: z.ZodLiteral<1>;
    instanceKey: z.ZodString;
    hostId: z.ZodString;
    instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
    instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
    version: z.ZodString;
    registeredAt: z.ZodNumber;
    lastSeen: z.ZodNumber;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    schemaVersion: z.ZodLiteral<1>;
    instanceKey: z.ZodString;
    hostId: z.ZodString;
    instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
    instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
    version: z.ZodString;
    registeredAt: z.ZodNumber;
    lastSeen: z.ZodNumber;
}, z.ZodTypeAny, "passthrough">>]>;
export type InstanceRegistration = z.infer<typeof instanceRegistrationSchema>;
declare const ClusterVersionMismatchSchema: z.ZodObject<{
    versions: z.ZodArray<z.ZodObject<{
        version: z.ZodString;
        instances: z.ZodArray<z.ZodObject<{
            instanceKey: z.ZodString;
            hostId: z.ZodString;
            instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
            instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
        }, "strip", z.ZodTypeAny, {
            instanceKey: string;
            hostId: string;
            instanceType: "webhook" | "main" | "worker";
            instanceRole: "leader" | "follower" | "unset";
        }, {
            instanceKey: string;
            hostId: string;
            instanceType: "webhook" | "main" | "worker";
            instanceRole: "leader" | "follower" | "unset";
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        version: string;
        instances: {
            instanceKey: string;
            hostId: string;
            instanceType: "webhook" | "main" | "worker";
            instanceRole: "leader" | "follower" | "unset";
        }[];
    }, {
        version: string;
        instances: {
            instanceKey: string;
            hostId: string;
            instanceType: "webhook" | "main" | "worker";
            instanceRole: "leader" | "follower" | "unset";
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    versions: {
        version: string;
        instances: {
            instanceKey: string;
            hostId: string;
            instanceType: "webhook" | "main" | "worker";
            instanceRole: "leader" | "follower" | "unset";
        }[];
    }[];
}, {
    versions: {
        version: string;
        instances: {
            instanceKey: string;
            hostId: string;
            instanceType: "webhook" | "main" | "worker";
            instanceRole: "leader" | "follower" | "unset";
        }[];
    }[];
}>;
export type ClusterVersionMismatch = z.infer<typeof ClusterVersionMismatchSchema>;
declare const ClusterInfoResponseSchema: z.ZodObject<{
    instances: z.ZodArray<z.ZodDiscriminatedUnion<"schemaVersion", [z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        instanceKey: z.ZodString;
        hostId: z.ZodString;
        instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
        instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
        version: z.ZodString;
        registeredAt: z.ZodNumber;
        lastSeen: z.ZodNumber;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        schemaVersion: z.ZodLiteral<1>;
        instanceKey: z.ZodString;
        hostId: z.ZodString;
        instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
        instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
        version: z.ZodString;
        registeredAt: z.ZodNumber;
        lastSeen: z.ZodNumber;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        schemaVersion: z.ZodLiteral<1>;
        instanceKey: z.ZodString;
        hostId: z.ZodString;
        instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
        instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
        version: z.ZodString;
        registeredAt: z.ZodNumber;
        lastSeen: z.ZodNumber;
    }, z.ZodTypeAny, "passthrough">>]>, "many">;
    versionMismatch: z.ZodNullable<z.ZodObject<{
        versions: z.ZodArray<z.ZodObject<{
            version: z.ZodString;
            instances: z.ZodArray<z.ZodObject<{
                instanceKey: z.ZodString;
                hostId: z.ZodString;
                instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
                instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
            }, "strip", z.ZodTypeAny, {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }, {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            version: string;
            instances: {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }[];
        }, {
            version: string;
            instances: {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        versions: {
            version: string;
            instances: {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }[];
        }[];
    }, {
        versions: {
            version: string;
            instances: {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }[];
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    instances: z.objectOutputType<{
        schemaVersion: z.ZodLiteral<1>;
        instanceKey: z.ZodString;
        hostId: z.ZodString;
        instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
        instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
        version: z.ZodString;
        registeredAt: z.ZodNumber;
        lastSeen: z.ZodNumber;
    }, z.ZodTypeAny, "passthrough">[];
    versionMismatch: {
        versions: {
            version: string;
            instances: {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }[];
        }[];
    } | null;
}, {
    instances: z.objectInputType<{
        schemaVersion: z.ZodLiteral<1>;
        instanceKey: z.ZodString;
        hostId: z.ZodString;
        instanceType: z.ZodEnum<["main", "worker", "webhook"]>;
        instanceRole: z.ZodEnum<["leader", "follower", "unset"]>;
        version: z.ZodString;
        registeredAt: z.ZodNumber;
        lastSeen: z.ZodNumber;
    }, z.ZodTypeAny, "passthrough">[];
    versionMismatch: {
        versions: {
            version: string;
            instances: {
                instanceKey: string;
                hostId: string;
                instanceType: "webhook" | "main" | "worker";
                instanceRole: "leader" | "follower" | "unset";
            }[];
        }[];
    } | null;
}>;
export type ClusterInfoResponse = z.infer<typeof ClusterInfoResponseSchema>;
export {};
