/**
 * Test Utilities for Clarity Chat Components
 * 
 * This file provides testing utilities, custom renders, and mock providers
 * for use in component tests.
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { ThemeProvider, themes } from '../theme'
import { AnalyticsProvider } from '../analytics'
import { ErrorReporterProvider } from '../error'

/**
 * Mock Analytics Provider for testing
 */
export const MockAnalyticsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AnalyticsProvider
      config={{
        providers: [],
        enabled: false,
        autoTrack: {
          pageViews: false,
          errors: false,
        },
      }}
    >
      {children}
    </AnalyticsProvider>
  )
}

/**
 * Mock Error Reporter Provider for testing
 */
export const MockErrorReporterProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorReporterProvider
      config={{
        providers: [],
        enabled: false,
      }}
    >
      {children}
    </ErrorReporterProvider>
  )
}

/**
 * All Providers wrapper for testing
 */
export const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={themes.default}>
      <MockErrorReporterProvider>
        <MockAnalyticsProvider>
          {children}
        </MockAnalyticsProvider>
      </MockErrorReporterProvider>
    </ThemeProvider>
  )
}

/**
 * Custom render function that wraps components with all providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

/**
 * Custom render with specific theme
 */
export const renderWithTheme = (
  ui: ReactElement,
  themeName: keyof typeof themes = 'default',
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={themes[themeName]}>
      {children}
    </ThemeProvider>
  )
  
  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Mock message data for testing
 */
export const createMockMessage = (overrides = {}) => ({
  id: Math.random().toString(36).substring(7),
  role: 'user' as const,
  content: 'Test message',
  timestamp: new Date(),
  ...overrides,
})

/**
 * Mock messages array
 */
export const createMockMessages = (count: number = 3) => {
  return Array.from({ length: count }, (_, i) => 
    createMockMessage({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i + 1}`,
    })
  )
}

/**
 * Mock streaming response
 */
export const createMockStreamResponse = (text: string, chunkSize: number = 5) => {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * Mock ReadableStream for testing streaming
 */
export const createMockReadableStream = (chunks: string[]) => {
  let index = 0
  
  return new ReadableStream({
    start(controller) {
      function push() {
        if (index >= chunks.length) {
          controller.close()
          return
        }
        
        const chunk = chunks[index]
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
        index++
        
        setTimeout(push, 50) // Simulate network delay
      }
      push()
    },
  })
}

/**
 * Mock fetch for testing API calls
 */
export const mockFetch = (response: any, status: number = 200) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      body: response instanceof ReadableStream ? response : null,
    } as Response)
  )
}

/**
 * Mock IntersectionObserver for testing virtualized lists
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(public callback: IntersectionObserverCallback) {}
    observe() { return null }
    disconnect() { return null }
    unobserve() { return null }
    takeRecords() { return [] }
    get root() { return null }
    get rootMargin() { return '' }
    get thresholds() { return [] }
  } as any
}

/**
 * Mock ResizeObserver for testing responsive components
 */
export const mockResizeObserver = () => {
  global.ResizeObserver = class ResizeObserver {
    constructor(public callback: ResizeObserverCallback) {}
    observe() { return null }
    disconnect() { return null }
    unobserve() { return null }
  } as any
}

/**
 * Mock localStorage
 */
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {}
  
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value },
    removeItem: (key: string) => { delete storage[key] },
    clear: () => { Object.keys(storage).forEach(key => delete storage[key]) },
    get length() { return Object.keys(storage).length },
    key: (index: number) => Object.keys(storage)[index] || null,
  }
}

/**
 * Mock Web Speech API for voice input testing
 */
export const mockSpeechRecognition = () => {
  const SpeechRecognitionMock = class {
    continuous = false
    interimResults = false
    lang = 'en-US'
    onresult: ((event: any) => void) | null = null
    onerror: ((event: any) => void) | null = null
    onend: (() => void) | null = null
    
    start() {
      setTimeout(() => {
        if (this.onresult) {
          this.onresult({
            results: [[{ transcript: 'test transcript', confidence: 0.95 }]],
            resultIndex: 0,
          })
        }
      }, 100)
    }
    
    stop() {
      if (this.onend) this.onend()
    }
    
    abort() {}
  }
  
  ;(global as any).SpeechRecognition = SpeechRecognitionMock
  ;(global as any).webkitSpeechRecognition = SpeechRecognitionMock
}

/**
 * Wait for condition helper
 */
export const waitForCondition = async (
  condition: () => boolean,
  timeout: number = 3000,
  interval: number = 50
): Promise<void> => {
  const startTime = Date.now()
  
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition')
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }
}

/**
 * Flush promises helper
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve))

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

/**
 * Custom matchers
 */
declare global {
  namespace Vi {
    interface Matchers<R> {
      toBeAccessible(): R
    }
  }
}

// Export render with providers as default render
export { renderWithProviders as render }
