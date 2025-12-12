import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeBlock } from '../CodeBlock'

// Mock Shiki since it requires async loading
vi.mock('shiki', () => ({
  codeToHtml: vi
    .fn()
    .mockResolvedValue('<pre class="shiki"><code>const x = 1;</code></pre>'),
}))

// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined)

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock clipboard API for each test
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('renders code content', async () => {
      render(<CodeBlock>const x = 1;</CodeBlock>)

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument()
      })
    })

    it('renders with title', async () => {
      render(<CodeBlock title="example.ts">const x = 1;</CodeBlock>)

      await waitFor(() => {
        expect(screen.getByText('example.ts')).toBeInTheDocument()
      })
    })

    it('renders with language badge', async () => {
      render(
        <CodeBlock language="typescript" showLanguageBadge>
          const x: number = 1;
        </CodeBlock>
      )

      await waitFor(() => {
        expect(screen.getByText('TypeScript')).toBeInTheDocument()
      })
    })

    it('renders line numbers when enabled', async () => {
      render(
        <CodeBlock showLineNumbers startingLineNumber={1}>
          {'line1\nline2\nline3'}
        </CodeBlock>
      )

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
      })
    })

    it('hides line numbers by default', async () => {
      render(<CodeBlock>const x = 1;</CodeBlock>)

      await waitFor(() => {
        // Line numbers should not be present
        expect(screen.queryByText('1')).not.toBeInTheDocument()
      })
    })
  })

  describe('copy functionality', () => {
    it('renders copy button by default', async () => {
      render(<CodeBlock>const x = 1;</CodeBlock>)

      await waitFor(() => {
        expect(
          screen.getByLabelText('Copy code to clipboard')
        ).toBeInTheDocument()
      })
    })

    it('hides copy button when showCopyButton is false', async () => {
      render(<CodeBlock showCopyButton={false}>const x = 1;</CodeBlock>)

      await waitFor(() => {
        expect(
          screen.queryByLabelText('Copy code to clipboard')
        ).not.toBeInTheDocument()
      })
    })

    it('calls onCopy callback when copy button clicked', async () => {
      const user = userEvent.setup()
      const onCopy = vi.fn()
      const code = 'const x = 1;'

      render(<CodeBlock onCopy={onCopy}>{code}</CodeBlock>)

      await waitFor(async () => {
        const copyButton = screen.getByLabelText('Copy code to clipboard')
        await user.click(copyButton)
      })

      // Give time for async clipboard operation
      await waitFor(
        () => {
          expect(onCopy).toHaveBeenCalled()
        },
        { timeout: 3000 }
      )
    })
  })

  describe('expand/collapse', () => {
    it('shows expand button for long code blocks', async () => {
      const longCode = Array(20).fill('const x = 1;').join('\n')

      render(<CodeBlock maxHeight={100}>{longCode}</CodeBlock>)

      await waitFor(() => {
        expect(screen.getByText(/Show all \d+ lines/)).toBeInTheDocument()
      })
    })

    it('toggles expanded state on click', async () => {
      const user = userEvent.setup()
      const longCode = Array(20).fill('const x = 1;').join('\n')

      render(<CodeBlock maxHeight={100}>{longCode}</CodeBlock>)

      await waitFor(async () => {
        const expandButton = screen.getByText(/Show all \d+ lines/)
        await user.click(expandButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Show less')).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('has proper aria-label', async () => {
      render(
        <CodeBlock title="example.ts" language="typescript">
          const x = 1;
        </CodeBlock>
      )

      await waitFor(() => {
        const codeRegion = screen.getByRole('region')
        expect(codeRegion).toHaveAttribute(
          'aria-label',
          expect.stringContaining('example.ts')
        )
      })
    })

    it('makes code block focusable', async () => {
      render(<CodeBlock>const x = 1;</CodeBlock>)

      await waitFor(() => {
        const codeRegion = screen.getByRole('region')
        expect(codeRegion).toHaveAttribute('tabIndex', '0')
      })
    })
  })

  describe('themes', () => {
    it('applies theme data attribute', async () => {
      render(<CodeBlock theme="github-dark">const x = 1;</CodeBlock>)

      await waitFor(() => {
        const codeBlock = screen.getByRole('region').closest('.code-block')
        expect(codeBlock).toHaveAttribute('data-theme', 'github-dark')
      })
    })
  })

  describe('language detection', () => {
    it('auto-detects TypeScript', async () => {
      render(
        <CodeBlock autoDetectLanguage>
          {'interface Foo { x: number }'}
        </CodeBlock>
      )

      await waitFor(() => {
        const codeBlock = screen.getByRole('region').closest('.code-block')
        expect(codeBlock).toHaveAttribute('data-language', 'typescript')
      })
    })

    it('uses provided language over auto-detection', async () => {
      render(<CodeBlock language="python">{'def foo(): pass'}</CodeBlock>)

      await waitFor(() => {
        const codeBlock = screen.getByRole('region').closest('.code-block')
        expect(codeBlock).toHaveAttribute('data-language', 'python')
      })
    })
  })
})
