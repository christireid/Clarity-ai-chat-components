# PromptComposer System Design
**Date:** 2026-01-27
**Status:** Draft - Architecture Specification
**Goal:** Build a world-class prompt input system that rivals blocks.so, ChatGPT, and Claude

---

## Executive Summary

Create a **composable, progressive-disclosure prompt system** that:
- ✅ Matches blocks.so's hybrid simplicity-to-power model
- ✅ Provides ChatGPT-like suggestion chips
- ✅ Implements Claude-style attachment flows
- ✅ Offers Ant Design X command palette integration
- ✅ Uses functional hooks for maximum extensibility
- ✅ Maintains self-contained components with plugin architecture

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PromptComposer                        │
│  (Orchestration Shell - Progressive Disclosure)         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Suggestions  │  │    Input     │  │   Actions    │ │
│  │   (Chips)    │  │  (Textarea)  │  │   (Menu)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          ↓
              Powered by Hook Architecture
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Hook System                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  usePromptComposer()     - Master orchestration         │
│  usePromptState()        - State management             │
│  usePromptContext()      - @context injection           │
│  usePromptCommands()     - /slash commands              │
│  usePromptSuggestions()  - Smart chips                  │
│  usePromptAttachments()  - File handling                │
│  usePromptSettings()     - Preferences                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Part 1: Hook Architecture (The Engine)

### 1.1 Core Hook: `usePromptComposer()`

**Purpose:** Master orchestration hook that manages all prompt state and coordinates sub-hooks.

```typescript
interface PromptComposerConfig {
  api: string

  // Feature flags (progressive disclosure)
  features?: {
    suggestions?: boolean | SuggestionsConfig
    commands?: boolean | CommandsConfig
    context?: boolean | ContextConfig
    attachments?: boolean | AttachmentsConfig
    voice?: boolean | VoiceConfig
    settings?: boolean | SettingsConfig
  }

  // Behavior
  behavior?: {
    autoSubmit?: boolean
    expandOnFocus?: boolean
    showShortcuts?: boolean
    enableMarkdown?: boolean
  }

  // Integrations
  onSubmit?: (message: PromptMessage) => void | Promise<void>
  onStateChange?: (state: PromptComposerState) => void
}

interface PromptComposerState {
  // Input state
  value: string
  cursorPosition: number
  isExpanded: boolean
  isFocused: boolean

  // Feature states (progressive disclosure)
  showSuggestions: boolean
  showCommands: boolean
  showContext: boolean
  showSettings: boolean

  // Content state
  attachments: Attachment[]
  mentions: Mention[]
  activeCommand: Command | null
  selectedSuggestion: Suggestion | null

  // UI state
  isSubmitting: boolean
  error: Error | null
}

interface PromptComposerActions {
  // Input actions
  setValue: (value: string) => void
  clear: () => void
  focus: () => void
  blur: () => void

  // Feature toggles
  toggleSuggestions: () => void
  toggleCommands: () => void
  toggleSettings: () => void

  // Content actions
  addAttachment: (file: File) => Promise<Attachment>
  removeAttachment: (id: string) => void
  insertMention: (user: MentionableUser) => void
  executeCommand: (command: Command) => void
  applySuggestion: (suggestion: Suggestion) => void

  // Submit
  submit: () => Promise<void>
}

// Usage
function usePromptComposer(config: PromptComposerConfig) {
  return {
    state: PromptComposerState,
    actions: PromptComposerActions,
    ref: React.RefObject<HTMLTextAreaElement>
  }
}
```

**Example:**
```typescript
const composer = usePromptComposer({
  api: '/api/chat',
  features: {
    suggestions: true,
    commands: true,
    attachments: { maxFiles: 5 }
  }
})

// Access state
composer.state.value
composer.state.attachments
composer.state.showCommands

// Execute actions
composer.actions.setValue('Hello...')
composer.actions.addAttachment(file)
composer.actions.submit()
```

---

### 1.2 Context Hook: `usePromptContext()`

**Purpose:** Manage @ mentions for files, docs, users, web context.

```typescript
interface ContextItem {
  id: string
  type: 'file' | 'doc' | 'user' | 'web' | 'memory'
  label: string
  description?: string
  icon?: React.ReactNode
  metadata?: Record<string, unknown>
}

interface ContextConfig {
  triggers: string[] // ['@', '#']
  providers: ContextProvider[]
  fuzzySearch?: boolean
  maxResults?: number
}

interface ContextProvider {
  type: ContextItem['type']
  search: (query: string) => Promise<ContextItem[]>
  icon?: React.ReactNode
  priority?: number
}

function usePromptContext(config: ContextConfig) {
  return {
    // State
    isActive: boolean
    query: string
    results: ContextItem[]
    selectedIndex: number

    // Actions
    search: (query: string) => void
    select: (item: ContextItem) => void
    cancel: () => void

    // Keyboard navigation
    moveUp: () => void
    moveDown: () => void
    confirm: () => void
  }
}
```

