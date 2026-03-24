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
exports.SsrfProtectionService = void 0;
const backend_common_1 = require("@n8n/backend-common");
const config_1 = require("@n8n/config");
const di_1 = require("@n8n/di");
const n8n_workflow_1 = require("n8n-workflow");
const node_assert_1 = __importDefault(require("node:assert"));
const node_net_1 = require("node:net");
const dns_resolver_1 = require("./dns-resolver");
const hostname_matcher_1 = require("./hostname-matcher");
const ip_range_builder_1 = require("./ip-range-builder");
const ssrf_blocked_ip_error_1 = require("./ssrf-blocked-ip.error");
let SsrfProtectionService = class SsrfProtectionService {
    constructor(ssrfConfig, dnsResolver, logger) {
        this.ssrfConfig = ssrfConfig;
        this.dnsResolver = dnsResolver;
        this.logger = logger.scoped('ssrf-protection');
        const blocked = (0, ip_range_builder_1.buildIpRangeList)(this.ssrfConfig.blockedIpRanges);
        for (const issue of blocked.issues) {
            this.logger.warn(`Invalid value '${issue.entry}' in N8N_SSRF_BLOCKED_IP_RANGES: ${issue.error}`);
        }
        this.blockedIps = blocked.list;
        const allowed = (0, ip_range_builder_1.buildIpRangeList)(this.ssrfConfig.allowedIpRanges);
        for (const issue of allowed.issues) {
            this.logger.warn(`Invalid value '${issue.entry}' in N8N_SSRF_ALLOWED_IP_RANGES: ${issue.error}`);
        }
        this.allowedIps = allowed.list;
        this.allowedHostnameMatcher = new hostname_matcher_1.HostnameMatcher(this.ssrfConfig.allowedHostnames);
    }
    async validateUrl(url) {
        const parsed = this.tryParseUrl(url);
        if (!parsed) {
            return (0, n8n_workflow_1.createResultError)(new Error(`Invalid URL: ${url}`));
        }
        const { hostname } = parsed;
        const result = await this.lookupAndValidate(hostname, { all: true });
        if (!result.ok) {
            return result;
        }
        return (0, n8n_workflow_1.createResultOk)(undefined);
    }
    validateIp(ip) {
        const family = this.getIpFamily(ip);
        (0, node_assert_1.default)(family !== null, `Invalid IP address: ${ip}`);
        if (this.allowedIps.check(ip, family)) {
            return (0, n8n_workflow_1.createResultOk)(undefined);
        }
        if (this.blockedIps.check(ip, family)) {
            return (0, n8n_workflow_1.createResultError)(new ssrf_blocked_ip_error_1.SsrfBlockedIpError(ip));
        }
        return (0, n8n_workflow_1.createResultOk)(undefined);
    }
    createSecureLookup() {
        return async (hostname, options, onResult) => {
            try {
                const resolved = await this.secureLookupAsync(hostname, options);
                if (options.all) {
                    onResult(null, resolved);
                    return;
                }
                const first = resolved[0];
                onResult(null, first.address, first.family);
            }
            catch (error) {
                onResult((0, n8n_workflow_1.ensureError)(error), options.all ? [] : '', undefined);
            }
        };
    }
    validateRedirectSync(url) {
        const parsed = this.tryParseUrl(url);
        if (!parsed)
            return;
        const { hostname } = parsed;
        if (this.allowedHostnameMatcher.matches(hostname))
            return;
        const cleanIp = this.normalizeIpInHostname(hostname);
        if ((0, node_net_1.isIP)(cleanIp)) {
            const result = this.validateIp(cleanIp);
            if (!result.ok) {
                throw result.error;
            }
        }
    }
    normalizeIpInHostname(hostname) {
        return hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname;
    }
    async secureLookupAsync(hostname, options) {
        const result = await this.lookupAndValidate(hostname, options);
        if (!result.ok) {
            throw result.error;
        }
        return result.result;
    }
    async lookupAndValidate(hostname, options) {
        const cleanIp = this.normalizeIpInHostname(hostname);
        const ipFamily = (0, node_net_1.isIP)(cleanIp);
        if (ipFamily) {
            const result = this.validateIp(cleanIp);
            if (!result.ok) {
                return result;
            }
            return (0, n8n_workflow_1.createResultOk)([
                {
                    address: cleanIp,
                    family: ipFamily,
                },
            ]);
        }
        const resolved = await this.dnsResolver.lookup(hostname, options);
        (0, node_assert_1.default)(resolved.length > 0, `DNS lookup for ${hostname} returned no results`);
        if (this.allowedHostnameMatcher.matches(hostname)) {
            return (0, n8n_workflow_1.createResultOk)(resolved);
        }
        for (const ip of resolved) {
            const result = this.validateIp(ip.address);
            if (!result.ok) {
                return result;
            }
        }
        return (0, n8n_workflow_1.createResultOk)(resolved);
    }
    tryParseUrl(url) {
        try {
            return url instanceof URL ? url : new URL(url);
        }
        catch {
            return null;
        }
    }
    getIpFamily(ip) {
        const version = (0, node_net_1.isIP)(ip);
        if (version === 4)
            return 'ipv4';
        if (version === 6)
            return 'ipv6';
        return null;
    }
};
exports.SsrfProtectionService = SsrfProtectionService;
exports.SsrfProtectionService = SsrfProtectionService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [config_1.SsrfProtectionConfig,
        dns_resolver_1.DnsResolver,
        backend_common_1.Logger])
], SsrfProtectionService);
//# sourceMappingURL=ssrf-protection.service.js.map