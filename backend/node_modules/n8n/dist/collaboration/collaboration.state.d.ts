import type { User } from '@n8n/db';
import type { Workflow } from 'n8n-workflow';
import { CacheService } from '../services/cache/cache.service';
interface CacheEntry {
    userId: string;
    lastSeen: string;
    clientId: string;
}
export declare class CollaborationState {
    private readonly cache;
    readonly inactivityCleanUpTime: number;
    constructor(cache: CacheService);
    addCollaborator(workflowId: Workflow['id'], userId: User['id'], clientId: string): Promise<void>;
    removeCollaborator(workflowId: Workflow['id'], clientId: string): Promise<void>;
    getCollaborators(workflowId: Workflow['id']): Promise<CacheEntry[]>;
    private formWorkflowCacheKey;
    private splitToExpiredAndStillActive;
    private removeExpiredCollaborators;
    private parseCacheHashToCollaborators;
    private hasSessionExpired;
    readonly writeLockTtl: number;
    setWriteLock(workflowId: Workflow['id'], clientId: string, userId: User['id']): Promise<void>;
    renewWriteLock(workflowId: Workflow['id'], clientId: string): Promise<void>;
    getWriteLock(workflowId: Workflow['id']): Promise<{
        clientId: string;
        userId: string;
    } | null>;
    releaseWriteLock(workflowId: Workflow['id']): Promise<void>;
    private formWriteLockCacheKey;
    acquireWriteLockForce(workflowId: Workflow['id'], clientId: string, userId: User['id']): Promise<boolean>;
}
export {};
