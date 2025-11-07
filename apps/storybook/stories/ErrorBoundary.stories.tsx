import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  ErrorBoundary,
  ErrorBoundaryEnhanced,
  ErrorReporterProvider,
  createConsoleErrorProvider,
} from '@clarity-chat/react'

const SimulatedWidget: React.FC<{ explode: boolean }> = ({ explode }) => {
  if (explode) {
    throw new Error('Simulated failure: downstream embedding service not responding')
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-6 text-left shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Analytics Stream</h3>
      <p className="text-xs text-muted-foreground">
        This widget renders live metrics from the agent run feed. Toggle the button below to simulate a runtime error.
      </p>
    </div>
  )
}

/**
 * **ErrorBoundary Component**
 * 
 * Production-ready React error boundaries with enhanced reporting
 * and recovery mechanisms.
 * 
 * **Key Features:**
 * - Default and custom fallback UIs
 * - Error reporting integration
 * - Reset functionality
 * - Reset keys for automatic recovery
 * - Enhanced error boundary with telemetry
 * - Error context preservation
 * 
 * **Use Cases:**
 * - Application-wide error handling
 * - Component-level error boundaries
 * - Error reporting and monitoring
 * - Graceful degradation
 */
const meta = {
  title: 'Foundations/Error Handling/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Production-ready React error boundaries with enhanced reporting
and recovery mechanisms.

## Features

- ✅ Default and custom fallback UIs
- ✅ Error reporting integration
- ✅ Reset functionality
- ✅ Reset keys for automatic recovery
- ✅ Enhanced error boundary with telemetry
- ✅ Error context preservation
- ✅ Accessible error messages

## Basic Usage

\`\`\`tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
  resetKeys={[someKey]}
>
  <YourComponent />
</ErrorBoundary>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fallback: {
      description: 'Custom fallback component function',
      control: { type: 'object' },
    },
    resetKeys: {
      description: 'Array of values that trigger boundary reset when changed',
      control: { type: 'object' },
    },
    onError: {
      description: 'Callback when error is caught',
      action: 'error-caught',
    },
    onReset: {
      description: 'Callback when boundary is reset',
      action: 'reset',
    },
  },
} satisfies Meta<typeof ErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultFallback: Story = {
  render: (args) => {
    const [explode, setExplode] = React.useState(false)
    const [resetKey, setResetKey] = React.useState(0)

    return (
      <div className="flex max-w-xl flex-col gap-4">
        <ErrorBoundary {...args} resetKeys={[resetKey]}>
          <SimulatedWidget explode={explode} />
          <button
            type="button"
            className="w-fit rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setExplode(true)}
          >
            Trigger Failure
          </button>
        </ErrorBoundary>

        <button
          type="button"
          className="w-fit rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10"
          onClick={() => {
            setExplode(false)
            setResetKey((prev) => prev + 1)
          }}
        >
          Reset boundary
        </button>
      </div>
    )
  },
  args: {
    fallback: undefined,
  },
}

export const CustomFallback: Story = {
  render: () => {
    const [explode, setExplode] = React.useState(false)

    return (
      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="flex max-w-lg flex-col gap-3 rounded-xl border border-warning bg-warning/10 p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-warning">Graceful degradation</h3>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent"
                onClick={() => reset()}
              >
                Retry render
              </button>
              <button
                type="button"
                className="rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent"
                onClick={() => alert('Opening status page...')}
              >
                View status page
              </button>
            </div>
          </div>
        )}
      >
        <div className="flex max-w-xl flex-col gap-4">
          <SimulatedWidget explode={explode} />
          <button
            type="button"
            className="w-fit rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setExplode(true)}
          >
            Trigger Failure
          </button>
        </div>
      </ErrorBoundary>
    )
  },
}

export const EnhancedWithTelemetry: Story = {
  name: 'Enhanced Boundary with Telemetry',
  render: () => {
    const [explode, setExplode] = React.useState(false)

    return (
      <ErrorReporterProvider
        config={{
          providers: [createConsoleErrorProvider()],
          enabled: true,
          autoReport: true,
          enableFeedback: true,
        }}
      >
        <ErrorBoundaryEnhanced
          enableFeedback
          severity="error"
          errorContext={{ surface: 'SessionSummaryCard' }}
          onError={(error) => console.info('[Storybook] Error captured', error.message)}
          fallback={(error, reset, showFeedback) => (
            <div className="flex max-w-lg flex-col gap-3 rounded-xl border border-destructive bg-destructive/10 p-6 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-destructive">Session summary failed</h3>
                <p className="text-xs text-destructive/80">{error.message}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-destructive px-3 py-1 text-xs text-destructive-foreground hover:opacity-90"
                  onClick={() => {
                    setExplode(false)
                    reset()
                  }}
                >
                  Retry render
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent"
                  onClick={() => {
                    showFeedback()
                    alert('Feedback dialog opened via ErrorBoundaryEnhanced context')
                  }}
                >
                  Share feedback
                </button>
              </div>
            </div>
          )}
        >
          <div className="flex max-w-xl flex-col gap-4">
            <SimulatedWidget explode={explode} />
            <button
              type="button"
              className="w-fit rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setExplode(true)}
            >
              Trigger Failure
            </button>
          </div>
        </ErrorBoundaryEnhanced>
      </ErrorReporterProvider>
    )
  },
}
