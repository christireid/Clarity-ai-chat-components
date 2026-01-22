import type { Meta, StoryObj } from '@storybook/react'
import { TokenUsageMeter } from './TokenUsageMeter'

/**
 * TokenUsageMeter displays token usage progress with animations.
 * Perfect for showing real-time usage against limits or budgets.
 *
 * ## Features
 * - Animated progress bar with framer-motion
 * - Color-coded status (safe, warning, danger)
 * - Percentage and absolute value display
 * - Glassmorphism design
 * - Accessible with ARIA attributes
 */
const meta = {
  title: 'Components/TokenUsageMeter',
  component: TokenUsageMeter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Visual token usage meter with animated progress bar and color-coded status indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    used: {
      control: { type: 'number', min: 0, max: 10000 },
      description: 'Tokens used',
    },
    total: {
      control: { type: 'number', min: 100, max: 10000 },
      description: 'Total token limit',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Display percentage',
    },
    showAbsolute: {
      control: 'boolean',
      description: 'Display absolute values',
    },
    animated: {
      control: 'boolean',
      description: 'Enable animations',
    },
  },
} satisfies Meta<typeof TokenUsageMeter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Safe usage level (under 50%)
 */
export const Safe: Story = {
  args: {
    used: 1200,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: true,
  },
}

/**
 * Warning usage level (50-80%)
 */
export const Warning: Story = {
  args: {
    used: 2800,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: true,
  },
}

/**
 * Danger usage level (80-100%)
 */
export const Danger: Story = {
  args: {
    used: 3600,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: true,
  },
}

/**
 * At limit (100%)
 */
export const AtLimit: Story = {
  args: {
    used: 4000,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: true,
  },
}

/**
 * Minimal usage
 */
export const Minimal: Story = {
  args: {
    used: 50,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: true,
  },
}

/**
 * Without percentage display
 */
export const NoPercentage: Story = {
  args: {
    used: 2400,
    total: 4000,
    showPercentage: false,
    showAbsolute: true,
    animated: true,
  },
}

/**
 * Without absolute values
 */
export const NoAbsolute: Story = {
  args: {
    used: 2400,
    total: 4000,
    showPercentage: true,
    showAbsolute: false,
    animated: true,
  },
}

/**
 * Without animations
 */
export const Static: Story = {
  args: {
    used: 2400,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: false,
  },
}

/**
 * Multiple meters showing different states
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Safe (30%)</h4>
        <TokenUsageMeter used={1200} total={4000} showPercentage showAbsolute animated />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Warning (70%)</h4>
        <TokenUsageMeter used={2800} total={4000} showPercentage showAbsolute animated />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Danger (90%)</h4>
        <TokenUsageMeter used={3600} total={4000} showPercentage showAbsolute animated />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">At Limit (100%)</h4>
        <TokenUsageMeter used={4000} total={4000} showPercentage showAbsolute animated />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

/**
 * In chat interface context
 */
export const InChatInterface: Story = {
  render: () => (
    <div className="w-full max-w-2xl bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Chat Session</h3>
        <span className="text-sm text-muted-foreground">GPT-4 Turbo</span>
      </div>
      <TokenUsageMeter used={2400} total={4000} showPercentage showAbsolute animated />
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          You have 1,600 tokens remaining in this session.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    used: 2400,
    total: 4000,
    showPercentage: true,
    showAbsolute: true,
    animated: true,
  },
}
