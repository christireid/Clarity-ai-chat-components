# Advanced Message Search - Component Architecture

## Before Refactoring

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        advanced-message-search.tsx (1,417 lines)            │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ • All state management                             │    │
│  │ • Search input & controls                          │    │
│  │ • Filter panel UI (300+ lines)                     │    │
│  │ • Saved searches UI (150+ lines)                   │    │
│  │ • Results display UI (100+ lines)                  │    │
│  │ • Active filter pills UI (100+ lines)              │    │
│  │ • Filter logic (80+ lines)                         │    │
│  │ • Saved searches logic (120+ lines)                │    │
│  │ • Export logic (80+ lines)                         │    │
│  │ • Type definitions (80+ lines)                     │    │
│  │ • Constants & presets (60+ lines)                  │    │
│  │ • Helper functions                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## After Refactoring

```
┌───────────────────────────────────────────────────────────────────────────┐
│                   Search Module Architecture                              │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│               advanced-message-search.tsx (532 lines)                   │
│                        Main Component                                   │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ • Main search input                                        │        │
│  │ • Orchestrate subcomponents                                │        │
│  │ • Manage top-level state                                   │        │
│  │ • Export logic (CSV, JSON, MD)                             │        │
│  │ • Size variants                                            │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  Uses:                                                                  │
│  ├─ useFilteredMessages()                                              │
│  ├─ useSavedSearches()                                                 │
│  ├─ useActiveFilterCount()                                             │
│  └─ useDeferredSearch()                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ Renders
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         UI Components Layer                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                   │
│  │ SearchFiltersPanel   │  │ SavedSearchesPanel   │                   │
│  │    (350 lines)       │  │     (153 lines)      │                   │
│  ├──────────────────────┤  ├──────────────────────┤                   │
│  │ • Role filter        │  │ • Save searches      │                   │
│  │ • Model filter       │  │ • Load searches      │                   │
│  │ • Date range         │  │ • Delete searches    │                   │
│  │ • Token range        │  │ • Recent searches    │                   │
│  │ • Quick presets      │  │ • LocalStorage       │                   │
│  │ • Boolean filters    │  │   persistence        │                   │
│  │ • Expandable         │  │                      │                   │
│  │   sections           │  │                      │                   │
│  └──────────────────────┘  └──────────────────────┘                   │
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐                   │
│  │ ActiveFiltersPills   │  │ SearchResultsSummary │                   │
│  │    (118 lines)       │  │     (159 lines)      │                   │
│  ├──────────────────────┤  ├──────────────────────┤                   │
│  │ • Filter badges      │  │ • Results count      │                   │
│  │ • Remove buttons     │  │ • Sort indicator     │                   │
│  │ • Animations         │  │ • Export dropdown    │                   │
│  │ • All filter types   │  │ • Copy to clipboard  │                   │
│  │                      │  │ • Status indicator   │                   │
│  │                      │  │ • Animations         │                   │
│  └──────────────────────┘  └──────────────────────┘                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          Hooks Layer                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ useFilteredMessages (87 lines)                             │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │ • Apply role filter                                        │        │
│  │ • Apply date range filter                                  │        │
│  │ • Apply model filter                                       │        │
│  │ • Apply token range filter                                 │        │
│  │ • Apply attachment filter                                  │        │
│  │ • Apply error filter                                       │        │
│  │ • Apply sorting (5 options)                                │        │
│  │ • Memoized for performance                                 │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ useSavedSearches (126 lines)                               │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │ • Load from localStorage                                   │        │
│  │ • Save to localStorage                                     │        │
│  │ • Validate stored data                                     │        │
│  │ • Manage recent searches (max 10)                          │        │
│  │ • Manage saved searches (max 20)                           │        │
│  │ • Track last used timestamp                                │        │
│  │ • Delete searches                                          │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ useActiveFilterCount (19 lines)                            │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │ • Count active filters                                     │        │
│  │ • Memoized calculation                                     │        │
│  │ • Badge display logic                                      │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      Types & Constants Layer                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ types.ts (79 lines)                                        │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │ • SearchFilters                                            │        │
│  │ • SavedSearch                                              │        │
│  │ • SortOption                                               │        │
│  │ • FilterPreset                                             │        │
│  │ • ExtendedMessage                                          │        │
│  │ • ExportFormat                                             │        │
│  │ • SizeVariant                                              │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ constants.tsx (63 lines)                                   │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │ • STORAGE_KEY_SAVED                                        │        │
│  │ • STORAGE_KEY_RECENT                                       │        │
│  │ • defaultPresets (5 presets)                               │        │
│  │   - User Messages                                          │        │
│  │   - AI Responses                                           │        │
│  │   - Has Attachments                                        │        │
│  │   - Has Errors                                             │        │
│  │   - Today                                                  │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          Export Index                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  index.ts                                                               │
│  ├─ Main Component                                                     │
│  ├─ All Types                                                          │
│  ├─ All Subcomponents (optional)                                       │
│  ├─ All Hooks (optional)                                               │
│  └─ All Constants (optional)                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```
User Input
    │
    ▼
