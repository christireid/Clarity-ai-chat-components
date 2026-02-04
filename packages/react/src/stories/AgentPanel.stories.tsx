import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent } from '@storybook/test'
import { AgentPanel, type AgentPanelProps } from '../components/ai/AgentPanel'
import { AgentExecutionProvider } from '../providers/AgentExecutionProvider'
import type {
  PlanStep,
  ToolCall,
  ThinkingStep,
  ExecutionStatus,
} from '../providers/AgentExecutionProvider'

/**
 * AgentPanel Stories
 *
 * Comprehensive Storybook stories for the AgentPanel component showcasing:
 * - All panel variants (sidebar, inline, modal, compact, full)
 * - Execution state flows (idle, planning, executing, approval, complete)
 * - All panel sections (plan, thinking, tools, approvals)
 * - Interactive approval workflows
 * - Integration with AgentExecutionProvider
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create mock plan steps
 */
function createMockPlanSteps(count: number = 3): PlanStep[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `step-${i}`,
    title: `Planning Step ${i + 1}`,
    description: `This is the ${i + 1}. step in the execution plan`,
    status: i === 0 ? 'active' : i < 2 ? 'pending' : 'pending',
    order: i,
    toolIds: [`tool-${i}`],
    estimatedDuration: 5000 + i * 1000,
  }))
}

/**
 * Create mock tool calls
 */
