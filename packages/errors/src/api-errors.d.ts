/**
 * API-related errors with helpful solutions
 */
import { ClarityError } from './base-error';
export declare class APIKeyMissingError extends ClarityError {
    constructor(provider: 'openai' | 'anthropic' | 'google', originalError?: Error);
}
export declare class APIRateLimitError extends ClarityError {
    constructor(provider: string, retryAfter?: number, originalError?: Error);
}
export declare class APIAuthenticationError extends ClarityError {
    constructor(provider: string, originalError?: Error);
}
export declare class APINetworkError extends ClarityError {
    constructor(provider: string, originalError?: Error);
}
export declare class APIResponseError extends ClarityError {
    constructor(provider: string, statusCode: number, responseBody: any, originalError?: Error);
}
//# sourceMappingURL=api-errors.d.ts.map