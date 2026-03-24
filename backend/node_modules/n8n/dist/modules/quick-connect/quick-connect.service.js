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
exports.QuickConnectService = void 0;
const backend_common_1 = require("@n8n/backend-common");
const di_1 = require("@n8n/di");
const quick_connect_config_1 = require("./quick-connect.config");
const quick_connect_errors_1 = require("./quick-connect.errors");
const bad_request_error_1 = require("../../errors/response-errors/bad-request.error");
const backendHandlers = {
    firecrawl: async () => (await Promise.resolve().then(() => __importStar(require('./handlers/firecrawl.handler')))).FirecrawlHandler,
};
let QuickConnectService = class QuickConnectService {
    constructor(logger, quickConnectConfig) {
        this.logger = logger;
        this.quickConnectConfig = quickConnectConfig;
        this.handlers = new Map();
        this.logger = this.logger.scoped('quick-connect');
    }
    async getCredentialData(quickConnectType, user) {
        const handler = this.handlers.get(quickConnectType);
        if (!handler) {
            throw new bad_request_error_1.BadRequestError(`Quick connect handler not configured for: ${quickConnectType}`);
        }
        try {
            return await handler.getCredentialData(user);
        }
        catch (error) {
            this.logger.error('Failed to fetch credential data from third-party', {
                error,
                quickConnectType,
            });
            throw new quick_connect_errors_1.QuickConnectError('Failed to connect to external service. Please try again later.', quickConnectType, error instanceof Error ? error : undefined);
        }
    }
    async registerHandlers() {
        for (const option of this.quickConnectConfig.options) {
            const { quickConnectType } = option;
            if (quickConnectType in backendHandlers) {
                const Handler = await backendHandlers[quickConnectType]();
                const handler = di_1.Container.get(Handler);
                handler.setConfig(option);
                this.handlers.set(quickConnectType, handler);
            }
        }
    }
};
exports.QuickConnectService = QuickConnectService;
exports.QuickConnectService = QuickConnectService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [backend_common_1.Logger,
        quick_connect_config_1.QuickConnectConfig])
], QuickConnectService);
//# sourceMappingURL=quick-connect.service.js.map