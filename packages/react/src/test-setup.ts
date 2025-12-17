/**
 * Test Setup for Clarity Chat React Components
 * Fixes memory issues and provides proper test environment configuration
 */

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver for lazy loading components
class IntersectionObserver {
  callback: IntersectionObserverCallback
  elements: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(element: Element) {
    this.elements.push(element)
    // Immediately trigger intersection for testing
    this.callback([{
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now()
    }], this)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter(el => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  root: Element | Document | null = null
  rootMargin: string = '0px'
  thresholds: number[] = [0]
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserver,
})

// Mock ResizeObserver for responsive components
global.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }
}

// Mock WebSocket for real-time features
global.WebSocket = class WebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  readyState = 0
  CONNECTING = 0
  OPEN = 1
  CLOSING = 2
  CLOSED = 3

  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      this.readyState = 1 // OPEN
      if (this.onopen) this.onopen(new Event('open'))
    }, 0)
  }

  send() {}
  close() {
    this.readyState = 3 // CLOSED
    if (this.onclose) this.onclose(new CloseEvent('close'))
  }

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true }

  onopen: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  url: string = ''
  binaryType: BinaryType = 'blob'
  bufferedAmount = 0
  extensions = ''
  protocol = ''
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key: string) => {
    const storage: Record<string, string> = {}
    return storage[key] || null
  }),
  setItem: vi.fn((key: string, value: string) => {
    const storage: Record<string, string> = {}
    storage[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    const storage: Record<string, string> = {}
    delete storage[key]
  }),
  clear: vi.fn(() => {
    const storage: Record<string, string> = {}
    Object.keys(storage).forEach(key => delete storage[key])
  }),
  length: 0,
  key: vi.fn((index: number) => {
    const storage: Record<string, string> = {}
    return Object.keys(storage)[index] || null
  })
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
  writable: true
})

// Mock crypto for security components
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    },
    randomUUID: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      generateKey: vi.fn(),
      importKey: vi.fn(),
      exportKey: vi.fn(),
      sign: vi.fn(),
      verify: vi.fn(),
      digest: vi.fn()
    }
  }
})

// Mock fetch for API calls
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    clone: () => global.fetch(),
    redirected: false,
    type: 'basic',
    url: '',
    body: null,
    bodyUsed: false
  } as Response)
)

// Mock navigator APIs
global.navigator = {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve(''))
  },
  userAgent: 'node.js',
  language: 'en-US',
  languages: ['en-US'],
  onLine: true,
  connection: {
    effectiveType: '4g',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  mediaDevices: {
    getUserMedia: vi.fn(() => Promise.resolve(new MediaStream())),
    enumerateDevices: vi.fn(() => Promise.resolve([]))
  },
  serviceWorker: {
    register: vi.fn(() => Promise.resolve({ scope: '' })),
    controller: null,
    ready: Promise.resolve({})
  }
} as any

// Mock document.elementFromPoint for accessibility tests
document.elementFromPoint = vi.fn(() => null)

// Mock scrollIntoView for infinite scroll components
element.prototype.scrollIntoView = vi.fn()

// Mock getBoundingClientRect for layout calculations
element.prototype.getBoundingClientRect = vi.fn(() => ({
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  top: 0,
  right: 800,
  bottom: 600,
  left: 0,
  toJSON: () => ({})
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global test utilities
global.testUtils = {
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  flushPromises: () => new Promise(resolve => setImmediate(resolve)),
  mockConsole: (method: 'log' | 'warn' | 'error' = 'error') => {
    const original = console[method]
    console[method] = vi.fn()
    return () => {
      console[method] = original
    }
  }
}

export {}