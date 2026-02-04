# Model Selector Component Specification

**Status**: Draft **Created**: January 27, 2026 **Last Updated**: January 27, 2026 **Author**:
Claude (Clarity AI Research Agent)

## Executive Summary

The Model Selector component provides a flexible, accessible interface for selecting AI models
within chat applications. Inspired by HuggingChat's Omni-router approach and CopilotKit's hybrid
architecture, this component balances intelligent automation with user control through progressive
disclosure.

### Key Design Principles

1. **Progressive Disclosure** - Simple by default, powerful when needed
2. **Intelligent Automation** - Smart defaults that work without configuration
3. **Capability-Driven UI** - Interface adapts based on model capabilities
4. **Multi-Provider Support** - Works with any OpenAI-compatible API
5. **Accessibility First** - WCAG 2.1 AA compliant, keyboard navigable
6. **Framework Flexibility** - Provider-agnostic design patterns

---

## Inspiration & Research

### HuggingChat Insights

**Omni Router Pattern**:

- Automatic intelligent routing across 115+ models
- Users need zero model knowledge for excellent results
- Expert manual selection available for power users
- Server-side routing model (katanemo/Arch-Router-1.5B)

**Multi-Provider Architecture**:

- Single models available across multiple providers
- Provider selection per model (novita, cerebras, together, fireworks-ai, etc.)
- Real-time pricing visibility (input/output tokens)
- Fallback capabilities for reliability

**Capability-Driven UI**:

```javascript
if (model.multimodal) enableImageUpload()
if (model.supportsTools) showToolsPanel()
if (model.contextLength > 100000) enableLongDocumentMode()
```

**Rich Metadata**:

```json
{
  "id": "meta-llama/Llama-3.1-8B-Instruct",
  "multimodal": false,
  "supportsTools": true,
  "contextLength": 131072,
  "providers": ["novita", "cerebras", "together"]
}
```

### CopilotKit Insights

**Hybrid Component Philosophy**:

- Pre-built components for rapid prototyping
- Headless hooks for full customization
- Smooth transition between modes

**Progressive Customization Levels**:

```typescript
// Level 1: Default
<ModelSelector />

// Level 2: Props customization
<ModelSelector
  defaultModel="gpt-4o"
  showProviders={true}
/>

// Level 3: Sub-component replacement
<ModelSelector
  components={{
    ModelCard: CustomModelCard,
    ProviderBadge: CustomProviderBadge
  }}
/>

// Level 4: Fully headless
const { models, selectedModel, selectModel } = useModelSelector()
```

**Type Safety**:

- Zod schema validation
- TypeScript-first with generics
- Full type inference

---

## Component Architecture

### Three-Tier Design

**1. Pre-Built Component** (`<ModelSelector />`)

- Drop-in replacement, works immediately
- Sensible defaults, zero configuration required
- Theme-aware styling

**2. Customizable Component** (`<ModelSelector {...props} />`)

- Extensive prop customization
- Sub-component replacement
- CSS class overrides
- Icon/label customization

**3. Headless Hook** (`useModelSelector()`)

- Full state control
- Build custom UI from scratch
- Access to all selector logic

---

## API Design

### Pre-Built Component

```typescript
import { ModelSelector } from '@clarity/react'

interface ModelSelectorProps {
  // Selection Mode
  mode?: 'auto' | 'manual' | 'hybrid'

  // Models
  models?: Model[]
  defaultModel?: string
  selectedModel?: string
  onModelChange?: (model: Model) => void

  // Providers
  showProviders?: boolean
  allowProviderSelection?: boolean
  providers?: Provider[]

  // Auto-Router (when mode includes 'auto')
  autoRouterConfig?: {
    enabled: boolean
    routingStrategy?: 'performance' | 'cost' | 'balanced'
    fallbackModel?: string
  }

  // UI Customization
  variant?: 'dropdown' | 'cards' | 'list' | 'compact'
  showCapabilities?: boolean
  showPricing?: boolean
  showContextLength?: boolean
  groupBy?: 'provider' | 'capability' | 'none'

  // Filtering
  filters?: {
    multimodal?: boolean
    supportsTools?: boolean
    minContextLength?: number
    maxCost?: number
    providers?: string[]
  }

  // Labels & Icons
  labels?: {
    title?: string
    placeholder?: string
    autoMode?: string
    manualMode?: string
    noModels?: string
  }

  icons?: {
    model?: ReactNode
    provider?: ReactNode
    auto?: ReactNode
    expand?: ReactNode
  }

  // Sub-Component Replacement
  components?: {
    ModelCard?: ComponentType<ModelCardProps>
    ProviderBadge?: ComponentType<ProviderBadgeProps>
    CapabilityTag?: ComponentType<CapabilityTagProps>
    AutoRouterIndicator?: ComponentType<AutoRouterIndicatorProps>
  }

  // Styling
  className?: string
  style?: CSSProperties

  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
}

// Usage Examples
// Basic - Auto mode (intelligent routing)
<ModelSelector mode="auto" />

// Manual selection
<ModelSelector
  mode="manual"
  models={availableModels}
  defaultModel="gpt-4o"
  onModelChange={(model) => console.log('Selected:', model)}
/>

// Hybrid - Auto with manual override
<ModelSelector
  mode="hybrid"
  showProviders={true}
  groupBy="capability"
/>

// Advanced customization
<ModelSelector
  variant="cards"
  showCapabilities={true}
  showPricing={true}
  filters={{
    supportsTools: true,
    minContextLength: 100000
  }}
  components={{
    ModelCard: CustomModelCard
  }}
/>
```

