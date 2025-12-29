/**
 * ResizableChatLayout Component Tests
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  ResizableChatLayout,
  useResizableLayout,
} from '../resizable-chat-layout'

// Mock react-resizable-panels
vi.mock('react-resizable-panels', () => ({
  Panel: ({ children, className }: any) => (
    <div data-testid="panel" className={className}>
      {children}
    </div>
  ),
  PanelGroup: ({ children, className, direction }: any) => (
    <div
      data-testid="panel-group"
      data-direction={direction}
      className={className}
    >
      {children}
    </div>
  ),
  PanelResizeHandle: ({ className }: any) => (
    <div data-testid="resize-handle" className={className} />
  ),
}))

describe('ResizableChatLayout', () => {
  describe('Basic rendering', () => {
    it('should render children in main area', () => {
      render(
        <ResizableChatLayout>
          <div>Main content</div>
        </ResizableChatLayout>
      )

      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ResizableChatLayout className="custom-class">
          <div>Content</div>
        </ResizableChatLayout>
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
    })
  })

  describe('Header', () => {
    it('should render header when provided', () => {
      render(
        <ResizableChatLayout header={<div>Header content</div>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('should wrap header in header element', () => {
      render(
        <ResizableChatLayout header={<span>Header text</span>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      const header = screen.getByText('Header text').closest('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex-shrink-0', 'border-b')
    })

    it('should not render header when not provided', () => {
      const { container } = render(
        <ResizableChatLayout>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(container.querySelector('header')).not.toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('should render footer when provided', () => {
      render(
        <ResizableChatLayout footer={<div>Footer content</div>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('should wrap footer in footer element', () => {
      render(
        <ResizableChatLayout footer={<span>Footer text</span>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      const footer = screen.getByText('Footer text').closest('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex-shrink-0', 'border-t')
    })
  })

  describe('Sidebar', () => {
    it('should render sidebar when provided', () => {
      render(
        <ResizableChatLayout sidebar={<div>Sidebar content</div>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.getByText('Sidebar content')).toBeInTheDocument()
    })

    it('should render PanelGroup when sidebar is provided', () => {
      render(
        <ResizableChatLayout sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.getByTestId('panel-group')).toBeInTheDocument()
    })

    it('should render resize handle between panels', () => {
      render(
        <ResizableChatLayout sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.getByTestId('resize-handle')).toBeInTheDocument()
    })

    it('should not render PanelGroup when no sidebar', () => {
      render(
        <ResizableChatLayout>
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.queryByTestId('panel-group')).not.toBeInTheDocument()
    })
  })

  describe('Direction', () => {
    it('should default to horizontal direction', () => {
      render(
        <ResizableChatLayout sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </ResizableChatLayout>
      )

      const panelGroup = screen.getByTestId('panel-group')
      expect(panelGroup).toHaveAttribute('data-direction', 'horizontal')
    })

    it('should support vertical direction', () => {
      render(
        <ResizableChatLayout sidebar={<div>Sidebar</div>} direction="vertical">
          <div>Main</div>
        </ResizableChatLayout>
      )

      const panelGroup = screen.getByTestId('panel-group')
      expect(panelGroup).toHaveAttribute('data-direction', 'vertical')
    })
  })

  describe('Sidebar position', () => {
    it('should default to left sidebar', () => {
      render(
        <ResizableChatLayout
          sidebar={<div>Sidebar</div>}
          sidebarPosition="left"
        >
          <div>Main</div>
        </ResizableChatLayout>
      )

      // Just verify it renders without error
      expect(screen.getByText('Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main')).toBeInTheDocument()
    })

    it('should support right sidebar position', () => {
      render(
        <ResizableChatLayout
          sidebar={<div>Sidebar</div>}
          sidebarPosition="right"
        >
          <div>Main</div>
        </ResizableChatLayout>
      )

      expect(screen.getByText('Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main')).toBeInTheDocument()
    })
  })

  describe('Full layout composition', () => {
    it('should render all sections together', () => {
      render(
        <ResizableChatLayout
          header={<div>Header</div>}
          sidebar={<div>Sidebar</div>}
          footer={<div>Footer</div>}
        >
          <div>Main content</div>
        </ResizableChatLayout>
      )

      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Sidebar')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('displayName', () => {
    it('should have correct displayName', () => {
      expect(ResizableChatLayout.displayName).toBe('ResizableChatLayout')
    })
  })
})

describe('useResizableLayout', () => {
  it('should return layout control functions', () => {
    // This is a basic test to ensure the hook returns expected shape
    const TestComponent = () => {
      const layout = useResizableLayout()
      return (
        <div>
          <span data-testid="has-ref">{layout.ref ? 'yes' : 'no'}</span>
          <span data-testid="has-collapse">{typeof layout.collapse}</span>
          <span data-testid="has-expand">{typeof layout.expand}</span>
          <span data-testid="has-resize">{typeof layout.resize}</span>
        </div>
      )
    }

    render(<TestComponent />)

    expect(screen.getByTestId('has-collapse')).toHaveTextContent('function')
    expect(screen.getByTestId('has-expand')).toHaveTextContent('function')
    expect(screen.getByTestId('has-resize')).toHaveTextContent('function')
  })
})
