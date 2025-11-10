/**
 * Custom Assertions
 * 
 * Custom Jest matchers for component testing
 */

import { screen } from '@testing-library/react'

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
  // @ts-expect-error - toBeVisible is from jest-dom
  expect(element).toBeVisible()
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
export function expectLoading(container?: Element): void {
  // @ts-expect-error - screen.queryByRole exists at runtime
  const loadingIndicator = container ? screen.queryByRole('status', { container }) : screen.queryByRole('status')
  // @ts-expect-error - toBeInTheDocument is from jest-dom
  expect(loadingIndicator).toBeInTheDocument()
}

/**
 * Assert error state
 */
export function expectError(container?: Element, message?: string): void {
  // @ts-expect-error - screen.queryByRole exists at runtime
  const alert = container ? screen.queryByRole('alert', { container }) : screen.queryByRole('alert')
  // @ts-expect-error - toBeInTheDocument is from jest-dom
  expect(alert).toBeInTheDocument()
  
  if (message) {
    // @ts-expect-error - toHaveTextContent is from jest-dom
    expect(alert).toHaveTextContent(message)
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