**Example:**
```typescript
const context = usePromptContext({
  triggers: ['@'],
  providers: [
    {
      type: 'file',
      search: async (query) => searchFiles(query),
      icon: <FileIcon />
    },
    {
      type: 'doc',
      search: async (query) => searchDocs(query),
      icon: <DocumentIcon />
    }
  ]
})

// Trigger on '@' typed
if (input.endsWith('@')) {
  context.search('')
}
```

---

### 1.3 Commands Hook: `usePromptCommands()`

**Purpose:** Manage /slash commands with categories and dynamic availability.

```typescript
interface Command {
  id: string
  trigger: string // '/search', '/code', etc
  label: string
  description: string
  icon: React.ReactNode
  category?: string
  available?: boolean | (() => boolean)
  execute: (args?: string) => void | Promise<void>
  shortcut?: string
}

interface CommandsConfig {
  commands: Command[]
  categories?: CommandCategory[]
  fuzzySearch?: boolean
}

function usePromptCommands(config: CommandsConfig) {
  return {
    // State
    isActive: boolean
    query: string
    filteredCommands: Command[]
    selectedIndex: number
    activeCommand: Command | null

    // Actions
    search: (query: string) => void
    execute: (command: Command) => void
    cancel: () => void

    // Registration (for plugins)
    registerCommand: (command: Command) => void
    unregisterCommand: (id: string) => void
  }
}
```

**Example:**
```typescript
const commands = usePromptCommands({
  commands: [
    {
      id: 'search',
      trigger: '/search',
      label: 'Search Documentation',
      description: 'Search through docs',
      icon: <SearchIcon />,
      execute: async () => {
        // Search logic
      }
    },
    {
      id: 'code',
      trigger: '/code',
      label: 'Generate Code',
      description: 'Generate code snippets',
      icon: <CodeIcon />,
      category: 'development',
      execute: async (language) => {
        // Code generation
      }
    }
  ]
})
```

---

### 1.4 Suggestions Hook: `usePromptSuggestions()`

**Purpose:** Smart suggestion chips based on context, history, and user patterns.

```typescript
interface Suggestion {
  id: string
  type: 'starter' | 'continuation' | 'template' | 'smart'
  text: string
  description?: string
  icon?: React.ReactNode
  category?: string
  confidence?: number // For smart suggestions
}

interface SuggestionsConfig {
  sources: SuggestionSource[]
  maxSuggestions?: number
  showOnEmpty?: boolean
  enableSmart?: boolean // AI-powered suggestions
}

interface SuggestionSource {
  type: Suggestion['type']
  generate: (context: {
    value: string
    history: Message[]
    attachments: Attachment[]
  }) => Promise<Suggestion[]>
  priority?: number
}

function usePromptSuggestions(config: SuggestionsConfig) {
  return {
    // State
    suggestions: Suggestion[]
    isLoading: boolean

    // Actions
    refresh: () => void
    apply: (suggestion: Suggestion) => void
    dismiss: (id: string) => void
  }
}
```

**Example:**
```typescript
const suggestions = usePromptSuggestions({
  sources: [
    {
      type: 'starter',
      generate: async () => [
        { id: '1', text: 'Explain this code', type: 'starter' },
        { id: '2', text: 'Write tests for...', type: 'starter' }
      ]
    },
    {
      type: 'smart',
      generate: async (context) => {
        // AI-powered based on context
        return generateSmartSuggestions(context)
      }
    }
  ]
})
```

---

### 1.5 Attachments Hook: `usePromptAttachments()`

**Purpose:** File upload, drag-drop, paste handling with previews.

```typescript
interface Attachment {
  id: string
  type: 'image' | 'document' | 'code' | 'url'
  name: string
  size: number
  url: string
  preview?: string
  metadata?: Record<string, unknown>
}

interface AttachmentsConfig {
  maxFiles?: number
  maxSize?: number // bytes
  acceptedTypes?: string[]
  enableDragDrop?: boolean
  enablePaste?: boolean
  uploadHandler?: (file: File) => Promise<Attachment>
}

function usePromptAttachments(config: AttachmentsConfig) {
  return {
    // State
    attachments: Attachment[]
    isUploading: boolean
    uploadProgress: Record<string, number> // file id -> progress %

    // Actions
    add: (file: File) => Promise<Attachment>
    remove: (id: string) => void
    clear: () => void

    // Drag & Drop
    isDragging: boolean
    dragHandlers: {
      onDragEnter: (e: DragEvent) => void
      onDragLeave: (e: DragEvent) => void
      onDragOver: (e: DragEvent) => void
      onDrop: (e: DragEvent) => void
    }

    // Paste
    handlePaste: (e: ClipboardEvent) => void
  }
}
```

---

### 1.6 Settings Hook: `usePromptSettings()`

**Purpose:** User preferences for autocomplete, streaming, history, etc.

```typescript
interface PromptSettings {
  autoComplete: boolean
  streaming: boolean
  showHistory: boolean
  showShortcuts: boolean
  enableMarkdown: boolean
  submitOnEnter: boolean // vs Shift+Enter
  theme: 'light' | 'dark' | 'auto'
}

function usePromptSettings(defaults?: Partial<PromptSettings>) {
  return {
    settings: PromptSettings
    updateSetting: <K extends keyof PromptSettings>(
      key: K,
      value: PromptSettings[K]
    ) => void
    reset: () => void
  }
}
```

