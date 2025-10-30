import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

// Note: jest-axe is optional - only import if installed
let axeMatchers: any
try {
  axeMatchers = require('jest-axe')
  if (axeMatchers && axeMatchers.toHaveNoViolations) {
    expect.extend({ toHaveNoViolations: axeMatchers.toHaveNoViolations })
  }
} catch (e) {
  // jest-axe not installed, skip accessibility matchers
  console.log('jest-axe not found - accessibility testing disabled')
}

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

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

// Mock Web Speech API (for voice input tests)
if (typeof window !== 'undefined') {
  (window as any).SpeechRecognition = class SpeechRecognition {
    continuous = false
    interimResults = false
    lang = 'en-US'
    
    start() {}
    stop() {}
    abort() {}
    
    addEventListener() {}
    removeEventListener() {}
  }
  
  (window as any).webkitSpeechRecognition = (window as any).SpeechRecognition
}

// Mock localStorage and sessionStorage
const storageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

global.localStorage = storageMock as any
global.sessionStorage = storageMock as any