### Headless Hook

```typescript
import { useModelSelector } from '@clarity/react/hooks'

interface UseModelSelectorOptions {
  models?: Model[]
  defaultModel?: string
  mode?: 'auto' | 'manual' | 'hybrid'
  autoRouterConfig?: AutoRouterConfig
  onModelChange?: (model: Model) => void
}

interface UseModelSelectorReturn {
  // State
  models: Model[]
  selectedModel: Model | null
  isAutoMode: boolean
  isLoading: boolean
  error: Error | null

  // Actions
  selectModel: (modelId: string) => void
  selectProvider: (modelId: string, providerId: string) => void
  toggleAutoMode: () => void
  filterModels: (filters: ModelFilters) => Model[]

  // Auto-Router
  routeModel: (query: string, context?: any) => Promise<Model>
  suggestedModel: Model | null

  // Capabilities
  getModelCapabilities: (modelId: string) => Capabilities
  isCapabilitySupported: (modelId: string, capability: string) => boolean

  // Providers
  getModelProviders: (modelId: string) => Provider[]
  getProviderPricing: (modelId: string, providerId: string) => Pricing
}

// Usage Example
function CustomModelSelector() {
  const {
    models,
    selectedModel,
    selectModel,
    isAutoMode,
    toggleAutoMode,
    suggestedModel
  } = useModelSelector({
    mode: 'hybrid',
    defaultModel: 'gpt-4o'
  })

  return (
    <div className="custom-selector">
      <button onClick={toggleAutoMode}>
        {isAutoMode ? 'Manual Mode' : 'Auto Mode'}
      </button>

      {isAutoMode && suggestedModel && (
        <div className="auto-suggestion">
          Suggested: {suggestedModel.name}
        </div>
      )}

      <select
        value={selectedModel?.id}
        onChange={(e) => selectModel(e.target.value)}
        disabled={isAutoMode}
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### Type Definitions

```typescript
import { z } from 'zod'

// Zod Schemas for Runtime Validation
export const CapabilitiesSchema = z.object({
  multimodal: z.boolean(),
  supportsTools: z.boolean(),
  supportsStructuredOutput: z.boolean(),
  contextLength: z.number(),
  streaming: z.boolean(),
})

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  available: z.boolean(),
  pricing: z
    .object({
      inputTokens: z.number(), // cost per 1M tokens
      outputTokens: z.number(),
      currency: z.string().default('USD'),
    })
    .optional(),
})

export const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  capabilities: CapabilitiesSchema,
  providers: z.array(ProviderSchema),
  metadata: z
    .object({
      category: z.enum(['general', 'code', 'reasoning', 'vision', 'compact']).optional(),
      tags: z.array(z.string()).optional(),
      deprecated: z.boolean().optional(),
    })
    .optional(),
})

// TypeScript Types (inferred from Zod)
export type Capabilities = z.infer<typeof CapabilitiesSchema>
export type Provider = z.infer<typeof ProviderSchema>
export type Model = z.infer<typeof ModelSchema>

// Additional Types
export interface ModelFilters {
  multimodal?: boolean
  supportsTools?: boolean
  minContextLength?: number
  maxCost?: number
  providers?: string[]
  categories?: string[]
  excludeDeprecated?: boolean
}

export interface AutoRouterConfig {
  enabled: boolean
  routingStrategy?: 'performance' | 'cost' | 'balanced'
  fallbackModel?: string
  endpoint?: string
  model?: string // router model (e.g., "katanemo/Arch-Router-1.5B")
}

