import { Logger } from '@n8n/backend-common';
import { ExternalSecretsProviderRegistry } from './provider-registry.service';
import type { SecretsProvider } from './types';
export declare class ExternalSecretsSecretsCache {
    private readonly logger;
    private readonly registry;
    constructor(logger: Logger, registry: ExternalSecretsProviderRegistry);
    refreshAll(): Promise<void>;
    refreshProvider(name: string, provider: SecretsProvider): Promise<void>;
    getSecret(providerName: string, secretName: string): unknown;
    hasSecret(providerName: string, secretName: string): boolean;
    getSecretNames(providerName: string): string[];
    getAllSecretNames(): Record<string, string[]>;
}
