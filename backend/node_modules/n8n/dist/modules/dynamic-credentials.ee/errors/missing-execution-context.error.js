"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingExecutionContextError = void 0;
const credential_resolution_error_1 = require("./credential-resolution.error");
class MissingExecutionContextError extends credential_resolution_error_1.CredentialResolutionError {
    constructor(credentialName) {
        super(`Cannot resolve dynamic credentials without execution context for "${credentialName}"`);
        this.name = 'MissingExecutionContextError';
    }
}
exports.MissingExecutionContextError = MissingExecutionContextError;
//# sourceMappingURL=missing-execution-context.error.js.map