export interface Pricing {
  inputTokens: number
  outputTokens: number
  currency: string
  estimatedCostPerRequest?: number
}
```

---

## Features & Behavior

### Selection Modes

**Auto Mode** (Default)

- Intelligent routing based on query analysis
- Zero user configuration required
- Transparent routing decisions
- "Why this model?" explanation

**Manual Mode**

- Full user control
- Browse all available models
- Filter by capabilities
- Compare providers

**Hybrid Mode** (Recommended)

- Auto by default
- Manual override available
- "Switch to manual" button visible
- Preserves manual selection when set

### Capability-Driven UI

The interface dynamically adapts based on selected model capabilities:

```typescript
// Example: Image upload only shown for multimodal models
if (selectedModel.capabilities.multimodal) {
  <ImageUploadButton />
}

// Example: Tool panel for tool-capable models
if (selectedModel.capabilities.supportsTools) {
  <ToolsPanel />
}

// Example: Context warning for long documents
if (messageTokens > selectedModel.capabilities.contextLength) {
  <ContextLengthWarning />
}
```

### Provider Selection

**Single Provider Mode**:

- Only one provider per model
- Simplified UI
- Best for simple integrations

**Multi-Provider Mode**:

- Multiple providers per model
- Provider comparison (pricing, availability)
- Automatic fallback on provider failure
- Cost optimization options

**Provider Display**:

```typescript
interface ProviderBadgeProps {
  provider: Provider
  selected: boolean
  showPricing?: boolean
  onSelect?: () => void
}

// Example UI
<ModelCard model={model}>
  <ModelName>{model.name}</ModelName>
  <Capabilities>
    {model.capabilities.multimodal && <Badge>Multimodal</Badge>}
    {model.capabilities.supportsTools && <Badge>Tools</Badge>}
    <Badge>Context: {formatTokens(model.capabilities.contextLength)}</Badge>
  </Capabilities>

  <Providers>
    {model.providers.map(provider => (
      <ProviderBadge
        key={provider.id}
        provider={provider}
        selected={selectedProvider === provider.id}
        showPricing={true}
        onSelect={() => selectProvider(model.id, provider.id)}
      />
    ))}
  </Providers>
</ModelCard>
```

### Filtering & Grouping

**Built-in Filters**:

- Multimodal only
- Tool support
- Minimum context length
- Maximum cost
- Provider availability
- Category (general, code, reasoning, vision)

**Grouping Options**:

- By provider
- By capability (multimodal, tools, context size)
- By category
- No grouping (flat list)

**Search**:

- Model name search
- Description search
- Tag search
- Fuzzy matching

### Auto-Router Implementation

**Client-Side Heuristics** (Basic)

```typescript
function routeModelBasic(query: string, context: any): Model {
  // Image detection
  if (context.hasImages) {
    return models.find((m) => m.capabilities.multimodal)
  }

  // Tool usage detection
  if ((context.toolsAvailable && query.includes('create')) || query.includes('update')) {
    return models.find((m) => m.capabilities.supportsTools)
  }

  // Code detection
  if (query.includes('code') || query.includes('function')) {
    return models.find((m) => m.metadata?.category === 'code')
  }

  // Reasoning detection (long, complex queries)
  if (query.split(' ').length > 50) {
    return models.find((m) => m.metadata?.category === 'reasoning')
  }

  // Default: balanced general model
  return models.find((m) => m.metadata?.category === 'general')
}
```

**Server-Side Router** (Advanced)

```typescript
interface AutoRouterResponse {
  modelId: string
  confidence: number
  reasoning: string
}

async function routeModelAdvanced(
  query: string,
  context: any,
  config: AutoRouterConfig
): Promise<AutoRouterResponse> {
  const response = await fetch(config.endpoint || '/api/route-model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      context,
      strategy: config.routingStrategy,
      availableModels: models.map((m) => m.id),
    }),
  })

  return response.json()
}
```

**Routing Strategies**:

1. **Performance** - Fastest/most capable model
2. **Cost** - Cheapest model that meets requirements
3. **Balanced** - Best value (cost vs. performance)

---

## UI Variants

### Dropdown Variant (Default)

**Appearance**: Single-line dropdown selector **Best For**: Space-constrained interfaces, simple
selection **Features**:

- Compact single-line display
- Shows selected model name + provider
- Expandable menu with full model list
- Search within dropdown

```typescript
<ModelSelector variant="dropdown" />
```

**Visual Structure**:

```
┌─────────────────────────────────────┐
│ GPT-4o (OpenAI) ▼                   │
└─────────────────────────────────────┘
  ↓ (on click)
