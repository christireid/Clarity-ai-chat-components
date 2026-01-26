import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EnhancedCodeBlock } from '../EnhancedCodeBlock'

// Mock icons to avoid rendering issues
vi.mock('../icons', () => ({
  ChevronDownIcon: () => <span data-testid="icon-chevron-down" />,
  ChevronUpIcon: () => <span data-testid="icon-chevron-up" />,
  DownloadIcon: () => <span data-testid="icon-download" />,
  WrapTextIcon: () => <span data-testid="icon-wrap" />,
}))

// Mock copy button
vi.mock('../copy-button', () => ({
  CopyButton: () => <button data-testid="copy-button">Copy</button>,
}))

// Mock PrismJS via MarkdownCodeBlock
vi.mock('../message/markdown-code-block', () => ({
  MarkdownCodeBlock: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className: string
  }) => (
    <code data-testid="markdown-code-block" className={className}>
      {children}
    </code>
  ),
}))

describe('EnhancedCodeBlock', () => {
  const sampleCode = `function hello() {
  logger.debug("Hello world");
  return true;
}`

  it('renders code content', () => {
    render(<EnhancedCodeBlock code={sampleCode} />)
    expect(screen.getByTestId('markdown-code-block')).toHaveTextContent(
      sampleCode
    )
  })

  it('displays line numbers by default', () => {
    render(<EnhancedCodeBlock code={sampleCode} />)
    // 3 lines in sampleCode
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('hides line numbers when showLineNumbers is false', () => {
    render(<EnhancedCodeBlock code={sampleCode} showLineNumbers={false} />)
    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('detects language from props', () => {
    render(<EnhancedCodeBlock code={sampleCode} language="javascript" />)
    const codeBlock = screen.getByTestId('markdown-code-block')
    expect(codeBlock).toHaveClass('language-javascript')
  })

  it('shows window controls in header', () => {
    render(<EnhancedCodeBlock code={sampleCode} />)
    expect(screen.getByTestId('copy-button')).toBeInTheDocument()
    expect(screen.getByTestId('icon-download')).toBeInTheDocument()
  })

  it('handles folding interactions', () => {
    // create long code
    const longCode = Array(30).fill('line').join('\n')
    render(
      <EnhancedCodeBlock code={longCode} maxHeight={5} initiallyFolded={true} />
    )

    // Should show fold indicator
    expect(screen.getByText(/more lines/)).toBeInTheDocument()

    // Expand
    const expandButton = screen.getByTitle('Expand code')
    fireEvent.click(expandButton)

    // Should hide fold indicator
    expect(screen.queryByText(/more lines/)).not.toBeInTheDocument()
  })

  it('toggles word wrap', () => {
    render(<EnhancedCodeBlock code={sampleCode} />)
    const wrapButton = screen.getByTitle('Toggle word wrap')

    // Initial state: whitespace-pre
    const pre = screen.getByTestId('markdown-code-block').parentElement
    expect(pre).toHaveClass('whitespace-pre')

    // Toggle
    fireEvent.click(wrapButton)
    expect(pre).toHaveClass('whitespace-pre-wrap')
  })

  it('handles empty code gracefully', () => {
    render(<EnhancedCodeBlock code="" />)
    expect(screen.getByTestId('markdown-code-block')).toBeInTheDocument()
  })
})
