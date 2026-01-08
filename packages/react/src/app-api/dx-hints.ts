'use client'

/**
 * Clarity Chat - Developer Experience (DX) Hints Module
 *
 * This module provides actionable error messages, development-mode console hints,
 * and runtime feedback to help developers quickly understand and fix issues.
 *
 * Design principles:
 * 1. Every error message includes a suggested fix
 * 2. Development mode logs helpful context without being noisy
 * 3. Common mistakes are caught early with clear guidance
 */

// =============================================================================
// Types
// =============================================================================

export interface ClarityError extends Error {
  code: ClarityErrorCode
  suggestion: string
  docsUrl?: string
}

export type ClarityErrorCode =
  // Configuration errors
  | 'CONFIG_INVALID_API'
  | 'CONFIG_INVALID_PRESET'
  | 'CONFIG_INVALID_BUDGET'
  | 'CONFIG_MEMORY_LIMIT'
  | 'CONFIG_RAG_SOURCES'
  | 'CONFIG_TOOL_INVALID'
  // Runtime errors
  | 'NETWORK_ERROR'
  | 'NETWORK_TIMEOUT'
  | 'API_ERROR_400'
  | 'API_ERROR_401'
  | 'API_ERROR_403'
  | 'API_ERROR_404'
  | 'API_ERROR_429'
  | 'API_ERROR_500'
  | 'API_ERROR_UNKNOWN'
  | 'STREAMING_ERROR'
  | 'PARSE_ERROR'
  // Safety errors
  | 'SAFETY_BLOCKED'
  | 'SAFETY_PII_DETECTED'
  // Feature errors
  | 'RAG_NO_SOURCES'
  | 'TOOLS_EXECUTION_FAILED'
  | 'MEMORY_STORAGE_FAILED'

// =============================================================================
// Error Factory
// =============================================================================

const ERROR_MESSAGES: Record<
  ClarityErrorCode,
  { message: string; suggestion: string; docsUrl?: string }
