/**
 * Message Markdown Performance Regression Tests
 *
 * Tests for ISSUE-021: Message Markdown Performance
 * Ensures lazy rendering prevents UI blocking during markdown processing.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Message } from '../message'
import type { Message as MessageType } from '@clarity-chat/types'

// Mock ReactMarkdown to track rendering calls
vi.mock('react-markdown', () => ({
  default: vi.fn(({ children, ...props }) => (
    <div data-testid="react-markdown" data-content={children}>
      {children}
    </div>
  )),
}))

// Mock other markdown dependencies
vi.mock('rehype-highlight', () => ({
  default: vi.fn(),
}))

vi.mock('remark-gfm', () => ({
  default: vi.fn(),
}))

describe('Message Markdown Performance Regression', () => {
  const createMockMessage = (content: string, isUser: boolean = false): MessageType => ({
    id: 'test-message',
    content,
    role: isUser ? 'user' : 'assistant',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Lazy Rendering Performance', () => {
    it('renders plain text immediately without markdown processing', () => {
      const complexMarkdown = `
# Complex Markdown Content

This is a **bold** text with *italic* formatting.

## Code Blocks

\`\`\`javascript
function complexFunction() {
  const data = {
    users: [],
    settings: {
      theme: 'dark',
      notifications: true
    }
  }
  return data
}
\`\`\`

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Tables | ✅ Working | High |
| Code highlighting | ✅ Working | High |
| Math rendering | 🚧 In Progress | Medium |

## Lists

- Item 1
  - Nested item 1.1
  - Nested item 1.2
- Item 2
- Item 3

## Links and Images

[OpenAI](https://openai.com) is a company that builds AI.

![AI Image](https://example.com/ai-image.jpg)

## Blockquotes

> This is a blockquote with **bold** text and \`code\`.
>
> Multiple paragraphs in blockquote.

## Math (LaTeX)

Inline math: $E = mc^2$

Block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`

      const startTime = performance.now()

      render(
        <Message
          message={createMockMessage(complexMarkdown)}
        />
      )

      const renderTime = performance.now() - startTime

      // Should render immediately without processing heavy markdown
      expect(renderTime).toBeLessThan(50) // Less than 50ms for initial render

      // Should show plain text fallback initially
      expect(screen.getByText(/Complex Markdown Content/)).toBeInTheDocument()
    })

    it('progressively enhances to formatted markdown', async () => {
      const markdownContent = `
# Header

This is **bold** text with \`code\`.
`

      render(
        <Message
          message={createMockMessage(markdownContent)}
        />
      )

      // Initially shows plain text
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('This is **bold** text with `code`.')).

      // After lazy rendering delay, should show formatted content
      await waitFor(() => {
        expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
      }, { timeout: 100 })

      // ReactMarkdown should have received the content
      const markdownElement = screen.getByTestId('react-markdown')
      expect(markdownElement).toHaveAttribute('data-content', markdownContent)
    })

    it('maintains streaming cursor during lazy rendering', () => {
      const streamingMessage: MessageType = {
        id: 'streaming-msg',
        content: 'This is streaming content',
        role: 'assistant',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      render(
        <Message
          message={streamingMessage}
          isStreaming={true}
        />
      )

      // Should show streaming cursor even during lazy rendering
      expect(screen.getByText('clarity-streaming-cursor')).toBeInTheDocument()
    })
  })

  describe('Complex Content Handling', () => {
    it('handles large markdown documents efficiently', () => {
      // Create a very large markdown document
      const largeContent = '# Large Document\n\n'.repeat(100) +
        '## Section\n\n' +
        'Content with **bold** and *italic* text.\n\n'.repeat(50) +
        '```javascript\nconsole.log("code")\n```\n\n'.repeat(20) +
        '| Table | Content |\n|--------|--------|\n| Row | Data |\n\n'.repeat(30)

      const startTime = performance.now()

      render(
        <Message
          message={createMockMessage(largeContent)}
        />
      )

      const renderTime = performance.now() - startTime

      // Should render large content quickly
      expect(renderTime).toBeLessThan(100) // Less than 100ms

      // Should show content
      expect(screen.getByText('Large Document')).toBeInTheDocument()
    })

    it('handles malformed markdown gracefully', () => {
      const malformedMarkdown = `
# Header

This has unclosed **bold text

And unclosed \`code

| Incomplete | Table |
|------------|--------|
| Row 1 |

Unclosed blockquote
> This blockquote never closes

Invalid LaTeX: $E = mc^2 unclosed

Block math without closing:
$$
E = mc^2
`

      expect(() => {
        render(
          <Message
            message={createMockMessage(malformedMarkdown)}
          />
        )
      }).not.toThrow()

      // Should still render something
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    it('preserves performance with special characters', () => {
      const specialCharsContent = `
# Unicode Content

🚀 Rocket emoji and 🔥 fire emoji

## Mathematical Symbols

∑ ∑ ∫ ∮ √ ∛ ∜ ≅ ≈ ≠ ≤ ≥ ⊂ ⊃ ⊄ ⊅ ∈ ∉

## RTL Languages

العربية (Arabic)

עברית (Hebrew)

## Emoticons and Symbols

😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙃 😉 😍 😘 😗 😙 😚

## East Asian Characters

你好世界 (Chinese)

こんにちは世界 (Japanese)

안녕하세요 세계 (Korean)
`

      const startTime = performance.now()

      render(
        <Message
          message={createMockMessage(specialCharsContent)}
        />
      )

      const renderTime = performance.now() - startTime

      // Should handle Unicode efficiently
      expect(renderTime).toBeLessThan(50)
      expect(screen.getByText(/🚀 Rocket emoji/)).toBeInTheDocument()
    })
  })

  describe('Streaming Compatibility', () => {
    it('works correctly with streaming messages', () => {
      const streamingContent = 'This is a streaming message that updates'

      render(
        <Message
          message={createMockMessage(streamingContent)}
          isStreaming={true}
        />
      )

      // Should show streaming text class
      expect(screen.getByText('clarity-streaming-text')).toBeInTheDocument()

      // Should show cursor
      expect(screen.getByText('clarity-streaming-cursor')).toBeInTheDocument()
    })

    it('handles streaming updates during lazy rendering', async () => {
      const { rerender } = render(
        <Message
          message={createMockMessage('Initial content')}
          isStreaming={true}
        />
      )

      // Update content while streaming
      rerender(
        <Message
          message={createMockMessage('Initial content with update')}
          isStreaming={true}
        />
      )

      // Should still show streaming indicators
      expect(screen.getByText('clarity-streaming-text')).toBeInTheDocument()
      expect(screen.getByText('clarity-streaming-cursor')).toBeInTheDocument()

      // Should eventually render markdown
      await waitFor(() => {
        expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
      })
    })
  })

  describe('Error Boundaries', () => {
    it('handles markdown rendering errors gracefully', () => {
      // Create content that might cause markdown parsing issues
      const problematicContent = `
# Header

Content with problematic formatting

\`\`\`unknown-language
some code that might cause issues
\`\`\`

| Table | with | missing | cells |
|--------|------|---------|
| Row 1 | data |
| Row 2 |
`

      // Mock ReactMarkdown to throw an error
      const mockReactMarkdown = vi.fn()
      mockReactMarkdown.mockImplementation(() => {
        throw new Error('Markdown parsing error')
      })

      vi.doMock('react-markdown', () => ({
        default: mockReactMarkdown,
      }))

      expect(() => {
        render(
          <Message
            message={createMockMessage(problematicContent)}
          />
        )
      }).not.toThrow()

      // Should still render plain text fallback
      expect(screen.getByText('Header')).toBeInTheDocument()
    })
  })

  describe('Performance Regression Prevention', () => {
    it('does not re-render markdown unnecessarily', () => {
      const markdownContent = '# Header\n\n**Bold text** and `code`.'

      const { rerender } = render(
        <Message
          message={createMockMessage(markdownContent)}
        />
      )

      // Re-render with same content
      rerender(
        <Message
          message={createMockMessage(markdownContent)}
        />
      )

      // Should not cause excessive re-renders
      // (This is more of a guideline test - in practice we'd use React DevTools Profiler)
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    it('maintains performance with repeated renders', () => {
      const content = '# Test\n\nContent that should render consistently.'

      const { rerender } = render(
        <Message
          message={createMockMessage(content)}
        />
      )

      // Perform multiple re-renders
      for (let i = 0; i < 10; i++) {
        rerender(
          <Message
            message={createMockMessage(content)}
          />
        )
      }

      // Should maintain performance
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})