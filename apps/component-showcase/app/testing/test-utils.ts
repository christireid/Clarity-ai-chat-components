/**
 * Testing Utilities for Clarity Chat Components
 *
 * This file contains helper functions, mock factories, and utilities
 * for testing Clarity Chat components across unit, integration, and E2E tests.
 */

import { faker } from '@faker-js/faker'
import { vi } from 'vitest'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Tool {
  id: string
  name: string
  description: string
  parameters?: Record<string, unknown>
}

export interface ToolExecution {
  toolId: string
  status: 'pending' | 'running' | 'success' | 'error'
  result?: unknown
  error?: string
}

// ============================================================================
// Mock Factories
// ============================================================================

/**
 * Generate a mock message
 */
export function createMockMessage(overrides?: Partial<Message>): Message {
  return {
    id: faker.string.uuid(),
    role: faker.helpers.arrayElement(['user', 'assistant', 'system']),
    content: faker.lorem.paragraph(),
    timestamp: faker.date.recent(),
    ...overrides,
  }
}

/**
 * Generate multiple mock messages
 */
export function createMockMessages(count: number = 5): Message[] {
  return Array.from({ length: count }, () => createMockMessage())
}

/**
 * Generate a mock conversation
 */
export function createMockConversation(
  overrides?: Partial<Conversation>
): Conversation {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    messages: createMockMessages(faker.number.int({ min: 3, max: 10 })),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    userId: faker.string.uuid(),
    ...overrides,
  }
}

/**
 * Generate a mock user
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    ...overrides,
  }
}

/**
 * Generate a mock tool
 */
export function createMockTool(overrides?: Partial<Tool>): Tool {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'search',
      'calculator',
      'weather',
      'database_query',
    ]),
    description: faker.lorem.sentence(),
    parameters: {
      query: faker.lorem.words(3),
    },
    ...overrides,
  }
}

/**
 * Generate a mock tool execution
 */
export function createMockToolExecution(
  overrides?: Partial<ToolExecution>
): ToolExecution {
  return {
    toolId: faker.string.uuid(),
    status: faker.helpers.arrayElement(['pending', 'running', 'success', 'error']),
    result: { data: faker.lorem.paragraph() },
    ...overrides,
  }
}

// ============================================================================
// Streaming Utilities
// ============================================================================

/**
 * Generate streaming message chunks
 */
export function* createStreamingMessage(
  message: string,
  chunkSize: number = 10
): Generator<string> {
  for (let i = 0; i < message.length; i += chunkSize) {
    yield message.slice(i, i + chunkSize)
  }
}

/**
 * Create a mock streaming response
 */
export function createMockStreamingResponse(chunks: string[]) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
      })
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

// ============================================================================
// API Mock Utilities
// ============================================================================

/**
 * Mock API response
 */
export function createMockAPIResponse<T>(
  data: T,
  overrides?: Partial<Response>
) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
    ...overrides,
  } as Response
}

/**
 * Mock API error response
 */
export function createMockAPIError(
  status: number = 500,
  message: string = 'Internal Server Error'
) {
  return {
    ok: false,
    status,
    json: async () => ({ error: message }),
    text: async () => JSON.stringify({ error: message }),
  } as Response
}

/**
 * Mock fetch with custom handler
 */
export function mockFetch(handler: (url: string, init?: RequestInit) => Response) {
  global.fetch = vi.fn().mockImplementation(handler)
}

/**
 * Mock successful chat API call
 */
export function mockChatAPISuccess(response: string) {
  mockFetch(() =>
    createMockAPIResponse({
      content: response,
      role: 'assistant',
    })
  )
}

/**
 * Mock failed chat API call
 */
export function mockChatAPIError(status: number = 500) {
  mockFetch(() => createMockAPIError(status))
}

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now()
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition')
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

/**
 * Simulate typing in an input
 */
