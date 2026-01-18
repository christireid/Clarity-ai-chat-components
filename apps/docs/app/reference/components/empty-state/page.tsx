import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export const metadata: Metadata = {
  title: 'Empty State - Clarity Chat Components',
  description:
    'Comprehensive empty state components for no data, search results, errors, success, and loading scenarios.',
}

export default function EmptyStatePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <div className="flex gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Component
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Stable
          </span>
        </div>
        <h1>Empty State</h1>
        <p className="docs-lead">
          Collection of empty state components for no data, search results,
          errors, success, and loading scenarios with customizable icons,
          actions, and animations.
        </p>
      </div>

      <ViewInStorybook component="EmptyState" />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Empty states are crucial UX elements that guide users when content is
          unavailable. The <code>EmptyState</code> component family provides
          consistent, accessible, and beautiful placeholders for various
          scenarios.
        </p>
      </section>

      <section className="docs-section">
        <h2>Interactive Playground</h2>
        <p className="mb-6">
          Experiment with different empty state variants and customizations.
        </p>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-8 bg-muted/30 rounded-lg">
      <EmptyState
        icon={<MessageSquare className="w-12 h-12" />}
        title="No messages yet"
        description="Start a conversation to see messages here"
        action={{
          label: "Start Chat",
          onClick: () => alert('Starting chat...'),
          variant: "primary"
        }}
      />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Available Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="docs-card">
            <h3>EmptyState</h3>
            <p>Base component for custom empty states</p>
          </div>
          <div className="docs-card">
            <h3>EmptyChatState</h3>
            <p>No messages in chat</p>
          </div>
          <div className="docs-card">
            <h3>NoSearchResultsState</h3>
            <p>No search results found</p>
          </div>
          <div className="docs-card">
            <h3>NoConversationsState</h3>
            <p>No conversations available</p>
          </div>
          <div className="docs-card">
            <h3>NoFilesState</h3>
            <p>No files uploaded</p>
          </div>
          <div className="docs-card">
            <h3>ErrorState</h3>
            <p>Error messages and retry actions</p>
          </div>
          <div className="docs-card">
            <h3>SuccessState</h3>
            <p>Success confirmations</p>
          </div>
          <div className="docs-card">
            <h3>LoadingState</h3>
            <p>Loading spinner with message</p>
          </div>
          <div className="docs-card">
            <h3>OfflineState</h3>
            <p>No network connection</p>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="EmptyState Props" data={emptyStateProps} />
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function BasicEmptyStates() {
  return (
    <div className="space-y-8">
      {/* Empty Chat */}
      <div className="p-6 bg-muted/20 rounded-lg">
        <EmptyChatState
          onStartChat={() => alert('Focus input')}
        />
      </div>

      {/* No Search Results */}
      <div className="p-6 bg-muted/20 rounded-lg">
        <NoSearchResultsState
          searchQuery="test query"
          onClearSearch={() => alert('Clearing search...')}
        />
      </div>
    </div>
  )
}

