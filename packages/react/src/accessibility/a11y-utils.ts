/**
 * Accessibility Utilities
 *
 * WCAG 2.1 AAA compliance utilities
 */

/**
 * Generate unique ID for ARIA attributes
 */
export function generateAriaId(prefix: string = 'aria'): string {
  const rand = Math.random().toString(36).substring(2, 11)
  const time =
    typeof performance !== 'undefined' && performance.now
      ? Math.floor(performance.now()).toString(36)
      : ''
  return `${prefix}-${time}${time ? '-' : ''}${rand}`
}

/**
 * Announce message to screen readers
 *
 * @deprecated Prefer using the `useA11y().announce()` hook from `@clarity-chat/primitives`
 * for React components. The hook provides:
 * - Debouncing for rapid announcements
 * - Queue management
 * - Automatic cleanup
 * - Context-based configuration
 *
 * @example
 * ```tsx
 * // Preferred approach in React components:
 * import { useA11y } from '@clarity-chat/primitives'
 *
 * function MyComponent() {
 *   const { announce } = useA11y()
 *   announce('Message sent', { assertive: false })
 * }
 * ```
 *
 * This function remains available for non-React contexts or when direct DOM
 * manipulation is required.
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return true
  const style = window.getComputedStyle(element)
  return (
    !element.hidden &&
    element.getAttribute('aria-hidden') !== 'true' &&
    style.visibility !== 'hidden' &&
    style.display !== 'none'
  )
}

/**
 * Get accessible name for element
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    if (typeof document === 'undefined') return ''
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent || ''
  }

  // Check associated label
  if (element.id) {
    if (typeof document === 'undefined') return ''
    const label = document.querySelector(`label[for="${element.id}"]`)
    if (label) return label.textContent || ''
  }

  // Return text content
  return element.textContent || ''
}

/**
 * Create live region for announcements
 *
 * @deprecated Prefer using `A11yProvider` from `@clarity-chat/primitives` which
 * automatically manages live regions with proper lifecycle handling.
 *
 * This function remains available for non-React contexts.
 */
export function createLiveRegion(id: string = 'live-region'): HTMLElement {
  if (typeof document === 'undefined') {
    // @ts-expect-error SSR fallback: no element available
    return {}
  }
  let region = document.getElementById(id)

  if (!region) {
    region = document.createElement('div')
    region.id = id
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)
  }

  return region
}

/**
 * Check WCAG contrast ratio
 */
export function checkContrastRatio(
  foreground: string,
  background: string
): {
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  level: 'AAA' | 'AA' | 'Fail'
} {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0)
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  const ratio = (lighter + 0.05) / (darker + 0.05)

  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail',
  }
}

/**
 * Screen reader only CSS class
 */
export const srOnlyStyles = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  borderWidth: 0,
}

/**
 * Skip to content link
 */
export function createSkipLink(
  targetId: string,
  text: string = 'Skip to main content'
): HTMLElement {
  const link = document.createElement('a')
  link.href = `#${targetId}`
  link.textContent = text
  link.className = 'skip-link'
  link.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background: #000;
    color: #fff;
    text-decoration: none;
  `

  link.addEventListener('focus', () => {
    link.style.left = '0'
  })

  link.addEventListener('blur', () => {
    link.style.left = '-9999px'
  })

  return link
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check required ARIA attributes
  const role = element.getAttribute('role')

  if (
    role === 'button' &&
    !element.hasAttribute('aria-label') &&
    !element.textContent?.trim()
  ) {
    errors.push('Button must have accessible name')
  }

  if (
    role === 'img' &&
    !element.hasAttribute('alt') &&
    !element.hasAttribute('aria-label')
  ) {
    errors.push('Image must have alt text or aria-label')
  }

  // Check aria-labelledby references valid ID
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy && !document.getElementById(labelledBy)) {
    errors.push(`aria-labelledby references non-existent ID: ${labelledBy}`)
  }

  // Check aria-describedby references valid ID
  const describedBy = element.getAttribute('aria-describedby')
  if (describedBy && !document.getElementById(describedBy)) {
    errors.push(`aria-describedby references non-existent ID: ${describedBy}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
