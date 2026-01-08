import { ClarityError } from './base-error';
import { ProviderErrorCode } from './error-codes';
export { ProviderErrorCode };
/**
 * AI provider-specific errors
 */
export class ProviderError extends ClarityError {
    code;
    statusCode;
    provider;
    model;
    retryAfter; // seconds
    constructor(message, options) {
        super(message, {
            cause: options.cause,
            context: {
                ...options.context,
                provider: options.provider,
                model: options.model,
            },
            recoverable: options.code === ProviderErrorCode.RATE_LIMIT,
            solution: options.solution,
            docs: options.docs,
        });
        // Required for proper instanceof checks
        Object.setPrototypeOf(this, ProviderError.prototype);
        this.code = options.code;
        this.provider = options.provider;
        this.statusCode = options.statusCode ?? 500;
        this.model = options.model;
        this.retryAfter = options.retryAfter;
    }
    /**
     * Create a rate limit error
     */
    static rateLimit(provider, retryAfter, model) {
        const message = retryAfter
            ? `Rate limit exceeded. Retry after ${retryAfter} seconds.`
            : 'Rate limit exceeded.';
        return new ProviderError(message, {
            code: ProviderErrorCode.RATE_LIMIT,
            provider,
            statusCode: 429,
            retryAfter,
            model,
            solution: retryAfter
                ? `Please wait ${retryAfter} seconds before trying again.`
                : 'Please wait a moment before trying again.',
        });
    }
    /**
     * Create a context length exceeded error
     */
    static contextLengthExceeded(provider, limit, actual, model) {
        return new ProviderError(`Context length ${actual} exceeds maximum ${limit} tokens`, {
            code: ProviderErrorCode.CONTEXT_LENGTH,
            provider,
            statusCode: 400,
            model,
            context: { limit, actual },
            solution: 'Your conversation is too long. Try starting a new chat or summarizing previous messages.',
        });
    }
    /**
     * Create a content filter error
     */
    static contentFiltered(provider, model) {
        return new ProviderError('Content was flagged by safety filters', {
            code: ProviderErrorCode.CONTENT_FILTER,
            provider,
            statusCode: 400,
            model,
            solution: 'Please revise your message and try again.',
        });
    }
    /**
     * Create an invalid API key error
     */
    static invalidApiKey(provider) {
        return new ProviderError(`Invalid ${provider} API key`, {
            code: ProviderErrorCode.INVALID_API_KEY,
            provider,
            statusCode: 401,
            solution: 'Please check your API key configuration.',
        });
    }
    /**
     * Create a model not found error
     */
    static modelNotFound(provider, model) {
        return new ProviderError(`Model "${model}" not found or not accessible`, {
            code: ProviderErrorCode.MODEL_NOT_FOUND,
            provider,
            statusCode: 404,
            model,
            solution: 'Please verify the model name and your API access.',
        });
    }
    /**
     * Create a quota exceeded error
     */
    static quotaExceeded(provider) {
        return new ProviderError(`${provider} quota exceeded`, {
            code: ProviderErrorCode.QUOTA_EXCEEDED,
            provider,
            statusCode: 429,
            solution: 'You have exceeded your API quota. Please check your billing.',
        });
    }
    /**
     * Create a service unavailable error
     */
    static serviceUnavailable(provider, cause) {
        return new ProviderError(`${provider} service is temporarily unavailable`, {
            code: ProviderErrorCode.SERVICE_UNAVAILABLE,
            provider,
            statusCode: 503,
            cause,
            solution: 'The AI service is experiencing issues. Please try again later.',
        });
    }
    /**
     * Create a provider-specific error from response
     * Auto-detects error type from provider-specific response shapes
     */
    static fromProviderResponse(provider, statusCode, errorBody, model) {
        // Delegate to provider-specific parsers
        switch (provider) {
            case 'openai':
            case 'azure':
                return ProviderError.fromOpenAIResponse(provider, statusCode, errorBody, model);
            case 'anthropic':
                return ProviderError.fromAnthropicResponse(statusCode, errorBody, model);
            case 'google':
                return ProviderError.fromGoogleResponse(statusCode, errorBody, model);
            default:
                return ProviderError.fromGenericResponse(provider, statusCode, errorBody, model);
        }
    }
    /**
     * Parse OpenAI/Azure error response
     * @see https://platform.openai.com/docs/guides/error-codes
     */
    static fromOpenAIResponse(provider, statusCode, errorBody, model) {
        const body = errorBody;
        const error = body?.error;
        const message = error?.message ?? `${provider} API error`;
        const errorType = error?.type;
        const errorCode = error?.code;
        // Extract retry-after from response if available
        const retryAfter = typeof body === 'object' && body !== null
            ? body['retry_after']
            : undefined;
        // Determine error code based on OpenAI error patterns
        let code = ProviderErrorCode.OPENAI_ERROR;
        let solution;
        if (statusCode === 429 || errorType === 'rate_limit_exceeded') {
            code = ProviderErrorCode.RATE_LIMIT;
            solution = retryAfter
                ? `Please wait ${retryAfter} seconds before trying again.`
                : 'Please wait a moment before trying again.';
        }
        else if (statusCode === 401 || errorCode === 'invalid_api_key') {
            code = ProviderErrorCode.INVALID_API_KEY;
            solution = 'Please check your API key configuration.';
        }
        else if (statusCode === 403) {
            code = ProviderErrorCode.QUOTA_EXCEEDED;
            solution = 'You have exceeded your API quota. Please check your billing.';
        }
        else if (errorCode === 'context_length_exceeded' ||
            message.toLowerCase().includes('maximum context length')) {
            code = ProviderErrorCode.CONTEXT_LENGTH;
            solution = 'Your conversation is too long. Try starting a new chat.';
        }
        else if (errorCode === 'content_filter' ||
            errorType === 'content_policy_violation') {
            code = ProviderErrorCode.CONTENT_FILTER;
            solution = 'Please revise your message and try again.';
        }
        else if (statusCode === 404 || errorCode === 'model_not_found') {
            code = ProviderErrorCode.MODEL_NOT_FOUND;
            solution = 'Please verify the model name and your API access.';
        }
        else if (statusCode >= 500) {
            code = ProviderErrorCode.SERVICE_UNAVAILABLE;
            solution =
                'The AI service is experiencing issues. Please try again later.';
        }
        return new ProviderError(message, {
            code,
            provider,
            statusCode,
            model,
            retryAfter,
            solution,
            context: { errorType, errorCode, rawError: errorBody },
        });
    }
    /**
     * Parse Anthropic error response
     * @see https://docs.anthropic.com/en/api/errors
     */
    static fromAnthropicResponse(statusCode, errorBody, model) {
        const body = errorBody;
        const errorType = body?.error?.type ?? body?.type;
        const message = body?.error?.message ?? body?.message ?? 'Anthropic API error';
        let code = ProviderErrorCode.ANTHROPIC_ERROR;
        let solution;
        let retryAfter;
        // Anthropic-specific error types
        if (statusCode === 429 || errorType === 'rate_limit_error') {
            code = ProviderErrorCode.RATE_LIMIT;
            // Extract retry-after header value if present
            const retryMs = body?.['retry_after_ms'];
            if (typeof retryMs === 'number') {
                retryAfter = Math.ceil(retryMs / 1000);
            }
            solution = retryAfter
                ? `Please wait ${retryAfter} seconds before trying again.`
                : 'Please wait a moment before trying again.';
        }
        else if (statusCode === 401 || errorType === 'authentication_error') {
            code = ProviderErrorCode.INVALID_API_KEY;
            solution = 'Please check your API key configuration.';
        }
        else if (errorType === 'invalid_request_error') {
            if (message.toLowerCase().includes('credit') ||
                message.toLowerCase().includes('billing')) {
                code = ProviderErrorCode.QUOTA_EXCEEDED;
                solution = 'Please check your Anthropic billing and credits.';
            }
            else if (message.toLowerCase().includes('too long') ||
                message.toLowerCase().includes('token')) {
                code = ProviderErrorCode.CONTEXT_LENGTH;
                solution = 'Your message is too long. Please shorten it.';
            }
            else {
                solution = 'Please check your request parameters.';
            }
        }
        else if (statusCode === 400 && message.toLowerCase().includes('safety')) {
            code = ProviderErrorCode.CONTENT_FILTER;
            solution = 'Please revise your message and try again.';
        }
        else if (statusCode === 404) {
            code = ProviderErrorCode.MODEL_NOT_FOUND;
            solution = 'Please verify the model name and your API access.';
        }
        else if (statusCode === 529 || errorType === 'overloaded_error') {
            code = ProviderErrorCode.SERVICE_UNAVAILABLE;
            solution =
                'Anthropic is experiencing high demand. Please try again later.';
        }
        else if (statusCode >= 500) {
            code = ProviderErrorCode.SERVICE_UNAVAILABLE;
            solution =
                'Anthropic service is experiencing issues. Please try again later.';
        }
        return new ProviderError(message, {
            code,
            provider: 'anthropic',
            statusCode,
            model,
            retryAfter,
            solution,
            context: { errorType, rawError: errorBody },
        });
    }
    /**
     * Parse Google AI (Gemini) error response
     * @see https://ai.google.dev/api/rest/v1/GenerateContentResponse
     */
    static fromGoogleResponse(statusCode, errorBody, model) {
        const body = errorBody;
        const error = body?.error;
        const message = error?.message ?? 'Google AI API error';
        const errorStatus = error?.status;
        const errorCode = error?.code;
        let code = ProviderErrorCode.GOOGLE_ERROR;
        let solution;
        let retryAfter;
        // Google-specific error handling
        if (statusCode === 429 || errorStatus === 'RESOURCE_EXHAUSTED') {
            code = ProviderErrorCode.RATE_LIMIT;
            // Look for retry delay in error details
            const details = error?.details;
            if (details?.[0]?.retryDelay) {
                const delayStr = details[0].retryDelay;
                const match = delayStr.match(/(\d+)s/);
                if (match?.[1]) {
                    retryAfter = parseInt(match[1], 10);
                }
            }
            solution = retryAfter
                ? `Please wait ${retryAfter} seconds before trying again.`
                : 'Please wait a moment before trying again.';
        }
        else if (statusCode === 401 ||
            statusCode === 403 ||
            errorStatus === 'UNAUTHENTICATED') {
            code = ProviderErrorCode.INVALID_API_KEY;
            solution = 'Please check your Google AI API key configuration.';
        }
        else if (errorStatus === 'INVALID_ARGUMENT') {
            if (message.toLowerCase().includes('token') ||
                message.toLowerCase().includes('length')) {
                code = ProviderErrorCode.CONTEXT_LENGTH;
                solution = 'Your message is too long. Please shorten it.';
            }
            else {
                solution = 'Please check your request parameters.';
            }
        }
        else if (errorCode === 'SAFETY' ||
            message.toLowerCase().includes('safety')) {
            code = ProviderErrorCode.CONTENT_FILTER;
            solution = 'Please revise your message and try again.';
        }
        else if (statusCode === 404 || errorStatus === 'NOT_FOUND') {
            code = ProviderErrorCode.MODEL_NOT_FOUND;
            solution = 'Please verify the model name and your API access.';
        }
        else if (statusCode >= 500 || errorStatus === 'INTERNAL') {
            code = ProviderErrorCode.SERVICE_UNAVAILABLE;
            solution =
                'Google AI service is experiencing issues. Please try again later.';
        }
        return new ProviderError(message, {
            code,
            provider: 'google',
            statusCode,
            model,
            retryAfter,
            solution,
            context: { errorStatus, errorCode, rawError: errorBody },
        });
    }
    /**
     * Parse generic provider error response
     */
    static fromGenericResponse(provider, statusCode, errorBody, model) {
        const body = errorBody;
        const message = body?.error?.message ?? body?.message ?? `${provider} API error`;
        const errorType = body?.error?.type ?? body?.error?.code;
        let code = ProviderErrorCode.OPENAI_ERROR;
        let solution;
        // Generic status code handling
        if (statusCode === 429) {
            code = ProviderErrorCode.RATE_LIMIT;
            solution = 'Please wait a moment before trying again.';
        }
        else if (statusCode === 401 || statusCode === 403) {
            code = ProviderErrorCode.INVALID_API_KEY;
            solution = 'Please check your API key configuration.';
        }
        else if (statusCode === 404) {
            code = ProviderErrorCode.MODEL_NOT_FOUND;
            solution = 'Please verify the model name and your API access.';
        }
        else if (statusCode >= 500) {
            code = ProviderErrorCode.SERVICE_UNAVAILABLE;
            solution =
                'The AI service is experiencing issues. Please try again later.';
        }
        return new ProviderError(message, {
            code,
            provider,
            statusCode,
            model,
            solution,
            context: { errorType, rawError: errorBody },
        });
    }
    get userMessage() {
        switch (this.code) {
            case ProviderErrorCode.RATE_LIMIT:
                return this.retryAfter
                    ? `Rate limit exceeded. Please try again in ${this.retryAfter} seconds.`
                    : 'Rate limit exceeded. Please try again later.';
            case ProviderErrorCode.CONTEXT_LENGTH:
                return 'Your message is too long. Please shorten it and try again.';
            case ProviderErrorCode.CONTENT_FILTER:
                return 'Your message was flagged by content filters. Please revise and try again.';
            case ProviderErrorCode.INVALID_API_KEY:
                return 'Authentication failed. Please check your API configuration.';
            case ProviderErrorCode.MODEL_NOT_FOUND:
                return `The model "${this.model}" is not available.`;
            case ProviderErrorCode.QUOTA_EXCEEDED:
                return 'API quota exceeded. Please check your usage limits.';
            case ProviderErrorCode.SERVICE_UNAVAILABLE:
                return 'The AI service is temporarily unavailable. Please try again later.';
            default:
                return super.userMessage;
        }
    }
}
/**
 * Type guard for ProviderError
 */
export function isProviderError(error) {
    return error instanceof ProviderError;
}
//# sourceMappingURL=provider-error.js.map