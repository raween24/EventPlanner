import type { CredentialSharingRole, Scope } from '@n8n/permissions';
import type { EntityManager, FindOptionsWhere, SelectQueryBuilder } from '@n8n/typeorm';
import { DataSource, Repository } from '@n8n/typeorm';
import type { User } from '../entities';
import { Project, SharedCredentials } from '../entities';
export declare class SharedCredentialsRepository extends Repository<SharedCredentials> {
    constructor(dataSource: DataSource);
    findByCredentialIds(credentialIds: string[], role: CredentialSharingRole): Promise<SharedCredentials[]>;
    makeOwnerOfAllCredentials(project: Project): Promise<import("@n8n/typeorm").UpdateResult>;
    makeOwner(credentialIds: string[], projectId: string, trx?: EntityManager): Promise<import("@n8n/typeorm").InsertResult>;
    deleteByIds(sharedCredentialsIds: string[], projectId: string, trx?: EntityManager): Promise<import("@n8n/typeorm").DeleteResult>;
    getFilteredAccessibleCredentials(projectIds: string[], credentialsIds: string[]): Promise<string[]>;
    findCredentialOwningProject(credentialsId: string): Promise<Project | undefined>;
    getAllRelationsForCredentials(credentialIds: string[]): Promise<SharedCredentials[]>;
    getSharedPersonalCredentialsCount(): Promise<number>;
    findCredentialsWithOptions(where?: FindOptionsWhere<SharedCredentials>, trx?: EntityManager): Promise<SharedCredentials[]>;
    findCredentialsByRoles(userIds: string[], projectRoles: string[], credentialRoles: string[], trx?: EntityManager): Promise<SharedCredentials[]>;
    buildSharedCredentialIdsSubquery(user: User, sharingOptions: {
        scopes?: Scope[];
        projectRoles?: string[];
        credentialRoles?: string[];
        isPersonalProject?: boolean;
        personalProjectOwnerId?: string;
        onlySharedWithMe?: boolean;
        projectId?: string;
    }): SelectQueryBuilder<any>;
}
