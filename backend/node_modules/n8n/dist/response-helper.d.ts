import type { ReportingOptions } from '@n8n/errors';
import type { Request, Response } from 'express';
export declare function sendSuccessResponse(res: Response, data: unknown, raw?: boolean, responseCode?: number, responseHeader?: object): void;
export declare function sendErrorResponse(res: Response, error: Error): void;
export declare const isUniqueConstraintError: (error: Error) => boolean;
export declare function reportError(error: Error, options?: ReportingOptions): void;
export declare function send<T, R extends Request, S extends Response>(processFunction: (req: R, res: S) => Promise<T>, raw?: boolean): (req: R, res: S) => Promise<void>;
