/**
 * Screen Reader Announcement Utility
 *
 * Provides WCAG 2.1 AA compliant announcements for screen readers
 * via ARIA live regions. Supports polite and assertive priorities.
 *
 * @module accessibility/announcer
 */

/**
 * Priority level for screen reader announcements
 */
export type AnnouncementPriority = 'polite' | 'assertive'

/**
 * Internal reference to the live region element
 */
let liveRegionPolite: HTMLElement | null = null
let liveRegionAssertive: HTMLElement | null = null

/**
 * Creates a visually hidden live region for screen reader announcements
 *
 * @param priority - The ARIA live priority level
 * @returns The created live region element
 */
function createLiveRegion(priority: AnnouncementPriority): HTMLElement {
  const region = document.createElement('div')
  region.setAttribute('aria-live', priority)
  region.setAttribute('aria-atomic', 'true')
  region.setAttribute('role', 'status')

  // Visually hidden but accessible to screen readers
  // Uses clip pattern for maximum browser compatibility
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `

  region.id = `token-optimization-live-region-${priority}`

  document.body.appendChild(region)
  return region
}

/**
 * Gets or creates the live region for the specified priority
 *
 * @param priority - The ARIA live priority level
 * @returns The live region element
 */
function getLiveRegion(priority: AnnouncementPriority): HTMLElement | null {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return null
  }

  if (priority === 'assertive') {
    if (!liveRegionAssertive) {
      liveRegionAssertive = createLiveRegion('assertive')
    }
    return liveRegionAssertive
  }

  if (!liveRegionPolite) {
    liveRegionPolite = createLiveRegion('polite')
  }
  return liveRegionPolite
}

/**
 * Announces a message to screen readers via ARIA live region
 *
 * @param message - The message to announce
 * @param priority - The announcement priority (default: 'polite')
 *
 * @example
 * ```typescript
 * // Polite announcement (won't interrupt current speech)
 * announce('Token count updated to 500 of 4000')
 *
 * // Assertive announcement (interrupts immediately)
 * announce('Warning: Token limit exceeded', 'assertive')
 * ```
 */
export function announce(
  message: string,
  priority: AnnouncementPriority = 'polite'
): void {
  const region = getLiveRegion(priority)

  if (!region) {
    // Not in browser environment, log to console in development
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Screen Reader Announcement - ${priority}]: ${message}`)
      }
    }
    return
  }

  // Clear and set message with a small delay to ensure announcement
  // This handles the case where the same message is announced twice
  region.textContent = ''
  requestAnimationFrame(() => {
    region.textContent = message
  })
}

/**
 * Creates a human-readable announcement for token usage
 *
 * @param current - Current token count
 * @param limit - Maximum token limit
 * @returns Formatted announcement string
 *
 * @example
 * ```typescript
 * const message = announceTokenUsage(1500, 4000)
 * // Returns: "Token usage: 1,500 of 4,000 tokens. 37% used, 2,500 tokens remaining."
 * ```
 */
export function announceTokenUsage(current: number, limit: number): string {
  const percentage = Math.round((current / limit) * 100)
  const remaining = limit - current

  const formattedCurrent = current.toLocaleString()
  const formattedLimit = limit.toLocaleString()
  const formattedRemaining = remaining.toLocaleString()

  if (percentage >= 95) {
    return `Critical: Token usage at ${percentage}%. ${formattedCurrent} of ${formattedLimit} tokens used. Only ${formattedRemaining} tokens remaining.`
  }

  if (percentage >= 80) {
    return `Warning: Token usage at ${percentage}%. ${formattedCurrent} of ${formattedLimit} tokens used. ${formattedRemaining} tokens remaining.`
  }

  return `Token usage: ${formattedCurrent} of ${formattedLimit} tokens. ${percentage}% used, ${formattedRemaining} tokens remaining.`
}

/**
 * Creates a human-readable announcement for cost information
 *
 * @param amount - The cost amount
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted announcement string
 *
 * @example
 * ```typescript
 * const message = announceCost(0.0123, 'USD')
 * // Returns: "Estimated cost: $0.01 USD"
 * ```
 */
export function announceCost(amount: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })

  const formattedAmount = formatter.format(amount)

  if (amount === 0) {
    return `Estimated cost: ${formattedAmount}`
  }

  if (amount < 0.01) {
    return `Estimated cost: less than ${formatter.format(0.01)}`
  }

  return `Estimated cost: ${formattedAmount}`
}

/**
 * Creates a human-readable announcement for compression results
 *
 * @param originalTokens - Original token count before compression
 * @param compressedTokens - Token count after compression
 * @returns Formatted announcement string
 *
 * @example
 * ```typescript
 * const message = announceCompression(1000, 600)
 * // Returns: "Compression complete. Reduced from 1,000 to 600 tokens. 40% reduction, 400 tokens saved."
 * ```
 */
export function announceCompression(
  originalTokens: number,
  compressedTokens: number
): string {
  const saved = originalTokens - compressedTokens
  const reductionPercent = Math.round((saved / originalTokens) * 100)

  const formattedOriginal = originalTokens.toLocaleString()
  const formattedCompressed = compressedTokens.toLocaleString()
  const formattedSaved = saved.toLocaleString()

  if (saved <= 0) {
    return `Compression complete. No token reduction achieved. Content already optimized at ${formattedOriginal} tokens.`
  }

  return `Compression complete. Reduced from ${formattedOriginal} to ${formattedCompressed} tokens. ${reductionPercent}% reduction, ${formattedSaved} tokens saved.`
}

/**
 * Creates a threshold-crossing announcement
 *
 * @param level - The threshold level crossed ('warning' | 'critical' | 'normal')
 * @param percentage - Current usage percentage
 * @returns Formatted announcement string
 */
export function announceThresholdCrossing(
  level: 'warning' | 'critical' | 'normal',
  percentage: number
): string {
  switch (level) {
    case 'critical':
      return `Critical alert: Token usage has reached ${percentage}%. You are approaching the token limit.`
    case 'warning':
      return `Warning: Token usage has reached ${percentage}%. Consider optimizing your content.`
    case 'normal':
      return `Token usage returned to normal levels at ${percentage}%.`
    default:
      return `Token usage is at ${percentage}%.`
  }
}

/**
 * Cleans up live regions when no longer needed
 * Should be called when the component is unmounted
 */
export function cleanupAnnouncer(): void {
  if (liveRegionPolite && liveRegionPolite.parentNode) {
    liveRegionPolite.parentNode.removeChild(liveRegionPolite)
    liveRegionPolite = null
  }

  if (liveRegionAssertive && liveRegionAssertive.parentNode) {
    liveRegionAssertive.parentNode.removeChild(liveRegionAssertive)
    liveRegionAssertive = null
  }
}
