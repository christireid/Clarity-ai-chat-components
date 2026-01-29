# PromptComposer Quick Start Guide

**Version:** 1.0.0
**Status:** Production Ready
**React Version:** 18+ (React 19 compatible)

---

## Installation

```bash
# Already included in @clarity-chat/react
npm install @clarity-chat/react
```

---

## Basic Usage (5 Minutes)

### 1. Simple Drop-In

```tsx
import { PromptComposer } from '@clarity-chat/react'

function App() {
  const handleSubmit = (message) => {
    console.log('Message:', message.content)
    console.log('Tokens:', message.metadata.totalTokens)
    // Send to your API
  }

  return (
    <PromptComposer
      api="/api/chat"
      onSubmit={handleSubmit}
    />
  )
}
```

**Result:** Working prompt with auto-expanding textarea and submit button.

---

### 2. With Token Budget (+ 2 Minutes)

```tsx
<PromptComposer
  api="/api/chat"
  tokenBudget={8000}
  showTokenBudget
  showTokenSavings
  onSubmit={handleSubmit}
/>
```

**Result:** + Token counter, usage bar, and savings display.

---

### 3. With Context (@mentions) (+ 5 Minutes)

```tsx
import { PromptComposer, fileProvider, docProvider } from '@clarity-chat/react'

<PromptComposer
  api="/api/chat"
  tokenBudget={8000}
  showTokenBudget
  features={{
    context: {
      triggers: ['@'],
      providers: [
        fileProvider,   // @file:Button.tsx
        docProvider,    // @doc:api-reference
      ],
      fuzzySearch: true
    }
  }}
  onSubmit={handleSubmit}
/>
```

**Result:** + Type `@` to mention files and docs.

---

### 4. With Commands (/ slash) (+ 3 Minutes)

```tsx
const commands = [
  {
    id: 'search',
    trigger: '/search',
    label: 'Search Docs',
    description: 'Search documentation',
    icon: '🔍',
    execute: async () => {
      // Your search logic
    }
  },
  {
    id: 'code',
    trigger: '/code',
    label: 'Generate Code',
    description: 'Generate code snippet',
    icon: '💻',
    execute: async () => {
      // Your code generation
    }
  }
]

<PromptComposer
  api="/api/chat"
  commands={commands}
  features={{
    commands: {
      fuzzySearch: true
    }
  }}
  onSubmit={handleSubmit}
/>
```

**Result:** + Type `/` to trigger command palette.

---

### 5. With Suggestions (+ 3 Minutes)

```tsx
const suggestions = [
  {
    id: '1',
    type: 'starter',
    text: 'Explain this code',
    icon: '📖'
  },
  {
    id: '2',
    type: 'starter',
    text: 'Write tests for...',
    icon: '🧪'
  },
  {
    id: '3',
    type: 'starter',
    text: 'Debug issue',
    icon: '🐛'
  }
]

<PromptComposer
  api="/api/chat"
  suggestions={suggestions}
  onSuggestionClick={(suggestion) => {
    console.log('Selected:', suggestion.text)
  }}
  onSubmit={handleSubmit}
/>
```

**Result:** + Suggestion chips when focused and empty.

---

### 6. With File Attachments (+ 2 Minutes)

```tsx
<PromptComposer
  api="/api/chat"
  features={{
    attachments: {
      maxFiles: 5,
      maxSize: 10 * 1024 * 1024, // 10MB
      acceptedTypes: ['image/*', '.pdf', '.txt'],
      uploadHandler: async (file) => {
        // Your upload logic
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        return {
          id: data.id,
          type: 'document',
          name: file.name,
          size: file.size,
          url: data.url
        }
      }
    }
  }}
  onSubmit={handleSubmit}
/>
```

**Result:** + Drag-drop file upload with validation.

---

### 7. With Voice Input (+ 1 Minute)

```tsx
<PromptComposer
  api="/api/chat"
  features={{
    voice: {
      lang: 'en-US'  // or 'es-ES', 'fr-FR', etc.
    }
  }}
  onSubmit={handleSubmit}
/>
```

**Result:** + Voice input button with speech-to-text.

---

## Full-Featured Example (All Features)

