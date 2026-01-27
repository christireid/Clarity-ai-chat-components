import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import type { SearchFilters, SortOption, ExtendedMessage } from '../types'

/**
 * Hook to apply advanced filters and sorting to messages
 */
export function useFilteredMessages(
  messages: Message[],
  filters: SearchFilters,
  sortOption: SortOption
): Message[] {
  return React.useMemo(() => {
    let results = [...messages]

    // Filter by role
    if (filters.role) {
      results = results.filter((msg) => msg.role === filters.role)
    }

    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      results = results.filter((msg) => {
        const msgDate = new Date(msg.createdAt)
        if (start && msgDate < start) return false
        if (end && msgDate > end) return false
        return true
      })
    }

    // Filter by model
    if (filters.model) {
      results = results.filter((msg) => {
        const metadata = (msg as ExtendedMessage).metadata
        return metadata?.model === filters.model
      })
    }

    // Filter by tokens
    if (filters.minTokens || filters.maxTokens) {
      results = results.filter((msg) => {
        const tokenCount = (msg as ExtendedMessage).tokenCount || 0
        if (filters.minTokens && tokenCount < filters.minTokens) return false
        if (filters.maxTokens && tokenCount > filters.maxTokens) return false
        return true
      })
    }

    // Filter by attachments
    if (filters.hasAttachments) {
      results = results.filter((msg) => {
        const attachments = (msg as ExtendedMessage).attachments
        return attachments && attachments.length > 0
      })
    }

    // Filter by errors
    if (filters.hasErrors) {
      results = results.filter((msg) => msg.status === 'error')
    }

    // Apply sorting
    if (sortOption !== 'relevance') {
      results.sort((a, b) => {
        switch (sortOption) {
          case 'newest':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          case 'oldest':
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          case 'longest':
            return b.content.length - a.content.length
          case 'shortest':
            return a.content.length - b.content.length
          default:
            return 0
        }
      })
    }

    return results
  }, [messages, filters, sortOption])
}