export async function simulateTyping(
  element: HTMLInputElement,
  text: string,
  delay: number = 50
): Promise<void> {
  for (const char of text) {
    element.value += char
    element.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

/**
 * Simulate file upload
 */
export function createMockFile(
  name: string = 'test.txt',
  content: string = 'test content',
  type: string = 'text/plain'
): File {
  return new File([content], name, { type })
}

/**
 * Create mock FileList
 */
export function createMockFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file
      }
    },
  }

  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, {
      value: file,
      enumerable: true,
    })
  })

  return fileList as FileList
}

// ============================================================================
// Accessibility Test Utilities
// ============================================================================

/**
 * Check if element has ARIA label
 */
export function hasAriaLabel(element: HTMLElement): boolean {
  return (
    element.hasAttribute('aria-label') ||
    element.hasAttribute('aria-labelledby')
  )
}

/**
 * Check if element is keyboard navigable
 */
export function isKeyboardNavigable(element: HTMLElement): boolean {
  return element.tabIndex >= 0 || element.hasAttribute('tabindex')
}

/**
 * Check if element has proper role
 */
export function hasProperRole(element: HTMLElement, expectedRole: string): boolean {
  const role = element.getAttribute('role') || element.tagName.toLowerCase()
  return role === expectedRole
}

/**
 * Get all focusable elements in container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return Array.from(container.querySelectorAll(selector))
}

/**
 * Simulate keyboard navigation
 */
export async function simulateKeyboardNavigation(
  container: HTMLElement,
  key: 'Tab' | 'Enter' | 'Space' | 'Escape' | 'ArrowUp' | 'ArrowDown'
): Promise<void> {
  const focusableElements = getFocusableElements(container)
  const currentIndex = focusableElements.findIndex(
    (el) => el === document.activeElement
  )

  if (key === 'Tab') {
    const nextIndex = (currentIndex + 1) % focusableElements.length
    focusableElements[nextIndex]?.focus()
  } else if (key === 'Enter' || key === 'Space') {
    ;(document.activeElement as HTMLElement)?.click()
  }

  // Dispatch keyboard event
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  })
  document.activeElement?.dispatchEvent(event)
}

// ============================================================================
// Performance Test Utilities
// ============================================================================

/**
 * Measure render time
 */
export async function measureRenderTime(
  renderFn: () => void
): Promise<number> {
  const start = performance.now()
  renderFn()
  await new Promise((resolve) => requestAnimationFrame(resolve))
  return performance.now() - start
}

/**
 * Measure multiple renders and get average
 */
export async function measureAverageRenderTime(
  renderFn: () => void,
  iterations: number = 10
): Promise<{ avg: number; min: number; max: number }> {
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const time = await measureRenderTime(renderFn)
    times.push(time)
  }

  return {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
  }
}

// ============================================================================
// Snapshot Test Utilities
// ============================================================================

/**
 * Create stable snapshot data (removes timestamps, IDs)
 */
export function createStableSnapshot(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(createStableSnapshot)
  }

  if (data && typeof data === 'object') {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(data)) {
      if (key === 'id' || key === 'timestamp' || key.includes('Date')) {
        result[key] = 'STABLE_VALUE'
      } else {
        result[key] = createStableSnapshot(value)
      }
    }

    return result
  }

  return data
}

// ============================================================================
// Debug Utilities
// ============================================================================

/**
 * Pretty print component tree
 */
export function debugComponentTree(container: HTMLElement, indent: number = 0): void {
  const prefix = '  '.repeat(indent)
  console.log(`${prefix}${container.tagName} ${container.className}`)

  Array.from(container.children).forEach((child) => {
    debugComponentTree(child as HTMLElement, indent + 1)
  })
}

/**
 * Log all event listeners
 */
export function debugEventListeners(element: HTMLElement): void {
  const events = ['click', 'keydown', 'input', 'change', 'submit']

  events.forEach((event) => {
    const listeners = (element as any).getEventListeners?.(event) || []
    if (listeners.length > 0) {
      console.log(`${event}: ${listeners.length} listener(s)`)
    }
  })
}

// ============================================================================
// Export commonly used testing library utilities
// ============================================================================

export { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
export { axe, toHaveNoViolations } from 'jest-axe'
