# Documentation Viewer Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Showcase App                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  /docs Page  │    │ Component    │    │   Sidebar    │
│              │    │ Demo Pages   │    │  Navigation  │
└──────┬───────┘    └──────┬───────┘    └──────────────┘
       │                   │
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │  Documentation Components  │
    └────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌────────────────┐  ┌────────────────┐
│ Documentation  │  │ Documentation  │
│    Viewer      │  │     Search     │
└────────┬───────┘  └────────┬───────┘
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Documentation   │
         │     Database     │
         └──────────────────┘
```

## Component Hierarchy

```
DocumentationViewer
├── Header
│   ├── Component Name
│   ├── Description
│   ├── Tags
│   ├── Category Badge
│   └── Search Input
├── Tabs
│   ├── Overview Tab
│   ├── Props Tab
│   ├── Examples Tab
│   ├── Best Practices Tab
│   └── Troubleshooting Tab
├── Content Area
│   ├── Overview
│   │   ├── Description
│   │   ├── Quick Reference
│   │   └── RelatedComponents
│   ├── PropsTable
│   │   └── PropRow[]
│   │       ├── Name + Copy Button
│   │       ├── Type (expandable)
│   │       ├── Required Indicator
│   │       ├── Description
│   │       └── Default Value
│   ├── Examples
│   │   └── CodeExample[]
│   │       ├── Title
│   │       ├── Description
│   │       └── Code Block + Copy
│   ├── BestPractices
│   │   └── Practice Item[]
│   │       ├── Checkmark Icon
│   │       └── Text
│   └── TroubleshootingGuide
│       └── Troubleshooting Item[]
│           ├── Problem Section
│           └── Solution Section
│               └── Optional Code
└── Footer
    └── External Docs Link

DocumentationSearch
├── Search Input
│   ├── Search Icon
│   ├── Input Field
│   ├── Clear Button
│   └── Keyboard Shortcut Badge
└── Results Dropdown
    └── Result Item[]
        ├── Component Name
        ├── Description
        ├── Category Badge
        └── Tags
```

## Data Flow

```
┌──────────────────────────────────────────────────┐
│          component-docs-data.ts                  │
│  ┌────────────────────────────────────────────┐ │
│  │  componentDocsDatabase: ComponentDocs[]    │ │
│  │  - name: string                            │ │
│  │  - description: string                     │ │
│  │  - category: string                        │ │
│  │  - tags: string[]                          │ │
│  │  - props: PropDefinition[]                 │ │
│  │  - examples: CodeExample[]                 │ │
│  │  - bestPractices: string[]                 │ │
│  │  - troubleshooting: TroubleshootingItem[]  │ │
│  │  - relatedComponents: string[]             │ │
│  └────────────────────────────────────────────┘ │
└───────────────────┬──────────────────────────────┘
                    │
                    │ getComponentDocs(name)
                    │ getAllComponentNames()
                    │ getComponentsByCategory(cat)
                    ▼
┌──────────────────────────────────────────────────┐
│              docs-parser.ts                      │
│  ┌────────────────────────────────────────────┐ │
│  │  buildSearchIndex(docs)                    │ │
│  │  searchDocs(index, query)                  │ │
│  │  formatType(type)                          │ │
│  │  parseTypeScriptInterface(code)            │ │
│  └────────────────────────────────────────────┘ │
└───────────────────┬──────────────────────────────┘
                    │
                    │ Search Index
                    │ Filtered Results
                    ▼
┌──────────────────────────────────────────────────┐
│          Documentation Components                │
│  ┌────────────────────────────────────────────┐ │
│  │  DocumentationViewer                       │ │
│  │  DocumentationSearch                       │ │
│  │  PropsTable                                │ │
│  │  CodeExample                               │ │
│  │  BestPractices                             │ │
│  │  TroubleshootingGuide                      │ │
│  │  RelatedComponents                         │ │
│  └────────────────────────────────────────────┘ │
└───────────────────┬──────────────────────────────┘
                    │
                    │ Rendered UI
                    ▼
┌──────────────────────────────────────────────────┐
│              User Interface                      │
│  ┌────────────────────────────────────────────┐ │
│  │  Interactive Documentation                 │ │
│  │  - View component docs                     │ │
│  │  - Search components                       │ │
│  │  - Copy code examples                      │ │
│  │  - Navigate related components             │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## Search Flow

```
User Action
    │
    ├─> Press ⌘K
    │       │
    │       └─> Focus search input
    │
    ├─> Type query
    │       │
    │       ├─> buildSearchIndex()
    │       │       │
    │       │       └─> Create searchable index
    │       │           - Component names
    │       │           - Props + types
    │       │           - Examples
    │       │           - Best practices
    │       │           - Troubleshooting
    │       │
    │       └─> searchDocs(index, query)
    │               │
    │               ├─> Filter by query
    │               ├─> Prioritize name matches
    │               ├─> Return top 10 results
    │               │
    │               └─> Display results
    │                   - Component name
    │                   - Description
    │                   - Category
    │                   - Tags
    │
    └─> Select result
            │
            └─> Load component docs
                    │
                    └─> Display in DocumentationViewer
```

## User Journey

```
┌───────────────────┐
│  User arrives at  │
│  Showcase         │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Navigates to     │
│  /docs page       │
└─────────┬─────────┘
          │
          ├──> Option 1: Browse sidebar
          │       │
          │       └──> Click component
          │               │
          │               └──> View docs
          │
          └──> Option 2: Search
                  │
                  ├──> Press ⌘K
                  ├──> Type component name
                  ├──> See instant results
                  └──> Click result
                          │
                          └──> View docs
                                  │
                                  ├──> Read Overview
                                  ├──> Check Props Table
                                  ├──> Copy Examples
                                  ├──> Read Best Practices
                                  ├──> Review Troubleshooting
                                  └──> Navigate to Related
```

