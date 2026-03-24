export declare const REGISTRY_CONSTANTS: {
    readonly HEARTBEAT_INTERVAL_MS: 30000;
    readonly REGISTRATION_TTL_SECONDS: 60;
    readonly RECONCILIATION_INTERVAL_MS: 180000;
    readonly OPERATION_TIMEOUT_MS: 5000;
};
export declare const REDIS_KEY_PATTERNS: {
    readonly instanceKey: (prefix: string, instanceKey: string) => string;
    readonly membershipSet: (prefix: string) => string;
    readonly stateKey: (prefix: string) => string;
};
