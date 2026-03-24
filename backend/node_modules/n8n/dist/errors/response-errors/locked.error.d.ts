import { ResponseError } from './abstract/response.error';
export declare class LockedError extends ResponseError {
    constructor(message: string, hint?: string | undefined);
}
