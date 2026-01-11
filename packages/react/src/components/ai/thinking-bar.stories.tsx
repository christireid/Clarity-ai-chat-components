/**
 * ThinkingBar Storybook Stories
 *
 * Comprehensive stories demonstrating all ThinkingBar features and variants.
 */

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ThinkingBar, useThinkingBar, type ThinkingBarStatus } from './thinking-bar'

const meta: Meta<typeof ThinkingBar> = {
  title: 'Components/AI/ThinkingBar',
  component: ThinkingBar,
  parameters: {
    docs: {
      description: {
        component: `
Animated progress bar for showing AI processing status.

## Features
- Multiple status states: idle, thinking, searching, generating, complete, error
- Three visual variants: default, minimal, detailed
- Determinate and indeterminate progress modes
- Customizable messages and icons
- Full accessibility with ARIA live regions
- Respects reduced motion preferences
- Includes \`useThinkingBar\` hook for state management

## Usage

\`\`\`tsx
import { ThinkingBar, useThinkingBar } from '@clarity-chat/react'

// Basic usage
<ThinkingBar status="thinking" />

// With progress and custom message
<ThinkingBar
  status="searching"
  message="Searching knowledge base..."
  progress={45}
/>

// With the convenience hook
function MyComponent() {
  const thinking = useThinkingBar()

  const handleSubmit = async () => {
    thinking.startThinking('Processing...')
    await doSomething()
    thinking.setProgress(50)
    thinking.startGenerating('Almost done...')
    await doMore()
    thinking.complete()
  }

  return (
    <ThinkingBar
      status={thinking.status}
      message={thinking.message}
      progress={thinking.progress}
    />
  )
}
\`\`\`
        `,
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['idle', 'thinking', 'searching', 'generating', 'complete', 'error'],
      description: 'Current processing status',
    },
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'detailed'],
      description: 'Visual variant',
    },
    message: {
      control: 'text',
      description: 'Custom message to display',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100)',
    },
    estimatedTime: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: 'Estimated time remaining in seconds',
    },
    showDots: {
      control: 'boolean',
      description: 'Show animated dots',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Use indeterminate progress animation',
    },
    disableAnimations: {
      control: 'boolean',
      description: 'Disable all animations',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThinkingBar>

// =============================================================================
// BASIC STORIES
// =============================================================================

export const Default: Story = {
  args: {
    status: 'thinking',
    message: 'Analyzing your query...',
    progress: 45,
  },
}

export const Thinking: Story = {
  args: {
    status: 'thinking',
    message: 'Analyzing your request...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default thinking state with indeterminate progress',
      },
    },
  },
}

export const Searching: Story = {
  args: {
    status: 'searching',
    message: 'Searching knowledge base...',
    progress: 30,
  },
  parameters: {
    docs: {
      description: {
        story: 'Searching state with determinate progress',
      },
    },
  },
}

export const Generating: Story = {
  args: {
    status: 'generating',
    message: 'Generating response...',
    progress: 75,
  },
  parameters: {
    docs: {
      description: {
        story: 'Generating state, typically used when composing the final response',
      },
    },
  },
}

export const Complete: Story = {
  args: {
    status: 'complete',
    message: 'Done!',
    progress: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete state showing successful completion',
      },
    },
  },
}

export const Error: Story = {
  args: {
    status: 'error',
    message: 'Failed to process request',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state for failed operations',
      },
    },
  },
}

export const Idle: Story = {
  args: {
    status: 'idle',
  },
  parameters: {
    docs: {
      description: {
        story: 'Idle state when no processing is happening',
      },
    },
  },
}

// =============================================================================
// VARIANT STORIES
// =============================================================================

export const MinimalVariant: Story = {
  args: {
    status: 'thinking',
    message: 'Processing...',
    variant: 'minimal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact minimal variant for tight spaces',
      },
    },
  },
}

export const DetailedVariant: Story = {
  args: {
    status: 'thinking',
    message: 'Analyzing your complex query...',
    variant: 'detailed',
    progress: 45,
    estimatedTime: 12,
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed variant with all information displayed',
      },
    },
  },
}

export const DefaultVariant: Story = {
  args: {
    status: 'searching',
    message: 'Searching documents...',
    variant: 'default',
    progress: 60,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard default variant with balanced information',
      },
    },
  },
}

// =============================================================================
// PROGRESS STORIES
// =============================================================================

export const IndeterminateProgress: Story = {
  args: {
    status: 'thinking',
    message: 'Processing...',
    indeterminate: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate progress when duration is unknown',
      },
    },
  },
}

export const DeterminateProgress: Story = {
  args: {
    status: 'generating',
    message: 'Building response...',
    progress: 65,
    indeterminate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Determinate progress with specific percentage',
      },
    },
  },
}

export const WithEstimatedTime: Story = {
  args: {
    status: 'thinking',
    message: 'Deep analysis in progress...',
    variant: 'detailed',
    progress: 35,
    estimatedTime: 45,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows estimated time remaining',
      },
    },
  },
}

// =============================================================================
// CUSTOMIZATION STORIES
// =============================================================================

