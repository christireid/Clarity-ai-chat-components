import { ClarityError } from './base-error';
import { ApiErrorCode } from './error-codes';
export { ApiErrorCode };
/**
 * API request/response errors
 */
export class ApiError extends ClarityError {
    code;
    statusCode;
    endpoint;
    method;
    constructor(message, options) {
        super(message, {
            cause: options.cause,
            context: {
                ...options.context,
                endpoint: options.endpoint,
                method: options.method,
            },
            // 4xx errors are generally recoverable, 5xx are not
            recoverable: options.statusCode < 500,
            solution: options.solution,
            docs: options.docs,
        });
        // Required for proper instanceof checks
        Object.setPrototypeOf(this, ApiError.prototype);
        this.code = options.code;
        this.statusCode = options.statusCode;
        this.endpoint = options.endpoint;
        this.method = options.method;
    }
    /**
     * Create from fetch Response
     */
    static async fromResponse(response, endpoint) {
        let message = `Request failed with status ${response.status}`;
        try {
            const body = await response.json();
            if (body.message || body.error) {
                message = body.message || body.error;
            }
        }
        catch {
            // Body not JSON or empty
        }
        const codeMap = {
            400: ApiErrorCode.BAD_REQUEST,
            401: ApiErrorCode.UNAUTHORIZED,
            403: ApiErrorCode.FORBIDDEN,
            404: ApiErrorCode.NOT_FOUND,
            429: ApiErrorCode.RATE_LIMITED,
        };
        const solutionMap = {
            400: 'Check your request parameters and try again.',
            401: 'Please check your authentication credentials.',
            403: 'You do not have permission to access this resource.',
            404: 'The requested resource was not found.',
            429: 'You have made too many requests. Please wait and try again.',
        };
        return new ApiError(message, {
            code: codeMap[response.status] ?? ApiErrorCode.SERVER_ERROR,
            statusCode: response.status,
            endpoint,
            solution: solutionMap[response.status],
        });
    }
    /**
     * Create a network error (no response received)
     */
    static networkError(cause, endpoint) {
        return new ApiError('Network request failed', {
            code: ApiErrorCode.NETWORK_ERROR,
            statusCode: 0,
            endpoint,
            cause,
            solution: 'Check your internet connection and try again.',
        });
    }
    /**
     * Create a timeout error
     */
    static timeout(timeout, endpoint) {
        return new ApiError(`Request timed out after ${timeout}ms`, {
            code: ApiErrorCode.TIMEOUT,
            statusCode: 408,
            endpoint,
            context: { timeout },
            solution: 'The server took too long to respond. Please try again.',
        });
    }
    get userMessage() {
        switch (this.code) {
            case ApiErrorCode.UNAUTHORIZED:
                return 'You need to sign in to continue.';
            case ApiErrorCode.FORBIDDEN:
                return 'You do not have permission to perform this action.';
            case ApiErrorCode.NOT_FOUND:
                return 'The requested resource could not be found.';
            case ApiErrorCode.RATE_LIMITED:
                return 'Too many requests. Please wait a moment and try again.';
            case ApiErrorCode.NETWORK_ERROR:
                return 'Network error. Please check your connection.';
            case ApiErrorCode.TIMEOUT:
                return 'Request timed out. Please try again.';
            default:
                return super.userMessage;
        }
    }
}
/**
 * Type guard for ApiError
 */
export function isApiError(error) {
    return error instanceof ApiError;
}
//# sourceMappingURL=api-error.js.map