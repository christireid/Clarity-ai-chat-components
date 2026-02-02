import { Message } from './types'

export interface MiddlewareContext {
  messages: Message[]
  config: any
}

export type RequestMiddleware = (
  messages: Message[]
) => Promise<Message[]> | Message[]
export type ResponseMiddleware = (
  message: Message
) => Promise<Message> | Message

export interface ChatMiddleware {
  onRequest?: RequestMiddleware
  onResponse?: ResponseMiddleware
}

// Example PII Redaction Middleware
export const piiRedactionMiddleware: ChatMiddleware = {
  onRequest: (messages) => {
    return messages.map((msg) => {
      if (msg.role === 'user') {
        // Simple regex for email and phone
        const content = msg.content
          .replace(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/g, '[EMAIL REDACTED]')
          .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]')
        return { ...msg, content }
      }
      return msg
    })
  },
}

// Logger Middleware
export const loggingMiddleware: ChatMiddleware = {
  onRequest: (messages) => {
    console.log('[SDK] Sending Messages:', messages.length)
    return messages
  },
  onResponse: (message) => {
    console.log('[SDK] Received Response:', message.id)
    return message
  },
}
