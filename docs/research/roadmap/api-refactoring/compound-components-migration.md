# Compound Components Migration Plan

**Date**: 2026-01-27 **Status**: Planning Phase **Version**: 1.0 **Estimated Timeline**: 1 week
implementation + 1 week testing/documentation

---

## Table of Contents

1. [Overview](#overview)
2. [Current API Analysis](#current-api-analysis)
3. [Proposed Compound Component API](#proposed-compound-component-api)
4. [Components to Refactor](#components-to-refactor)
5. [Implementation Steps](#implementation-steps)
6. [Migration Strategy](#migration-strategy)
7. [Breaking Changes & Compatibility](#breaking-changes--compatibility)
8. [Timeline & Milestones](#timeline--milestones)
9. [Success Metrics](#success-metrics)
10. [Risk Assessment](#risk-assessment)

---

## Overview

### Goal

Adopt the **compound component pattern** to provide better composability, flexibility, and developer
experience while maintaining backward compatibility with existing APIs.

### Inspiration

Based on competitive analysis of:

- **Assistant UI** - Radix-inspired primitive composition with context-based state sharing
- **shadcn/ui AI** - Sub-component architecture with slot-based customization
- **Ant Design X** - Semantic component hierarchy with clear parent-child relationships

### Key Benefits

1. **Better Composability** - Developers compose sub-components rather than passing 50+ props
2. **Progressive Disclosure** - Simple API for basic usage, compound API for advanced customization
3. **Clearer Structure** - Component hierarchy visible in JSX, matches visual structure
4. **Better Tree-shaking** - Only import/use what you need
5. **Type Safety** - Sub-components share parent context with full TypeScript inference
6. **Easier Customization** - Replace/extend individual parts without prop drilling
7. **AI-Friendly** - Predictable patterns make it easier for LLMs to generate correct code

---

## Current API Analysis

### Current ChatInput Component

```tsx
// Current API - Props-based configuration
<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
  placeholder="Type a message..."
  disabled={isLoading}
  maxLength={1000}
  showCharCounter={true}
  warningThreshold={0.8}
  animateHeight={true}
  glowOnFocus={true}
  className="custom-class"
/>
```

**Issues:**

- 11 props even for basic usage
- Boolean flags for sub-features (`showCharCounter`, `animateHeight`)
- No way to customize character counter position/style
- Cannot add custom elements between input and button
- Limited extensibility

### Current ClarityChat Component

```tsx
// Current API - Deeply nested configuration objects
<ClarityChat
  api="/api/chat"
  header={{
    show: true,
    title: "AI Assistant",
    showMessageCount: true,
    actions: <CustomActions />
  }}
  messageActions={{
    onCopy: handleCopy,
    onFeedback: handleFeedback,
    onEdit: handleEdit,
    onRegenerate: handleRegenerate,
    onDelete: handleDelete,
  }}
  prompts={{
    starterPrompts: [...],
    enableSuggestions: true,
    maxSuggestions: 3,
  }}
  rateLimiting={{
    enabled: true,
    maxRequests: 10,
    windowMs: 60000,
  }}
  // ... 20+ more props
/>
```

**Issues:**

- Prop explosion - hard to discover all options
- Nested configuration objects reduce type safety
- Cannot see component structure visually
- Difficult to extend without adding new props
- Not clear what's a container vs. a leaf component

---

## Proposed Compound Component API

### Philosophy

1. **Simple API for simple cases** - Default behavior requires minimal code
2. **Compound API for customization** - Sub-components for granular control
3. **Context-based state sharing** - Parent shares state with children via React Context
4. **Validation** - Children must be used inside parent (runtime checks in dev mode)
5. **Namespace organization** - `Chat.Input`, `Chat.Messages`, `Chat.Header`

### Example: ChatInput Compound Component

```tsx
// Simple API (backward compatible)
<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
/>

// Compound API (advanced customization)
<ChatInput value={value} onChange={setValue} onSubmit={handleSubmit}>
  <ChatInput.TextArea
    placeholder="Type a message..."
    maxLength={1000}
  />

  <ChatInput.Counter
    position="bottom-right"
    warningThreshold={0.8}
  />

  <ChatInput.Actions>
    <ChatInput.AttachButton />
    <ChatInput.VoiceButton />
    <ChatInput.SendButton />
  </ChatInput.Actions>
</ChatInput>
```

**Benefits:**

- Clear visual hierarchy
- Easy to reorder elements
- Can omit counter, add custom buttons
- Type-safe context access
- Self-documenting structure

### Example: Chat Compound Component

```tsx
// Simple API (backward compatible)
<Chat api="/api/chat" />

// Compound API (full control)
<Chat>
  <Chat.Header>
    <Chat.Title>AI Assistant</Chat.Title>
    <Chat.Subtitle>Powered by GPT-4</Chat.Subtitle>
    <Chat.Actions>
      <Button>Clear</Button>
      <Button>Settings</Button>
    </Chat.Actions>
  </Chat.Header>

  <Chat.Messages>
    {(message) => (
      <Chat.Message key={message.id} message={message}>
        <Chat.Message.Avatar />
        <Chat.Message.Content />
        <Chat.Message.Actions>
          <Chat.Message.CopyButton />
          <Chat.Message.EditButton />
          <Chat.Message.FeedbackButtons />
        </Chat.Message.Actions>
      </Chat.Message>
    )}
  </Chat.Messages>

  <Chat.Input>
    <Chat.Input.TextArea />
    <Chat.Input.Actions>
      <Chat.Input.AttachButton />
      <Chat.Input.SendButton />
    </Chat.Input.Actions>
  </Chat.Input>

  <Chat.Footer>
    <Chat.TokenCounter />
    <Chat.PoweredBy />
  </Chat.Footer>
</Chat>
```

**Benefits:**

- Complete layout control
- Easy to inject custom components
- Visual structure matches actual UI
- Can remove/reorder any section
- Type-safe message rendering

---

## Components to Refactor

### Priority 1: Core Chat Components (Week 1)

#### 1. ChatInput → Chat.Input

**Current:**

```tsx
<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
  maxLength={1000}
  showCharCounter={true}
/>
```

**Proposed:**

```tsx
<Chat.Input value={value} onChange={setValue} onSubmit={handleSubmit}>
  <Chat.Input.TextArea maxLength={1000} />
  <Chat.Input.Counter />
  <Chat.Input.Actions>
    <Chat.Input.SendButton />
  </Chat.Input.Actions>
</Chat.Input>
```

**Sub-components:**

- `Chat.Input.TextArea` - Auto-resizing textarea
- `Chat.Input.Counter` - Character counter with progress bar
- `Chat.Input.Actions` - Action button container
- `Chat.Input.SendButton` - Send button with loading states
- `Chat.Input.AttachButton` - File attachment button
- `Chat.Input.VoiceButton` - Voice input button
- `Chat.Input.EmojiButton` - Emoji picker button

#### 2. ChatWindow → Chat

**Current:**

```tsx
<ChatWindow
  messages={messages}
  input={input}
  onInputChange={setInput}
  onSubmit={handleSubmit}
  header={{ title: 'Chat', actions: <Actions /> }}
  footer={{ show: true }}
/>
```

**Proposed:**

```tsx
<Chat>
  <Chat.Header>
    <Chat.Title>Chat</Chat.Title>
    <Chat.Actions>
      <Actions />
    </Chat.Actions>
  </Chat.Header>

  <Chat.Messages messages={messages} />

  <Chat.Input value={input} onChange={setInput} onSubmit={handleSubmit} />

  <Chat.Footer>
    <Chat.TokenCounter />
  </Chat.Footer>
</Chat>
```

**Sub-components:**

- `Chat.Header` - Header container
- `Chat.Title` - Chat title
- `Chat.Subtitle` - Optional subtitle
- `Chat.Actions` - Header action buttons
- `Chat.Messages` - Message list container
- `Chat.Message` - Individual message (see below)
- `Chat.Input` - Input container (compound itself)
- `Chat.Footer` - Footer container
- `Chat.TokenCounter` - Token usage display
- `Chat.PoweredBy` - Branding footer

#### 3. ChatMessage → Chat.Message

**Current:**

```tsx
<ChatMessage
  message={message}
  showAvatar={true}
  showTimestamp={true}
  showActions={true}
  onCopy={handleCopy}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Proposed:**

```tsx
<Chat.Message message={message}>
  <Chat.Message.Avatar />
  <Chat.Message.Content />
  <Chat.Message.Timestamp />
  <Chat.Message.Actions>
    <Chat.Message.CopyButton />
    <Chat.Message.EditButton />
    <Chat.Message.DeleteButton />
    <Chat.Message.FeedbackButtons />
  </Chat.Message.Actions>
</Chat.Message>
```

**Sub-components:**

- `Chat.Message.Avatar` - User/assistant avatar
- `Chat.Message.Content` - Message content with markdown
- `Chat.Message.Timestamp` - Message timestamp
- `Chat.Message.Actions` - Action button container
- `Chat.Message.CopyButton` - Copy to clipboard
- `Chat.Message.EditButton` - Edit message
- `Chat.Message.DeleteButton` - Delete message
- `Chat.Message.RegenerateButton` - Regenerate response
- `Chat.Message.FeedbackButtons` - Thumbs up/down

### Priority 2: Token Components (Week 2)

#### 4. TokenOptimizationPanel → Token.Panel

**Current:**

```tsx
<TokenOptimizationPanel
  current={current}
  budget={budget}
  showRecommendations={true}
  onOptimize={handleOptimize}
/>
```

**Proposed:**

```tsx
<Token.Panel>
  <Token.Panel.Usage current={current} budget={budget} />
  <Token.Panel.Chart />
  <Token.Panel.Recommendations />
  <Token.Panel.Actions>
    <Token.Panel.OptimizeButton onClick={handleOptimize} />
  </Token.Panel.Actions>
</Token.Panel>
```

**Sub-components:**

- `Token.Panel.Usage` - Current usage display
- `Token.Panel.Chart` - Usage chart
- `Token.Panel.Recommendations` - Optimization suggestions
- `Token.Panel.Actions` - Action buttons
- `Token.Panel.OptimizeButton` - Optimize button

### Priority 3: Conversation Components (Week 2)

#### 5. ConversationList → Conversation.List

**Current:**

```tsx
<ConversationList
  conversations={conversations}
  onSelect={handleSelect}
  showTimestamp={true}
  showPreview={true}
/>
```

**Proposed:**

```tsx
<Conversation.List>
  {conversations.map((conv) => (
    <Conversation.ListItem key={conv.id} conversation={conv} onSelect={handleSelect}>
      <Conversation.ListItem.Title />
      <Conversation.ListItem.Preview />
      <Conversation.ListItem.Timestamp />
    </Conversation.ListItem>
  ))}
</Conversation.List>
```

**Sub-components:**

- `Conversation.List` - List container
- `Conversation.ListItem` - Individual conversation item
- `Conversation.ListItem.Title` - Conversation title
- `Conversation.ListItem.Preview` - Message preview
- `Conversation.ListItem.Timestamp` - Last message time
- `Conversation.ListItem.Actions` - Item actions

---

## Implementation Steps

### Step 1: Create Compound Component Infrastructure (Day 1)

**Goal:** Build the foundation for compound components with context and validation.

#### 1.1 Create Context Factory Utility

```tsx
// src/utils/compound-component/create-context.ts

import { createContext, useContext } from 'react'

export function createCompoundContext<T>(componentName: string) {
  const Context = createContext<T | null>(null)

  function useCompoundContext() {
    const context = useContext(Context)
    if (!context) {
      throw new Error(`${componentName} sub-components must be used within ${componentName}`)
    }
    return context
  }

  return [Context.Provider, useCompoundContext] as const
}
```

#### 1.2 Create Compound Component Helper

```tsx
// src/utils/compound-component/create-compound.ts

type CompoundComponent<T, SubComponents> = React.FC<T> & SubComponents

export function createCompound<T, SubComponents>(
  Component: React.FC<T>,
  subComponents: SubComponents
): CompoundComponent<T, SubComponents> {
  return Object.assign(Component, subComponents)
}
```

### Step 2: Refactor ChatInput to Compound (Day 2)

#### 2.1 Create ChatInput Context

```tsx
// src/components/chat/ChatInput/context.tsx

import { createCompoundContext } from '@/utils/compound-component/create-context'

export interface ChatInputContextValue {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  maxLength?: number
  isOverLimit: boolean
  charCount: number
  isFocused: boolean
  setIsFocused: (focused: boolean) => void
}

export const [ChatInputProvider, useChatInputContext] =
  createCompoundContext<ChatInputContextValue>('ChatInput')
```

#### 2.2 Create Sub-components

```tsx
// src/components/chat/ChatInput/TextArea.tsx

export function ChatInputTextArea({
  placeholder = 'Type a message...',
  maxRows = 6,
  className,
  ...props
}: ChatInputTextAreaProps) {
  const { value, onChange, disabled, maxLength, isFocused, setIsFocused } = useChatInputContext()

  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
      maxLength={maxLength}
      placeholder={placeholder}
      maxRows={maxRows}
      className={className}
      {...props}
    />
  )
}

// src/components/chat/ChatInput/Counter.tsx

export function ChatInputCounter({
  position = 'bottom-right',
  warningThreshold = 0.8,
  className,
}: ChatInputCounterProps) {
  const { charCount, maxLength, isOverLimit } = useChatInputContext()

  if (!maxLength || charCount === 0) return null

  const isNearLimit = charCount >= maxLength * warningThreshold

  return (
    <div className={cn('absolute', positionClasses[position], className)}>
      {/* Progress bar */}
      <div className="w-20 h-1.5 bg-muted/60 rounded-full">
        <div
          className={cn(
            'h-full transition-all',
            isOverLimit ? 'bg-destructive' : isNearLimit ? 'bg-warning' : 'bg-primary'
          )}
          style={{ width: `${Math.min((charCount / maxLength) * 100, 100)}%` }}
        />
      </div>
      {/* Counter text */}
      <div className={cn('text-xs tabular-nums', counterColorClass)}>
        {charCount}/{maxLength}
      </div>
    </div>
  )
}

// src/components/chat/ChatInput/SendButton.tsx

export function ChatInputSendButton({
  children = <SendIcon />,
  className,
  ...props
}: ChatInputSendButtonProps) {
  const { onSubmit, disabled, value, isOverLimit } = useChatInputContext()

  const hasContent = value.trim().length > 0

  return (
    <Button
      onClick={onSubmit}
      disabled={disabled || !hasContent || isOverLimit}
      size="icon"
      className={cn('h-11 w-11 rounded-xl', className)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

#### 2.3 Create Root Component

```tsx
// src/components/chat/ChatInput/ChatInput.tsx

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength,
  children,
  className,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  const charCount = value.length
  const isOverLimit = maxLength ? charCount > maxLength : false

  const handleSubmit = async () => {
    if (!value.trim() || isOverLimit || disabled) return
    await onSubmit(value.trim())
  }

  const contextValue: ChatInputContextValue = {
    value,
    onChange,
    onSubmit: handleSubmit,
    disabled,
    maxLength,
    isOverLimit,
    charCount,
    isFocused,
    setIsFocused,
  }

  // Default children if none provided (backward compatibility)
  const content = children || (
    <>
      <ChatInput.TextArea />
      <ChatInput.Actions>
        <ChatInput.SendButton />
      </ChatInput.Actions>
    </>
  )

  return (
    <ChatInputProvider value={contextValue}>
      <div className={cn('relative flex flex-col gap-3 px-5 py-4', className)}>{content}</div>
    </ChatInputProvider>
  )
}

// Attach sub-components
ChatInput.TextArea = ChatInputTextArea
ChatInput.Counter = ChatInputCounter
ChatInput.Actions = ChatInputActions
ChatInput.SendButton = ChatInputSendButton
ChatInput.AttachButton = ChatInputAttachButton
ChatInput.VoiceButton = ChatInputVoiceButton
```

### Step 3: Add Backward Compatibility Layer (Day 2)

```tsx
// src/components/chat/ChatInput/ChatInput.tsx

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  maxLength,
  showCharCounter = true,
  warningThreshold = 0.8,
  children,
  className,
}: ChatInputProps) {
  // ... context setup ...

  // Backward compatibility: if old props provided and no children, render default layout
  const hasOldProps = showCharCounter !== undefined
  const hasChildren = React.Children.count(children) > 0

  const content = hasChildren ? (
    children
  ) : (
    <>
      <ChatInput.TextArea />
      {maxLength && showCharCounter && <ChatInput.Counter warningThreshold={warningThreshold} />}
      <ChatInput.Actions>
        <ChatInput.SendButton />
      </ChatInput.Actions>
    </>
  )

  return (
    <ChatInputProvider value={contextValue}>
      <div className={cn('relative flex flex-col gap-3 px-5 py-4', className)}>{content}</div>
    </ChatInputProvider>
  )
}
```

### Step 4: Refactor Chat to Compound (Day 3-4)

Similar process:

1. Create `ChatContext` with messages, handlers, state
2. Create sub-components: `Chat.Header`, `Chat.Messages`, `Chat.Input`, `Chat.Footer`
3. Create nested compounds: `Chat.Message.*`, `Chat.Input.*`
4. Add backward compatibility for prop-based API

### Step 5: Add TypeScript Support (Day 5)

#### 5.1 Namespace Type Exports

```tsx
// src/components/chat/ChatInput/types.ts

export namespace ChatInput {
  export type Props = ChatInputProps
  export type TextAreaProps = ChatInputTextAreaProps
  export type CounterProps = ChatInputCounterProps
  export type ActionsProps = ChatInputActionsProps
  export type SendButtonProps = ChatInputSendButtonProps
  export type ContextValue = ChatInputContextValue
}
```

#### 5.2 Generic Compound Component Type

```tsx
// src/utils/compound-component/types.ts

export type CompoundComponent<
  RootProps,
  SubComponents extends Record<string, React.ComponentType<any>>,
> = React.FC<RootProps> & SubComponents
```

### Step 6: Add Deprecation Warnings (Day 5)

```tsx
// src/components/chat/ChatInput/ChatInput.tsx

export function ChatInput(props: ChatInputProps) {
  // Warn about deprecated props
  if (process.env.NODE_ENV === 'development') {
    if (props.showCharCounter !== undefined) {
      console.warn(
        '[ChatInput] showCharCounter prop is deprecated. Use <ChatInput.Counter /> instead.'
      )
    }
    if (props.animateHeight !== undefined) {
      console.warn('[ChatInput] animateHeight prop is deprecated. Animation is now automatic.')
    }
  }

  // ... rest of implementation
}
```

### Step 7: Update Documentation (Day 6-7)

1. Create migration guide with before/after examples
2. Update API documentation with compound component patterns
3. Add Storybook stories for all compound variations
4. Create video tutorial showing migration
5. Update TypeScript definitions

---

## Migration Strategy

### Phase 1: Additive Changes (v2.1 - No Breaking Changes)

**Timeline:** Week 1

1. ✅ Add compound component API alongside existing props API
2. ✅ Maintain 100% backward compatibility
3. ✅ Add deprecation warnings for old patterns
4. ✅ Update documentation to show both approaches
5. ✅ Mark old props as `@deprecated` in TSDoc

**Example:**

```tsx
// Old API - still works, shows deprecation warning
<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
  showCharCounter={true}  // ⚠️ Deprecated
/>

// New API - recommended
<ChatInput value={value} onChange={setValue} onSubmit={handleSubmit}>
  <ChatInput.TextArea />
  <ChatInput.Counter />
  <ChatInput.Actions>
    <ChatInput.SendButton />
  </ChatInput.Actions>
</ChatInput>
```

### Phase 2: Documentation & Education (v2.1 - No Breaking Changes)

**Timeline:** Week 2

1. ✅ Publish migration guide
2. ✅ Create codemod for automated migration
3. ✅ Update all examples to use new API
4. ✅ Host community Q&A session
5. ✅ Create video tutorials

**Codemod Example:**

```bash
# Automated migration tool
npx @clarity-chat/codemod migrate-to-compound

# Specific component migration
npx @clarity-chat/codemod migrate-chat-input src/**/*.tsx
```

### Phase 3: Deprecation Period (v2.2 - No Breaking Changes)

**Timeline:** 3 months

1. ✅ Maintain both APIs
2. ✅ Increase visibility of deprecation warnings
3. ✅ Track adoption metrics
4. ✅ Address migration blockers
5. ✅ Prepare for v3.0

### Phase 4: Remove Old API (v3.0 - Breaking Changes)

**Timeline:** After 6 months

1. ⚠️ Remove deprecated props from components
2. ⚠️ Simplify internal implementation
3. ⚠️ Reduce bundle size by removing compatibility layer
4. ⚠️ Update TypeScript definitions

---

## Breaking Changes & Compatibility

### Non-Breaking Changes (v2.1)

✅ **What stays the same:**

- All existing prop-based APIs continue to work
- TypeScript types remain compatible
- No runtime errors for existing code
- Bundle size impact is minimal (<5KB)

✅ **What's new:**

- Compound component API available
- Sub-component composition patterns
- Context-based state sharing
- Better TypeScript inference

### Breaking Changes (v3.0 - Future)

⚠️ **What will break:**

- Props like `showCharCounter`, `showActions` removed
- Nested config objects like `header={{ ... }}` removed
- Component-level boolean flags removed

⚠️ **Migration path:**

```tsx
// Before (v2.x)
<ChatInput showCharCounter={false} />

// After (v3.0)
<ChatInput>
  <ChatInput.TextArea />
  {/* No counter - just omit it */}
  <ChatInput.Actions>
    <ChatInput.SendButton />
  </ChatInput.Actions>
</ChatInput>
```

### Compatibility Matrix

| Component         | v2.1 Old API | v2.1 New API | v3.0 API    |
| ----------------- | ------------ | ------------ | ----------- |
| ChatInput         | ✅ Works     | ✅ Works     | ⚠️ New only |
| Chat              | ✅ Works     | ✅ Works     | ⚠️ New only |
| Chat.Message      | ✅ Works     | ✅ Works     | ⚠️ New only |
| Token.Panel       | ✅ Works     | ✅ Works     | ⚠️ New only |
| Conversation.List | ✅ Works     | ✅ Works     | ⚠️ New only |

---

## Timeline & Milestones

### Week 1: Implementation

**Days 1-2: Foundation**

- ✅ Create compound component utilities
- ✅ Implement ChatInput compound component
- ✅ Add backward compatibility layer
- ✅ Write unit tests

**Days 3-4: Core Components**

- ✅ Implement Chat compound component
- ✅ Implement Chat.Message compound component
- ✅ Add TypeScript definitions
- ✅ Write integration tests

**Day 5: Polish**

- ✅ Add deprecation warnings
- ✅ Performance optimization
- ✅ Accessibility audit
- ✅ Bundle size analysis

### Week 2: Documentation & Launch

**Days 1-2: Documentation**

- ✅ Write migration guide
- ✅ Update API documentation
- ✅ Create Storybook stories
- ✅ Record video tutorials

**Days 3-4: Testing**

- ✅ Beta testing with early adopters
- ✅ Fix reported issues
- ✅ Performance benchmarks
- ✅ Accessibility testing

**Day 5: Launch**

- ✅ Publish v2.1.0
- ✅ Announce in community
- ✅ Monitor adoption
- ✅ Support users

---

## Success Metrics

### Developer Experience

- ✅ **Time to customize:** Reduce from 30min to 10min
- ✅ **Code clarity:** 80%+ prefer compound API (survey)
- ✅ **Type inference:** 100% TypeScript coverage
- ✅ **Bundle size:** <5KB increase for compound infrastructure

### Adoption Metrics

- ✅ **Week 1:** 10% of new projects use compound API
- ✅ **Month 1:** 30% adoption rate
- ✅ **Month 3:** 60% adoption rate
- ✅ **Month 6:** 80% adoption rate (ready for v3.0)

### Code Quality

- ✅ **Test coverage:** 95%+ for compound components
- ✅ **Accessibility:** 100% WCAG 2.1 AA compliance
- ✅ **Performance:** No regression vs. old API
- ✅ **Documentation:** 100% API surface documented

---

## Risk Assessment

### Technical Risks

#### Risk 1: Bundle Size Increase

**Likelihood:** Medium **Impact:** Low **Mitigation:**

- Tree-shaking optimized exports
- Lazy load sub-components
- Shared context utilities
- Monitor with bundlesize CI check

#### Risk 2: Breaking Existing Code

**Likelihood:** Low (v2.1), High (v3.0) **Impact:** High **Mitigation:**

- Maintain backward compatibility in v2.x
- Automated codemod for migration
- 6-month deprecation period
- Clear migration guide

#### Risk 3: Learning Curve

**Likelihood:** Medium **Impact:** Medium **Mitigation:**

- Excellent documentation
- Video tutorials
- Community support
- Simple examples first

### Adoption Risks

#### Risk 4: Developer Resistance

**Likelihood:** Medium **Impact:** Medium **Mitigation:**

- Show clear benefits in docs
- Make migration optional in v2.x
- Provide automated migration tool
- Gather feedback early

#### Risk 5: Incomplete Migration Tools

**Likelihood:** Low **Impact:** Medium **Mitigation:**

- Thorough codemod testing
- Manual migration guide as fallback
- Community contributions to codemod
- Early beta program

---

## Example Before/After Comparisons

### Example 1: Simple Chat Input

**Before:**

```tsx
<ChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
  placeholder="Type a message..."
  maxLength={1000}
  showCharCounter={true}
/>
```

**After:**

```tsx
<ChatInput value={value} onChange={setValue} onSubmit={handleSubmit}>
  <ChatInput.TextArea placeholder="Type a message..." maxLength={1000} />
  <ChatInput.Counter />
  <ChatInput.Actions>
    <ChatInput.SendButton />
  </ChatInput.Actions>
</ChatInput>
```

### Example 2: Custom Chat Layout

**Before (not possible without prop drilling):**

```tsx
<ChatWindow
  messages={messages}
  input={input}
  onInputChange={setInput}
  onSubmit={handleSubmit}
  header={{
    title: 'Chat',
    actions: <CustomActions />,
  }}
  // Can't insert custom element between messages and input!
/>
```

**After (fully customizable):**

```tsx
<Chat>
  <Chat.Header>
    <Chat.Title>Chat</Chat.Title>
    <Chat.Actions>
      <CustomActions />
    </Chat.Actions>
  </Chat.Header>

  <Chat.Messages messages={messages} />

  {/* Custom element - now possible! */}
  <div className="my-custom-separator">
    <Divider />
    <TokenUsageBadge />
  </div>

  <Chat.Input value={input} onChange={setInput} onSubmit={handleSubmit}>
    <Chat.Input.TextArea />
    <Chat.Input.Actions>
      <Chat.Input.AttachButton />
      <Chat.Input.SendButton />
    </Chat.Input.Actions>
  </Chat.Input>
</Chat>
```

### Example 3: Message Customization

**Before:**

```tsx
<ChatMessage
  message={message}
  showAvatar={true}
  showTimestamp={true}
  showActions={true}
  // Can't reorder elements!
  // Can't add custom elements between avatar and content!
/>
```

**After:**

```tsx
<Chat.Message message={message}>
  <Chat.Message.Avatar />

  {/* Custom element - now possible! */}
  <Badge>{message.model}</Badge>

  <Chat.Message.Content />
  <Chat.Message.Timestamp />

  <Chat.Message.Actions>
    <Chat.Message.CopyButton />

    {/* Conditional custom action */}
    {message.role === 'assistant' && <Chat.Message.RegenerateButton />}

    <Chat.Message.FeedbackButtons />
  </Chat.Message.Actions>
</Chat.Message>
```

---

## Next Steps

### Immediate (This Week)

1. ✅ Review this plan with stakeholders
2. ✅ Get approval for v2.1 approach
3. ✅ Set up project board for tracking
4. ✅ Create feature branch: `feature/compound-components`

### Short-term (Next 2 Weeks)

1. ✅ Implement compound component infrastructure
2. ✅ Refactor ChatInput, Chat, Chat.Message
3. ✅ Write comprehensive tests
4. ✅ Create migration guide
5. ✅ Beta test with early adopters

### Long-term (Next 3 Months)

1. ✅ Monitor adoption metrics
2. ✅ Gather community feedback
3. ✅ Improve migration tools
4. ✅ Plan v3.0 timeline

---

## Appendix: Competitive Patterns

### Assistant UI Pattern

```tsx
<Thread.Root>
  <Thread.Viewport>
    <Thread.Messages />
  </Thread.Viewport>
  <Composer.Root>
    <Composer.Input />
    <Composer.Send />
  </Composer.Root>
</Thread.Root>
```

**What we like:**

- Clear hierarchy
- Separate viewport concept
- Composer as separate compound

**What we'll adapt:**

- Similar namespace structure
- Context-based state sharing
- Validation of parent-child relationships

### shadcn/ui AI Pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>
      <Button variant="ghost" size="icon-sm">
        <MoreHorizontal />
      </Button>
    </CardAction>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**What we like:**

- Semantic naming (Header, Content, Footer)
- Action slots
- Self-documenting structure

**What we'll adapt:**

- Similar semantic breakdown
- Slot-based customization
- Clear visual hierarchy

---

## Conclusion

The compound component pattern will:

1. ✅ **Improve DX** - Clearer API, better discoverability
2. ✅ **Increase flexibility** - Easy to customize any part
3. ✅ **Enhance type safety** - Better TypeScript inference
4. ✅ **Reduce complexity** - No more prop explosion
5. ✅ **Enable innovation** - Easy to add new sub-components

By maintaining backward compatibility in v2.x, we give developers time to migrate at their own pace
while benefiting from the new API immediately.

---

**Author:** AI Research Agent **Last Updated:** 2026-01-27 **Version:** 1.0 **Status:** Ready for
Review