┌─────────────────────────┐
│  Main Search Input      │
│  (advanced-message-     │
│   search.tsx)           │
└─────────────────────────┘
    │
    ├──► useActiveFilterCount() ──────┐
    │                                  │
    ├──► useSavedSearches() ──────────┤
    │                                  │
    ├──► useFilteredMessages() ───────┤
    │                                  │
    └──► useDeferredSearch() ─────────┤
                                       │
                                       ▼
┌──────────────────────────────────────────────────────┐
│               Render Subcomponents                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────┐  ┌─────────────────────┐   │
│  │ SearchFiltersPanel │  │ SavedSearchesPanel  │   │
│  └────────────────────┘  └─────────────────────┘   │
│           │                        │                │
│           ▼                        ▼                │
│  ┌────────────────────┐  ┌─────────────────────┐   │
│  │ ActiveFiltersPills │  │ SearchResultsSummary│   │
│  └────────────────────┘  └─────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
                  Final Results
                        │
                        ▼
            onResultsChange callback
```

## Data Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────┐
│ Update Local State      │
│ (filters, sortOption)   │
└──────┬──────────────────┘
       │
       ├──► useActiveFilterCount(filters) ──► activeFilterCount
       │
       ├──► useDeferredSearch(messages, query) ──► filteredMessages
       │
       └──► useFilteredMessages(filteredMessages, filters, sortOption)
                    │
                    ▼
              finalResults
                    │
                    ├──► Render ActiveFiltersPills
                    ├──► Render SearchResultsSummary
                    └──► onResultsChange(finalResults)
```

## File Size Comparison

### Before
```
advanced-message-search.tsx: ████████████████████████████ 1,417 lines
```

### After
```
advanced-message-search.tsx:  ██████████ 532 lines (main)
SearchFiltersPanel.tsx:       ███████ 350 lines
SavedSearchesPanel.tsx:       ███ 153 lines
SearchResultsSummary.tsx:     ███ 159 lines
ActiveFiltersPills.tsx:       ██ 118 lines
useFilteredMessages.ts:       █ 87 lines
useSavedSearches.ts:          ██ 126 lines
useActiveFilterCount.ts:      █ 19 lines
types.ts:                     █ 79 lines
constants.tsx:                █ 63 lines
────────────────────────────────────────
Total:                        ████████████████████████████████ 1,689 lines
```

## Key Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Main file lines | 1,417 | 532 | -62% |
| Number of files | 1 | 11 | +1,000% |
| Largest file | 1,417 | 350 | -75% |
| Average file size | 1,417 | 154 | -89% |
| Reusable components | 0 | 4 | +∞ |
| Reusable hooks | 0 | 3 | +∞ |
| Test isolation | Poor | Excellent | ⬆⬆⬆ |
