/**
 * Shared Error Handling Utilities
 *
 * Provides consistent error handling patterns across all Clarity Chat examples.
 * Can be used standalone or with React components.
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
export interface ChatError {
    code: string;
    message: string;
    severity: ErrorSeverity;
    timestamp: number;
    details?: Record<string, unknown>;
    recoverable: boolean;
    retryable: boolean;
}
export declare const ERROR_CODES: {
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly TIMEOUT: "TIMEOUT";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly API_ERROR: "API_ERROR";
    readonly INVALID_API_KEY: "INVALID_API_KEY";
    readonly QUOTA_EXCEEDED: "QUOTA_EXCEEDED";
    readonly MODEL_UNAVAILABLE: "MODEL_UNAVAILABLE";
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly INPUT_TOO_LONG: "INPUT_TOO_LONG";
    readonly EMPTY_MESSAGE: "EMPTY_MESSAGE";
    readonly STREAM_ERROR: "STREAM_ERROR";
    readonly STREAM_ABORTED: "STREAM_ABORTED";
    readonly UNKNOWN_ERROR: "UNKNOWN_ERROR";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export declare function classifyError(error: unknown): ChatError;
export interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffFactor: number;
}
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
export declare function calculateRetryDelay(attempt: number, config?: RetryConfig): number;
export declare function withRetry<T>(fn: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
export declare function formatErrorForUser(error: ChatError): string;
export declare function formatErrorForLog(error: ChatError): string;
export interface ErrorReport {
    error: ChatError;
    context?: {
        url?: string;
        userAgent?: string;
        sessionId?: string;
    };
    stack?: string;
}
export declare function createErrorReport(error: unknown, context?: ErrorReport['context']): ErrorReport;
export declare function shouldShowRetryButton(error: ChatError): boolean;
export declare function getErrorIcon(severity: ErrorSeverity): string;
export declare function getErrorColor(severity: ErrorSeverity): string;
//# sourceMappingURL=index.d.ts.map