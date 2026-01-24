# Advanced Message Search - Usage Examples

## Basic Usage (No Changes Required)

The main component API remains unchanged, so existing code continues to work:

```tsx
import { AdvancedMessageSearch } from '@clarity-chat/react'

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  return (
    <AdvancedMessageSearch
      messages={messages}
      onResultsChange={setFilteredMessages}
      enableSavedSearches
      enableExport
      enableSorting
    />
  )
}
```

## Advanced Usage: Custom Search with Hooks

Build your own custom search UI using the extracted hooks:

```tsx
import {
  useFilteredMessages,
  useSavedSearches,
  useActiveFilterCount,
  SearchFilters,
} from '@clarity-chat/react/components/search'

function CustomSearch({ messages }: { messages: Message[] }) {
  const [filters, setFilters] = useState<SearchFilters>({ query: '' })
  const [sortOption, setSortOption] = useState<SortOption>('relevance')

  // Use the hooks
  const activeCount = useActiveFilterCount(filters)
  const { savedSearches, saveSearch, deleteSearch } = useSavedSearches()
  const filteredMessages = useFilteredMessages(messages, filters, sortOption)

  return (
    <div>
      <input
        value={filters.query}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
      />
      <p>Active filters: {activeCount}</p>
      <p>Results: {filteredMessages.length}</p>
    </div>
  )
}
```

## Advanced Usage: Custom Filter Panel

Use individual subcomponents to build custom layouts:

```tsx
import {
  SearchFiltersPanel,
  ActiveFiltersPills,
  SearchResultsSummary,
  defaultPresets,
} from '@clarity-chat/react/components/search'

function CustomFilterInterface({ messages }: { messages: Message[] }) {
  const [filters, setFilters] = useState<SearchFilters>({ query: '' })
  const [sortOption, setSortOption] = useState<SortOption>('relevance')
  const activeCount = useActiveFilterCount(filters)
  const filteredMessages = useFilteredMessages(messages, filters, sortOption)

  const updateFilters = (update: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }))
  }

  const availableModels = messages
    .map((m) => (m as any).metadata?.model)
    .filter(Boolean)

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Sidebar with filters */}
      <div className="col-span-1">
        <SearchFiltersPanel
          filters={filters}
          activeFilterCount={activeCount}
          filterPresets={defaultPresets}
          availableModels={availableModels}
          onUpdateFilters={updateFilters}
          onClearFilters={() => setFilters({ query: '' })}
          onApplyPreset={(preset) => updateFilters(preset.filters)}
        />
      </div>

      {/* Main content */}
      <div className="col-span-2">
        {/* Active filters */}
        <ActiveFiltersPills
          filters={filters}
          activeFilterCount={activeCount}
          onUpdateFilters={updateFilters}
        />

        {/* Results summary */}
        <SearchResultsSummary
          results={filteredMessages}
          totalMessages={messages.length}
          sortOption={sortOption}
          enableExport
          onExport={(format) => console.log('Export as', format)}
          onCopyResults={() => console.log('Copy results')}
        />

        {/* Your custom results display */}
        <div>
          {filteredMessages.map((msg) => (
            <div key={msg.id}>{msg.content}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Advanced Usage: Custom Saved Searches

Integrate saved searches into your own UI:

```tsx
import {
  SavedSearchesPanel,
  useSavedSearches,
} from '@clarity-chat/react/components/search'

function MySavedSearches() {
  const [filters, setFilters] = useState<SearchFilters>({ query: '' })
  const activeCount = useActiveFilterCount(filters)

  const {
    savedSearches,
    recentSearches,
    saveSearch,
    deleteSearch,
    addToRecent,
  } = useSavedSearches()

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Saved Searches ({savedSearches.length})</Button>
      </PopoverTrigger>
      <PopoverContent>
        <SavedSearchesPanel
          savedSearches={savedSearches}
          recentSearches={recentSearches}
          currentFilters={filters}
          activeFilterCount={activeCount}
          onLoadSearch={(search) => setFilters(search.filters)}
          onDeleteSearch={deleteSearch}
          onSaveSearch={(name) => saveSearch(name, filters)}
          onApplyRecentSearch={(query) => setFilters({ ...filters, query })}
        />
      </PopoverContent>
    </Popover>
  )
}
```

## Advanced Usage: Custom Filter Presets

Create your own filter presets:

```tsx
import { FilterPreset } from '@clarity-chat/react/components/search'
import { Star, AlertTriangle, CheckCircle } from 'lucide-react'

