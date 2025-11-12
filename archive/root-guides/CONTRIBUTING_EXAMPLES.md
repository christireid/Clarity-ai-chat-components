# Contributing to Examples

Guide for enhancing Clarity Chat Component examples to production-ready quality.

## 🎯 Goal

Make every example a **production-ready showcase** that demonstrates best practices and proper usage of Clarity Chat Components.

## ✅ Enhancement Checklist

Use this checklist when enhancing any example:

### Essential Features (Must Have)
- [ ] Uses appropriate chat hook (`useChat`, `useChatEnhanced`, or `useChatOptimized`)
- [ ] Implements proper Message types from `@clarity-chat/types`
- [ ] Has `ErrorBoundary` wrapper for crash protection
- [ ] Includes loading states
- [ ] Has proper error handling
- [ ] Compiles without TypeScript errors
- [ ] No `@ts-nocheck` or `@ts-ignore` directives

### User Experience (Should Have)
- [ ] Auto-scroll with `useAutoScroll` hook
- [ ] Token tracking with `useTokenTracker`
- [ ] Network status indicator
- [ ] Responsive design (mobile-friendly)
- [ ] Keyboard shortcuts for common actions
- [ ] Accessible (ARIA labels, focus management)
- [ ] Toast notifications for feedback

### Performance (Nice to Have)
- [ ] Virtual scrolling for long conversations (`VirtualizedMessageList`)
- [ ] Smart caching with `useSmartCache`
- [ ] Debounced input with `useDebounce`
- [ ] Optimistic updates where appropriate
- [ ] Performance monitoring

### Documentation (Required)
- [ ] Comprehensive README.md (200+ lines recommended)
- [ ] Inline code comments for clarity
- [ ] Usage examples in README
- [ ] Environment variables documented
- [ ] Dependencies listed
- [ ] Known limitations noted
- [ ] Troubleshooting section

## 🛠️ Using the Enhancement Scripts

### 1. Check an Example

```bash
./scripts/enhance-example.sh example-name
```

This script checks for:
- Type errors
- Common issues (@ts-nocheck, old patterns)
- README existence and quality
- Package configuration

### 2. Generate README Template

```bash
./scripts/generate-readme.sh example-name
```

Creates a comprehensive README template with sections for:
- Features
- Quick start
- Usage patterns
- Customization
- Architecture
- Enhancement status

### 3. Check All Examples

```bash
./scripts/check-all-examples.sh
```

Provides overview of all examples:
- Which have READMEs
- Which have type issues
- Overall statistics

## 📋 Common Fixes

### Fix 1: Update Message Types

**Problem:** Using old Message structure with `timestamp`

**Solution:**
```typescript
// ❌ Old way
const message = {
  id: '1',
  role: 'assistant',
  content: 'Hello',
  timestamp: Date.now(),
}

// ✅ New way
import type { Message } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  chatId: 'conversation-id',
  role: 'assistant',
  content: 'Hello',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'sent',
}
```

### Fix 2: ChatInput onChange Signature

**Problem:** Expecting event object

**Solution:**
```typescript
// ❌ Old way
<ChatInput 
  onChange={(e) => setInput(e.target.value)}
/>

// ✅ New way
<ChatInput 
  onChange={(value: string) => setInput(value)}
/>
```

### Fix 3: Toast Notifications

**Problem:** Using non-existent `show()` method

**Solution:**
```typescript
// ❌ Old way
const { show } = useToast()
show({ type: 'success', message: 'Done' })

// ✅ New way
const toast = useToast()
toast.success('Done', 'Success')
toast.error('Failed', 'Error')
```

### Fix 4: Checkbox Events

**Problem:** Using `onCheckedChange`

**Solution:**
```typescript
// ❌ Old way
<Checkbox 
  onCheckedChange={(checked) => setChecked(checked)}
/>

// ✅ New way
<Checkbox 
  onChange={(e) => setChecked(e.target.checked)}
/>
```

### Fix 5: Remove @ts-nocheck

**Problem:** Using `@ts-nocheck` to hide errors

**Solution:**
1. Remove the `@ts-nocheck` directive
2. Run `npx tsc --noEmit` to see actual errors
3. Fix each error properly
4. Ensure clean compile

## 🎨 Code Patterns

### Pattern 1: Basic Chat Setup

```typescript
import { useState, useCallback } from 'react'
import { 
  ChatWindow,
  useAutoScroll,
  useTokenTracker,
  ErrorBoundary,
  NetworkStatus,
  TokenCounter,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Auto-scroll
  const { scrollRef } = useAutoScroll({ dependencies: [messages] })
  
  // Token tracking
  const { tokens, addMessage } = useTokenTracker({
    modelName: 'gpt-3.5-turbo'
  })
  
  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'chat-id',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMessage])
    addMessage({ role: 'user', content })
    
    // API call...
    
    // Add AI response
    const aiMessage: Message = { /* ... */ }
    setMessages(prev => [...prev, aiMessage])
    addMessage({ role: 'assistant', content: aiMessage.content })
  }, [addMessage])
  
  return (
    <div ref={scrollRef} className="h-screen overflow-auto">
      <header>
        <h1>My Chat App</h1>
        <TokenCounter currentTokens={tokens} maxTokens={16000} />
        <NetworkStatus />
      </header>
      
      <ChatWindow 
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary fallback={(error) => <ErrorDisplay error={error} />}>
      <ChatApp />
    </ErrorBoundary>
  )
}
```