> = {
  // Configuration errors
  CONFIG_INVALID_API: {
    message: 'Invalid API endpoint provided',
    suggestion:
      'Ensure `api` prop is a valid URL path (e.g., "/api/chat") or full URL. Check that your API route exists and is properly configured.',
    docsUrl: 'https://clarity-chat.dev/docs/api-setup',
  },
  CONFIG_INVALID_PRESET: {
    message: 'Unknown preset specified',
    suggestion:
      'Valid presets are: "simple", "pro", "memory", "rag", "tools", "enterprise". Check spelling or use feature flags instead.',
    docsUrl: 'https://clarity-chat.dev/docs/presets',
  },
  CONFIG_INVALID_BUDGET: {
    message: 'Token budget must be a positive number',
    suggestion:
      'Set `config.tokenOptimization.budget` to a positive integer. Common values: 4096 (GPT-3.5), 8192 (GPT-4), 128000 (GPT-4 Turbo).',
  },
  CONFIG_MEMORY_LIMIT: {
    message: 'Memory limit must be a positive number',
    suggestion:
      'Set `config.memory.limit` to a positive integer representing max messages to retain.',
  },
  CONFIG_RAG_SOURCES: {
    message: 'RAG is enabled but no sources provided',
    suggestion:
      'Either disable RAG with `features={{ rag: false }}` or provide sources via `sources` prop or `config.rag.sources`.',
    docsUrl: 'https://clarity-chat.dev/docs/rag',
  },
  CONFIG_TOOL_INVALID: {
    message: 'Invalid tool definition in registry',
    suggestion:
      'Each tool must have a `name` (string), `description` (string), and `execute` (async function). Check tool at index shown in error.',
  },

  // Network/API errors
  NETWORK_ERROR: {
    message: 'Network request failed',
    suggestion:
      'Check your internet connection and verify the API endpoint is reachable. If using a local server, ensure it is running.',
  },
  NETWORK_TIMEOUT: {
    message: 'Request timed out',
    suggestion:
      'The API took too long to respond. Try increasing timeout or check if your backend is overloaded.',
  },
  API_ERROR_400: {
    message: 'Bad Request (400)',
    suggestion:
      'The API rejected the request format. Check that messages are properly formatted with `role` and `content` properties.',
  },
  API_ERROR_401: {
    message: 'Unauthorized (401)',
    suggestion:
      'API authentication failed. Verify your API key is set correctly in environment variables and passed to your backend.',
  },
  API_ERROR_403: {
    message: 'Forbidden (403)',
    suggestion:
      'Access denied. Check that your API key has the required permissions and is not rate-limited.',
  },
  API_ERROR_404: {
    message: 'API endpoint not found (404)',
    suggestion:
      'The API route does not exist. Verify the `api` prop matches your actual API route path.',
  },
  API_ERROR_429: {
    message: 'Rate limited (429)',
    suggestion:
      'Too many requests. Implement request throttling or upgrade your API plan. Error recovery will automatically retry.',
  },
  API_ERROR_500: {
    message: 'Server error (500)',
    suggestion:
      'The API server encountered an error. Check your backend logs. Error recovery will automatically retry if enabled.',
  },
  API_ERROR_UNKNOWN: {
    message: 'Unexpected API error',
    suggestion:
      'An unexpected error occurred. Check browser console and network tab for more details.',
  },
  STREAMING_ERROR: {
    message: 'Streaming response failed',
    suggestion:
      'The streaming connection was interrupted. Try disabling streaming with `features={{ streaming: false }}` to test.',
  },
  PARSE_ERROR: {
    message: 'Failed to parse API response',
    suggestion:
      'The API response was not valid JSON. Ensure your backend returns `{ content: "..." }` or `{ message: "..." }`.',
  },

  // Safety errors
  SAFETY_BLOCKED: {
    message: 'Message blocked by safety filter',
    suggestion:
      'The message triggered safety filters. This is working as intended to protect against harmful content.',
  },
  SAFETY_PII_DETECTED: {
    message: 'PII detected in message',
    suggestion:
      'Personal information was detected and redacted. Configure PII handling in `config.safety.piiRedaction`.',
  },

  // Feature errors
  RAG_NO_SOURCES: {
    message: 'RAG query failed: no sources available',
    suggestion:
      'Provide RAG sources via the `sources` prop or `config.rag.sources`. Supported types: text, url, file.',
    docsUrl: 'https://clarity-chat.dev/docs/rag',
  },
  TOOLS_EXECUTION_FAILED: {
    message: 'Tool execution failed',
    suggestion:
      'Check the tool implementation. Ensure `execute` function handles errors and returns a result.',
  },
  MEMORY_STORAGE_FAILED: {
    message: 'Failed to persist conversation to storage',
    suggestion:
      'Storage operation failed. If using IndexedDB, ensure browser supports it. Try `storage: "memory"` as fallback.',
  },
}

/**
 * Create a Clarity error with actionable guidance
 */
export function createClarityError(
  code: ClarityErrorCode,
  details?: string
): ClarityError {
  const errorDef = ERROR_MESSAGES[code]
  const message = details ? `${errorDef.message}: ${details}` : errorDef.message

  const error = new Error(message) as ClarityError
  error.name = 'ClarityError'
  error.code = code
  error.suggestion = errorDef.suggestion
  error.docsUrl = errorDef.docsUrl

  return error
}

/**
 * Map HTTP status codes to error codes
 */
export function httpStatusToErrorCode(status: number): ClarityErrorCode {
  switch (status) {
    case 400:
      return 'API_ERROR_400'
    case 401:
      return 'API_ERROR_401'
    case 403:
      return 'API_ERROR_403'
    case 404:
      return 'API_ERROR_404'
    case 429:
      return 'API_ERROR_429'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'API_ERROR_500'
    default:
      return 'API_ERROR_UNKNOWN'
  }
}

// =============================================================================
// Development Mode Hints
// =============================================================================

