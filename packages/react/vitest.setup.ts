import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'
import { ReadableStream, TransformStream } from 'node:stream/web'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

if (typeof window !== 'undefined') {
  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  })
}

// Focus/activeElement polyfill for DOM test environments.
// Some jsdom/vm-thread configurations can fail to update document.activeElement,
// which breaks @testing-library/user-event tabbing/typing helpers.
if (typeof document !== 'undefined' && typeof HTMLElement !== 'undefined') {
  const originalActiveElementGetter =
    Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement')?.get ??
    (() => null)
  let focusedElement: Element | null = null

  Object.defineProperty(document, 'activeElement', {
    configurable: true,
    get() {
      return focusedElement ?? originalActiveElementGetter.call(document)
    },
  })

  const originalFocus = HTMLElement.prototype.focus
  const originalBlur = HTMLElement.prototype.blur

  HTMLElement.prototype.focus = function focus(options?: FocusOptions) {
    focusedElement = this
    try {
      originalFocus?.call(this, options)
    } catch {
      // ignore
    }
  }

  HTMLElement.prototype.blur = function blur() {
    if (focusedElement === this) {
      focusedElement = document.body
    }
    try {
      originalBlur?.call(this)
    } catch {
      // ignore
    }
  }
}

// Web Streams polyfills for jsdom tests (used by streaming utilities)
if (typeof (globalThis as any).ReadableStream === 'undefined') {
  Object.defineProperty(globalThis, 'ReadableStream', {
    configurable: true,
    writable: true,
    value: ReadableStream,
  })
}
if (typeof (globalThis as any).TransformStream === 'undefined') {
  Object.defineProperty(globalThis, 'TransformStream', {
    configurable: true,
    writable: true,
    value: TransformStream,
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
            const {
              animate,
              initial,
              exit,
              transition,
              whileHover,
              whileTap,
              layout,
              layoutId,
              variants,
              ...restProps
            } = props
            return React.createElement(prop, restProps, children)
          }
        }
        return target[prop as keyof typeof target]
      },
    }),
  }
})

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
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

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    writable: true,
    configurable: true,
  })
  Object.defineProperty(window, 'sessionStorage', {
    value: storageMock,
    writable: true,
    configurable: true,
  })
}
