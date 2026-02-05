/**
 * Vitest Setup File
 *
 * This file runs before all tests and sets up the testing environment.
 */

import '@testing-library/jest-dom'
import { expect, afterEach, vi, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from 'jest-axe'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// ============================================================================
// Global Mocks
// ============================================================================

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  cb(0)
  return 0
})

// Mock cancelAnimationFrame
global.cancelAnimationFrame = vi.fn()

// ============================================================================
// Console Suppression
// ============================================================================

// Suppress console errors during tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress React 18 act() warnings
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

// ============================================================================
// Environment Variables
// ============================================================================

process.env.NODE_ENV = 'test'

// ============================================================================
// Custom Matchers
// ============================================================================

expect.extend({
  /**
   * Check if element has proper ARIA label
   */
  toHaveAriaLabel(element: HTMLElement) {
    const hasLabel =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby')

    return {
      pass: hasLabel,
      message: () =>
        hasLabel
          ? `Expected element not to have ARIA label`
          : `Expected element to have aria-label or aria-labelledby attribute`,
    }
  },

  /**
   * Check if element is keyboard navigable
   */
  toBeKeyboardNavigable(element: HTMLElement) {
    const isNavigable = element.tabIndex >= 0 || element.hasAttribute('tabindex')

    return {
      pass: isNavigable,
      message: () =>
        isNavigable
          ? `Expected element not to be keyboard navigable`
          : `Expected element to have tabIndex >= 0 or tabindex attribute`,
    }
  },

  /**
   * Check if element has proper focus styles
   */
  toHaveFocusStyles(element: HTMLElement) {
    const styles = window.getComputedStyle(element)
    const hasFocusStyles =
      styles.outlineWidth !== '0px' || styles.boxShadow !== 'none'

    return {
      pass: hasFocusStyles,
      message: () =>
        hasFocusStyles
          ? `Expected element not to have focus styles`
          : `Expected element to have visible focus styles (outline or box-shadow)`,
    }
  },
})

// ============================================================================
// Type Declarations
// ============================================================================

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveAriaLabel(): T
    toBeKeyboardNavigable(): T
    toHaveFocusStyles(): T
  }
}
