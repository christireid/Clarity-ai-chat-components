/**
 * Integration Test Setup
 * 
 * Global setup for integration tests
 */

import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Global test utilities
globalThis.IS_INTEGRATION_TEST = true