const DEV_MODE =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'

const HINT_PREFIX = '[Clarity Chat]'

type HintLevel = 'info' | 'warn' | 'error' | 'success'

const LEVEL_STYLES: Record<HintLevel, string> = {
  info: 'color: #0066cc; font-weight: bold;',
  warn: 'color: #cc6600; font-weight: bold;',
  error: 'color: #cc0000; font-weight: bold;',
  success: 'color: #00cc66; font-weight: bold;',
}

/**
 * Log a development hint to the console
 * Only logs in development mode
 */
export function devHint(
  level: HintLevel,
  message: string,
  details?: Record<string, unknown>
): void {
  if (!DEV_MODE) return

  const style = LEVEL_STYLES[level]
  const consoleMethod =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log

  if (details) {
    consoleMethod(`%c${HINT_PREFIX} ${message}`, style, details)
  } else {
    consoleMethod(`%c${HINT_PREFIX} ${message}`, style)
  }
}

/**
 * Log initialization info showing active features
 */
export function logInitialization(config: {
  preset?: string
  features: Record<string, boolean>
  api: string
}): void {
  if (!DEV_MODE) return

  const enabledFeatures = Object.entries(config.features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature)

  console.groupCollapsed(
    `%c${HINT_PREFIX} ClarityChatApp initialized`,
    LEVEL_STYLES.success
  )
  console.log('API endpoint:', config.api)
  if (config.preset) {
    console.log('Preset:', config.preset)
  }
  console.log('Enabled features:', enabledFeatures.join(', ') || 'none')
  console.log('Tip: Use onEvent prop to observe all chat events')
  console.groupEnd()
}

/**
 * Log a performance warning
 */
export function logPerformanceWarning(
  issue: string,
  recommendation: string
): void {
  devHint('warn', `Performance: ${issue}`, { recommendation })
}

/**
 * Log feature usage hint
 */
export function logFeatureHint(feature: string, hint: string): void {
  devHint('info', `${feature}: ${hint}`)
}

// =============================================================================
// Common Mistake Detection
// =============================================================================

export interface ValidationWarning {
  code: string
  message: string
  suggestion: string
}

/**
 * Check for common configuration mistakes and return warnings
 */
export function detectCommonMistakes(config: {
  api?: string
  preset?: string
  features?: Record<string, boolean>
  ragSources?: unknown[]
  toolsRegistry?: unknown[]
  memoryEnabled?: boolean
  tokenBudget?: number
}): ValidationWarning[] {
  const warnings: ValidationWarning[] = []

  // Check API endpoint
  if (!config.api) {
    warnings.push({
      code: 'MISSING_API',
      message: 'No API endpoint specified',
      suggestion: 'Add the `api` prop: <ClarityChatApp api="/api/chat" />',
    })
  } else if (!config.api.startsWith('/') && !config.api.startsWith('http')) {
    warnings.push({
      code: 'INVALID_API_FORMAT',
      message: 'API endpoint should be a path or full URL',
      suggestion:
        'Use a path like "/api/chat" or full URL like "https://api.example.com/chat"',
    })
  }

  // Check RAG configuration
  if (
    config.features?.rag &&
    (!config.ragSources || config.ragSources.length === 0)
  ) {
    warnings.push({
      code: 'RAG_NO_SOURCES',
      message: 'RAG is enabled but no sources provided',
      suggestion:
        'Add sources via `sources` prop or disable RAG: features={{ rag: false }}',
    })
  }

  // Check tools configuration
  if (
    config.features?.tools &&
    (!config.toolsRegistry || config.toolsRegistry.length === 0)
  ) {
    warnings.push({
      code: 'TOOLS_NO_REGISTRY',
      message: 'Tools feature is enabled but no tools registered',
      suggestion:
        'Add tools via `config.tools.registry` or disable tools: features={{ tools: false }}',
    })
  }

  // Check memory with streaming
  if (config.memoryEnabled && config.features?.streaming === false) {
    warnings.push({
      code: 'MEMORY_NO_STREAMING',
      message: 'Memory works best with streaming enabled',
      suggestion:
        'Consider enabling streaming for real-time memory context updates',
    })
  }

  // Check token budget
  if (config.tokenBudget && config.tokenBudget < 1000) {
    warnings.push({
      code: 'LOW_TOKEN_BUDGET',
      message: 'Token budget is very low (< 1000)',
      suggestion:
        'Increase token budget for better conversation quality. Typical minimum: 4096',
    })
  }

  return warnings
}

