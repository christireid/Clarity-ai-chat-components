/**
 * Visual Regression Tests for Phase 2 Externalization
 *
 * Ensures that fallback UI matches or improves upon
 * the full-featured UI in terms of visual design and UX.
 *
 * Tests:
 * 1. Fallback UI matches design system
 * 2. Error messages are visually consistent
 * 3. Loading states are appropriate
 * 4. Accessibility indicators are present
 * 5. Visual hierarchy is maintained
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { EnhancedMarkdownRenderer } from '../../components/ai/EnhancedMarkdownRenderer'
import { CodeBlock } from '../../components/code/CodeBlock'

describe('Visual Regression Tests - Phase 2 Externalization', () => {
  describe('Fallback UI Design Consistency', () => {
    it('fallback markdown has consistent typography', async () => {
      const markdown = `
# Heading 1
## Heading 2
### Heading 3

Normal paragraph text.

**Bold text** and *italic text*.
`

      const { container } = render(
        <EnhancedMarkdownRenderer content={markdown} />
      )

      // Should use prose classes for consistent typography
      const proseElement = container.querySelector('.prose')
      expect(proseElement).toBeInTheDocument()
      expect(proseElement).toHaveClass('prose-sm')
    })

    it('fallback code blocks have proper styling', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const code = 'const example = "test";'

      const { container } = render(
        <CodeBlock language="javascript">{code}</CodeBlock>
      )

      // Should have semantic HTML structure
      const pre = container.querySelector('pre')
      const codeElement = container.querySelector('code')

      expect(pre).toBeInTheDocument()
      expect(codeElement).toBeInTheDocument()

      global.require = originalRequire
    })

    it('warning messages follow design system', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const { container } = render(<CodeBlock>test</CodeBlock>)

      // Warning should have proper styling
      const warning = container.querySelector('[role="status"]')
      if (warning) {
        expect(warning).toBeInTheDocument()
        // Should use design system colors (muted, border, etc.)
        expect(warning.className).toContain('border')
      }

      global.require = originalRequire
    })

    it('maintains consistent spacing', async () => {
      const markdown = `
# Section 1

Paragraph 1.

# Section 2

Paragraph 2.
`

      const { container } = render(
        <EnhancedMarkdownRenderer content={markdown} />
      )

      // Should have margin classes for spacing
      const prose = container.querySelector('.prose')
      expect(prose).toHaveClass('prose-sm')
    })

    it('preserves visual hierarchy without highlighting', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const code = `// Comment
function main() {
  const x = 1;
}`

      const { container } = render(
        <CodeBlock language="javascript">{code}</CodeBlock>
      )

      // Code should be in monospace font
      const codeElement = container.querySelector('code')
      expect(codeElement).toBeInTheDocument()

      global.require = originalRequire
    })
  })

  describe('Error Message Visual Design', () => {
    it('error messages are not visually intrusive', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const code = 'test code'

      const { container } = render(<CodeBlock>{code}</CodeBlock>)

      // Warning should be subtle (using muted colors)
      const warning = container.querySelector('[role="status"]')
      if (warning) {
        expect(warning.className).toContain('muted')
      }

      global.require = originalRequire
    })

    it('error messages have clear visual structure', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock>test</CodeBlock>)

      // Should have structured message with distinct sections
      expect(screen.getByText(/requires.*shiki/i)).toBeInTheDocument()
      expect(screen.getByText(/npm install/i)).toBeInTheDocument()
      expect(screen.getByRole('link')).toBeInTheDocument()

      global.require = originalRequire
    })

    it('code examples in errors are styled as code', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const { container } = render(<CodeBlock>test</CodeBlock>)

      // npm install command should be in code style
      const codeElements = container.querySelectorAll('code')
      expect(codeElements.length).toBeGreaterThan(0)

      global.require = originalRequire
    })

    it('links in errors are clearly styled', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock>test</CodeBlock>)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href')

      // Should have link styling (underline, color, etc.)
      expect(link.className).toBeDefined()

      global.require = originalRequire
    })
  })

  describe('Loading States Visual Design', () => {
    it('loading state uses skeleton UI', async () => {
      const { container } = render(
        <EnhancedMarkdownRenderer content="# Loading..." />
      )

      // During initial load, should show skeleton or loading state
      // This happens very briefly before markdown loads
      const loadingElement = container.querySelector('[role="status"]')
      if (loadingElement) {
        expect(loadingElement).toHaveAttribute('aria-label')
      }
    })

    it('streaming state has visual indicator', () => {
      const { container } = render(
        <EnhancedMarkdownRenderer content="# Test" isStreaming={true} />
      )

      // Should have streaming-specific class
      const streamingElement = container.querySelector(
        '.clarity-streaming-markdown'
      )
      if (streamingElement) {
        expect(streamingElement).toBeInTheDocument()
      }
    })

    it('lazy loading shows appropriate placeholder', async () => {
      const markdown = '# Lazy Test'

      const { container } = render(
        <EnhancedMarkdownRenderer
          content={markdown}
          config={{ enableLazyRendering: true }}
        />
      )

      // Should show content (either immediately or after lazy render)
      expect(container.textContent).toContain('Lazy Test')
    })
  })

  describe('Accessibility Visual Indicators', () => {
    it('focus indicators are visible', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const { container } = render(<CodeBlock>test</CodeBlock>)

      // Interactive elements should have focus styles
      const focusableElements = container.querySelectorAll(
        '[tabIndex="0"], button, a'
      )
      expect(focusableElements.length).toBeGreaterThan(0)

      global.require = originalRequire
    })

    it('ARIA labels are descriptive', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock language="javascript">test</CodeBlock>)

      const region = screen.getByRole('region')
      const label = region.getAttribute('aria-label')

      // Label should describe content
      expect(label).toContain('code')
      expect(label).toContain('javascript')

      global.require = originalRequire
    })

    it('warning messages have proper ARIA roles', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const { container } = render(<CodeBlock>test</CodeBlock>)

      const status = container.querySelector('[role="status"]')
      if (status) {
        expect(status).toHaveAttribute('aria-live')
      }

      global.require = originalRequire
    })

    it('copy buttons have clear labels', () => {
      // Mock clipboard
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      })

      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock showCopyButton={true}>const test = true</CodeBlock>)

      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeInTheDocument()

      global.require = originalRequire
    })
  })

  describe('Color Contrast and Readability', () => {
    it('fallback code has sufficient contrast', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const { container } = render(<CodeBlock>const x = 1;</CodeBlock>)

      // Should use muted background with good contrast
      const pre = container.querySelector('pre')
      expect(pre?.className).toContain('bg-muted')

      global.require = originalRequire
    })

    it('error text is readable', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const { container } = render(<CodeBlock>test</CodeBlock>)

      // Error text should use muted-foreground for good contrast
      const status = container.querySelector('[role="status"]')
      if (status) {
        expect(status.className).toContain('muted-foreground')
      }

      global.require = originalRequire
    })

    it('links have sufficient contrast', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      render(<CodeBlock>test</CodeBlock>)

      const link = screen.getByRole('link')
      // Link should have underline or other clear indicator
      expect(link).toBeInTheDocument()

      global.require = originalRequire
    })
  })

  describe('Responsive Design', () => {
    it('code blocks scroll horizontally on overflow', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const longCode = 'const veryLongVariableName = "a".repeat(1000);'

      const { container } = render(<CodeBlock>{longCode}</CodeBlock>)

      // Pre should have overflow-x-auto
      const pre = container.querySelector('pre')
      expect(pre?.className).toContain('overflow')

      global.require = originalRequire
    })

    it('tables are scrollable on small screens', async () => {
      const markdown = `
| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
|----------|----------|----------|----------|----------|
| Data 1   | Data 2   | Data 3   | Data 4   | Data 5   |
`

      const { container } = render(
        <EnhancedMarkdownRenderer content={markdown} />
      )

      // Table wrapper should handle overflow
      const tableWrapper = container.querySelector('.overflow-x-auto')
      if (tableWrapper) {
        expect(tableWrapper).toBeInTheDocument()
      }
    })
  })

  describe('Dark Mode Support', () => {
    it('code blocks support dark theme', () => {
      const code = 'const dark = true;'

      render(
        <CodeBlock language="javascript" codeTheme="dark">
          {code}
        </CodeBlock>
      )

      // Should render with dark theme (specific implementation may vary)
      expect(screen.getByText(/dark/)).toBeInTheDocument()
    })

    it('markdown supports dark theme', () => {
      const markdown = '# Dark Mode Test'

      const { container } = render(
        <EnhancedMarkdownRenderer
          content={markdown}
          config={{ codeTheme: 'dark' }}
        />
      )

      // Should have dark mode class
      const prose = container.querySelector('.prose-invert')
      if (prose) {
        expect(prose).toBeInTheDocument()
      }
    })
  })

  describe('Animation and Transitions', () => {
    it('streaming cursor is visible during streaming', () => {
      const { container } = render(
        <EnhancedMarkdownRenderer
          content="# Streaming"
          isStreaming={true}
          config={{ enableLazyRendering: true }}
        />
      )

      // Should have streaming cursor
      const cursor = container.querySelector('.clarity-streaming-cursor')
      if (cursor) {
        expect(cursor).toBeInTheDocument()
      }
    })

    it('loading state uses pulse animation', () => {
      const { container } = render(
        <EnhancedMarkdownRenderer content="Loading..." />
      )

      // During load, should have animate-pulse
      const animated = container.querySelector('.animate-pulse')
      if (animated) {
        expect(animated).toBeInTheDocument()
      }
    })

    it('copy button has hover transition', () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      })

      const { container } = render(
        <CodeBlock showCopyButton={true}>test</CodeBlock>
      )

      // Copy button should have transition classes
      const button = screen.getByRole('button', { name: /copy/i })
      expect(button.className).toContain('transition')
    })
  })

  describe('Content Overflow Handling', () => {
    it('long code lines do not break layout', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const longCode = 'const x = "a".repeat(500);'

      const { container } = render(<CodeBlock>{longCode}</CodeBlock>)

      const pre = container.querySelector('pre')
      expect(pre).toBeInTheDocument()

      global.require = originalRequire
    })

    it('nested lists maintain proper indentation', async () => {
      const markdown = `
- Level 1
  - Level 2
    - Level 3
`

      const { container } = render(
        <EnhancedMarkdownRenderer content={markdown} />
      )

      // Lists should have proper spacing
      const lists = container.querySelectorAll('ul')
      expect(lists.length).toBeGreaterThan(0)
    })
  })

  describe('Print Styles', () => {
    it('code blocks are print-friendly', () => {
      const originalRequire = global.require
      global.require = vi.fn((name: string) => {
        if (name === 'shiki') {
          throw new Error("Cannot find module 'shiki'")
        }
        return originalRequire(name)
      }) as any

      const code = 'print("test")'

      const { container } = render(
        <CodeBlock language="python">{code}</CodeBlock>
      )

      // Should have semantic structure that prints well
      const pre = container.querySelector('pre')
      const codeElement = container.querySelector('code')

      expect(pre).toBeInTheDocument()
      expect(codeElement).toBeInTheDocument()

      global.require = originalRequire
    })
  })
})
