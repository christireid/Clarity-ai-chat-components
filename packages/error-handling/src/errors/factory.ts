import {
  ConfigurationError,
  APIError,
  AuthenticationError,
  NetworkError,
  ValidationError,
  StreamError,
  RateLimitError,
  TokenLimitError,
  TimeoutError,
} from './index'

/**
 * Factory functions for configuration errors
 */
export const createConfigError = {
  missingApiEndpoint: () =>
    new ConfigurationError('Missing API endpoint configuration', {
      code: 'MISSING_API_ENDPOINT',
      solution: 'Add apiEndpoint prop to your ChatContainer: <ChatContainer apiEndpoint="/api/chat" />',
      docs: 'https://docs.claritychat.dev/configuration#api-endpoint',
      context: {
        requiredProp: 'apiEndpoint',
        type: 'string',
      },
    }),

  invalidModel: (model: string, validModels: string[]) =>
    new ConfigurationError(`Invalid model: ${model}`, {
      code: 'INVALID_MODEL',
      solution: `Use one of the supported models: ${validModels.join(', ')}`,
      docs: 'https://docs.claritychat.dev/configuration#models',
      context: {
        providedModel: model,
        validModels,
      },
    }),

  missingApiKey: () =>
    new ConfigurationError('Missing API key', {
      code: 'MISSING_API_KEY',
      solution: 'Add apiKey prop to your ChatContainer or set CLARITY_API_KEY environment variable',
      docs: 'https://docs.claritychat.dev/authentication',
      context: {
        requiredProp: 'apiKey',
        environmentVariable: 'CLARITY_API_KEY',
      },
    }),

  invalidConfiguration: (field: string, value: any, expected: string) =>
    new ConfigurationError(`Invalid configuration for ${field}`, {
      code: 'INVALID_CONFIGURATION',
      solution: `Expected ${expected}, received ${typeof value}`,
      context: {
        field,
        providedValue: value,
        expectedType: expected,
      },
    }),

  missingRequiredProp: (propName: string, componentName: string) =>
    new ConfigurationError(`Missing required prop: ${propName}`, {
      code: 'MISSING_REQUIRED_PROP',
      solution: `Add the ${propName} prop to your ${componentName} component`,
      context: {
        propName,
        componentName,
      },
    }),
}

/**
 * Factory functions for API errors
 */
export const createApiError = {
  requestFailed: (endpoint: string, statusCode: number, statusText?: string) =>
    new APIError(`API request failed: ${endpoint}`, {
      code: 'API_REQUEST_FAILED',
      statusCode,
      solution: 'Check your API endpoint and server logs for more details',
      context: {
        endpoint,
        statusCode,
        statusText,
        method: 'POST',
      },
    }),

  invalidResponse: (endpoint: string, details?: string) =>
    new APIError(`Invalid API response from: ${endpoint}`, {
      code: 'INVALID_API_RESPONSE',
      solution: 'Ensure your API returns valid JSON with the expected structure',
      docs: 'https://docs.claritychat.dev/api-reference#response-format',
      context: {
        endpoint,
        details,
      },
    }),

  serverError: (endpoint: string, statusCode: number) =>
    new APIError(`Server error: ${endpoint}`, {
      code: 'SERVER_ERROR',
      statusCode,
      solution: 'The server encountered an error. Please try again later or contact support',
      context: {
        endpoint,
        statusCode,
      },
    }),

  notFound: (endpoint: string) =>
    new APIError(`API endpoint not found: ${endpoint}`, {
      code: 'API_NOT_FOUND',
      statusCode: 404,
      solution: 'Verify your API endpoint URL is correct',
      context: {
        endpoint,
      },
    }),
}

/**
 * Factory functions for authentication errors
 */
export const createAuthError = {
  missingApiKey: () =>
    new AuthenticationError('API key is missing', {
      code: 'MISSING_API_KEY',
      solution: 'Provide an API key via the apiKey prop or CLARITY_API_KEY environment variable',
      docs: 'https://docs.claritychat.dev/authentication',
    }),

  invalidApiKey: () =>
    new AuthenticationError('API key is invalid', {
      code: 'INVALID_API_KEY',
      solution: 'Check that your API key is correct and has not expired',
      docs: 'https://docs.claritychat.dev/authentication#api-keys',
    }),

  insufficientPermissions: (action: string) =>
    new AuthenticationError(`Insufficient permissions for action: ${action}`, {
      code: 'INSUFFICIENT_PERMISSIONS',
      solution: 'Ensure your API key has the required permissions',
      context: {
        action,
      },
    }),
}

/**
 * Factory functions for network errors
 */
