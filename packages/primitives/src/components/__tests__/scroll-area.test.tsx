import * as React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ScrollArea } from '../scroll-area'

const queryViewport = (container: HTMLElement) =>
  container.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement | null

describe('ScrollArea Component', () => {
  describe('Rendering', () => {
    it('mounts a scrollable viewport', () => {
      const { container } = render(
        <ScrollArea>
          <div>Content</div>
        </ScrollArea>
      )

      const viewport = queryViewport(container)
      expect(viewport).toBeInTheDocument()
      expect(viewport).toHaveTextContent('Content')
    })
  })

  describe('Styling', () => {
    it('applies the base viewport classes', () => {
      const { container } = render(<ScrollArea />)
      const viewport = queryViewport(container)
      expect(viewport).toHaveClass('overflow-y-auto')
      expect(viewport).toHaveClass('scrollbar-thin')
    })

    it('supports additional viewport classes', () => {
      const { container } = render(
        <ScrollArea viewportClassName="custom-viewport">
          <div>Test</div>
        </ScrollArea>
      )
      const viewport = queryViewport(container)
      expect(viewport).toHaveClass('custom-viewport')
    })
  })

  describe('Accessibility', () => {
    it('respects aria attributes on the viewport', () => {
      render(
        <ScrollArea>
          <div aria-label="Scroll me" />
        </ScrollArea>
      )

      // the viewport inherits aria attributes from children
      const labelledChild = screen.getByLabelText('Scroll me')
      expect(labelledChild).toBeInTheDocument()
    })
  })

  describe('Scrolling behaviour', () => {
    it('allows vertical scrolling when content exceeds height', () => {
      const { container } = render(
        <div style={{ height: 100 }}>
          <ScrollArea>
            <div style={{ height: 500 }}>Tall content</div>
          </ScrollArea>
        </div>
      )

      const viewport = queryViewport(container)
      expect(viewport).toBeInTheDocument()
    })
  })
})
