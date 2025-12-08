/**
 * Test Utilities for @clarity-chat/react
 *
 * Provides common test wrappers and utilities for testing components
 * that require context providers (ToastProvider, ThemeProvider, etc.)
 */

import React, { type ReactElement, type ReactNode } from 'react'
import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react'
import { ToastProvider } from './components/toast'

/**
 * Props for the AllProviders wrapper component
 */
interface AllProvidersProps {
  children: ReactNode
}

/**
 * Wrapper component that includes all necessary providers for testing.
 * Add additional providers here as needed.
 */
function AllProviders({ children }: AllProvidersProps): ReactElement {
  return (
    <ToastProvider position="top-right" defaultDuration={5000}>
      {children}
    </ToastProvider>
  )
}

/**
 * Custom render function that wraps components with all necessary providers.
 * Use this instead of @testing-library/react's render for components that
 * require context (e.g., components using useToast).
 *
 * @example
 * ```tsx
 * import { renderWithProviders } from '../../test-utils'
 *
 * it('should render message', () => {
 *   const { getByText } = renderWithProviders(<Message message={mockMessage} />)
 *   expect(getByText('Hello')).toBeInTheDocument()
 * })
 * ```
 */
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Create a custom wrapper with specific provider configuration.
 * Useful for tests that need non-default provider settings.
 *
 * @example
 * ```tsx
 * const CustomWrapper = createWrapper({
 *   toastPosition: 'bottom-center',
 * })
 * render(<MyComponent />, { wrapper: CustomWrapper })
 * ```
 */
interface WrapperConfig {
  toastPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  toastDuration?: number
}

function createWrapper(config: WrapperConfig = {}) {
  const { toastPosition = 'top-right', toastDuration = 5000 } = config

  return function CustomWrapper({
    children,
  }: {
    children: ReactNode
  }): ReactElement {
    return (
      <ToastProvider position={toastPosition} defaultDuration={toastDuration}>
        {children}
      </ToastProvider>
    )
  }
}

// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react'

// Export custom utilities
export { renderWithProviders, createWrapper, AllProviders }
