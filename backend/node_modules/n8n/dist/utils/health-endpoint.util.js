"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHealthEndpointPath = resolveHealthEndpointPath;
function resolveHealthEndpointPath(globalConfig) {
    const isHealthEndpointCustomized = process.env.N8N_ENDPOINT_HEALTH !== undefined;
    if (!isHealthEndpointCustomized && globalConfig.path !== '/') {
        return globalConfig.path + globalConfig.endpoints.health;
    }
    return globalConfig.endpoints.health;
}
//# sourceMappingURL=health-endpoint.util.js.map