---

## Part 2: Component API (The Interface)

### 2.1 Core Component: `<PromptComposer />`

**Purpose:** Main orchestration component with three usage levels.

#### Level 1: Drop-in (Simplest)
```tsx
<PromptComposer api="/api/chat" />
```

#### Level 2: Composed (Customizable)
```tsx
<PromptComposer api="/api/chat">
  <PromptComposer.Suggestions />
  <PromptComposer.Input
    placeholder="Ask anything..."
    maxLength={5000}
  />
  <PromptComposer.Actions>
    <PromptComposer.FileUpload />
    <PromptComposer.VoiceInput />
    <PromptComposer.ModelSelector />
    <PromptComposer.Settings />
  </PromptComposer.Actions>
</PromptComposer>
```

#### Level 3: Headless (Maximum Control)
```tsx
const composer = usePromptComposer({ api: '/api/chat' })

return (
  <div className="custom-prompt">
    <MyCustomSuggestions
      suggestions={composer.state.suggestions}
      onApply={composer.actions.applySuggestion}
    />
    <MyCustomInput
      value={composer.state.value}
      onChange={composer.actions.setValue}
      ref={composer.ref}
    />
    <MyCustomActions>
      {/* Custom UI */}
    </MyCustomActions>
  </div>
)
```

---

### 2.2 Sub-Components

#### `<PromptComposer.Suggestions />`
```tsx
interface SuggestionsProps {
  layout?: 'chips' | 'grid' | 'list'
  maxVisible?: number
  position?: 'top' | 'bottom' | 'floating'
  renderSuggestion?: (suggestion: Suggestion) => React.ReactNode
}

<PromptComposer.Suggestions
  layout="chips"
  maxVisible={4}
  position="top"
/>
```

#### `<PromptComposer.Input />`
```tsx
interface InputProps {
  placeholder?: string
  maxLength?: number
  minRows?: number
  maxRows?: number
  autoFocus?: boolean
  enableMarkdown?: boolean
  renderToolbar?: () => React.ReactNode
}

<PromptComposer.Input
  placeholder="Ask anything..."
  maxLength={10000}
  minRows={1}
  maxRows={10}
  enableMarkdown
/>
```

#### `<PromptComposer.Actions />`
```tsx
interface ActionsProps {
  layout?: 'horizontal' | 'vertical' | 'dropdown'
  position?: 'left' | 'right' | 'both'
  children: React.ReactNode
}

<PromptComposer.Actions layout="horizontal" position="right">
  <PromptComposer.FileUpload />
  <PromptComposer.VoiceInput />
  <PromptComposer.Settings />
</PromptComposer.Actions>
```

#### `<PromptComposer.FileUpload />`
```tsx
interface FileUploadProps {
  maxFiles?: number
  acceptedTypes?: string[]
  renderTrigger?: (props: TriggerProps) => React.ReactNode
  renderPreview?: (attachment: Attachment) => React.ReactNode
}

<PromptComposer.FileUpload
  maxFiles={5}
  acceptedTypes={['image/*', '.pdf', '.doc']}
/>
```

#### `<PromptComposer.ModelSelector />`
```tsx
interface ModelSelectorProps {
  models: Model[]
  defaultModel?: string
  groupBy?: 'provider' | 'speed' | 'capability'
  renderOption?: (model: Model) => React.ReactNode
}

<PromptComposer.ModelSelector
  models={[
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', badge: 'Fast' },
    { id: 'claude-3', name: 'Claude 3.5', provider: 'Anthropic' }
  ]}
  groupBy="provider"
/>
```

#### `<PromptComposer.Settings />`
```tsx
interface SettingsProps {
  renderTrigger?: (props: TriggerProps) => React.ReactNode
  renderContent?: (settings: PromptSettings) => React.ReactNode
}

<PromptComposer.Settings
  renderTrigger={({ onClick }) => (
    <Button onClick={onClick} variant="ghost">
      <SettingsIcon />
    </Button>
  )}
/>
```

---

## Part 3: Progressive Disclosure Logic

### State-Based Feature Activation

```typescript
// Internal orchestration logic
function PromptComposerInternal({ config }: Props) {
  const [state, setState] = useState<PromptComposerState>({
    value: '',
    isExpanded: false,
    showSuggestions: false,
    showCommands: false,
    // ...
  })

  // Progressive disclosure rules
  useEffect(() => {
    const shouldExpand =
      state.value.length > 100 ||
      state.value.includes('\n') ||
      state.attachments.length > 0

    if (shouldExpand !== state.isExpanded) {
      setState(prev => ({ ...prev, isExpanded: shouldExpand }))
    }

    // Show suggestions when empty or on specific triggers
    const shouldShowSuggestions =
      state.value === '' ||
      state.value.endsWith('?')

    if (shouldShowSuggestions !== state.showSuggestions) {
      setState(prev => ({ ...prev, showSuggestions: shouldShowSuggestions }))
    }

    // Activate commands on '/'
    const shouldShowCommands = state.value.match(/\/\w*$/)
    if (!!shouldShowCommands !== state.showCommands) {
      setState(prev => ({ ...prev, showCommands: !!shouldShowCommands }))
    }
  }, [state.value, state.attachments, state.isExpanded])

  return (
    <div className={cn(
      'prompt-composer',
      state.isExpanded && 'expanded'
    )}>
      {state.showSuggestions && <Suggestions />}
      <Input />
      <Actions collapsed={!state.isExpanded} />
    </div>
  )
}
```

