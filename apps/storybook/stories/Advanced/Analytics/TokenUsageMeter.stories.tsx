/**
 * TokenUsageMeter Storybook Stories
 *
 * Real-time token usage display with premium glassmorphism design
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  TokenUsageMeter,
  MODEL_PRICING_PRESETS,
  type TokenUsage,
} from '@clarity-chat/react'
import { useState, useEffect } from 'react'

const meta: Meta<typeof TokenUsageMeter> = {
  title: 'Advanced/Analytics/TokenUsageMeter',
  component: TokenUsageMeter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Real-time token usage meter for streaming AI responses with premium glassmorphism effects.

## Features
- Real-time token count animation with framer-motion
- Input/output token breakdown
- Cost estimation with model pricing
- Multiple display variants (detailed, minimal, inline)
- Premium OKLCH gradient glass effects
- Streaming indicator
- Reduced motion support
- Accessible ARIA labels

## Installation

\`\`\`bash
npm install @clarity-chat/react @clarity-chat/token-optimization framer-motion
\`\`\`

## Import

\`\`\`tsx
import { TokenUsageMeter, MODEL_PRICING_PRESETS } from '@clarity-chat/react'
\`\`\`

## Usage

\`\`\`tsx
// Basic usage during streaming
<TokenUsageMeter
  usage={{ promptTokens: 150, completionTokens: 47, totalTokens: 197 }}
  isStreaming={true}
/>

// With cost estimation
<TokenUsageMeter
  usage={tokenUsage}
  pricing={MODEL_PRICING_PRESETS['gpt-4o']}
  showCost={true}
/>

// Inline variant for headers
<TokenUsageMeter
  usage={usage}
  variant="inline"
  compact={true}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['detailed', 'minimal', 'inline'],
      description: 'Display variant',
    },
    isStreaming: {
      control: 'boolean',
      description: 'Show streaming indicator',
    },
    showCost: {
      control: 'boolean',
      description: 'Show cost estimate',
    },
    showBreakdown: {
      control: 'boolean',
      description: 'Show detailed token breakdown',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode for inline display',
    },
  },
}

export default meta
type Story = StoryObj<typeof TokenUsageMeter>

const sampleUsage: TokenUsage = {
  promptTokens: 245,
  completionTokens: 89,
  totalTokens: 334,
}

// Default - detailed variant with glassmorphism
export const Default: Story = {
  args: {
    usage: sampleUsage,
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    showCost: true,
    showBreakdown: true,
    variant: 'detailed',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default detailed variant with glassmorphism, showing full token breakdown and cost estimate.',
      },
    },
  },
}

// Streaming animation
export const StreamingAnimation: Story = {
  render: () => {
    const [usage, setUsage] = useState<TokenUsage>({
      promptTokens: 150,
      completionTokens: 0,
      totalTokens: 150,
    })
    const [isStreaming, setIsStreaming] = useState(false)

    const startStreaming = () => {
      setIsStreaming(true)
      setUsage({
        promptTokens: 150,
        completionTokens: 0,
        totalTokens: 150,
      })

      let completionTokens = 0
      const interval = setInterval(() => {
        completionTokens += Math.floor(Math.random() * 5) + 1

        if (completionTokens >= 200) {
          clearInterval(interval)
          setIsStreaming(false)
          return
        }

        setUsage({
          promptTokens: 150,
          completionTokens,
          totalTokens: 150 + completionTokens,
        })
      }, 100)
    }

    return (
      <div className="space-y-4 max-w-md">
        <TokenUsageMeter
          usage={usage}
          isStreaming={isStreaming}
          pricing={MODEL_PRICING_PRESETS['gpt-4o']}
          showCost
          showBreakdown
        />
        <button
          onClick={startStreaming}
          disabled={isStreaming}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isStreaming ? 'Streaming...' : 'Start Streaming Demo'}
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Watch the token counter animate in real-time as completion tokens increase during a simulated stream.',
      },
    },
  },
}

// Minimal variant
export const Minimal: Story = {
  args: {
    usage: sampleUsage,
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    showCost: true,
    variant: 'minimal',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Minimal variant with glassmorphism, perfect for compact spaces or sidebar displays.',
      },
    },
  },
}

// Inline variant
export const Inline: Story = {
  args: {
    usage: sampleUsage,
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    showCost: true,
    variant: 'inline',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Inline variant for embedding in headers or tool tips, with minimal space usage.',
      },
    },
  },
}

// Compact mode
export const Compact: Story = {
  args: {
    usage: sampleUsage,
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    showCost: true,
    showBreakdown: true,
    compact: true,
    variant: 'minimal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact mode reduces padding and font sizes for dense layouts.',
      },
    },
  },
}

// Without cost
export const WithoutCost: Story = {
  args: {
    usage: sampleUsage,
    showCost: false,
    showBreakdown: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display only token counts without cost estimation.',
      },
    },
  },
}

// Without breakdown
export const WithoutBreakdown: Story = {
  args: {
    usage: sampleUsage,
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    showCost: true,
    showBreakdown: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Show only total tokens without input/output breakdown for cleaner display.',
      },
    },
  },
}

// Large numbers
export const LargeNumbers: Story = {
  args: {
    usage: {
      promptTokens: 8542,
      completionTokens: 15789,
      totalTokens: 24331,
    },
    pricing: MODEL_PRICING_PRESETS['gpt-4o'],
    showCost: true,
    showBreakdown: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Token counts above 1000 are formatted with K suffix (e.g., 24.3K).',
      },
    },
  },
}

// Different models comparison
export const ModelPricingComparison: Story = {
  render: () => {
    const usage: TokenUsage = {
      promptTokens: 500,
      completionTokens: 300,
      totalTokens: 800,
    }

    const models = [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    ]

    return (
      <div className="space-y-3 max-w-md">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Same usage, different model costs:
        </h3>
        {models.map((model) => (
          <div key={model.id} className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {model.name}
            </p>
            <TokenUsageMeter
              usage={usage}
              pricing={MODEL_PRICING_PRESETS[model.id]}
              showCost
              showBreakdown
              variant="minimal"
            />
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compare costs across different AI models for the same token usage.',
      },
    },
  },
}

// All variants side-by-side
export const AllVariants: Story = {
  render: () => {
    const usage: TokenUsage = {
      promptTokens: 245,
      completionTokens: 89,
      totalTokens: 334,
    }

    return (
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            Detailed Variant
          </h3>
          <p className="text-xs text-muted-foreground">
            Full display with glassmorphism, breakdown, and cost
          </p>
          <TokenUsageMeter
            usage={usage}
            pricing={MODEL_PRICING_PRESETS['gpt-4o']}
            showCost
            showBreakdown
            variant="detailed"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            Minimal Variant
          </h3>
          <p className="text-xs text-muted-foreground">
            Compact with glassmorphism, perfect for sidebars
          </p>
          <TokenUsageMeter
            usage={usage}
            pricing={MODEL_PRICING_PRESETS['gpt-4o']}
            showCost
            variant="minimal"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            Inline Variant
          </h3>
          <p className="text-xs text-muted-foreground">
            Minimal space usage for headers or tooltips
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm">Usage:</span>
            <TokenUsageMeter
              usage={usage}
              pricing={MODEL_PRICING_PRESETS['gpt-4o']}
              showCost
              variant="inline"
            />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'All three display variants showcased side-by-side.',
      },
    },
  },
}

// Streaming with different models
export const StreamingWithModelSwitch: Story = {
  render: () => {
    const [usage, setUsage] = useState<TokenUsage>({
      promptTokens: 200,
      completionTokens: 0,
      totalTokens: 200,
    })
    const [isStreaming, setIsStreaming] = useState(false)
    const [modelId, setModelId] = useState('gpt-4o')

    const startStreaming = () => {
      setIsStreaming(true)
      setUsage({
        promptTokens: 200,
        completionTokens: 0,
        totalTokens: 200,
      })

      let completionTokens = 0
      const interval = setInterval(() => {
        completionTokens += Math.floor(Math.random() * 8) + 2

        if (completionTokens >= 250) {
          clearInterval(interval)
          setIsStreaming(false)
          return
        }

        setUsage({
          promptTokens: 200,
          completionTokens,
          totalTokens: 200 + completionTokens,
        })
      }, 80)
    }

    return (
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Select Model
          </label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            disabled={isStreaming}
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
          </select>
        </div>

        <TokenUsageMeter
          usage={usage}
          isStreaming={isStreaming}
          pricing={MODEL_PRICING_PRESETS[modelId]}
          showCost
          showBreakdown
        />

        <button
          onClick={startStreaming}
          disabled={isStreaming}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isStreaming ? 'Streaming...' : 'Start Streaming'}
        </button>

        <p className="text-xs text-muted-foreground">
          Watch how different models affect the cost estimate in real-time
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo showing streaming with model switching to compare costs.',
      },
    },
  },
}
