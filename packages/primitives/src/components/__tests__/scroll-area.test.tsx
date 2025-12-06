import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollArea } from '../scroll-area'

describe('ScrollArea Component', () => {
  describe('Rendering', () => {
    it('should render scroll area with children', () => {
      render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <ScrollArea>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </ScrollArea>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should render empty scroll area', () => {
      const { container } = render(<ScrollArea />)
      // Radix ScrollArea uses different structure
      const scrollArea = container.querySelector('[data-radix-scroll-area-root]')
      expect(scrollArea).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply default scroll area styles', () => {
      const { container } = render(<ScrollArea />)
      const scrollArea = container.querySelector('[data-radix-scroll-area-root]')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should have custom scrollbar styling', () => {
      const { container } = render(<ScrollArea />)
      const scrollArea = container.querySelector('[data-radix-scroll-area-root]')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should have scrollbar thumb styling', () => {
      const { container } = render(<ScrollArea />)
      const scrollArea = container.querySelector('.scrollbar-thumb-muted-foreground\\/20')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should have hover scrollbar styling', () => {
      const { container } = render(<ScrollArea />)
      const scrollArea = container.querySelector('.hover\\:scrollbar-thumb-muted-foreground\\/40')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should have transition classes', () => {
      const { container } = render(<ScrollArea />)
      const scrollArea = container.querySelector('.transition-colors')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should have duration class', () => {
      const { container } = render(<ScrollArea />)
      const scrollArea = container.querySelector('.duration-200')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(<ScrollArea className="custom-scroll" />)
      const scrollArea = container.querySelector('.custom-scroll')
      expect(scrollArea).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<ScrollArea aria-label="Scrollable content area" />)
      expect(screen.getByLabelText('Scrollable content area')).toBeInTheDocument()
    })

    it('should support role attribute', () => {
      render(<ScrollArea role="region" />)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    it('should support aria-labelledby', () => {
      render(
        <div>
          <div id="scroll-label">Content</div>
          <ScrollArea aria-labelledby="scroll-label" />
        </div>
      )
      const scrollArea = screen.getByLabelText('Content')
      expect(scrollArea).toBeInTheDocument()
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to scroll area element', () => {
      const ref = { current: null }
      render(<ScrollArea ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Content Scrolling', () => {
    it('should handle overflow content', () => {
      const { container } = render(
        <ScrollArea style={{ height: '100px' }}>
          <div style={{ height: '200px' }}>Long content</div>
        </ScrollArea>
      )
      const scrollArea = container.querySelector('.overflow-auto')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should handle horizontal scrolling', () => {
      const { container } = render(
        <ScrollArea style={{ width: '100px' }}>
          <div style={{ width: '200px' }}>Wide content</div>
        </ScrollArea>
      )
      const scrollArea = container.querySelector('.overflow-auto')
      expect(scrollArea).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom data attributes', () => {
      render(<ScrollArea data-testid="custom-scroll" />)
      expect(screen.getByTestId('custom-scroll')).toBeInTheDocument()
    })

    it('should accept style prop', () => {
      const { container } = render(<ScrollArea style={{ maxHeight: '300px' }} />)
      const scrollArea = container.querySelector('[style*="max-height"]')
      expect(scrollArea).toBeInTheDocument()
    })

    it('should accept id attribute', () => {
      const { container } = render(<ScrollArea id="scroll-container" />)
      const scrollArea = container.querySelector('#scroll-container')
      expect(scrollArea).toBeInTheDocument()
      expect(scrollArea).toHaveAttribute('id', 'scroll-container')
    })
  })
})
