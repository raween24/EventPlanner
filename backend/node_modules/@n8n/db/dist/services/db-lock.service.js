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
exports.DbLockService = exports.DbLock = void 0;
const config_1 = require("@n8n/config");
const di_1 = require("@n8n/di");
const typeorm_1 = require("@n8n/typeorm");
const n8n_workflow_1 = require("n8n-workflow");
var DbLock;
(function (DbLock) {
    DbLock[DbLock["AUTH_ROLES_SYNC"] = 1001] = "AUTH_ROLES_SYNC";
    DbLock[DbLock["TEST"] = 9999] = "TEST";
})(DbLock || (exports.DbLock = DbLock = {}));
let DbLockService = class DbLockService {
    constructor(dataSource, databaseConfig) {
        this.dataSource = dataSource;
        this.databaseConfig = databaseConfig;
    }
    async withLock(lockId, fn, options) {
        return await this.dataSource.manager.transaction(async (tx) => {
            if (this.databaseConfig.type === 'postgresdb') {
                if (options?.timeoutMs !== undefined) {
                    await tx.query(`SET LOCAL lock_timeout = '${Number(options.timeoutMs)}'`);
                }
                try {
                    await tx.query('SELECT pg_advisory_xact_lock($1)', [lockId]);
                }
                catch (error) {
                    if (error instanceof typeorm_1.QueryFailedError && error.message.includes('lock timeout')) {
                        throw new n8n_workflow_1.OperationalError(`Timed out waiting for DbLock ${lockId} after ${options?.timeoutMs}ms`, { cause: error });
                    }
                    throw error;
                }
            }
            return await fn(tx);
        });
    }
    async tryWithLock(lockId, fn) {
        return await this.dataSource.manager.transaction(async (tx) => {
            if (this.databaseConfig.type === 'postgresdb') {
                const result = await tx.query('SELECT pg_try_advisory_xact_lock($1)', [lockId]);
                if (!result[0].pg_try_advisory_xact_lock) {
                    throw new n8n_workflow_1.OperationalError(`DbLock ${lockId} is already held by another process`);
                }
            }
            return await fn(tx);
        });
    }
};
exports.DbLockService = DbLockService;
exports.DbLockService = DbLockService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        config_1.DatabaseConfig])
], DbLockService);
//# sourceMappingURL=db-lock.service.js.map