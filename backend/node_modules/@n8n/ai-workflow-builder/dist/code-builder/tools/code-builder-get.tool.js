"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPathComponent = isValidPathComponent;
exports.validatePathWithinBase = validatePathWithinBase;
exports.createCodeBuilderGetTool = createCodeBuilderGetTool;
const tools_1 = require("@langchain/core/tools");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const zod_1 = require("zod");
function isValidPathComponent(component) {
    if (!component || component.trim() === '') {
        return false;
    }
    if (component.includes('\0')) {
        return false;
    }
    if (component.includes('/') || component.includes('\\')) {
        return false;
    }
    if (component === '..' || component.startsWith('..')) {
        return false;
    }
    return true;
}
function validatePathWithinBase(filePath, baseDir) {
    const resolvedPath = (0, node_path_1.resolve)(filePath);
    const resolvedBase = (0, node_path_1.resolve)(baseDir);
    return resolvedPath.startsWith(resolvedBase + '/') || resolvedPath === resolvedBase;
}
function getGeneratedNodesPaths(nodeDefinitionDirs) {
    if (nodeDefinitionDirs && nodeDefinitionDirs.length > 0) {
        return nodeDefinitionDirs.map((dir) => (0, node_path_1.join)(dir, 'nodes'));
    }
    return [];
}
function findNodeDir(parsed, nodesPaths) {
    for (const nodesPath of nodesPaths) {
        const nodeDir = (0, node_path_1.join)(nodesPath, parsed.packageName, parsed.nodeName);
        if ((0, node_fs_1.existsSync)(nodeDir)) {
            return { nodesPath, nodeDir };
        }
    }
    if (parsed.nodeName.endsWith('Tool')) {
        const baseName = parsed.nodeName.slice(0, -4);
        for (const nodesPath of nodesPaths) {
            const nodeDir = (0, node_path_1.join)(nodesPath, parsed.packageName, baseName);
            if ((0, node_fs_1.existsSync)(nodeDir)) {
                return { nodesPath, nodeDir };
            }
        }
    }
    return null;
}
function toSnakeCase(str) {
    return str
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '')
        .replace(/[-\s]+/g, '_');
}
function isSplitVersionStructure(nodeDir, versionStr) {
    const versionDir = (0, node_path_1.join)(nodeDir, versionStr);
    return (0, node_fs_1.existsSync)(versionDir) && (0, node_fs_1.statSync)(versionDir).isDirectory();
}
function getAvailableDiscriminators(nodeDir, versionStr) {
    const versionDir = (0, node_path_1.join)(nodeDir, versionStr);
    if (!(0, node_fs_1.existsSync)(versionDir)) {
        return {};
    }
    try {
        const entries = (0, node_fs_1.readdirSync)(versionDir, { withFileTypes: true });
        const resources = [];
        const modes = [];
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('resource_')) {
                resources.push(entry.name.replace('resource_', ''));
            }
            else if (entry.isFile() && entry.name.startsWith('mode_') && entry.name.endsWith('.ts')) {
                modes.push(entry.name.replace('mode_', '').replace('.ts', ''));
            }
        }
        return {
            resources: resources.length > 0 ? resources : undefined,
            modes: modes.length > 0 ? modes : undefined,
        };
    }
    catch {
        return {};
    }
}
function parseNodeId(nodeId) {
    if (nodeId.startsWith('@n8n/')) {
        const withoutPrefix = nodeId.slice(5);
        const dotIndex = withoutPrefix.indexOf('.');
        if (dotIndex === -1) {
            return null;
        }
        return {
            packageName: withoutPrefix.slice(0, dotIndex),
            nodeName: withoutPrefix.slice(dotIndex + 1),
        };
    }
    const dotIndex = nodeId.indexOf('.');
    if (dotIndex === -1) {
        return null;
    }
    return {
        packageName: nodeId.slice(0, dotIndex),
        nodeName: nodeId.slice(dotIndex + 1),
    };
}
function getNodeVersions(nodeId, nodeDefinitionDirs) {
    const parsed = parseNodeId(nodeId);
    if (!parsed) {
        return [];
    }
    const nodesPaths = getGeneratedNodesPaths(nodeDefinitionDirs);
    const found = findNodeDir(parsed, nodesPaths);
    if (!found) {
        return [];
    }
    const { nodeDir } = found;
    try {
        const entries = (0, node_fs_1.readdirSync)(nodeDir, { withFileTypes: true });
        const versions = [];
        for (const entry of entries) {
            if (entry.isFile() &&
                entry.name.startsWith('v') &&
                entry.name.endsWith('.ts') &&
                entry.name !== 'index.ts' &&
                !entry.name.endsWith('.schema.js')) {
                versions.push(entry.name.replace('.ts', ''));
            }
            else if (entry.isDirectory() && /^v\d+$/.test(entry.name)) {
                versions.push(entry.name);
            }
        }
        versions.sort((a, b) => {
            const aNum = parseInt(a.slice(1), 10);
            const bNum = parseInt(b.slice(1), 10);
            return bNum - aNum;
        });
        return versions;
    }
    catch {
        return [];
    }
}
function resolveResourceOperationPath(nodeDir, targetVersion, nodeId, available, discriminators) {
    if (!discriminators?.resource || !discriminators?.operation) {
        return {
            error: `Error: Node '${nodeId}' requires resource and operation discriminators. Available resources: ${available.resources?.join(', ')}. Use search_nodes to see all options.`,
            requiresDiscriminators: true,
            availableDiscriminators: available,
        };
    }
    if (!isValidPathComponent(discriminators.resource)) {
        return {
            error: `Error: Invalid resource value '${discriminators.resource}' - contains invalid characters`,
        };
    }
    if (!isValidPathComponent(discriminators.operation)) {
        return {
            error: `Error: Invalid operation value '${discriminators.operation}' - contains invalid characters`,
        };
    }
    const resourcePath = `resource_${toSnakeCase(discriminators.resource)}`;
    const resourceDir = (0, node_path_1.join)(nodeDir, targetVersion, resourcePath);
    if (!(0, node_fs_1.existsSync)(resourceDir)) {
        return {
            error: `Error: Invalid resource '${discriminators.resource}' for node '${nodeId}'. Available: ${available.resources?.join(', ')}`,
        };
    }
    const operationFile = `operation_${toSnakeCase(discriminators.operation)}.ts`;
    const filePath = (0, node_path_1.join)(resourceDir, operationFile);
    if (!validatePathWithinBase(filePath, nodeDir)) {
        return {
            error: 'Error: Invalid path - path traversal detected',
        };
    }
    if (!(0, node_fs_1.existsSync)(filePath)) {
        try {
            const ops = (0, node_fs_1.readdirSync)(resourceDir)
                .filter((f) => f.startsWith('operation_') && f.endsWith('.ts'))
                .map((f) => f.replace('operation_', '').replace('.ts', ''));
            return {
                error: `Error: Invalid operation '${discriminators.operation}' for resource '${discriminators.resource}'. Available: ${ops.join(', ')}`,
            };
        }
        catch {
            return {
                error: `Error: Could not read operations for resource '${discriminators.resource}'`,
            };
        }
    }
    return { filePath };
}
function resolveModePath(nodeDir, targetVersion, nodeId, available, mode) {
    if (!mode) {
        return {
            error: `Error: Node '${nodeId}' requires mode discriminator. Available modes: ${available.modes?.join(', ')}. Use search_nodes to see all options.`,
            requiresDiscriminators: true,
            availableDiscriminators: available,
        };
    }
    if (!isValidPathComponent(mode)) {
        return {
            error: `Error: Invalid mode value '${mode}' - contains invalid characters`,
        };
    }
    const modeFile = `mode_${toSnakeCase(mode)}.ts`;
    const filePath = (0, node_path_1.join)(nodeDir, targetVersion, modeFile);
    if (!validatePathWithinBase(filePath, nodeDir)) {
        return {
            error: 'Error: Invalid path - path traversal detected',
        };
    }
    if (!(0, node_fs_1.existsSync)(filePath)) {
        return {
            error: `Error: Invalid mode '${mode}' for node '${nodeId}'. Available: ${available.modes?.join(', ')}`,
        };
    }
    return { filePath };
}
function tryGetNodeFilePath(nodeId, version, nodeDefinitionDirs, discriminators) {
    const parsed = parseNodeId(nodeId);
    if (!parsed) {
        return { error: `Invalid node ID format: '${nodeId}'` };
    }
    if (!isValidPathComponent(parsed.packageName)) {
        return {
            error: `Error: Invalid package name in node ID '${nodeId}' - contains invalid characters`,
        };
    }
    if (!isValidPathComponent(parsed.nodeName)) {
        return {
            error: `Error: Invalid node name in node ID '${nodeId}' - contains invalid characters`,
        };
    }
    const nodesPaths = getGeneratedNodesPaths(nodeDefinitionDirs);
    const found = findNodeDir(parsed, nodesPaths);
    if (!found) {
        return {
            error: `Node type '${nodeId}' not found. Use search_node to find the correct node ID.`,
        };
    }
    const { nodesPath, nodeDir } = found;
    if (!validatePathWithinBase(nodeDir, nodesPath)) {
        return { error: 'Error: Invalid path - path traversal detected' };
    }
    let targetVersion = version;
    if (!targetVersion) {
        const versions = getNodeVersions(nodeId, nodeDefinitionDirs);
        if (versions.length === 0) {
            return { error: `No versions found for node '${nodeId}'` };
        }
        targetVersion = versions[0];
    }
    if (!targetVersion.startsWith('v')) {
        targetVersion = `v${targetVersion.replace('.', '')}`;
    }
    else {
        targetVersion = `v${targetVersion.slice(1).replace('.', '')}`;
    }
    if (isSplitVersionStructure(nodeDir, targetVersion)) {
        const available = getAvailableDiscriminators(nodeDir, targetVersion);
        if (available.resources && available.resources.length > 0) {
            return resolveResourceOperationPath(nodeDir, targetVersion, nodeId, available, discriminators);
        }
        if (available.modes && available.modes.length > 0) {
            return resolveModePath(nodeDir, targetVersion, nodeId, available, discriminators?.mode);
        }
        return {
            error: `Error: Node '${nodeId}' has split structure but no recognized discriminators found`,
        };
    }
    const filePath = (0, node_path_1.join)(nodeDir, `${targetVersion}.ts`);
    if (!(0, node_fs_1.existsSync)(filePath)) {
        return { error: `Version '${version}' not found for node '${nodeId}'` };
    }
    return { filePath };
}
function getNodeFilePath(nodeId, version, nodeDefinitionDirs, discriminators) {
    let result = tryGetNodeFilePath(nodeId, version, nodeDefinitionDirs, discriminators);
    if (result.error && nodeId.endsWith('Tool')) {
        const baseNodeId = nodeId.slice(0, -4);
        result = tryGetNodeFilePath(baseNodeId, version, nodeDefinitionDirs, discriminators);
    }
    return result;
}
function getNodeTypeDefinition(nodeId, version, nodeDefinitionDirs, discriminators) {
    const nodesPaths = getGeneratedNodesPaths(nodeDefinitionDirs);
    const anyDirExists = nodesPaths.some((p) => (0, node_fs_1.existsSync)(p));
    if (!anyDirExists) {
        const errorMsg = nodeDefinitionDirs
            ? 'Node types directory not found in any of the configured dirs. Types may not have been generated yet.'
            : 'Node types not found. The generated types directory does not exist. Ensure the application has started properly and types have been generated.';
        return {
            nodeId,
            content: '',
            error: errorMsg,
        };
    }
    const pathResult = getNodeFilePath(nodeId, version, nodeDefinitionDirs, discriminators);
    if (pathResult.error) {
        const availableVersions = getNodeVersions(nodeId, nodeDefinitionDirs);
        return {
            nodeId,
            version,
            content: '',
            availableVersions: availableVersions.length > 0 ? availableVersions : undefined,
            error: pathResult.error,
        };
    }
    if (!pathResult.filePath) {
        return {
            nodeId,
            content: '',
            error: `Node type '${nodeId}' not found. Use search_node to find the correct node ID.`,
        };
    }
    try {
        const content = (0, node_fs_1.readFileSync)(pathResult.filePath, 'utf-8');
        const actualVersion = pathResult.filePath.match(/\/(v\d+)(?:\/|\.ts)/)?.[1];
        return { nodeId, version: actualVersion, content };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            nodeId,
            content: '',
            error: `Error reading node definition for '${nodeId}': ${errorMessage}`,
        };
    }
}
function createCodeBuilderGetTool(options = {}) {
    const { nodeDefinitionDirs } = options;
    return (0, tools_1.tool)(async (input) => {
        const results = [];
        const errors = [];
        for (const nodeRequest of input.nodeIds) {
            const nodeId = typeof nodeRequest === 'string' ? nodeRequest : nodeRequest.nodeId;
            const version = typeof nodeRequest === 'string' ? undefined : nodeRequest.version;
            const discriminators = typeof nodeRequest === 'string'
                ? undefined
                : {
                    resource: nodeRequest.resource,
                    operation: nodeRequest.operation,
                    mode: nodeRequest.mode,
                };
            const result = getNodeTypeDefinition(nodeId, version, nodeDefinitionDirs, discriminators);
            if (result.error) {
                errors.push(result.error);
            }
            else {
                const versionLabel = result.version ? ` (${result.version})` : '';
                results.push(`## ${nodeId}${versionLabel}\n\n\`\`\`typescript\n${result.content}\n\`\`\``);
            }
        }
        let response = '';
        if (results.length > 0) {
            response += `# TypeScript Type Definitions\n\n${results.join('\n\n---\n\n')}`;
        }
        if (errors.length > 0) {
            response += `\n\n# Errors\n\n${errors.join('\n')}`;
        }
        return response;
    }, {
        name: 'get_node_types',
        description: 'Get the full TypeScript type definitions for one or more nodes. Returns the complete type information including parameters, credentials, and node type variants. By default returns the latest version. For nodes with resource/operation or mode discriminators, you MUST specify them. Use search_nodes first to discover available discriminators. ALWAYS call this with ALL node types you plan to use BEFORE generating workflow code.',
        schema: zod_1.z.object({
            nodeIds: zod_1.z
                .array(zod_1.z.union([
                zod_1.z.string(),
                zod_1.z.object({
                    nodeId: zod_1.z.string().describe('The node ID (e.g., "n8n-nodes-base.httpRequest")'),
                    version: zod_1.z
                        .string()
                        .optional()
                        .describe('Optional version (e.g., "34" for v34). Omit for latest version.'),
                    resource: zod_1.z
                        .string()
                        .optional()
                        .describe('Resource discriminator for REST API nodes (e.g., "ticket", "contact")'),
                    operation: zod_1.z
                        .string()
                        .optional()
                        .describe('Operation discriminator (e.g., "get", "create", "update")'),
                    mode: zod_1.z
                        .string()
                        .optional()
                        .describe('Mode discriminator for nodes like Code (e.g., "runOnceForAllItems")'),
                }),
            ]))
                .describe('Array of nodes to fetch. Can be simple strings for flat nodes (e.g., ["n8n-nodes-base.aggregate"]) or objects with discriminators for split nodes (e.g., [{ nodeId: "n8n-nodes-base.freshservice", resource: "ticket", operation: "get" }] or [{ nodeId: "n8n-nodes-base.code", mode: "runOnceForAllItems" }]). Use search_nodes to discover which nodes require discriminators.'),
        }),
    });
}
//# sourceMappingURL=code-builder-get.tool.js.map