---

## Part 4: Plugin System

### Custom Context Providers

```typescript
// User can register custom @ context providers
const customProvider: ContextProvider = {
  type: 'custom',
  search: async (query) => {
    const results = await searchMyAPI(query)
    return results.map(r => ({
      id: r.id,
      type: 'custom',
      label: r.title,
      description: r.snippet
    }))
  },
  icon: <MyIcon />
}

<PromptComposer
  api="/api/chat"
  contextProviders={[customProvider]}
/>
```

### Custom Commands

```typescript
// Register custom slash commands
const customCommand: Command = {
  id: 'my-tool',
  trigger: '/mytool',
  label: 'My Custom Tool',
  description: 'Does something special',
  icon: <CustomIcon />,
  execute: async (args) => {
    await runMyTool(args)
  }
}

const composer = usePromptComposer({ api: '/api/chat' })
composer.actions.registerCommand(customCommand)
```

---

## Part 5: Implementation Phases

### Phase 1: Core Hooks (Week 1)
- [ ] Implement `usePromptComposer()` master hook
- [ ] Implement `usePromptState()` state management
- [ ] Basic input orchestration
- [ ] Unit tests for hooks

### Phase 2: Context & Commands (Week 2)
- [ ] Implement `usePromptContext()` with @mentions
- [ ] Implement `usePromptCommands()` with /commands
- [ ] Keyboard navigation
- [ ] Integration tests

### Phase 3: Attachments & Settings (Week 3)
- [ ] Implement `usePromptAttachments()` with drag-drop
- [ ] Implement `usePromptSettings()` preferences
- [ ] File preview system
- [ ] Settings persistence

### Phase 4: Suggestions (Week 4)
- [ ] Implement `usePromptSuggestions()` with chips
- [ ] Smart suggestion engine
- [ ] Template integration
- [ ] Analytics tracking

### Phase 5: Component Layer (Week 5-6)
- [ ] Build `<PromptComposer />` orchestration
- [ ] Sub-components (Suggestions, Input, Actions)
- [ ] Progressive disclosure logic
- [ ] Visual polish (animations, transitions)

### Phase 6: Polish & Documentation (Week 7)
- [ ] Comprehensive examples
- [ ] API documentation
- [ ] Storybook stories
- [ ] Migration guide from existing components

---

## Part 6: API Comparison with Competitors

### blocks.so Parity

| Feature | blocks.so | Clarity PromptComposer | Status |
|---------|-----------|------------------------|--------|
| Auto-expanding input | ✅ | ✅ `minRows/maxRows` | ✅ |
| Plus icon menu | ✅ | ✅ `<Actions>` dropdown | ✅ |
| Settings dropdown | ✅ | ✅ `<Settings>` | ✅ |
| Model selector | ✅ | ✅ `<ModelSelector>` | ✅ |
| Drag-drop files | ✅ | ✅ `usePromptAttachments` | ✅ |
| Progressive disclosure | ✅ | ✅ State-based | ✅ |

### ChatGPT Parity

| Feature | ChatGPT | Clarity PromptComposer | Status |
|---------|---------|------------------------|--------|
| Suggestion chips | ✅ | ✅ `<Suggestions>` | ✅ |
| Voice input | ✅ | ✅ `<VoiceInput>` | ✅ |
| File attachments | ✅ | ✅ `<FileUpload>` | ✅ |
| Markdown support | ✅ | ✅ `enableMarkdown` | ✅ |

### Claude Parity

| Feature | Claude | Clarity PromptComposer | Status |
|---------|--------|------------------------|--------|
| @ context injection | ✅ | ✅ `usePromptContext` | ✅ |
| Projects/docs | ✅ | ✅ Context providers | ✅ |
| Artifacts preview | ✅ | 🔄 Custom renderers | Extensible |

### Ant Design X Parity

| Feature | Ant Design X | Clarity PromptComposer | Status |
|---------|--------------|------------------------|--------|
| Command palette | ✅ | ✅ `usePromptCommands` | ✅ |
| Bubble UI | ✅ | ✅ Via primitives | ✅ |
| RICH templates | ✅ | ✅ `usePromptSuggestions` | ✅ |

---

## Part 7: DX Excellence

### Type Safety
```typescript
// Full TypeScript support with generics
const composer = usePromptComposer<CustomMetadata>({
  api: '/api/chat',
  onSubmit: (message) => {
    // message.metadata is typed as CustomMetadata
  }
})
```

### Auto-complete
```typescript
// IntelliSense for all hooks and props
composer.actions.| // Shows all available actions with docs
```

