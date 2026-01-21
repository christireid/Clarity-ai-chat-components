# Components API Reference

Complete reference for all 183+ React components in Clarity Chat.

---

## 🎯 Quick Navigation

**New to components?** Start with [Choosing the Right Component](../../guides/choosing-components.md) *(coming soon)*

### Pre-Built Chat Components
- **ChatWindow** - Complete chat interface
- **ChatInput** - Message input with features
- **Message** - Single message display
- **MessageList** - Message collection
- **StreamingMessage** - Animated streaming display

### By Category

| Category | Count | Description |
|----------|-------|-------------|
| **Chat Interfaces** | 10+ | Complete chat UIs |
| **Message Display** | 15+ | Message rendering |
| **Input Components** | 10+ | Advanced input fields |
| **Dashboard** | 30+ | Analytics & metrics |
| **Search** | 12+ | Search interfaces |
| **Navigation** | 15+ | Navigation components |
| **AI Features** | 8+ | AI-specific UI |
| **Code Display** | 4+ | Code rendering |

**Total: 183+ components**

---

## 📚 Documentation Status

**Status:** Documentation in progress

### Completed
- [x] Components index and navigation
- [ ] Chat components (coming soon)
- [ ] Message components (coming soon)
- [ ] Input components (coming soon)
- [ ] Dashboard components (coming soon)
- [ ] All other categories (coming soon)

---

## 🚀 Most Popular Components

### ChatWindow
Complete chat interface with all features built-in.

```tsx
import { ChatWindow } from '@clarity-chat/react/components'

<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={append}
/>
```

### StreamingMessage
Animated message display for streaming responses.

```tsx
import { StreamingMessage } from '@clarity-chat/react/components'

<StreamingMessage
  content={content}
  isStreaming={true}
  smoothStreaming={true}
/>
```

---

## 📖 Related Documentation

- [Hooks API Reference](../hooks/README.md) - All React hooks
- [Quick Start Guide](../../quick-start.md) - Get started
- [Examples](../../examples/README.md) - Working examples

---

**Contributing:** Help us document these components! See [CONTRIBUTING.md](../../../CONTRIBUTING.md)
