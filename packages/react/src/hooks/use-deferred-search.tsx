import { useDeferredValue, useMemo } from 'react'
import type { Message } from '@clarity-chat/types'

/**
 * Hook for deferred search with React 18 concurrent features
 * 
 * Uses useDeferredValue to defer expensive search operations,
 * keeping the UI responsive while searching through messages.
 * 
 * @param messages - Array of messages to search through
 * @param searchQuery - Current search query
 * @returns Filtered messages and isPending state
 * 
 * @example
 * ```tsx
 * const { filteredMessages, isPending } = useDeferredSearch(messages, searchQuery)
 * 
 * return (
 *   <div>
 *     {isPending && <SearchingIndicator />}
 *     {filteredMessages.map(msg => <Message key={msg.id} {...msg} />)}
 *   </div>
 * )
 * ```
 */
export function useDeferredSearch(messages: Message[], searchQuery: string) {
  // Defer the search query to avoid blocking the input
  const deferredQuery = useDeferredValue(searchQuery)
  
  // Check if the deferred value is behind the actual value
  const isPending = searchQuery !== deferredQuery
  
  // Perform the expensive search operation
  const filteredMessages = useMemo(() => {
    if (!deferredQuery.trim()) {
      return messages
    }
    
    const query = deferredQuery.toLowerCase()
    return messages.filter((message) => {
      // Search in message content
      if (message.content.toLowerCase().includes(query)) {
        return true
      }
      
      // Search in metadata
      if (message.metadata) {
        const metadataStr = JSON.stringify(message.metadata).toLowerCase()
        if (metadataStr.includes(query)) {
          return true
        }
      }
      
      return false
    })
  }, [messages, deferredQuery])
  
  return {
    filteredMessages,
    isPending,
    // Original query for UI state
    searchQuery,
    // Deferred query that's actually being used
    deferredQuery,
  }
}
