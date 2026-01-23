/**
 * Testing Helpers - Comprehensive Testing Utilities
 *
 * Complete testing toolkit for Clarity Chat components with mocks,
 * utilities, and helpers for unit, integration, and E2E testing.
 *
 * @module utils/testing-helpers
 */

import * as React from 'react'
import { vi } from 'vitest'
import type { Mock } from 'vitest'

// =============================================================================
// MOCKS AND STUBS
// =============================================================================

/**
 * Mock chat API responses
 */
export const mockChatAPI = {
  /** Successful response */
  success: (message: string = 'Hello from AI') => ({
    id: 'msg-123',
    content: message,
    role: 'assistant',
    timestamp: Date.now(),
  }),

  /** Streaming response chunks */
  streaming: (chunks: string[]) => ({
    id: 'msg-123',
    content: chunks,
    role: 'assistant',
    isStreaming: true,
  }),

  /** Error response */
  error: (message: string = 'API Error', code: string = 'INTERNAL_ERROR') => ({
    error: { message, code },
    success: false,
  }),

  /** Rate limit response */
  rateLimit: (retryAfter: number = 60) => ({
    error: {
      message: 'Rate limit exceeded',
      code: 'RATE_LIMIT',
      retryAfter,
    },
    success: false,
  }),
}

/**
 * Mock WebSocket for streaming tests
 */
export class MockWebSocket {
  onmessage?: (event: MessageEvent) => void
  onopen?: () => void
  onclose?: (event: CloseEvent) => void
  onerror?: (error: Event) => void

  readyState: number = 1 // WebSocket.OPEN
  url = 'ws://mock-chat-api.com'

  constructor(url?: string) {
    if (url) this.url = url
  }

  send(data: string) {
    // Mock send - do nothing
  }

  close() {
    this.readyState = 3 // WebSocket.CLOSED
    this.onclose?.(new CloseEvent('close'))
  }

  // Test helper methods
  simulateMessage(data: any) {
    this.onmessage?.(
      new MessageEvent('message', { data: JSON.stringify(data) })
    )
  }

  simulateOpen() {
    this.onopen?.()
  }

  simulateError(error: string) {
    this.onerror?.(new Event('error'))
  }
}

/**
 * Mock localStorage for testing
 */
export class MockLocalStorage {
  private storage = new Map<string, string>()

  getItem(key: string): string | null {
    return this.storage.get(key) || null
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value)
  }

  removeItem(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  get length(): number {
    return this.storage.size
  }

  key(index: number): string | null {
    const keys = Array.from(this.storage.keys())
    return keys[index] || null
  }
}

/**
 * Mock fetch for API testing
 */
