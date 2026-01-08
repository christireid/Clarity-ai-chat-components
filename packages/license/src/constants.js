/**
 * License Constants
 *
 * Shared constants for license validation and plan comparison.
 *
 * @packageDocumentation
 */
/**
 * Plan hierarchy for comparison operations.
 * Higher values indicate more permissive plans.
 *
 * @internal
 */
export const PLAN_HIERARCHY = {
    community: 0,
    pro: 1,
    enterprise: 2,
};
/**
 * Check if an actual plan meets a required plan level.
 *
 * @param actualPlan - The plan to check
 * @param requiredPlan - The minimum required plan level
 * @returns true if actualPlan meets or exceeds requiredPlan
 *
 * @example
 * ```typescript
 * isPlanSufficient('pro', 'community') // true
 * isPlanSufficient('pro', 'pro') // true
 * isPlanSufficient('pro', 'enterprise') // false
 * ```
 */
export function isPlanSufficient(actualPlan, requiredPlan) {
    return PLAN_HIERARCHY[actualPlan] >= PLAN_HIERARCHY[requiredPlan];
}
// ============================================================================
// Shared Warning Deduplication System
// ============================================================================
/**
 * Track warned components/features with timestamps for TTL-based cleanup.
 * Shared between withLicense HOC and useLicenseWarning hook.
 * @internal
 */
const warnedKeys = new Map();
/** Maximum age for warned entries (1 hour) */
const WARNING_TTL_MS = 60 * 60 * 1000;
/** Maximum number of warning entries to prevent memory issues */
const MAX_WARNING_ENTRIES = 1000;
/** Counter for periodic cleanup (every N operations) */
let cleanupCounter = 0;
const CLEANUP_INTERVAL = 50;
/**
 * Check if we're in development mode.
 * Uses a more robust check that works in various bundler configurations.
 * @internal
 */
export function isDevelopment() {
    // Check for explicit NODE_ENV
    if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
        return process.env.NODE_ENV === 'development';
    }
    // Fallback: check for common development indicators
    if (typeof window !== 'undefined') {
        // @ts-expect-error - __DEV__ is set by some bundlers
        return window.__DEV__ === true;
    }
    return false;
}
/**
 * Perform cleanup of expired entries.
 * Called periodically and when size limit is reached.
 * @internal
 */
function cleanupExpiredEntries() {
    const now = Date.now();
    for (const [name, timestamp] of warnedKeys.entries()) {
        if (now - timestamp > WARNING_TTL_MS) {
            warnedKeys.delete(name);
        }
    }
}
/**
 * Evict oldest entries when size limit is reached.
 * Uses LRU-style eviction based on timestamp.
 * @internal
 */
function evictOldestEntries() {
    if (warnedKeys.size <= MAX_WARNING_ENTRIES)
        return;
    // Convert to array and sort by timestamp (oldest first)
    const entries = Array.from(warnedKeys.entries()).sort(([, a], [, b]) => a - b);
    // Remove oldest entries until we're under the limit
    const entriesToRemove = entries.slice(0, warnedKeys.size - MAX_WARNING_ENTRIES + 100); // Remove 100 extra for headroom
    for (const [key] of entriesToRemove) {
        warnedKeys.delete(key);
    }
}
/**
 * Check if a warning has been shown recently for a given key.
 * Automatically cleans up old entries to prevent memory leaks.
 *
 * @param key - Unique identifier for the warning (component name or feature)
 * @returns true if warning was shown within TTL window
 * @internal
 */
export function hasWarnedRecently(key) {
    // Periodic cleanup every N calls
    cleanupCounter++;
    if (cleanupCounter >= CLEANUP_INTERVAL) {
        cleanupCounter = 0;
        cleanupExpiredEntries();
    }
    return warnedKeys.has(key);
}
/**
 * Mark a key as having shown a warning.
 *
 * @param key - Unique identifier for the warning
 * @internal
 */
export function markWarningShown(key) {
    // Check size limit before adding
    if (warnedKeys.size >= MAX_WARNING_ENTRIES) {
        cleanupExpiredEntries();
        // If still over limit after cleanup, evict oldest
        if (warnedKeys.size >= MAX_WARNING_ENTRIES) {
            evictOldestEntries();
        }
    }
    warnedKeys.set(key, Date.now());
}
/**
 * Clear all warning records (useful for testing).
 * @internal
 */
export function clearWarnings() {
    warnedKeys.clear();
    cleanupCounter = 0;
}
/**
 * Get the current number of warning entries (for testing/debugging).
 * @internal
 */
export function getWarningCount() {
    return warnedKeys.size;
}
//# sourceMappingURL=constants.js.map