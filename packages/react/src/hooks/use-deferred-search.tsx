import * as React from 'react'

/**
 * Deferred Search Hook (React 19 Version)
 * 
 * Uses React 19's `useDeferredValue` for non-blocking search operations.
 * Perfect for search inputs, filters, and any rapidly changing values that
 * trigger expensive operations.
 * 
 * **React 19 Features:**
 * - Uses `useDeferredValue` with initial value support
 * - Automatically defers non-urgent updates
 * - Better integration with React's scheduler
 * - No manual setTimeout/debouncing needed
 * - Works seamlessly with Suspense and concurrent features
 * 
 * **Use Cases:**
 * - Search inputs with API calls
 * - Real-time filtering of large lists
 * - Auto-complete suggestions
 * - Dynamic content filtering
 * 
 * @example
 * ```tsx
 * const SearchComponent = () => {
 *   const [query, setQuery] = useState('')
 *   const { deferredQuery, isPending } = useDeferredSearch(query)
 *   
 *   // API call only triggered when deferredQuery changes
 *   const results = useSearchResults(deferredQuery)
 *   
 *   return (
 *     <div>
 *       <input 
 *         value={query} 
 *         onChange={e => setQuery(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       {isPending && <Spinner />}
 *       <SearchResults results={results} />
 *     </div>
 *   )
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With initial empty state
 * const { deferredQuery, isPending } = useDeferredSearch(query, '')
 * 
 * // Starts with empty string, defers to actual query
 * // Prevents initial render flash
 * ```
 */

export interface UseDeferredSearchOptions {
  /** Initial value to show while deferred value is pending */
  initialValue?: string
}

export interface UseDeferredSearchReturn {
  /** The deferred value (lags behind actual value during updates) */
  deferredQuery: string
  /** Whether the deferred value is behind the actual value */
  isPending: boolean
}

/**
 * Deferred search hook using React 19's useDeferredValue
 * 
 * @param query - The current search query
 * @param options - Configuration options
 * @returns Deferred query and pending state
 */
export function useDeferredSearch(
  query: string,
  options: UseDeferredSearchOptions = {}
): UseDeferredSearchReturn {
  const { initialValue = '' } = options
  
  // React 19: useDeferredValue with initial value support!
  const deferredQuery = React.useDeferredValue(query, initialValue)
  
  // Check if deferred value is behind actual value
  const isPending = query !== deferredQuery
  
  return {
    deferredQuery,
    isPending,
  }
}

/**
 * Generic deferred value hook for any type
 * 
 * @example
 * ```tsx
 * const [filter, setFilter] = useState({ category: 'all', price: 0 })
 * const { deferredValue, isPending } = useDeferredValue(filter)
 * 
 * // Expensive filtering only happens when deferredValue changes
 * const filtered = useMemo(() => 
 *   expensiveFilter(items, deferredValue),
 *   [deferredValue]
 * )
 * ```
 */
export interface UseDeferredValueOptions<T> {
  /** Initial value to show while deferred value is pending */
  initialValue?: T
}

export interface UseDeferredValueReturn<T> {
  /** The deferred value */
  deferredValue: T
  /** Whether the deferred value is behind the actual value */
  isPending: boolean
}

export function useDeferred<T>(
  value: T,
  options: UseDeferredValueOptions<T> = {}
): UseDeferredValueReturn<T> {
  const { initialValue } = options
  
  // React 19: useDeferredValue with optional initial value
  const deferredValue = initialValue !== undefined
    ? React.useDeferredValue(value, initialValue)
    : React.useDeferredValue(value)
  
  // Check if deferred value is behind actual value
  // Note: This uses shallow equality, won't work for objects without custom comparison
  const isPending = value !== deferredValue
  
  return {
    deferredValue,
    isPending,
  }
}

/**
 * Deferred list filter hook
 * 
 * Optimized for filtering large lists without blocking the UI.
 * Uses React 19's useDeferredValue under the hood.
 * 
 * @example
 * ```tsx
 * const FilteredList = ({ items }: { items: Item[] }) => {
 *   const [searchTerm, setSearchTerm] = useState('')
 *   const { filteredItems, isPending } = useDeferredFilter(
 *     items,
 *     searchTerm,
 *     (item, term) => item.name.toLowerCase().includes(term.toLowerCase())
 *   )
 *   
 *   return (
 *     <div>
 *       <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
 *       {isPending && <div>Filtering...</div>}
 *       {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
 *     </div>
 *   )
 * }
 * ```
 */
export interface UseDeferredFilterReturn<T> {
  /** Filtered items (deferred) */
  filteredItems: T[]
  /** Whether filtering is in progress */
  isPending: boolean
}

export function useDeferredFilter<T>(
  items: T[],
  filterTerm: string,
  filterFn: (item: T, term: string) => boolean
): UseDeferredFilterReturn<T> {
  // Defer the filter term
  const deferredTerm = React.useDeferredValue(filterTerm)
  
  // Expensive filtering only happens when deferred term changes
  const filteredItems = React.useMemo(
    () => (deferredTerm ? items.filter(item => filterFn(item, deferredTerm)) : items),
    [items, deferredTerm, filterFn]
  )
  
  const isPending = filterTerm !== deferredTerm
  
  return {
    filteredItems,
    isPending,
  }
}

/**
 * Deferred sort hook
 * 
 * Optimized for sorting large lists without blocking the UI.
 * 
 * @example
 * ```tsx
 * const SortedList = ({ items }: { items: Item[] }) => {
 *   const [sortBy, setSortBy] = useState<'name' | 'date'>('name')
 *   const { sortedItems, isPending } = useDeferredSort(
 *     items,
 *     sortBy,
 *     (a, b, by) => {
 *       if (by === 'name') return a.name.localeCompare(b.name)
 *       return a.date.getTime() - b.date.getTime()
 *     }
 *   )
 *   
 *   return (
 *     <div>
 *       <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
 *         <option value="name">Name</option>
 *         <option value="date">Date</option>
 *       </select>
 *       {isPending && <div>Sorting...</div>}
 *       {sortedItems.map(item => <ItemCard key={item.id} item={item} />)}
 *     </div>
 *   )
 * }
 * ```
 */
export interface UseDeferredSortReturn<T> {
  /** Sorted items (deferred) */
  sortedItems: T[]
  /** Whether sorting is in progress */
  isPending: boolean
}

export function useDeferredSort<T, K>(
  items: T[],
  sortKey: K,
  compareFn: (a: T, b: T, key: K) => number
): UseDeferredSortReturn<T> {
  // Defer the sort key
  const deferredKey = React.useDeferredValue(sortKey)
  
  // Expensive sorting only happens when deferred key changes
  const sortedItems = React.useMemo(
    () => [...items].sort((a, b) => compareFn(a, b, deferredKey)),
    [items, deferredKey, compareFn]
  )
  
  const isPending = sortKey !== deferredKey
  
  return {
    sortedItems,
    isPending,
  }
}
