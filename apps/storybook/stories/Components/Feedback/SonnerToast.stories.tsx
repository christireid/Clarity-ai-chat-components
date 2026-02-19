import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ClarityToaster, toast } from '@clarity-chat/react'

/**
 * Sonner-Based Toast Notifications
 *
 * **Modern toast notifications powered by Sonner (MIT license).**
 *
 * **Key Features:**
 * - Promise-based toasts for async operations
 * - Rich colors with semantic meaning
 * - Stackable with expand option
 * - Action buttons with callbacks
 * - Accessible and customizable
 *
 * **Recommended for:**
 * - New projects
 * - Apps needing promise-based toasts
 * - Modern, polished UI requirements
 */

const ToastDemo = () => {
  const showSuccess = () => {
    toast.success('Operation completed successfully!')
  }

  const showError = () => {
    toast.error('Something went wrong. Please try again.')
  }

  const showInfo = () => {
    toast.info('Here is some helpful information.')
  }

  const showWarning = () => {
    toast.warning('Please review before continuing.')
  }

  const showLoading = () => {
    const id = toast.loading('Processing your request...')
    setTimeout(() => {
      toast.success('Done!', { id })
    }, 2000)
  }

  const showPromise = () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000))
    toast.promise(promise, {
      loading: 'Saving changes...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes.',
    })
  }

  const showWithAction = () => {
    toast.info('Message sent', {
      action: {
        label: 'Undo',
        onClick: () => toast.success('Action undone!'),
      },
    })
  }

  const showWithDescription = () => {
    toast.success('File uploaded', {
      description: 'document.pdf has been uploaded to your workspace.',
    })
  }

  const showCustomDuration = () => {
    toast.info('This will stay for 10 seconds', {
      duration: durations.slower,
    })
  }

  const showDismissible = () => {
    toast.info('Click the X to dismiss', {
      dismissible: true,
    })
  }

  return (
    <div className="p-8 space-y-8">
      <ClarityToaster position="bottom-right" richColors />

      <div>
        <h3 className="text-lg font-semibold mb-4">Toast Types</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={showSuccess}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Success
          </button>
          <button
            onClick={showError}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Error
          </button>
          <button
            onClick={showInfo}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Info
          </button>
          <button
            onClick={showWarning}
            className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Warning
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Async Patterns</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={showLoading}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Loading → Success
          </button>
          <button
            onClick={showPromise}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Promise Toast
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={showWithAction}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            With Action
          </button>
          <button
            onClick={showWithDescription}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            With Description
          </button>
          <button
            onClick={showCustomDuration}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Long Duration
          </button>
          <button
            onClick={showDismissible}
            className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
          >
            Dismissible
          </button>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: 'Components/Feedback/SonnerToast',
  component: ClarityToaster,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Beautiful toast notifications powered by Sonner (MIT license). Supports success, error, info, warning, loading states, promise-based toasts, and actions. Recommended for new projects.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['new', 'stable', 'accessible'],
  },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    richColors: { control: 'boolean' },
    expand: { control: 'boolean' },
    closeButton: { control: 'boolean' },
    duration: { control: { type: 'number', min: 1000, max: 10000 } },
  },
  args: {
    position: 'bottom-right',
    richColors: true,
    expand: false,
    closeButton: false,
    duration: durations.slower,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ClarityToaster>

export default meta
type Story = StoryObj<typeof meta>

export const AllToastTypes: Story = {
  render: () => <ToastDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showcasing all toast types and options.',
      },
    },
  },
}

export const PromiseToast: Story = {
  render: () => {
    const simulateAsync = () => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve('done')
          } else {
            reject(new Error('failed'))
          }
        }, 2000)
      })

      toast.promise(promise, {
        loading: 'Processing...',
        success: 'Operation completed!',
        error: 'Operation failed. Please retry.',
      })
    }

    return (
      <div className="p-8">
        <ClarityToaster position="bottom-right" richColors />
        <button
          onClick={simulateAsync}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Start Async Operation
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          70% chance of success, 30% chance of failure
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Promise-based toasts automatically show loading, success, or error states based on promise resolution.',
      },
    },
  },
}

export const TopPosition: Story = {
  render: () => {
    const showToast = () => toast.success('Toast at the top!')
    return (
      <div className="p-8">
        <ClarityToaster position="top-center" richColors />
        <button
          onClick={showToast}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Show Top Toast
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Toast notifications positioned at the top center.',
      },
    },
  },
}

export const WithCloseButton: Story = {
  render: () => {
    const showToast = () =>
      toast.info('This toast has a close button', { dismissible: true })
    return (
      <div className="p-8">
        <ClarityToaster position="bottom-right" richColors closeButton />
        <button
          onClick={showToast}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Show Toast with Close
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Toasts with an explicit close button for better accessibility.',
      },
    },
  },
}

export const ExpandedToasts: Story = {
  render: () => {
    const showMultiple = () => {
      toast.success('First notification')
      setTimeout(() => toast.info('Second notification'), 500)
      setTimeout(() => toast.warning('Third notification'), 1000)
    }
    return (
      <div className="p-8">
        <ClarityToaster position="bottom-right" richColors expand />
        <button
          onClick={showMultiple}
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
        >
          Show Multiple (Expanded)
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Multiple toasts expand to show all at once instead of stacking.',
      },
    },
  },
}

export const ChatIntegration: Story = {
  render: () => {
    const simulateSend = () => {
      const promise = new Promise((resolve) => setTimeout(resolve, 1500))
      toast.promise(promise, {
        loading: 'Sending message...',
        success: 'Message sent!',
        error: 'Failed to send message. Tap to retry.',
      })
    }

    const simulateError = () => {
      toast.error('Connection lost', {
        description: 'Attempting to reconnect...',
        duration: durations.slower,
      })
    }

    const simulateCopy = () => {
      toast.success('Copied to clipboard')
    }

    return (
      <div className="p-8 space-y-4">
        <ClarityToaster position="bottom-right" richColors />
        <h3 className="text-lg font-semibold">Chat-specific Toasts</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={simulateSend}
            className="px-4 py-2 rounded bg-primary text-primary-foreground"
          >
            Send Message
          </button>
          <button
            onClick={simulateError}
            className="px-4 py-2 rounded bg-destructive text-destructive-foreground"
          >
            Connection Error
          </button>
          <button onClick={simulateCopy} className="px-4 py-2 rounded bg-muted">
            Copy Message
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Common toast patterns for chat applications.',
      },
    },
  },
}

export const ComparisonWithLegacy: Story = {
  render: () => (
    <div className="p-8 space-y-6">
      <ClarityToaster position="bottom-right" richColors />

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold mb-2">Sonner Toast (Recommended)</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Promise-based toasts for async operations</li>
          <li>Rich colors with semantic meaning</li>
          <li>Lightweight (~4KB gzipped)</li>
          <li>MIT licensed, well-tested</li>
        </ul>
        <button
          onClick={() => toast.success('Using Sonner!')}
          className="mt-3 px-4 py-2 rounded bg-primary text-primary-foreground text-sm"
        >
          Try Sonner Toast
        </button>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Legacy Toast (Internal)</h3>
        <p className="text-sm text-muted-foreground">
          The legacy toast system (useToast from internal) is still available
          for backwards compatibility. For new projects, we recommend using
          ClarityToaster with the toast API.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison between the new Sonner-based toasts and the legacy internal toast system.',
      },
    },
  },
}
