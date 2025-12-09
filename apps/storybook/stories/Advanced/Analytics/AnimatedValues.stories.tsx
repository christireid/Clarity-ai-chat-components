import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  AnimatedNumber,
  FlashingValue,
  useAnimatedValue,
  useValueChange,
} from '@clarity-chat/react'

/**
 * **Animated Values**
 *
 * Utilities for animating numeric value changes in real-time dashboards.
 * Provides visual feedback when metrics update, respecting user's
 * prefers-reduced-motion setting.
 *
 * **Components & Hooks:**
 * - `useAnimatedValue`: Core hook for animated numbers
 * - `AnimatedNumber`: Component wrapper with formatting
 * - `useValueChange`: Track changes and trends
 * - `FlashingValue`: Highlight changes with flash effect
 *
 * **Features:**
 * - Smooth easing animations
 * - Direction indicators (up/down)
 * - Respects prefers-reduced-motion
 * - Accessible with aria-live regions
 */
const meta = {
  title: 'Advanced/Analytics/AnimatedValues',
  component: AnimatedNumber,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Real-time value animation utilities for dashboard metrics.

## Features

- ✅ Smooth number animations with easing
- ✅ Direction indicators (up/down highlighting)
- ✅ Respects prefers-reduced-motion
- ✅ Accessible with aria-live announcements
- ✅ Customizable duration and easing
- ✅ Flash highlighting for value changes

## Basic Usage

\`\`\`tsx
import { AnimatedNumber, useAnimatedValue } from '@clarity-chat/react'

// As a component
<AnimatedNumber
  value={tokenCount}
  suffix=" tokens"
  highlightChange
/>

// As a hook
const { formattedValue, direction } = useAnimatedValue(count, {
  duration: 300,
  prefix: '$',
})
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'The numeric value to animate',
      control: { type: 'number' },
    },
    duration: {
      description: 'Animation duration in milliseconds',
      control: { type: 'range', min: 100, max: 2000, step: 100 },
    },
    easing: {
      description: 'Easing function',
      control: { type: 'select' },
      options: ['linear', 'easeIn', 'easeOut', 'easeInOut'],
    },
    decimals: {
      description: 'Decimal places to display',
      control: { type: 'number', min: 0, max: 4 },
    },
    prefix: {
      description: 'Prefix string (e.g., "$")',
      control: { type: 'text' },
    },
    suffix: {
      description: 'Suffix string (e.g., "%")',
      control: { type: 'text' },
    },
    highlightChange: {
      description: 'Highlight increases/decreases with color',
      control: { type: 'boolean' },
    },
  },
  args: {
    value: 1234,
    duration: 500,
    easing: 'easeOut',
    decimals: 0,
    highlightChange: true,
  },
} satisfies Meta<typeof AnimatedNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(args.value)

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-4xl font-bold">
          <AnimatedNumber {...args} value={value} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-green-500 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20"
            onClick={() =>
              setValue((v) => v + Math.floor(Math.random() * 100) + 10)
            }
          >
            Increase
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-500/20"
            onClick={() =>
              setValue((v) =>
                Math.max(0, v - Math.floor(Math.random() * 100) - 10)
              )
            }
          >
            Decrease
          </button>
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
            onClick={() => setValue(Math.floor(Math.random() * 10000))}
          >
            Random
          </button>
        </div>
      </div>
    )
  },
}

export const TokenCounter: Story = {
  name: 'Token Counter Example',
  render: () => {
    const [tokens, setTokens] = React.useState(4523)

    React.useEffect(() => {
      const interval = setInterval(() => {
        // Simulate token usage fluctuation
        setTokens((t) => t + Math.floor(Math.random() * 50) - 10)
      }, 2000)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="rounded-lg border border-border bg-card p-6 min-w-[200px]">
        <p className="text-xs text-muted-foreground mb-1">Token Usage</p>
        <div className="text-3xl font-bold">
          <AnimatedNumber
            value={tokens}
            suffix=" tokens"
            highlightChange
            duration={300}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Updates every 2 seconds
        </p>
      </div>
    )
  },
}

export const CurrencyDisplay: Story = {
  name: 'Currency Display',
  render: () => {
    const [amount, setAmount] = React.useState(1234.56)

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground mb-1">Revenue</p>
          <div className="text-3xl font-bold">
            <AnimatedNumber
              value={amount}
              prefix="$"
              decimals={2}
              highlightChange
              duration={400}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-green-500 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20"
            onClick={() => setAmount((a) => a + Math.random() * 100)}
          >
            +Revenue
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-500/20"
            onClick={() =>
              setAmount((a) => Math.max(0, a - Math.random() * 50))
            }
          >
            -Refund
          </button>
        </div>
      </div>
    )
  },
}

export const PercentageMetric: Story = {
  name: 'Percentage Metric',
  render: () => {
    const [percent, setPercent] = React.useState(75.3)

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
          <div className="text-3xl font-bold">
            <AnimatedNumber
              value={percent}
              suffix="%"
              decimals={1}
              highlightChange
              easing="easeInOut"
            />
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={percent}
          onChange={(e) => setPercent(parseFloat(e.target.value))}
          className="w-48"
        />
      </div>
    )
  },
}

export const UseAnimatedValueHook: Story = {
  name: 'useAnimatedValue Hook',
  render: () => {
    const [value, setValue] = React.useState(500)
    const result = useAnimatedValue(value, {
      duration: 600,
      prefix: '',
      suffix: ' ms',
      easing: 'easeOut',
    })

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm max-w-md">
          <p className="font-medium mb-2">Hook Return Values:</p>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify(
              {
                displayValue: result.displayValue.toFixed(2),
                formattedValue: result.formattedValue,
                isAnimating: result.isAnimating,
                targetValue: result.targetValue,
                direction: result.direction,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="text-4xl font-bold">
          <span
            {...result.ariaProps}
            className={
              result.direction === 'up'
                ? 'text-green-600'
                : result.direction === 'down'
                  ? 'text-red-600'
                  : ''
            }
          >
            {result.formattedValue}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
            onClick={() => setValue((v) => v + 100)}
          >
            +100
          </button>
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
            onClick={() => setValue((v) => Math.max(0, v - 100))}
          >
            -100
          </button>
        </div>
      </div>
    )
  },
}

export const FlashingValueDemo: Story = {
  name: 'Flashing Value',
  render: () => {
    const [count, setCount] = React.useState(42)

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground mb-1">Message Count</p>
          <div className="text-3xl font-bold">
            <FlashingValue
              value={count}
              flashClassName="bg-yellow-200 dark:bg-yellow-800/30 rounded px-1"
              flashDuration={600}
            >
              {count} messages
            </FlashingValue>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          onClick={() => setCount((c) => c + 1)}
        >
          Add Message
        </button>
      </div>
    )
  },
}

export const UseValueChangeHook: Story = {
  name: 'useValueChange Hook',
  render: () => {
    const [value, setValue] = React.useState(1000)
    const { previousValue, change, changePercent, trend, flash } =
      useValueChange(value, { threshold: 0.5 })

    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className={`rounded-lg border border-border bg-card p-6 transition-colors ${
            flash ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''
          }`}
        >
          <p className="text-xs text-muted-foreground mb-1">Active Users</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {trend !== 'stable' && (
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {changePercent > 0 ? '+' : ''}
                {changePercent.toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Previous: {previousValue} | Change: {change > 0 ? '+' : ''}
            {change}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-green-500 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20"
            onClick={() =>
              setValue((v) => v + Math.floor(Math.random() * 50) + 10)
            }
          >
            Users Join
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-500/20"
            onClick={() =>
              setValue((v) =>
                Math.max(0, v - Math.floor(Math.random() * 30) - 5)
              )
            }
          >
            Users Leave
          </button>
        </div>
      </div>
    )
  },
}

export const DashboardMetrics: Story = {
  name: 'Dashboard Metrics Grid',
  render: () => {
    const [metrics, setMetrics] = React.useState({
      tokens: 45230,
      messages: 1234,
      latency: 145.5,
      uptime: 99.97,
    })

    React.useEffect(() => {
      const interval = setInterval(() => {
        setMetrics((m) => ({
          tokens: m.tokens + Math.floor(Math.random() * 100) - 30,
          messages: m.messages + Math.floor(Math.random() * 5),
          latency: Math.max(50, m.latency + (Math.random() * 20 - 10)),
          uptime: Math.min(
            100,
            Math.max(99, m.uptime + (Math.random() * 0.02 - 0.01))
          ),
        }))
      }, 2500)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Tokens Used</p>
          <div className="text-2xl font-bold">
            <AnimatedNumber
              value={metrics.tokens}
              highlightChange
              duration={300}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Messages</p>
          <div className="text-2xl font-bold">
            <AnimatedNumber
              value={metrics.messages}
              highlightChange
              duration={300}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
          <div className="text-2xl font-bold">
            <AnimatedNumber
              value={metrics.latency}
              suffix="ms"
              decimals={1}
              highlightChange
              duration={300}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Uptime</p>
          <div className="text-2xl font-bold">
            <AnimatedNumber
              value={metrics.uptime}
              suffix="%"
              decimals={2}
              highlightChange
              duration={300}
            />
          </div>
        </div>
      </div>
    )
  },
}

export const EasingComparison: Story = {
  name: 'Easing Functions Comparison',
  render: () => {
    const [value, setValue] = React.useState(0)
    const easings = ['linear', 'easeIn', 'easeOut', 'easeInOut'] as const

    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">
          Compare different easing functions side by side
        </p>

        <div className="grid grid-cols-4 gap-4">
          {easings.map((easing) => (
            <div
              key={easing}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <p className="text-xs text-muted-foreground mb-2 font-mono">
                {easing}
              </p>
              <div className="text-2xl font-bold">
                <AnimatedNumber value={value} easing={easing} duration={1000} />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
          onClick={() => setValue((v) => (v === 0 ? 1000 : 0))}
        >
          Toggle Value (0 ↔ 1000)
        </button>
      </div>
    )
  },
}
