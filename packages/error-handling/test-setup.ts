/**
 * Vitest Test Setup for @clarity-chat/error-handling
 * Global configuration for error handling tests
 */

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock console methods to test error handling
let consoleErrorSpy: any
let consoleWarnSpy: any

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
  consoleWarnSpy.mockRestore()
})

// Export for use in tests
export { consoleErrorSpy, consoleWarnSpy }
