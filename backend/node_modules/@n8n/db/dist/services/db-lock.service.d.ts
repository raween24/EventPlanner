import { DatabaseConfig } from '@n8n/config';
import { DataSource } from '@n8n/typeorm';
import type { EntityManager } from '@n8n/typeorm';
export declare const enum DbLock {
    AUTH_ROLES_SYNC = 1001,
    TEST = 9999
}
export declare class DbLockService {
    private readonly dataSource;
    private readonly databaseConfig;
    constructor(dataSource: DataSource, databaseConfig: DatabaseConfig);
    withLock<T>(lockId: DbLock, fn: (tx: EntityManager) => Promise<T>, options?: {
        timeoutMs?: number;
    }): Promise<T>;
    tryWithLock<T>(lockId: DbLock, fn: (tx: EntityManager) => Promise<T>): Promise<T>;
}
