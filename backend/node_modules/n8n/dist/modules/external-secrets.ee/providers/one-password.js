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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnePasswordProvider = void 0;
const backend_common_1 = require("@n8n/backend-common");
const di_1 = require("@n8n/di");
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../constants");
const types_1 = require("../types");
class OnePasswordProvider extends types_1.SecretsProvider {
    constructor(logger = di_1.Container.get(backend_common_1.Logger)) {
        super();
        this.logger = logger;
        this.name = 'onePassword';
        this.displayName = '1Password';
        this.properties = [
            constants_1.DOCS_HELP_NOTICE,
            {
                displayName: 'Connect Server URL',
                name: 'serverUrl',
                type: 'string',
                default: '',
                required: true,
                placeholder: 'e.g. http://localhost:8080',
                hint: 'URL of your <a href="https://developer.1password.com/docs/connect/get-started/" target="_blank">1Password Connect Server</a>.',
                noDataExpression: true,
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                required: true,
                typeOptions: { password: true },
                placeholder: 'e.g. eyJhbGciOiJFUzI1NiIsImtpZCI6...',
                hint: 'Token created for your Connect Server integration.',
                noDataExpression: true,
            },
        ];
        this.cachedSecrets = {};
        this.logger = this.logger.scoped('external-secrets');
    }
    async init(context) {
        const trimmedServerUrl = context.settings.serverUrl?.trim();
        const trimmedAccessToken = context.settings.accessToken?.trim();
        if (!trimmedServerUrl) {
            throw new n8n_workflow_1.UserError('Connect Server URL is required.');
        }
        if (!trimmedAccessToken) {
            throw new n8n_workflow_1.UserError('Access Token is required.');
        }
        this.settings = {
            serverUrl: trimmedServerUrl,
            accessToken: trimmedAccessToken,
        };
    }
    async doConnect() {
        const { OnePasswordConnect } = await Promise.resolve().then(() => __importStar(require('@1password/connect')));
        this.client = OnePasswordConnect({
            serverURL: this.settings.serverUrl,
            token: this.settings.accessToken,
            keepAlive: true,
        });
        const [wasSuccessful, errorMessage] = await this.test();
        if (!wasSuccessful) {
            throw new Error(errorMessage || 'Connection failed');
        }
        this.logger.debug('1Password provider connected');
    }
    async test() {
        if (!this.client)
            return [false, 'Client not initialized'];
        try {
            await this.client.listVaults();
            return [true];
        }
        catch (error) {
            return [false, error instanceof Error ? error.message : 'Unknown error'];
        }
    }
    async disconnect() {
    }
    async update() {
        const vaults = await this.client.listVaults();
        const secrets = {};
        for (const vault of vaults) {
            if (!vault.id)
                continue;
            const items = await this.client.listItems(vault.id);
            for (const item of items) {
                if (!item.id || !item.title)
                    continue;
                const fullItem = await this.client.getItemById(vault.id, item.id);
                if (!fullItem.fields?.length)
                    continue;
                const fieldValues = {};
                for (const field of fullItem.fields) {
                    if (field.label && field.value) {
                        fieldValues[field.label] = field.value;
                    }
                }
                if (Object.keys(fieldValues).length === 0)
                    continue;
                secrets[item.title] = fieldValues;
            }
        }
        this.cachedSecrets = secrets;
        this.logger.debug('1Password provider secrets updated');
    }
    getSecret(name) {
        return this.cachedSecrets[name];
    }
    hasSecret(name) {
        return name in this.cachedSecrets;
    }
    getSecretNames() {
        return Object.keys(this.cachedSecrets);
    }
}
exports.OnePasswordProvider = OnePasswordProvider;
//# sourceMappingURL=one-password.js.map