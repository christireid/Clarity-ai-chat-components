import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { TokenCostPreview } from './TokenCostPreview'

/**
 * TokenCostPreview displays real-time token cost estimation for user input.
 * Perfect for giving users visibility into API costs before they submit.
 *
 * ## Features
 * - Real-time cost calculation
 * - Model-specific pricing
 * - Glassmorphism design support
 * - Inline and card variants
 * - Accessible with ARIA labels
 */
const meta = {
  title: 'Components/TokenCostPreview',
  component: TokenCostPreview,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Real-time token cost preview component that estimates API costs based on input text and selected model.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    // Default action handlers
    onCostChange: fn(),
    onError: fn(),
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Input text to estimate tokens for',
    },
    model: {
      control: 'select',
      options: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-3.5-turbo',
        'claude-3-5-sonnet-latest',
        'claude-3-5-haiku-latest',
        'claude-3-opus-latest',
      ],
      description: 'Model to calculate cost for',
    },
    variant: {
      control: 'radio',
      options: ['inline', 'card'],
      description: 'Display variant',
    },
    showBreakdown: {
      control: 'boolean',
      description: 'Show detailed token breakdown',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
} satisfies Meta<typeof TokenCostPreview>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic inline cost preview showing tokens and cost
 */
export const Default: Story = {
  args: {
    text: 'Hello, how are you today?',
    model: 'gpt-4o-mini',
    variant: 'inline',
  },
}

/**
 * Card variant with glassmorphism design
 */
export const CardVariant: Story = {
  args: {
    text: 'This is a longer message that demonstrates the card variant with glassmorphism styling. Perfect for highlighting cost information in a dedicated panel.',
    model: 'gpt-4o',
    variant: 'card',
  },
}

/**
 * Card variant showing detailed token breakdown
 */
export const WithBreakdown: Story = {
  args: {
    text: 'Show me the detailed breakdown of input vs output tokens and total cost.',
    model: 'claude-3-5-sonnet-latest',
    variant: 'card',
    showBreakdown: true,
  },
}

/**
 * Loading state while estimating tokens
 */
export const Loading: Story = {
  args: {
    text: 'Estimating...',
    model: 'gpt-4-turbo',
    loading: true,
  },
}

/**
 * Empty state with no input text
 */
export const Empty: Story = {
  args: {
    text: '',
    model: 'gpt-3.5-turbo',
  },
}

/**
 * Long text example showing larger token counts
 */
export const LongText: Story = {
  args: {
    text: `This is a much longer example text that will result in more tokens being counted.
    It demonstrates how the component handles larger inputs and displays higher costs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    model: 'gpt-4o',
    variant: 'card',
    showBreakdown: true,
  },
}

/**
 * Comparing costs across different models
 */
export const ModelComparison: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Model Cost Comparison</h3>
      <TokenCostPreview
        text="Compare costs for the same input across different models."
        model="gpt-4o"
        variant="card"
        showBreakdown
      />
      <TokenCostPreview
        text="Compare costs for the same input across different models."
        model="gpt-4o-mini"
        variant="card"
        showBreakdown
      />
      <TokenCostPreview
        text="Compare costs for the same input across different models."
        model="claude-3-5-haiku-latest"
        variant="card"
        showBreakdown
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

/**
 * Interactive playground for testing different inputs
 */
export const Playground: Story = {
  args: {
    text: 'Type your message here to see real-time cost estimation...',
    model: 'gpt-4o-mini',
    variant: 'card',
    showBreakdown: true,
  },
  parameters: {
    layout: 'padded',
  },
}
