/**
 * PreviewMessage Component Tests
 *
 * Critical: Tests for the streaming cursor animation fix (DURATION_SECONDS.slower)
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as React from 'react'
import { PreviewMessage } from '../components/PreviewMessage'
import type { PreviewMessage as PreviewMessageType } from '../types'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.PropsWithChildren<{ className?: string }>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    span: ({
      children,
      className,
      ...props
    }: React.PropsWithChildren<{ className?: string }>) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
}))

describe('PreviewMessage', () => {
  const baseMessage: PreviewMessageType = {
    id: 'test-1',
    role: 'user',
    content: 'Hello world',
    isCompiled: true,
    timestamp: new Date(),
  }

  describe('Rendering', () => {
    it('should render user message correctly', () => {
      render(<PreviewMessage message={baseMessage} />)

      expect(screen.getByText('Hello world')).toBeInTheDocument()
      expect(screen.getByText('USER')).toBeInTheDocument()
      expect(screen.getByText('👤')).toBeInTheDocument()
    })

    it('should render system message correctly', () => {
      const systemMessage: PreviewMessageType = {
        ...baseMessage,
        role: 'system',
        content: 'System instructions',
      }

      render(<PreviewMessage message={systemMessage} />)

      expect(screen.getByText('System instructions')).toBeInTheDocument()
      expect(screen.getByText('SYSTEM')).toBeInTheDocument()
      expect(screen.getByText('⚙️')).toBeInTheDocument()
    })

    it('should render assistant message correctly', () => {
      const assistantMessage: PreviewMessageType = {
        ...baseMessage,
        role: 'assistant',
        content: 'AI response',
      }

      render(<PreviewMessage message={assistantMessage} />)

      expect(screen.getByText('AI response')).toBeInTheDocument()
      expect(screen.getByText('ASSISTANT')).toBeInTheDocument()
      expect(screen.getByText('🤖')).toBeInTheDocument()
    })
  })

  describe('Streaming', () => {
    it('should display streaming content when streaming', () => {
      render(
        <PreviewMessage
          message={baseMessage}
          isStreaming={true}
          streamingContent="Partial content..."
        />
      )

      expect(screen.getByText('Partial content...')).toBeInTheDocument()
    })

    it('should show streaming cursor when streaming', () => {
      const { container } = render(
        <PreviewMessage
          message={baseMessage}
          isStreaming={true}
          streamingContent="Streaming..."
        />
      )

      // The cursor should be rendered (mocked as span)
      const cursor = container.querySelector('span.inline-block.w-2.h-4')
      expect(cursor).toBeInTheDocument()
    })

    it('should not show cursor when not streaming', () => {
      const { container } = render(
        <PreviewMessage message={baseMessage} isStreaming={false} />
      )

      // The cursor should NOT be rendered
      const cursor = container.querySelector('span.inline-block.w-2.h-4')
      expect(cursor).not.toBeInTheDocument()
    })
  })

  describe('Content display', () => {
    it('should preserve whitespace in content', () => {
      const messageWithWhitespace: PreviewMessageType = {
        ...baseMessage,
        content: 'Line 1\n\nLine 2\n  Indented',
      }

      const { container } = render(
        <PreviewMessage message={messageWithWhitespace} />
      )

      // Check for whitespace-pre-wrap class
      const contentDiv = container.querySelector('.whitespace-pre-wrap')
      expect(contentDiv).toBeInTheDocument()
    })
  })
})
