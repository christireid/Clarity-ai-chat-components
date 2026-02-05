# Playground Architecture

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Playground Toolbar                            │
│  [Theme] | [Share] [Export] [Import] | [Reset All]                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────────────────┬──────────────────────────┐
│              │                          │                          │
│  Component   │     Live Preview         │    Generated Code        │
│  Selector    │                          │                          │
│              │  ┌────────────────────┐  │  ┌────────────────────┐ │
│ ┌──────────┐ │  │                    │  │  │ import { ... }     │ │
│ │ChatInput▼│ │  │   [Component       │  │  │                    │ │
│ └──────────┘ │  │    Rendering]      │  │  │ export function    │ │
│              │  │                    │  │  │   Example() {      │ │
│ Import:      │  │                    │  │  │   return (         │ │
│ @clarity/... │  │                    │  │  │     <Component     │ │
│              │  └────────────────────┘  │  │       prop={...}   │ │
│──────────────│                          │  │     />             │ │
│  Props       │  [Fullscreen] [Theme]    │  │   )                │ │
│  Editor      │                          │  │ }                  │ │
│              │  Stats:                  │  └────────────────────┘ │
│ placeholder  │  • Component: ChatInput  │                          │
│ ┌──────────┐ │  • Props: 5 active      │  [TSX] [JSX]             │
│ │ text...  │ │  • Theme: Light         │  [Component] [Full]      │
│ └──────────┘ │                          │                          │
│              │                          │  [Copy] [Download]       │
│ maxLength    │                          │                          │
│ ◄───────────►│                          │  📊 Stats:               │
│ 4000    ▼    │                          │  • Lines: 12             │
│              │                          │  • Chars: 247            │
│ ☑ enableVoice│                          │                          │
│              │                          │                          │
│ [Examples ▼] │                          │                          │
│ [Reset]      │                          │                          │
│              │                          │                          │
└──────────────┴──────────────────────────┴──────────────────────────┘
```

## Component Tree

```
PlaygroundPage
├── PlaygroundProvider (Context)
│   ├── PlaygroundToolbar
│   │   ├── Theme Toggle
│   │   ├── Share Button
│   │   ├── Export Button
│   │   ├── Import Button
│   │   └── Reset Button
│   │
│   ├── ComponentSelector
│   │   ├── Dropdown
│   │   │   ├── Category Groups
│   │   │   └── Component Items
│   │   └── Component Info Panel
│   │
│   ├── PropsEditor
│   │   ├── Examples Accordion
│   │   ├── Props List
│   │   │   ├── StringInput
│   │   │   ├── NumberSlider
│   │   │   ├── BooleanToggle
│   │   │   ├── SelectDropdown
│   │   │   ├── ColorPicker
│   │   │   └── JSONEditor
│   │   └── Reset Button
│   │
│   ├── LivePreview
│   │   ├── Header (with Fullscreen)
│   │   ├── Preview Container
│   │   │   ├── ErrorBoundary
│   │   │   └── Suspense
│   │   │       └── DynamicComponent
│   │   └── Info Panel
│   │
│   └── CodeDisplay
│       ├── Header
│       ├── Language Selector
│       ├── Tab Selector
│       ├── Code Display
│       │   ├── Syntax Highlighter
│       │   └── Line Numbers
│       ├── Actions (Copy/Download)
│       └── Stats
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PlaygroundContext                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ State:                                                   │   │
│  │ • selectedComponent: string                             │   │
│  │ • props: Record<string, PropValue>                      │   │
│  │ • showCode: boolean                                     │   │
│  │ • codeLanguage: 'tsx' | 'jsx'                          │   │
│  │ • theme: 'light' | 'dark'                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
    │ Component    │    │ Props       │    │ Code         │
    │ Selector     │    │ Editor      │    │ Generator    │
    └──────────────┘    └─────────────┘    └──────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    setSelectedComponent   updateProp         generateCode
           │                    │                    │
           └────────────────────┴────────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │  Live Preview     │
                     │  Code Display     │
                     └──────────────────┘
```

## State Management Flow

```
User Action → Context Method → State Update → Component Re-render

Examples:

1. Select Component
   Click Dropdown → setSelectedComponent() → Update state → Re-render all

2. Change Prop
   Edit Input → updateProp(key, value) → Update state → Re-render preview + code

3. Share Configuration
   Click Share → generateShareUrl() → Copy to clipboard → Show feedback

4. Export Config
   Click Export → exportConfig() → Download JSON → No state change

5. Import Config
   Select File → importConfig() → Parse and update state → Re-render all

6. Reset Props
   Click Reset → resetProps() → Restore defaults → Re-render all