┌─────────────────────────────────────┐
│ Search models...                    │
├─────────────────────────────────────┤
│ ● Auto Mode (Recommended)           │
│ ─────────────────────────────────── │
│   GPT-4o (OpenAI)                   │
│   Claude Opus 4.5 (Anthropic)       │
│   Llama 3.3 (Together)              │
│   ...                               │
└─────────────────────────────────────┘
```

### Cards Variant

**Appearance**: Grid of model cards **Best For**: Discovery, comparison, detailed information
**Features**:

- Rich visual presentation
- Capability badges
- Provider comparison
- Pricing display
- Expandable descriptions

```typescript
<ModelSelector variant="cards" showCapabilities={true} showPricing={true} />
```

**Visual Structure**:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ GPT-4o      │ │ Claude Opus │ │ Llama 3.3   │
│             │ │ 4.5         │ │             │
│ [OpenAI]    │ │ [Anthropic] │ │ [Together]  │
│             │ │             │ │             │
│ ● Tools     │ │ ● Tools     │ │ ✕ Tools     │
│ ✕ Vision    │ │ ● Vision    │ │ ✕ Vision    │
│ 128K ctx    │ │ 200K ctx    │ │ 128K ctx    │
│             │ │             │ │             │
│ $5/1M in    │ │ $15/1M in   │ │ $0.2/1M in  │
│ $15/1M out  │ │ $75/1M out  │ │ $0.2/1M out │
└─────────────┘ └─────────────┘ └─────────────┘
```

### List Variant

**Appearance**: Vertical list with rows **Best For**: Many models, quick scanning **Features**:

- Compact row display
- Sortable columns
- Inline filtering
- Quick selection

```typescript
<ModelSelector variant="list" groupBy="capability" />
```

**Visual Structure**:

```
┌──────────────────────────────────────────────────────┐
│ Name           Provider    Context  Tools  Price     │
├──────────────────────────────────────────────────────┤
│ ● GPT-4o       OpenAI      128K     ●      $$$       │
│   Claude Opus  Anthropic   200K     ●      $$$$$     │
│   Llama 3.3    Together    128K     ✕      $         │
│   ...                                                │
└──────────────────────────────────────────────────────┘
```

### Compact Variant

**Appearance**: Minimal inline selector **Best For**: Space-critical UIs, mobile **Features**:

- Icon + model abbreviation
- Tooltip on hover
- Quick toggle menu
- Auto mode indicator

```typescript
<ModelSelector variant="compact" />
```

**Visual Structure**:

```
[🤖 GPT-4o ▼]
```

---

## Accessibility

### Keyboard Navigation

**Requirements**:

- Full keyboard control (Tab, Enter, Arrows, Escape)
- Focus visible indicators
- Logical tab order
- Screen reader announcements

**Key Bindings**:

```
Tab           - Move to selector
Enter/Space   - Open dropdown/select model
Arrow Up/Down - Navigate models
Escape        - Close dropdown
/             - Focus search (when open)
```

### ARIA Attributes

```typescript
<div
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls="model-listbox"
  aria-activedescendant={selectedModel?.id}
  aria-label="Select AI model"
>
  <input
    role="searchbox"
    aria-label="Search models"
    aria-autocomplete="list"
  />

  <ul
    id="model-listbox"
    role="listbox"
    aria-label="Available models"
  >
    {models.map(model => (
      <li
        key={model.id}
        role="option"
        aria-selected={selectedModel?.id === model.id}
        aria-label={`${model.name}, ${model.providers.length} providers, ${model.capabilities.contextLength} token context`}
      >
        {/* Model card content */}
      </li>
    ))}
  </ul>
</div>
```

### Screen Reader Support

**Announcements**:

- Model selection: "Selected GPT-4o by OpenAI, multimodal, tools supported, 128,000 token context"
- Auto mode enabled: "Auto mode active, model will be selected automatically"
- Provider change: "Provider changed to Together AI, cost $0.20 per 1 million tokens"
- Filter applied: "Showing 12 models with tool support"

### Color Contrast

- WCAG 2.1 AA minimum (4.5:1 for text, 3:1 for UI components)
- High contrast mode support
- No color-only information (use icons + text)

### Focus Management

- Focus trap when dropdown open
- Return focus to trigger on close
- Clear focus indicators
- Skip links for keyboard users

---

## Theming & Styling

### CSS Variables