const customPresets: FilterPreset[] = [
  {
    id: 'starred',
    name: 'Starred Messages',
    icon: <Star className="h-3.5 w-3.5" />,
    filters: {
      // Your custom filter logic
      tags: ['starred'],
    },
  },
  {
    id: 'warnings',
    name: 'Warnings',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    filters: {
      // Filter by specific status
      hasErrors: true,
    },
  },
  {
    id: 'verified',
    name: 'Verified',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    filters: {
      tags: ['verified'],
    },
  },
]

function CustomPresetSearch({ messages }: { messages: Message[] }) {
  return (
    <AdvancedMessageSearch
      messages={messages}
      filterPresets={customPresets}
      enableAdvancedFilters
    />
  )
}
```

## Advanced Usage: Custom Export Logic

Add custom export formats:

```tsx
import { SearchResultsSummary, ExportFormat } from '@clarity-chat/react/components/search'

function CustomExport({ messages }: { messages: Message[] }) {
  const handleExport = (format: ExportFormat, results: Message[]) => {
    switch (format) {
      case 'json':
        // Your custom JSON export logic
        const customJson = results.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt).toISOString(),
        }))
        downloadFile(JSON.stringify(customJson, null, 2), 'export.json')
        break

      case 'csv':
        // Your custom CSV export logic with additional columns
        const headers = ['role', 'content', 'tokens', 'model']
        const rows = results.map((msg) => [
          msg.role,
          msg.content,
          (msg as any).tokenCount || 0,
          (msg as any).metadata?.model || 'unknown',
        ])
        downloadCSV(headers, rows, 'export.csv')
        break

      case 'md':
        // Your custom Markdown export with metadata
        const markdown = results
          .map((msg) => {
            const meta = (msg as any).metadata
            return `
## ${msg.role}

**Created:** ${new Date(msg.createdAt).toLocaleString()}
**Model:** ${meta?.model || 'N/A'}

${msg.content}

---
`
          })
          .join('\n')
        downloadFile(markdown, 'export.md')
        break
    }
  }

  return (
    <SearchResultsSummary
      results={messages}
      totalMessages={1000}
      sortOption="relevance"
      enableExport
      onExport={(format) => handleExport(format, messages)}
    />
  )
}
```

## Advanced Usage: Extending Filter Types

Add custom filter criteria:

```tsx
// Extend the SearchFilters type
import { SearchFilters as BaseSearchFilters } from '@clarity-chat/react/components/search'

interface ExtendedSearchFilters extends BaseSearchFilters {
  sentiment?: 'positive' | 'negative' | 'neutral'
  topics?: string[]
  hasCodeBlocks?: boolean
}

function ExtendedSearch({ messages }: { messages: Message[] }) {
  const [filters, setFilters] = useState<ExtendedSearchFilters>({ query: '' })

  // Custom filter logic
  const filteredMessages = useFilteredMessages(messages, filters, 'relevance')
    .filter((msg) => {
      if (filters.sentiment) {
        const sentiment = analyzeSentiment(msg.content)
        if (sentiment !== filters.sentiment) return false
      }

      if (filters.topics && filters.topics.length > 0) {
        const topics = extractTopics(msg.content)
        if (!topics.some((t) => filters.topics!.includes(t))) return false
      }

      if (filters.hasCodeBlocks) {
        if (!msg.content.includes('```')) return false
      }

      return true
    })

  return (
    <div>
      {/* Your custom filter UI */}
      <select
        value={filters.sentiment || ''}
        onChange={(e) =>
          setFilters({
            ...filters,
            sentiment: e.target.value as any,
          })
        }
      >
        <option value="">All Sentiments</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>

      {/* Use standard components for base filters */}
      <AdvancedMessageSearch
        messages={filteredMessages}
        // ... other props
      />
    </div>
  )
}
```

## Testing Examples

### Testing a Hook

```tsx
import { renderHook } from '@testing-library/react'
import { useFilteredMessages } from '@clarity-chat/react/components/search'

