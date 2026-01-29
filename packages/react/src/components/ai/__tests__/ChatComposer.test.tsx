/**
 * Comprehensive Test Suite for ChatComposer Component
 *
 * Tests layout rendering, slot composition, feature toggling,
 * accessibility, and interactions.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import {
  ChatComposer,
  useChatComposer,
  useIsChatComposerChild,
  useChatComposerBuilder,
  MinimalChat,
  StandardChat,
  AgentChat,
  FullscreenChat,
  type ChatComposerProps,
  type ChatComposerLayout,
  type ChatComposerFeature,
} from '../ChatComposer'

expect.extend(toHaveNoViolations)

// ============================================================================
// Mock framer-motion to avoid animation issues in tests
// ============================================================================

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div {...props} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

// ============================================================================
// Test Components
// ============================================================================

function TestComponent() {
  const context = useChatComposer()
  return (
    <div data-testid="test-component">
      <div data-testid="layout">{context.layout}</div>
      <div data-testid="variant">{context.variant}</div>
      <div data-testid="feature-thinking">{context.hasFeature('thinking') ? 'yes' : 'no'}</div>
      <div data-testid="sidebar-open">{context.sidebarOpen ? 'yes' : 'no'}</div>
      <button onClick={context.toggleSidebar} data-testid="toggle-sidebar">
        Toggle
      </button>
    </div>
  )
}

function ChildChecker() {
  const isChild = useIsChatComposerChild()
  return <div data-testid="child-checker">{isChild ? 'inside' : 'outside'}</div>
}

// ============================================================================
// Layout Rendering Tests
// ============================================================================

describe('ChatComposer - Layout Rendering', () => {
  test('renders standard layout', () => {
    const { container } = render(
      <ChatComposer layout="standard">
        <ChatComposer.Header>Header</ChatComposer.Header>
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Header')
    expect(container).toHaveTextContent('Messages')
    expect(container).toHaveTextContent('Input')
    expect(container.querySelector('[data-layout="standard"]')).toBeInTheDocument()
  })

  test('renders split-panel layout', () => {
    const { container } = render(
      <ChatComposer layout="split-panel">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Sidebar>Sidebar</ChatComposer.Sidebar>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Messages')
    expect(container).toHaveTextContent('Sidebar')
    expect(container.querySelector('[data-layout="split-panel"]')).toBeInTheDocument()
  })

  test('renders minimal layout', () => {
    const { container } = render(
      <ChatComposer layout="minimal">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container.querySelector('[data-layout="minimal"]')).toBeInTheDocument()
  })

  test('renders fullscreen layout', () => {
    const { container } = render(
      <ChatComposer layout="fullscreen">
        <ChatComposer.Header>Header</ChatComposer.Header>
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container.querySelector('[data-layout="fullscreen"]')).toBeInTheDocument()
  })

  test('renders embedded layout', () => {
    const { container } = render(
      <ChatComposer layout="embedded">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container.querySelector('[data-layout="embedded"]')).toBeInTheDocument()
  })
})

// ============================================================================
// Slot Composition Tests
// ============================================================================

describe('ChatComposer - Slot Composition', () => {
  test('header slot registers and renders', () => {
    const { container } = render(
      <ChatComposer>
        <ChatComposer.Header>Test Header</ChatComposer.Header>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Test Header')
    expect(container.querySelector('.chat-composer-slot-header')).toBeInTheDocument()
  })

  test('multiple slots compose correctly', () => {
    const { container } = render(
      <ChatComposer layout="standard">
        <ChatComposer.Header>Header Content</ChatComposer.Header>
        <ChatComposer.Messages>Messages Content</ChatComposer.Messages>
        <ChatComposer.Thinking>Thinking Content</ChatComposer.Thinking>
        <ChatComposer.Tools>Tools Content</ChatComposer.Tools>
        <ChatComposer.Suggestions>Suggestions Content</ChatComposer.Suggestions>
        <ChatComposer.Input>Input Content</ChatComposer.Input>
        <ChatComposer.Footer>Footer Content</ChatComposer.Footer>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Header Content')
    expect(container).toHaveTextContent('Messages Content')
    expect(container).toHaveTextContent('Input Content')
    expect(container).toHaveTextContent('Footer Content')
  })

  test('slot content updates when props change', async () => {
    const { rerender, container } = render(
      <ChatComposer>
        <ChatComposer.Messages>Old Messages</ChatComposer.Messages>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Old Messages')

    rerender(
      <ChatComposer>
        <ChatComposer.Messages>New Messages</ChatComposer.Messages>
      </ChatComposer>
    )

    await waitFor(() => {
      expect(container).toHaveTextContent('New Messages')
    })
  })

  test('sidebar slot position prop works', () => {
    const { container } = render(
      <ChatComposer>
        <ChatComposer.Sidebar position="left">Left Sidebar</ChatComposer.Sidebar>
      </ChatComposer>
    )

    const sidebar = container.querySelector('.chat-composer-slot-sidebar')
    expect(sidebar).toHaveClass('position-left')
  })

  test('messages slot with auto-scroll prop', () => {
    const { container } = render(
      <ChatComposer>
        <ChatComposer.Messages autoScroll={true}>
          Messages
        </ChatComposer.Messages>
      </ChatComposer>
    )

    expect(container.querySelector('[data-auto-scroll="true"]')).toBeInTheDocument()
  })
})

// ============================================================================
// Feature Toggle Tests
// ============================================================================

describe('ChatComposer - Feature Toggling', () => {
  test('features are disabled by default when not specified', () => {
    const { container } = render(
      <ChatComposer features={[]}>
        <ChatComposer.Thinking>Thinking</ChatComposer.Thinking>
      </ChatComposer>
    )

    expect(container).not.toHaveTextContent('Thinking')
  })

  test('thinking feature can be enabled', () => {
    const { container } = render(
      <ChatComposer features={['thinking']}>
        <ChatComposer.Thinking>Thinking Content</ChatComposer.Thinking>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Thinking Content')
  })

  test('tools feature can be enabled', () => {
    const { container } = render(
      <ChatComposer features={['tools']}>
        <ChatComposer.Tools>Tools Content</ChatComposer.Tools>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Tools Content')
  })

  test('suggestions feature can be enabled', () => {
    const { container } = render(
      <ChatComposer features={['suggestions']}>
        <ChatComposer.Suggestions>Suggestions Content</ChatComposer.Suggestions>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Suggestions Content')
  })

  test('multiple features work together', () => {
    const { container } = render(
      <ChatComposer features={['thinking', 'tools', 'suggestions']}>
        <ChatComposer.Thinking>Thinking</ChatComposer.Thinking>
        <ChatComposer.Tools>Tools</ChatComposer.Tools>
        <ChatComposer.Suggestions>Suggestions</ChatComposer.Suggestions>
      </ChatComposer>
    )

    expect(container).toHaveTextContent('Thinking')
    expect(container).toHaveTextContent('Tools')
    expect(container).toHaveTextContent('Suggestions')
  })
})

// ============================================================================
// Context Tests
// ============================================================================

describe('ChatComposer - Context', () => {
  test('context provides layout information', () => {
    render(
      <ChatComposer layout="split-panel">
        <TestComponent />
      </ChatComposer>
    )

    expect(screen.getByTestId('layout')).toHaveTextContent('split-panel')
  })

  test('context provides variant information', () => {
    render(
      <ChatComposer variant="compact">
        <TestComponent />
      </ChatComposer>
    )

    expect(screen.getByTestId('variant')).toHaveTextContent('compact')
  })

  test('context hasFeature method works', () => {
    render(
      <ChatComposer features={['thinking']}>
        <TestComponent />
      </ChatComposer>
    )

    expect(screen.getByTestId('feature-thinking')).toHaveTextContent('yes')
  })

  test('sidebar toggle works', async () => {
    const user = userEvent.setup()
    render(
      <ChatComposer defaultSidebarOpen={true}>
        <TestComponent />
      </ChatComposer>
    )

    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('yes')

    await user.click(screen.getByTestId('toggle-sidebar'))

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('no')
    })
  })

  test('useIsChatComposerChild returns correct value', () => {
    render(
      <ChatComposer>
        <ChildChecker />
      </ChatComposer>
    )

    expect(screen.getByTestId('child-checker')).toHaveTextContent('inside')
  })

  test('useIsChatComposerChild returns false outside component', () => {
    render(<ChildChecker />)
    expect(screen.getByTestId('child-checker')).toHaveTextContent('outside')
  })

  test('useChatComposer throws error when used outside', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    function BadComponent() {
      useChatComposer()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useChatComposer must be used within a ChatComposer'
    )

    consoleError.mockRestore()
  })
})

// ============================================================================
// Sidebar Control Tests
// ============================================================================

describe('ChatComposer - Sidebar Control', () => {
  test('sidebar toggle button works', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ChatComposer layout="split-panel">
        <ChatComposer.Sidebar collapsible={true}>
          Sidebar Content
        </ChatComposer.Sidebar>
      </ChatComposer>
    )

    const toggleButton = container.querySelector('.chat-composer-sidebar-toggle')
    expect(toggleButton).toBeInTheDocument()

    await user.click(toggleButton!)
  })

  test('controlled sidebar open/close', async () => {
    const handleChange = jest.fn()
    const { rerender } = render(
      <ChatComposer sidebarOpen={true} onSidebarOpenChange={handleChange}>
        <ChatComposer.Sidebar>Sidebar</ChatComposer.Sidebar>
      </ChatComposer>
    )

    rerender(
      <ChatComposer sidebarOpen={false} onSidebarOpenChange={handleChange}>
        <ChatComposer.Sidebar>Sidebar</ChatComposer.Sidebar>
      </ChatComposer>
    )
  })

  test('default sidebar state is respected', () => {
    render(
      <ChatComposer defaultSidebarOpen={false}>
        <TestComponent />
      </ChatComposer>
    )

    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('no')
  })
})

// ============================================================================
// Prebuilt Layout Tests
// ============================================================================

describe('ChatComposer - Prebuilt Layouts', () => {
  test('MinimalChat renders correctly', () => {
    const { container } = render(
      <MinimalChat>
        <div>Message 1</div>
      </MinimalChat>
    )

    expect(container.querySelector('[data-layout="minimal"]')).toBeInTheDocument()
  })

  test('StandardChat includes default sections', () => {
    const { container } = render(
      <StandardChat>
        <div>Message 1</div>
      </StandardChat>
    )

    expect(container.querySelector('[data-layout="standard"]')).toBeInTheDocument()
  })

  test('AgentChat has split-panel layout', () => {
    const { container } = render(
      <AgentChat>
        <div>Message 1</div>
      </AgentChat>
    )

    expect(container.querySelector('[data-layout="split-panel"]')).toBeInTheDocument()
  })

  test('FullscreenChat renders with fullscreen layout', () => {
    const { container } = render(
      <FullscreenChat>
        <div>Message 1</div>
      </FullscreenChat>
    )

    expect(container.querySelector('[data-layout="fullscreen"]')).toBeInTheDocument()
  })
})

// ============================================================================
// Builder Hook Tests
// ============================================================================

describe('ChatComposer - useChatComposerBuilder Hook', () => {
  test('returns initial state', () => {
    const TestComponent = () => {
      const builder = useChatComposerBuilder()
      return (
        <div>
          <div data-testid="layout">{builder.layout}</div>
          <div data-testid="sidebar-open">{builder.sidebarOpen ? 'yes' : 'no'}</div>
        </div>
      )
    }

    render(<TestComponent />)
    expect(screen.getByTestId('layout')).toHaveTextContent('standard')
    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('yes')
  })

  test('toggleFeature works', async () => {
    const user = userEvent.setup()
    const TestComponent = () => {
      const builder = useChatComposerBuilder()
      return (
        <div>
          <div data-testid="has-thinking">
            {builder.hasFeature('thinking') ? 'yes' : 'no'}
          </div>
          <button onClick={() => builder.toggleFeature('thinking')}>
            Toggle Thinking
          </button>
        </div>
      )
    }

    render(<TestComponent />)
    expect(screen.getByTestId('has-thinking')).toHaveTextContent('yes')

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByTestId('has-thinking')).toHaveTextContent('no')
    })
  })

  test('toggleSidebar works', async () => {
    const user = userEvent.setup()
    const TestComponent = () => {
      const builder = useChatComposerBuilder()
      return (
        <div>
          <div data-testid="sidebar-open">{builder.sidebarOpen ? 'yes' : 'no'}</div>
          <button onClick={builder.toggleSidebar}>Toggle Sidebar</button>
        </div>
      )
    }

    render(<TestComponent />)
    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('yes')

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-open')).toHaveTextContent('no')
    })
  })
})

// ============================================================================
// Styling Tests
// ============================================================================

describe('ChatComposer - Styling', () => {
  test('custom className is applied', () => {
    const { container } = render(
      <ChatComposer className="custom-class">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
      </ChatComposer>
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  test('custom styles are applied', () => {
    const { container } = render(
      <ChatComposer style={{ minHeight: '500px', backgroundColor: 'blue' }}>
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
      </ChatComposer>
    )

    const composer = container.querySelector('.chat-composer')
    expect(composer).toHaveStyle('min-height: 500px')
  })

  test('minHeight prop sets height', () => {
    const { container } = render(
      <ChatComposer minHeight="300px">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
      </ChatComposer>
    )

    expect(container.querySelector('.chat-composer')).toHaveStyle('min-height: 300px')
  })

  test('variant class is applied', () => {
    const { container } = render(
      <ChatComposer variant="compact">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
      </ChatComposer>
    )

    expect(container.querySelector('[data-variant="compact"]')).toBeInTheDocument()
  })
})

// ============================================================================
// Snapshot Tests
// ============================================================================

describe('ChatComposer - Snapshots', () => {
  test('standard layout snapshot', () => {
    const { container } = render(
      <ChatComposer layout="standard">
        <ChatComposer.Header>Header</ChatComposer.Header>
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('split-panel layout snapshot', () => {
    const { container } = render(
      <ChatComposer layout="split-panel">
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Sidebar>Sidebar</ChatComposer.Sidebar>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('ChatComposer - Accessibility', () => {
  test('has no accessibility violations in standard layout', async () => {
    const { container } = render(
      <ChatComposer layout="standard">
        <ChatComposer.Header>Header</ChatComposer.Header>
        <ChatComposer.Messages>Messages</ChatComposer.Messages>
        <ChatComposer.Input>Input</ChatComposer.Input>
      </ChatComposer>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('sidebar toggle button has proper aria-label', () => {
    const { container } = render(
      <ChatComposer layout="split-panel">
        <ChatComposer.Sidebar collapsible={true}>
          Sidebar
        </ChatComposer.Sidebar>
      </ChatComposer>
    )

    const toggleButton = container.querySelector(
      '.chat-composer-sidebar-toggle'
    ) as HTMLButtonElement
    expect(toggleButton).toHaveAttribute('aria-label')
  })

  test('sidebar toggle button is keyboard accessible', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ChatComposer layout="split-panel">
        <ChatComposer.Sidebar collapsible={true}>
          Sidebar
        </ChatComposer.Sidebar>
      </ChatComposer>
    )

    const toggleButton = container.querySelector('.chat-composer-sidebar-toggle')
    await user.tab()
    expect(toggleButton).toHaveFocus()
  })
})

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('ChatComposer - Edge Cases', () => {
  test('renders without children', () => {
    const { container } = render(<ChatComposer />)
    expect(container.querySelector('.chat-composer')).toBeInTheDocument()
  })

  test('handles empty slots gracefully', () => {
    const { container } = render(
      <ChatComposer>
        <ChatComposer.Header></ChatComposer.Header>
        <ChatComposer.Messages></ChatComposer.Messages>
      </ChatComposer>
    )

    expect(container.querySelector('.chat-composer')).toBeInTheDocument()
  })

  test('header with sticky prop applies class', () => {
    const { container } = render(
      <ChatComposer>
        <ChatComposer.Header sticky={true}>Header</ChatComposer.Header>
      </ChatComposer>
    )

    expect(container.querySelector('.sticky')).toBeInTheDocument()
  })

  test('input with padding variant applies class', () => {
    const { container } = render(
      <ChatComposer>
        <ChatComposer.Input padding="lg">Input</ChatComposer.Input>
      </ChatComposer>
    )

    expect(container.querySelector('.padding-lg')).toBeInTheDocument()
  })
})