```css
:root {
  /* Model Selector */
  --model-selector-bg: var(--surface-1);
  --model-selector-border: var(--border-color);
  --model-selector-border-radius: 8px;
  --model-selector-padding: 12px;

  /* Model Cards */
  --model-card-bg: var(--surface-2);
  --model-card-bg-hover: var(--surface-3);
  --model-card-bg-selected: var(--primary-50);
  --model-card-border: var(--border-color);
  --model-card-border-selected: var(--primary-500);

  /* Provider Badges */
  --provider-badge-bg: var(--surface-3);
  --provider-badge-text: var(--text-secondary);
  --provider-badge-selected: var(--primary-500);

  /* Capability Tags */
  --capability-tag-bg: var(--semantic-info-100);
  --capability-tag-text: var(--semantic-info-700);

  /* Auto Mode */
  --auto-indicator-bg: var(--semantic-success-100);
  --auto-indicator-text: var(--semantic-success-700);

  /* Typography */
  --model-name-size: 16px;
  --model-name-weight: 600;
  --model-description-size: 14px;
  --model-meta-size: 12px;
}
```

### Dark Mode

```css
[data-theme='dark'] {
  --model-selector-bg: var(--surface-dark-1);
  --model-card-bg: var(--surface-dark-2);
  --model-card-bg-hover: var(--surface-dark-3);
  /* ... */
}
```

### CSS Classes

```css
/* Base selector */
.clarity-model-selector {
}
.clarity-model-selector--dropdown {
}
.clarity-model-selector--cards {
}
.clarity-model-selector--list {
}
.clarity-model-selector--compact {
}

/* Model card */
.clarity-model-card {
}
.clarity-model-card--selected {
}
.clarity-model-card--disabled {
}

/* Components */
.clarity-model-name {
}
.clarity-model-description {
}
.clarity-model-capabilities {
}
.clarity-provider-badge {
}
.clarity-capability-tag {
}
.clarity-auto-indicator {
}
.clarity-pricing-info {
}

/* States */
.clarity-model-selector[data-open='true'] {
}
.clarity-model-card[data-selected='true'] {
}
.clarity-model-card[aria-disabled='true'] {
}
```

---

## Performance Considerations

### Optimization Strategies

