/**
 * Accessibility Testing Utilities
 * 
 * Helper functions for testing accessibility
 */

import { axe, toHaveNoViolations } from 'jest-axe'

// Type for Jest matchers (will be extended at test runtime)
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expect: any
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}

// Export for test setup
export { toHaveNoViolations }

/**
 * Check if a component is accessible
 * 
 * @example
 * ```tsx
 * const { container } = renderWithProviders(<Button>Click me</Button>)
 * await expectAccessible(container)
 * ```
 */
export async function expectAccessible(
  container: Element,
  options?: Record<string, unknown>
): Promise<void> {
  const results = await axe(container, options)
  if (results.violations.length > 0) {
    throw new Error(`Accessibility violations found: ${JSON.stringify(results.violations, null, 2)}`)
  }
}

/**
 * Check for specific WCAG level
 * 
 * @example
 * ```tsx
 * await expectWCAGLevel(container, 'AA')
 * ```
 */
export async function expectWCAGLevel(
  container: Element,
  level: 'A' | 'AA' | 'AAA'
): Promise<void> {
  const results = await axe(container, {
    runOnly: {
      type: 'tag',
      values: [`wcag2${level.toLowerCase()}` as string],
    },
  })
  if (results.violations.length > 0) {
    throw new Error(`WCAG ${level} violations found: ${JSON.stringify(results.violations, null, 2)}`)
  }
}

/**
 * Check for keyboard navigation
 * 
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<Button>Click</Button>)
 * expectKeyboardAccessible(getByRole('button'))
 * ```
 */
export function expectKeyboardAccessible(element: Element): void {
  // Check tabindex
  const tabIndex = element.getAttribute('tabindex')
  expect(tabIndex).not.toBe('-1')

  // Check for interactive role or tabindex
  const role = element.getAttribute('role')
  const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'radio']
  
  if (!interactiveRoles.includes(role || '')) {
    expect(tabIndex).toBe('0')
  }
}

/**
 * Check for proper ARIA labels
 * 
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<Button aria-label="Close">X</Button>)
 * expectProperLabels(getByRole('button'))
 * ```
 */
export function expectProperLabels(element: Element): void {
  const ariaLabel = element.getAttribute('aria-label')
  const ariaLabelledBy = element.getAttribute('aria-labelledby')
  const textContent = element.textContent

  expect(
    ariaLabel || ariaLabelledBy || textContent
  ).toBeTruthy()
}

/**
 * Check for proper focus management
 * 
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<Dialog open={true} />)
 * expectFocusManagement(getByRole('dialog'))
 * ```
 */
export function expectFocusManagement(container: Element): void {
  // Check for focus trap
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  expect(focusableElements.length).toBeGreaterThan(0)

  // Check first element can receive focus
  const firstElement = focusableElements[0] as HTMLElement
  expect(firstElement.tabIndex).not.toBe(-1)
}

/**
 * Check color contrast
 * 
 * @example
 * ```tsx
 * const { container } = renderWithProviders(<Button>Click</Button>)
 * await expectColorContrast(container)
 * ```
 */
export async function expectColorContrast(container: Element): Promise<void> {
  const results = await axe(container, {
    runOnly: {
      type: 'tag',
      values: ['color-contrast'],
    },
  })
  if (results.violations.length > 0) {
    throw new Error(`Color contrast violations found: ${JSON.stringify(results.violations, null, 2)}`)
  }
}
