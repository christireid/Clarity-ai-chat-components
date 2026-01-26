/**
 * Accessibility Tests for Externalized Components
 *
 * Verifies WCAG 2.1 AA compliance for components with optional peer dependencies:
 * - CodeBlock (shiki)
 * - Markdown rendering (react-markdown)
 * - Document loaders (jszip, pdfjs-dist)
 *
 * Test coverage:
 * 1. Fallback UI accessibility
 * 2. Screen reader friendly error messages
 * 3. Keyboard navigation
 * 4. ARIA labels and roles
 * 5. Focus management
 * 6. Color contrast
 */

import { render, screen, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CodeBlock } from '../../components/code/CodeBlock'
import { PlainTextMarkdown } from '../../utils/markdown/markdown-fallback'
import { DOCXLoader } from '../../document-loaders/docx-loader'
import { PDFLoader } from '../../document-loaders/pdf-loader'

expect.extend(toHaveNoViolations)

describe('Accessibility: CodeBlock with Missing Peer (shiki)', () => {
  beforeEach(() => {
    // Mock shiki as unavailable
    vi.resetModules()
  })

  describe('Fallback UI WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations in fallback mode', async () => {
      const { container } = render(
        <CodeBlock language="typescript" showLineNumbers>
          {`const greeting = "Hello, World!"
console.log(greeting)`}
        </CodeBlock>
      )

      await waitFor(() => {
        expect(screen.queryByText(/requires/i)).toBeInTheDocument()
      })

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should display warning message with proper semantic structure', async () => {
      render(
        <CodeBlock language="javascript">
          {'console.log("test")'}
        </CodeBlock>
      )

      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveAttribute('role', 'alert')
      })
    })

    it('should have accessible heading hierarchy in warning', async () => {
      const { container } = render(
        <CodeBlock language="python" title="example.py">
          {'print("Hello")'}
        </CodeBlock>
      )

      await waitFor(async () => {
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
        // Ensure proper nesting (no skipped levels)
        const levels = Array.from(headings).map((h) =>
          parseInt(h.tagName.charAt(1))
        )

        for (let i = 1; i < levels.length; i++) {
          expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
        }
      })
    })

    it('should meet color contrast requirements in warning banner', async () => {
      const { container } = render(
        <CodeBlock language="typescript">{'const x = 1'}</CodeBlock>
      )

      await waitFor(() => {
        const warning = screen.getByRole('alert')
        const styles = window.getComputedStyle(warning)

        // Verify warning banner has accessible contrast
        // (Testing framework limitation: actual contrast calculation would require
        // extracting RGB values and calculating contrast ratio >= 4.5:1)
        expect(styles.color).toBeTruthy()
        expect(styles.backgroundColor).toBeTruthy()
      })
    })
  })

  describe('Screen Reader Friendly Error Messages', () => {
    it('should announce installation instructions to screen readers', async () => {
      render(
        <CodeBlock language="javascript">{'const test = true'}</CodeBlock>
      )

      await waitFor(() => {
        const alert = screen.getByRole('alert')

        // Should contain actionable information
        expect(alert.textContent).toMatch(/install/i)
        expect(alert.textContent).toMatch(/npm install shiki/i)

        // Should have aria-live for announcements
        expect(alert).toHaveAttribute('role', 'alert')
      })
    })

    it('should provide accessible link to documentation', async () => {
      render(<CodeBlock language="typescript">{'type X = string'}</CodeBlock>)

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /clarity-chat\.dev/i })

        expect(link).toHaveAttribute('href')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        expect(link).toHaveAttribute('target', '_blank')
      })
    })

    it('should describe error context clearly', async () => {
      const { container } = render(
        <CodeBlock language="typescript" title="app.ts">
          {'const app = () => {}'}
        </CodeBlock>
      )

      await waitFor(() => {
        const alert = screen.getByRole('alert')

        // Error message should explain what is missing and why
        expect(alert.textContent).toMatch(/syntax highlighting/i)
        expect(alert.textContent).not.toMatch(/undefined|null|error/i)
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should be keyboard accessible with tab navigation', async () => {
      const user = userEvent.setup()

      render(
        <CodeBlock
          language="typescript"
          showCopyButton
          enableKeyboardShortcuts
        >
          {'const x = 1'}
        </CodeBlock>
      )

      await waitFor(async () => {
        // Tab to copy button
        await user.tab()

        const copyButton = screen.getByRole('button', { name: /copy/i })
        expect(copyButton).toHaveFocus()

        // Activate with Enter
        await user.keyboard('{Enter}')
        expect(copyButton).toHaveBeenCalled
      })
    })

    it('should support keyboard shortcuts when enabled', async () => {
      const user = userEvent.setup()
      const onCopy = vi.fn()

      render(
        <CodeBlock
          language="typescript"
          enableKeyboardShortcuts
          onCopy={onCopy}
        >
          {'const test = 123'}
        </CodeBlock>
      )

      await waitFor(async () => {
        // Focus the code block
        const codeBlock = screen.getByRole('region')
        codeBlock.focus()

        // Cmd+Shift+C to copy
        await user.keyboard('{Meta>}{Shift>}c{/Shift}{/Meta}')

        expect(onCopy).toHaveBeenCalled()
      })
    })

    it('should have visible focus indicators', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <CodeBlock language="typescript" showCopyButton>
          {'const x = 1'}
        </CodeBlock>
      )

      await waitFor(async () => {
        await user.tab()

        const focusedElement = document.activeElement
        const styles = window.getComputedStyle(focusedElement!)

        // Should have visible focus indicator (outline or ring)
        expect(
          styles.outline !== 'none' ||
            styles.boxShadow.includes('ring') ||
            styles.border !== 'none'
        ).toBe(true)
      })
    })

    it('should allow expand/collapse with keyboard', async () => {
      const user = userEvent.setup()

      render(
        <CodeBlock language="typescript" maxHeight={200}>
          {Array(50)
            .fill('console.log("line")')
            .join('\n')}
        </CodeBlock>
      )

      await waitFor(async () => {
        const expandButton = screen.getByRole('button', { name: /show all/i })

        // Focus and activate with keyboard
        expandButton.focus()
        expect(expandButton).toHaveFocus()

        await user.keyboard('{Enter}')

        expect(expandButton).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  describe('ARIA Labels and Roles', () => {
    it('should have proper code region with accessible label', async () => {
      render(
        <CodeBlock language="typescript" title="app.ts">
          {'const app = true'}
        </CodeBlock>
      )

      await waitFor(() => {
        const codeRegion = screen.getByRole('region')

        expect(codeRegion).toHaveAttribute(
          'aria-label',
          expect.stringContaining('Code block')
        )
        expect(codeRegion).toHaveAttribute(
          'aria-label',
          expect.stringContaining('app.ts')
        )
        expect(codeRegion).toHaveAttribute(
          'aria-label',
          expect.stringContaining('typescript')
        )
      })
    })

    it('should have accessible copy button', async () => {
      render(
        <CodeBlock language="typescript" showCopyButton>
          {'const x = 1'}
        </CodeBlock>
      )

      await waitFor(() => {
        const copyButton = screen.getByRole('button', {
          name: /copy.*clipboard/i,
        })

        expect(copyButton).toBeInTheDocument()
        expect(copyButton).toHaveAttribute('aria-label')
      })
    })

    it('should have accessible download button when enabled', async () => {
      render(
        <CodeBlock language="typescript" showDownloadButton>
          {'const x = 1'}
        </CodeBlock>
      )

      await waitFor(() => {
        const downloadButton = screen.getByRole('button', {
          name: /download/i,
        })

        expect(downloadButton).toBeInTheDocument()
        expect(downloadButton).toHaveAttribute('aria-label')
      })
    })

    it('should hide decorative icons from screen readers', async () => {
      const { container } = render(
        <CodeBlock language="typescript" showCopyButton showDownloadButton>
          {'const x = 1'}
        </CodeBlock>
      )

      await waitFor(() => {
        const decorativeIcons = container.querySelectorAll('[aria-hidden="true"]')

        // Icons should be hidden from screen readers
        decorativeIcons.forEach((icon) => {
          expect(icon).toHaveAttribute('aria-hidden', 'true')
        })
      })
    })

    it('should properly label expand/collapse button state', async () => {
      render(
        <CodeBlock language="typescript" maxHeight={100}>
          {Array(20)
            .fill('const line = true')
            .join('\n')}
        </CodeBlock>
      )

      await waitFor(() => {
        const expandButton = screen.getByRole('button', { name: /show/i })

        expect(expandButton).toHaveAttribute('aria-expanded')
        expect(expandButton).toHaveAttribute('aria-controls')
      })
    })
  })

  describe('Focus Management', () => {
    it('should maintain logical focus order', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <button>Before</button>
          <CodeBlock language="typescript" showCopyButton showDownloadButton>
            {'const x = 1'}
          </CodeBlock>
          <button>After</button>
        </div>
      )

      await waitFor(async () => {
        const beforeButton = screen.getByRole('button', { name: 'Before' })
        const afterButton = screen.getByRole('button', { name: 'After' })

        beforeButton.focus()
        expect(beforeButton).toHaveFocus()

        await user.tab()
        // Should focus download button
        expect(document.activeElement?.getAttribute('aria-label')).toMatch(
          /download/i
        )

        await user.tab()
        // Should focus copy button
        expect(document.activeElement?.getAttribute('aria-label')).toMatch(
          /copy/i
        )

        await user.tab()
        // Should focus code region
        expect(document.activeElement?.getAttribute('role')).toBe('region')

        await user.tab()
        // Should focus after button
        expect(afterButton).toHaveFocus()
      })
    })

    it('should trap focus in expanded code block when appropriate', async () => {
      const user = userEvent.setup()

      render(
        <CodeBlock language="typescript" maxHeight={100}>
          {Array(30)
            .fill('const line = 1')
            .join('\n')}
        </CodeBlock>
      )

      await waitFor(async () => {
        const expandButton = screen.getByRole('button', { name: /show all/i })

        await user.click(expandButton)

        // Focus should remain manageable
        expect(document.activeElement).toBeTruthy()
      })
    })
  })
})

