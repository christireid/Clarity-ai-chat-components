# Component Gallery - Structure Diagram

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     Component Gallery                           │
│              Browse, search, and explore all 180+ components    │
│                         [180+ Components]                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [🔍 Search components...]  [Sort by name ▼]  [Grid] [List]    │
│  Filters: streaming × chat ×  [Clear all]                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────┐
│  SIDEBAR (1/4)   │  MAIN CONTENT (3/4)                          │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ CATEGORIES       │  TABS: [All (45)] [Favorites (3)] [Recent (5)]│
│ ├─ [🔷] All      │  ────────────────────────────────────────────│
│ ├─ [💬] Core ... │                                              │
│ ├─ [📨] Messages │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ ├─ [🧠] AI Rea.. │  │  CARD 1  │ │  CARD 2  │ │  CARD 3  │    │
│ ├─ [🔧] Tools    │  │          │ │          │ │          │    │
│ └─ ...           │  │ ClarityC │ │ ChatWind │ │ ChatInpu │    │
│                  │  │ hatApp   │ │ ow       │ │ t        │    │
│ QUICK ACCESS     │  │          │ │          │ │          │    │
│ ├─ ⭐ Favorites  │  │ Complete │ │ Message  │ │ Input    │    │
│ └─ 🕐 Recent     │  │ chat...  │ │ display  │ │ field... │    │
│                  │  │          │ │          │ │          │    │
│ POPULAR TAGS     │  │ [Core]   │ │ [Core]   │ │ [Input]  │    │
│ chat streaming   │  │ [⭐]     │ │ [⭐]     │ │ [⭐]     │    │
│ messages voice   │  │ [View]   │ │ [View]   │ │ [View]   │    │
│ tools agent...   │  └──────────┘ └──────────┘ └──────────┘    │
│                  │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

## Component Card Structure

```
┌────────────────────────────────────────────────┐
│  [NEW] 🔖                                      │  Status Badge + Bookmark
│                                                 │
│  [💬] ClarityChatApp                           │  Icon + Name
│  Complete chat application with all features   │  Description
│                                                 │
│  [chat] [streaming] [memory] +2                │  Tags
│                                                 │
│  [Complex] [⚡ Interactive]                     │  Metadata
│                                                 │
│  [👁️ View Demo] [↗]                            │  Action Buttons
└────────────────────────────────────────────────┘
```

## Detail Modal Structure

```
┌─────────────────────────────────────────────────────┐
│  ClarityChatApp                              [🔖]  │  Title + Bookmark
│  Complete chat application with all features       │  Description
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Core Chat] [Complex] [NEW] [⚡ Interactive]      │  Meta Badges
│                                                     │
│  TAGS                                               │
│  chat, streaming, memory, tools, voice, file-upload│
│                                                     │
│  KEY FEATURES                                       │
│  ✓ Streaming          ✓ Memory                    │
│  ✓ Tools              ✓ Voice                      │
│  ✓ File Upload                                     │
│                                                     │
│  [👁️ View Full Demo]  [▶️ Try in Playground]      │  Action Buttons
└─────────────────────────────────────────────────────┘
```

## State Flow Diagram

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ├──────> Search Input ────────> Filter Components
       │                                      │
       ├──────> Select Category ──────> Filter by Category
       │                                      │
       ├──────> Click Tag ────────────> Add Tag Filter
       │                                      │
       ├──────> Sort Dropdown ────────> Re-order Results
       │                                      │
       ├──────> Toggle View ──────────> Change Layout
       │                                      │
       ├──────> Click Bookmark ───────> Save to Favorites
       │                            │
       │                            └──> Update localStorage
       │
       └──────> Click Card ──────────> Show Detail Modal
                                   │
                                   └──> Add to Recently Viewed
                                        │
                                        └──> Update localStorage
```

## Data Flow

```
allComponents (180+ items)
      │
      ├──> Filter by Search Query
      │         │
      ├──> Filter by Category
      │         │
      ├──> Filter by Tags
      │         │
      └──> Sort by Selected Field
                │
                └──> filteredComponents
                          │
                          ├──> Display in Grid/List
                          └──> Show Count

favorites (array of IDs)
      │
      └──> localStorage ←→ React State ←→ Component Cards

recentlyViewed (array of IDs)
      │
      └──> localStorage ←→ React State ←→ Recent Tab
