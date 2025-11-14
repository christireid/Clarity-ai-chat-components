import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, Button } from '@clarity-chat/primitives'

/**
 * Tooltip component for displaying helpful information on hover.
 * 
 * **Key Features:**
 * - Appears on hover/focus
 * - Positioned relative to trigger
 * - Arrow indicator support
 * - Accessible with ARIA attributes
 * - Smooth animations
 * 
 * **Best Practices:**
 * - Use for helpful hints and additional information
 * - Keep content concise (1-2 lines)
 * - Don't use for critical information
 */
const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltip component for displaying helpful information on hover or focus.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip content="This is a helpful tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  ),
}

export const WithArrow: Story = {
  render: () => (
    <Tooltip content="Tooltip with arrow indicator" showArrow>
      <Button>Hover me</Button>
    </Tooltip>
  ),
}

export const DifferentPositions: Story = {
  render: () => {
    const positions: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left']
    
    return (
      <div className="flex flex-col gap-8 items-center">
        {positions.map((side) => (
          <Tooltip key={side} content={`Tooltip on ${side}`} side={side} showArrow>
            <Button variant="outline">{side.charAt(0).toUpperCase() + side.slice(1)}</Button>
          </Tooltip>
        ))}
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => (
    <Tooltip content="This is a longer tooltip message that provides more detailed information about the element you're hovering over.">
      <Button>Hover for details</Button>
    </Tooltip>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Tooltip content="Click to save your changes">
      <Button>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Save
      </Button>
    </Tooltip>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tooltip content="This tooltip is disabled" disabled>
      <Button disabled>Disabled Button</Button>
    </Tooltip>
  ),
}

export const WithoutArrow: Story = {
  render: () => (
    <Tooltip content="Tooltip without arrow" showArrow={false}>
      <Button variant="ghost">Hover me</Button>
    </Tooltip>
  ),
}

export const CustomDelay: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <Tooltip content="Default delay (200ms)" delay={200}>
        <Button>Default Delay</Button>
      </Tooltip>
      <Tooltip content="Fast delay (100ms)" delay={100}>
        <Button>Fast Delay</Button>
      </Tooltip>
      <Tooltip content="Slow delay (500ms)" delay={500}>
        <Button>Slow Delay</Button>
      </Tooltip>
    </div>
  ),
}
