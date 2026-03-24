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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDnsCache = void 0;
const config_1 = require("@n8n/config");
const constants_1 = require("@n8n/constants");
const di_1 = require("@n8n/di");
const cache_manager_1 = require("cache-manager");
const n8n_workflow_1 = require("n8n-workflow");
const node_assert_1 = __importDefault(require("node:assert"));
let InMemoryDnsCache = class InMemoryDnsCache {
    constructor(ssrfConfig) {
        this.ssrfConfig = ssrfConfig;
    }
    async ensureCache() {
        if (!this.cache) {
            const sizeCalculation = (item) => {
                const str = (0, n8n_workflow_1.jsonStringify)(item, { replaceCircularRefs: true });
                return new TextEncoder().encode(str).length;
            };
            this.cache = await (0, cache_manager_1.caching)('memory', {
                maxSize: this.ssrfConfig.dnsCacheMaxSize,
                sizeCalculation,
                ttl: 0,
                ttlResolution: 0,
            });
        }
        return this.cache;
    }
    async get(hostname) {
        const cache = await this.ensureCache();
        return await cache.get(hostname);
    }
    async set(hostname, ips, ttl) {
        (0, node_assert_1.default)(ttl > 0, 'DNS cache TTL must be greater than 0');
        const cache = await this.ensureCache();
        const ttlMs = ttl * constants_1.Time.seconds.toMilliseconds;
        await cache.set(hostname, ips, ttlMs);
    }
    async clear() {
        const cache = await this.ensureCache();
        await cache.reset();
    }
};
exports.InMemoryDnsCache = InMemoryDnsCache;
exports.InMemoryDnsCache = InMemoryDnsCache = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [config_1.SsrfProtectionConfig])
], InMemoryDnsCache);
//# sourceMappingURL=in-memory-dns-cache.service.js.map