/**
 * Test Setup
 *
 * Configuration for vitest test environment.
 */

import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock window.ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock

// Mock window.history.replaceState
Object.defineProperty(window, 'history', {
  value: {
    replaceState: () => {},
    pushState: () => {},
    state: null,
  },
  writable: true,
})
