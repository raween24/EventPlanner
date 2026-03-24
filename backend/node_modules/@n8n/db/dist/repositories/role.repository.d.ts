import { DataSource, EntityManager, Repository } from '@n8n/typeorm';
import { Role } from '../entities';
export declare class RoleRepository extends Repository<Role> {
    constructor(dataSource: DataSource);
    findAll(trx?: EntityManager): Promise<Role[]>;
    countUsersWithRole(role: Role): Promise<number>;
    findAllRoleCounts(): Promise<Record<string, number>>;
    findAllProjectCounts(): Promise<Record<string, number>>;
    findProjectAssignments(roleSlug: string): Promise<Array<{
        projectId: string;
        projectName: string;
        projectIcon: {
            type: string;
            value: string;
        } | null;
        memberCount: number;
        lastAssigned: string | null;
    }>>;
    findAllProjectMembers(projectId: string, roleSlug?: string): Promise<Array<{
        userId: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        role: string;
    }>>;
    findBySlug(slug: string): Promise<Role | null>;
    findBySlugs(slugs: string[], roleType: 'global' | 'project' | 'workflow' | 'credential'): Promise<Role[]>;
    removeBySlug(slug: string): Promise<void>;
    private updateEntityWithManager;
    updateRole(slug: string, newData: Partial<Pick<Role, 'description' | 'scopes' | 'displayName'>>): Promise<Role>;
}
