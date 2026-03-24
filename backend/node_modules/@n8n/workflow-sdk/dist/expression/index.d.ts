import type { FromAIArgumentType } from '../types/base';
export declare function parseExpression(expr: string): string;
export declare function isExpression(value: unknown): boolean;
export declare function expr(expression: string): string;
export declare function createFromAIExpression(key: string, description?: string, type?: FromAIArgumentType, defaultValue?: string | number | boolean | object): string;
