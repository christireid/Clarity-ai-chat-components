import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.scrollTo (guarded for node-environment tests)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  })
}

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')
  return {
    ...actual,
    motion: new Proxy(actual.motion, {
      get(target, prop) {
        // For motion.div, motion.span, etc., return a component that renders without animations
        if (typeof prop === 'string') {
          return ({ children, ...props }: any) => {
            // Remove animation props
            const { animate, initial, exit, transition, whileHover, whileTap, ...restProps } = props
            return React.createElement(prop, restProps, children)
          }
        }
        return target[prop as keyof typeof target]
      },
    }),
  }
})

// Mock window.matchMedia (guarded for node-environment tests)
if (typeof window !== 'undefined') {
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
}

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
  ;(window as any).SpeechRecognition = class SpeechRecognition {
    continuous = false
    interimResults = false
    lang = 'en-US'

    start() {}
    stop() {}
    abort() {}

    addEventListener() {}
    removeEventListener() {}
  }

  ;(window as any).webkitSpeechRecognition = (window as any).SpeechRecognition
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
