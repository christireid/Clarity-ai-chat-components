/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 * @packageDocumentation
 */

/**
 * Screen reader only CSS class utility
 * Visually hides content but keeps it accessible to screen readers
 */
export const srOnlyStyles = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  borderWidth: '0',
}

/**
 * Focus visible styles for consistent focus indicators
 */
export const focusVisibleStyles = {
  outline: '2px solid',
  outlineColor: 'var(--color-brand)',
  outlineOffset: '2px',
  borderRadius: '0.375rem',
}

/**
 * Announces a message to screen readers
 * Uses ARIA live regions for dynamic content updates
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement is made
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Traps focus within a container element
 * Useful for modals, dialogs, and menus
 */
export function createFocusTrap(
  container: HTMLElement,
  options?: {
    initialFocus?: HTMLElement
    returnFocus?: boolean
    escapeDeactivates?: boolean
  }
) {
  const focusableSelectors = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ].join(',')

  let previousActiveElement: HTMLElement | null = null

  const getFocusableElements = (): HTMLElement[] => {
    return Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => {
      // Filter out elements with display: none or visibility: hidden
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && options?.escapeDeactivates !== false) {
      deactivate()
      return
    }

    if (e.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  const activate = () => {
    if (options?.returnFocus !== false) {
      previousActiveElement = document.activeElement as HTMLElement
    }

    const focusableElements = getFocusableElements()
    const initialFocusElement = options?.initialFocus || focusableElements[0]

    if (initialFocusElement) {
      // Use setTimeout to ensure the element is visible before focusing
      setTimeout(() => initialFocusElement.focus(), 10)
    }

    container.addEventListener('keydown', handleKeyDown)
  }

  const deactivate = () => {
    container.removeEventListener('keydown', handleKeyDown)

    if (previousActiveElement && options?.returnFocus !== false) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  }

  return {
    activate,
    deactivate,
  }
}

/**
 * Manages focus restoration after async operations
 * Useful for navigation and dynamic content updates
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null

  capture(): void {
    this.previousFocus = document.activeElement as HTMLElement
  }

  restore(): void {
    if (this.previousFocus) {
      this.previousFocus.focus()
      this.previousFocus = null
    }
  }

  clear(): void {
    this.previousFocus = null
  }
}

/**
 * Checks if an element is keyboard focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const tabIndex = element.getAttribute('tabindex')
  if (tabIndex && parseInt(tabIndex, 10) < 0) return false

  const tagName = element.tagName.toLowerCase()
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea']

  if (focusableTags.includes(tagName)) {
    return !element.hasAttribute('disabled')
  }

  return tabIndex !== null && tabIndex !== '-1'
}

/**
 * Gets the accessible name of an element
 * Checks aria-label, aria-labelledby, and fallback content
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labels = labelledBy
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent || '')
      .filter(Boolean)
      .join(' ')
    if (labels) return labels
  }

  // Check associated label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`)
    if (label) return label.textContent || ''
  }

  // Fallback to element content
  return element.textContent || ''
}

/**
 * Validates WCAG color contrast ratio
 * @param foreground - Foreground color in hex or rgb
 * @param background - Background color in hex or rgb
 * @returns Object with ratio and compliance levels
 */
export function checkColorContrast(
  foreground: string,
  background: string
): {
  ratio: number
  AA: boolean
  AAA: boolean
  AALarge: boolean
  AAALarge: boolean
} {
  const getRGB = (color: string): [number, number, number] => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return [r, g, b]
    }

    // Handle rgb/rgba colors
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
      ]
    }

    throw new Error('Invalid color format')
  }

  const getRelativeLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map((val) => {
      const sRGB = val / 255
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const L1 = getRelativeLuminance(getRGB(foreground))
  const L2 = getRelativeLuminance(getRGB(background))
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)

  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: ratio >= 4.5, // WCAG AA for normal text
    AAA: ratio >= 7, // WCAG AAA for normal text
    AALarge: ratio >= 3, // WCAG AA for large text (18pt+)
    AAALarge: ratio >= 4.5, // WCAG AAA for large text
  }
}

/**
 * Generates unique IDs for ARIA relationships
 */
let idCounter = 0
export function generateId(prefix = 'a11y'): string {
  idCounter += 1
  return `${prefix}-${idCounter}-${Date.now()}`
}

/**
 * Detects if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Detects if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Hook for managing skip links
 */
export function createSkipLink(
  targetId: string,
  label: string
): {
  render: () => HTMLAnchorElement
  focus: () => void
} {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = label
  skipLink.className = 'skip-to-content'

  const focus = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  skipLink.addEventListener('click', (e) => {
    e.preventDefault()
    focus()
  })

  return {
    render: () => skipLink,
    focus,
  }
}

/**
 * Keyboard event helper for consistent key handling
 */
export const KeyboardKeys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Tab: 'Tab',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
} as const

/**
 * Helper to check if a keyboard event matches a key
 */
export function isKeyboardEvent(
  event: KeyboardEvent,
  key: string | string[]
): boolean {
  const keys = Array.isArray(key) ? key : [key]
  return keys.includes(event.key)
}

/**
 * ARIA role utilities
 */
export const AriaRoles = {
  Alert: 'alert',
  AlertDialog: 'alertdialog',
  Application: 'application',
  Article: 'article',
  Banner: 'banner',
  Button: 'button',
  Cell: 'cell',
  Checkbox: 'checkbox',
  ColumnHeader: 'columnheader',
  Combobox: 'combobox',
  Complementary: 'complementary',
  ContentInfo: 'contentinfo',
  Definition: 'definition',
  Dialog: 'dialog',
  Directory: 'directory',
  Document: 'document',
  Feed: 'feed',
  Figure: 'figure',
  Form: 'form',
  Grid: 'grid',
  GridCell: 'gridcell',
  Group: 'group',
  Heading: 'heading',
  Img: 'img',
  Link: 'link',
  List: 'list',
  Listbox: 'listbox',
  ListItem: 'listitem',
  Main: 'main',
  Menu: 'menu',
  MenuBar: 'menubar',
  MenuItem: 'menuitem',
  MenuItemCheckbox: 'menuitemcheckbox',
  MenuItemRadio: 'menuitemradio',
  Navigation: 'navigation',
  None: 'none',
  Note: 'note',
  Option: 'option',
  Presentation: 'presentation',
  ProgressBar: 'progressbar',
  Radio: 'radio',
  RadioGroup: 'radiogroup',
  Region: 'region',
  Row: 'row',
  RowGroup: 'rowgroup',
  RowHeader: 'rowheader',
  Search: 'search',
  Searchbox: 'searchbox',
  Separator: 'separator',
  Slider: 'slider',
  SpinButton: 'spinbutton',
  Status: 'status',
  Switch: 'switch',
  Tab: 'tab',
  Table: 'table',
  TabList: 'tablist',
  TabPanel: 'tabpanel',
  Term: 'term',
  Textbox: 'textbox',
  Timer: 'timer',
  Toolbar: 'toolbar',
  Tooltip: 'tooltip',
  Tree: 'tree',
  TreeGrid: 'treegrid',
  TreeItem: 'treeitem',
} as const
