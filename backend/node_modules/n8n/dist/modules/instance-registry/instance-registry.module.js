"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceRegistryModule = void 0;
const backend_common_1 = require("@n8n/backend-common");
const decorators_1 = require("@n8n/decorators");
const di_1 = require("@n8n/di");
let InstanceRegistryModule = class InstanceRegistryModule {
    async init() {
        const logger = di_1.Container.get(backend_common_1.Logger);
        logger.debug('Initializing instance-registry module.');
    }
};
exports.InstanceRegistryModule = InstanceRegistryModule;
exports.InstanceRegistryModule = InstanceRegistryModule = __decorate([
    (0, decorators_1.BackendModule)({ name: 'instance-registry' })
], InstanceRegistryModule);
//# sourceMappingURL=instance-registry.module.js.map