/**
 * Rate Limit Header Parsing Utility
 *
 * Parses rate limit headers from AI provider responses to enable
 * intelligent retry behavior and compliance with API limits.
 *
 * Supports:
 * - OpenAI: x-ratelimit-* headers
 * - Anthropic: retry-after header
 * - Google: retry-after header
 * - Standard: Retry-After header (RFC 7231)
 */

export interface RateLimitInfo {
  /** Seconds to wait before retrying (from Retry-After header) */
  retryAfter?: number
  /** Remaining requests in current window */
  remaining?: number
  /** Total limit for current window */
  limit?: number
  /** Unix timestamp when limit resets */
  reset?: number
  /** Remaining tokens in current window (OpenAI) */
  remainingTokens?: number
  /** Token limit for current window (OpenAI) */
  tokenLimit?: number
  /** Token reset timestamp (OpenAI) */
  tokenReset?: number
  /** Provider that set these limits */
  provider?: 'openai' | 'anthropic' | 'google' | 'unknown'
}

/**
 * Parse rate limit headers from AI provider responses
 *
 * @example
 * ```ts
 * const response = await fetch('/api/openai/chat')
 *
 * if (response.status === 429) {
 *   const limits = parseRateLimitHeaders(response)
 *   logger.debug(`Rate limited. Retry after ${limits.retryAfter}s`)
 *
 *   if (limits.retryAfter) {
 *     await sleep(limits.retryAfter * 1000)
 *   }
 * }
 * ```
 */
export function parseRateLimitHeaders(response: Response): RateLimitInfo {
  const headers = response.headers
  const info: RateLimitInfo = {}

  // Standard Retry-After header (highest priority)
  const retryAfter = headers.get('retry-after')
  if (retryAfter) {
    // Can be seconds or HTTP date
    const seconds = parseInt(retryAfter, 10)
    if (!isNaN(seconds)) {
      info.retryAfter = seconds
    } else {
      // Parse as date
      const date = new Date(retryAfter)
      if (!isNaN(date.getTime())) {
        info.retryAfter = Math.max(
          0,
          Math.ceil((date.getTime() - Date.now()) / 1000)
        )
      }
    }
  }

  // OpenAI headers
  const openAIRemaining = headers.get('x-ratelimit-remaining-requests')
  const openAILimit = headers.get('x-ratelimit-limit-requests')
  const openAIReset = headers.get('x-ratelimit-reset-requests')
  const openAITokenRemaining = headers.get('x-ratelimit-remaining-tokens')
  const openAITokenLimit = headers.get('x-ratelimit-limit-tokens')
  const openAITokenReset = headers.get('x-ratelimit-reset-tokens')

  if (openAIRemaining || openAILimit || openAIReset) {
    info.provider = 'openai'
  }

  if (openAIRemaining) {
    info.remaining = parseInt(openAIRemaining, 10) || undefined
  }

  if (openAILimit) {
    info.limit = parseInt(openAILimit, 10) || undefined
  }

  if (openAIReset) {
    // OpenAI uses relative time like "1s" or "1m"
    info.reset = parseRelativeTime(openAIReset)
  }

  if (openAITokenRemaining) {
    info.remainingTokens = parseInt(openAITokenRemaining, 10) || undefined
  }

  if (openAITokenLimit) {
    info.tokenLimit = parseInt(openAITokenLimit, 10) || undefined
  }

  if (openAITokenReset) {
    info.tokenReset = parseRelativeTime(openAITokenReset)
  }

  // Anthropic detection (uses standard retry-after)
  const anthropicVersion = headers.get('anthropic-version')
  if (anthropicVersion) {
    info.provider = 'anthropic'
  }

  // Google detection
  const googleDate = headers.get('x-goog-api-client')
  if (googleDate) {
    info.provider = 'google'
  }

  // If no specific provider detected
  if (!info.provider && (info.retryAfter || info.remaining)) {
    info.provider = 'unknown'
  }

  return info
}

/**
 * Parse relative time strings like "1s", "30s", "1m", "500ms"
 * Returns Unix timestamp when the time will elapse
 */
function parseRelativeTime(timeStr: string): number {
  const now = Date.now()

  // Match patterns like "1s", "30s", "1m", "500ms"
  const match = timeStr.match(/^(\d+)(ms|s|m|h)?$/)
  if (!match || !match[1]) return now

  const value = parseInt(match[1], 10)
  const unit = match[2] || 's'

  let ms: number
  switch (unit) {
    case 'ms':
      ms = value
      break
    case 's':
      ms = value * 1000
      break
    case 'm':
      ms = value * 60 * 1000
      break
    case 'h':
      ms = value * 60 * 60 * 1000
      break
    default:
      ms = value * 1000
  }

  return now + ms
}

/**
 * Calculate delay based on rate limit info
 * Uses Retry-After if available, otherwise calculates from reset time
 *
 * @param info - Parsed rate limit info
 * @param defaultDelay - Default delay if no headers available (ms)
 * @returns Delay in milliseconds
 */
export function calculateRetryDelay(
  info: RateLimitInfo,
  defaultDelay = 1000
): number {
  // Use Retry-After if available
  if (info.retryAfter !== undefined) {
    return info.retryAfter * 1000
  }

  // Calculate from reset time
  if (info.reset !== undefined) {
    const delay = Math.max(0, info.reset - Date.now())
    return delay
  }

  // For tokens specifically
  if (info.tokenReset !== undefined) {
    const delay = Math.max(0, info.tokenReset - Date.now())
    return delay
  }

  return defaultDelay
}

/**
 * Check if we should wait based on remaining quota
 *
 * @param info - Parsed rate limit info
 * @param threshold - Remaining requests threshold to trigger warning (default: 5)
 * @returns true if we should slow down requests
 */
export function shouldThrottle(info: RateLimitInfo, threshold = 5): boolean {
  if (info.remaining !== undefined && info.remaining <= threshold) {
    return true
  }

  if (info.remainingTokens !== undefined && info.remainingTokens <= 1000) {
    return true
  }

  return false
}

/**
 * Create a rate limit error with parsed info
 */
export class RateLimitInfoError extends Error {
  public readonly rateLimitInfo: RateLimitInfo

  constructor(message: string, info: RateLimitInfo) {
    super(message)
    this.name = 'RateLimitInfoError'
    this.rateLimitInfo = info
  }
}
