import type { User } from '@n8n/db';
import { FirecrawlQuickConnect } from '../quick-connect.config';
import { IQuickConnectHandler } from './handler.interface';
export declare class FirecrawlHandler implements IQuickConnectHandler {
    private config;
    setConfig(config: FirecrawlQuickConnect): void;
    getCredentialData({ email }: User): Promise<{
        apiKey: string;
    }>;
}