### Pattern 2: With State Management

```typescript
import { useChat } from '@/hooks/useChat'
import { useAppStore } from '@/lib/store'

function ChatApp() {
  const { messages, sendMessage, isLoading } = useChat()
  const { settings } = useAppStore()
  
  // Implementation...
}
```

### Pattern 3: With Streaming

```typescript
const handleSendMessage = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  let accumulated = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    accumulated += decoder.decode(value)
    setMessages(prev => prev.map(msg =>
      msg.id === streamingMsgId
        ? { ...msg, content: accumulated }
        : msg
    ))
  }
}
```

## 📝 README Template Structure

Every README should include:

### 1. Title & Brief Description
```markdown
# Example Name

Brief one-line description of what this demonstrates.
```

### 2. Features List
```markdown
## Features

✅ Feature 1 - Description
✅ Feature 2 - Description
✅ Feature 3 - Description
```

### 3. Quick Start
```markdown
## Quick Start

\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`
```

### 4. What's Demonstrated
```markdown
## What's Demonstrated

### Category 1
Explanation...

### Category 2
Explanation...
```

### 5. Usage Patterns
```markdown
## Usage Patterns

\`\`\`typescript
// Code examples
\`\`\`
```

### 6. Customization
```markdown
## Customization

### Option 1
How to customize...
```

### 7. Troubleshooting
```markdown
## Troubleshooting

### Issue 1
Solution...
```

### 8. Next Steps
```markdown
## Next Steps

- Link to related examples
- Link to documentation
```

## 🚀 Enhancement Process

### Step 1: Assess Current State
```bash
cd examples/example-name
npx tsc --noEmit
npm run dev
```

Check for:
- Type errors
- Runtime errors
- Missing features
- Poor UX

### Step 2: Plan Enhancements
Create checklist of what to add:
- [ ] Fix type errors
- [ ] Add auto-scroll
- [ ] Add error boundary
- [ ] etc.

### Step 3: Implement Changes
Follow patterns from enhanced examples:
- basic-chat
- component-demo
- design-system-showcase
- ai-assistant
- streaming-chat

### Step 4: Document
```bash
./scripts/generate-readme.sh example-name
# Then fill in all sections
```

### Step 5: Test
```bash
cd examples/example-name
npx tsc --noEmit  # Should have 0 errors
npm run dev       # Should work perfectly
npm run build     # Should build successfully
```

### Step 6: Commit
```bash
git add examples/example-name
git commit -m "feat: Enhance example-name to production-ready quality

✅ Fixed type errors
✅ Added auto-scroll
✅ Added error boundary
✅ Added comprehensive README
✅ Zero TypeScript errors"
```

## 💡 Tips & Best Practices

### Do This ✅
- Verify hook/component APIs before using
- Use proper Message types everywhere
- Add comprehensive error handling
- Create detailed READMEs
- Test on mobile
- Fix all type errors
- Remove all @ts-nocheck directives

### Avoid This ❌
- Assuming API signatures
- Using old patterns (timestamp)
- Leaving type errors
- Minimal documentation
- Skipping error handling
- Incomplete Message types

## 📊 Quality Standards

An example is "production-ready" when it has:

1. **Zero type errors** - Compiles cleanly
2. **Comprehensive README** - 200+ lines with examples
3. **Error handling** - ErrorBoundary + proper error states
4. **Auto-scroll** - Messages scroll automatically
5. **Token tracking** - Shows token usage
6. **Network status** - Connection indicator
7. **Responsive** - Works on mobile
8. **Accessible** - ARIA labels, keyboard nav
9. **Best practices** - Follows established patterns
10. **Documentation** - Inline comments where needed

## 🎓 Learning from Enhanced Examples

Study these 5 production-ready examples:

1. **basic-chat** - Simple patterns, perfect starting point
2. **component-demo** - Component showcase patterns
3. **design-system-showcase** - Design system patterns
4. **ai-assistant** - State management (Zustand + TanStack Query)
5. **streaming-chat** - Streaming patterns with SSE

Each has:
- Zero type errors
- Comprehensive README (200-450 lines)
- All essential features
- Copy-paste ready code

## 🤝 Getting Help

- Check enhanced examples for patterns
- Review this guide for common fixes
- Look at type definitions in `@clarity-chat/types`
- Check component APIs in `@clarity-chat/react`
- Ask in discussions if stuck

## 📈 Progress Tracking

Track your enhancements:

```markdown
## Enhancement Status

✅ Type errors fixed
✅ Auto-scroll added
✅ Error boundary added
✅ Token tracking added
✅ README created
⏳ Mobile optimization needed
⏳ Accessibility improvements needed
```

## 🎉 When You're Done

After enhancing an example:

1. ✅ Verify zero type errors
2. ✅ Test thoroughly (dev + build)
3. ✅ Complete README
4. ✅ Commit with descriptive message
5. ✅ Update progress in this doc
6. 🎊 Celebrate!

---

**Questions?** Open a discussion or issue.

**Found a better pattern?** Share it! Update this guide.

**Enhanced an example?** Amazing! Consider doing another.

Together we can make all 31 examples production-ready showcases! 🚀
