/**
 * ChatLayout Component Tests
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatLayout } from '../ChatLayout'

describe('ChatLayout', () => {
  describe('Basic rendering', () => {
    it('should render children in main area', () => {
      render(
        <ChatLayout>
          <div>Main content</div>
        </ChatLayout>
      )

      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('should render with default variant', () => {
      const { container } = render(
        <ChatLayout>
          <div>Content</div>
        </ChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'flex-col', 'h-full')
    })
  })

  describe('Header', () => {
    it('should render header when provided', () => {
      render(
        <ChatLayout header={<div>Header content</div>}>
          <div>Main</div>
        </ChatLayout>
      )

      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('should wrap header in header element', () => {
      render(
        <ChatLayout header={<span>Header text</span>}>
          <div>Main</div>
        </ChatLayout>
      )

      const header = screen.getByText('Header text').closest('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex-shrink-0', 'border-b')
    })

    it('should not render header when not provided', () => {
      const { container } = render(
        <ChatLayout>
          <div>Main</div>
        </ChatLayout>
      )

      expect(container.querySelector('header')).not.toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('should render footer when provided', () => {
      render(
        <ChatLayout footer={<div>Footer content</div>}>
          <div>Main</div>
        </ChatLayout>
      )

      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('should wrap footer in footer element', () => {
      render(
        <ChatLayout footer={<span>Footer text</span>}>
          <div>Main</div>
        </ChatLayout>
      )

      const footer = screen.getByText('Footer text').closest('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex-shrink-0', 'border-t')
    })

    it('should not render footer when not provided', () => {
      const { container } = render(
        <ChatLayout>
          <div>Main</div>
        </ChatLayout>
      )

      expect(container.querySelector('footer')).not.toBeInTheDocument()
    })
  })

  describe('Sidebar', () => {
    it('should render sidebar when provided', () => {
      render(
        <ChatLayout sidebar={<div>Sidebar content</div>}>
          <div>Main</div>
        </ChatLayout>
      )

      expect(screen.getByText('Sidebar content')).toBeInTheDocument()
    })

    it('should wrap sidebar in aside element', () => {
      render(
        <ChatLayout sidebar={<span>Sidebar text</span>}>
          <div>Main</div>
        </ChatLayout>
      )

      const aside = screen.getByText('Sidebar text').closest('aside')
      expect(aside).toBeInTheDocument()
      expect(aside).toHaveClass('flex-shrink-0', 'border-r')
    })

    it('should not render sidebar when not provided', () => {
      const { container } = render(
        <ChatLayout>
          <div>Main</div>
        </ChatLayout>
      )

      expect(container.querySelector('aside')).not.toBeInTheDocument()
    })

    it('should have default width for sidebar', () => {
      render(
        <ChatLayout sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </ChatLayout>
      )

      const aside = screen.getByText('Sidebar').closest('aside')
      expect(aside).toHaveClass('w-64')
    })
  })

  describe('Layout variants', () => {
    it('should apply split variant styles with sidebar', () => {
      const { container } = render(
        <ChatLayout variant="split" sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </ChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex-row')

      const aside = screen.getByText('Sidebar').closest('aside')
      expect(aside).toHaveClass('w-80')
    })

    it('should not apply flex-row without sidebar in split variant', () => {
      const { container } = render(
        <ChatLayout variant="split">
          <div>Main</div>
        </ChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).not.toHaveClass('flex-row')
    })

    it('should render full variant', () => {
      const { container } = render(
        <ChatLayout variant="full">
          <div>Main</div>
        </ChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('flex', 'flex-col', 'h-full')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ChatLayout className="custom-class">
          <div>Main</div>
        </ChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <ChatLayout className="my-custom-class bg-gray-100">
          <div>Main</div>
        </ChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      // Default classes should be present
      expect(wrapper).toHaveClass('flex', 'flex-col')
      // Custom classes should be added
      expect(wrapper).toHaveClass('my-custom-class', 'bg-gray-100')
    })
  })

  describe('Full layout composition', () => {
    it('should render all sections together', () => {
      render(
        <ChatLayout
          header={<div>Header</div>}
          sidebar={<div>Sidebar</div>}
          footer={<div>Footer</div>}
        >
          <div>Main content</div>
        </ChatLayout>
      )

      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should maintain correct DOM order', () => {
      const { container } = render(
        <ChatLayout
          header={<div data-testid="header">Header</div>}
          sidebar={<div data-testid="sidebar">Sidebar</div>}
          footer={<div data-testid="footer">Footer</div>}
        >
          <div data-testid="main">Main</div>
        </ChatLayout>
      )

      const elements = container.querySelectorAll('[data-testid]')
      const order = Array.from(elements).map((el) =>
        el.getAttribute('data-testid')
      )

      // Header should come first, then sidebar/main, then footer
      expect(order[0]).toBe('header')
      expect(order[order.length - 1]).toBe('footer')
    })
  })

  describe('Main content area', () => {
    it('should wrap main content in main element', () => {
      render(
        <ChatLayout>
          <span>Main text</span>
        </ChatLayout>
      )

      const main = screen.getByText('Main text').closest('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveClass('flex-1', 'overflow-hidden')
    })

    it('should render complex children', () => {
      render(
        <ChatLayout>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
            <button>Click me</button>
          </div>
        </ChatLayout>
      )

      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument()
    })
  })

  describe('displayName', () => {
    it('should have correct displayName', () => {
      expect(ChatLayout.displayName).toBe('ChatLayout')
    })
  })
})
