/**
 * TokenCostPreview Storybook Stories
 *
 * Real-time token count and cost estimation component with glassmorphism design
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenCostPreview } from '@clarity-chat/react'
import { useState } from 'react'

const meta: Meta<typeof TokenCostPreview> = {
  title: 'Advanced/Analytics/TokenCostPreview',
  component: TokenCostPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Real-time token count and cost estimation component with premium glassmorphism effects.

## Features
- Live token estimation as users type
- Cost calculation based on model pricing
- Premium OKLCH gradient glass effects
- Throttled updates to prevent excessive renders
- Accessible with ARIA live regions
- Reduced motion support
- Customizable formatters

## Installation

\`\`\`bash
npm install @clarity-chat/react @clarity-chat/token-optimization
\`\`\`

## Import

\`\`\`tsx
import { TokenCostPreview } from '@clarity-chat/react'
\`\`\`

## Usage

\`\`\`tsx
function ChatInput() {
  const [message, setMessage] = useState('')

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <TokenCostPreview
        text={message}
        model="gpt-4"
        onCostChange={(cost, tokens) => {
          if (cost > 0.10) {
            console.log('Warning: message is expensive!')
          }
        }}
      />
    </div>
  )
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    model: {
      control: 'select',
      options: [
        'gpt-4',
        'gpt-4o',
        'gpt-3.5-turbo',
        'claude-3-5-sonnet',
        'claude-3-opus',
        'gemini-1.5-pro',
      ],
      description: 'Model to use for pricing',
    },
    showTokenCount: {
      control: 'boolean',
      description: 'Show token count',
    },
    showCost: {
      control: 'boolean',
      description: 'Show cost estimate',
    },
    minDisplayCost: {
      control: 'number',
      description: 'Minimum cost threshold to display',
    },
    throttleMs: {
      control: 'number',
      description: 'Throttle updates (ms)',
    },
  },
}

export default meta
type Story = StoryObj<typeof TokenCostPreview>

// Basic example
export const Default: Story = {
  args: {
    text: 'Hello, this is a sample message to estimate tokens and cost.',
    model: 'gpt-4',
    showTokenCount: true,
    showCost: true,
    minDisplayCost: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default token cost preview with glassmorphism design showing both token count and cost estimate.',
      },
    },
  },
}

// Interactive typing demo
export const InteractiveTyping: Story = {
  render: () => {
    const [text, setText] = useState('')

    return (
      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <label
            htmlFor="demo-input"
            className="block text-sm font-medium text-foreground"
          >
            Type a message:
          </label>
          <textarea
            id="demo-input"
            className="w-full p-3 border border-border rounded-lg resize-none h-32 bg-background text-foreground"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing to see real-time token and cost estimation..."
          />
        </div>
        <div className="flex items-center justify-between">
          <TokenCostPreview
            text={text}
            model="gpt-4"
            showTokenCount
            showCost
            minDisplayCost={0}
          />
          <button
            onClick={() => setText('')}
            className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing real-time token and cost updates as you type.',
      },
    },
  },
}

// Model comparison
export const ModelComparison: Story = {
  render: () => {
    const [text, setText] = useState(
      'Compare costs across different AI models by typing your message here.'
    )

    const models = [
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    ]

    return (
      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <label
            htmlFor="compare-input"
            className="block text-sm font-medium text-foreground"
          >
            Message:
          </label>
          <textarea
            id="compare-input"
            className="w-full p-3 border border-border rounded-lg resize-none h-24 bg-background text-foreground"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <span className="font-medium text-foreground">{model.name}</span>
              <TokenCostPreview
                text={text}
                model={model.id}
                showTokenCount
                showCost
                minDisplayCost={0}
              />
            </div>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compare costs across multiple AI models side-by-side to help users choose the most cost-effective option.',
      },
    },
  },
}

// Cost threshold warning
export const CostThresholdWarning: Story = {
  render: () => {
    const [text, setText] = useState('')
    const [warning, setWarning] = useState<string | null>(null)

    const handleCostChange = (cost: number, _tokens: number) => {
      if (cost > 0.01) {
        setWarning(`Warning: This message will cost $${cost.toFixed(4)}`)
      } else {
        setWarning(null)
      }
    }

    return (
      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <label
            htmlFor="warning-input"
            className="block text-sm font-medium text-foreground"
          >
            Type a long message to trigger cost warning:
          </label>
          <textarea
            id="warning-input"
            className="w-full p-3 border border-border rounded-lg resize-none h-32 bg-background text-foreground"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a longer message to see the cost warning..."
          />
        </div>
        <div className="flex items-center gap-4">
          <TokenCostPreview
            text={text}
            model="gpt-4"
            showTokenCount
            showCost
            minDisplayCost={0}
            onCostChange={handleCostChange}
          />
          {warning && (
            <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
              ⚠️ {warning}
            </span>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses onCostChange callback to show warning when cost exceeds threshold. Useful for budget-conscious applications.',
      },
    },
  },
}

// Long message
export const LongMessage: Story = {
  args: {
    text: `This is a much longer message that demonstrates how the token count and cost estimation works for substantial text input. When users write detailed prompts or provide extensive context, the token count will increase significantly, and the cost estimate will reflect the higher token usage. This helps users understand the cost implications of their messages before sending them.

The TokenCostPreview component updates in real-time as you type, providing immediate feedback about your message's cost. This is particularly useful for applications where users need to be mindful of API costs.

With support for multiple models like GPT-4, Claude, and Gemini, users can see how costs vary across different providers.`,
    model: 'gpt-4',
    showTokenCount: true,
    showCost: true,
    minDisplayCost: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Long messages show higher token counts with K suffix formatting for readability.',
      },
    },
  },
}

// Token count only
export const TokenCountOnly: Story = {
  args: {
    text: 'This message shows only the token count, not the cost.',
    model: 'gpt-4',
    showTokenCount: true,
    showCost: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display only the token count without cost estimate.',
      },
    },
  },
}

// Cost only
export const CostOnly: Story = {
  args: {
    text: 'This message shows only the cost estimate, not the token count.',
    model: 'gpt-4',
    showTokenCount: false,
    showCost: true,
    minDisplayCost: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display only the cost estimate without token count.',
      },
    },
  },
}

// Simulated typing
export const SimulatedTyping: Story = {
  render: () => {
    const [text, setText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const sampleText = `Hello! I'm demonstrating the TokenCostPreview component. Watch as the token count and cost update in real-time as I type this message. This is useful for chat applications where users need to understand the cost implications of their messages.`

    const startTyping = () => {
      setText('')
      setIsTyping(true)
      let index = 0

      const interval = setInterval(() => {
        if (index < sampleText.length) {
          setText(sampleText.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(interval)
        }
      }, 30)
    }

    return (
      <div className="space-y-4 max-w-2xl">
        <div className="flex gap-2">
          <button
            onClick={startTyping}
            disabled={isTyping}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isTyping ? 'Typing...' : 'Start Demo'}
          </button>
          <button
            onClick={() => setText('')}
            disabled={isTyping}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[100px]">
          <p className="text-foreground">
            {text || 'Click "Start Demo" to begin'}
          </p>
        </div>
        <TokenCostPreview
          text={text}
          model="gpt-4"
          showTokenCount
          showCost
          minDisplayCost={0}
          throttleMs={50}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Watch token count and cost update in real-time as text is typed. Demonstrates throttled updates for smooth performance.',
      },
    },
  },
}
