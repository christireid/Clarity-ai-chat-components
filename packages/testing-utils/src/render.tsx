/**
 * Render Utilities
 * 
 * Helper functions for rendering components in tests
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

/**
 * Wrapper component that provides all necessary contexts
 */
export function AllProviders({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/**
 * Render a component with all necessary providers
 * 
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<Button>Click me</Button>)
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Render a component and return common queries
 * 
 * @example
 * ```tsx
 * const { getButton, getInput } = renderComponent(
 *   <form>
 *     <input aria-label="Name" />
 *     <button>Submit</button>
 *   </form>
 * )
 * ```
 */
export function renderComponent(ui: ReactElement, options?: RenderOptions): RenderResult & {
  getButton: (name: string) => HTMLElement
  getInput: (label: string) => HTMLElement
  getHeading: (name: string) => HTMLElement
  getLink: (name: string) => HTMLElement
} {
  const result = renderWithProviders(ui, options)

  return {
    ...result,
    getButton: (name: string) => result.getByRole('button', { name }),
    getInput: (label: string) => result.getByLabelText(label),
    getHeading: (name: string) => result.getByRole('heading', { name }),
    getLink: (name: string) => result.getByRole('link', { name }),
  }
}

/**
 * Wait for a component to finish loading
 * 
 * @example
 * ```tsx
 * renderWithProviders(<AsyncComponent />)
 * await waitForLoad()
 * expect(screen.getByText('Loaded')).toBeInTheDocument()
 * ```
 */
export async function waitForLoad(timeout = 3000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}
