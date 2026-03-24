"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationState = void 0;
const constants_1 = require("@n8n/constants");
const di_1 = require("@n8n/di");
const n8n_workflow_1 = require("n8n-workflow");
const cache_service_1 = require("../services/cache/cache.service");
let CollaborationState = class CollaborationState {
    constructor(cache) {
        this.cache = cache;
        this.inactivityCleanUpTime = 15 * constants_1.Time.minutes.toMilliseconds;
        this.writeLockTtl = 2 * constants_1.Time.minutes.toMilliseconds;
    }
    async addCollaborator(workflowId, userId, clientId) {
        const cacheKey = this.formWorkflowCacheKey(workflowId);
        const cacheEntry = {
            [clientId]: `${userId}|${new Date().toISOString()}`,
        };
        await this.cache.setHash(cacheKey, cacheEntry);
    }
    async removeCollaborator(workflowId, clientId) {
        const cacheKey = this.formWorkflowCacheKey(workflowId);
        await this.cache.deleteFromHash(cacheKey, clientId);
    }
    async getCollaborators(workflowId) {
        const cacheKey = this.formWorkflowCacheKey(workflowId);
        const cacheValue = await this.cache.getHash(cacheKey);
        if (!cacheValue) {
            return [];
        }
        const { valid, invalid } = this.parseCacheHashToCollaborators(cacheValue);
        const [expired, stillActive] = this.splitToExpiredAndStillActive(valid);
        const toRemove = [...expired, ...invalid];
        if (toRemove.length > 0) {
            void this.removeExpiredCollaborators(workflowId, toRemove);
        }
        const userMap = new Map();
        for (const entry of stillActive) {
            const existing = userMap.get(entry.userId);
            if (!existing || new Date(entry.lastSeen) > new Date(existing.lastSeen)) {
                userMap.set(entry.userId, entry);
            }
        }
        return Array.from(userMap.values());
    }
    formWorkflowCacheKey(workflowId) {
        return `collaboration:${workflowId}`;
    }
    splitToExpiredAndStillActive(collaborators) {
        const expired = [];
        const stillActive = [];
        for (const collaborator of collaborators) {
            if (this.hasSessionExpired(collaborator.lastSeen)) {
                expired.push(collaborator);
            }
            else {
                stillActive.push(collaborator);
            }
        }
        return [expired, stillActive];
    }
    async removeExpiredCollaborators(workflowId, expiredClients) {
        const cacheKey = this.formWorkflowCacheKey(workflowId);
        await Promise.all(expiredClients.map(async (client) => await this.cache.deleteFromHash(cacheKey, client.clientId)));
    }
    parseCacheHashToCollaborators(workflowCacheEntry) {
        const valid = [];
        const invalid = [];
        for (const [clientId, value] of Object.entries(workflowCacheEntry)) {
            const parts = value.split('|');
            if (parts.length === 1) {
                invalid.push({
                    clientId,
                    userId: '',
                    lastSeen: value,
                });
            }
            else {
                const [userId, lastSeen] = parts;
                valid.push({
                    userId,
                    lastSeen,
                    clientId,
                });
            }
        }
        return { valid, invalid };
    }
    hasSessionExpired(lastSeenString) {
        const expiryTime = new Date(lastSeenString).getTime() + this.inactivityCleanUpTime;
        return Date.now() > expiryTime;
    }
    async setWriteLock(workflowId, clientId, userId) {
        const cacheKey = this.formWriteLockCacheKey(workflowId);
        const lockData = JSON.stringify({ clientId, userId });
        await this.cache.set(cacheKey, lockData, this.writeLockTtl);
    }
    async renewWriteLock(workflowId, clientId) {
        const cacheKey = this.formWriteLockCacheKey(workflowId);
        const currentLock = await this.getWriteLock(workflowId);
        if (currentLock?.clientId === clientId) {
            const lockData = JSON.stringify(currentLock);
            await this.cache.set(cacheKey, lockData, this.writeLockTtl);
        }
    }
    async getWriteLock(workflowId) {
        const cacheKey = this.formWriteLockCacheKey(workflowId);
        const lockData = await this.cache.get(cacheKey);
        if (!lockData) {
            return null;
        }
        const parsed = (0, n8n_workflow_1.jsonParse)(lockData, {
            fallbackValue: null,
        });
        if (!parsed?.clientId || !parsed?.userId) {
            return null;
        }
        return parsed;
    }
    async releaseWriteLock(workflowId) {
        const cacheKey = this.formWriteLockCacheKey(workflowId);
        await this.cache.delete(cacheKey);
    }
    formWriteLockCacheKey(workflowId) {
        return `collaboration:write-lock:${workflowId}`;
    }
    async acquireWriteLockForce(workflowId, clientId, userId) {
        const currentLock = await this.getWriteLock(workflowId);
        if (currentLock && currentLock.userId !== userId) {
            return false;
        }
        await this.setWriteLock(workflowId, clientId, userId);
        return true;
    }
};
exports.CollaborationState = CollaborationState;
exports.CollaborationState = CollaborationState = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], CollaborationState);
//# sourceMappingURL=collaboration.state.js.map