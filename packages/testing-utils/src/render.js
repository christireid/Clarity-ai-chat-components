import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/**
 * Render Utilities
 *
 * Helper functions for rendering components in tests
 */
import { render, } from '@testing-library/react';
/**
 * Wrapper component that provides all necessary contexts
 */
export function AllProviders({ children }) {
    return _jsx(_Fragment, { children: children });
}
/**
 * Render a component with all necessary providers
 *
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<Button>Click me</Button>)
 * ```
 */
export function renderWithProviders(ui, options) {
    return render(ui, { wrapper: AllProviders, ...options });
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
export function renderComponent(ui, options) {
    const result = renderWithProviders(ui, options);
    return {
        ...result,
        getButton: (name) => result.getByRole('button', { name }),
        getInput: (label) => result.getByLabelText(label),
        getHeading: (name) => result.getByRole('heading', { name }),
        getLink: (name) => result.getByRole('link', { name }),
    };
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
export async function waitForLoad(timeout = 3000) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}
//# sourceMappingURL=render.js.map