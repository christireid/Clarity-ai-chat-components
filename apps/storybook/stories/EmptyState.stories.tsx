import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { EmptyState } from '@clarity-chat/react'
import { Database } from 'lucide-react'

/**
 * Empty State Components
 * 
 * **Comprehensive empty states for all scenarios:**
 * - No data or content
 * - No search results
 * - No conversations
 * - Error states
 * - Success states
 * 
 * **Design Philosophy:**
 * - Clear Communication: Users always know what's happening
 * - Actionable: Provide clear next steps
 * - Delightful: Smooth animations and friendly icons
 * - Contextual: Different states for different scenarios
 */
const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Empty state components that gracefully handle no-data scenarios with clear messaging and actionable next steps.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading for the empty state',
    },
    description: {
      control: 'text',
      description: 'Supporting description text',
    },
    icon: {
      control: false,
      description: 'Custom icon element (React node)',
    },
    action: {
      control: false,
      description: 'Primary action button configuration',
    },
    secondaryAction: {
      control: false,
      description: 'Secondary action button configuration',
    },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Base Empty State
// ============================================================================

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'Get started by creating your first item.',
    action: {
      label: 'Create Item',
      onClick: () => alert('Create clicked!'),
      variant: 'default',
    },
  },
}

// ============================================================================
// Preset Empty States
// ============================================================================

export const NoData: Story = {
  render: () => (
    <EmptyState
      icon={<Database className="text-primary" size={32} />}
      title="No data yet"
      description="Get started by adding your first item"
      action={{
        label: 'Get Started',
        onClick: () => alert('Get started clicked!'),
        variant: 'primary'
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Pre-configured empty state for when there is no data to display.',
      },
    },
  },
}

export const NoSearchResults: Story = {
  render: () => (
    <EmptyState
      title="No results found"
      description="We couldn't find anything matching 'artificial intelligence'. Try a different search term."
      action={{
        label: 'Clear Search',
        onClick: () => alert('Clear clicked!'),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty state shown when a search returns no results.',
      },
    },
  },
}

export const NoConversations: Story = {
  render: () => (
    <EmptyState
      title="No conversations yet"
      description="Start a new conversation to get started."
      action={{
        label: 'Start Conversation',
        onClick: () => alert('Start conversation clicked!'),
        variant: 'primary',
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty state for chat applications with no active conversations.',
      },
    },
  },
}

export const ErrorStateStory: Story = {
  render: () => (
    <EmptyState
      title="Failed to load data"
      description="We couldn't load the requested content. Please try again."
      action={{
        label: 'Retry',
        onClick: () => alert('Retry clicked!'),
        variant: 'default',
      }}
      secondaryAction={{
        label: 'Go Back',
        onClick: () => alert('Go back clicked!'),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Error state with retry and navigation options.',
      },
    },
  },
}

export const SuccessStateStory: Story = {
  render: () => (
    <EmptyState
      title="All done!"
      description="You've completed all tasks. Great job!"
      action={{
        label: 'Continue',
        onClick: () => alert('Continue clicked!'),
        variant: 'success',
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Success state to celebrate completion or achievements.',
      },
    },
  },
}

// ============================================================================
// Variations
// ============================================================================

export const WithoutDescription: Story = {
  args: {
    title: 'No messages',
    action: {
      label: 'Send a message',
      onClick: () => console.log('Action clicked'),
    },
  },
}

export const WithoutAction: Story = {
  args: {
    title: 'Loading complete',
    description: 'All your data has been successfully loaded.',
  },
}

export const WithSecondaryAction: Story = {
  args: {
    title: 'No files uploaded',
    description: 'Upload your first file to get started.',
    action: {
      label: 'Upload File',
      onClick: () => alert('Upload clicked!'),
      variant: 'default',
    },
    secondaryAction: {
      label: 'Learn More',
      onClick: () => alert('Learn more clicked!'),
    },
  },
}

export const PrimaryActionVariant: Story = {
  args: {
    title: 'Ready to begin?',
    description: 'Click below to start your first project.',
    action: {
      label: 'Get Started',
      onClick: () => console.log('Get started!'),
      variant: 'primary',
    },
  },
}

export const DestructiveActionVariant: Story = {
  args: {
    title: 'Delete all data?',
    description: 'This action cannot be undone. All your data will be permanently deleted.',
    action: {
      label: 'Delete Everything',
      onClick: () => alert('Delete clicked!'),
      variant: 'destructive',
    },
    secondaryAction: {
      label: 'Cancel',
      onClick: () => alert('Cancelled'),
    },
  },
}

export const SuccessActionVariant: Story = {
  args: {
    title: 'Setup Complete',
    description: 'Your account has been successfully configured.',
    action: {
      label: 'Continue to Dashboard',
      onClick: () => console.log('Continue clicked'),
      variant: 'success',
    },
  },
}

// ============================================================================
// Real-World Scenarios
// ============================================================================

