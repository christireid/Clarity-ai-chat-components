import * as React from 'react'
import type { SearchFilters } from '../types'

/**
 * Hook to calculate the number of active filters
 */
export function useActiveFilterCount(filters: SearchFilters): number {
  return React.useMemo(() => {
    let count = 0
    if (filters.role) count++
    if (filters.dateRange?.start || filters.dateRange?.end) count++
    if (filters.model) count++
    if (filters.tags && filters.tags.length > 0) count++
    if (filters.minTokens || filters.maxTokens) count++
    if (filters.hasAttachments) count++
    if (filters.hasErrors) count++
    return count
  }, [filters])
}
