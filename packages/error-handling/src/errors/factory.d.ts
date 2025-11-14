import { ConfigurationError, APIError, AuthenticationError, NetworkError, ValidationError, StreamError, RateLimitError, TokenLimitError, TimeoutError } from './index';
/**
 * Factory functions for configuration errors
 */
export declare const createConfigError: {
    missingApiEndpoint: () => ConfigurationError;
    invalidModel: (model: string, validModels: string[]) => ConfigurationError;
    missingApiKey: () => ConfigurationError;
    invalidConfiguration: (field: string, value: any, expected: string) => ConfigurationError;
    missingRequiredProp: (propName: string, componentName: string) => ConfigurationError;
};
/**
 * Factory functions for API errors
 */
export declare const createApiError: {
    requestFailed: (endpoint: string, statusCode: number, statusText?: string) => APIError;
    invalidResponse: (endpoint: string, details?: string) => APIError;
    serverError: (endpoint: string, statusCode: number) => APIError;
    notFound: (endpoint: string) => APIError;
};
/**
 * Factory functions for authentication errors
 */
export declare const createAuthError: {
    missingApiKey: () => AuthenticationError;
    invalidApiKey: () => AuthenticationError;
    insufficientPermissions: (action: string) => AuthenticationError;
};
/**
 * Factory functions for network errors
 */
export declare const createNetworkError: {
    connectionFailed: (endpoint: string) => NetworkError;
    requestTimeout: (endpoint: string, timeout: number) => TimeoutError;
    offline: () => NetworkError;
    dnsLookupFailed: (hostname: string) => NetworkError;
};
/**
 * Factory functions for validation errors
 */
export declare const createValidationError: {
    invalidInput: (field: string, value: any, expected: string) => ValidationError;
    requiredField: (field: string) => ValidationError;
    valueTooLong: (field: string, maxLength: number, actualLength: number) => ValidationError;
    invalidFormat: (field: string, format: string) => ValidationError;
};
/**
 * Factory functions for stream errors
 */
export declare const createStreamError: {
    connectionLost: () => StreamError;
    malformedData: (data: string) => StreamError;
    streamAborted: () => StreamError;
    streamTimeout: (timeout: number) => StreamError;
};
/**
 * Factory functions for rate limit errors
 */
export declare const createRateLimitError: {
    exceeded: (retryAfter: number, limit: number) => RateLimitError;
    quotaExceeded: (limit: number, used: number) => RateLimitError;
};
/**
 * Factory functions for token limit errors
 */
export declare const createTokenLimitError: {
    messageTooLong: (limit: number, actual: number) => TokenLimitError;
    contextTooLong: (limit: number, actual: number) => TokenLimitError;
};
//# sourceMappingURL=factory.d.ts.map