```tsx
import {
  PromptComposer,
  fileProvider,
  docProvider,
  userProvider
} from '@clarity-chat/react'

// Commands
const commands = [
  {
    id: 'search',
    trigger: '/search',
    label: 'Search Documentation',
    description: 'Search through all documentation',
    icon: '🔍',
    category: 'navigation',
    execute: async () => { /* ... */ }
  },
  {
    id: 'code',
    trigger: '/code',
    label: 'Generate Code',
    description: 'Generate code snippets',
    icon: '💻',
    category: 'development',
    execute: async () => { /* ... */ }
  }
]

// Suggestions
const suggestions = [
  { id: '1', type: 'starter', text: 'Explain this code', icon: '📖' },
  { id: '2', type: 'starter', text: 'Write tests for...', icon: '🧪' },
  { id: '3', type: 'starter', text: 'Debug issue', icon: '🐛' },
  { id: '4', type: 'starter', text: 'Refactor to improve...', icon: '🔧' }
]

function App() {
  const handleSubmit = async (message) => {
    console.log('Message:', message.content)
    console.log('Context items:', message.contextItems)
    console.log('Attachments:', message.attachments)
    console.log('Tokens used:', message.metadata.totalTokens)

    // Send to API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    })

    return response.json()
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        placeholder="Ask anything... (type @ for context, / for commands)"

        // Features
        showTokenBudget
        showTokenSavings
        showContextBreakdown
        suggestions={suggestions}
        commands={commands}

        // Configuration
        features={{
          context: {
            triggers: ['@'],
            providers: [fileProvider, docProvider, userProvider],
            fuzzySearch: true,
            maxResults: 10
          },
          commands: {
            fuzzySearch: true,
            categories: [
              { id: 'navigation', label: 'Navigation', icon: '🧭' },
              { id: 'development', label: 'Development', icon: '💻' }
            ]
          },
          attachments: {
            maxFiles: 5,
            maxSize: 10 * 1024 * 1024,
            acceptedTypes: ['image/*', 'application/pdf', '.txt'],
            uploadHandler: async (file) => {
              // Upload file and return attachment object
              const formData = new FormData()
              formData.append('file', file)
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              })
              const data = await response.json()
              return {
                id: data.id,
                type: file.type.startsWith('image/') ? 'image' : 'document',
                name: file.name,
                size: file.size,
                url: data.url
              }
            }
          },
          voice: {
            lang: 'en-US'
          }
        }}

        // Callbacks
        onSubmit={handleSubmit}
        onSuggestionClick={(suggestion) => {
          console.log('Suggestion selected:', suggestion.text)
        }}
        onCommandExecute={(command) => {
          console.log('Command executed:', command.id)
        }}
        onStateChange={(state) => {
          console.log('State changed:', state.currentState)
        }}
        onTokenUsageChange={(usage) => {
          if (usage > 0.8) {
            console.warn('Approaching token budget!')
          }
        }}
      />
    </div>
  )
}

export default App
```

---

## Headless Usage (Advanced)

For complete customization, use the `usePromptComposer` hook:

```tsx
import { usePromptComposer } from '@clarity-chat/react'

function CustomPrompt() {
  const { state, actions, ref } = usePromptComposer({
    api: '/api/chat',
    tokenBudget: 8000,
    onSubmit: async (message) => {
      // Handle submit
    }
  })

  return (
    <div className="my-custom-ui">
      {/* Custom suggestions */}
      {state.showSuggestions && (
        <div>
          {/* Your custom suggestion UI */}
        </div>
      )}

      {/* Custom context items */}
      {state.contextItems.map(item => (
        <div key={item.id}>
          <span>{item.label}</span>
          <button onClick={() => actions.removeContext(item.id)}>×</button>
        </div>
      ))}

      {/* Custom input */}
      <textarea
        ref={ref}
        value={state.value}
        onChange={(e) => actions.setValue(e.target.value)}
        onFocus={() => actions.focus()}
        onBlur={() => actions.blur()}
      />

      {/* Custom token budget */}
      <div>
        Tokens: {state.totalTokens} / {state.tokenBudget}
        ({(state.tokenUsage * 100).toFixed(0)}%)
      </div>

      {/* Custom submit */}
      <button
        onClick={() => actions.submit()}
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
```

---

## Custom Context Providers

Create your own context provider:

```tsx
import type { ContextProvider } from '@clarity-chat/react'

// GitHub Issues Provider
const githubIssuesProvider: ContextProvider = {
  type: 'custom',  // or extend ContextType
  icon: '🐙',
  priority: 60,
  enabled: true,
  maxResults: 10,
  search: async (query: string) => {
    // Search GitHub issues
    const response = await fetch(
      `https://api.github.com/search/issues?q=${query}+repo:owner/repo`
    )
    const data = await response.json()

    // Convert to ContextItem format
    return data.items.map(issue => ({
      id: issue.id.toString(),
      type: 'custom',
      label: issue.title,
      description: `#${issue.number} - ${issue.state}`,
      icon: '🐙',
      summary: `Issue #${issue.number}: ${issue.title}`,
      preview: issue.body?.slice(0, 200),
      full: issue.body,
      tokens: {
        summary: 20,
        preview: 100,
        full: issue.body?.length / 4 || 0  // rough estimate
      },
      metadata: {
        number: issue.number,
        url: issue.html_url,
        state: issue.state
      }
    }))
  }
}

// Use in PromptComposer
<PromptComposer
  api="/api/chat"
  features={{
    context: {
      triggers: ['@'],
      providers: [
        fileProvider,
        docProvider,
        githubIssuesProvider  // Your custom provider
      ]
    }
  }}
