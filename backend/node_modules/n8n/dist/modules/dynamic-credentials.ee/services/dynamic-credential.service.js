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
exports.DynamicCredentialService = void 0;
const backend_common_1 = require("@n8n/backend-common");
const decorators_1 = require("@n8n/decorators");
const di_1 = require("@n8n/di");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const load_nodes_and_credentials_1 = require("../../../load-nodes-and-credentials");
const static_auth_service_1 = require("../../../services/static-auth-service");
const credential_resolver_registry_service_1 = require("./credential-resolver-registry.service");
const resolver_config_expression_service_1 = require("./resolver-config-expression.service");
const shared_fields_1 = require("./shared-fields");
const credential_resolver_repository_1 = require("../database/repositories/credential-resolver.repository");
const dynamic_credentials_config_1 = require("../dynamic-credentials.config");
const credential_resolution_error_1 = require("../errors/credential-resolution.error");
const credential_resolver_not_configured_error_1 = require("../errors/credential-resolver-not-configured.error");
const credential_resolver_not_found_error_1 = require("../errors/credential-resolver-not-found.error");
const missing_execution_context_error_1 = require("../errors/missing-execution-context.error");
let DynamicCredentialService = class DynamicCredentialService {
    constructor(dynamicCredentialConfig, resolverRegistry, resolverRepository, loadNodesAndCredentials, cipher, logger, expressionService) {
        this.dynamicCredentialConfig = dynamicCredentialConfig;
        this.resolverRegistry = resolverRegistry;
        this.resolverRepository = resolverRepository;
        this.loadNodesAndCredentials = loadNodesAndCredentials;
        this.cipher = cipher;
        this.logger = logger;
        this.expressionService = expressionService;
    }
    async resolveIfNeeded(credentialsResolveMetadata, staticData, executionContext, workflowSettings) {
        const resolverId = credentialsResolveMetadata.resolverId ?? workflowSettings?.credentialResolverId;
        if (!credentialsResolveMetadata.isResolvable) {
            return { data: staticData, isDynamic: false };
        }
        if (!resolverId) {
            return this.handleResolverNotConfigured(credentialsResolveMetadata);
        }
        const resolverEntity = await this.resolverRepository.findOneBy({
            id: resolverId,
        });
        if (!resolverEntity) {
            return this.handleResolverNotFound(credentialsResolveMetadata, resolverId);
        }
        const resolver = this.resolverRegistry.getResolverByTypename(resolverEntity.type);
        if (!resolver) {
            return this.handleResolverNotFound(credentialsResolveMetadata, resolverId);
        }
        const credentialContext = this.buildCredentialContext(executionContext);
        if (!credentialContext) {
            return this.handleMissingContext(credentialsResolveMetadata);
        }
        try {
            const credentialType = this.loadNodesAndCredentials.getCredential(credentialsResolveMetadata.type);
            const sharedFields = (0, shared_fields_1.extractSharedFields)(credentialType.type);
            const decryptedConfig = this.cipher.decrypt(resolverEntity.config);
            const parsedConfig = (0, n8n_workflow_1.jsonParse)(decryptedConfig);
            const resolverConfig = await this.expressionService.resolve(parsedConfig);
            const dynamicData = await resolver.getSecret(credentialsResolveMetadata.id, credentialContext, {
                resolverId: resolverEntity.id,
                resolverName: resolverEntity.type,
                configuration: resolverConfig,
            });
            this.logger.debug('Successfully resolved dynamic credentials', {
                credentialId: credentialsResolveMetadata.id,
                resolverId,
                resolverSource: credentialsResolveMetadata.resolverId ? 'credential' : 'workflow',
                identity: credentialContext.identity,
            });
            for (const field of sharedFields) {
                if (field in dynamicData) {
                    delete dynamicData[field];
                }
            }
            return { data: { ...staticData, ...dynamicData }, isDynamic: true };
        }
        catch (error) {
            return this.handleResolutionError(credentialsResolveMetadata, error, resolverId);
        }
    }
    buildCredentialContext(executionContext) {
        if (!executionContext?.credentials) {
            return undefined;
        }
        try {
            const decrypted = this.cipher.decrypt(executionContext.credentials);
            return (0, n8n_workflow_1.toCredentialContext)(decrypted);
        }
        catch (error) {
            this.logger.error('Failed to decrypt credential context from execution context', {
                error: error instanceof Error ? error.message : String(error),
            });
            return undefined;
        }
    }
    handleResolutionError(credentialsResolveMetadata, error, resolverId) {
        this.logger.debug('Dynamic credential resolution failed', {
            credentialId: credentialsResolveMetadata.id,
            credentialName: credentialsResolveMetadata.name,
            resolverId,
            resolverSource: credentialsResolveMetadata.resolverId ? 'credential' : 'workflow',
            error: error instanceof Error ? error.message : String(error),
        });
        if (error instanceof credential_resolution_error_1.CredentialResolutionError || error instanceof decorators_1.CredentialResolverError) {
            throw new credential_resolution_error_1.CredentialResolutionError(`Failed to resolve dynamic credentials for "${credentialsResolveMetadata.name}": ${error.message}`, { cause: error });
        }
        throw new credential_resolution_error_1.CredentialResolutionError(`Failed to resolve dynamic credentials for "${credentialsResolveMetadata.name}"`, { cause: error });
    }
    handleResolverNotConfigured(credentialsResolveMetadata) {
        this.logger.debug('No resolver configured for dynamic credential', {
            credentialId: credentialsResolveMetadata.id,
            credentialName: credentialsResolveMetadata.name,
        });
        throw new credential_resolver_not_configured_error_1.CredentialResolverNotConfiguredError(credentialsResolveMetadata.name);
    }
    handleResolverNotFound(credentialsResolveMetadata, resolverId) {
        this.logger.debug('Resolver not found for dynamic credential', {
            credentialId: credentialsResolveMetadata.id,
            credentialName: credentialsResolveMetadata.name,
            resolverId,
            resolverSource: credentialsResolveMetadata.resolverId ? 'credential' : 'workflow',
        });
        throw new credential_resolver_not_found_error_1.CredentialResolverNotFoundError(credentialsResolveMetadata.name, resolverId);
    }
    handleMissingContext(credentialsResolveMetadata) {
        this.logger.debug('No execution context available for dynamic credential', {
            credentialId: credentialsResolveMetadata.id,
            credentialName: credentialsResolveMetadata.name,
        });
        throw new missing_execution_context_error_1.MissingExecutionContextError(credentialsResolveMetadata.name);
    }
    getDynamicCredentialsEndpointsMiddleware() {
        const { endpointAuthToken } = this.dynamicCredentialConfig;
        if (!endpointAuthToken?.trim()) {
            return (req, res, next) => {
                if (req.user) {
                    return next();
                }
                this.logger.error('Dynamic credentials external endpoints require an endpoint auth token. Please set the N8N_DYNAMIC_CREDENTIALS_ENDPOINT_AUTH_TOKEN environment variable to enable access.');
                res.status(500).json({
                    message: 'Dynamic credentials configuration is invalid. Check server logs for details.',
                });
                return;
            };
        }
        const staticAuthMiddlware = static_auth_service_1.StaticAuthService.getStaticAuthMiddleware(endpointAuthToken, 'x-authorization');
        return (req, res, next) => {
            if (req.user) {
                return next();
            }
            return staticAuthMiddlware(req, res, next);
        };
    }
};
exports.DynamicCredentialService = DynamicCredentialService;
exports.DynamicCredentialService = DynamicCredentialService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [dynamic_credentials_config_1.DynamicCredentialsConfig,
        credential_resolver_registry_service_1.DynamicCredentialResolverRegistry,
        credential_resolver_repository_1.DynamicCredentialResolverRepository,
        load_nodes_and_credentials_1.LoadNodesAndCredentials,
        n8n_core_1.Cipher,
        backend_common_1.Logger,
        resolver_config_expression_service_1.ResolverConfigExpressionService])
], DynamicCredentialService);
//# sourceMappingURL=dynamic-credential.service.js.map