export const CustomMessage: Story = {
  args: {
    status: 'thinking',
    message: 'Consulting the oracle of knowledge...',
    progress: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom message overrides the default status message',
      },
    },
  },
}

export const WithoutDots: Story = {
  args: {
    status: 'thinking',
    message: 'Processing quietly...',
    showDots: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable the animated dots for a cleaner look',
      },
    },
  },
}

export const DisabledAnimations: Story = {
  args: {
    status: 'thinking',
    message: 'Processing...',
    progress: 50,
    disableAnimations: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'All animations disabled for reduced motion preference',
      },
    },
  },
}

export const CustomClassName: Story = {
  args: {
    status: 'generating',
    message: 'Creating something amazing...',
    progress: 80,
    className: 'w-full max-w-md shadow-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom className for additional styling',
      },
    },
  },
}

// =============================================================================
// INTERACTIVE STORIES
// =============================================================================

/**
 * Interactive demo showing all status states
 */
export const AllStates: Story = {
  render: () => {
    const statuses: ThinkingBarStatus[] = [
      'idle',
      'thinking',
      'searching',
      'generating',
      'complete',
      'error',
    ]

    return (
      <div className="space-y-4 w-[400px]">
        {statuses.map((status) => (
          <ThinkingBar
            key={status}
            status={status}
            progress={status === 'complete' ? 100 : status === 'idle' ? 0 : 50}
          />
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'All status states displayed together for comparison',
      },
    },
  },
}

/**
 * Interactive demo comparing all variants
 */
export const AllVariants: Story = {
  render: () => {
    return (
      <div className="space-y-6 w-[400px]">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Minimal</p>
          <ThinkingBar status="thinking" variant="minimal" message="Processing..." />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Default</p>
          <ThinkingBar
            status="searching"
            variant="default"
            message="Searching..."
            progress={45}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Detailed</p>
          <ThinkingBar
            status="generating"
            variant="detailed"
            message="Generating response..."
            progress={75}
            estimatedTime={8}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'All visual variants displayed together for comparison',
      },
    },
  },
}

/**
 * Interactive demo with the useThinkingBar hook
 */
export const WithHook: Story = {
  render: function HookDemo() {
    const thinking = useThinkingBar()

    const simulateProcess = async () => {
      thinking.startThinking('Starting analysis...')

      await new Promise((r) => setTimeout(r, 1000))
      thinking.setProgress(25)
      thinking.setMessage('Gathering information...')

      await new Promise((r) => setTimeout(r, 1000))
      thinking.startSearching('Searching knowledge base...')
      thinking.setProgress(50)

      await new Promise((r) => setTimeout(r, 1000))
      thinking.startGenerating('Composing response...')
      thinking.setProgress(75)

      await new Promise((r) => setTimeout(r, 1000))
      thinking.complete('All done!')
    }

    const simulateError = async () => {
      thinking.startThinking('Attempting operation...')
      await new Promise((r) => setTimeout(r, 1500))
      thinking.setError('Connection failed. Please try again.')
    }

    return (
      <div className="space-y-4 w-[400px]">
        <ThinkingBar
          status={thinking.status}
          message={thinking.message}
          progress={thinking.progress}
          variant="detailed"
        />

        <div className="flex gap-2">
          <button
            onClick={simulateProcess}
            disabled={thinking.isProcessing}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Simulate Process
          </button>
          <button
            onClick={simulateError}
            disabled={thinking.isProcessing}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Simulate Error
          </button>
          <button
            onClick={thinking.reset}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-input bg-background hover:bg-accent transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Status: {thinking.status}</p>
          <p>Progress: {thinking.progress}%</p>
          <p>Processing: {thinking.isProcessing ? 'Yes' : 'No'}</p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo using the useThinkingBar hook for state management. Click the buttons to see the status transitions.',
      },
    },
  },
}

/**
 * Auto-progressing demo
 */
export const AutoProgress: Story = {
  render: function AutoProgressDemo() {
    const [progress, setProgress] = React.useState(0)
    const [status, setStatus] = React.useState<ThinkingBarStatus>('thinking')

    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 2
          if (next >= 100) {
            setStatus('complete')
            clearInterval(interval)
            return 100
          }
          if (next >= 70) {
            setStatus('generating')
          } else if (next >= 30) {
            setStatus('searching')
          }
          return next
        })
      }, 100)

      return () => clearInterval(interval)
    }, [])

    const restart = () => {
      setProgress(0)
      setStatus('thinking')
    }

    return (
      <div className="space-y-4 w-[400px]">
        <ThinkingBar status={status} progress={progress} variant="detailed" />
        {status === 'complete' && (
          <button
            onClick={restart}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Restart Animation
          </button>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Auto-progressing demo that cycles through all states automatically',
      },
    },
  },
}

// =============================================================================
// DARK MODE STORY
// =============================================================================

export const DarkMode: Story = {
  args: {
    status: 'thinking',
    message: 'Processing in dark mode...',
    variant: 'detailed',
    progress: 55,
    estimatedTime: 15,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-6 rounded-lg w-[400px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'ThinkingBar in dark mode',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
}