### Error Boundaries
```tsx
<PromptComposer.ErrorBoundary
  fallback={(error) => <CustomError error={error} />}
>
  <PromptComposer api="/api/chat" />
</PromptComposer.ErrorBoundary>
```

### Performance
- Virtual scrolling for long suggestion lists
- Debounced search queries
- Lazy-loaded heavy components (model selector, etc)
- Memoized expensive computations

---

## Success Metrics

### User Experience
- ⏱️ Input response time: <16ms (60fps)
- 🎯 Keyboard shortcut coverage: 100%
- ♿ WCAG AAA compliance
- 📱 Mobile responsive (all breakpoints)

### Developer Experience
- 📚 API surface: <10 main exports
- ⚡ Setup time: <5 minutes (drop-in)
- 🔧 Customization: 100% via props/hooks
- 📖 Documentation: 100% coverage

### Technical
- 🧪 Test coverage: >90%
- 📦 Bundle size: <50KB gzipped (core)
- 🚀 Tree-shakeable: 100%
- 🔄 React 19 compatible

---

## Part 8: Token Optimization Strategy

**Problem:** Every competitor (ChatGPT, Claude, Cursor) sends full file contents with every message. This wastes tokens and costs money.

**Solution:** Smart context summarization with progressive detail expansion.

### 8.1 Context Item Token Budgets

```typescript
interface ContextTokenBudget {
  summary: number    // Initial lightweight summary
  preview: number    // Medium-detail preview
  full: number       // Full content (only on explicit request)
}

const DEFAULT_BUDGETS: Record<ContextType, ContextTokenBudget> = {
  file: {
    summary: 50,   // "Button.tsx - 250 lines, exports 3 components"
    preview: 200,  // Show exports, types, key functions
    full: 5000     // Full file content
  },
  doc: {
    summary: 30,   // "API Reference: Authentication"
    preview: 150,  // Show headings and key sections
    full: 3000
  },
  user: {
    summary: 20,   // "@john - Senior Engineer"
    preview: 100,  // Recent activity, expertise
    full: 500
  }
}
```

### 8.2 Progressive Context Expansion

```typescript
interface ContextItem {
  id: string
  type: 'file' | 'doc' | 'user' | 'web'

  // Progressive detail levels
  summary: string           // Always sent (50 tokens max)
  preview?: string          // Sent on hover/focus (200 tokens max)
  full?: string            // Only sent when explicitly needed

  // Token tracking
  tokens: {
    summary: number
    preview: number
    full: number
  }

  // Smart expansion
  autoExpand?: boolean     // AI decides if full context needed
}

// Usage in prompt construction
function buildPrompt(message: string, context: ContextItem[]) {
  let prompt = message
  let totalTokens = countTokens(message)
  const MAX_TOKENS = 8000 // Leave room for response

  // Phase 1: Add all summaries (lightweight)
  for (const item of context) {
    prompt += `\n\nContext: ${item.summary}`
    totalTokens += item.tokens.summary
  }

  // Phase 2: Add previews for relevant items (if budget allows)
  const relevantItems = rankByRelevance(context, message)
  for (const item of relevantItems) {
    if (totalTokens + item.tokens.preview < MAX_TOKENS) {
      prompt += `\n\n${item.preview}`
      totalTokens += item.tokens.preview
    }
  }

  // Phase 3: Only expand to full if explicitly requested
  const explicitMentions = findExplicitMentions(message)
  for (const mention of explicitMentions) {
    if (mention.needsFullContext) {
      const item = context.find(c => c.id === mention.id)
      if (item && totalTokens + item.tokens.full < MAX_TOKENS) {
        prompt += `\n\n${item.full}`
        totalTokens += item.tokens.full
      }
    }
  }

  return { prompt, totalTokens }
}
```

### 8.3 Smart Context Ranking

```typescript
interface ContextRelevanceScore {
  item: ContextItem
  score: number  // 0-1
  reason: string
}

function rankByRelevance(
  context: ContextItem[],
  message: string
): ContextItem[] {
  const scores: ContextRelevanceScore[] = context.map(item => {
    let score = 0
    const reasons: string[] = []

    // 1. Direct mention in message (+0.5)
    if (message.includes(item.label)) {
      score += 0.5
      reasons.push('directly mentioned')
    }

    // 2. Related keywords (+0.3)
    const keywords = extractKeywords(message)
    const itemKeywords = extractKeywords(item.summary)
    const overlap = keywords.filter(k => itemKeywords.includes(k))
    if (overlap.length > 0) {
      score += 0.3 * (overlap.length / keywords.length)
      reasons.push(`${overlap.length} keyword matches`)
    }

    // 3. Recently accessed (+0.2)
    if (item.metadata?.lastAccessed) {
      const minutesAgo = (Date.now() - item.metadata.lastAccessed) / 60000
      if (minutesAgo < 5) {
        score += 0.2
        reasons.push('recently accessed')
      }
    }

    // 4. Type priority (files > docs > users)
    const typePriority = { file: 0.15, doc: 0.1, user: 0.05 }
    score += typePriority[item.type] || 0

    return {
      item,
      score: Math.min(score, 1),
      reason: reasons.join(', ')
    }
  })

  return scores
    .sort((a, b) => b.score - a.score)
    .map(s => s.item)
}
```

