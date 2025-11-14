/**
 * Custom Assertions
 * 
 * Custom testing matchers for component testing
 */

import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'

/**
 * Assert component has specific class
 */
export function expectHasClass(element: Element, className: string): void {
  expect(element.classList.contains(className)).toBe(true)
}

/**
 * Assert component has aria attribute
 */
export function expectHasAria(element: Element, attribute: string, value?: string): void {
  const attr = element.getAttribute(`aria-${attribute}`)
  expect(attr).not.toBeNull()
  
  if (value !== undefined) {
    expect(attr).toBe(value)
  }
}

/**
 * Assert component is visible
 */
export function expectVisible(element: Element): void {
  const styles = window.getComputedStyle(element)
  expect(styles.visibility).not.toBe('hidden')
  expect(styles.display).not.toBe('none')
  expect(styles.opacity).not.toBe('0')
}

/**
 * Assert component has focus
 */
export function expectHasFocus(element: Element): void {
  expect(document.activeElement).toBe(element)
}

/**
 * Assert loading state
 */
export function expectLoading(container?: HTMLElement): void {
  const loadingIndicator = container 
    ? screen.queryByRole('status', { name: /loading/i }) 
    : screen.queryByRole('status', { name: /loading/i })

  expect(loadingIndicator).not.toBeNull()
}

/**
 * Assert error state
 */
export function expectError(container?: HTMLElement, message?: string): void {
  const alert = container 
    ? screen.queryByRole('alert') 
    : screen.queryByRole('alert')

  expect(alert).not.toBeNull()
  
  if (message && alert) {
    expect(alert.textContent).toContain(message)
  }
}

/**
 * Assert component matches snapshot
 */
export function expectMatchesSnapshot(container: Element, name?: string): void {
  expect(container).toMatchSnapshot(name)
}

/**
 * Assert proper shadow DOM structure
 */
export function expectShadowClasses(element: Element, expectedClasses: string[]): void {
  const classes = Array.from(element.classList)
  
  for (const className of expectedClasses) {
    expect(classes).toContain(className)
  }
}

/**
 * Assert transition classes
 */
export function expectTransitionClasses(element: Element): void {
  const classes = Array.from(element.classList)
  const hasTransition = classes.some(c => 
    c.includes('transition') || c.includes('duration') || c.includes('ease')
  )
  
  expect(hasTransition).toBe(true)
}

/**
 * Assert design system patterns
 */
export function expectDesignSystemPatterns(element: Element): void {
  const classes = Array.from(element.classList)
  
  // Check for ring-based borders (not old border- classes)
  const hasBorder = classes.some(c => c.startsWith('border-'))
  const hasRing = classes.some(c => c.startsWith('ring-'))
  
  if (hasBorder) {
    // If using borders, should also have ring for consistency
    expect(hasRing).toBe(true)
  }

  // Check for proper shadow usage
  const hasShadow = classes.some(c => c.includes('shadow'))
  if (hasShadow) {
    const validShadows = ['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl']
    const shadowClass = classes.find(c => c.includes('shadow'))
    expect(validShadows).toContain(shadowClass)
  }
}
