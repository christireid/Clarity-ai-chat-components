/**
 * Comprehensive Test Suite for AgentPanel Component
 *
 * Tests variant rendering, section visibility, connected behavior,
 * accessibility, and interactions.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe, toHaveNoViolations } from 'jest-axe'

import AgentPanel, {
  useAgentPanel,
  useIsAgentPanelChild,
  useConnectedAgentPanel,
  type AgentPanelProps,
  type AgentPanelVariant,
  type PlanStep,
  type ToolCall,
  type ThinkingStep,
} from '../AgentPanel'

expect.extend(toHaveNoViolations)

// ============================================================================
// Mock framer-motion
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
// Mock AgentExecutionProvider
// ============================================================================

jest.mock('../../providers/AgentExecutionProvider', () => ({
  useAgentExecution: jest.fn(() => ({
    status: 'executing' as const,
    progress: 50,
    plan: [],
    currentStepIndex: 0,
    thoughts: [],
    currentThought: null,
    toolCalls: [],
    pendingApprovals: [],
    time: {
      startedAt: new Date(),
      completedAt: null,
    },
    approveTool: jest.fn(),
    rejectTool: jest.fn(),
    getCurrentStep: jest.fn(),
  })),
  useIsAgentExecutionConnected: jest.fn(() => true),
}))

// ============================================================================
// Mock Data
// ============================================================================

const mockPlanSteps: PlanStep[] = [
  {
    id: '1',
    title: 'Step 1',
    description: 'First step',
    status: 'complete',
    actualDuration: 1000,
  },
  {
    id: '2',
    title: 'Step 2',
    description: 'Second step',
    status: 'active',
    actualDuration: 0,
  },
  {
    id: '3',
    title: 'Step 3',
    status: 'pending',
    actualDuration: 0,
  },
]

const mockThinkingSteps: ThinkingStep[] = [
  {
    id: 'think-1',
    content: 'Let me analyze this...',
    status: 'complete',
  },
  {
    id: 'think-2',
    content: 'Now I will proceed...',
    status: 'active',
  },
]

const mockToolCalls: ToolCall[] = [
  {
    id: 'tool-1',
    name: 'search',
    description: 'Search tool',
    status: 'complete',
    input: { query: 'test' },
    output: { results: ['result1'] },
    duration: 500,
    approvalReason: null,
  },
  {
    id: 'tool-2',
    name: 'calculate',
    description: 'Calculate tool',
    status: 'waiting_approval',
    input: { expression: '2 + 2' },
    output: null,
    duration: 0,
    approvalReason: 'Large calculation',
  },
]

const mockPendingApprovals: ToolCall[] = [
  {
    id: 'tool-2',
    name: 'delete_file',
    description: 'Delete a file',
    status: 'waiting_approval',
    input: { path: '/important/file.txt' },
    output: null,
    duration: 0,
    approvalReason: 'Requires user approval',
  },
]

// ============================================================================
// Test Components
// ============================================================================

function TestComponent() {
  const context = useAgentPanel()
  return (
    <div data-testid="test-component">
      <div data-testid="variant">{context.variant}</div>
      <div data-testid="collapsed">{context.collapsed ? 'yes' : 'no'}</div>
      <button onClick={context.toggleCollapsed} data-testid="toggle-btn">
        Toggle
      </button>
    </div>
  )
}

function ChildChecker() {
  const isChild = useIsAgentPanelChild()
  return <div data-testid="child-checker">{isChild ? 'inside' : 'outside'}</div>
}

// ============================================================================
// Variant Rendering Tests
// ============================================================================

describe('AgentPanel - Variant Rendering', () => {
  test('renders sidebar variant', () => {
    const { container } = render(
      <AgentPanel variant="sidebar">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('[data-variant="sidebar"]')).toBeInTheDocument()
  })

  test('renders inline variant', () => {
    const { container } = render(
      <AgentPanel variant="inline">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('[data-variant="inline"]')).toBeInTheDocument()
  })

  test('renders modal variant', () => {
    const { container } = render(
      <AgentPanel variant="modal">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('[data-variant="modal"]')).toBeInTheDocument()
  })

  test('renders compact variant', () => {
    const { container } = render(
      <AgentPanel variant="compact">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('[data-variant="compact"]')).toBeInTheDocument()
  })

  test('renders full variant', () => {
    const { container } = render(
      <AgentPanel variant="full">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('[data-variant="full"]')).toBeInTheDocument()
  })
})

// ============================================================================
// Section Visibility Tests
// ============================================================================

describe('AgentPanel - Section Visibility', () => {
  test('plan section renders with steps', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} showProgress={true} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel-slot-plan')).toBeInTheDocument()
    mockPlanSteps.forEach((step) => {
      expect(container).toHaveTextContent(step.title)
    })
  })

  test('thinking section renders with thoughts', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Thinking thoughts={mockThinkingSteps} expandable={true} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel-slot-thinking')).toBeInTheDocument()
    mockThinkingSteps.forEach((thought) => {
      expect(container).toHaveTextContent(thought.content)
    })
  })

  test('tools section renders with tool calls', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Tools tools={mockToolCalls} showCompleted={true} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel-slot-tools')).toBeInTheDocument()
    mockToolCalls.forEach((tool) => {
      expect(container).toHaveTextContent(tool.name)
    })
  })

  test('approvals section renders with pending approvals', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel-slot-approvals')).toBeInTheDocument()
  })

  test('header slot renders', () => {
    const { container } = render(
      <AgentPanel>
        <AgentPanel.Header>Custom Header</AgentPanel.Header>
      </AgentPanel>
    )

    expect(container).toHaveTextContent('Custom Header')
    expect(container.querySelector('.agent-panel-slot-header')).toBeInTheDocument()
  })

  test('footer slot renders', () => {
    const { container } = render(
      <AgentPanel>
        <AgentPanel.Footer>Custom Footer</AgentPanel.Footer>
      </AgentPanel>
    )

    expect(container).toHaveTextContent('Custom Footer')
    expect(container.querySelector('.agent-panel-slot-footer')).toBeInTheDocument()
  })

  test('sections can be hidden with props', () => {
    const { container } = render(
      <AgentPanel
        connected={false}
        showPlan={false}
        showThinking={false}
        showTools={false}
      >
        <AgentPanel.Plan steps={mockPlanSteps} />
        <AgentPanel.Thinking thoughts={mockThinkingSteps} />
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    // Slots should not render if features are disabled
    expect(container.querySelectorAll('.agent-panel-slot-plan').length).toBe(0)
    expect(container.querySelectorAll('.agent-panel-slot-thinking').length).toBe(0)
    expect(container.querySelectorAll('.agent-panel-slot-tools').length).toBe(0)
  })
})

// ============================================================================
// Collapse/Expand Tests
// ============================================================================

describe('AgentPanel - Collapse/Expand', () => {
  test('collapse button toggles panel state', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AgentPanel defaultCollapsed={false}>
        <TestComponent />
      </AgentPanel>
    )

    expect(screen.getByTestId('collapsed')).toHaveTextContent('no')

    const collapseBtn = container.querySelector('.collapse-btn') as HTMLButtonElement
    await user.click(collapseBtn)

    await waitFor(() => {
      expect(screen.getByTestId('collapsed')).toHaveTextContent('yes')
    })
  })

  test('controlled collapsed state', () => {
    const { rerender, container } = render(
      <AgentPanel collapsed={false}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const contentDiv = container.querySelector('.agent-panel-content')
    expect(contentDiv).toBeInTheDocument()

    rerender(
      <AgentPanel collapsed={true}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    // Content should still be hidden when collapsed
  })

  test('collapse change callback is called', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()

    const { container } = render(
      <AgentPanel defaultCollapsed={false} onCollapsedChange={handleChange}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const collapseBtn = container.querySelector('.collapse-btn')
    await user.click(collapseBtn!)

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  test('collapse button has proper aria-label', () => {
    const { container } = render(
      <AgentPanel>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const btn = container.querySelector('.collapse-btn')
    expect(btn).toHaveAttribute('aria-label')
    expect(btn).toHaveAttribute('aria-expanded')
  })
})

// ============================================================================
// Plan Section Tests
// ============================================================================

describe('AgentPanel - Plan Section', () => {
  test('displays plan progress bar', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} showProgress={true} />
      </AgentPanel>
    )

    expect(container.querySelector('.plan-progress')).toBeInTheDocument()
    expect(container.querySelector('.progress-bar')).toBeInTheDocument()
  })

  test('step item shows correct status icon', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const stepItems = container.querySelectorAll('.agent-panel-plan-step')
    expect(stepItems.length).toBeGreaterThan(0)
  })

  test('step item displays duration', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container).toHaveTextContent('1s')
  })

  test('step click callback is called', async () => {
    const user = userEvent.setup()
    const handleStepClick = jest.fn()

    const { container } = render(
      <AgentPanel connected={false} onStepClick={handleStepClick}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const firstStep = container.querySelector('.agent-panel-plan-step')
    await user.click(firstStep!)

    expect(handleStepClick).toHaveBeenCalledWith(mockPlanSteps[0])
  })
})

// ============================================================================
// Thinking Section Tests
// ============================================================================

describe('AgentPanel - Thinking Section', () => {
  test('displays thinking steps', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Thinking thoughts={mockThinkingSteps} />
      </AgentPanel>
    )

    mockThinkingSteps.forEach((thought) => {
      expect(container).toHaveTextContent(thought.content)
    })
  })

  test('expand button appears with many thoughts', async () => {
    const manyThoughts = Array.from({ length: 10 }, (_, i) => ({
      id: `thought-${i}`,
      content: `Thought ${i}`,
      status: 'complete' as const,
    }))

    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Thinking thoughts={manyThoughts} maxVisible={5} expandable={true} />
      </AgentPanel>
    )

    const expandBtn = container.querySelector('.thinking-expand-btn')
    expect(expandBtn).toBeInTheDocument()
    expect(expandBtn).toHaveTextContent('Show all')
  })

  test('expand button toggles visibility', async () => {
    const user = userEvent.setup()
    const manyThoughts = Array.from({ length: 10 }, (_, i) => ({
      id: `thought-${i}`,
      content: `Thought ${i}`,
      status: 'complete' as const,
    }))

    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Thinking thoughts={manyThoughts} maxVisible={5} expandable={true} />
      </AgentPanel>
    )

    const expandBtn = container.querySelector('.thinking-expand-btn') as HTMLButtonElement
    await user.click(expandBtn)

    await waitFor(() => {
      expect(expandBtn).toHaveAttribute('aria-expanded', 'true')
    })
  })
})

// ============================================================================
// Tools Section Tests
// ============================================================================

describe('AgentPanel - Tools Section', () => {
  test('displays tool calls', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    mockToolCalls.forEach((tool) => {
      expect(container).toHaveTextContent(tool.name)
    })
  })

  test('filters completed tools', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Tools tools={mockToolCalls} showCompleted={false} />
      </AgentPanel>
    )

    // Only incomplete tools should be shown
    expect(container).not.toHaveTextContent('search')
  })

  test('tool click callback is called', async () => {
    const user = userEvent.setup()
    const handleToolClick = jest.fn()

    const { container } = render(
      <AgentPanel connected={false} onToolClick={handleToolClick}>
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    const toolCard = container.querySelector('.agent-panel-tool-card')
    await user.click(toolCard!)

    expect(handleToolClick).toHaveBeenCalled()
  })

  test('tool shows duration', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    expect(container).toHaveTextContent('500ms')
  })
})

// ============================================================================
// Approvals Section Tests
// ============================================================================

describe('AgentPanel - Approvals Section', () => {
  test('displays pending approvals', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    expect(container).toHaveTextContent('delete_file')
  })

  test('approve button is clickable', async () => {
    const user = userEvent.setup()
    const handleApprove = jest.fn()

    const { container } = render(
      <AgentPanel connected={false} onApprove={handleApprove}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    const approveBtn = container.querySelector('.approval-btn.approve') as HTMLButtonElement
    await user.click(approveBtn)

    expect(handleApprove).toHaveBeenCalled()
  })

  test('reject button shows reason input', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    const rejectBtn = container.querySelector('.approval-btn.reject') as HTMLButtonElement
    await user.click(rejectBtn)

    await waitFor(() => {
      expect(container.querySelector('.rejection-reason-input')).not.toBeInTheDocument()
    })
  })

  test('approval card shows input preview', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    expect(container.querySelector('.approval-input-preview')).toBeInTheDocument()
  })
})

// ============================================================================
// Context Tests
// ============================================================================

describe('AgentPanel - Context', () => {
  test('context provides variant information', () => {
    render(
      <AgentPanel variant="sidebar">
        <TestComponent />
      </AgentPanel>
    )

    expect(screen.getByTestId('variant')).toHaveTextContent('sidebar')
  })

  test('useIsAgentPanelChild returns correct value', () => {
    render(
      <AgentPanel>
        <ChildChecker />
      </AgentPanel>
    )

    expect(screen.getByTestId('child-checker')).toHaveTextContent('inside')
  })

  test('useIsAgentPanelChild returns false outside component', () => {
    render(<ChildChecker />)
    expect(screen.getByTestId('child-checker')).toHaveTextContent('outside')
  })

  test('useAgentPanel throws error when used outside', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    function BadComponent() {
      useAgentPanel()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useAgentPanel must be used within an AgentPanel'
    )

    consoleError.mockRestore()
  })
})

// ============================================================================
// Styling Tests
// ============================================================================

describe('AgentPanel - Styling', () => {
  test('custom className is applied', () => {
    const { container } = render(
      <AgentPanel className="custom-class">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  test('custom styles are applied', () => {
    const { container } = render(
      <AgentPanel style={{ maxHeight: '500px', backgroundColor: 'blue' }}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const panel = container.querySelector('.agent-panel')
    expect(panel).toHaveStyle('max-height: 500px')
  })

  test('title is displayed', () => {
    const { container } = render(
      <AgentPanel title="Custom Title">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container).toHaveTextContent('Custom Title')
  })
})

// ============================================================================
// Snapshot Tests
// ============================================================================

describe('AgentPanel - Snapshots', () => {
  test('renders sidebar variant snapshot', () => {
    const { container } = render(
      <AgentPanel variant="sidebar" connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} />
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders with approvals snapshot', () => {
    const { container } = render(
      <AgentPanel variant="inline" connected={false}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})

// ============================================================================
// Accessibility Tests
// ============================================================================

describe('AgentPanel - Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} />
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('plan step is keyboard accessible', async () => {
    const user = userEvent.setup()
    const handleStepClick = jest.fn()

    const { container } = render(
      <AgentPanel connected={false} onStepClick={handleStepClick}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const firstStep = container.querySelector('.agent-panel-plan-step') as HTMLElement
    firstStep.focus()

    await user.keyboard('{Enter}')
    expect(handleStepClick).toHaveBeenCalled()
  })

  test('tool card is keyboard accessible', async () => {
    const user = userEvent.setup()
    const handleToolClick = jest.fn()

    const { container } = render(
      <AgentPanel connected={false} onToolClick={handleToolClick}>
        <AgentPanel.Tools tools={mockToolCalls} />
      </AgentPanel>
    )

    const firstTool = container.querySelector('.agent-panel-tool-card') as HTMLElement
    firstTool.focus()

    await user.keyboard('{Enter}')
    expect(handleToolClick).toHaveBeenCalled()
  })

  test('approval buttons have proper aria-labels', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Approvals pendingApprovals={mockPendingApprovals} />
      </AgentPanel>
    )

    const approveBtn = container.querySelector('.approval-btn.approve')
    const rejectBtn = container.querySelector('.approval-btn.reject')

    expect(approveBtn).toHaveAttribute('aria-label')
    expect(rejectBtn).toHaveAttribute('aria-label')
  })

  test('collapse button has proper aria attributes', () => {
    const { container } = render(
      <AgentPanel>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    const collapseBtn = container.querySelector('.collapse-btn')
    expect(collapseBtn).toHaveAttribute('aria-label')
    expect(collapseBtn).toHaveAttribute('aria-expanded')
  })

  test('plan steps list has proper role', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container.querySelector('[role="list"]')).toBeInTheDocument()
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('AgentPanel - Edge Cases', () => {
  test('renders without children', () => {
    const { container } = render(<AgentPanel />)
    expect(container.querySelector('.agent-panel')).toBeInTheDocument()
  })

  test('handles empty plan steps', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Plan steps={[]} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel')).toBeInTheDocument()
  })

  test('handles empty tool calls', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Tools tools={[]} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel')).toBeInTheDocument()
  })

  test('handles empty approval list', () => {
    const { container } = render(
      <AgentPanel connected={false}>
        <AgentPanel.Approvals pendingApprovals={[]} />
      </AgentPanel>
    )

    expect(container.querySelector('.agent-panel')).toBeInTheDocument()
  })

  test('initially collapsed panel shows title and button', () => {
    const { container } = render(
      <AgentPanel defaultCollapsed={true} title="Agent Execution">
        <AgentPanel.Plan steps={mockPlanSteps} />
      </AgentPanel>
    )

    expect(container).toHaveTextContent('Agent Execution')
    expect(container.querySelector('.collapse-btn')).toBeInTheDocument()
  })
})