### 8.4 Visual Token Budget Indicator

Show users token usage in real-time:

```tsx
<PromptComposer.TokenBudget>
  <TokenBudget.Bar
    current={totalTokens}
    max={8000}
    color={(usage) => {
      if (usage < 0.6) return 'green'
      if (usage < 0.8) return 'yellow'
      return 'red'
    }}
  />
  <TokenBudget.Breakdown>
    {context.map(item => (
      <TokenBudget.Item
        key={item.id}
        label={item.label}
        tokens={item.tokens.summary}
        level="summary"
        onExpand={() => expandToPreview(item)}
      />
    ))}
  </TokenBudget.Breakdown>
</PromptComposer.TokenBudget>
```

### 8.5 Token Savings Examples

| Scenario | Traditional Approach | Clarity Approach | Savings |
|----------|---------------------|------------------|---------|
| 3 large files | 15K tokens (3 × 5K) | 150 tokens (3 × 50 summary) | **99% saved** |
| 5 docs | 10K tokens (5 × 2K) | 150 tokens (5 × 30 summary) | **98.5% saved** |
| Mixed context | 25K tokens | 300 tokens (summaries) + 2K (2 relevant previews) | **91% saved** |

**Cost Impact:**
- ChatGPT: $0.25 per conversation (25K tokens @ $10/1M)
- Clarity: $0.023 per conversation (2.3K tokens)
- **90% cost reduction** 🎯

---

## Part 9: Progressive Disclosure States

### 9.1 State Machine

```typescript
type PromptState =
  | 'collapsed'      // Initial: Single line, minimal chrome
  | 'focused'        // User clicked: Show suggestions
  | 'typing'         // User typing: Hide suggestions, show commands on /
  | 'expanding'      // Content growing: Transition to multiline
  | 'expanded'       // Multiline: Show all features
  | 'with-context'   // Context added: Show token budget
  | 'submitting'     // Sending: Show loading state

// State transition logic
function getNextState(
  current: PromptState,
  trigger: StateTransition
): PromptState {
  switch (current) {
    case 'collapsed':
      if (trigger === 'focus') return 'focused'
      break

    case 'focused':
      if (trigger === 'type') return 'typing'
      if (trigger === 'blur') return 'collapsed'
      break

    case 'typing':
      if (trigger === 'expand') return 'expanding'
      if (trigger === 'context-add') return 'with-context'
      break

    // ... more transitions
  }
}
```

### 9.2 Visual States

#### State 1: Collapsed (Default)
```
┌─────────────────────────────────────────────────┐
│ Ask anything...                            [🔍] │
└─────────────────────────────────────────────────┘
```
- Single line input
- Minimal chrome
- Submit button only

#### State 2: Focused (On Click)
```
┌─────────────────────────────────────────────────┐
│ [Explain code] [Write tests] [Debug issue]      │ ← Suggestions appear
├─────────────────────────────────────────────────┤
│ Ask anything...                            [🔍] │
└─────────────────────────────────────────────────┘
```
- Suggestions slide in from top
- Input gains focus ring
- Subtle scale animation

#### State 3: Typing
```
┌─────────────────────────────────────────────────┐
│ How do I implement auth                    [🔍] │
└─────────────────────────────────────────────────┘
```
- Suggestions fade out
- Focus on typing
- If starts with `/` → show command menu

#### State 4: Command Mode (`/` typed)
```
┌─────────────────────────────────────────────────┐
│ /sea|                                       [🔍] │
├─────────────────────────────────────────────────┤
│ 🔍 /search    Search documentation              │
│ 💻 /code      Generate code                     │
│ 🐛 /debug     Debug issue                       │
└─────────────────────────────────────────────────┘
```
- Command palette slides down
- Filtered by typed text
- Keyboard navigation (↑↓ Enter)

#### State 5: Expanding (Content Growing)
```
┌─────────────────────────────────────────────────┐
│ How do I implement authentication with JWT     │
│ tokens in my Express.js API? I need to|        │
├─────────────────────────────────────────────────┤
│ [📎] [🎤] [⚙️]                             [🔍] │
└─────────────────────────────────────────────────┘
```
- Smooth height transition
- Action buttons slide in from bottom
- Multiline textarea

#### State 6: Expanded (Full Features)
```
┌─────────────────────────────────────────────────┐
│ How do I implement authentication with JWT     │
│ tokens in my Express.js API? I need to handle  │
│ refresh tokens and secure storage.             │
├─────────────────────────────────────────────────┤
│ [📎 Files] [🎤 Voice] [⚙️ Settings]       [🔍] │
└─────────────────────────────────────────────────┘
```
- Full action toolbar
- All features visible
- Markdown toolbar (optional)

