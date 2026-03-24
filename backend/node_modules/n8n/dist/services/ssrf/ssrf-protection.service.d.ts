import { Logger } from '@n8n/backend-common';
import { SsrfProtectionConfig } from '@n8n/config';
import { SsrfBridge, SsrfCheckResult } from 'n8n-core';
import { Result } from 'n8n-workflow';
import type { LookupAddress } from 'node:dns';
import type { LookupFunction } from 'node:net';
import { DnsResolver } from './dns-resolver';
export type LookAndValidateResult = Result<LookupAddress[], Error>;
export declare class SsrfProtectionService implements SsrfBridge {
    private readonly ssrfConfig;
    private readonly dnsResolver;
    private readonly logger;
    private readonly blockedIps;
    private readonly allowedIps;
    private readonly allowedHostnameMatcher;
    constructor(ssrfConfig: SsrfProtectionConfig, dnsResolver: DnsResolver, logger: Logger);
    validateUrl(url: string | URL): Promise<SsrfCheckResult>;
    validateIp(ip: string): SsrfCheckResult;
    createSecureLookup(): LookupFunction;
    validateRedirectSync(url: string): void;
    private normalizeIpInHostname;
    private secureLookupAsync;
    private lookupAndValidate;
    private tryParseUrl;
    private getIpFamily;
}
