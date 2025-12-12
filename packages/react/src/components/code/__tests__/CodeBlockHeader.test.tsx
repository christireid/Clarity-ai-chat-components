import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CodeBlockHeader } from '../CodeBlockHeader'

describe('CodeBlockHeader', () => {
  describe('rendering', () => {
    it('renders title', () => {
      render(<CodeBlockHeader title="example.ts" />)
      expect(screen.getByText('example.ts')).toBeInTheDocument()
    })

    it('renders language badge', () => {
      render(<CodeBlockHeader language="typescript" showLanguageBadge />)
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('renders both title and language', () => {
      render(
        <CodeBlockHeader
          title="example.ts"
          language="typescript"
          showLanguageBadge
        />
      )
      expect(screen.getByText('example.ts')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('renders children', () => {
      render(
        <CodeBlockHeader>
          <button>Copy</button>
        </CodeBlockHeader>
      )
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    })

    it('renders actions', () => {
      render(<CodeBlockHeader actions={<button>Action</button>} />)
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('returns null when nothing to display', () => {
      const { container } = render(<CodeBlockHeader />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('language badge', () => {
    it('hides badge when showLanguageBadge is false', () => {
      render(
        <CodeBlockHeader language="typescript" showLanguageBadge={false} />
      )
      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument()
    })

    it('hides badge for text/plaintext languages', () => {
      render(<CodeBlockHeader language="text" showLanguageBadge />)
      expect(screen.queryByText('Plain Text')).not.toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <CodeBlockHeader title="test" className="custom-class" />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('has proper border styling', () => {
      const { container } = render(<CodeBlockHeader title="test" />)
      expect(container.firstChild).toHaveClass('border-b')
    })
  })

  describe('title truncation', () => {
    it('has title attribute for long titles', () => {
      const longTitle = 'very-long-file-name-that-should-be-truncated.tsx'
      render(<CodeBlockHeader title={longTitle} />)
      const titleElement = screen.getByText(longTitle)
      expect(titleElement).toHaveAttribute('title', longTitle)
    })
  })
})
