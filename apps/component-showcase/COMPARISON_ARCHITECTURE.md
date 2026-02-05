# Component Comparison Mode - Architecture

## Component Hierarchy

```
/compare (page.tsx)
│
├── ComponentSelector (left)
│   ├── Search Input
│   ├── Category Groups
│   └── Component List
│
├── ComponentSelector (right)
│   ├── Search Input
│   ├── Category Groups
│   └── Component List
│
├── ComparisonToolbar
│   ├── Mode Buttons
│   │   ├── Split View
│   │   ├── Overlay View
│   │   └── Diff View
│   ├── Toggle Options
│   │   ├── Performance
│   │   └── Props
│   └── Action Buttons
│       ├── Screenshot
│       ├── Share URL
│       └── Export
│
└── ComparisonView
    ├── View Renderer (based on mode)
    │   ├── SplitView
    │   │   ├── Left Pane
    │   │   │   └── ComponentPreview
    │   │   ├── Draggable Divider
    │   │   └── Right Pane
    │   │       └── ComponentPreview
    │   │
    │   ├── OverlayView
    │   │   ├── Base Layer
    │   │   │   └── ComponentPreview
    │   │   ├── Overlay Layer
    │   │   │   └── ComponentPreview
    │   │   └── Opacity Slider
    │   │
    │   └── DiffView
    │       ├── Visual Comparison
    │       │   ├── Left Preview
    │       │   └── Right Preview
    │       └── Diff Table
    │           └── Property Rows
    │
    ├── PerformanceMetrics (conditional)
    │   ├── Render Time Card
    │   ├── Memory Usage Card
    │   ├── Bundle Size Card
    │   ├── Re-renders Card
    │   └── Performance Summary
    │
    └── PropsComparison (conditional)
        ├── Props Table
        │   └── Property Rows
        └── Usage Examples
            ├── Left Component Code
            └── Right Component Code
```

## Data Flow

```
┌─────────────────┐
│  User Actions   │
└────────┬────────┘
         │
         ├─── Select Component A ───┐
         ├─── Select Component B ───┤
         ├─── Change Mode ──────────┤
         ├─── Toggle Features ──────┤
         └─── Export/Share ─────────┤
                                    │
                                    ▼
                        ┌──────────────────┐
                        │   State Manager  │
                        │                  │
                        │ - leftComponent  │
                        │ - rightComponent │
                        │ - comparisonMode │
                        │ - showPerformance│
                        │ - showProps      │
                        └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
            ┌──────────┐  ┌──────────┐  ┌──────────┐
            │   View   │  │ Metrics  │  │  Props   │
            │ Renderer │  │ Measurer │  │ Analyzer │
            └────┬─────┘  └────┬─────┘  └────┬─────┘
                 │             │              │
                 ▼             ▼              ▼
         ┌──────────────┬──────────────┬──────────────┐
         │ Component    │ Performance  │ Property     │
         │ Previews     │ Data         │ Differences  │
         └──────────────┴──────────────┴──────────────┘
```

## State Management

### Page-Level State
```typescript
// /app/compare/page.tsx
const [leftComponent, setLeftComponent] = useState<string | null>(null)
const [rightComponent, setRightComponent] = useState<string | null>(null)
const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay' | 'diff'>('side-by-side')
const [showPerformance, setShowPerformance] = useState(true)
const [showProps, setShowProps] = useState(true)
```

### Component-Level State
```typescript
// ComparisonView
const [leftMetrics, setLeftMetrics] = useState<PerformanceMetrics | null>(null)
const [rightMetrics, setRightMetrics] = useState<PerformanceMetrics | null>(null)

// ComponentSelector
const [isOpen, setIsOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')

// SplitView
const [splitPosition, setSplitPosition] = useState(50)
const [isDragging, setIsDragging] = useState(false)

// OverlayView
const [opacity, setOpacity] = useState(50)
const [activeLayer, setActiveLayer] = useState<'left' | 'right'>('left')

// ComparisonToolbar
const [shareUrlCopied, setShareUrlCopied] = useState(false)
const [screenshotTaken, setScreenshotTaken] = useState(false)

// PropsComparison
const [copiedProp, setCopiedProp] = useState<string | null>(null)
```

## Component Communication

