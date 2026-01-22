/**
 * Timing Constants
 *
 * Pure timing constants without React/component dependencies.
 * These can be safely imported in tests without triggering dependency chains.
 */

// UI timing
export const CLIPBOARD_TIMEOUT_MS = 2000 // Clipboard success display time
export const TOAST_DURATION_MS = 3000 // Toast notification duration
export const FOCUS_DELAY_MS = 100 // Delay before focusing input

// Streaming/retry timing
export const STREAM_THROTTLE_MS = 50 // Throttle streaming updates
export const MAX_RETRY_ATTEMPTS = 3
export const INITIAL_RETRY_DELAY_MS = 1000
export const MAX_RETRY_DELAY_MS = 10000
export const RETRY_BACKOFF_MULTIPLIER = 2

// Token tracking
export const MODEL_MAX_TOKENS = 128000 // Claude/GPT-4 turbo context window
export const TOKEN_COST_PER_TOKEN = 0.000003 // Claude 3 Sonnet pricing
export const TOKEN_WARNING_THRESHOLD = 0.75 // Warn at 75% usage
export const TOKEN_CRITICAL_THRESHOLD = 0.9 // Critical at 90% usage

// Session/storage timing
export const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
