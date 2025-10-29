import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { Input, Badge } from '@clarity-chat/primitives'
import { useDeferredSearch } from '../hooks/use-deferred-search'
import { SearchIcon } from './icons'

const { Suspense } = React

export interface MessageSearchProps {
  messages: Message[]
  onResultsChange?: (filteredMessages: Message[]) => void
  placeholder?: string
  className?: string
}

/**
 * Message Search Component with React Concurrent Features
 * 
 * Uses useDeferredValue to keep the search input responsive
 * even when filtering large message lists.
 * 
 * @example
 * ```tsx
 * <MessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   placeholder="Search messages..."
 * />
 * ```
 */
export const MessageSearch: React.FC<MessageSearchProps> = ({
  messages,
  onResultsChange,
  placeholder = 'Search messages...',
  className,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const { filteredMessages, isPending } = useDeferredSearch(messages, searchQuery)
  
  // Notify parent of filtered results
  React.useEffect(() => {
    onResultsChange?.(filteredMessages)
  }, [filteredMessages, onResultsChange])
  
  return (
    <div className={className}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
      
      {searchQuery && (
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Found {filteredMessages.length} of {messages.length} messages
          </span>
          {isPending && (
            <Badge variant="secondary" className="animate-pulse">
              Searching...
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Message Search with Suspense Boundary
 * 
 * Wraps MessageSearch in a Suspense boundary for lazy loading.
 * Shows a loading skeleton while the component is being loaded.
 */
export const MessageSearchWithSuspense: React.FC<MessageSearchProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="space-y-2 animate-pulse">
          <div className="h-10 bg-muted rounded-md" />
          <div className="h-4 w-32 bg-muted rounded-md" />
        </div>
      }
    >
      <MessageSearch {...props} />
    </Suspense>
  )
}
