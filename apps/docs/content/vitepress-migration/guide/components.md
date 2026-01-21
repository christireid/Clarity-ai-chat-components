# Components Overview

Clarity Chat ships a comprehensive suite of UI primitives for building production-grade chat experiences. Components are designed to be composable, themeable, and accessible by default.

## 🆕 Recent Improvements (v1.0+)

**Major architectural enhancements** completed in the comprehensive audit:
- ✅ **Grouped Props API**: 73% reduction in prop complexity (30+ → 8 grouped props)
- ✅ **Modular Architecture**: Components split into focused sub-components
- ✅ **Race-Condition-Free**: Memory integration with stable async handling
- ✅ **Enterprise-Ready**: Production-grade error handling and performance

## Core Layout

- `ChatWindow` orchestrates the full messaging surface with a new **grouped props API**
- `MessageList` renders chronological message threads with virtualization support
- `ChatInput` provides enhanced authoring with animations and validation

### ✨ New Grouped Props API (Recommended)

```tsx
import { ChatWindow, MemoryProvider } from '@clarity-chat/react'

export function ModernChat() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}

        // 🎯 New grouped props API - much cleaner!
        header={{
          show: true,
          title: 'AI Assistant',
          subtitle: 'Powered by Clarity Chat',
          showMessageCount: true
        }}

        messageActions={{
          onCopy: handleCopy,
          onFeedback: handleFeedback,
          onRetry: handleRetry
        }}

        editActions={{
          editingMessageId: editingId,
          onSaveEdit: handleSaveEdit,
          onCancelEdit: handleCancelEdit
        }}

        prompts={{
          starterPrompts: starterPrompts,
          followUpSuggestions: followUpSuggestions
        }}
      />
    </MemoryProvider>
  )
}
```

### 📚 Legacy API (Still Supported)

```tsx
// Old API still works for backward compatibility
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onMessageCopy={handleCopy}           // 30+ individual props
  onMessageFeedback={handleFeedback}
  showHeader={true}
  sessionTitle="AI Assistant"
  // ... 25+ more props
/>
```

## Message Presentation

- `Message` supports markdown, citations, inline code, and nested tool traces.
- `StreamingMessage` shows token-by-token output with typing indicators.
- `MessageActions` surfaces reactions, copy, and retry affordances.

## System Controls

- `ModelSelector` lets operators toggle between foundation models or fine-tunes.
- `TemperatureSlider` exposes tuning for creativity versus determinism.
- `SafetyPanel` aggregates moderation and policy outcomes before publishing a reply.

## Operational Widgets

- `ConversationTimeline` visualises turns, tool calls, and agent state.
- `FollowUpSuggestions` seeds the user with context-aware prompts.
- `SessionSummary` packages transcripts for downstream analytics.

## Next Steps

- Explore the Storybook catalog locally (`npm run storybook`, then visit `http://localhost:6006`) for live component examples.
- Review the [Message Handling](/guide/messages) guide for data modeling best practices.
- Consult the [Customization](/guide/customization) guide to align components with your brand.
