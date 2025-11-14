import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Empty State | Clarity Chat',
  description: 'Comprehensive empty state components for various scenarios with actions.'
}

export default function EmptyStatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Empty State</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Collection of empty state components for no data, search results, errors, success, and loading scenarios.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Available Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>EmptyState</strong> - Base component</li>
          <li><strong>EmptyChatState</strong> - No messages</li>
          <li><strong>NoSearchResultsState</strong> - No results</li>
          <li><strong>NoConversationsState</strong> - No conversations</li>
          <li><strong>NoFilesState</strong> - No files uploaded</li>
          <li><strong>ErrorState</strong> - Error messages</li>
          <li><strong>SuccessState</strong> - Success messages</li>
          <li><strong>LoadingState</strong> - Loading spinner</li>
          <li><strong>OfflineState</strong> - No connection</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { 
  EmptyChatState, 
  NoSearchResultsState,
  ErrorState 
} from '@clarity-chat/react'

// Empty chat
<EmptyChatState onStartChat={() => focusInput()} />

// No search results
<NoSearchResultsState 
  searchQuery="test"
  onClearSearch={() => setQuery('')}
/>

// Error state
<ErrorState 
  title="Failed to load"
  description="Could not fetch messages"
  onRetry={() => refetch()}
  onGoBack={() => router.back()}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Custom Empty State</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { EmptyState } from '@clarity-chat/react'

<EmptyState
  icon={<CustomIcon />}
  title="No items found"
  description="Try adjusting your filters"
  action={{
    label: "Reset Filters",
    onClick: resetFilters,
    variant: "primary"
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: openHelp
  }}
/>`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Animated icon entrances</li>
          <li>Primary and secondary actions</li>
          <li>Customizable icons and messaging</li>
          <li>Smooth transitions</li>
          <li>Consistent styling across states</li>
        </ul>
      </section>
    </div>
  )
}
