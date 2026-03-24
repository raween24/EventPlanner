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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsRepository = void 0;
const di_1 = require("@n8n/di");
const typeorm_1 = require("@n8n/typeorm");
const entities_1 = require("../entities");
const shared_credentials_repository_1 = require("./shared-credentials.repository");
let CredentialsRepository = class CredentialsRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(entities_1.CredentialsEntity, dataSource.manager);
    }
    async findStartingWith(credentialName) {
        return await this.find({
            select: ['name'],
            where: { name: (0, typeorm_1.Like)(`${credentialName}%`) },
        });
    }
    async findMany(listQueryOptions, credentialIds) {
        const findManyOptions = this.toFindManyOptions(listQueryOptions);
        if (credentialIds) {
            findManyOptions.where = { ...findManyOptions.where, id: (0, typeorm_1.In)(credentialIds) };
        }
        return await this.find(findManyOptions);
    }
    async findManyAndCount(listQueryOptions, credentialIds) {
        const findManyOptions = this.toFindManyOptions(listQueryOptions);
        if (credentialIds) {
            findManyOptions.where = { ...findManyOptions.where, id: (0, typeorm_1.In)(credentialIds) };
        }
        return await this.findAndCount(findManyOptions);
    }
    toFindManyOptions(listQueryOptions) {
        const findManyOptions = {};
        const defaultRelations = ['shared', 'shared.project', 'shared.project.projectRelations'];
        const defaultSelect = [
            'id',
            'name',
            'type',
            'isManaged',
            'createdAt',
            'updatedAt',
            'isGlobal',
            'isResolvable',
            'resolverId',
        ];
        if (!listQueryOptions) {
            return {
                select: defaultSelect,
                relations: defaultRelations,
            };
        }
        const { filter, select, take, skip, order } = listQueryOptions;
        if (typeof filter?.name === 'string' && filter?.name !== '') {
            filter.name = (0, typeorm_1.Like)(`%${filter.name}%`);
        }
        if (typeof filter?.type === 'string' && filter?.type !== '') {
            filter.type = (0, typeorm_1.Like)(`%${filter.type}%`);
        }
        this.handleSharedFilters(listQueryOptions);
        if (filter)
            findManyOptions.where = filter;
        if (select)
            findManyOptions.select = select;
        if (take)
            findManyOptions.take = take;
        if (skip)
            findManyOptions.skip = skip;
        if (take && select && !select?.id) {
            findManyOptions.select = { ...findManyOptions.select, id: true };
        }
        if (!findManyOptions.select) {
            findManyOptions.select = defaultSelect;
            findManyOptions.relations = defaultRelations;
        }
        if (order !== undefined) {
            findManyOptions.order = order;
        }
        if (listQueryOptions.includeData) {
            if (Array.isArray(findManyOptions.select)) {
                findManyOptions.select.push('data');
            }
            else {
                findManyOptions.select.data = true;
            }
        }
        return findManyOptions;
    }
    handleSharedFilters(listQueryOptions) {
        if (!listQueryOptions?.filter)
            return;
        const { filter } = listQueryOptions;
        if (typeof filter.projectId === 'string' && filter.projectId !== '') {
            filter.shared = {
                projectId: filter.projectId,
            };
            delete filter.projectId;
        }
        if (typeof filter.withRole === 'string' && filter.withRole !== '') {
            filter.shared = {
                ...(filter?.shared ? filter.shared : {}),
                role: filter.withRole,
            };
            delete filter.withRole;
        }
        if (filter.user &&
            typeof filter.user === 'object' &&
            'id' in filter.user &&
            typeof filter.user.id === 'string') {
            filter.shared = {
                ...(filter?.shared ? filter.shared : {}),
                project: {
                    projectRelations: {
                        userId: filter.user.id,
                    },
                },
            };
            delete filter.user;
        }
    }
    async getManyByIds(ids, { withSharings } = { withSharings: false }) {
        const findManyOptions = { where: { id: (0, typeorm_1.In)(ids) } };
        if (withSharings) {
            findManyOptions.relations = {
                shared: {
                    project: true,
                },
            };
        }
        return await this.find(findManyOptions);
    }
    async findAllGlobalCredentials(includeData = false) {
        const findManyOptions = this.toFindManyOptions({ includeData });
        findManyOptions.where = { ...findManyOptions.where, isGlobal: true };
        return await this.find(findManyOptions);
    }
    async findAllPersonalCredentials() {
        return await this.findBy({ shared: { project: { type: 'personal' } } });
    }
    async findAllCredentialsForWorkflow(workflowId) {
        return await this.findBy({
            shared: { project: { sharedWorkflows: { workflowId } } },
        });
    }
    async findAllCredentialsForProject(projectId) {
        return await this.findBy({ shared: { projectId } });
    }
    async getManyAndCountWithSharingSubquery(user, sharingOptions, options = {}) {
        const query = this.getManyQueryWithSharingSubquery(user, sharingOptions, options);
        const credentials = await query.getMany();
        const countQuery = this.getManyQueryWithSharingSubquery(user, sharingOptions, {
            ...options,
            take: undefined,
            skip: undefined,
            select: undefined,
        });
        const count = await countQuery.select('credential.id').getCount();
        return { credentials, count };
    }
    getManyQueryWithSharingSubquery(user, sharingOptions, options = {}) {
        const qb = this.createQueryBuilder('credential');
        const projectId = typeof options.filter?.projectId === 'string' ? options.filter.projectId : undefined;
        const sharingOptionsWithProjectId = {
            ...sharingOptions,
            projectId,
        };
        const sharedCredentialsRepository = di_1.Container.get(shared_credentials_repository_1.SharedCredentialsRepository);
        const sharedCredentialSubquery = sharedCredentialsRepository.buildSharedCredentialIdsSubquery(user, sharingOptionsWithProjectId);
        qb.andWhere(`credential.id IN (${sharedCredentialSubquery.getQuery()})`);
        qb.setParameters(sharedCredentialSubquery.getParameters());
        const filtersToApply = options.filter && typeof options.filter.projectId !== 'undefined'
            ? { ...options.filter, projectId: undefined }
            : options.filter;
        if (typeof filtersToApply?.name === 'string' && filtersToApply.name !== '') {
            qb.andWhere('credential.name LIKE :name', { name: `%${filtersToApply.name}%` });
        }
        if (typeof filtersToApply?.type === 'string' && filtersToApply.type !== '') {
            qb.andWhere('credential.type LIKE :type', { type: `%${filtersToApply.type}%` });
        }
        const defaultSelect = [
            'id',
            'name',
            'type',
            'isManaged',
            'createdAt',
            'updatedAt',
            'isGlobal',
            'isResolvable',
            'resolverId',
        ];
        if (options.select) {
            const selectFields = options.select;
            if (options.take && !selectFields.id) {
                qb.select([...Object.keys(selectFields).map((k) => `credential.${k}`), 'credential.id']);
            }
            else {
                qb.select(Object.keys(selectFields).map((k) => `credential.${k}`));
            }
        }
        else {
            qb.select(defaultSelect.map((k) => `credential.${k}`));
        }
        if (options.includeData) {
            qb.addSelect('credential.data');
        }
        if (!options.select) {
            qb.leftJoinAndSelect('credential.shared', 'shared')
                .leftJoinAndSelect('shared.project', 'project')
                .leftJoinAndSelect('project.projectRelations', 'projectRelations');
        }
        if (options.order) {
            Object.entries(options.order).forEach(([key, direction]) => {
                qb.addOrderBy(`credential.${key}`, direction);
            });
        }
        if (options.take) {
            qb.take(options.take);
        }
        if (options.skip) {
            qb.skip(options.skip);
        }
        return qb;
    }
};
exports.CredentialsRepository = CredentialsRepository;
exports.CredentialsRepository = CredentialsRepository = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CredentialsRepository);
//# sourceMappingURL=credentials.repository.js.map