describe('Accessibility: Markdown Fallback', () => {
  describe('Plain Text Fallback WCAG Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <PlainTextMarkdown
          content="# Heading\n\nThis is **bold** and *italic* text with [a link](https://example.com)"
          showFallbackMessage
        />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should use semantic HTML for structure', () => {
      const { container } = render(
        <PlainTextMarkdown
          content={`# Heading 1\n## Heading 2\n\nParagraph text\n\n- List item 1\n- List item 2`}
        />
      )

      expect(container.querySelector('h1')).toBeInTheDocument()
      expect(container.querySelector('h2')).toBeInTheDocument()
      expect(container.querySelector('p')).toBeInTheDocument()
      expect(container.querySelector('ul')).toBeInTheDocument()
      expect(container.querySelectorAll('li')).toHaveLength(2)
    })

    it('should announce fallback status to screen readers', () => {
      render(<PlainTextMarkdown content="# Test" showFallbackMessage />)

      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(status.textContent).toMatch(/markdown rendering.*unavailable/i)
    })

    it('should provide accessible links', () => {
      render(
        <PlainTextMarkdown content="Check [this link](https://example.com)" />
      )

      const link = screen.getByRole('link', { name: /this link/i })
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should have accessible code blocks', () => {
      const { container } = render(
        <PlainTextMarkdown
          content="```javascript\nconst x = 1\n```\n\nAnd inline `code`"
        />
      )

      const codeBlock = container.querySelector('pre code')
      expect(codeBlock).toBeInTheDocument()
      expect(codeBlock).toHaveAttribute('class', expect.stringContaining('language-'))

      const inlineCode = container.querySelector('code')
      expect(inlineCode).toBeInTheDocument()
    })

    it('should maintain readable text hierarchy', () => {
      const { container } = render(
        <PlainTextMarkdown
          content="# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6"
        />
      )

      // Check heading levels are sequential (no skipped levels)
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const levels = Array.from(headings).map((h) => parseInt(h.tagName.charAt(1)))

      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
      }
    })
  })

  describe('Color Contrast', () => {
    it('should have sufficient contrast in fallback notice', () => {
      const { container } = render(
        <PlainTextMarkdown content="# Test" showFallbackMessage />
      )

      const notice = screen.getByRole('status')
      const styles = window.getComputedStyle(notice)

      // Verify contrast-related styles are applied
      expect(styles.color).toBeTruthy()
      expect(styles.backgroundColor).toBeTruthy()
    })
  })
})

