import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  FeedbackAnimation,
  SuccessCheckmark,
  ErrorShake,
  PulseAttention,
} from '@clarity-chat/react'

const meta = {
  title: 'Foundations/Micro-Interactions/Feedback Animation',
  component: FeedbackAnimation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Micro-interactions that mirror the polish seen in Linear, Stripe, and Shopify Polaris design systems. Use them to confirm actions, highlight errors, and guide focus without overwhelming users.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    message: {
      control: 'text',
    },
    duration: {
      control: { type: 'number', min: 0, step: 250 },
    },
  },
  args: {
    type: 'success',
    message: 'Changes published to production',
    duration: 2000,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackAnimation>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [show, setShow] = React.useState(true)

    React.useEffect(() => {
      if (!show) {
        const timer = setTimeout(() => setShow(true), 400)
        return () => clearTimeout(timer)
      }
      return undefined
    }, [show])

    return (
      <div className="flex flex-col items-center gap-4">
        <FeedbackAnimation {...args} show={show} onComplete={() => setShow(false)} />
        <button
          type="button"
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-accent"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? 'Replay' : 'Play animation'}
        </button>
      </div>
    )
  },
}

export const Library: Story = {
  name: 'Animation Library',
  render: () => {
    const [shake, setShake] = React.useState(false)
    const [pulse, setPulse] = React.useState(true)

    return (
      <div className="flex max-w-4xl flex-col gap-8">
        <div className="grid gap-6 md:grid-cols-2">
          {(['success', 'error', 'warning', 'info'] as const).map((type) => (
            <FeedbackAnimation
              key={type}
              type={type}
              show
              duration={0}
              message={`FeedbackAnimation type="${type}"`}
              className="min-h-[180px]"
            />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
            <SuccessCheckmark show size={64} />
            <p className="text-xs text-muted-foreground">Use after optimistic saves succeed.</p>
          </div>
          <ErrorShake trigger={shake} className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-semibold text-destructive">Incorrect API key</p>
            <p className="text-xs text-muted-foreground">The field shakes to highlight the error.</p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-destructive px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
              onClick={() => {
                setShake(false)
                requestAnimationFrame(() => setShake(true))
              }}
            >
              Trigger shake
            </button>
          </ErrorShake>
          <PulseAttention active={pulse} className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-semibold text-foreground">Awaiting approval</p>
            <p className="text-xs text-muted-foreground">Pulse draws attention without blocking interaction.</p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-border px-3 py-1 text-xs hover:bg-accent"
              onClick={() => setPulse((prev) => !prev)}
            >
              Toggle pulse
            </button>
          </PulseAttention>
        </div>
      </div>
    )
  },
}