#### State 7: With Context (@mention)
```
┌─────────────────────────────────────────────────┐
│ [@src/auth.ts] How do I add refresh tokens?    │
│                                                 │
│ ┌─ Context Items ────────────────────────────┐ │
│ │ 📄 src/auth.ts (50 tokens) [×]             │ │
│ │ 📄 src/types.ts (30 tokens) [×]            │ │
│ │ Token budget: 80/8000 ████░░░░░░░░ 1%     │ │
│ └────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ [📎 Files] [🎤 Voice] [⚙️ Settings]       [🔍] │
└─────────────────────────────────────────────────┘
```
- Context items shown above input
- Token budget indicator
- Each item removable

#### State 8: Context Menu (@typed)
```
┌─────────────────────────────────────────────────┐
│ @auth|                                          │
├─────────────────────────────────────────────────┤
│ 📁 Files                                        │
│   📄 src/auth.ts - Authentication logic         │
│   📄 src/auth.test.ts - Auth tests              │
│ 📚 Docs                                         │
│   📖 Authentication Guide                        │
│   📖 JWT Best Practices                         │
│ 👤 Users                                        │
│   @john - Wrote auth system                     │
└─────────────────────────────────────────────────┘
```
- Grouped by type (files, docs, users)
- Fuzzy search
- Icons for context
- Keyboard nav (Tab to switch groups)

#### State 9: Submitting
```
┌─────────────────────────────────────────────────┐
│ How do I implement authentication?             │
│ ██████████████░░░░░░░░░░░░░░░ Sending...       │
├─────────────────────────────────────────────────┤
│ [Cancel]                                        │
└─────────────────────────────────────────────────┘
```
- Progress bar
- Cancel button
- Input disabled

### 9.3 Animation Timings

```typescript
const ANIMATIONS = {
  suggestions: {
    enter: { duration: 200, ease: 'easeOut' },
    exit: { duration: 150, ease: 'easeIn' }
  },
  expand: {
    height: { duration: 250, ease: 'easeInOut' },
    actions: { duration: 200, delay: 100, ease: 'easeOut' }
  },
  context: {
    add: { duration: 150, ease: 'easeOut' },
    remove: { duration: 100, ease: 'easeIn' }
  },
  commands: {
    open: { duration: 200, ease: 'easeOut' },
    close: { duration: 150, ease: 'easeIn' }
  }
}
```

### 9.4 Responsive Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: {
    width: 360,
    layout: 'stacked',     // Actions stack vertically
    suggestions: 2,         // Max 2 suggestions visible
    contextMenu: 'modal'    // Full-screen modal for @mentions
  },
  tablet: {
    width: 768,
    layout: 'horizontal',
    suggestions: 4,
    contextMenu: 'dropdown'
  },
  desktop: {
    width: 1024,
    layout: 'horizontal',
    suggestions: 6,
    contextMenu: 'dropdown'
  }
}
```

---

## Part 10: Smart Suggestion Engine

### 10.1 Suggestion Sources

```typescript
interface SuggestionSource {
  type: 'starter' | 'continuation' | 'template' | 'smart'
  priority: number
  generate: (context: SuggestionContext) => Promise<Suggestion[]>
}

interface SuggestionContext {
  value: string                // Current input
  history: Message[]           // Conversation history
  attachments: Attachment[]    // Current attachments
  contextItems: ContextItem[]  // @mentions
  userProfile?: UserProfile    // User preferences/patterns
}

