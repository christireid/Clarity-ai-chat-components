import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  DashboardErrorBoundary,
  useDashboardErrorHandler,
} from '@clarity-chat/react'

const BrokenWidget: React.FC<{ shouldBreak: boolean }> = ({ shouldBreak }) => {
  if (shouldBreak) {
    throw new Error('Widget failed to load data from API')
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">Working Widget</h3>
      <p className="text-xs text-muted-foreground mt-1">
        This widget is functioning normally.
      </p>
    </div>
  )
}

const AsyncErrorWidget: React.FC = () => {
  const { showBoundary } = useDashboardErrorHandler()
  const [loading, setLoading] = React.useState(false)

  const simulateAsyncError = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    showBoundary(new Error('Network request failed: Connection timeout'))
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground">Async Widget</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-3">
        Click the button to simulate an async error.
      </p>
      <button
        type="button"
        onClick={simulateAsyncError}
        disabled={loading}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Simulate API Error'}
      </button>
    </div>
  )
}

/**
 * **DashboardErrorBoundary**
 *
 * Error boundary specifically designed for dashboard widgets.
 * Isolates widget failures to prevent full dashboard crashes.
 *
 * **Key Features:**
 * - Widget-level error isolation
 * - Custom fallback UI support
 * - Built-in retry functionality
 * - Error callback for logging/reporting
 * - Hook for async/event handler errors
 *
 * **Use Cases:**
 * - Dashboard widget error handling
 * - Graceful degradation of analytics components
 * - Error reporting and monitoring
 */
const meta = {
  title: 'Advanced/Analytics/DashboardErrorBoundary',
  component: DashboardErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Error boundary specifically designed for dashboard widgets.
Isolates widget failures to prevent full dashboard crashes.

## Features

- ✅ Widget-level error isolation
- ✅ Custom fallback UI support
- ✅ Built-in retry functionality
- ✅ Error callback for logging/reporting
- ✅ Accessible error messages with ARIA roles
- ✅ Hook for async/event handler errors

## Basic Usage

\`\`\`tsx
<DashboardErrorBoundary
  widgetName="Analytics"
  onError={(error) => logToService(error)}
>
  <AnalyticsWidget />
</DashboardErrorBoundary>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    widgetName: {
      description: 'Name of the widget for error context',
      control: { type: 'text' },
    },
    showRetry: {
      description: 'Whether to show the retry button',
      control: { type: 'boolean' },
    },
    fallback: {
      description: 'Custom fallback UI component',
      control: { type: 'object' },
    },
    onError: {
      description: 'Callback when an error is caught',
      action: 'error-caught',
    },
  },
} satisfies Meta<typeof DashboardErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [shouldBreak, setShouldBreak] = React.useState(false)
    const [key, setKey] = React.useState(0)

    return (
      <div className="flex flex-col gap-4 max-w-md">
        <DashboardErrorBoundary {...args} key={key} widgetName="Analytics">
          <BrokenWidget shouldBreak={shouldBreak} />
        </DashboardErrorBoundary>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-destructive bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
            onClick={() => setShouldBreak(true)}
          >
            Trigger Error
          </button>
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
            onClick={() => {
              setShouldBreak(false)
              setKey((prev) => prev + 1)
            }}
          >
            Reset
          </button>
        </div>
      </div>
    )
  },
  args: {
    showRetry: true,
  },
}

export const CustomFallback: Story = {
  render: () => {
    const [shouldBreak, setShouldBreak] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 max-w-md">
        <DashboardErrorBoundary
          widgetName="Performance"
          fallback={
            <div className="rounded-lg border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-6 text-center">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Performance widget temporarily unavailable
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                Data will refresh automatically in 30 seconds
              </p>
            </div>
          }
        >
          <BrokenWidget shouldBreak={shouldBreak} />
        </DashboardErrorBoundary>

        <button
          type="button"
          className="w-fit rounded-lg border border-destructive bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
          onClick={() => setShouldBreak(true)}
        >
          Trigger Error
        </button>
      </div>
    )
  },
}

export const AsyncErrorHandling: Story = {
  name: 'Async Error Handling with Hook',
  render: () => {
    return (
      <div className="max-w-md">
        <DashboardErrorBoundary
          widgetName="API Data"
          onError={(error) =>
            console.log('[Storybook] Async error caught:', error.message)
          }
        >
          <AsyncErrorWidget />
        </DashboardErrorBoundary>
      </div>
    )
  },
}

export const MultipleWidgets: Story = {
  name: 'Multiple Isolated Widgets',
  render: () => {
    const [brokenWidgets, setBrokenWidgets] = React.useState<Set<number>>(
      new Set()
    )

    const toggleWidget = (id: number) => {
      setBrokenWidgets((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    }

    const widgets = [
      { id: 1, name: 'Usage Stats' },
      { id: 2, name: 'Token Metrics' },
      { id: 3, name: 'Performance' },
    ]

    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <p className="text-sm text-muted-foreground mb-2">
          Click on widgets to break/fix them. Notice how errors are isolated.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {widgets.map((widget) => (
            <DashboardErrorBoundary
              key={widget.id}
              widgetName={widget.name}
              onError={(error) =>
                console.log(`[${widget.name}] Error:`, error.message)
              }
            >
              <div
                className="rounded-lg border border-border bg-card p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => toggleWidget(widget.id)}
              >
                {brokenWidgets.has(widget.id) ? (
                  (() => {
                    throw new Error(`${widget.name} encountered an error`)
                  })()
                ) : (
                  <>
                    <h4 className="text-sm font-semibold">{widget.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to simulate error
                    </p>
                  </>
                )}
              </div>
            </DashboardErrorBoundary>
          ))}
        </div>
      </div>
    )
  },
}

export const WithoutRetry: Story = {
  name: 'Without Retry Button',
  render: () => {
    const [shouldBreak, setShouldBreak] = React.useState(false)

    return (
      <div className="flex flex-col gap-4 max-w-md">
        <DashboardErrorBoundary widgetName="Critical Widget" showRetry={false}>
          <BrokenWidget shouldBreak={shouldBreak} />
        </DashboardErrorBoundary>

        <button
          type="button"
          className="w-fit rounded-lg border border-destructive bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
          onClick={() => setShouldBreak(true)}
        >
          Trigger Error
        </button>
      </div>
    )
  },
}