export const createMockFetch = (responses: Record<string, any>) => {
  return vi.fn((url: string | URL, options?: RequestInit) => {
    const urlKey = typeof url === 'string' ? url : url.toString()
    const response = responses[urlKey]

    if (!response) {
      return Promise.reject(new Error(`No mock response for ${urlKey}`))
    }

    return Promise.resolve({
      ok: response.success !== false,
      status: response.success === false ? 400 : 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  })
}

// =============================================================================
// COMPONENT TESTING HELPERS
// =============================================================================

/**
 * Render ClarityChat with test-friendly defaults
 */
export function renderChatWithDefaults(props: Partial<any> = {}): {
  props: any
} {
  const defaultProps = {
    api: '/api/chat',
    onSendMessage: vi.fn(),
    messages: [],
    isLoading: false,
    ...props,
  }

  return {
    props: defaultProps,
    // In a real implementation, this would return rendered component
    // For now, just return the props for testing
  }
}

/**
 * Create test messages
 */
export const createTestMessages = {
  user: (content: string, id?: string) => ({
    id: id || `user-${Date.now()}`,
    content,
    role: 'user' as const,
    timestamp: Date.now(),
  }),

  assistant: (content: string, id?: string) => ({
    id: id || `assistant-${Date.now()}`,
    content,
    role: 'assistant' as const,
    timestamp: Date.now(),
  }),

  system: (content: string, id?: string) => ({
    id: id || `system-${Date.now()}`,
    content,
    role: 'system' as const,
    timestamp: Date.now(),
  }),

  streaming: (chunks: string[], id?: string) => ({
    id: id || `streaming-${Date.now()}`,
    content: chunks,
    role: 'assistant' as const,
    isStreaming: true,
    timestamp: Date.now(),
  }),
}

/**
 * Mock chat state for testing
 */
export function createMockChatState(initialMessages: any[] = []) {
  let messages = [...initialMessages]
  let isLoading = false
  let error: Error | null = null

  const listeners = new Set<() => void>()

  return {
    get messages() {
      return messages
    },
    get isLoading() {
      return isLoading
    },
    get error() {
      return error
    },

    setMessages: (newMessages: any[]) => {
      messages = [...newMessages]
      listeners.forEach((listener) => listener())
    },

    setLoading: (loading: boolean) => {
      isLoading = loading
      listeners.forEach((listener) => listener())
    },

    setError: (newError: Error | null) => {
      error = newError
      listeners.forEach((listener) => listener())
    },

    append: (message: any) => {
      messages = [...messages, message]
      listeners.forEach((listener) => listener())
    },

    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    reset: () => {
      messages = []
      isLoading = false
      error = null
      listeners.forEach((listener) => listener())
    },
  }
}

// =============================================================================
// HOOK TESTING HELPERS
// =============================================================================

/**
 * Test hook for useClarityChat
 */
export function createMockClarityChatHook(initialState?: Partial<any>): {
  hook: any
  state: any
  updateState: (updates: any) => void
} {
  const mockState = {
    messages: [],
    isLoading: false,
    error: null,
    append: vi.fn(),
    reload: vi.fn(),
    stop: vi.fn(),
    ...initialState,
  }

  const mockHook = vi.fn(() => mockState)

  return {
    hook: mockHook,
    state: mockState,
    updateState: (updates: Partial<typeof mockState>) => {
      Object.assign(mockState, updates)
    },
  }
}

/**
 * Test utilities for async operations
 */
export const asyncTestUtils = {
  /** Wait for next tick */
  nextTick: () => new Promise((resolve) => setTimeout(resolve, 0)),

  /** Wait for specific time */
  wait: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  /** Wait for condition to be true */
  waitFor: (condition: () => boolean, timeout = 1000) => {
    return new Promise<void>((resolve, reject) => {
      const start = Date.now()

      const check = () => {
        if (condition()) {
          resolve()
        } else if (Date.now() - start > timeout) {
          reject(new Error('Condition not met within timeout'))
        } else {
          setTimeout(check, 10)
        }
      }

      check()
    })
  },
}

// =============================================================================
// DOM TESTING HELPERS
// =============================================================================

/**
 * Test utilities for DOM interactions
 */
export const domTestUtils = {
  /** Click an element */
  click: (element: Element) => {
    const event = new MouseEvent('click', { bubbles: true })
    element.dispatchEvent(event)
  },

  /** Type text into an input */
  type: (element: HTMLInputElement | HTMLTextAreaElement, text: string) => {
    element.value = text
    element.dispatchEvent(new Event('input', { bubbles: true }))
  },

  /** Press a key */
  pressKey: (
    element: Element,
    key: string,
    options: Partial<KeyboardEventInit> = {}
  ) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...options,
    })
    element.dispatchEvent(event)
  },

  /** Focus an element */
  focus: (element: Element) => {
    if ('focus' in element && typeof element.focus === 'function') {
      element.focus()
    }
    element.dispatchEvent(new Event('focus', { bubbles: true }))
  },

  /** Blur an element */
  blur: (element: Element) => {
    if ('blur' in element && typeof element.blur === 'function') {
      element.blur()
    }
    element.dispatchEvent(new Event('blur', { bubbles: true }))
  },

  /** Wait for element to appear */
  waitForElement: (
    selector: string,
    container: Element = document.body,
    timeout = 1000
  ) => {
    return new Promise<Element>((resolve, reject) => {
      const element = container.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver(() => {
        const element = container.querySelector(selector)
        if (element) {
          observer.disconnect()
          resolve(element)
        }
      })

      observer.observe(container, { childList: true, subtree: true })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      }, timeout)
    })
  },
}

// =============================================================================
// ACCESSIBILITY TESTING HELPERS
// =============================================================================

/**
 * Accessibility testing utilities
 */
export const a11yTestUtils = {
  /** Check if element has accessible name */
  hasAccessibleName: (element: Element): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      element.querySelector('[aria-label], [aria-labelledby]')
    )
  },

  /** Check if element is keyboard accessible */
  isKeyboardAccessible: (element: Element): boolean => {
    const style = window.getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      element.getAttribute('aria-hidden') !== 'true' &&
      !element.hasAttribute('disabled')
    )
  },

  /** Get all focusable elements */
  getFocusableElements: (container: Element = document.body): Element[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]

    return Array.from(
      container.querySelectorAll(focusableSelectors.join(','))
    ).filter(a11yTestUtils.isKeyboardAccessible)
  },

  /** Test keyboard navigation */
  testKeyboardNavigation: (container: Element) => {
    const focusable = a11yTestUtils.getFocusableElements(container)
    expect(focusable.length).toBeGreaterThan(0)

    // Test tab order
    focusable.forEach((element, index) => {
      domTestUtils.pressKey(element, 'Tab')
      expect(document.activeElement).toBe(
        index < focusable.length - 1 ? focusable[index + 1] : focusable[0]
      )
    })
  },
}

// =============================================================================
// PERFORMANCE TESTING HELPERS
// =============================================================================

/**
 * Performance testing utilities
 */
export const performanceTestUtils = {
  /** Measure render time */
  measureRenderTime: async (
    component: React.ComponentType,
    props: any = {}
  ) => {
    const start = performance.now()

    // Render component (this would be implemented with testing library)
    // const { rerender } = render(<Component {...props} />)

    const end = performance.now()
    return end - start
  },

  /** Measure memory usage */
  measureMemoryUsage: () => {
    if ('memory' in performance) {
      return (performance as any).memory
    }
    return null
  },

  /** Mock performance API for testing */
  mockPerformance: () => {
    const originalPerformance = global.performance

    global.performance = {
      ...originalPerformance,
      now: vi.fn(() => Date.now()),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByName: vi.fn(() => []),
      getEntriesByType: vi.fn(() => []),
    } as any

    return () => {
      global.performance = originalPerformance
    }
  },
}