/>
```

---

## Progressive Disclosure States

PromptComposer automatically transitions through 9 states:

1. **collapsed** - Initial state, single line
2. **focused** - User clicked, shows suggestions
3. **typing** - User actively typing
4. **expanding** - Content approaching threshold (70 chars)
5. **expanded** - Content > 100 chars or multiline
6. **with-context** - Context items added via @mentions
7. **with-suggestions** - Smart suggestions visible
8. **submitting** - Sending message
9. **submitted** - Success, returns to collapsed

**Triggers:**
- Focus → Show suggestions
- Type `/` → Show command palette
- Type `@` → Show context menu
- > 100 chars → Auto-expand
- Add attachment → Expand
- Add context → Show token budget

---

## Keyboard Shortcuts

- **Tab** - Navigate forward
- **Shift+Tab** - Navigate backward
- **Enter** - Submit (without Shift) / New line (with Shift)
- **↑↓** - Navigate command palette or context menu
- **Escape** - Close palette/menu or dismiss suggestions
- **Cmd+K / Ctrl+K** - Focus input (optional, you implement)

---

## Token Optimization Tips

### 1. Start with Summaries

```typescript
// ✅ Good - Progressive expansion
const item: ContextItem = {
  id: 'file-1',
  type: 'file',
  label: 'Button.tsx',
  summary: 'Button.tsx - 250 lines, exports Button, IconButton, ButtonGroup',
  preview: '// Main exports\nexport { Button }\n// Types\ninterface ButtonProps...',
  full: '/* full file contents */',
  tokens: {
    summary: 20,   // Just the summary
    preview: 150,  // Summary + exports
    full: 5000     // Full file
  }
}

// ❌ Bad - Always send full content
const item = {
  summary: fullFileContents,  // Don't do this
  tokens: { summary: 5000, preview: 5000, full: 5000 }
}
```

### 2. Let Users Expand

User can click "Expand to Preview" or "Expand to Full" when needed.

### 3. Smart Relevance Ranking

The system automatically ranks context items by relevance. Items mentioned in the prompt get higher priority.

---

## Styling

PromptComposer uses Tailwind CSS and supports dark mode:

```tsx
// Light mode (default)
<PromptComposer ... />

// Dark mode (automatic if parent has dark class)
<div className="dark">
  <PromptComposer ... />
</div>
```

**Custom styling:**

```tsx
<PromptComposer
  className="my-custom-wrapper"
  // All internal elements use cn() for className merging
/>
```

---

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  PromptComposerConfig,
  PromptComposerState,
  PromptMessage,
  ContextItem,
  Command,
  Suggestion,
  Attachment
} from '@clarity-chat/react'
```

---

## Performance Tips

### 1. Memoize Callbacks

```tsx
const handleSubmit = useCallback(async (message: PromptMessage) => {
  // Handle submit
}, [])

const handleStateChange = useCallback((state: PromptComposerState) => {
  // Handle state change
}, [])
```

### 2. Lazy Load Providers

```tsx
const fileProvider = useMemo(() => ({
  type: 'file',
  search: async (query) => {
    // Expensive search
  }
}), [])
```

### 3. Debounce Search

Context providers automatically debounce search queries (300ms default).

---

## Common Patterns

### Pattern 1: Conditional Features

```tsx
<PromptComposer
  api="/api/chat"
  features={{
    voice: isPremiumUser,  // Enable only for premium
    attachments: isAuthenticated ? { maxFiles: 10 } : false,
    context: {
      providers: getProvidersForUser(user)  // Dynamic providers
    }
  }}
/>
```

### Pattern 2: Dynamic Token Budget

```tsx
const [tokenBudget, setTokenBudget] = useState(8000)

<PromptComposer
  api="/api/chat"
  tokenBudget={tokenBudget}
  onTokenUsageChange={(usage) => {
    if (usage > 0.9) {
      // Warn user or increase budget
      setTokenBudget(prev => prev * 1.5)
    }
  }}
/>
```

### Pattern 3: Multi-Step Workflows

```tsx
const [step, setStep] = useState(1)

<PromptComposer
  api="/api/chat"
  suggestions={getSuggestionsForStep(step)}
  commands={getCommandsForStep(step)}
  onSubmit={async (message) => {
    await handleSubmit(message)
    setStep(prev => prev + 1)
  }}
/>
```

---

## Troubleshooting

### Issue: Suggestions not showing

**Solution:** Check that:
1. `suggestions` prop is passed
2. Input is focused and empty
3. `state.showSuggestions` is true

### Issue: Command palette not opening

**Solution:** Check that:
1. `commands` prop is passed
2. Input starts with `/`
3. `features.commands` is not false

### Issue: Context menu not opening

**Solution:** Check that:
1. `features.context.providers` is passed
2. Input contains `@`
3. Providers are enabled

### Issue: Token count seems wrong

**Solution:**
- Token counting uses rough estimates (chars / 4)
- For accurate counts, integrate with your tokenizer
- See `useTokenTracker` hook for custom tokenization

---

## Next Steps

1. Check out [examples](./PromptComposer.example.tsx)
2. Read [API documentation](./README.md)
3. View [Storybook stories](./PromptComposer.stories.tsx) (coming soon)
4. Join community discussions

---

## Support

- **Documentation:** [Full API Reference](./README.md)
- **Examples:** [Example implementations](./PromptComposer.example.tsx)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discord:** [Join our community](#)

---

**Quick Start Complete!** You now have a production-ready prompt composer with progressive disclosure and 90% token savings.