export const createNetworkError = {
  connectionFailed: (endpoint: string) =>
    new NetworkError(`Failed to connect to: ${endpoint}`, {
      code: 'CONNECTION_FAILED',
      solution: 'Check your internet connection and verify the endpoint is accessible',
      context: {
        endpoint,
      },
    }),

  requestTimeout: (endpoint: string, timeout: number) =>
    new TimeoutError(`Request timed out: ${endpoint}`, {
      code: 'REQUEST_TIMEOUT',
      timeout,
      solution: `Request exceeded ${timeout}ms timeout. Try increasing the timeout or check your network connection`,
      context: {
        endpoint,
        timeout,
      },
    }),

  offline: () =>
    new NetworkError('No internet connection', {
      code: 'OFFLINE',
      solution: 'Check your internet connection and try again',
    }),

  dnsLookupFailed: (hostname: string) =>
    new NetworkError(`DNS lookup failed for: ${hostname}`, {
      code: 'DNS_LOOKUP_FAILED',
      solution: 'Verify the hostname is correct and your DNS is working',
      context: {
        hostname,
      },
    }),
}

/**
 * Factory functions for validation errors
 */
export const createValidationError = {
  invalidInput: (field: string, value: any, expected: string) =>
    new ValidationError(`Invalid input for ${field}`, {
      code: 'INVALID_INPUT',
      field,
      value,
      expected,
      solution: `Expected ${expected}, received ${typeof value}`,
      context: {
        field,
        providedValue: value,
        expectedType: expected,
      },
    }),

  requiredField: (field: string) =>
    new ValidationError(`Required field missing: ${field}`, {
      code: 'REQUIRED_FIELD_MISSING',
      field,
      solution: `Provide a value for the required field: ${field}`,
      context: {
        field,
      },
    }),

  valueTooLong: (field: string, maxLength: number, actualLength: number) =>
    new ValidationError(`Value too long for ${field}`, {
      code: 'VALUE_TOO_LONG',
      field,
      solution: `Maximum length is ${maxLength}, received ${actualLength}`,
      context: {
        field,
        maxLength,
        actualLength,
      },
    }),

  invalidFormat: (field: string, format: string) =>
    new ValidationError(`Invalid format for ${field}`, {
      code: 'INVALID_FORMAT',
      field,
      expected: format,
      solution: `Expected format: ${format}`,
      context: {
        field,
        expectedFormat: format,
      },
    }),
}

/**
 * Factory functions for stream errors
 */
export const createStreamError = {
  connectionLost: () =>
    new StreamError('Stream connection lost', {
      code: 'STREAM_CONNECTION_LOST',
      solution: 'The stream connection was interrupted. It will automatically retry',
    }),

  malformedData: (data: string) =>
    new StreamError('Received malformed stream data', {
      code: 'STREAM_MALFORMED_DATA',
      solution: 'The server sent invalid stream data. Check server logs',
      context: {
        receivedData: data.substring(0, 100),
      },
    }),

  streamAborted: () =>
    new StreamError('Stream was aborted', {
      code: 'STREAM_ABORTED',
      solution: 'The stream was manually aborted by the user or application',
    }),

  streamTimeout: (timeout: number) =>
    new StreamError('Stream timed out', {
      code: 'STREAM_TIMEOUT',
      solution: `No data received within ${timeout}ms. The connection will retry`,
      context: {
        timeout,
      },
    }),
}

/**
 * Factory functions for rate limit errors
 */
export const createRateLimitError = {
  exceeded: (retryAfter: number, limit: number) =>
    new RateLimitError('Rate limit exceeded', {
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter,
      limit,
      solution: `Wait ${retryAfter} seconds before making another request`,
      context: {
        retryAfter,
        limit,
        resetAt: Date.now() + retryAfter * 1000,
      },
    }),

  quotaExceeded: (limit: number, used: number) =>
    new RateLimitError('API quota exceeded', {
      code: 'QUOTA_EXCEEDED',
      limit,
      solution: 'Your API quota has been exceeded. Upgrade your plan or wait for quota reset',
      context: {
        limit,
        used,
        remaining: 0,
      },
    }),
}

/**
 * Factory functions for token limit errors
 */
export const createTokenLimitError = {
  messageTooLong: (limit: number, actual: number) =>
    new TokenLimitError('Message exceeds token limit', {
      code: 'MESSAGE_TOO_LONG',
      limit,
      actual,
      solution: `Reduce message length. Maximum ${limit} tokens, you provided ${actual}`,
      context: {
        limit,
        actual,
        excess: actual - limit,
      },
    }),

  contextTooLong: (limit: number, actual: number) =>
    new TokenLimitError('Conversation context exceeds token limit', {
      code: 'CONTEXT_TOO_LONG',
      limit,
      actual,
      solution: 'Clear some conversation history or use a model with a larger context window',
      context: {
        limit,
        actual,
        excess: actual - limit,
      },
    }),
}
