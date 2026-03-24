"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExpression = parseExpression;
exports.isExpression = isExpression;
exports.expr = expr;
exports.createFromAIExpression = createFromAIExpression;
const n8n_workflow_1 = require("n8n-workflow");
function parseExpression(expr) {
    const match = expr.match(/^=\{\{\s*([\s\S]*?)\s*\}\}$/);
    return match ? match[1] : expr;
}
function isExpression(value) {
    return typeof value === 'string' && value.startsWith('={{') && value.endsWith('}}');
}
function isPlaceholderLike(value) {
    return (typeof value === 'object' &&
        value !== null &&
        '__placeholder' in value &&
        value.__placeholder === true &&
        'hint' in value &&
        typeof value.hint === 'string');
}
function isNewCredentialLike(value) {
    return (typeof value === 'object' &&
        value !== null &&
        '__newCredential' in value &&
        value.__newCredential === true &&
        'name' in value &&
        typeof value.name === 'string');
}
function expr(expression) {
    if (typeof expression !== 'string') {
        const value = expression;
        if (isPlaceholderLike(value)) {
            throw new Error(`expr(placeholder('${value.hint}')) is invalid. Use placeholder() directly as the value, not inside expr().`);
        }
        if (isNewCredentialLike(value)) {
            throw new Error(`expr(newCredential('${value.name}')) is invalid. Use newCredential() directly in the credentials config, not inside expr().`);
        }
        throw new Error(`expr() requires a string argument, but received ${typeof value}.`);
    }
    const normalized = expression.startsWith('=') ? expression.slice(1) : expression;
    return '=' + normalized;
}
function sanitizeFromAIKey(key) {
    let sanitized = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    sanitized = sanitized.replace(/_+/g, '_');
    sanitized = sanitized.replace(/^_+|_+$/g, '');
    sanitized = sanitized.slice(0, 64);
    return sanitized || 'param';
}
function escapeForQuote(str, quoteChar) {
    return str.replace(/\\/g, '\\\\').replace(new RegExp(quoteChar, 'g'), `\\${quoteChar}`);
}
function getBestQuoteChar(str) {
    const hasSingleQuote = str.includes("'");
    const hasDoubleQuote = str.includes('"');
    if (!hasSingleQuote)
        return "'";
    if (!hasDoubleQuote)
        return '"';
    return '`';
}
function escapeArg(arg) {
    const quoteChar = getBestQuoteChar(arg);
    return `${quoteChar}${escapeForQuote(arg, quoteChar)}${quoteChar}`;
}
function serializeDefaultValue(value) {
    if (typeof value === 'string') {
        return escapeArg(value);
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    return JSON.stringify(value);
}
function createFromAIExpression(key, description, type = 'string', defaultValue) {
    const args = [];
    const marker = n8n_workflow_1.FROM_AI_AUTO_GENERATED_MARKER;
    const sanitizedKey = sanitizeFromAIKey(key);
    args.push(escapeArg(sanitizedKey));
    if (description !== undefined || type !== 'string' || defaultValue !== undefined) {
        const desc = description ?? '';
        args.push(escapeArg(desc));
    }
    if (type !== 'string' || defaultValue !== undefined) {
        args.push(escapeArg(type));
    }
    if (defaultValue !== undefined) {
        args.push(serializeDefaultValue(defaultValue));
    }
    return `={{ ${marker} $fromAI(${args.join(', ')}) }}`;
}
//# sourceMappingURL=index.js.map