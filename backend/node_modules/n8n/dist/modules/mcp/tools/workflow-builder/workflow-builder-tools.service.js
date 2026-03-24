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
exports.WorkflowBuilderToolsService = void 0;
const backend_common_1 = require("@n8n/backend-common");
const di_1 = require("@n8n/di");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const load_nodes_and_credentials_1 = require("../../../../load-nodes-and-credentials");
let WorkflowBuilderToolsService = class WorkflowBuilderToolsService {
    constructor(loadNodesAndCredentials, logger) {
        this.loadNodesAndCredentials = loadNodesAndCredentials;
        this.logger = logger;
        this.nodeDefinitionDirs = [];
        this.loadNodesAndCredentials.addPostProcessor(async () => await this.refreshNodeTypes());
    }
    async initialize() {
        this.initPromise ??= this.doInitialize();
        await this.initPromise;
    }
    getNodeTypeParser() {
        if (!this.nodeTypeParser) {
            throw new Error('WorkflowBuilderToolsService not initialized. Call initialize() first.');
        }
        return this.nodeTypeParser;
    }
    getNodeDefinitionDirs() {
        return this.nodeDefinitionDirs;
    }
    async doInitialize() {
        const { NodeTypeParser: NodeTypeParserClass } = await Promise.resolve().then(() => __importStar(require('@n8n/ai-workflow-builder')));
        const { setSchemaBaseDirs } = await Promise.resolve().then(() => __importStar(require('@n8n/workflow-sdk')));
        await this.loadNodesAndCredentials.postProcessLoaders();
        const { nodes: nodeTypeDescriptions } = await this.loadNodesAndCredentials.collectTypes();
        this.nodeTypeParser = new NodeTypeParserClass(nodeTypeDescriptions);
        this.nodeDefinitionDirs = await this.resolveBuiltinNodeDefinitionDirs();
        setSchemaBaseDirs(this.nodeDefinitionDirs);
        this.logger.debug('WorkflowBuilderToolsService initialized', {
            nodeTypeCount: nodeTypeDescriptions.length,
            nodeDefinitionDirs: this.nodeDefinitionDirs.length,
        });
    }
    async refreshNodeTypes() {
        if (!this.nodeTypeParser)
            return;
        const { NodeTypeParser: NodeTypeParserClass } = await Promise.resolve().then(() => __importStar(require('@n8n/ai-workflow-builder')));
        const { nodes: nodeTypeDescriptions } = await this.loadNodesAndCredentials.collectTypes();
        this.nodeTypeParser = new NodeTypeParserClass(nodeTypeDescriptions);
        this.logger.debug('WorkflowBuilderToolsService refreshed node types', {
            nodeTypeCount: nodeTypeDescriptions.length,
        });
    }
    async resolveBuiltinNodeDefinitionDirs() {
        const dirs = [];
        for (const packageId of ['n8n-nodes-base', '@n8n/n8n-nodes-langchain']) {
            try {
                const packageJsonPath = require.resolve(`${packageId}/package.json`);
                const distDir = path.dirname(packageJsonPath);
                const nodeDefsDir = path.join(distDir, 'dist', 'node-definitions');
                await fs.access(nodeDefsDir);
                dirs.push(nodeDefsDir);
            }
            catch (error) {
                this.logger.debug(`Could not resolve node definitions for ${packageId}`, { error });
            }
        }
        return dirs;
    }
};
exports.WorkflowBuilderToolsService = WorkflowBuilderToolsService;
exports.WorkflowBuilderToolsService = WorkflowBuilderToolsService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [load_nodes_and_credentials_1.LoadNodesAndCredentials,
        backend_common_1.Logger])
], WorkflowBuilderToolsService);
//# sourceMappingURL=workflow-builder-tools.service.js.map