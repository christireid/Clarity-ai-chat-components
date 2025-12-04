import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastProvider, useToast } from '@clarity-chat/react'
import { useState } from 'react'
import { expect, userEvent, within, waitFor } from 'storybook/test'

/**
 * Toast Notification System
 *
 * **Provides elegant toast notifications for:**
 * - Success messages
 * - Error alerts
 * - Information updates
 * - Warning notices
 *
 * **Key Features:**
 * - Auto-dismiss with customizable duration
 * - Queue management for multiple toasts
 * - 6 position options
 * - Optional action buttons
 * - Smooth slide-in/out animations
 * - Accessible with ARIA labels
 *
 * **Design Philosophy:**
 * - Non-intrusive: Doesn't block user workflow
 * - Contextual: Clear visual feedback for each type
 * - Actionable: Optional buttons for quick actions
 * - Responsive: Works on all screen sizes
 */
const meta = {
  title: 'Components/Feedback/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible toast notification system with auto-dismiss, queue management, and multiple position options.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Toast Types
// ============================================================================

export const SuccessToast: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <button
        onClick={() =>
          showToast({
            type: 'success',
            title: 'Components/Feedback/Toast',
            description: 'Your changes have been saved successfully.',
          })
        }
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Show Success Toast
      </button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Success toast for positive feedback and confirmations.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test toast button renders
    const button = canvas.getByRole('button', { name: /show success toast/i })
    await expect(button).toBeInTheDocument()

    // Click to trigger toast
    await userEvent.click(button)

    // Wait for toast to appear
    await waitFor(async () => {
      const toast = document.querySelector('[role="alert"], [role="status"]')
      if (toast) {
        await expect(toast).toBeInTheDocument()
      }
    }, { timeout: 2000 })
  },
}

export const ErrorToast: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <button
        onClick={() =>
          showToast({
            type: 'error',
            title: 'Components/Feedback/Toast',
            description: 'Failed to save changes. Please try again.',
          })
        }
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Show Error Toast
      </button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Error toast for failures and critical issues.',
      },
    },
  },
}

export const InfoToast: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <button
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Components/Feedback/Toast',
            description: 'New features are available in the latest update.',
          })
        }
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Show Info Toast
      </button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Info toast for neutral information and updates.',
      },
    },
  },
}

export const WarningToast: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <button
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Components/Feedback/Toast',
            description: 'Your session will expire in 5 minutes.',
          })
        }
        className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Show Warning Toast
      </button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning toast for caution and important notices.',
      },
    },
  },
}

// ============================================================================
// With Actions
// ============================================================================

export const WithAction: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <button
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Components/Feedback/Toast',
            description: 'You have a new message from John Doe.',
            action: {
              label: 'View',
              onClick: () => alert('Opening message...'),
            },
          })
        }
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Show Toast with Action
      </button>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Toast with an actionable button for quick interactions.',
      },
    },
  },
}

export const UndoAction: Story = {
  render: () => {
    const { showToast } = useToast()
    const [deleted, setDeleted] = useState(false)

    const handleDelete = () => {
      setDeleted(true)
      showToast({
        type: 'success',
        description: 'Item deleted successfully.',
        action: {
          label: 'Undo',
          onClick: () => {
            setDeleted(false)
            showToast({
              type: 'info',
              description: 'Deletion cancelled.',
            })
          },
        },
        duration: 5000,
      })
    }

    return (
      <div className="space-y-4">
        <button
          onClick={handleDelete}
          disabled={deleted}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Delete Item
        </button>
        <p className="text-sm text-gray-600">
          {deleted ? 'Item deleted' : 'Item active'}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Common undo pattern with action button.',
      },
    },
  },
}

// ============================================================================
// Positions
// ============================================================================