## Integration Patterns

### Pattern 1: Standalone Documentation Page

```
/docs page
    │
    ├─> DocumentationSearch (top)
    │       │
    │       └─> onSelectComponent() -> setSelected()
    │
    ├─> Sidebar (left)
    │       │
    │       └─> Component list by category
    │               │
    │               └─> onClick() -> setSelected()
    │
    └─> DocumentationViewer (main)
            │
            └─> Display selected component docs
```

### Pattern 2: Integrated with Component Demo

```
Component Demo Page
    │
    ├─> Demo Section (left)
    │       │
    │       └─> Interactive component
    │
    └─> Documentation Section (right)
            │
            ├─> Toggle button (show/hide)
            │
            └─> DocumentationViewer
                    │
                    └─> Context-aware docs for demo
```

### Pattern 3: Quick Reference

```
Component Card
    │
    ├─> Component Preview
    │
    └─> "View Docs" button
            │
            └─> Modal/Drawer with DocumentationViewer
```

## Technology Stack

```
┌────────────────────────────────────┐
│          React 19                  │
│  - Client Components                │
│  - Hooks (useState, useMemo, etc)  │
│  - Refs for DOM access             │
└────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│         TypeScript                 │
│  - Full type safety                │
│  - Discriminated unions            │
│  - Type inference                  │
└────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│        Tailwind CSS                │
│  - Utility classes                 │
│  - Custom glass morphism           │
│  - Responsive breakpoints          │
│  - Dark mode support               │
└────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│        Lucide Icons                │
│  - Consistent icon system          │
│  - Accessible icons                │
└────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│         Next.js 15                 │
│  - App router                      │
│  - File-based routing              │
│  - Server/Client components        │
└────────────────────────────────────┘
```

## Performance Optimizations

```
┌────────────────────────────────────┐
│  Build Time                        │
│  - Search index pre-built          │
│  - Type checking                   │
│  - Tree shaking                    │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Runtime                           │
│  - useMemo for search results      │
│  - Lazy rendering of tabs          │
│  - Debounced search input          │
│  - Virtual scrolling ready         │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  User Interaction                  │
│  - Instant search results          │
│  - Smooth transitions              │
│  - Efficient re-renders            │
└────────────────────────────────────┘
```

## Accessibility Architecture

```
┌────────────────────────────────────┐
│  Keyboard Navigation               │
│  - ⌘K: Focus search                │
│  - Escape: Close modals            │
│  - Tab: Navigate elements          │
│  - Enter: Activate/Select          │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Screen Readers                    │
│  - ARIA labels                     │
│  - Semantic HTML                   │
│  - Role attributes                 │
│  - Live regions                    │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Visual Accessibility              │
│  - High contrast mode              │
│  - Focus indicators                │
│  - Color contrast (WCAG AA)        │
│  - Reduced motion support          │
└────────────────────────────────────┘
```

## File Organization

```
apps/component-showcase/
│
├── components/docs/          # Documentation UI components
│   ├── DocumentationViewer.tsx   # Main viewer with tabs
│   ├── DocumentationSearch.tsx   # Search with ⌘K
│   ├── PropsTable.tsx           # Interactive props table
│   ├── CodeExample.tsx          # Code snippets
│   ├── BestPractices.tsx        # Best practices list
│   ├── TroubleshootingGuide.tsx # Problem/solution guide
│   ├── RelatedComponents.tsx    # Related component links
│   └── index.ts                 # Public exports
│
├── lib/                      # Utilities and data
│   ├── docs-parser.ts           # TypeScript parsing
│   └── component-docs-data.ts   # Documentation database
│
├── app/                      # Pages
│   ├── docs/
│   │   └── page.tsx             # Main documentation page
│   └── [category]/
│       └── page.tsx             # Component demo pages
│
└── documentation/            # Meta documentation
    ├── README.md
    ├── DOCUMENTATION_VIEWER_SUMMARY.md
    ├── INLINE_DOCS_FEATURES.md
    └── DOCUMENTATION_ARCHITECTURE.md  # This file
```

## State Management

```
┌────────────────────────────────────┐
│  Component-Level State             │
│  - useState for UI state           │
│  - useRef for DOM references       │
│  - useMemo for computed values     │
│  - useEffect for side effects      │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Search State                      │
│  - query: string                   │
│  - isOpen: boolean                 │
│  - results: SearchIndex[]          │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│  Viewer State                      │
│  - activeTab: Tab                  │
│  - expandedProps: Set<string>      │
│  - copiedProp: string | null       │
└────────────────────────────────────┘
```

## Future Architecture Enhancements

```
Current Architecture
    │
    ├─> Add Auto-Generation
    │       │
    │       └─> TypeScript AST parsing
    │           JSDoc extraction
    │           Auto-update on file changes
    │
    ├─> Add Live Playground
    │       │
    │       └─> Sandboxed code execution
    │           Real-time preview
    │           Hot reload
    │
    ├─> Add Versioning
    │       │
    │       └─> Version history
    │           Change tracking
    │           Migration guides
    │
    └─> Add Analytics
            │
            └─> Usage tracking
                Popular components
                Search patterns
```

## Summary

The documentation viewer architecture provides:

- **Modular Design**: Each component has a single responsibility
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized rendering and search
- **Accessibility**: WCAG 2.1 AA compliant
- **Extensibility**: Easy to add new features
- **Maintainability**: Clean, well-organized code

The system seamlessly integrates with the Component Showcase to provide comprehensive, interactive documentation for all Clarity Chat components.
