/**
 * API-related errors with helpful solutions
 */

import { ClarityError, ErrorSolution } from './base-error'

export class APIKeyMissingError extends ClarityError {
  constructor(provider: 'openai' | 'anthropic' | 'google', originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: `Add your ${provider.toUpperCase()} API key to environment variables`,
        steps: [
          'Create or edit .env.local in your project root',
          `Add: ${getEnvKeyName(provider)}=your-api-key-here`,
          'Restart your development server',
          'Verify the key is loaded: echo $' + getEnvKeyName(provider)
        ],
        example: `# .env.local\n${getEnvKeyName(provider)}=${getExampleKey(provider)}`,
        docsUrl: getProviderDocsUrl(provider)
      },
      {
        description: 'Get an API key if you don\'t have one',
        steps: [
          `Visit ${getProviderSignupUrl(provider)}`,
          'Create an account or sign in',
          'Navigate to API keys section',
          'Generate a new API key',
          'Copy the key (you can only see it once!)'
        ],
        docsUrl: getProviderSignupUrl(provider)
      }
    ]

    super(
      'API_KEY_MISSING',
      `${provider.toUpperCase()} API key is not configured`,
      `The environment variable ${getEnvKeyName(provider)} is missing or empty`,
      solutions,
      {
        location: 'API initialization',
        action: `Attempting to initialize ${provider} client`,
        data: { provider, envKey: getEnvKeyName(provider) }
      },
      originalError
    )
  }
}

export class APIRateLimitError extends ClarityError {
  constructor(provider: string, retryAfter?: number, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: 'Wait and retry automatically',
        steps: [
          'The request will be retried automatically',
          `Wait ${retryAfter ? retryAfter + ' seconds' : 'a moment'}`,
          'If this persists, check your rate limits'
        ]
      },
      {
        description: 'Check your rate limits and upgrade if needed',
        steps: [
          `Visit ${getProviderDashboardUrl(provider)}`,
          'Check your current usage and limits',
          'Consider upgrading to a higher tier',
          'Implement request queuing/throttling'
        ],
        docsUrl: getProviderDocsUrl(provider) + '/rate-limits'
      },
      {
        description: 'Implement exponential backoff',
        example: `async function callWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        await sleep(1000 * Math.pow(2, i))
        continue
      }
      throw error
    }
  }
}`
      }
    ]

    super(
      'API_RATE_LIMIT',
      `${provider} rate limit exceeded`,
      `You've exceeded your API rate limit. ${retryAfter ? `Retry after ${retryAfter} seconds.` : ''}`,
      solutions,
      {
        location: 'API request',
        action: `Making request to ${provider}`,
        data: { provider, retryAfter }
      },
      originalError
    )
  }
}

export class APIAuthenticationError extends ClarityError {
  constructor(provider: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: 'Verify your API key is correct',
        steps: [
          'Check .env.local for typos',
          'Ensure no extra spaces or quotes',
          'Verify the key format is correct',
          'Restart your development server'
        ],
        example: `# Correct format:\n${getEnvKeyName(provider)}=${getExampleKey(provider)}\n\n# Wrong (has quotes):\n${getEnvKeyName(provider)}="${getExampleKey(provider)}"`
      },
      {
        description: 'Generate a new API key',
        steps: [
          `Visit ${getProviderDashboardUrl(provider)}`,
          'Revoke the old key',
          'Generate a new API key',
          'Update your .env.local',
          'Restart your server'
        ],
        docsUrl: getProviderDocsUrl(provider)
      },
      {
        description: 'Check if your key has expired or been revoked',
        steps: [
          'Log into your provider dashboard',
          'Check the API keys section',
          'Look for expiration dates or revoked status',
          'Generate a new key if needed'
        ]
      }
    ]

    super(
      'API_AUTHENTICATION_FAILED',
      `Authentication failed for ${provider}`,
      'Your API key is invalid, expired, or revoked',
      solutions,
      {
        location: 'API authentication',
        action: `Authenticating with ${provider}`,
        data: { provider }
      },
      originalError
    )
  }
}

export class APINetworkError extends ClarityError {
  constructor(provider: string, originalError?: Error) {
    const solutions: ErrorSolution[] = [
      {
        description: 'Check your internet connection',
        steps: [
          'Verify you\'re connected to the internet',
          'Try accessing other websites',
          'Check if you\'re behind a firewall or proxy',
          'Retry the request'
        ]
      },
      {
        description: 'Check if the API service is down',
        steps: [
          `Visit ${getProviderStatusUrl(provider)}`,
          'Check for ongoing incidents',
          'Wait for the service to recover',
          'Subscribe to status updates'
        ],
        docsUrl: getProviderStatusUrl(provider)
      },
      {
        description: 'Configure proxy settings if needed',
        example: `// If behind a corporate proxy
const agent = new HttpsProxyAgent(process.env.HTTP_PROXY)
const client = new OpenAI({
  httpAgent: agent
})`
      }
    ]

    super(
      'API_NETWORK_ERROR',
      `Network error connecting to ${provider}`,
      'Failed to establish connection to the API server',
      solutions,
      {
        location: 'Network layer',
        action: `Connecting to ${provider} API`,
        data: { provider }
      },
      originalError
    )
  }
}

export class APIResponseError extends ClarityError {
  constructor(
    provider: string,
    statusCode: number,
    responseBody: any,
    originalError?: Error
  ) {
    const solutions: ErrorSolution[] = [
      {
        description: 'Check the error details from the API',
        steps: [
          'Review the status code and response body',
          'Look for specific error messages',
          'Check API documentation for this error',
          'Adjust your request accordingly'
        ],
        docsUrl: getProviderDocsUrl(provider) + '/errors'
      }
    ]

    super(
      'API_RESPONSE_ERROR',
      `${provider} API returned an error (${statusCode})`,
      `The API request failed with status ${statusCode}`,
      solutions,
      {
        location: 'API response',
        action: `Processing ${provider} API response`,
        data: { provider, statusCode, responseBody }
      },
      originalError
    )
  }
}

// Helper functions
function getEnvKeyName(provider: string): string {
  const map: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_AI_API_KEY'
  }
  return map[provider] || `${provider.toUpperCase()}_API_KEY`
}

function getExampleKey(provider: string): string {
  const map: Record<string, string> = {
    openai: 'sk-...',
    anthropic: 'sk-ant-...',
    google: 'AI...'
  }
  return map[provider] || 'your-api-key-here'
}

function getProviderDocsUrl(provider: string): string {
  const map: Record<string, string> = {
    openai: 'https://platform.openai.com/docs',
    anthropic: 'https://docs.anthropic.com',
    google: 'https://ai.google.dev/docs'
  }
  return map[provider] || 'https://docs.example.com'
}

function getProviderSignupUrl(provider: string): string {
  const map: Record<string, string> = {
    openai: 'https://platform.openai.com/signup',
    anthropic: 'https://console.anthropic.com',
    google: 'https://makersuite.google.com/app/apikey'
  }
  return map[provider] || 'https://example.com'
}

function getProviderDashboardUrl(provider: string): string {
  const map: Record<string, string> = {
    openai: 'https://platform.openai.com/account',
    anthropic: 'https://console.anthropic.com',
    google: 'https://makersuite.google.com'
  }
  return map[provider] || 'https://dashboard.example.com'
}

function getProviderStatusUrl(provider: string): string {
  const map: Record<string, string> = {
    openai: 'https://status.openai.com',
    anthropic: 'https://status.anthropic.com',
    google: 'https://status.cloud.google.com'
  }
  return map[provider] || 'https://status.example.com'
}