// =============================================================================
// INTEGRATION TESTING HELPERS
// =============================================================================

/**
 * End-to-end test helpers
 */
export const e2eTestUtils = {
  /** Setup test environment */
  setupTestEnvironment: () => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: new MockLocalStorage(),
      writable: true,
    })

    // Mock WebSocket
    global.WebSocket = MockWebSocket as any

    // Mock fetch
    global.fetch = createMockFetch({
      '/api/chat': mockChatAPI.success('Test response'),
    }) as any
  },

  /** Teardown test environment */
  teardownTestEnvironment: () => {
    // Restore original implementations
    delete (global as any).WebSocket
    delete (global as any).fetch
  },

  /** Test complete chat flow */
  testChatFlow: async (messages: string[]) => {
    const results = []

    for (const message of messages) {
      // Simulate sending message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
        }),
      })

      const data = await response.json()
      results.push(data)
    }

    return results
  },
}

// =============================================================================
// TEST CONFIGURATIONS
// =============================================================================

/**
 * Common test configurations
 */
export const testConfigs = {
  /** Basic chat configuration */
  basic: {
    api: '/api/chat',
    messages: [],
    isLoading: false,
  },

  /** Chat with messages */
  withMessages: {
    api: '/api/chat',
    messages: [
      createTestMessages.user('Hello'),
      createTestMessages.assistant('Hi there!'),
    ],
    isLoading: false,
  },

  /** Chat with error */
  withError: {
    api: '/api/chat',
    messages: [createTestMessages.user('Hello')],
    isLoading: false,
    error: new Error('API Error'),
  },

  /** Streaming chat */
  streaming: {
    api: '/api/chat',
    messages: [
      createTestMessages.user('Tell me a story'),
      createTestMessages.streaming(['Once', ' upon', ' a', ' time...']),
    ],
    isLoading: true,
  },

  /** Enterprise configuration */
  enterprise: {
    api: '/api/chat',
    memory: { enabled: true, strategy: 'vector-store' },
    promptOptimization: { enabled: true },
    rateLimiting: { enabled: true },
    header: { show: true, title: 'Enterprise Assistant' },
  },
}

// =============================================================================
// TEST UTILITIES
// =============================================================================

/**
 * Test wrapper component for consistent testing setup
 */
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div data-testid="test-wrapper">{children}</div>
}

/**
 * Create test component with props
 */
export function createTestComponent<P extends object>(
  Component: React.ComponentType<P>,
  defaultProps: Partial<P> = {}
) {
  return (props: Partial<P> = {}) => (
    <TestWrapper>
      <Component {...(defaultProps as P)} {...(props as P)} />
    </TestWrapper>
  )
}

/**
 * Test data factories
 */
export const testDataFactories = {
  /** Create random message ID */
  messageId: () => `msg-${Math.random().toString(36).substr(2, 9)}`,

  /** Create random chat ID */
  chatId: () => `chat-${Math.random().toString(36).substr(2, 9)}`,

  /** Create random user ID */
  userId: () => `user-${Math.random().toString(36).substr(2, 9)}`,

  /** Create random timestamp */
  timestamp: () => Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h

  /** Create random message content */
  messageContent: () => {
    const messages = [
      'Hello, how are you?',
      'Can you help me with something?',
      'What is the weather like?',
      'Tell me a joke',
      'How does this work?',
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  },
}

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Custom assertion helpers for chat components
 */
export const chatAssertions = {
  /** Assert chat has messages */
  hasMessages: (messages: any[], count?: number) => {
    expect(messages).toBeDefined()
    expect(Array.isArray(messages)).toBe(true)
    if (count !== undefined) {
      expect(messages).toHaveLength(count)
    } else {
      expect(messages.length).toBeGreaterThan(0)
    }
  },

  /** Assert message has required properties */
  isValidMessage: (message: any) => {
    expect(message).toHaveProperty('id')
    expect(message).toHaveProperty('content')
    expect(message).toHaveProperty('role')
    expect(message).toHaveProperty('timestamp')
    expect(['user', 'assistant', 'system']).toContain(message.role)
  },

  /** Assert chat is in loading state */
  isLoading: (isLoading: boolean) => {
    expect(isLoading).toBe(true)
  },

  /** Assert chat has error */
  hasError: (error: any) => {
    expect(error).toBeDefined()
    expect(error).toBeInstanceOf(Error)
  },

  /** Assert chat is streaming */
  isStreaming: (message: any) => {
    expect(message.isStreaming).toBe(true)
    expect(Array.isArray(message.content)).toBe(true)
  },
}

// =============================================================================
// EXPORT ALL HELPERS
// =============================================================================

export {
  // Re-export vitest utilities for convenience
  vi,
}

export type { Mock }
