/**
 * StreamableValue utilities - Vercel AI SDK compatible
 * 
 * Provides utilities for streaming complex data structures and UI components
 * that can be progressively rendered on the client.
 */

import type * as React from 'react'

/**
 * Streamable value wrapper for complex data streaming
 */
export interface StreamableValue<T = any> {
  readonly value: T
  readonly update: (value: T) => void
  readonly done: () => void
}

/**
 * Create a streamable value that can be updated incrementally
 */
export function createStreamableValue<T = any>(initialValue?: T): StreamableValue<T> {
  let currentValue = initialValue as T
  const listeners = new Set<(value: T) => void>()
  let isDone = false

  return {
    get value() {
      return currentValue
    },
    update(newValue: T) {
      if (isDone) {
        console.warn('StreamableValue: Cannot update after done() is called')
        return
      }
      currentValue = newValue
      listeners.forEach((listener) => listener(newValue))
    },
    done() {
      isDone = true
      listeners.clear()
    },
  }
}

/**
 * Read a streamable value from a stream
 */
export async function readStreamableValue<T = any>(
  stream: ReadableStream<Uint8Array>,
  onUpdate?: (value: T) => void
): Promise<T> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let finalValue: T | undefined

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue

        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            
            // Handle streamable value format
            if (parsed.type === 'streamable-value') {
              finalValue = parsed.value
              onUpdate?.(parsed.value)
            } else if (parsed.value !== undefined) {
              finalValue = parsed.value
              onUpdate?.(parsed.value)
            }
          } catch {
            // Non-JSON, ignore
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return finalValue as T
}

/**
 * Read streamable UI components
 */
export async function readStreamableUI(
  stream: ReadableStream<Uint8Array>,
  onUpdate?: (ui: React.ReactNode) => void
): Promise<React.ReactNode> {
  // This would integrate with React Server Components in a Next.js context
  // For now, we'll return a promise that resolves with the final UI
  return readStreamableValue(stream, onUpdate)
}

/**
 * Transform a stream into streamable values
 */
export function createStreamableValueTransformer<T = any>(
  onValue: (value: T) => void
): TransformStream<Uint8Array, Uint8Array> {
  const encoder = new TextEncoder()
  
  return new TransformStream({
    transform(chunk, controller) {
      const decoder = new TextDecoder()
      const text = decoder.decode(chunk, { stream: true })
      
      // Parse and emit streamable values
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'streamable-value' || parsed.value !== undefined) {
              onValue(parsed.value)
            }
          } catch {
            // Not JSON, pass through
          }
        }
      }
      
      // Pass through the original chunk
      controller.enqueue(chunk)
    },
  })
}