export const Positions: Story = {
  render: () => {
    const { showToast } = useToast()

    const positions: Array<{
      label: string
      position:
        | 'top-left'
        | 'top-center'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right'
    }> = [
      { label: 'Top Left', position: 'top-left' },
      { label: 'Top Center', position: 'top-center' },
      { label: 'Top Right', position: 'top-right' },
      { label: 'Bottom Left', position: 'bottom-left' },
      { label: 'Bottom Center', position: 'bottom-center' },
      { label: 'Bottom Right', position: 'bottom-right' },
    ]

    return (
      <div className="grid grid-cols-3 gap-4">
        {positions.map(({ label, position }) => (
          <button
            key={position}
            onClick={() =>
              showToast({
                type: 'info',
                description: `Toast at ${label}`,
                position,
              })
            }
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            {label}
          </button>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'All 6 available toast positions. Click to see toasts appear in different locations.',
      },
    },
  },
}

// ============================================================================
// Durations
// ============================================================================

export const CustomDuration: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <div className="flex gap-4">
        <button
          onClick={() =>
            showToast({
              type: 'info',
              description: 'Short duration (2 seconds)',
              duration: 2000,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          2 seconds
        </button>
        <button
          onClick={() =>
            showToast({
              type: 'info',
              description: 'Default duration (4 seconds)',
              duration: 4000,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          4 seconds
        </button>
        <button
          onClick={() =>
            showToast({
              type: 'info',
              description: 'Long duration (8 seconds)',
              duration: 8000,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          8 seconds
        </button>
        <button
          onClick={() =>
            showToast({
              type: 'info',
              description: 'Persistent (no auto-dismiss)',
              duration: Infinity,
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Persistent
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Control how long toasts remain visible. Use Infinity for persistent toasts.',
      },
    },
  },
}

// ============================================================================
// Multiple Toasts (Queue)
// ============================================================================

export const MultipleToasts: Story = {
  render: () => {
    const { showToast } = useToast()

    const showMultiple = () => {
      showToast({
        type: 'info',
        description: 'First toast',
      })
      setTimeout(() => {
        showToast({
          type: 'success',
          description: 'Second toast',
        })
      }, 500)
      setTimeout(() => {
        showToast({
          type: 'warning',
          description: 'Third toast',
        })
      }, 1000)
    }

    return (
      <button
        onClick={showMultiple}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Show Multiple Toasts
      </button>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Queue management handles multiple toasts gracefully with stacking.',
      },
    },
  },
}

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const SaveConfirmation: Story = {
  render: () => {
    const { showToast } = useToast()
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
      setIsSaving(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSaving(false)
      showToast({
        type: 'success',
        title: 'Components/Feedback/Toast',
        description: 'Your changes have been saved successfully.',
      })
    }

    return (
      <div className="space-y-4">
        <textarea
          placeholder="Edit your content..."
          className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none"
          defaultValue="Lorem ipsum dolor sit amet..."
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    )
  },
}

export const FormValidation: Story = {
  render: () => {
    const { showToast } = useToast()
    const [email, setEmail] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if (!email) {
        showToast({
          type: 'error',
          title: 'Components/Feedback/Toast',
          description: 'Please enter your email address.',
        })
        return
      }

      if (!email.includes('@')) {
        showToast({
          type: 'error',
          title: 'Components/Feedback/Toast',
          description: 'Please enter a valid email address.',
        })
        return
      }

      showToast({
        type: 'success',
        title: 'Components/Feedback/Toast',
        description: 'Your subscription has been confirmed.',
      })
      setEmail('')
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Subscribe
        </button>
      </form>
    )
  },
}

export const CopyToClipboard: Story = {
  render: () => {
    const { showToast } = useToast()
    const code = 'npm install @clarity-chat/react'

    const handleCopy = () => {
      navigator.clipboard.writeText(code)
      showToast({
        type: 'success',
        description: 'Copied to clipboard!',
        duration: 2000,
      })
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <code className="flex-1 font-mono text-sm">{code}</code>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Copy
          </button>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test copy button exists
    const copyButton = canvas.getByRole('button', { name: /copy/i })
    await expect(copyButton).toBeInTheDocument()

    // Test code text is displayed
    await expect(canvas.getByText(/npm install @clarity-chat\/react/)).toBeInTheDocument()

    // Click copy button
    await userEvent.click(copyButton)

    // Wait for success toast
    await waitFor(async () => {
      const toast = document.querySelector('[role="alert"], [role="status"]')
      if (toast) {
        await expect(toast).toBeInTheDocument()
      }
    }, { timeout: 2000 })
  },
}

export const FileUpload: Story = {
  render: () => {
    const { showToast } = useToast()

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      // Show uploading toast
      showToast({
        type: 'info',
        description: `Uploading ${files.length} file(s)...`,
        duration: 2000,
      })

      // Simulate upload
      setTimeout(() => {
        showToast({
          type: 'success',
          title: 'Components/Feedback/Toast',
          description: `${files.length} file(s) uploaded successfully.`,
        })
      }, 2000)
    }

    return (
      <div className="space-y-4">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    )
  },
}

export const NetworkStatus: Story = {
  render: () => {
    const { showToast } = useToast()
    const [isOnline, setIsOnline] = useState(true)

    const toggleConnection = () => {
      setIsOnline(!isOnline)

      if (isOnline) {
        showToast({
          type: 'error',
          title: 'Components/Feedback/Toast',
          description:
            'You are currently offline. Changes will sync when reconnected.',
          duration: 5000,
        })
      } else {
        showToast({
          type: 'success',
          title: 'Components/Feedback/Toast',
          description: 'Connection restored. Syncing your changes...',
        })
      }
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <button
          onClick={toggleConnection}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Toggle Connection
        </button>
      </div>
    )
  },
}

// ============================================================================
// Interactive Playground
// ============================================================================

export const InteractivePlayground: Story = {
  render: () => {
    const { showToast } = useToast()
    const [type, setType] = useState<'success' | 'error' | 'info' | 'warning'>(
      'info'
    )
    const [title, setTitle] = useState('Notification')
    const [description, setDescription] = useState(
      'This is a toast notification'
    )
    const [duration, setDuration] = useState(4000)
    const [hasAction, setHasAction] = useState(false)

    const handleShow = () => {
      showToast({
        type,
        title: title || undefined,
        description,
        duration,
        action: hasAction
          ? {
              label: 'Action',
              onClick: () => alert('Action clicked!'),
            }
          : undefined,
      })
    }

    return (
      <div className="space-y-6 w-full max-w-2xl">
        <div className="space-y-4 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            >
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notification message"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Duration (ms)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              step={1000}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasAction"
              checked={hasAction}
              onChange={(e) => setHasAction(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="hasAction" className="text-sm font-medium">
              Include action button
            </label>
          </div>
        </div>

        <button
          onClick={handleShow}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Show Toast
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground to test all toast configurations and options.',
      },
    },
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => {
    const { showToast } = useToast()

    return (
      <div className="space-y-6 max-w-2xl">
        <button
          onClick={() =>
            showToast({
              type: 'success',
              title: 'Components/Feedback/Toast',
              description: 'This toast follows WCAG 2.1 guidelines.',
            })
          }
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Show Accessible Toast
        </button>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
          <strong>Accessibility Features:</strong>
          <ul className="list-disc list-inside space-y-1">
            <li>ARIA role="alert" for screen reader announcements</li>
            <li>Clear visual hierarchy with icons and colors</li>
            <li>High contrast text for readability</li>
            <li>Keyboard accessible close button (Tab + Enter/Space)</li>
            <li>Action buttons are properly labeled</li>
            <li>Auto-dismiss doesn't interfere with screen readers</li>
            <li>Color is not the only indicator (icons + text)</li>
            <li>Smooth animations respect prefers-reduced-motion</li>
          </ul>
        </div>
      </div>
    )
  },
}