```
┌──────────────────────────────────────────────────────────┐
│                      Compare Page                         │
│                                                           │
│  ┌─────────────┐    Props    ┌─────────────┐            │
│  │  Component  │──────────────▶│  Component  │            │
│  │  Selector A │              │  Selector B │            │
│  └─────────────┘              └─────────────┘            │
│         │                              │                  │
│         │ onSelect()          onSelect()│                 │
│         ▼                              ▼                  │
│  ┌──────────────────────────────────────────┐            │
│  │           State Manager                  │            │
│  │   (leftComponent, rightComponent)        │            │
│  └──────────────┬───────────────────────────┘            │
│                 │                                         │
│                 │ Props                                   │
│                 ▼                                         │
│  ┌──────────────────────────────────────────┐            │
│  │        ComparisonToolbar                 │            │
│  │  (mode, performance, props toggles)      │            │
│  └──────────────┬───────────────────────────┘            │
│                 │                                         │
│                 │ Props                                   │
│                 ▼                                         │
│  ┌──────────────────────────────────────────┐            │
│  │         ComparisonView                   │            │
│  │                                          │            │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐│            │
│  │  │ SplitView│  │ Overlay  │  │ DiffView ││            │
│  │  └──────────┘  └──────────┘  └──────────┘│            │
│  │                                          │            │
│  │  ┌─────────────────────────────────────┐│            │
│  │  │     PerformanceMetrics              ││            │
│  │  └─────────────────────────────────────┘│            │
│  │                                          │            │
│  │  ┌─────────────────────────────────────┐│            │
│  │  │      PropsComparison                ││            │
│  │  └─────────────────────────────────────┘│            │
│  └──────────────────────────────────────────┘            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Event Flow

### Component Selection
```
User clicks dropdown
    → ComponentSelector opens
        → User types search query
            → List filters in real-time
                → User clicks component
                    → onSelect(componentId) fires
                        → Parent state updates
                            → ComparisonView re-renders
                                → Component preview loads
```

### Mode Switching
```
User clicks mode button
    → ComparisonToolbar fires onModeChange
        → Page state updates (comparisonMode)
            → ComparisonView receives new mode prop
                → Conditional rendering switches view
                    → New view component mounts
                        → Component previews render
```

### Performance Measurement
```
Components selected
    → ComparisonView useEffect triggers
        → measurePerformance() called
            → Metrics collected for both components
                → State updates with metrics
                    → PerformanceMetrics component renders
                        → Metrics displayed with comparisons
```

### Export/Share Actions
```
User clicks export/share
    → ComparisonToolbar handler fires
        → Data collected from current state
            → For Export:
                → JSON generated
                → File download triggered
            → For Share:
                → URL generated with query params
                → Clipboard.writeText() called
                → Success feedback shown
```

## Styling Architecture

### Design Tokens
```css
/* Glass-morphism variables */
.glass-card      /* Primary container */
.glass-panel     /* Secondary surface */
.glass-border    /* Subtle borders */

/* Color coding */
.text-blue-600   /* Component A */
.text-purple-600 /* Component B */
.text-green-500  /* Better performance */
.text-red-500    /* Removed items */
.text-yellow-500 /* Changed items */

/* Interactive states */
.hover:bg-muted
.focus:ring-2
.active:scale-95
```

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## Performance Optimizations

### Lazy Loading
```typescript
// ComponentPreview uses Suspense
<Suspense fallback={<Loader />}>
  <ComponentRenderer componentId={componentId} />
</Suspense>
```

### Memoization
```typescript
// Expensive calculations memoized
const filteredComponents = useMemo(() =>
  components.filter(comp => matches(comp, searchQuery)),
  [components, searchQuery]
)
```

### Debouncing
```typescript
// Drag operations debounced
const handleMouseMove = useCallback(
  debounce((e) => updatePosition(e), 16), // ~60fps
  []
)
```

## Type Safety

### Core Types
```typescript
interface ComponentOption {
  id: string
  name: string
  category: string
  description: string
}

interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  bundleSize: number
  reRenders: number
}

interface PropDefinition {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
  leftValue?: string
  rightValue?: string
}

type ComparisonMode = 'side-by-side' | 'overlay' | 'diff'
```

## Error Boundaries

```
ComparisonView
  └── ErrorBoundary
      ├── Try: Render comparison
      └── Catch: Show error message
          └── Fallback UI with retry button
```

## Accessibility Tree

```
<main role="main">
  <section aria-label="Component comparison">
    <h1>Component Comparison</h1>

    <div role="group" aria-label="Component selectors">
      <select aria-label="Select component A">...</select>
      <select aria-label="Select component B">...</select>
    </div>

    <nav role="toolbar" aria-label="Comparison options">
      <button aria-pressed="true">Split View</button>
      <button aria-pressed="false">Overlay</button>
      <button aria-pressed="false">Diff</button>
    </nav>

    <div role="region" aria-label="Comparison results">
      <!-- Comparison content -->
    </div>
  </section>
</main>
```

## Future Architecture Considerations

### Scalability
- Component registry system for dynamic imports
- Plugin architecture for custom comparison modes
- Extensible metric system
- Theming system integration

### Performance
- Virtual scrolling for large component lists
- Web Workers for heavy calculations
- IndexedDB for comparison history
- Service Worker for offline support

### Testing
- Component isolation for unit tests
- Mock data generators
- Snapshot testing for visual regression
- E2E test scenarios

This architecture provides a solid foundation for the comparison mode while remaining flexible for future enhancements.