```

## Tab System

```
┌──────────────────────────────────────────────────────┐
│  [All (45)]  [Favorites (3)]  [Recent (5)]          │
└──────────────────────────────────────────────────────┘
      │              │                 │
      │              │                 │
      ▼              ▼                 ▼
 All filtered    Favorite           Recent
 components      components         components
      │              │                 │
      └──────────────┴─────────────────┘
                     │
                     ▼
              Rendered as Grid/List
```

## Component Categories

```
Gallery
├── Core Chat (8)
│   ├── ClarityChatApp
│   ├── ChatWindow
│   └── ChatInput
│
├── Messages (12)
│   ├── MessageBubble
│   ├── StreamingMessage
│   └── TypingIndicator
│
├── AI Reasoning (15)
│   ├── Think
│   ├── ChainOfThought
│   └── AgentPanel
│
├── Tools (6)
│   ├── ToolCard
│   └── ToolExecution
│
├── Input (10)
│   ├── VoiceInput
│   ├── FileUpload
│   └── MentionInput
│
├── Search (6)
│   ├── MessageSearch
│   └── SemanticSearch
│
├── Token Management (8)
│   ├── TokenCounter
│   └── TokenBudget
│
├── Dashboards (7)
│   ├── AnalyticsDashboard
│   └── PerformanceDashboard
│
├── Code & Data (8)
│   ├── CodeBlock
│   ├── Terminal
│   └── DataTable
│
├── Media & Files (6)
│   ├── FileTree
│   └── ImageGallery
│
├── Navigation (5)
│   ├── CommandPalette
│   └── ConversationHistory
│
├── Feedback (8)
│   ├── ToastNotifications
│   └── ErrorBoundary
│
├── Suggestions (7)
│   ├── FollowUpSuggestions
│   └── PromptSuggestions
│
├── Theme (4)
│   ├── ThemeCustomizer
│   └── ThemeSwitcher
│
├── Loading (8)
│   ├── SkeletonLoader
│   └── ProgressIndicator
│
├── Citations (6)
│   ├── CitationCard
│   └── InlineCitation
│
└── Primitives (25)
    ├── Button
    ├── Dialog
    └── DropdownMenu
```

## Filtering Logic

```
User Input
    │
    ├─── Search Query?
    │    └─── Filter: name/description/tags contains query
    │
    ├─── Category Selected?
    │    └─── Filter: category === selected
    │
    ├─── Tags Selected?
    │    └─── Filter: tags includes ANY selected tag
    │
    └─── Sort Applied?
         └─── Sort by: name|category|complexity
              Order: asc|desc

Result: Filtered & Sorted Component List
```

## Component States

```
Component Card States:
├── Default (unhovered)
├── Hovered (gradient overlay)
├── Favorited (gold bookmark icon)
├── Selected (in detail modal)
└── Recently Viewed (in recent tab)

Status Badges:
├── Stable (no badge)
├── Beta (yellow badge)
└── New (green badge)

Complexity Indicators:
├── Simple (green)
├── Moderate (yellow)
└── Complex (red)
```

## Responsive Breakpoints

```
Mobile (< 640px)
├── 1 column grid
├── Collapsed sidebar
└── Stacked filters

Tablet (640px - 1024px)
├── 2 column grid
├── Compact sidebar
└── Horizontal filters

Desktop (> 1024px)
├── 3 column grid
├── Full sidebar
└── All features visible

Large Desktop (> 1280px)
├── 3 column grid
├── Expanded sidebar
└── Maximum spacing
```

## Navigation Flow

```
Home Page
    │
    ├──> Click "Browse Gallery" ──> Gallery Page
    │                                     │
    ├──> Sidebar "Gallery" Link ─────────┤
    │                                     │
    └──> Quick Links ────────────────────┤
                                          │
                                          ▼
                                    Gallery View
                                          │
                                          ├──> Search/Filter
                                          │
                                          ├──> Select Component
                                          │    │
                                          │    └──> Detail Modal
                                          │         │
                                          │         ├──> View Demo
                                          │         │    │
                                          │         │    └──> Demo Page
                                          │         │
                                          │         └──> Try in Playground
                                          │              │
                                          │              └──> Playground Page
                                          │
                                          └──> Add to Favorites/Recent
                                               │
                                               └──> localStorage
```

This structure provides a clear visual representation of how the gallery is organized and how data flows through the application.
