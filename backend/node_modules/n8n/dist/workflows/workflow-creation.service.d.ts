import { LicenseState, Logger } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import type { User } from '@n8n/db';
import { WorkflowEntity, SharedWorkflowRepository, ProjectRepository, TagRepository } from '@n8n/db';
import { WorkflowFinderService } from './workflow-finder.service';
import { WorkflowHistoryService } from './workflow-history/workflow-history.service';
import { EventService } from '../events/event.service';
import { ExternalHooks } from '../external-hooks';
import { ProjectService } from '../services/project.service.ee';
import { TagService } from '../services/tag.service';
import { FolderService } from '../services/folder.service';
import { CredentialsService } from '../credentials/credentials.service';
import { EnterpriseWorkflowService } from './workflow.service.ee';
export declare class WorkflowCreationService {
    private readonly logger;
    private readonly sharedWorkflowRepository;
    private readonly tagService;
    private readonly workflowHistoryService;
    private readonly externalHooks;
    private readonly projectService;
    private readonly eventService;
    private readonly globalConfig;
    private readonly workflowFinderService;
    private readonly licenseState;
    private readonly projectRepository;
    private readonly tagRepository;
    private readonly credentialsService;
    private readonly folderService;
    private readonly enterpriseWorkflowService;
    constructor(logger: Logger, sharedWorkflowRepository: SharedWorkflowRepository, tagService: TagService, workflowHistoryService: WorkflowHistoryService, externalHooks: ExternalHooks, projectService: ProjectService, eventService: EventService, globalConfig: GlobalConfig, workflowFinderService: WorkflowFinderService, licenseState: LicenseState, projectRepository: ProjectRepository, tagRepository: TagRepository, credentialsService: CredentialsService, folderService: FolderService, enterpriseWorkflowService: EnterpriseWorkflowService);
    createWorkflow(user: User, newWorkflow: WorkflowEntity, options?: {
        tagIds?: string[];
        parentFolderId?: string;
        projectId?: string;
        autosaved?: boolean;
        uiContext?: string;
    }): Promise<WorkflowEntity>;
}