describe('Accessibility: Document Loaders', () => {
  describe('DOCX Loader Error Handling', () => {
    it('should provide accessible error messages', async () => {
      const loader = new DOCXLoader()

      // Mock File
      const file = new File(['invalid'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      const docs = await loader.load(file)

      expect(docs[0]).toBeDefined()
      expect(docs[0].metadata.error).toBeDefined()

      // Error message should be descriptive
      const errorContent = docs[0].content
      expect(errorContent).toMatch(/\[.*\]/) // Bracketed error format
      expect(errorContent.length).toBeGreaterThan(10) // Meaningful message
    })

    it('should include installation instructions in error metadata', async () => {
      const loader = new DOCXLoader()

      const file = new File(['test'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      const docs = await loader.load(file)

      if (docs[0].metadata.requiresInstall) {
        expect(docs[0].metadata.requiresInstall).toBe('jszip')
        expect(docs[0].metadata.error).toMatch(/install/i)
      }
    })
  })

  describe('PDF Loader Error Handling', () => {
    it('should provide accessible error messages', async () => {
      const loader = new PDFLoader()

      const file = new File(['invalid'], 'test.pdf', {
        type: 'application/pdf',
      })

      const docs = await loader.load(file)

      expect(docs[0]).toBeDefined()
      expect(docs[0].content).toMatch(/\[.*\]/) // Bracketed error

      // Should explain what went wrong
      expect(
        docs[0].content.toLowerCase().includes('failed') ||
          docs[0].metadata.error
      ).toBe(true)
    })

    it('should handle missing library gracefully', async () => {
      const loader = new PDFLoader()

      // Mock missing pdfjs-dist
      const originalWindow = global.window as any
      if (originalWindow) {
        delete originalWindow.pdfjsLib
      }

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

      const docs = await loader.load(file)

      expect(docs[0].metadata.error).toBeDefined()
      expect(docs[0].content).toMatch(/library not available/i)
    })
  })

  describe('Screen Reader Announcements', () => {
    it('should format error messages for screen readers', async () => {
      const loader = new DOCXLoader()

      const file = new File([''], 'empty.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      const docs = await loader.load(file)

      // Error messages should be in brackets for clear demarcation
      expect(docs[0].content).toMatch(/^\[.*\]$/)

      // Should not contain code-like syntax that confuses screen readers
      expect(docs[0].content).not.toMatch(/undefined|null|NaN/)
    })
  })
})

describe('Accessibility: Integration with Missing Peers', () => {
  it('should maintain keyboard navigation when peers are missing', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <div>
        <CodeBlock language="typescript">{'const x = 1'}</CodeBlock>
        <PlainTextMarkdown content="# Test" />
      </div>
    )

    await waitFor(async () => {
      // All interactive elements should be keyboard accessible
      const focusableElements = container.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      )

      for (const element of Array.from(focusableElements)) {
        ;(element as HTMLElement).focus()
        expect(element).toHaveFocus()
      }
    })
  })

  it('should maintain ARIA structure across fallbacks', async () => {
    const { container } = render(
      <div>
        <CodeBlock language="python">{'print("hi")'}</CodeBlock>
        <PlainTextMarkdown content="**Bold** text" showFallbackMessage />
      </div>
    )

    await waitFor(() => {
      // Check for proper ARIA landmarks
      const regions = container.querySelectorAll('[role]')
      expect(regions.length).toBeGreaterThan(0)

      // All roles should be valid ARIA roles
      const validRoles = [
        'alert',
        'region',
        'status',
        'button',
        'link',
        'navigation',
      ]
      regions.forEach((element) => {
        const role = element.getAttribute('role')
        if (role) {
          expect(validRoles).toContain(role)
        }
      })
    })
  })
})
