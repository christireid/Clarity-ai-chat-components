/**
 * Utility functions for error handling
 */
import { ClarityError } from './base-error';
/**
 * Format error for display
 */
export declare function formatError(error: Error | ClarityError): string;
/**
 * Log error to console with formatting
 */
export declare function logError(error: Error | ClarityError): void;
/**
 * Handle error with appropriate response
 */
export declare function handleError(error: Error | ClarityError): {
    statusCode: number;
    body: any;
};
/**
 * Create error handler middleware for Next.js API routes
 */
export declare function createErrorHandler(): (handler: (req: any, res: any) => Promise<any>) => (req: any, res: any) => Promise<any>;
/**
 * Wrap async functions with error handling
 */
export declare function withErrorHandling<T extends (...args: any[]) => Promise<any>>(fn: T, errorHandler?: (error: Error) => void): T;
/**
 * Assert condition and throw descriptive error if false
 */
export declare function assert(condition: boolean, error: Error | ClarityError | string): asserts condition;
/**
 * Try-catch wrapper that returns [error, result] tuple
 */
export declare function tryCatch<T>(fn: () => Promise<T>): Promise<[null, T] | [Error, null]>;
//# sourceMappingURL=utils.d.ts.map