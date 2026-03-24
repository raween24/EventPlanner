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
exports.CollaborationService = void 0;
const db_1 = require("@n8n/db");
const backend_common_1 = require("@n8n/backend-common");
const di_1 = require("@n8n/di");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const collaboration_message_1 = require("./collaboration.message");
const collaboration_state_1 = require("../collaboration/collaboration.state");
const conflict_error_1 = require("../errors/response-errors/conflict.error");
const locked_error_1 = require("../errors/response-errors/locked.error");
const push_1 = require("../push");
const access_service_1 = require("../services/access.service");
let CollaborationService = class CollaborationService {
    constructor(logger, errorReporter, push, state, userRepository, accessService) {
        this.logger = logger;
        this.errorReporter = errorReporter;
        this.push = push;
        this.state = state;
        this.userRepository = userRepository;
        this.accessService = accessService;
    }
    init() {
        this.push.on('message', async (event) => {
            try {
                await this.handleUserMessage(event.userId, event.pushRef, event.msg);
            }
            catch (error) {
                if (this.isTransientError(error)) {
                    this.logger.debug('Transient infrastructure error in collaboration service', {
                        error,
                    });
                    return;
                }
                this.errorReporter.error(new n8n_workflow_1.UnexpectedError('Error handling CollaborationService push message', {
                    extra: {
                        msg: event.msg,
                        userId: event.userId,
                        pushRef: event.pushRef,
                    },
                    cause: error,
                }));
            }
        });
    }
    isTransientError(error) {
        return (error instanceof Error &&
            'code' in error &&
            typeof error.code === 'string' &&
            ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET'].includes(error.code));
    }
    async handleUserMessage(userId, clientId, msg) {
        const workflowMessage = await (0, collaboration_message_1.parseWorkflowMessage)(msg);
        if (workflowMessage.type === 'workflowOpened') {
            await this.handleWorkflowOpened(userId, clientId, workflowMessage);
        }
        else if (workflowMessage.type === 'workflowClosed') {
            await this.handleWorkflowClosed(userId, clientId, workflowMessage);
        }
        else if (workflowMessage.type === 'writeAccessRequested') {
            await this.handleWriteAccessRequested(userId, clientId, workflowMessage);
        }
        else if (workflowMessage.type === 'writeAccessReleaseRequested') {
            await this.handleWriteAccessReleaseRequested(userId, clientId, workflowMessage);
        }
        else if (workflowMessage.type === 'writeAccessHeartbeat') {
            await this.handleWriteAccessHeartbeat(userId, clientId, workflowMessage);
        }
    }
    async handleWorkflowOpened(userId, clientId, msg) {
        const { workflowId } = msg;
        if (!(await this.accessService.hasReadAccess(userId, workflowId))) {
            return;
        }
        await this.state.addCollaborator(workflowId, userId, clientId);
        await this.sendWorkflowUsersChangedMessage(workflowId);
    }
    async handleWorkflowClosed(userId, clientId, msg) {
        const { workflowId } = msg;
        if (!(await this.accessService.hasReadAccess(userId, workflowId))) {
            return;
        }
        const currentLock = await this.state.getWriteLock(workflowId);
        if (currentLock?.clientId === clientId) {
            await this.state.releaseWriteLock(workflowId);
            await this.sendWriteAccessReleasedMessage(workflowId);
        }
        await this.state.removeCollaborator(workflowId, clientId);
        await this.sendWorkflowUsersChangedMessage(workflowId);
    }
    async sendWorkflowUsersChangedMessage(workflowId) {
        const collaborators = await this.state.getCollaborators(workflowId);
        const userIds = collaborators.map((user) => user.userId);
        if (userIds.length === 0) {
            return;
        }
        const users = await this.userRepository.getByIds(this.userRepository.manager, userIds);
        const activeCollaborators = users.map((user) => ({
            user: user.toIUser(),
            lastSeen: collaborators.find(({ userId }) => userId === user.id).lastSeen,
        }));
        const msgData = {
            workflowId,
            collaborators: activeCollaborators,
        };
        this.push.sendToUsers({ type: 'collaboratorsChanged', data: msgData }, userIds);
    }
    async handleWriteAccessRequested(userId, clientId, msg) {
        const { workflowId, force } = msg;
        if (!(await this.accessService.hasWriteAccess(userId, workflowId))) {
            return;
        }
        if (force) {
            const acquired = await this.state.acquireWriteLockForce(workflowId, clientId, userId);
            if (!acquired) {
                return;
            }
        }
        else {
            const currentLock = await this.state.getWriteLock(workflowId);
            if (currentLock && currentLock.clientId !== clientId) {
                return;
            }
            await this.state.setWriteLock(workflowId, clientId, userId);
        }
        await this.sendWriteAccessAcquiredMessage(workflowId, userId, clientId);
    }
    async handleWriteAccessReleaseRequested(_userId, clientId, msg) {
        const { workflowId } = msg;
        const currentLock = await this.state.getWriteLock(workflowId);
        if (currentLock?.clientId !== clientId) {
            return;
        }
        await this.state.releaseWriteLock(workflowId);
        await this.sendWriteAccessReleasedMessage(workflowId);
    }
    async handleWriteAccessHeartbeat(_userId, clientId, msg) {
        const { workflowId } = msg;
        await this.state.renewWriteLock(workflowId, clientId);
    }
    async sendWriteAccessAcquiredMessage(workflowId, userId, clientId) {
        const collaborators = await this.state.getCollaborators(workflowId);
        const userIds = collaborators.map((user) => user.userId);
        if (userIds.length === 0) {
            return;
        }
        const msgData = {
            workflowId,
            userId,
            clientId,
        };
        this.push.sendToUsers({ type: 'writeAccessAcquired', data: msgData }, userIds);
    }
    async sendWriteAccessReleasedMessage(workflowId) {
        const collaborators = await this.state.getCollaborators(workflowId);
        const userIds = collaborators.map((user) => user.userId);
        if (userIds.length === 0) {
            return;
        }
        const msgData = {
            workflowId,
        };
        this.push.sendToUsers({ type: 'writeAccessReleased', data: msgData }, userIds);
    }
    async broadcastWorkflowUpdate(workflowId, updatedByUserId) {
        const collaborators = await this.state.getCollaborators(workflowId);
        const userIds = collaborators.map((user) => user.userId);
        if (userIds.length === 0) {
            return;
        }
        const msgData = {
            workflowId,
            userId: updatedByUserId,
        };
        this.push.sendToUsers({ type: 'workflowUpdated', data: msgData }, userIds);
    }
    async getWriteLock(userId, workflowId) {
        if (!(await this.accessService.hasReadAccess(userId, workflowId))) {
            return null;
        }
        return await this.state.getWriteLock(workflowId);
    }
    async validateWriteLock(userId, clientId, workflowId, action) {
        if (!clientId) {
            return;
        }
        const lock = await this.state.getWriteLock(workflowId);
        if (!lock) {
            return;
        }
        if (lock.clientId === clientId) {
            return;
        }
        if (lock.userId === userId) {
            throw new conflict_error_1.ConflictError(`Cannot ${action} workflow - you have this workflow open in another tab`);
        }
        else {
            throw new locked_error_1.LockedError(`Cannot ${action} workflow - another user currently has write access`);
        }
    }
};
exports.CollaborationService = CollaborationService;
exports.CollaborationService = CollaborationService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [backend_common_1.Logger,
        n8n_core_1.ErrorReporter,
        push_1.Push,
        collaboration_state_1.CollaborationState,
        db_1.UserRepository,
        access_service_1.AccessService])
], CollaborationService);
//# sourceMappingURL=collaboration.service.js.map