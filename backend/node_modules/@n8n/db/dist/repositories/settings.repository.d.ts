import type { EntityManager } from '@n8n/typeorm';
import { DataSource, Repository } from '@n8n/typeorm';
import { Settings } from '../entities';
export declare class SettingsRepository extends Repository<Settings> {
    constructor(dataSource: DataSource);
    findByKey(key: string, em?: EntityManager): Promise<Settings | null>;
    findByKeys(keys: string[]): Promise<Settings[]>;
    findByKeyPrefix(prefix: string): Promise<Settings[]>;
}
