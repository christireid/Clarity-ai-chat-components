import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InlineCode } from '../InlineCode'

describe('InlineCode', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<InlineCode>npm install</InlineCode>)
      expect(screen.getByText('npm install')).toBeInTheDocument()
    })

    it('renders as a code element', () => {
      render(<InlineCode>npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement.tagName).toBe('CODE')
    })

    it('applies custom className', () => {
      render(<InlineCode className="custom-class">npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveClass('custom-class')
    })
  })

  describe('variants', () => {
    it('renders default variant correctly', () => {
      render(<InlineCode variant="default">npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveClass('bg-muted/80')
    })

    it('renders subtle variant correctly', () => {
      render(<InlineCode variant="subtle">npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveClass('bg-muted/50')
    })

    it('renders highlighted variant correctly', () => {
      render(<InlineCode variant="highlighted">npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveClass('bg-primary/10')
    })
  })

  describe('ref forwarding', () => {
    it('forwards ref to code element', () => {
      const ref = { current: null } as React.RefObject<HTMLElement>
      render(<InlineCode ref={ref}>npm install</InlineCode>)
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current?.tagName).toBe('CODE')
    })
  })

  describe('props forwarding', () => {
    it('forwards additional props to code element', () => {
      render(<InlineCode data-testid="inline-code">npm install</InlineCode>)
      expect(screen.getByTestId('inline-code')).toBeInTheDocument()
    })

    it('forwards title attribute', () => {
      render(
        <InlineCode title="Package manager command">npm install</InlineCode>
      )
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveAttribute('title', 'Package manager command')
    })
  })

  describe('styling', () => {
    it('has monospace font', () => {
      render(<InlineCode>npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveClass('font-mono')
    })

    it('has rounded borders', () => {
      render(<InlineCode>npm install</InlineCode>)
      const codeElement = screen.getByText('npm install')
      expect(codeElement).toHaveClass('rounded-md')
    })
  })
})