```

## Code Generation Pipeline

```
┌──────────────────┐
│ Component Def    │
│ + Current Props  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ filterProps()    │
│ (remove defaults)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ formatProps()    │
│ (serialize vals) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ generateImports()│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ assembleCode()   │
│ (template fill)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ syntaxHighlight()│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Display Code     │
└──────────────────┘
```

## Component Definition Structure

```typescript
ComponentDefinition
├── id: string                  // Unique identifier
├── name: string                // Display name
├── category: string            // Group category
├── description: string         // Brief description
├── importPath: string          // Package import path
├── props: PropDefinition[]     // Available props
│   ├── name: string
│   ├── type: PropType          // Input type
│   ├── default: PropValue      // Default value
│   ├── description: string     // Help text
│   ├── required?: boolean      // Optional flag
│   ├── options?: Option[]      // For select type
│   ├── min?: number            // For number type
│   ├── max?: number            // For number type
│   └── step?: number           // For number type
└── examples?: Example[]        // Quick presets
    ├── name: string
    ├── description: string
    └── props: Record<string, PropValue>
```

## URL Sharing Format

```
/playground?config=BASE64_JSON

Decoded JSON Structure:
{
  "component": "ChatInput",         // Selected component
  "props": {                        // Current prop values
    "placeholder": "Custom text",
    "maxLength": 5000,
    "enableVoice": true
  },
  "showCode": true,                 // Code panel visibility
  "codeLanguage": "tsx",            // Language preference
  "theme": "dark"                   // Preview theme
}
```

## Error Handling

```
┌─────────────────────────────────────────┐
│         Error Boundaries                │
├─────────────────────────────────────────┤
│                                         │
│  LivePreview                            │
│  ├── ErrorBoundary                      │
│  │   ├── Catch render errors            │
│  │   └── Show fallback UI              │
│  └── Suspense                           │
│      └── Show loading state             │
│                                         │
│  CodeDisplay                            │
│  ├── Try/catch clipboard ops            │
│  └── Validate generated code            │
│                                         │
│  ConfigImport                           │
│  ├── Validate JSON structure            │
│  ├── Sanitize prop values               │
│  └── Fallback to defaults               │
│                                         │
└─────────────────────────────────────────┘
```

## Performance Optimizations

```
1. Memoization
   ├── useMemo for expensive computations
   ├── useCallback for event handlers
   └── React.memo for static components

2. Lazy Loading
   ├── Dynamic imports for components
   ├── Code splitting by route
   └── Suspense boundaries

3. Debouncing
   ├── Prop updates (300ms)
   ├── Search input (200ms)
   └── Code generation (100ms)

4. Virtual Scrolling
   ├── Long prop lists
   ├── Large code output
   └── Component selector

5. State Management
   ├── Context prevents prop drilling
   ├── Selective re-renders
   └── Batched updates
```

## File Dependencies

```
page.tsx
├── PlaygroundContext
│   ├── componentDefinitions
│   └── types
│
├── ComponentSelector
│   ├── PlaygroundContext
│   ├── componentDefinitions
│   └── primitives (cn)
│
├── PropsEditor
│   ├── PlaygroundContext
│   ├── types
│   └── primitives (cn)
│
├── LivePreview
│   ├── PlaygroundContext
│   ├── ErrorBoundary
│   └── dynamic component registry
│
├── CodeDisplay
│   ├── PlaygroundContext
│   ├── codeGenerator
│   └── primitives (cn)
│
└── PlaygroundToolbar
    ├── PlaygroundContext
    └── primitives (cn)
```

## Integration Points

```
┌─────────────────────────────────────────┐
│        Component Showcase App           │
├─────────────────────────────────────────┤
│                                         │
│  Sidebar                                │
│  └── Link to /playground                │
│                                         │
│  Design System                          │
│  ├── glassmorphism styles               │
│  ├── primitive components               │
│  └── utility functions                  │
│                                         │
│  Component Library                      │
│  ├── @clarity-chat/react                │
│  ├── @clarity-chat/primitives           │
│  ├── @clarity-chat/error-handling       │
│  └── @clarity-chat/token-optimization   │
│                                         │
│  Future Integrations                    │
│  ├── Component docs                     │
│  ├── Storybook                          │
│  └── API reference                      │
│                                         │
└─────────────────────────────────────────┘
```

## Security Considerations

```
1. Code Generation
   ├── No eval() or Function()
   ├── Sanitized prop values
   └── XSS prevention

2. JSON Import
   ├── Validate structure
   ├── Type checking
   └── Sanitize values

3. URL Parameters
   ├── Base64 decode validation
   ├── JSON parse try/catch
   └── Fallback to defaults

4. Clipboard Operations
   ├── User gesture required
   ├── HTTPS only
   └── Error handling
```

## Accessibility Features

```
1. Keyboard Navigation
   ├── Tab through all controls
   ├── Enter/Space to activate
   ├── Arrow keys in dropdowns
   └── Esc to close modals

2. ARIA Labels
   ├── role="button"
   ├── aria-label for icons
   ├── aria-expanded for dropdowns
   └── aria-live for updates

3. Focus Management
   ├── Visible focus indicators
   ├── Focus trap in modals
   └── Restore focus on close

4. Screen Readers
   ├── Semantic HTML
   ├── Alt text for images
   ├── Status announcements
   └── Error messages
```

This architecture provides a solid foundation for the playground while maintaining flexibility for future enhancements.
