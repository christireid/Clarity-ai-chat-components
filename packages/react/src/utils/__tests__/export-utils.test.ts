/**
 * Tests for export utilities
 */

import { describe, it, expect } from 'vitest'
import {
  calculateAnalytics,
  redactSensitiveInfo,
  exportToJSON,
  exportToMarkdown,
  exportToText,
} from '../export-utils'

describe('calculateAnalytics', () => {
  it('calculates basic message statistics', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
      { id: '2', role: 'assistant' as const, content: 'Hi there' },
      { id: '3', role: 'user' as const, content: 'How are you?' },
    ]

    const analytics = calculateAnalytics(messages)

    expect(analytics.totalMessages).toBe(3)
    expect(analytics.userMessages).toBe(2)
    expect(analytics.assistantMessages).toBe(1)
    expect(analytics.systemMessages).toBe(0)
  })

  it('calculates average message length', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hi' }, // 2 chars
      { id: '2', role: 'assistant' as const, content: 'Hello' }, // 5 chars
    ]

    const analytics = calculateAnalytics(messages)

    expect(analytics.averageMessageLength).toBe(3.5) // (2 + 5) / 2
  })

  it('handles empty message list', () => {
    const analytics = calculateAnalytics([])

    expect(analytics.totalMessages).toBe(0)
    expect(analytics.userMessages).toBe(0)
    expect(analytics.assistantMessages).toBe(0)
    expect(isNaN(analytics.averageMessageLength)).toBe(true)
  })
})

describe('redactSensitiveInfo', () => {
  it('redacts SSN', () => {
    const text = 'My SSN is 123-45-6789'
    const redacted = redactSensitiveInfo(text)

    expect(redacted).not.toContain('123-45-6789')
    expect(redacted).toContain('[REDACTED]')
  })

  it('redacts email addresses', () => {
    const text = 'Contact me at user@example.com'
    const redacted = redactSensitiveInfo(text)

    expect(redacted).not.toContain('user@example.com')
    expect(redacted).toContain('[REDACTED]')
  })

  it('redacts phone numbers', () => {
    const text = 'Call me at 555-123-4567'
    const redacted = redactSensitiveInfo(text)

    expect(redacted).not.toContain('555-123-4567')
    expect(redacted).toContain('[REDACTED]')
  })

  it('redacts credit card numbers', () => {
    const text = 'My card is 1234567890123456'
    const redacted = redactSensitiveInfo(text)

    expect(redacted).not.toContain('1234567890123456')
    expect(redacted).toContain('[REDACTED]')
  })

  it('leaves safe text unchanged', () => {
    const text = 'This is safe text with no sensitive info'
    const redacted = redactSensitiveInfo(text)

    expect(redacted).toBe(text)
  })
})

describe('exportToJSON', () => {
  it('exports messages to JSON format', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
      { id: '2', role: 'assistant' as const, content: 'Hi' },
    ]

    const json = exportToJSON(messages, { format: 'json' })
    const parsed = JSON.parse(json)

    expect(parsed.metadata).toBeDefined()
    expect(parsed.metadata.messageCount).toBe(2)
    expect(parsed.messages).toHaveLength(2)
    expect(parsed.messages[0].content).toBe('Hello')
  })

  it('includes analytics when requested', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
    ]

    const json = exportToJSON(messages, { format: 'json', includeAnalytics: true })
    const parsed = JSON.parse(json)

    expect(parsed.analytics).toBeDefined()
    expect(parsed.analytics.totalMessages).toBe(1)
  })

  it('excludes system messages when requested', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
      { id: '2', role: 'system' as const, content: 'System message' },
    ]

    const json = exportToJSON(messages, { format: 'json', includeSystemMessages: false })
    const parsed = JSON.parse(json)

    expect(parsed.messages).toHaveLength(1)
    expect(parsed.messages[0].role).toBe('user')
  })
})

describe('exportToMarkdown', () => {
  it('exports messages to Markdown format', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
      { id: '2', role: 'assistant' as const, content: 'Hi there' },
    ]

    const markdown = exportToMarkdown(messages, { format: 'markdown' })

    expect(markdown).toContain('# Conversation Export')
    expect(markdown).toContain('👤 User')
    expect(markdown).toContain('Hello')
    expect(markdown).toContain('🤖 Assistant')
    expect(markdown).toContain('Hi there')
  })

  it('includes analytics when requested', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
    ]

    const markdown = exportToMarkdown(messages, { format: 'markdown', includeAnalytics: true })

    expect(markdown).toContain('## Analytics')
    expect(markdown).toContain('Total Messages: 1')
  })
})

describe('exportToText', () => {
  it('exports messages to plain text format', () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
      { id: '2', role: 'assistant' as const, content: 'Hi' },
    ]

    const text = exportToText(messages, { format: 'txt' })

    expect(text).toContain('CONVERSATION EXPORT')
    expect(text).toContain('[USER]')
    expect(text).toContain('Hello')
    expect(text).toContain('[ASSISTANT]')
    expect(text).toContain('Hi')
  })
})
