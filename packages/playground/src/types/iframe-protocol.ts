/**
 * Type-Safe Iframe Message Protocol
 *
 * Defines a strict contract for communication between the playground
 * and the preview iframe, enabling compile-time safety and IDE support.
 */

import type { PreviewStatus } from '../contexts/PlaygroundContext'

/**
 * Console log levels supported by the playground
 */
export type LogLevel = 'log' | 'info' | 'warn' | 'error'

/**
 * Error information from the iframe
 */
export interface IframeError {
  message: string
  line?: number
  column?: number
  stack?: string | null
}

/**
 * Discriminated union of all message types from iframe to parent
 */
export type IframeMessage =
  | { type: 'playground-status'; status: PreviewStatus }
  | {
      type: 'playground-console'
      level: LogLevel
      message: string
      args: string[]
    }
  | { type: 'playground-error'; error: IframeError }
  | { type: 'playground-render-success' }

/**
 * Type guard to validate if unknown data is a valid IframeMessage
 */
export function isIframeMessage(data: unknown): data is IframeMessage {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.type !== 'string') {
    return false
  }

  switch (obj.type) {
    case 'playground-status':
      return (
        typeof obj.status === 'string' &&
        ['idle', 'compiling', 'rendering', 'success', 'error'].includes(
          obj.status
        )
      )

    case 'playground-console':
      return (
        typeof obj.level === 'string' &&
        ['log', 'info', 'warn', 'error'].includes(obj.level) &&
        typeof obj.message === 'string' &&
        Array.isArray(obj.args)
      )

    case 'playground-error':
      return (
        typeof obj.error === 'object' &&
        obj.error !== null &&
        typeof (obj.error as Record<string, unknown>).message === 'string'
      )

    case 'playground-render-success':
      return true

    default:
      return false
  }
}

/**
 * Extract the payload for a specific message type
 */
export type MessagePayload<T extends IframeMessage['type']> = Extract<
  IframeMessage,
  { type: T }
>
