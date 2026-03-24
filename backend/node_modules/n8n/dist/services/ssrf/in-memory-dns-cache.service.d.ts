import { SsrfProtectionConfig } from '@n8n/config';
import { LookupAddress } from 'node:dns';
export declare class InMemoryDnsCache {
    private readonly ssrfConfig;
    private cache;
    constructor(ssrfConfig: SsrfProtectionConfig);
    private ensureCache;
    get(hostname: string): Promise<LookupAddress[] | undefined>;
    set(hostname: string, ips: LookupAddress[], ttl: number): Promise<void>;
    clear(): Promise<void>;
}
