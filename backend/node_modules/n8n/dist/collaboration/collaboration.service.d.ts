import type { User } from '@n8n/db';
import { UserRepository } from '@n8n/db';
import { Logger } from '@n8n/backend-common';
import { ErrorReporter } from 'n8n-core';
import type { Workflow } from 'n8n-workflow';
import { CollaborationState } from '../collaboration/collaboration.state';
import { Push } from '../push';
import { AccessService } from '../services/access.service';
export declare class CollaborationService {
    private readonly logger;
    private readonly errorReporter;
    private readonly push;
    private readonly state;
    private readonly userRepository;
    private readonly accessService;
    constructor(logger: Logger, errorReporter: ErrorReporter, push: Push, state: CollaborationState, userRepository: UserRepository, accessService: AccessService);
    init(): void;
    private isTransientError;
    handleUserMessage(userId: User['id'], clientId: string, msg: unknown): Promise<void>;
    private handleWorkflowOpened;
    private handleWorkflowClosed;
    private sendWorkflowUsersChangedMessage;
    private handleWriteAccessRequested;
    private handleWriteAccessReleaseRequested;
    private handleWriteAccessHeartbeat;
    private sendWriteAccessAcquiredMessage;
    private sendWriteAccessReleasedMessage;
    broadcastWorkflowUpdate(workflowId: Workflow['id'], updatedByUserId: User['id']): Promise<void>;
    getWriteLock(userId: User['id'], workflowId: Workflow['id']): Promise<{
        clientId: string;
        userId: string;
    } | null>;
    validateWriteLock(userId: User['id'], clientId: string | undefined, workflowId: Workflow['id'], action: string): Promise<void>;
}
