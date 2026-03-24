"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowCreationService = void 0;
const backend_common_1 = require("@n8n/backend-common");
const config_1 = require("@n8n/config");
const db_1 = require("@n8n/db");
const di_1 = require("@n8n/di");
const uuid_1 = require("uuid");
const workflow_finder_service_1 = require("./workflow-finder.service");
const workflow_history_service_1 = require("./workflow-history/workflow-history.service");
const bad_request_error_1 = require("../errors/response-errors/bad-request.error");
const internal_server_error_1 = require("../errors/response-errors/internal-server.error");
const event_service_1 = require("../events/event.service");
const check_access_1 = require("../permissions.ee/check-access");
const external_hooks_1 = require("../external-hooks");
const generic_helpers_1 = require("../generic-helpers");
const project_service_ee_1 = require("../services/project.service.ee");
const tag_service_1 = require("../services/tag.service");
const folder_service_1 = require("../services/folder.service");
const credentials_service_1 = require("../credentials/credentials.service");
const workflow_service_ee_1 = require("./workflow.service.ee");
const WorkflowHelpers = __importStar(require("../workflow-helpers"));
let WorkflowCreationService = class WorkflowCreationService {
    constructor(logger, sharedWorkflowRepository, tagService, workflowHistoryService, externalHooks, projectService, eventService, globalConfig, workflowFinderService, licenseState, projectRepository, tagRepository, credentialsService, folderService, enterpriseWorkflowService) {
        this.logger = logger;
        this.sharedWorkflowRepository = sharedWorkflowRepository;
        this.tagService = tagService;
        this.workflowHistoryService = workflowHistoryService;
        this.externalHooks = externalHooks;
        this.projectService = projectService;
        this.eventService = eventService;
        this.globalConfig = globalConfig;
        this.workflowFinderService = workflowFinderService;
        this.licenseState = licenseState;
        this.projectRepository = projectRepository;
        this.tagRepository = tagRepository;
        this.credentialsService = credentialsService;
        this.folderService = folderService;
        this.enterpriseWorkflowService = enterpriseWorkflowService;
    }
    async createWorkflow(user, newWorkflow, options = {}) {
        const { tagIds, parentFolderId, projectId, autosaved = false, uiContext } = options;
        newWorkflow.active = false;
        newWorkflow.versionId = (0, uuid_1.v4)();
        await (0, generic_helpers_1.validateEntity)(newWorkflow);
        await this.externalHooks.run('workflow.create', [newWorkflow]);
        if (tagIds?.length && !this.globalConfig.tags.disabled) {
            newWorkflow.tags = await this.tagRepository.findMany(tagIds);
        }
        await WorkflowHelpers.replaceInvalidCredentials(newWorkflow);
        WorkflowHelpers.addNodeIds(newWorkflow);
        if (this.licenseState.isSharingLicensed()) {
            const allCredentials = await this.credentialsService.getMany(user, {
                includeGlobal: true,
            });
            try {
                this.enterpriseWorkflowService.validateCredentialPermissionsToUser(newWorkflow, allCredentials);
            }
            catch (error) {
                throw new bad_request_error_1.BadRequestError('The workflow you are trying to save contains credentials that are not shared with you');
            }
        }
        const { manager: dbManager } = this.projectRepository;
        let project = null;
        const savedWorkflow = await dbManager.transaction(async (transactionManager) => {
            let effectiveProjectId = projectId;
            if (effectiveProjectId === undefined) {
                const personalProject = await this.projectRepository.getPersonalProjectForUserOrFail(user.id, transactionManager);
                effectiveProjectId = personalProject.id;
            }
            project = await this.projectService.getProjectWithScope(user, effectiveProjectId, ['workflow:create'], transactionManager);
            if (project === null) {
                throw new bad_request_error_1.BadRequestError("You don't have the permissions to save the workflow in this project.");
            }
            if (newWorkflow.settings?.redactionPolicy !== undefined) {
                const canUpdateRedaction = await (0, check_access_1.userHasScopes)(user, ['workflow:updateRedactionSetting'], false, { projectId: effectiveProjectId });
                if (!canUpdateRedaction) {
                    delete newWorkflow.settings.redactionPolicy;
                }
            }
            const workflow = await transactionManager.save(newWorkflow);
            if (parentFolderId) {
                try {
                    const parentFolder = await this.folderService.findFolderInProjectOrFail(parentFolderId, project.id, transactionManager);
                    await transactionManager.update(db_1.WorkflowEntity, { id: workflow.id }, { parentFolder });
                }
                catch { }
            }
            const newSharedWorkflow = this.sharedWorkflowRepository.create({
                role: 'workflow:owner',
                projectId: project.id,
                workflow,
            });
            await transactionManager.save(newSharedWorkflow);
            await this.workflowHistoryService.saveVersion(user, workflow, workflow.id, autosaved, transactionManager);
            return await this.workflowFinderService.findWorkflowForUser(workflow.id, user, ['workflow:read'], {
                em: transactionManager,
                includeTags: true,
                includeParentFolder: true,
                includeActiveVersion: true,
            });
        });
        if (!savedWorkflow) {
            this.logger.error('Failed to create workflow', { userId: user.id });
            throw new internal_server_error_1.InternalServerError('Failed to save workflow');
        }
        if (tagIds && !this.globalConfig.tags.disabled && savedWorkflow.tags) {
            savedWorkflow.tags = this.tagService.sortByRequestOrder(savedWorkflow.tags, {
                requestOrder: tagIds,
            });
        }
        await this.externalHooks.run('workflow.afterCreate', [savedWorkflow]);
        this.eventService.emit('workflow-created', {
            user,
            workflow: newWorkflow,
            publicApi: false,
            projectId: project.id,
            projectType: project.type,
            uiContext,
        });
        return savedWorkflow;
    }
};
exports.WorkflowCreationService = WorkflowCreationService;
exports.WorkflowCreationService = WorkflowCreationService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [backend_common_1.Logger,
        db_1.SharedWorkflowRepository,
        tag_service_1.TagService,
        workflow_history_service_1.WorkflowHistoryService,
        external_hooks_1.ExternalHooks,
        project_service_ee_1.ProjectService,
        event_service_1.EventService,
        config_1.GlobalConfig,
        workflow_finder_service_1.WorkflowFinderService,
        backend_common_1.LicenseState,
        db_1.ProjectRepository,
        db_1.TagRepository,
        credentials_service_1.CredentialsService,
        folder_service_1.FolderService,
        workflow_service_ee_1.EnterpriseWorkflowService])
], WorkflowCreationService);
//# sourceMappingURL=workflow-creation.service.js.map