export const EmptyInbox: Story = {
  render: () => (
    <EmptyState
      title="Inbox Zero! 🎉"
      description="You're all caught up. There are no new messages to review."
      action={{
        label: 'Compose Message',
        onClick: () => alert('Compose clicked!'),
        variant: 'primary',
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty state for an inbox with no messages.',
      },
    },
  },
}

export const NoNotifications: Story = {
  render: () => (
    <EmptyState
      title="No notifications"
      description="You're all caught up! We'll notify you when something new happens."
    />
  ),
}

export const NoFavorites: Story = {
  render: () => (
    <EmptyState
      title="No favorites yet"
      description="Items you mark as favorite will appear here for quick access."
      action={{
        label: 'Browse Items',
        onClick: () => alert('Browse clicked!'),
      }}
    />
  ),
}

export const NoHistory: Story = {
  render: () => (
    <EmptyState
      title="No history"
      description="Your conversation history will appear here once you start chatting."
      action={{
        label: 'Start New Chat',
        onClick: () => alert('Start chat clicked!'),
        variant: 'primary',
      }}
    />
  ),
}

export const ConnectionError: Story = {
  render: () => (
    <EmptyState
      title="Connection lost"
      description="Unable to connect to the server. Please check your internet connection and try again."
      action={{
        label: 'Retry Connection',
        onClick: () => alert('Retry connection'),
      }}
    />
  ),
}

export const PermissionDenied: Story = {
  render: () => (
    <EmptyState
      title="Access denied"
      description="You don't have permission to view this content. Contact your administrator if you believe this is an error."
      action={{
        label: 'Go Back',
        onClick: () => alert('Go back'),
      }}
    />
  ),
}

export const NotFound: Story = {
  render: () => (
    <EmptyState
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      action={{
        label: 'Go to Home',
        onClick: () => alert('Go to home'),
      }}
    />
  ),
}

// ============================================================================
// Animation Showcase
// ============================================================================

export const AnimatedEntry: Story = {
  render: () => {
    const [show, setShow] = React.useState(true)

    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setShow(false)
            setTimeout(() => setShow(true), 100)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Replay Animation
        </button>
        {show && (
          <EmptyState
            title="No data yet"
            description="Get started by adding your first item"
            action={{
              label: 'Get Started',
              onClick: () => alert('Action clicked!'),
              variant: 'primary',
            }}
          />
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Watch the smooth scale and icon rotation animations on entry.',
      },
    },
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [scenario, setScenario] = React.useState<'data' | 'search' | 'conversation' | 'error' | 'success'>('data')

    const renderState = () => {
      switch (scenario) {
        case 'data':
          return <EmptyState icon={<Database className="text-primary" size={32} />} title="No data yet" description="Get started by adding your first item" action={{ label: 'Get Started', onClick: () => console.log('Create clicked'), variant: 'primary' }} />
        case 'search':
          return <EmptyState title="No results" description="Try a different search term" action={{ label: 'Clear', onClick: () => console.log('Clear') }} />
        case 'conversation':
          return <EmptyState title="No conversations" description="Start a new chat" action={{ label: 'Start Chat', onClick: () => console.log('Start'), variant: 'primary' }} />
        case 'error':
          return <EmptyState title="Error" description="Something went wrong" action={{ label: 'Retry', onClick: () => console.log('Retry') }} />
        case 'success':
          return <EmptyState title="Success!" description="Operation completed successfully" action={{ label: 'Continue', onClick: () => console.log('Continue'), variant: 'success' }} />
        default:
          return null
      }
    }

    return (
      <div className="space-y-6 w-full max-w-2xl">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setScenario('data')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              scenario === 'data'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            No Data
          </button>
          <button
            onClick={() => setScenario('search')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              scenario === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            No Results
          </button>
          <button
            onClick={() => setScenario('conversation')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              scenario === 'conversation'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            No Chats
          </button>
          <button
            onClick={() => setScenario('error')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              scenario === 'error'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Error
          </button>
          <button
            onClick={() => setScenario('success')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              scenario === 'success'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Success
          </button>
        </div>

        <div className="min-h-[400px] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 flex items-center justify-center">
          {renderState()}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing all empty state variations. Toggle between scenarios to see different states.',
      },
    },
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => (
    <div className="space-y-8 max-w-2xl">
      <EmptyState
        title="No data yet"
        description="Get started by adding your first item"
        action={{
          label: 'Get Started',
          onClick: () => console.log('Action'),
          variant: 'primary',
        }}
      />
      
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
        <strong>Accessibility Features:</strong>
        <ul className="list-disc list-inside space-y-1">
          <li>Semantic HTML structure with proper heading hierarchy</li>
          <li>Focusable buttons with clear labels</li>
          <li>ARIA attributes for screen readers</li>
          <li>Keyboard navigation support (Tab, Enter, Space)</li>
          <li>High contrast color scheme</li>
          <li>Clear visual hierarchy with proper spacing</li>
          <li>Smooth animations respect prefers-reduced-motion</li>
        </ul>
      </div>
    </div>
  ),
}

