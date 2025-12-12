import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button, type ButtonState } from '../components/button'

/**
 * Button component with loading states, ripple effects, and full accessibility.
 *
 * ## Features
 * - Multiple visual variants (default, destructive, outline, secondary, ghost, link)
 * - Loading, success, and error states with animations
 * - Material Design ripple effect
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader announcements for state changes
 * - Respects `prefers-reduced-motion` for accessibility
 *
 * ## Accessibility
 * - Follows WAI-ARIA Button pattern
 * - Uses `aria-busy` for loading state
 * - Announces state changes to screen readers
 * - Supports keyboard activation
 */
const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An enhanced button component built on shadcn/ui and Radix UI primitives with loading states,
ripple effects, and full accessibility support.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'success',
        'error',
        'surface',
      ],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size variant',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    ripple: {
      control: 'boolean',
      description: 'Enable ripple effect on click',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

/**
 * Default button state
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

/**
 * All button variants displayed together
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="success">Success</Button>
      <Button variant="surface">Surface</Button>
    </div>
  ),
}

/**
 * All button sizes displayed together
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Button>
    </div>
  ),
}

/**
 * Button with loading state
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
}

/**
 * Interactive state management example
 */
export const StatefulButton: Story = {
  render: function Render() {
    const [state, setState] = useState<ButtonState>('idle')

    const handleClick = async () => {
      setState('loading')
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Randomly succeed or fail
      setState(Math.random() > 0.3 ? 'success' : 'error')
    }

    return (
      <div className="flex flex-col gap-4 items-center">
        <Button state={state} onClick={handleClick}>
          {state === 'idle' && 'Submit'}
          {state === 'loading' && 'Submitting...'}
          {state === 'success' && 'Done!'}
          {state === 'error' && 'Failed'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Current state: <code>{state}</code>
        </p>
        <Button variant="outline" size="sm" onClick={() => setState('idle')}>
          Reset
        </Button>
      </div>
    )
  },
}

/**
 * Button with ripple effect disabled
 */
export const NoRipple: Story = {
  args: {
    ripple: false,
    children: 'No Ripple Effect',
  },
}

/**
 * Disabled button state
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button disabled>Disabled Default</Button>
      <Button disabled variant="secondary">
        Disabled Secondary
      </Button>
      <Button disabled variant="outline">
        Disabled Outline
      </Button>
    </div>
  ),
}

/**
 * Button with custom content (icons)
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        Download
      </Button>
      <Button variant="outline">
        Settings
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>
    </div>
  ),
}

/**
 * Accessibility demo - button states announce to screen readers
 */
export const AccessibilityDemo: Story = {
  render: function Render() {
    const [state, setState] = useState<ButtonState>('idle')

    return (
      <div className="flex flex-col gap-4 items-center max-w-md">
        <p className="text-sm text-muted-foreground text-center">
          Enable a screen reader to hear state change announcements. Or check
          the live region in the DOM inspector.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setState('loading')}>Start Loading</Button>
          <Button variant="outline" onClick={() => setState('success')}>
            Success
          </Button>
          <Button variant="destructive" onClick={() => setState('error')}>
            Error
          </Button>
          <Button variant="ghost" onClick={() => setState('idle')}>
            Reset
          </Button>
        </div>
        <Button state={state} className="min-w-[200px]">
          {state === 'idle' && 'Click a button above'}
          {state === 'loading' && 'Processing...'}
          {state === 'success' && 'Success!'}
          {state === 'error' && 'Error occurred'}
        </Button>
      </div>
    )
  },
}
