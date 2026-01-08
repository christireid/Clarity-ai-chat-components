# Minimal Chat Example

The simplest way to add AI chat to your application - just **ONE LINE of code**!

## Quick Start

```tsx
import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

**That's it!** You now have a fully functional AI chat interface with:

- ✨ Beautiful UI with animations
- ⌨️ Full keyboard navigation
- 📱 Mobile responsive
- ⚡ Optimized performance
- ♿ WCAG AAA accessibility
- 🔒 Error handling with auto-retry
- 📊 Streaming responses

## Add Features with One Line

```tsx
// Add memory - conversations persist automatically
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Add token optimization - reduce AI costs by 60-90%
<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Use a preset for common configurations
<ClarityChatApp api="/api/chat" preset="pro" />

// Enterprise preset - all features enabled
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

## Available Presets

| Preset       | What's Included                                        |
| ------------ | ------------------------------------------------------ |
| `simple`     | Streaming + error recovery + accessible UI             |
| `pro`        | + Token stats, basic safety                            |
| `memory`     | + Memory with sliding-window                           |
| `rag`        | + Document sources, chunking, retrieval                |
| `tools`      | + Tool calling with registry pattern                   |
| `enterprise` | **Everything**: Memory, tokens, safety, RAG, analytics |

## Headless Mode

Need full control over the UI? Use the hook instead:

```tsx
import { useClarityChatApp } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChatApp({ api: '/api/chat', preset: 'pro' })

  return (
    <div>
      {chat.messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={chat.input} onChange={chat.handleInputChange} />
      <button onClick={chat.handleSubmit}>Send</button>
    </div>
  )
}
```

## Run This Example

```bash
cd apps/examples/minimal-chat
pnpm install
pnpm dev
```

## Next Steps

- [Full Documentation](https://clarity-chat.dev/docs)
- [40+ Example Apps](../README.md)
- [Component Reference](https://clarity-chat.dev/reference)