**1. Virtualization** (for large model lists)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function ModelList({ models }: { models: Model[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // estimated row height
  })

  return (
    <div ref={parentRef} className="model-list">
      {virtualizer.getVirtualItems().map(virtualRow => (
        <ModelCard
          key={models[virtualRow.index].id}
          model={models[virtualRow.index]}
          style={{
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
        />
      ))}
    </div>
  )
}
```

**2. Lazy Loading**

- Load model metadata on demand
- Defer provider pricing until expanded
- Pagination for 100+ models

**3. Memoization**

```typescript
const filteredModels = useMemo(() => {
  return models.filter((model) => {
    if (filters.multimodal && !model.capabilities.multimodal) return false
    if (filters.supportsTools && !model.capabilities.supportsTools) return false
    if (filters.minContextLength && model.capabilities.contextLength < filters.minContextLength)
      return false
    return true
  })
}, [models, filters])

const ModelCard = memo(
  ({ model }: { model: Model }) => {
    // ... component implementation
  },
  (prevProps, nextProps) => {
    return prevProps.model.id === nextProps.model.id && prevProps.selected === nextProps.selected
  }
)
```

**4. Debounced Search**

```typescript
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDeferredValue(searchTerm)

const searchResults = useMemo(() => {
  if (!debouncedSearch) return models

  return models.filter(
    (model) =>
      model.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      model.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
}, [models, debouncedSearch])
```

### Bundle Size

**Target**: < 15KB gzipped (component + hook)

**Strategies**:

- Tree-shakeable exports
- Optional features via dynamic imports
- No heavy dependencies (lodash, moment, etc.)
- CSS-in-JS avoided (external CSS preferred)

---

## Examples

### Basic Auto Mode

```typescript
import { ModelSelector } from '@clarity/react'

function App() {
  return (
    <div>
      <h1>AI Chat</h1>
      <ModelSelector mode="auto" />
      <ChatInterface />
    </div>
  )
}
```

### Manual Selection with Filters

```typescript
import { ModelSelector } from '@clarity/react'

function AdvancedChat() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  return (
    <ModelSelector
      mode="manual"
      variant="cards"
      showCapabilities={true}
      showPricing={true}
      filters={{
        supportsTools: true,
        minContextLength: 100000
      }}
      selectedModel={selectedModel?.id}
      onModelChange={setSelectedModel}
    />
  )
}
```

### Hybrid Mode with Provider Selection

```typescript
import { ModelSelector } from '@clarity/react'

function EnterpriseChat() {
  return (
    <ModelSelector
      mode="hybrid"
      showProviders={true}
      allowProviderSelection={true}
      autoRouterConfig={{
        enabled: true,
        routingStrategy: 'balanced',
        fallbackModel: 'gpt-4o'
      }}
      groupBy="capability"
    />
  )
}
```

### Custom UI with Headless Hook

```typescript
import { useModelSelector } from '@clarity/react/hooks'
import { useState } from 'react'

function CustomModelSelector() {
  const {
    models,
    selectedModel,
    selectModel,
    isAutoMode,
    toggleAutoMode,
    suggestedModel,
    filterModels
  } = useModelSelector({
    mode: 'hybrid',
    defaultModel: 'gpt-4o'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="custom-selector">
      <div className="selector-header">
        <h3>Choose Model</h3>
        <button onClick={toggleAutoMode}>
          {isAutoMode ? '🤖 Auto' : '👤 Manual'}
        </button>
      </div>

      {isAutoMode && suggestedModel && (
        <div className="auto-suggestion">
          <p>Suggested: <strong>{suggestedModel.name}</strong></p>
          <p className="reasoning">Best for your query type</p>
        </div>
      )}

      {!isAutoMode && (
        <>
          <input
            type="text"
            placeholder="Search models..."
            onChange={(e) => {
              const filtered = filterModels({
                searchTerm: e.target.value
              })
              // Update displayed models
            }}
          />

          <div className="model-grid">
            {models.map(model => (
              <button
                key={model.id}
                className={`model-button ${selectedModel?.id === model.id ? 'selected' : ''}`}
                onClick={() => selectModel(model.id)}
              >
                <h4>{model.name}</h4>
                <div className="capabilities">
                  {model.capabilities.multimodal && <span>📷 Vision</span>}
                  {model.capabilities.supportsTools && <span>🔧 Tools</span>}
                  <span>💬 {formatTokens(model.capabilities.contextLength)}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        Advanced Options
      </button>

      {showAdvanced && (
        <div className="advanced-filters">
          {/* Custom filter UI */}
        </div>
      )}
    </div>
  )
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`
  return `${tokens}`
}
```

### With Context Integration (CopilotKit-inspired)

```typescript
import { ModelSelector } from '@clarity/react'
import { useClarityContext } from '@clarity/react/hooks'

function ContextAwareSelector() {
  const { currentDocument } = useDocumentContext()

  // Make document context available for auto-routing
  useClarityContext({
    description: "Current document being edited",
    value: currentDocument,
    convert: (doc) => `Document type: ${doc.type}, length: ${doc.content.length} chars`
  })

  return (
    <ModelSelector
      mode="auto"
      autoRouterConfig={{
        enabled: true,
        routingStrategy: 'balanced'
      }}
    />
  )
}
```

---

## Testing Strategy

### Unit Tests

**Component Tests**:

```typescript
describe('ModelSelector', () => {
  it('renders in auto mode by default', () => {
    render(<ModelSelector />)
    expect(screen.getByText(/auto mode/i)).toBeInTheDocument()
  })

  it('allows manual model selection', async () => {
    const onModelChange = vi.fn()
    render(
      <ModelSelector
        mode="manual"
        models={mockModels}
        onModelChange={onModelChange}
      />
    )

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByText('GPT-4o'))

    expect(onModelChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'gpt-4o' })
    )
  })

  it('filters models by capabilities', () => {
    render(
      <ModelSelector
        mode="manual"
        models={mockModels}
        filters={{ supportsTools: true }}
      />
    )

    // Only tool-capable models should be visible
    expect(screen.queryByText('Basic Model')).not.toBeInTheDocument()
    expect(screen.getByText('GPT-4o')).toBeInTheDocument()
  })
})
```

**Hook Tests**:

```typescript
describe('useModelSelector', () => {
  it('provides model selection functionality', () => {
    const { result } = renderHook(() =>
      useModelSelector({
        models: mockModels,
        defaultModel: 'gpt-4o',
      })
    )

    expect(result.current.selectedModel?.id).toBe('gpt-4o')
    expect(result.current.models).toHaveLength(mockModels.length)
  })

  it('toggles auto mode', () => {
    const { result } = renderHook(() =>
      useModelSelector({
        mode: 'hybrid',
      })
    )

    expect(result.current.isAutoMode).toBe(true)

    act(() => {
      result.current.toggleAutoMode()
    })

    expect(result.current.isAutoMode).toBe(false)
  })
})
```

### Integration Tests

**With Chat Component**:

```typescript
describe('ModelSelector + Chat Integration', () => {
  it('updates chat when model changes', async () => {
    render(
      <ClarityProvider>
        <ModelSelector mode="manual" />
        <ChatInterface />
      </ClarityProvider>
    )

    // Change model
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByText('Claude Opus 4.5'))

    // Verify chat uses new model
    const chatContainer = screen.getByTestId('chat-interface')
    expect(chatContainer).toHaveAttribute('data-model', 'claude-opus-4.5')
  })
})
```

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('ModelSelector Accessibility', () => {
  it('has no WCAG violations', async () => {
    const { container } = render(<ModelSelector mode="manual" models={mockModels} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', async () => {
    render(<ModelSelector mode="manual" models={mockModels} />)

    const selector = screen.getByRole('combobox')
    selector.focus()

    // Open with Enter
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('listbox')).toBeVisible()

    // Navigate with arrows
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')

    // Select with Enter
    await userEvent.keyboard('{Enter}')

    expect(screen.getByRole('listbox')).not.toBeVisible()
  })

  it('announces selection to screen readers', async () => {
    render(<ModelSelector mode="manual" models={mockModels} />)

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByText('GPT-4o'))

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-activedescendant',
      expect.stringContaining('gpt-4o')
    )
  })
})
```

### Visual Regression Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('ModelSelector Visual Tests', () => {
  test('matches dropdown variant snapshot', async ({ page }) => {
    await page.goto('/components/model-selector?variant=dropdown')
    await expect(page).toHaveScreenshot('dropdown-closed.png')

    await page.click('[role="combobox"]')
    await expect(page).toHaveScreenshot('dropdown-open.png')
  })

  test('matches cards variant snapshot', async ({ page }) => {
    await page.goto('/components/model-selector?variant=cards')
    await expect(page).toHaveScreenshot('cards-variant.png')
  })

  test('matches dark mode snapshot', async ({ page }) => {
    await page.goto('/components/model-selector')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page).toHaveScreenshot('dark-mode.png')
  })
})
```

---

## Implementation Roadmap

### Phase 1: Core Component (Week 1-2)

**Tasks**:

- [ ] Type definitions (Model, Provider, Capabilities schemas)
- [ ] `useModelSelector` hook implementation
- [ ] Basic `<ModelSelector>` component (dropdown variant)
- [ ] Auto/Manual/Hybrid mode logic
- [ ] Basic unit tests

**Deliverables**:

- Working dropdown selector
- Model selection functionality
- Mode switching
- TypeScript types

### Phase 2: UI Variants (Week 3)

**Tasks**:

- [ ] Cards variant
- [ ] List variant
- [ ] Compact variant
- [ ] Variant-specific styling
- [ ] Responsive design

**Deliverables**:

- All 4 UI variants
- Responsive layouts
- Theme support

### Phase 3: Advanced Features (Week 4)

**Tasks**:

- [ ] Provider selection UI
- [ ] Capability filtering
- [ ] Pricing display
- [ ] Grouping/sorting
- [ ] Search functionality

**Deliverables**:

- Multi-provider support
- Advanced filtering
- Search/grouping

### Phase 4: Auto-Router (Week 5)

**Tasks**:

- [ ] Client-side heuristic routing
- [ ] Server-side router integration
- [ ] Routing strategies (performance, cost, balanced)
- [ ] "Why this model?" explanations
- [ ] Confidence scoring

**Deliverables**:

- Working auto-router
- Multiple routing strategies
- Transparent decision-making

### Phase 5: Accessibility & Polish (Week 6)

**Tasks**:

- [ ] ARIA attributes
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Focus management
- [ ] Accessibility audit

**Deliverables**:

- WCAG 2.1 AA compliance
- Full keyboard support
- Screen reader compatibility

### Phase 6: Documentation & Examples (Week 7)

**Tasks**:

- [ ] Component documentation
- [ ] Hook documentation
- [ ] Example implementations
- [ ] Migration guide
- [ ] Best practices guide

**Deliverables**:

- Complete docs
- 10+ examples
- Migration guides

### Phase 7: Testing & Optimization (Week 8)

**Tasks**:

- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance benchmarks
- [ ] Bundle size optimization
- [ ] Visual regression tests

**Deliverables**:

- 90%+ test coverage
- Performance benchmarks
- Optimized bundle

---

## Open Questions & Decisions

### 1. Auto-Router Implementation

**Question**: Client-side heuristics vs. server-side ML model?

**Options**:

- **A**: Client-side only (lightweight, fast, limited intelligence)
- **B**: Server-side only (powerful, requires backend, latency)
- **C**: Hybrid (client for instant, server for refinement)

**Recommendation**: **C - Hybrid**

- Start with client heuristics for instant feedback
- Optionally call server for complex queries
- Best of both worlds

### 2. Provider Fallback

**Question**: Automatic provider fallback on failure?

**Options**:

- **A**: No fallback (fail fast, user selects alternative)
- **B**: Automatic fallback (resilient, less transparent)
- **C**: User preference (opt-in automatic fallback)

**Recommendation**: **C - User Preference**

- Default: ask user on failure
- Advanced setting: enable automatic fallback
- Log all fallback events

### 3. State Management

**Question**: How to sync model selection across multiple chat instances?

**Options**:

- **A**: Component-local state (each selector independent)
- **B**: Context-based state (shared across tree)
- **C**: External state manager (Redux, Zustand)

**Recommendation**: **B - Context-based**

- Use React Context for app-level model selection
- Allow override at component level
- Best DX without external dependencies

### 4. Pricing Data Source

**Question**: Where does pricing data come from?

**Options**:

- **A**: Static configuration (simple, outdated quickly)
- **B**: API endpoint (fresh, requires backend)
- **C**: Package update (versioned, semi-fresh)

**Recommendation**: **B - API Endpoint**

- Provide default pricing as fallback
- Allow custom pricing endpoint
- Cache for performance

### 5. Model Metadata Format

**Question**: Use existing standard or create custom?

**Options**:

- **A**: OpenAI format (limited metadata)
- **B**: Custom Clarity format (flexible, not standard)
- **C**: Hybrid (map from OpenAI, extend with custom)

**Recommendation**: **C - Hybrid**

- Accept OpenAI format for compatibility
- Extend with Clarity-specific fields
- Provide transformation utilities

---

## Success Metrics

### Developer Experience

- **Time to First Working Selector**: < 5 minutes
- **Documentation Clarity**: 90%+ satisfaction in surveys
- **Setup Complexity**: Single import, zero config for basic usage
- **Customization Depth**: 3 levels (props, sub-components, headless)

### Performance

- **Bundle Size**: < 15KB gzipped
- **Time to Interactive**: < 100ms on average hardware
- **Search Performance**: < 50ms for 100 models
- **Memory Usage**: < 5MB for typical use case

### Accessibility

- **WCAG Compliance**: 2.1 AA minimum
- **Keyboard Navigation**: 100% functionality without mouse
- **Screen Reader Support**: Zero critical issues
- **Focus Management**: Proper trap and return

### User Experience

- **Auto-Router Accuracy**: > 85% user satisfaction with suggestions
- **Selection Speed**: < 3 seconds from trigger to selection
- **Error Recovery**: Clear error messages, suggestions for resolution
- **Cross-Browser Support**: Chrome, Firefox, Safari, Edge (last 2 versions)

---

## Future Enhancements

### V1.1 (Post-Launch)

- [ ] Model comparison mode (side-by-side)
- [ ] Usage history (recently used models)
- [ ] Favorites/bookmarks
- [ ] Custom model categories
- [ ] Advanced search (regex, tags)

### V2.0 (Future)

- [ ] A/B testing integration (compare model performance)
- [ ] Cost tracking/analytics
- [ ] Performance benchmarks per model
- [ ] Team presets (shared configurations)
- [ ] Model recommendations based on conversation history

### V3.0 (Long-term)

- [ ] Multi-model conversations (route per message)
- [ ] Model ensembles (combine outputs)
- [ ] Federated model selection (different models per user)
- [ ] Custom router model training
- [ ] Integration with observability platforms

---

## References

### Competitor Research

- HuggingChat: `/docs/research/competitors/huggingchat.md`
- CopilotKit: `/docs/research/competitors/copilotkit.md`

### Related Specs

- Chat Components Specification (TBD)
- Message Bubble Specification (TBD)
- Provider Configuration Specification (TBD)

### Standards

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices - Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

### Libraries

- [Zod](https://zod.dev/) - Schema validation
- [TanStack Virtual](https://tanstack.com/virtual) - List virtualization
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives (reference)

---

**Next Steps**:

1. Review and approve specification
2. Create implementation tickets
3. Assign engineering resources
4. Begin Phase 1 development
5. Set up project tracking