function createMockToolCalls(count: number = 3, withApprovals: boolean = false): ToolCall[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tool-${i}`,
    name: `Tool: ${['Search Database', 'Execute Query', 'Update Cache', 'Fetch Data'][i % 4]}`,
    description: `Tool call ${i + 1} for processing data`,
    input: {
      query: `input_${i}`,
      filters: { limit: 10 + i },
    },
    status: withApprovals && i === 0 ? 'waiting_approval' : i === 0 ? 'executing' : 'pending',
    requiresApproval: withApprovals && i === 0,
    approvalReason:
      withApprovals && i === 0 ? 'Sensitive operation requires user approval' : undefined,
    startedAt: i === 0 ? new Date() : undefined,
  }))
}

/**
 * Create mock thinking steps
 */
function createMockThinkingSteps(count: number = 5): ThinkingStep[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `thought-${i}`,
    content: [
      'Analyzing the user request to understand intent',
      'Breaking down the task into steps',
      'Identifying required tools and dependencies',
      'Planning the execution strategy',
      'Ready to proceed with execution',
    ][i],
    status: i < 2 ? 'complete' : i === 2 ? 'active' : 'pending',
    timestamp: new Date(Date.now() - (5 - i) * 2000),
    duration: 1000 + i * 200,
  }))
}

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof AgentPanel> = {
  title: 'Components/AI/AgentPanel',
  component: AgentPanel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AgentExecutionProvider>
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
# AgentPanel

A unified agent execution view component that displays agent execution state including:
- **Plan Steps**: Visualization of execution plan and progress
- **Thinking Steps**: Display of agent reasoning and analysis
- **Tool Execution**: Real-time tool call tracking and status
- **Approvals**: Interactive approval workflow for sensitive operations
- **Status Tracking**: Current execution status and progress indicators

## Features
- **Multiple Variants**: Sidebar, inline, modal, compact, and full-width layouts
- **Flexible Sections**: Show/hide sections based on requirements
- **Provider Integration**: Automatic connection to AgentExecutionProvider
- **Interactive Approvals**: Approve or reject tool executions
- **Real-time Updates**: Live status and progress updates
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigable
- **Animations**: Smooth transitions using Framer Motion

## Usage Patterns

### Auto-connected to Provider
\`\`\`tsx
<AgentPanel connected />
\`\`\`

### With Customization
\`\`\`tsx
<AgentPanel
  variant="sidebar"
  showPlan
  showThinking
  showTools
  onApprove={(tool) => console.log('Approved:', tool)}
/>
\`\`\`

### Slot-based Composition
\`\`\`tsx
<AgentPanel>
  <AgentPanel.Header>Custom Header</AgentPanel.Header>
  <AgentPanel.PlanSection />
  <AgentPanel.ToolsSection />
</AgentPanel>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['sidebar', 'inline', 'modal', 'compact', 'full'],
      description: 'Panel layout variant',
    },
    connected: {
      control: 'boolean',
      description: 'Auto-connect to AgentExecutionProvider',
    },
    showPlan: {
      control: 'boolean',
      description: 'Show plan steps section',
    },
    showThinking: {
      control: 'boolean',
      description: 'Show thinking/reasoning section',
    },
    showTools: {
      control: 'boolean',
      description: 'Show tool execution section',
    },
    showApprovals: {
      control: 'boolean',
      description: 'Show approval requests section',
    },
    title: {
      control: 'text',
      description: 'Panel title',
    },
    defaultCollapsed: {
      control: 'boolean',
      description: 'Initially collapsed state',
    },
  },
}

export default meta
type Story = StoryObj<typeof AgentPanel>

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default AgentPanel with all sections visible
 */
export const Default: Story = {
  args: {
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    showApprovals: true,
    title: 'Agent Execution',
    variant: 'sidebar',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default AgentPanel with all sections visible and auto-connected to provider.',
      },
    },
  },
}

/**
 * Compact variant for minimal UI
 */
export const Compact: Story = {
  args: {
    variant: 'compact',
    connected: true,
    showPlan: true,
    showTools: true,
    title: 'Execution',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant with essential sections only. Ideal for embedded layouts.',
      },
    },
  },
}

/**
 * Full-width variant for detailed view
 */
export const FullWidth: Story = {
  args: {
    variant: 'full',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    showApprovals: true,
    title: 'Complete Execution View',
  },
  render: (args) => (
    <div className="w-full">
      <AgentPanel {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full-width variant displaying comprehensive execution information.',
      },
    },
  },
}

/**
 * Inline variant for chat-like contexts
 */
export const Inline: Story = {
  args: {
    variant: 'inline',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    title: 'Execution Progress',
  },
  parameters: {
    docs: {
      description: {
        story: 'Inline variant suitable for chat interfaces and embedded contexts.',
      },
    },
  },
}

/**
 * Modal variant for focused view
 */
export const Modal: Story = {
  args: {
    variant: 'modal',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    showApprovals: true,
    title: 'Agent Execution Modal',
  },
  render: (args) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh]">
        <AgentPanel {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modal variant for focused agent execution visualization in a dialog.',
      },
    },
  },
}

// ============================================================================
// Execution State Stories
// ============================================================================

/**
 * Idle state - no execution
 */
export const IdleState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    title: 'Idle',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider initialState={{ status: 'idle' as ExecutionStatus }}>
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel in idle state with no active execution.',
      },
    },
  },
}

/**
 * Planning state - creating execution plan
 */
export const PlanningState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    title: 'Planning...',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'planning' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          thoughts: createMockThinkingSteps(3),
          currentThought: createMockThinkingSteps(3)[2],
          progress: 30,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel during planning phase with thinking steps visible.',
      },
    },
  },
}

/**
 * Executing state - tools running
 */
export const ExecutingState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    title: 'Executing...',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'executing' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, false),
          activeTools: [createMockToolCalls(3, false)[0]],
          currentStepIndex: 1,
          progress: 60,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel during execution with active tool calls.',
      },
    },
  },
}

/**
 * Waiting for approval state
 */
export const WaitingApprovalState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    showApprovals: true,
    title: 'Awaiting Approval',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'waiting_approval' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, true),
          pendingApprovals: [createMockToolCalls(3, true)[0]],
          currentStepIndex: 0,
          progress: 45,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel waiting for user approval on a sensitive tool execution.',
      },
    },
  },
}

/**
 * Paused state
 */
export const PausedState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    title: 'Paused',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'paused' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, false),
          currentStepIndex: 1,
          progress: 50,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel in paused state, ready to resume execution.',
      },
    },
  },
}

/**
 * Complete state - execution finished
 */
export const CompleteState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    title: 'Complete',
  },
  decorators: [
    (Story) => {
      const completedTools = createMockToolCalls(3, false).map((tool) => ({
        ...tool,
        status: 'complete' as const,
        output: { result: 'Success', data: 'Processed data' },
      }))

      const completedSteps = createMockPlanSteps(3).map((step) => ({
        ...step,
        status: 'complete' as const,
      }))

      return (
        <AgentExecutionProvider
          initialState={{
            status: 'complete' as ExecutionStatus,
            plan: completedSteps,
            toolCalls: completedTools,
            completedTools,
            completedSteps,
            currentStepIndex: 3,
            progress: 100,
          }}
        >
          <Story />
        </AgentExecutionProvider>
      )
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel after successful execution completion.',
      },
    },
  },
}

/**
 * Error state
 */
export const ErrorState: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    title: 'Execution Error',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'error' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, false),
          error: {
            code: 'TOOL_EXECUTION_FAILED',
            message: 'Failed to execute tool: Database connection timeout',
            recoverable: true,
            timestamp: new Date(),
          },
          currentStepIndex: 1,
          progress: 50,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel displaying an error during execution.',
      },
    },
  },
}

// ============================================================================
// Section Visibility Stories
// ============================================================================

/**
 * Only plan section visible
 */
export const OnlyPlanSection: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: false,
    showApprovals: false,
    title: 'Plan',
  },
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel showing only the plan section for focused view.',
      },
    },
  },
}

/**
 * Only thinking section visible
 */
export const OnlyThinkingSection: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: false,
    showThinking: true,
    showTools: false,
    showApprovals: false,
    title: 'Agent Thinking',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'planning' as ExecutionStatus,
          thoughts: createMockThinkingSteps(5),
          currentThought: createMockThinkingSteps(5)[2],
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel showing only thinking/reasoning steps.',
      },
    },
  },
}

/**
 * Only tools section visible
 */
export const OnlyToolsSection: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: false,
    showThinking: false,
    showTools: true,
    showApprovals: false,
    title: 'Tool Execution',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'executing' as ExecutionStatus,
          toolCalls: createMockToolCalls(3, false),
          activeTools: [createMockToolCalls(3, false)[0]],
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel showing only tool execution section.',
      },
    },
  },
}

/**
 * Only approvals section visible
 */
export const OnlyApprovalsSection: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: false,
    showThinking: false,
    showTools: false,
    showApprovals: true,
    title: 'Pending Approvals',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'waiting_approval' as ExecutionStatus,
          toolCalls: createMockToolCalls(2, true),
          pendingApprovals: createMockToolCalls(2, true),
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel showing only approval requests.',
      },
    },
  },
}

// ============================================================================
// Interactive Stories with Play Functions
// ============================================================================

/**
 * Approval workflow - approve tool execution
 */
export const ApprovalWorkflow_Approve: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    showApprovals: true,
    title: 'Approve Tool',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'waiting_approval' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, true),
          pendingApprovals: [createMockToolCalls(3, true)[0]],
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find and click the approve button
    const approveButtons = await canvas.findAllByRole('button', { name: /approve/i })
    if (approveButtons.length > 0) {
      await userEvent.click(approveButtons[0])
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating approving a tool execution request.',
      },
    },
  },
}

/**
 * Approval workflow - reject tool execution
 */
export const ApprovalWorkflow_Reject: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    showApprovals: true,
    title: 'Reject Tool',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'waiting_approval' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, true),
          pendingApprovals: [createMockToolCalls(3, true)[0]],
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find and click the reject button
    const rejectButtons = await canvas.findAllByRole('button', { name: /reject|deny/i })
    if (rejectButtons.length > 0) {
      await userEvent.click(rejectButtons[0])
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story demonstrating rejecting a tool execution request.',
      },
    },
  },
}

/**
 * Collapse/expand toggle
 */
export const CollapseToggle: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    defaultCollapsed: false,
    title: 'Collapsible Panel',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find and click the collapse toggle button
    const toggleButtons = await canvas.findAllByRole('button')
    if (toggleButtons.length > 0) {
      // Usually the first button is the collapse/expand toggle
      await userEvent.click(toggleButtons[0])
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story showing panel collapse/expand functionality.',
      },
    },
  },
}

// ============================================================================
// Edge Cases & States
// ============================================================================

/**
 * No data state
 */
export const NoData: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    title: 'No Execution',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider initialState={{ status: 'idle' as ExecutionStatus }}>
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel with no execution data, showing empty states.',
      },
    },
  },
}

/**
 * Many steps and tools
 */
export const ManyStepsAndTools: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    title: 'Complex Execution',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'executing' as ExecutionStatus,
          plan: createMockPlanSteps(10),
          toolCalls: createMockToolCalls(8, false),
          activeTools: [createMockToolCalls(8, false)[0]],
          currentStepIndex: 3,
          progress: 45,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel with many plan steps and tool executions.',
      },
    },
  },
}

/**
 * Scrollable content
 */
export const ScrollableContent: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    maxHeight: 400,
    title: 'Scrollable',
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'executing' as ExecutionStatus,
          plan: createMockPlanSteps(8),
          toolCalls: createMockToolCalls(6, false),
          thoughts: createMockThinkingSteps(10),
          currentStepIndex: 2,
          progress: 50,
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel with scrollable content when height is constrained.',
      },
    },
  },
}

// ============================================================================
// Customization Stories
// ============================================================================

/**
 * Custom title and styling
 */
export const CustomStyling: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: true,
    showTools: true,
    title: 'Custom Agent',
    className: 'border-l-4 border-blue-500',
    style: {
      backgroundColor: '#f0f9ff',
      borderRadius: '12px',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel with custom styling and title.',
      },
    },
  },
}

/**
 * With event handlers
 */
export const WithEventHandlers: Story = {
  args: {
    variant: 'sidebar',
    connected: true,
    showPlan: true,
    showThinking: false,
    showTools: true,
    showApprovals: true,
    title: 'With Handlers',
    onApprove: () => console.log('Tool approved'),
    onReject: () => console.log('Tool rejected'),
    onStepClick: () => console.log('Step clicked'),
    onToolClick: () => console.log('Tool clicked'),
  },
  decorators: [
    (Story) => (
      <AgentExecutionProvider
        initialState={{
          status: 'waiting_approval' as ExecutionStatus,
          plan: createMockPlanSteps(3),
          toolCalls: createMockToolCalls(3, true),
          pendingApprovals: [createMockToolCalls(3, true)[0]],
        }}
      >
        <Story />
      </AgentExecutionProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'AgentPanel with event handlers connected for interactions.',
      },
    },
  },
}

export default meta