// Example sources
const SUGGESTION_SOURCES: SuggestionSource[] = [
  {
    type: 'starter',
    priority: 1,
    generate: async () => [
      { text: 'Explain this code', icon: '📖' },
      { text: 'Write tests for...', icon: '🧪' },
      { text: 'Debug issue', icon: '🐛' },
      { text: 'Refactor to improve...', icon: '🔧' }
    ]
  },
  {
    type: 'continuation',
    priority: 2,
    generate: async ({ history }) => {
      const lastMessage = history[history.length - 1]
      if (lastMessage?.type === 'error') {
        return [
          { text: 'Show more details', icon: '🔍' },
          { text: 'Suggest fixes', icon: '🔧' }
        ]
      }
      return []
    }
  },
  {
    type: 'smart',
    priority: 3,
    generate: async (context) => {
      // AI-powered suggestions based on full context
      return await generateSmartSuggestions(context)
    }
  }
]
```

### 10.2 Context-Aware Generation

```typescript
async function generateSmartSuggestions(
  context: SuggestionContext
): Promise<Suggestion[]> {
  // Analyze current state
  const hasCode = context.contextItems.some(item => item.type === 'file')
  const hasError = context.attachments.some(a => a.type === 'error-log')
  const isEmpty = context.value === ''

  // Generate relevant suggestions
  if (isEmpty && hasCode) {
    return [
      { text: 'Explain what this code does', confidence: 0.9 },
      { text: 'Find potential bugs', confidence: 0.8 },
      { text: 'Suggest improvements', confidence: 0.7 }
    ]
  }

  if (isEmpty && hasError) {
    return [
      { text: 'What caused this error?', confidence: 0.95 },
      { text: 'How do I fix this?', confidence: 0.9 },
      { text: 'Show similar issues', confidence: 0.7 }
    ]
  }

  if (context.value.endsWith('?')) {
    // User asked a question, suggest follow-ups
    return await generateFollowUpQuestions(context)
  }

  return []
}
```

### 10.3 Suggestion Ranking

```typescript
function rankSuggestions(
  suggestions: Suggestion[],
  context: SuggestionContext
): Suggestion[] {
  return suggestions
    .map(suggestion => ({
      ...suggestion,
      score: calculateRelevanceScore(suggestion, context)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6) // Max 6 visible suggestions
}

function calculateRelevanceScore(
  suggestion: Suggestion,
  context: SuggestionContext
): number {
  let score = suggestion.confidence || 0.5

  // Boost if matches user patterns
  if (context.userProfile?.commonPrompts.includes(suggestion.text)) {
    score += 0.2
  }

  // Boost if relevant to current context
  const contextKeywords = extractKeywords(
    context.contextItems.map(c => c.summary).join(' ')
  )
  const suggestionKeywords = extractKeywords(suggestion.text)
  const overlap = contextKeywords.filter(k => suggestionKeywords.includes(k))
  score += (overlap.length / contextKeywords.length) * 0.3

  return Math.min(score, 1)
}
```

---

## Part 11: Context Provider Priority

### 11.1 Priority System

```typescript
interface ContextProviderConfig {
  type: ContextType
  provider: ContextProvider
  priority: number     // 0-100, higher = shown first
  enabled: boolean
  maxResults: number
}

const DEFAULT_PRIORITY: Record<ContextType, number> = {
  file: 80,    // Files most relevant for coding
  doc: 60,     // Docs second
  user: 40,    // Users third
  web: 20,     // Web searches last (expensive)
  memory: 50   // Conversation memory middle
}
```

### 11.2 Adaptive Priority

```typescript
function adjustPriorityByContext(
  providers: ContextProviderConfig[],
  context: { value: string; history: Message[] }
): ContextProviderConfig[] {
  return providers.map(provider => {
    let priority = provider.priority

    // Boost file priority if code-related keywords
    if (provider.type === 'file') {
      const codeKeywords = ['code', 'function', 'class', 'file', 'implement']
      if (codeKeywords.some(k => context.value.toLowerCase().includes(k))) {
        priority += 20
      }
    }

    // Boost doc priority if question-like
    if (provider.type === 'doc') {
      if (context.value.endsWith('?') || context.value.startsWith('how')) {
        priority += 15
      }
    }

    // Boost user priority if collaboration context
    if (provider.type === 'user') {
      const collabKeywords = ['team', 'who', 'ask', 'contact']
      if (collabKeywords.some(k => context.value.toLowerCase().includes(k))) {
        priority += 25
      }
    }

    return { ...provider, priority: Math.min(priority, 100) }
  })
}
```

### 11.3 Parallel Search with Timeout

```typescript
async function searchAllProviders(
  query: string,
  providers: ContextProviderConfig[]
): Promise<ContextItem[]> {
  const sortedProviders = providers
    .sort((a, b) => b.priority - a.priority)

  // Search all providers in parallel with timeout
  const results = await Promise.allSettled(
    sortedProviders.map(provider =>
      withTimeout(
        provider.provider.search(query),
        provider.type === 'web' ? 3000 : 1000 // Web gets more time
      )
    )
  )

  // Combine results, preserving priority order
  const combined: ContextItem[] = []
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      combined.push(
        ...result.value
          .slice(0, sortedProviders[index].maxResults)
          .map(item => ({
            ...item,
            priority: sortedProviders[index].priority
          }))
      )
    }
  })

  // Sort by priority and relevance
  return combined.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority
    return (b.relevance || 0) - (a.relevance || 0)
  })
}
```

---

## Next Steps

1. **Token Optimization POC** - Build token budget tracker component
2. **State Machine Implementation** - Implement progressive disclosure states
3. **Suggestion Engine** - Build smart suggestion generator
4. **Context Provider** - Implement priority-based search
5. **Visual Design** - Create Figma mockups for each state
6. **Implementation** - Start Phase 1 (Core Hooks)

---

## Competitive Advantages Summary

| Feature | ChatGPT | Claude | Cursor | **Clarity** |
|---------|---------|--------|--------|-------------|
| Progressive disclosure | ❌ | ⚠️ | ⚠️ | ✅ Full state machine |
| Token optimization | ❌ | ❌ | ❌ | ✅ 90% savings |
| Smart suggestions | ✅ | ❌ | ❌ | ✅ Context-aware |
| Context ranking | ❌ | ❌ | ⚠️ | ✅ Priority system |
| Hook architecture | ❌ | ❌ | ❌ | ✅ Composable |
| Headless option | ❌ | ❌ | ❌ | ✅ Full control |
| Plugin system | ❌ | ❌ | ⚠️ | ✅ Custom providers |

**Key Differentiators:**
1. 🎯 **90% token savings** - Unique in market
2. 🎨 **9 progressive states** - Most refined UX
3. 🧩 **Hook-first architecture** - Maximum flexibility
4. 🤖 **Smart suggestion engine** - Context-aware chips
5. ⚡ **Priority-based context** - Adaptive relevance

---

**Ready to proceed?** Confirm to start implementation or request adjustments to design.