describe('useFilteredMessages', () => {
  it('filters by role', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'Hello', createdAt: new Date() },
      { id: '2', role: 'assistant', content: 'Hi', createdAt: new Date() },
    ]

    const { result } = renderHook(() =>
      useFilteredMessages(messages, { query: '', role: 'user' }, 'relevance')
    )

    expect(result.current).toHaveLength(1)
    expect(result.current[0].role).toBe('user')
  })

  it('sorts by newest first', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', content: 'First', createdAt: new Date('2024-01-01') },
      { id: '2', role: 'user', content: 'Second', createdAt: new Date('2024-01-02') },
    ]

    const { result } = renderHook(() =>
      useFilteredMessages(messages, { query: '' }, 'newest')
    )

    expect(result.current[0].content).toBe('Second')
  })
})
```

### Testing a Component

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ActiveFiltersPills } from '@clarity-chat/react/components/search'

describe('ActiveFiltersPills', () => {
  it('displays role filter pill', () => {
    const onUpdateFilters = jest.fn()
    const filters: SearchFilters = { query: '', role: 'user' }

    render(
      <ActiveFiltersPills
        filters={filters}
        activeFilterCount={1}
        onUpdateFilters={onUpdateFilters}
      />
    )

    expect(screen.getByText(/Role: user/)).toBeInTheDocument()
  })

  it('removes filter when X is clicked', () => {
    const onUpdateFilters = jest.fn()
    const filters: SearchFilters = { query: '', role: 'user' }

    render(
      <ActiveFiltersPills
        filters={filters}
        activeFilterCount={1}
        onUpdateFilters={onUpdateFilters}
      />
    )

    const removeButton = screen.getByRole('button')
    fireEvent.click(removeButton)

    expect(onUpdateFilters).toHaveBeenCalledWith({ role: undefined })
  })
})
```

## Storybook Examples

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { SearchFiltersPanel } from '@clarity-chat/react/components/search'

const meta: Meta<typeof SearchFiltersPanel> = {
  title: 'Search/SearchFiltersPanel',
  component: SearchFiltersPanel,
}

export default meta
type Story = StoryObj<typeof SearchFiltersPanel>

export const Default: Story = {
  args: {
    filters: { query: '' },
    activeFilterCount: 0,
    filterPresets: defaultPresets,
    availableModels: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus'],
    onUpdateFilters: (update) => console.log('Update:', update),
    onClearFilters: () => console.log('Clear all'),
    onApplyPreset: (preset) => console.log('Apply preset:', preset),
  },
}

export const WithActiveFilters: Story = {
  args: {
    ...Default.args,
    filters: {
      query: 'search term',
      role: 'user',
      model: 'gpt-4',
      minTokens: 100,
      hasAttachments: true,
    },
    activeFilterCount: 4,
  },
}
```

## TypeScript Tips

### Type-safe Filter Updates

```tsx
import { SearchFilters } from '@clarity-chat/react/components/search'

// Type-safe helper for updating filters
function updateFilter<K extends keyof SearchFilters>(
  filters: SearchFilters,
  key: K,
  value: SearchFilters[K]
): SearchFilters {
  return { ...filters, [key]: value }
}

// Usage
const newFilters = updateFilter(filters, 'role', 'user')
```

### Custom Filter Preset Type

```tsx
import { FilterPreset, SearchFilters } from '@clarity-chat/react/components/search'

// Create a type-safe preset builder
function createPreset(
  id: string,
  name: string,
  icon: React.ReactNode,
  filters: Partial<SearchFilters>
): FilterPreset {
  return { id, name, icon, filters }
}

const myPreset = createPreset(
  'custom',
  'Custom Filter',
  <Icon />,
  { role: 'user', hasAttachments: true }
)
```

## Performance Tips

### Debounce Search Input

```tsx
import { useDebouncedValue } from '@clarity-chat/react'

function PerformantSearch({ messages }: { messages: Message[] }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  const filters = { query: debouncedQuery }
  const results = useFilteredMessages(messages, filters, 'relevance')

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### Memoize Large Message Lists

```tsx
function OptimizedSearch({ messages }: { messages: Message[] }) {
  // Only recalculate when messages array actually changes
  const memoizedMessages = useMemo(() => messages, [messages])

  return (
    <AdvancedMessageSearch
      messages={memoizedMessages}
      // ... other props
    />
  )
}
```

### Virtualize Long Result Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedResults({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {messages[virtualRow.index].content}
          </div>
        ))}
      </div>
    </div>
  )
}
```
