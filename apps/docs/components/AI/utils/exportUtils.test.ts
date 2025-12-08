/**
 * Export Utilities Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  escapeHtml,
  generateExportContent,
  downloadExport,
} from './exportUtils'
import type { Message } from '@clarity-chat/types'

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar')
  })

  it('escapes less than', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('escapes greater than', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b')
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#039;s')
  })

  it('converts newlines to br', () => {
    expect(escapeHtml('line1\nline2')).toBe('line1<br>line2')
  })

  it('handles multiple special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('generateExportContent', () => {
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      chatId: 'chat-1',
      role: 'user',
      content: 'Hello',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
      status: 'sent',
    },
    {
      id: 'msg-2',
      chatId: 'chat-1',
      role: 'assistant',
      content: 'Hi there!',
      createdAt: new Date('2024-01-01T10:00:01Z'),
      updatedAt: new Date('2024-01-01T10:00:01Z'),
      status: 'sent',
    },
  ]

  describe('JSON format', () => {
    it('generates valid JSON', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'json',
      })

      expect(result.mimeType).toBe('application/json')
      expect(result.extension).toBe('json')

      const parsed = JSON.parse(result.content)
      expect(parsed.sessionId).toBe('session-123')
      expect(parsed.messageCount).toBe(2)
      expect(parsed.messages).toHaveLength(2)
    })

    it('includes metadata by default', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'json',
      })
      const parsed = JSON.parse(result.content)

      expect(parsed.messages[0].status).toBeDefined()
    })

    it('excludes metadata when disabled', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'json',
        includeMetadata: false,
      })
      const parsed = JSON.parse(result.content)

      expect(parsed.messages[0].status).toBeUndefined()
    })
  })

  describe('HTML format', () => {
    it('generates valid HTML structure', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'html',
      })

      expect(result.mimeType).toBe('text/html')
      expect(result.extension).toBe('html')
      expect(result.content).toContain('<!DOCTYPE html>')
      expect(result.content).toContain('<html lang="en">')
      expect(result.content).toContain('</html>')
    })

    it('includes message content', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'html',
      })

      expect(result.content).toContain('Hello')
      expect(result.content).toContain('Hi there!')
    })

    it('escapes HTML in content', () => {
      const messagesWithHtml: Message[] = [
        {
          ...mockMessages[0],
          content: '<script>alert("xss")</script>',
        },
      ]

      const result = generateExportContent(messagesWithHtml, 'session-123', {
        format: 'html',
      })

      expect(result.content).not.toContain('<script>alert')
      expect(result.content).toContain('&lt;script&gt;')
    })

    it('applies correct CSS classes', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'html',
      })

      expect(result.content).toContain('class="message user"')
      expect(result.content).toContain('class="message assistant"')
    })
  })

  describe('Markdown format', () => {
    it('generates markdown structure', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'markdown',
      })

      expect(result.mimeType).toBe('text/markdown')
      expect(result.extension).toBe('md')
      expect(result.content).toContain('# Clarity Chat')
    })

    it('includes message content with roles', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'markdown',
      })

      expect(result.content).toContain('## You')
      expect(result.content).toContain('## Assistant')
      expect(result.content).toContain('Hello')
      expect(result.content).toContain('Hi there!')
    })

    it('uses markdown as default format', () => {
      const result = generateExportContent(mockMessages, 'session-123', {
        format: 'markdown',
      })
      expect(result.extension).toBe('md')
    })
  })
})

describe('downloadExport', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let mockAnchor: HTMLAnchorElement

  beforeEach(() => {
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:test-url')
    revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {})

    mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor)
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockAnchor)
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockAnchor)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates blob and triggers download', () => {
    const result = downloadExport({
      content: 'test content',
      mimeType: 'text/plain',
      extension: 'txt',
    })

    expect(result.success).toBe(true)
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(mockAnchor.click).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-url')
  })

  it('sets correct download filename', () => {
    downloadExport({
      content: 'test',
      mimeType: 'application/json',
      extension: 'json',
    })

    expect(mockAnchor.download).toMatch(/clarity-chat-\d+\.json/)
  })

  it('returns error when operation fails', () => {
    createObjectURLSpy.mockImplementation(() => {
      throw new Error('Blob creation failed')
    })

    const result = downloadExport({
      content: 'test',
      mimeType: 'text/plain',
      extension: 'txt',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Blob creation failed')
  })
})
