/**
 * Tests for EnhancedMarkdownRenderer component
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EnhancedMarkdownRenderer } from '../ai/enhanced-markdown-renderer'

describe('EnhancedMarkdownRenderer', () => {
  it('renders basic markdown', () => {
    const content = '# Hello World\n\nThis is **bold** text.'

    render(<EnhancedMarkdownRenderer content={content} />)

    expect(screen.getByText(/Hello World/)).toBeInTheDocument()
    expect(screen.getByText(/bold/)).toBeInTheDocument()
  })

  it('renders inline code', () => {
    const content = 'Use `npm install` to install packages.'

    render(<EnhancedMarkdownRenderer content={content} />)

    expect(screen.getByText('npm install')).toBeInTheDocument()
  })

  it('renders code blocks', () => {
    const content = '```javascript\nconst x = 42;\n```'

    render(<EnhancedMarkdownRenderer content={content} config={{ enableSyntaxHighlight: true }} />)

    expect(screen.getByText(/const x = 42/)).toBeInTheDocument()
  })

  it('renders tables with GFM', () => {
    const content = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`

    render(<EnhancedMarkdownRenderer content={content} config={{ enableGFM: true }} />)

    expect(screen.getByText('Header 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
  })

  it('can disable math rendering', () => {
    const content = 'The formula $E = mc^2$ is famous.'

    render(<EnhancedMarkdownRenderer content={content} config={{ enableKaTeX: false }} />)

    // Should render as plain text when math is disabled
    expect(screen.getByText(/E = mc\^2/)).toBeInTheDocument()
  })
})
