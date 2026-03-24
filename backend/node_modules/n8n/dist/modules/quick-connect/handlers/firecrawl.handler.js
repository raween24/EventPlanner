"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirecrawlHandler = void 0;
const di_1 = require("@n8n/di");
const axios_1 = __importDefault(require("axios"));
const FIRECRAWL_API_BASE_URL = 'https://api.firecrawl.dev';
let FirecrawlHandler = class FirecrawlHandler {
    setConfig(config) {
        this.config = config;
    }
    async getCredentialData({ email }) {
        const secret = this.config.backendFlowConfig.secret;
        const response = await axios_1.default.post(`${FIRECRAWL_API_BASE_URL}/admin/integration/create-user`, { email }, {
            headers: {
                Authorization: `Bearer ${secret}`,
                'Content-Type': 'application/json',
            },
        });
        return {
            apiKey: response.data.apiKey,
        };
    }
};
exports.FirecrawlHandler = FirecrawlHandler;
exports.FirecrawlHandler = FirecrawlHandler = __decorate([
    (0, di_1.Service)()
], FirecrawlHandler);
//# sourceMappingURL=firecrawl.handler.js.map