/**
 * Log validation warnings in development mode
 */
export function logValidationWarnings(warnings: ValidationWarning[]): void {
  if (!DEV_MODE || warnings.length === 0) return

  console.groupCollapsed(
    `%c${HINT_PREFIX} ${warnings.length} configuration warning(s) detected`,
    LEVEL_STYLES.warn
  )

  for (const warning of warnings) {
    console.warn(`[${warning.code}] ${warning.message}`)
    console.log('  Suggestion:', warning.suggestion)
  }

  console.groupEnd()
}

// =============================================================================
// Error Formatting for Display
// =============================================================================

/**
 * Format an error for user-friendly display
 */
export function formatErrorForDisplay(error: Error | ClarityError): {
  title: string
  message: string
  suggestion?: string
  canRetry: boolean
} {
  const isClarityError = 'code' in error && 'suggestion' in error

  if (isClarityError) {
    const clarityError = error as ClarityError
    const canRetry = [
      'NETWORK_ERROR',
      'NETWORK_TIMEOUT',
      'API_ERROR_429',
      'API_ERROR_500',
      'STREAMING_ERROR',
    ].includes(clarityError.code)

    return {
      title: getErrorTitle(clarityError.code),
      message: clarityError.message,
      suggestion: clarityError.suggestion,
      canRetry,
    }
  }

  // Generic error
  return {
    title: 'Error',
    message: error.message || 'An unexpected error occurred',
    suggestion:
      'Try refreshing the page or contact support if the issue persists.',
    canRetry: true,
  }
}

function getErrorTitle(code: ClarityErrorCode): string {
  if (code.startsWith('CONFIG_')) return 'Configuration Error'
  if (code.startsWith('NETWORK_') || code.startsWith('API_'))
    return 'Connection Error'
  if (code.startsWith('SAFETY_')) return 'Safety Filter'
  if (code.startsWith('RAG_')) return 'RAG Error'
  if (code.startsWith('TOOLS_')) return 'Tool Error'
  if (code.startsWith('MEMORY_')) return 'Memory Error'
  return 'Error'
}

// =============================================================================
// Quick Start Guide (shown on first error in dev)
// =============================================================================

let hasShownQuickStart = false

/**
 * Show quick start guide on first error in development
 */
export function showQuickStartOnError(): void {
  if (!DEV_MODE || hasShownQuickStart) return
  hasShownQuickStart = true

  console.log(
    `
%c${HINT_PREFIX} Quick Start Guide
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%c1. Basic Setup%c
   <ClarityChatApp api="/api/chat" />

%c2. With Features%c
   <ClarityChatApp
     api="/api/chat"
     features={{ memory: true, streaming: true }}
   />

%c3. Using Presets%c
   <ClarityChatApp api="/api/chat" preset="enterprise" />

%c4. Debug Events%c
   <ClarityChatApp
     api="/api/chat"
     onEvent={(e) => console.log('Event:', e)}
   />

%cDocs: https://clarity-chat.dev/docs
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
    'color: #0066cc; font-size: 14px; font-weight: bold;',
    'color: #666;',
    'color: #00cc66; font-weight: bold;',
    'color: inherit;',
    'color: #00cc66; font-weight: bold;',
    'color: inherit;',
    'color: #00cc66; font-weight: bold;',
    'color: inherit;',
    'color: #00cc66; font-weight: bold;',
    'color: inherit;',
    'color: #0066cc;',
    'color: #666;'
  )
}
