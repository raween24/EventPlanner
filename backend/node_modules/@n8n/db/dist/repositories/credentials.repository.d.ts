import type { Scope } from '@n8n/permissions';
import type { FindManyOptions } from '@n8n/typeorm';
import { DataSource, Repository } from '@n8n/typeorm';
import { CredentialsEntity } from '../entities';
import type { User } from '../entities';
import type { ListQuery } from '../entities/types-db';
export declare class CredentialsRepository extends Repository<CredentialsEntity> {
    constructor(dataSource: DataSource);
    findStartingWith(credentialName: string): Promise<CredentialsEntity[]>;
    findMany(listQueryOptions?: ListQuery.Options & {
        includeData?: boolean;
        user?: User;
        order?: FindManyOptions<CredentialsEntity>['order'];
    }, credentialIds?: string[]): Promise<CredentialsEntity[]>;
    findManyAndCount(listQueryOptions?: ListQuery.Options & {
        includeData?: boolean;
        user?: User;
        order?: FindManyOptions<CredentialsEntity>['order'];
    }, credentialIds?: string[]): Promise<[CredentialsEntity[], number]>;
    private toFindManyOptions;
    private handleSharedFilters;
    getManyByIds(ids: string[], { withSharings }?: {
        withSharings: boolean;
    }): Promise<CredentialsEntity[]>;
    findAllGlobalCredentials(includeData?: boolean): Promise<CredentialsEntity[]>;
    findAllPersonalCredentials(): Promise<CredentialsEntity[]>;
    findAllCredentialsForWorkflow(workflowId: string): Promise<CredentialsEntity[]>;
    findAllCredentialsForProject(projectId: string): Promise<CredentialsEntity[]>;
    getManyAndCountWithSharingSubquery(user: User, sharingOptions: {
        scopes?: Scope[];
        projectRoles?: string[];
        credentialRoles?: string[];
        isPersonalProject?: boolean;
        personalProjectOwnerId?: string;
        onlySharedWithMe?: boolean;
    }, options?: ListQuery.Options & {
        includeData?: boolean;
        order?: FindManyOptions<CredentialsEntity>['order'];
    }): Promise<{
        credentials: CredentialsEntity[];
        count: number;
    }>;
    private getManyQueryWithSharingSubquery;
}
