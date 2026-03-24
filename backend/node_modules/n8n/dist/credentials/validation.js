"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsExternalSecretExpression = containsExternalSecretExpression;
exports.extractProviderKeys = extractProviderKeys;
exports.isChangingExternalSecretExpression = isChangingExternalSecretExpression;
exports.validateExternalSecretsPermissions = validateExternalSecretsPermissions;
exports.validateAccessToReferencedSecretProviders = validateAccessToReferencedSecretProviders;
const get_1 = __importDefault(require("lodash/get"));
const bad_request_error_1 = require("../errors/response-errors/bad-request.error");
const check_access_1 = require("../permissions.ee/check-access");
const utils_1 = require("../utils");
const PROVIDER_KEY_PATTERN = '[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*';
function containsExternalSecretExpression(value) {
    const containsExpression = value.includes('{{') && value.includes('}}');
    if (!containsExpression) {
        return false;
    }
    return value.includes('$secrets.') || value.includes('$secrets[');
}
function extractProviderKeys(expression) {
    const providerKeys = new Set();
    const expressionBlocks = expression.matchAll(/\{\{(.*?)\}\}/gs);
    for (const expression of expressionBlocks) {
        const expressionContent = expression[1];
        const dotMatches = expressionContent.matchAll(new RegExp(`\\$secrets\\.(${PROVIDER_KEY_PATTERN})`, 'g'));
        for (const match of dotMatches) {
            providerKeys.add(match[1]);
        }
        const bracketMatches = expressionContent.matchAll(new RegExp(`\\$secrets\\[['"](${PROVIDER_KEY_PATTERN})['"]\\]`, 'g'));
        for (const match of bracketMatches) {
            providerKeys.add(match[1]);
        }
    }
    return Array.from(providerKeys);
}
function containsExternalSecrets(data) {
    const secretPaths = (0, utils_1.getAllKeyPaths)(data, '', [], containsExternalSecretExpression);
    return secretPaths.length > 0;
}
function isChangingExternalSecretExpression(newData, existingData) {
    const newSecretPaths = (0, utils_1.getAllKeyPaths)(newData, '', [], containsExternalSecretExpression);
    for (const path of newSecretPaths) {
        const newValue = (0, get_1.default)(newData, path);
        const existingValue = (0, get_1.default)(existingData, path);
        if (newValue !== existingValue) {
            return true;
        }
    }
    return false;
}
async function validateExternalSecretsPermissions({ user, projectId, dataToSave, decryptedExistingData, }) {
    if (!dataToSave) {
        return;
    }
    const isUpdatingExistingCredential = !!decryptedExistingData;
    const needsCheck = isUpdatingExistingCredential
        ? isChangingExternalSecretExpression(dataToSave, decryptedExistingData)
        : containsExternalSecrets(dataToSave);
    if (needsCheck) {
        const hasAccess = await (0, check_access_1.userHasScopes)(user, ['externalSecret:list'], false, { projectId });
        if (!hasAccess) {
            throw new bad_request_error_1.BadRequestError('Lacking permissions to reference external secrets in credentials');
        }
    }
}
async function validateAccessToReferencedSecretProviders(projectId, data, externalSecretsProviderAccessCheckService, source) {
    const secretPaths = (0, utils_1.getAllKeyPaths)(data, '', [], containsExternalSecretExpression);
    if (secretPaths.length === 0) {
        return;
    }
    const providerToCredentialPropertyMap = new Map();
    for (const credentialProperty of secretPaths) {
        const expressionString = (0, get_1.default)(data, credentialProperty);
        if (typeof expressionString === 'string') {
            const providerKeys = extractProviderKeys(expressionString);
            if (providerKeys.length === 0) {
                throw new bad_request_error_1.BadRequestError(`Could not find a valid external secret vault name inside "${expressionString}" used in "${credentialProperty}"`);
            }
            for (const providerKey of providerKeys) {
                const credentialProperties = providerToCredentialPropertyMap.get(providerKey) ?? [];
                credentialProperties.push(credentialProperty);
                providerToCredentialPropertyMap.set(providerKey, credentialProperties);
            }
        }
    }
    if (providerToCredentialPropertyMap.size === 0) {
        return;
    }
    const inaccessibleProviders = new Map();
    const providerKeys = Array.from(providerToCredentialPropertyMap.keys());
    await Promise.all(providerKeys.map(async (providerKey) => {
        const hasAccess = await externalSecretsProviderAccessCheckService.isProviderAvailableInProject(providerKey, projectId);
        if (!hasAccess) {
            const credentialProperties = providerToCredentialPropertyMap.get(providerKey) ?? [];
            if (credentialProperties.length > 0) {
                inaccessibleProviders.set(providerKey, credentialProperties);
            }
        }
    }));
    if (inaccessibleProviders.size > 0) {
        const formatCredentialPropertyList = (properties) => {
            return properties.map((f) => `"${f}"`).join(', ');
        };
        const errorMessageSuffix = source === 'transfer' ? 'in the destination project' : 'in this project';
        if (inaccessibleProviders.size === 1) {
            const [providerKey, credentialProperties] = Array.from(inaccessibleProviders.entries())[0];
            const credentialPropertyList = formatCredentialPropertyList(credentialProperties);
            throw new bad_request_error_1.BadRequestError(`The secret provider "${providerKey}" used in ${credentialPropertyList} does not exist ${errorMessageSuffix}`);
        }
        else {
            const providerDetails = Array.from(inaccessibleProviders.entries())
                .map(([provider, fields]) => {
                const credentialPopertyList = formatCredentialPropertyList(fields);
                return `"${provider}" (used in ${credentialPopertyList})`;
            })
                .join(', ');
            throw new bad_request_error_1.BadRequestError(`The secret providers ${providerDetails} do not exist ${errorMessageSuffix}`);
        }
    }
}
//# sourceMappingURL=validation.js.map