render(<BasicEmptyStates />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Error States</h2>
        <p>Handle errors gracefully with clear messaging and recovery actions.</p>
        <CodePlayground
          initialCode={`function ErrorStateDemo() {
  const [error, setError] = React.useState(true)

  if (!error) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <p className="text-green-800 dark:text-green-200">Content loaded successfully!</p>
        <Button
          variant="ghost"
          onClick={() => setError(true)}
          className="mt-2"
        >
          Reset Demo
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-muted/20 rounded-lg">
      <ErrorState
        title="Failed to load messages"
        description="We couldn't fetch your messages. Please check your connection and try again."
        onRetry={() => setError(false)}
        onGoBack={() => alert('Going back...')}
      />
    </div>
  )
}

render(<ErrorStateDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Success States</h2>
        <p>Confirm successful actions with positive feedback.</p>
        <CodePlayground
          initialCode={`function SuccessStateDemo() {
  return (
    <div className="p-6 bg-muted/20 rounded-lg">
      <SuccessState
        title="Message sent!"
        description="Your message has been delivered successfully."
        action={{
          label: "Send Another",
          onClick: () => alert('Opening new message...'),
          variant: "primary"
        }}
      />
    </div>
  )
}

render(<SuccessStateDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Loading States</h2>
        <p>Show loading indicators while content is being fetched.</p>
        <CodePlayground
          initialCode={`function LoadingStateDemo() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!loading) {
    return (
      <div className="p-6 bg-muted/20 rounded-lg text-center">
        <p>Content loaded!</p>
        <Button
          variant="ghost"
          onClick={() => setLoading(true)}
          className="mt-2"
        >
          Reset Demo
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-muted/20 rounded-lg">
      <LoadingState
        message="Loading your messages..."
      />
    </div>
  )
}

render(<LoadingStateDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Offline States</h2>
        <p>Handle network connectivity issues gracefully.</p>
        <CodePlayground
          initialCode={`function OfflineStateDemo() {
  return (
    <div className="p-6 bg-muted/20 rounded-lg">
      <OfflineState
        onRetry={() => alert('Checking connection...')}
      />
    </div>
  )
}

render(<OfflineStateDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Empty States</h2>
        <p>Build custom empty states with the base component.</p>
        <CodePlayground
          initialCode={`function CustomEmptyStateDemo() {
  return (
    <div className="p-6 bg-muted/20 rounded-lg">
      <EmptyState
        icon={<FolderOpen className="w-12 h-12 text-amber-500" />}
        title="No files in this folder"
        description="Upload files or drag and drop them here to get started"
        action={{
          label: "Upload Files",
          onClick: () => alert('Opening file picker...'),
          variant: "primary"
        }}
        secondaryAction={{
          label: "Create Folder",
          onClick: () => alert('Creating folder...')
        }}
      />
    </div>
  )
}

render(<CustomEmptyStateDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Accessibility</h2>

        <Callout type="info" title="Screen Reader Support">
          All empty states include proper ARIA attributes and are announced to
          screen readers with meaningful context.
        </Callout>

        <h3>Best Practices</h3>
        <ul>
          <li>Use descriptive titles that explain what content is missing</li>
          <li>Provide clear actions to help users resolve the empty state</li>
          <li>Icons should be decorative (aria-hidden) since text provides context</li>
          <li>Error states should include recovery options</li>
          <li>Loading states should announce progress to assistive technology</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Animations</h2>
        <p>
          Empty states include subtle entrance animations that respect the
          user&apos;s <code>prefers-reduced-motion</code> setting.
        </p>
        <ul>
          <li>Icons animate in with a gentle scale and fade</li>
          <li>Text content fades in with a slight upward motion</li>
          <li>Actions appear last to draw attention to them</li>
          <li>All animations are disabled when reduced motion is preferred</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <Callout type="tip" title="Use Contextual Empty States">
          Choose the appropriate empty state variant for your context. Use
          EmptyChatState for chat interfaces, NoSearchResultsState for search,
          etc.
        </Callout>

        <Callout type="warning" title="Always Provide Actions">
          Empty states should guide users on what to do next. Include at least
          one clear call-to-action.
        </Callout>

        <h3>When to Use Each Variant</h3>
        <ul>
          <li>
            <strong>EmptyChatState:</strong> New conversations with no messages
          </li>
          <li>
            <strong>NoSearchResultsState:</strong> Search queries with no matches
          </li>
          <li>
            <strong>ErrorState:</strong> Failed API calls or unexpected errors
          </li>
          <li>
            <strong>SuccessState:</strong> Completed actions needing confirmation
          </li>
          <li>
            <strong>LoadingState:</strong> Content being fetched
          </li>
          <li>
            <strong>OfflineState:</strong> Network connectivity issues
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <CodePlayground
          initialCode={`import { EmptyState, EmptyStateProps } from '@clarity-chat/react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

interface ErrorStateProps extends Omit<EmptyStateProps, 'icon'> {
  onRetry?: () => void
  onGoBack?: () => void
}

interface LoadingStateProps {
  message?: string
  className?: string
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/error-boundary-enhanced" className="docs-card">
            <h3>Error Boundary</h3>
            <p>Catch and handle React errors</p>
          </a>
          <a href="/reference/components/loading" className="docs-card">
            <h3>Loading</h3>
            <p>Loading spinners and skeletons</p>
          </a>
          <a href="/reference/components/typing-indicator" className="docs-card">
            <h3>Typing Indicator</h3>
            <p>AI is typing animation</p>
          </a>
          <a href="/reference/components/network-status" className="docs-card">
            <h3>Network Status</h3>
            <p>Online/offline detection</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const emptyStateProps = [
  {
    name: 'icon',
    type: 'React.ReactNode',
    required: false,
    description: 'Icon to display above the title',
  },
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Main heading text',
  },
  {
    name: 'description',
    type: 'string',
    required: false,
    description: 'Explanatory text below the title',
  },
  {
    name: 'action',
    type: '{ label: string; onClick: () => void; variant?: string }',
    required: false,
    description: 'Primary action button configuration',
  },
  {
    name: 'secondaryAction',
    type: '{ label: string; onClick: () => void }',
    required: false,
    description: 'Secondary action button configuration',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
]
