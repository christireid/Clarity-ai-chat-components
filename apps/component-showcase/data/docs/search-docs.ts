import type { ComponentDoc } from '@/components/doc-panel'

export const searchDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Message Search
  // ===========================================================================
  'Message Search': {
    name: 'MessageSearch',
    description:
      'Full-text search component for filtering messages with keyboard shortcuts, search history, real-time highlighting, and result navigation. Supports deferred rendering for large message sets.',
    importPath: '@clarity-chat/react',
    usageCode: `<MessageSearch
  messages={messages}
  onResultsChange={(filtered) =>
    setFilteredMessages(filtered)
  }
  onMessageSelect={(msg) => scrollToMessage(msg)}
  enableKeyboardShortcut
  showShortcutHint
  enableHistory
  highlightMatches
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to search through.',
        commonlyUsed: true,
      },
      {
        name: 'onResultsChange',
        type: '(filteredMessages: Message[]) => void',
        description: 'Callback invoked when the filtered results change.',
        commonlyUsed: true,
      },
      {
        name: 'onMessageSelect',
        type: '(message: Message) => void',
        description:
          'Callback invoked when a message is selected via keyboard navigation.',
        commonlyUsed: true,
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Search messages..."',
        description: 'Placeholder text shown in the search input.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
      {
        name: 'enableKeyboardShortcut',
        type: 'boolean',
        default: 'true',
        description:
          'Enable Cmd/Ctrl+K to focus the search input and Cmd/Ctrl+Shift+K to clear and focus.',
        commonlyUsed: true,
      },
      {
        name: 'showShortcutHint',
        type: 'boolean',
        default: 'true',
        description: 'Show the keyboard shortcut hint badge inside the input.',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'false',
        description: 'Autofocus the search input on mount.',
      },
      {
        name: 'showResultCount',
        type: 'boolean',
        default: 'true',
        description: 'Display the result count summary below the input.',
        commonlyUsed: true,
      },
      {
        name: 'enableHistory',
        type: 'boolean',
        default: 'true',
        description:
          'Enable search history stored in localStorage with a dropdown of recent queries.',
        commonlyUsed: true,
      },
      {
        name: 'maxHistoryItems',
        type: 'number',
        default: '5',
        description: 'Maximum number of search history items to retain.',
      },
      {
        name: 'emptyMessage',
        type: 'string',
        default: '"No messages found"',
        description: 'Message displayed when no results match the query.',
      },
      {
        name: 'highlightMatches',
        type: 'boolean',
        default: 'true',
        description: 'Highlight matching text in search results.',
      },
      {
        name: 'minSearchLength',
        type: 'number',
        default: '1',
        description:
          'Minimum number of characters required before the search triggers.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Size variant controlling input height and icon sizes.',
      },
    ],
    notes: [
      'Supports keyboard navigation: Arrow Up/Down to navigate results, Enter to select, Escape to clear or blur.',
      'Search history persists across sessions via localStorage under the key "clarity-message-search-history".',
      'Uses React deferred values for non-blocking search on large message lists.',
      'Also exported as MessageSearchWithSuspense which wraps the component in a React Suspense boundary with a loading skeleton.',
    ],
    sourceFile: 'components/search/MessageSearch.tsx',
  },

  // ===========================================================================
  // Search Filters
  // ===========================================================================
  'Search Filters': {
    name: 'AdvancedMessageSearch',
    description:
      'Comprehensive search component with advanced filtering by role, date range, model, token count, attachments, and errors. Includes saved searches, filter presets, sorting, and export to JSON/CSV/Markdown.',
    importPath: '@clarity-chat/react',
    usageCode: `<AdvancedMessageSearch
  messages={messages}
  onResultsChange={(filtered) =>
    setFilteredMessages(filtered)
  }
  onMessageSelect={(msg) => scrollToMessage(msg)}
  enableAdvancedFilters
  enableSavedSearches
  enableExport
  enableSorting
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to search and filter.',
        commonlyUsed: true,
      },
      {
        name: 'onResultsChange',
        type: '(filteredMessages: Message[]) => void',
        description:
          'Callback invoked when the filtered and sorted results change.',
        commonlyUsed: true,
      },
      {
        name: 'onMessageSelect',
        type: '(message: Message) => void',
        description: 'Callback invoked when a result message is selected.',
        commonlyUsed: true,
      },
      {
        name: 'enableFuzzySearch',
        type: 'boolean',
        default: 'false',
        description: 'Enable fuzzy search with typo tolerance.',
      },
      {
        name: 'enableAdvancedFilters',
        type: 'boolean',
        default: 'true',
        description:
          'Show the advanced filters popover with role, date, model, token, attachment, and error filters.',
        commonlyUsed: true,
      },
      {
        name: 'enableSavedSearches',
        type: 'boolean',
        default: 'true',
        description:
          'Enable saving and loading named search configurations that persist in localStorage.',
        commonlyUsed: true,
      },
      {
        name: 'enableExport',
        type: 'boolean',
        default: 'true',
        description:
          'Enable exporting results as JSON, CSV, or Markdown, and copying to clipboard.',
      },
      {
        name: 'enableSorting',
        type: 'boolean',
        default: 'true',
        description:
          'Enable sorting results by relevance, newest, oldest, longest, or shortest.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Search messages..."',
        description: 'Placeholder text shown in the search input.',
      },
      {
        name: 'showFilterCount',
        type: 'boolean',
        default: 'true',
        description:
          'Display a badge on the filter button showing the number of active filters.',
      },
      {
        name: 'filterPresets',
        type: 'FilterPreset[]',
        default: 'defaultPresets',
        description:
          'Array of quick-filter presets shown in the filters panel. Defaults include User Messages, AI Responses, Has Attachments, Has Errors, and Today.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: '"md"',
        description: 'Size variant controlling input height and button sizes.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
    ],
    notes: [
      'Saved searches persist in localStorage under the key "clarity-advanced-search-saved" and recent searches under "clarity-advanced-search-recent".',
      'Active filter pills appear below the search bar and can be individually removed.',
      'The FilterPreset interface requires id (string), name (string), icon (ReactNode), and filters (Partial<SearchFilters>).',
      'Export supports JSON, CSV, and Markdown formats as file downloads, plus a clipboard copy option.',
      'The SearchFilters type supports query, role, dateRange, model, tags, minTokens, maxTokens, hasAttachments, and hasErrors fields.',
    ],
    sourceFile: 'components/search/advanced-message-search.tsx',
  },

  // ===========================================================================
  // Semantic Search
  // ===========================================================================
  'Semantic Search': {
    name: 'SemanticMessageSearch',
    description:
      'AI-powered semantic search component that uses vector embeddings and cosine similarity for meaning-based message matching. Supports hybrid keyword+semantic search, query expansion with synonyms, configurable similarity thresholds, and reranking.',
    importPath: '@clarity-chat/react',
    usageCode: `<SemanticMessageSearch
  messages={messages}
  onResultsFound={(results) => console.log(results)}
  onResultSelect={(result) =>
    scrollToMessage(result.message)
  }
  onGenerateEmbedding={async (text) => {
    const res = await fetch('/api/embed', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return res.json()
  }}
  showHistory
  showConfig
/>`,
    props: [
      {
        name: 'messages',
        type: 'Message[]',
        required: true,
        description: 'Array of messages to search through semantically.',
        commonlyUsed: true,
      },
      {
        name: 'config',
        type: 'Partial<SemanticSearchConfig>',
        description:
          'Partial configuration merged with defaults. Controls embeddings provider, hybrid search weighting, reranking, multi-language support, query expansion, max results, and similarity threshold.',
        commonlyUsed: true,
      },
      {
        name: 'onResultsFound',
        type: '(results: SemanticSearchResult[]) => void',
        description:
          'Callback invoked with the array of scored results after a search completes.',
        commonlyUsed: true,
      },
      {
        name: 'onResultSelect',
        type: '(result: SemanticSearchResult) => void',
        description:
          'Callback invoked when a result card is clicked. The result includes the message, score, highlights, match type, and explanation.',
        commonlyUsed: true,
      },
      {
        name: 'onGenerateEmbedding',
        type: '(text: string) => Promise<number[]>',
        description:
          'Custom callback for generating text embeddings. When omitted, a fallback bag-of-words embedding is used.',
        commonlyUsed: true,
      },
      {
        name: 'onRerank',
        type: '( query: string results: SemanticSearchResult[] ) => Promise<SemanticSearchResult[]>',
        description:
          'Custom callback for reranking results. Only called when reranking is enabled in the config.',
      },
      {
        name: 'showHistory',
        type: 'boolean',
        default: 'true',
        description:
          'Show the search history popover button with recent queries and result counts.',
      },
      {
        name: 'showConfig',
        type: 'boolean',
        default: 'true',
        description:
          'Show the search configuration popover button for adjusting semantic weight, similarity threshold, max results, query expansion, and hybrid search toggles.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: '"Search semantically..."',
        description: 'Placeholder text shown in the search input.',
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        description:
          'Enable compact mode which hides the card header and removes padding for embedding in tight layouts.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional CSS class names for the root container.',
      },
    ],
    notes: [
      'SemanticSearchResult contains message (Message), score (number 0-1), highlights (string[]), matchType ("semantic" | "keyword" | "hybrid"), and explanation (string).',
      'Default config uses OpenAI text-embedding-3-small, hybrid search enabled at 0.7 semantic weight, query expansion on, and 0.6 similarity threshold.',
      'Embeddings are cached per component instance to avoid redundant API calls for the same text.',
      'Search is debounced at 300ms and supports abort controllers for cancelling in-flight searches.',
      'The config panel allows real-time adjustment of semantic weight, similarity threshold, max results, query expansion, and hybrid search mode.',
      'Search history persists in localStorage under the key "clarity-semantic-search-history".',
    ],
    sourceFile: 'components/search/semantic/SemanticMessageSearch.tsx',
  },

  // ===========================================================================
  // Search History
  // ===========================================================================
  'Search History': [
    {
      name: 'MessageSearch',
      description:
        'The MessageSearch component includes built-in search history functionality. When enableHistory is true, recent queries are stored in localStorage and displayed in a dropdown when the input is focused without a query.',
      importPath: '@clarity-chat/react',
      usageCode: `<MessageSearch
  messages={messages}
  onResultsChange={(filtered) =>
    setFilteredMessages(filtered)
  }
  enableHistory
  maxHistoryItems={10}
  enableKeyboardShortcut
/>`,
      props: [
        {
          name: 'messages',
          type: 'Message[]',
          required: true,
          description: 'Array of messages to search through.',
          commonlyUsed: true,
        },
        {
          name: 'onResultsChange',
          type: '(filteredMessages: Message[]) => void',
          description: 'Callback invoked when the filtered results change.',
          commonlyUsed: true,
        },
        {
          name: 'onMessageSelect',
          type: '(message: Message) => void',
          description: 'The onMessageSelect prop.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Search messages..."',
          description: 'Placeholder text shown in the search input.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
        {
          name: 'enableKeyboardShortcut',
          type: 'boolean',
          default: 'true',
          description:
            'Enable Cmd/Ctrl+K to focus the input and show the history dropdown.',
        },
        {
          name: 'showShortcutHint',
          type: 'boolean',
          description: 'Show keyboard shortcut hint',
        },
        {
          name: 'autoFocus',
          type: 'boolean',
          description: 'Autofocus the search input',
        },
        {
          name: 'showResultCount',
          type: 'boolean',
          description: 'Show result count',
        },
        {
          name: 'enableHistory',
          type: 'boolean',
          default: 'true',
          description:
            'Enable search history. When true, queries are saved to localStorage and a recent searches dropdown appears on focus.',
          commonlyUsed: true,
        },
        {
          name: 'maxHistoryItems',
          type: 'number',
          default: '5',
          description: 'Maximum number of search history entries to retain.',
          commonlyUsed: true,
        },
        {
          name: 'emptyMessage',
          type: 'string',
          description: 'Custom empty state message',
        },
        {
          name: 'highlightMatches',
          type: 'boolean',
          description: 'Highlight matching text in results',
        },
        {
          name: 'minSearchLength',
          type: 'number',
          description: 'Minimum characters before search triggers',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description: 'Size variant controlling input height and icon sizes.',
        },
      ],
      notes: [
        'History is stored in localStorage under "clarity-message-search-history".',
        'The dropdown supports keyboard navigation with Arrow Up/Down, Enter to select, and Tab to autocomplete.',
        'A "Clear" button in the dropdown removes all history entries.',
        'History items are deduplicated -- repeating a query moves it to the top.',
      ],
      sourceFile: 'components/search/MessageSearch.tsx',
    },
    {
      name: 'AdvancedMessageSearch',
      description:
        'The AdvancedMessageSearch component provides saved search management via a bookmarks popover. Users can save the current query and filter combination, load previously saved searches, and access recent search terms.',
      importPath: '@clarity-chat/react',
      usageCode: `<AdvancedMessageSearch
  messages={messages}
  onResultsChange={(filtered) =>
    setFilteredMessages(filtered)
  }
  enableSavedSearches
/>`,
      props: [
        {
          name: 'messages',
          type: 'Message[]',
          required: true,
          description: 'Array of messages to search and filter.',
          commonlyUsed: true,
        },
        {
          name: 'onResultsChange',
          type: '(filteredMessages: Message[]) => void',
          description:
            'Callback invoked when the filtered and sorted results change.',
          commonlyUsed: true,
        },
        {
          name: 'onMessageSelect',
          type: '(message: Message) => void',
          description: 'Callback when a message is selected',
        },
        {
          name: 'enableFuzzySearch',
          type: 'boolean',
          description: 'Enable fuzzy search with typo tolerance',
        },
        {
          name: 'enableAdvancedFilters',
          type: 'boolean',
          default: 'true',
          description:
            'Show the advanced filters popover. Saved searches capture the full filter state.',
        },
        {
          name: 'enableSavedSearches',
          type: 'boolean',
          default: 'true',
          description:
            'Show the bookmarks popover for saving, loading, and deleting named search configurations.',
          commonlyUsed: true,
        },
        {
          name: 'enableExport',
          type: 'boolean',
          description: 'Enable export functionality',
        },
        {
          name: 'enableSorting',
          type: 'boolean',
          description: 'Enable sorting',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Search messages..."',
          description: 'Placeholder text shown in the search input.',
        },
        {
          name: 'showFilterCount',
          type: 'boolean',
          description: 'Show filter count badge',
        },
        {
          name: 'filterPresets',
          type: 'FilterPreset[]',
          description: 'Custom filter presets',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: '"md"',
          description:
            'Size variant controlling input height and button sizes.',
        },
        {
          name: 'className',
          type: 'string',
          description: 'Additional CSS class names for the root container.',
        },
      ],
      notes: [
        'Saved searches persist in localStorage under "clarity-advanced-search-saved" and store the full SearchFilters state.',
        'Recent search terms persist under "clarity-advanced-search-recent" (up to 10 entries).',
        'Each saved search records a name, filters, createdAt timestamp, and lastUsed timestamp.',
        'Up to 20 saved searches can be stored. The bookmarks popover includes inline name input and delete actions.',
      ],
      sourceFile: 'components/search/advanced-message-search.tsx',
    },
  ],
}
