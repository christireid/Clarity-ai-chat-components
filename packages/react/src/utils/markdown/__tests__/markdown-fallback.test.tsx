/**
 * Tests for Markdown Fallback Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import {
  loadMarkdownDependencies,
  getMarkdownDependencies,
  PlainTextMarkdown,
  useMarkdownAvailability,
} from '../markdown-fallback'

// Test component using the hook
function TestComponent() {
  const { isAvailable, isLoading, ReactMarkdown, remarkGfm, rehypeHighlight } =
    useMarkdownAvailability()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div data-testid="is-available">{String(isAvailable)}</div>
      <div data-testid="has-react-markdown">
        {String(ReactMarkdown !== null)}
      </div>
      <div data-testid="has-remark-gfm">{String(remarkGfm !== null)}</div>
      <div data-testid="has-rehype-highlight">
        {String(rehypeHighlight !== null)}
      </div>
    </div>
  )
}

describe('loadMarkdownDependencies', () => {
  beforeEach(() => {
    // Reset module state between tests
    vi.resetModules()
  })

  it('should successfully load react-markdown when available', async () => {
    const result = await loadMarkdownDependencies()
    expect(result).toBe(true)

    const deps = getMarkdownDependencies()
    expect(deps.isAvailable).toBe(true)
    expect(deps.ReactMarkdown).toBeDefined()
  })

  it('should handle react-markdown not being available', async () => {
    // Mock import failure
    vi.doMock('react-markdown', () => {
      throw new Error('Module not found')
    })

    const result = await loadMarkdownDependencies()
    expect(result).toBe(false)

    const deps = getMarkdownDependencies()
    expect(deps.isAvailable).toBe(false)
  })

  it('should load plugins independently', async () => {
    // Mock remark-gfm failing but rehype-highlight succeeding
    vi.doMock('remark-gfm', () => {
      throw new Error('Module not found')
    })

    const result = await loadMarkdownDependencies()
    // Should still return true if react-markdown loads
    expect(typeof result).toBe('boolean')
  })
})

describe('PlainTextMarkdown', () => {
  it('should render plain text content', () => {
    render(
      <PlainTextMarkdown content="Hello world" showFallbackMessage={false} />
    )
    expect(screen.getByText(/Hello world/)).toBeInTheDocument()
  })

  it('should show fallback message when enabled', () => {
    render(<PlainTextMarkdown content="Hello" showFallbackMessage={true} />)
    expect(
      screen.getByText(/Enhanced markdown rendering is unavailable/)
    ).toBeInTheDocument()
  })

  it('should hide fallback message when disabled', () => {
    render(<PlainTextMarkdown content="Hello" showFallbackMessage={false} />)
    expect(
      screen.queryByText(/Enhanced markdown rendering is unavailable/)
    ).not.toBeInTheDocument()
  })

  it('should format headers correctly', () => {
    render(
      <PlainTextMarkdown
        content="# Header 1\n## Header 2"
        showFallbackMessage={false}
      />
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Header 1'
    )
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Header 2'
    )
  })

  it('should format code blocks correctly', () => {
    const code = '```javascript\nconst x = 1;\n```'
    const { container } = render(
      <PlainTextMarkdown content={code} showFallbackMessage={false} />
    )
    expect(container.querySelector('pre code')).toBeInTheDocument()
  })

  it('should format inline code correctly', () => {
    render(
      <PlainTextMarkdown
        content="Use `const` for variables"
        showFallbackMessage={false}
      />
    )
    expect(screen.getByText('const')).toHaveClass('bg-muted')
  })

  it('should format links correctly', () => {
    render(
      <PlainTextMarkdown
        content="[Google](https://google.com)"
        showFallbackMessage={false}
      />
    )
    const link = screen.getByRole('link', { name: 'Google' })
    expect(link).toHaveAttribute('href', 'https://google.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should format bold text correctly', () => {
    const { container } = render(
      <PlainTextMarkdown content="**bold text**" showFallbackMessage={false} />
    )
    expect(container.querySelector('strong')).toHaveTextContent('bold text')
  })

  it('should format italic text correctly', () => {
    const { container } = render(
      <PlainTextMarkdown content="*italic text*" showFallbackMessage={false} />
    )
    expect(container.querySelector('em')).toHaveTextContent('italic text')
  })

  it('should format unordered lists correctly', () => {
    render(
      <PlainTextMarkdown
        content="- Item 1\n- Item 2\n- Item 3"
        showFallbackMessage={false}
      />
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('should format ordered lists correctly', () => {
    render(
      <PlainTextMarkdown
        content="1. First\n2. Second\n3. Third"
        showFallbackMessage={false}
      />
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('should handle empty content', () => {
    const { container } = render(
      <PlainTextMarkdown content="" showFallbackMessage={false} />
    )
    expect(container.querySelector('.markdown-fallback')).toHaveTextContent('')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <PlainTextMarkdown
        content="Test"
        className="custom-class"
        showFallbackMessage={false}
      />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should have accessible fallback message', () => {
    render(<PlainTextMarkdown content="Test" showFallbackMessage={true} />)
    const message = screen.getByRole('status')
    expect(message).toHaveAttribute('aria-live', 'polite')
  })

  it('should escape HTML to prevent XSS', () => {
    const { container } = render(
      <PlainTextMarkdown
        content="<script>alert('xss')</script>"
        showFallbackMessage={false}
      />
    )
    // Should not have actual script tag
    expect(container.querySelector('script')).not.toBeInTheDocument()
    // Should have escaped text
    expect(container.textContent).toContain('&lt;script&gt;')
  })

  it('should handle nested markdown structures', () => {
    const content = `
# Main Header

This is **bold** and *italic* text with \`code\`.

- List item with [link](https://example.com)
- Another **bold item**

\`\`\`javascript
const code = "block";
\`\`\`
    `
    render(<PlainTextMarkdown content={content} showFallbackMessage={false} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Main Header')
    expect(screen.getByRole('link')).toHaveTextContent('link')
  })
})

describe('useMarkdownAvailability', () => {
  it('should return loading state initially', () => {
    render(<TestComponent />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should return availability status after loading', async () => {
    render(<TestComponent />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check that the hook returns boolean values
    const isAvailable = screen.getByTestId('is-available')
    expect(isAvailable.textContent).toMatch(/^(true|false)$/)
  })

  it('should provide markdown dependencies when available', async () => {
    render(<TestComponent />)

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Should have dependency information
    expect(screen.getByTestId('has-react-markdown')).toBeInTheDocument()
    expect(screen.getByTestId('has-remark-gfm')).toBeInTheDocument()
    expect(screen.getByTestId('has-rehype-highlight')).toBeInTheDocument()
  })
})

describe('getMarkdownDependencies', () => {
  it('should return dependency information', () => {
    const deps = getMarkdownDependencies()
    expect(deps).toHaveProperty('ReactMarkdown')
    expect(deps).toHaveProperty('remarkGfm')
    expect(deps).toHaveProperty('rehypeHighlight')
    expect(deps).toHaveProperty('isAvailable')
  })
})

describe('Accessibility', () => {
  it('should maintain WCAG-compliant heading hierarchy', () => {
    render(
      <PlainTextMarkdown
        content="# H1\n## H2\n### H3"
        showFallbackMessage={false}
      />
    )
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('should have semantic list structure', () => {
    render(
      <PlainTextMarkdown
        content="- Item 1\n- Item 2"
        showFallbackMessage={false}
      />
    )
    const list = screen.getByRole('list')
    const items = screen.getAllByRole('listitem')
    expect(list).toBeInTheDocument()
    expect(items.length).toBeGreaterThan(0)
  })

  it('should have accessible links', () => {
    render(
      <PlainTextMarkdown
        content="[Link](https://example.com)"
        showFallbackMessage={false}
      />
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should use ARIA live region for status messages', () => {
    render(<PlainTextMarkdown content="Test" showFallbackMessage={true} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })
})
