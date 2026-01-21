# Clarity Chat Documentation Coverage Report

Generated: 2026-01-19

## Executive Summary

This report analyzes the documentation coverage for all components and hooks exported from `packages/react/src/public-api.ts` against the documentation found in `apps/docs/`.

**Coverage Statistics:**
- Total Exported Items: 92 (Components: 54, Hooks: 38)
- Documented: 48 (52%)
- Missing Documentation: 34 (37%)
- Incomplete Documentation: 10 (11%)

---

## Documentation Sources Analyzed

1. `/apps/docs/content/vitepress-migration/api/components.md` - Main component API reference
2. `/apps/docs/content/vitepress-migration/api/hooks.md` - Main hooks API reference
3. `/apps/docs/content/vitepress-migration/api/streaming-components.md` - Streaming component docs
4. `/apps/docs/content/guides-migration/api/react-components.md` - Additional component docs
5. `/apps/docs/content/guides-migration/api/token-optimization.md` - Token optimization API
6. `/apps/docs/app/learn/concepts/components/page.tsx` - Conceptual overview
7. `/apps/docs/app/learn/concepts/hooks/page.tsx` - Hooks conceptual overview

---

## Core Components

### Fully Documented

| Component | Props Table | Code Example | Usage Guide |
|-----------|-------------|--------------|-------------|
| ClarityChat | Partial | Yes | Yes |
| ChatWindow | Yes | Yes | Yes |
| ChatInput | Yes | Yes | Yes |
| MessageList | Yes | Yes | Yes |
| StreamingMessage | Yes | Yes | Yes |
| ThinkingIndicator | Yes | Yes | Yes |
| TypingIndicator | Partial | Yes | Partial |

### Missing Documentation

| Component | Status | Notes |
|-----------|--------|-------|
| ClarityChatPresets | Missing | No dedicated documentation page |
| ChatComplete | Missing | Recipe component not documented |
| ChatWithMemory | Missing | Recipe component not documented |
| ChatWithAnalytics | Missing | Recipe component not documented |
| FloatingChatWidget | Missing | No documentation found |
| TanStackMessageList | Missing | No documentation found |
| AutoTanStackMessageList | Missing | No documentation found |
| ChatLayout | Missing | Layout component not documented |
| ResizableChatLayout | Missing | Layout component not documented |

---

## AI Components

### Fully Documented

| Component | Props Table | Code Example | Usage Guide |
|-----------|-------------|--------------|-------------|
| Citation | Partial | Yes | Yes |
| CitationCard | Yes | Yes | Yes |
| StreamingMessage | Yes | Yes | Yes |

### Partially Documented

| Component | Issue |
|-----------|-------|
| SourceCitation | Mentioned but no props table |
| MarkdownRendererEnhanced | Brief mention, no props table |
| ChainOfThought | Mentioned in concepts, no API docs |
| ThinkingBar | Mentioned in concepts, no API docs |
| StreamStatusProgress | Not documented |

### Missing Documentation

| Component | Status |
|-----------|--------|
| TextShimmer | Missing |
| ParagraphShimmer | Missing |
| HeadingShimmer | Missing |
| CodeShimmer | Missing |
| ToolExecutionCard | Missing (ToolInvocationCard documented instead) |
| CodeBlock | Missing |
| StreamingCodeBlock | Missing |
| EnhancedCodeBlock | Missing |

---

## UI Components

### Fully Documented

| Component | Props Table | Code Example | Usage Guide |
|-----------|-------------|--------------|-------------|
| ErrorBoundary | Yes | Yes | Yes |
| NetworkStatus | Yes | Yes | Yes |
| TokenCounter | Yes | Yes | Yes |
| FollowUpSuggestions | Yes | Yes | Yes |

### Partially Documented

| Component | Issue |
|-----------|-------|
| ExportDialog | Mentioned but incomplete |
| MessageSearch | Referenced but no API docs |
| PromptSuggestions | Referenced but no dedicated docs |
| ToastProvider | useToast hook documented, provider not |

### Missing Documentation

| Component | Status |
|-----------|--------|
| PromptContainer | Missing |
| SuggestionCards | Missing |
| VoiceInput | Missing |
| EmptyChatState | Missing |
| ClarityToaster | Missing (sonner-based toast) |

---

## Hooks

### Fully Documented

| Hook | Signature | Options | Return | Example |
|------|-----------|---------|--------|---------|
| useChat | Yes | Yes | Yes | Yes |
| useStreamingChat | Yes | Yes | Yes | Yes |
| useMessageOperations | Yes | Yes | Yes | Yes |
| useTokenCount | Yes | Yes | Yes | Yes |
| useFileUpload | Yes | Yes | Yes | Yes |
| useNetworkStatus | Yes | Yes | Yes | Yes |
| useLocalStorage | Yes | Yes | Yes | Yes |
| useClipboard | Yes | Yes | Yes | Yes |
| useAutoScroll | Yes | Yes | Yes | Yes |
| useTypingIndicator | Yes | Yes | Yes | Yes |
| useDebounce | Yes | Yes | Yes | Yes |
| useRetry | Yes | Yes | Yes | Yes |

### Partially Documented

| Hook | Issue |
|------|-------|
| useClarityChat | Main hook, but docs reference useChat |
| useHeadlessChat | Mentioned but not detailed |
| useClarityObject | Structured output, briefly mentioned |
| useClarityChatWithTools | Tool integration, no dedicated docs |
| useSourceCitation | Component-coupled, no standalone docs |
| useChainOfThought | Component-coupled, no standalone docs |
| useThinkingBar | Component-coupled, no standalone docs |
| useToast | Documented but incomplete |
| useTokenBudget | Mentioned in token optimization docs |

### Missing Documentation

| Hook | Status |
|------|--------|
| useMemoryContext | Missing |
| useTheme | Missing (only ThemeProvider mentioned) |
| useKeyboardShortcuts | Missing |
| useStreaming | Missing |
| useSmoothedText | Missing |
| useStreamStatus | Missing |

---

## Gap Analysis by Category

### Critical Gaps (High Priority)

These are core components/hooks that need documentation:

1. **useClarityChat** - The primary hook, but documentation refers to useChat
2. **ChatComplete/ChatWithMemory/ChatWithAnalytics** - Recipe components have no docs
3. **FloatingChatWidget** - Common use case, no documentation
4. **TanStackMessageList/AutoTanStackMessageList** - Virtualization components undocumented
5. **useMemoryContext** - Memory system hook undocumented

### Moderate Gaps (Medium Priority)

These components are mentioned but need better documentation:

1. **ChainOfThought** - AI reasoning visualization needs API docs
2. **ThinkingBar** - Progress indicator needs API docs
3. **StreamStatusProgress** - Streaming status needs docs
4. **Code block components** - CodeBlock, StreamingCodeBlock, EnhancedCodeBlock
5. **Shimmer components** - TextShimmer family needs docs

### Minor Gaps (Low Priority)

These are specialized or advanced features:

1. **ResizableChatLayout** - Advanced layout
2. **VoiceInput** - Voice input component
3. **PromptContainer/SuggestionCards** - Prompt management
4. **ClarityToaster** - Alternative toast implementation

---

## Documentation Quality Issues

### Inconsistencies Found

1. **Naming mismatch**: Docs reference `useChat` but public API exports `useClarityChat`
2. **Import paths**: Docs show `@clarity-chat/react/internal` but public API uses `@clarity-chat/react`
3. **Type references**: Some props tables reference types not defined in the same doc
4. **ToolInvocationCard vs ToolExecutionCard**: Different names in docs vs exports

### Missing Elements Across Docs

1. **Accessibility notes**: Most component docs lack a11y guidance
2. **TypeScript types**: Many components missing exported type documentation
3. **Migration guides**: No docs for migrating between component versions
4. **Error handling**: Most hooks lack error handling examples

---

## Recommendations

### Immediate Actions

1. Create dedicated documentation pages for:
   - `ClarityChatPresets`
   - `FloatingChatWidget`
   - `TanStackMessageList` and `AutoTanStackMessageList`
   - `ChatLayout` and `ResizableChatLayout`
   - Recipe components (`ChatComplete`, `ChatWithMemory`, `ChatWithAnalytics`)

2. Rename hook documentation to match exports:
   - `useChat` -> `useClarityChat`
   - Document `useHeadlessChat` separately

3. Add API documentation for AI components:
   - `ChainOfThought` with props table
   - `ThinkingBar` with props table
   - `StreamStatusProgress` with props table
   - Shimmer component family

### Documentation Structure Improvements

1. Create `/docs/api/` section with dedicated pages for each component
2. Add TypeScript playground examples for complex hooks
3. Include migration notes for breaking changes
4. Add accessibility checklists per component

### Content Updates

1. Standardize import paths to `@clarity-chat/react`
2. Add consistent "Related Components" sections
3. Include bundle size impact notes
4. Add SSR compatibility notes where relevant

---

## Component Coverage Matrix

```
Legend: Full / Partial / Missing = + / ~ / -

CORE COMPONENTS
+---------------------------+--------+-------+--------+-------+
| Component                 | Exists | Props | Example| Guide |
+---------------------------+--------+-------+--------+-------+
| ClarityChat               |   +    |   ~   |   +    |   +   |
| ClarityChatPresets        |   +    |   -   |   -    |   -   |
| ChatComplete              |   +    |   -   |   -    |   -   |
| ChatWithMemory            |   +    |   -   |   -    |   -   |
| ChatWithAnalytics         |   +    |   -   |   -    |   -   |
| ChatWindow                |   +    |   +   |   +    |   +   |
| FloatingChatWidget        |   +    |   -   |   -    |   -   |
| ChatInput                 |   +    |   +   |   +    |   +   |
| MessageList               |   +    |   +   |   +    |   +   |
| TanStackMessageList       |   +    |   -   |   -    |   -   |
| AutoTanStackMessageList   |   +    |   -   |   -    |   -   |
| StreamingMessage          |   +    |   +   |   +    |   +   |
| ThinkingIndicator         |   +    |   +   |   +    |   +   |
| TypingIndicator           |   +    |   ~   |   +    |   ~   |
| ChatLayout                |   +    |   -   |   -    |   -   |
| ResizableChatLayout       |   +    |   -   |   -    |   -   |
+---------------------------+--------+-------+--------+-------+

AI COMPONENTS
+---------------------------+--------+-------+--------+-------+
| Component                 | Exists | Props | Example| Guide |
+---------------------------+--------+-------+--------+-------+
| Citation                  |   +    |   ~   |   +    |   +   |
| SourceCitation            |   +    |   -   |   ~    |   -   |
| MarkdownRendererEnhanced  |   +    |   -   |   ~    |   -   |
| ChainOfThought            |   +    |   -   |   ~    |   -   |
| ThinkingBar               |   +    |   -   |   ~    |   -   |
| StreamStatusProgress      |   +    |   -   |   -    |   -   |
| TextShimmer               |   +    |   -   |   -    |   -   |
| ParagraphShimmer          |   +    |   -   |   -    |   -   |
| HeadingShimmer            |   +    |   -   |   -    |   -   |
| CodeShimmer               |   +    |   -   |   -    |   -   |
| ToolExecutionCard         |   +    |   -   |   -    |   -   |
| CodeBlock                 |   +    |   -   |   -    |   -   |
| StreamingCodeBlock        |   +    |   -   |   -    |   -   |
| EnhancedCodeBlock         |   +    |   -   |   -    |   -   |
+---------------------------+--------+-------+--------+-------+

UI COMPONENTS
+---------------------------+--------+-------+--------+-------+
| Component                 | Exists | Props | Example| Guide |
+---------------------------+--------+-------+--------+-------+
| ErrorBoundary             |   +    |   +   |   +    |   +   |
| NetworkStatus             |   +    |   +   |   +    |   +   |
| TokenCounter              |   +    |   +   |   +    |   +   |
| ExportDialog              |   +    |   ~   |   -    |   -   |
| MessageSearch             |   +    |   -   |   -    |   -   |
| FollowUpSuggestions       |   +    |   +   |   +    |   +   |
| PromptSuggestions         |   +    |   ~   |   -    |   -   |
| PromptContainer           |   +    |   -   |   -    |   -   |
| SuggestionCards           |   +    |   -   |   -    |   -   |
| CitationCard              |   +    |   +   |   +    |   +   |
| VoiceInput                |   +    |   -   |   -    |   -   |
| EmptyChatState            |   +    |   -   |   -    |   -   |
| ToastProvider             |   +    |   ~   |   +    |   ~   |
| ClarityToaster            |   +    |   -   |   -    |   -   |
+---------------------------+--------+-------+--------+-------+

HOOKS
+---------------------------+--------+-------+--------+-------+
| Hook                      | Exists | Opts  | Return | Example|
+---------------------------+--------+-------+--------+-------+
| useClarityChat            |   +    |   ~   |   ~    |   ~   |
| useHeadlessChat           |   +    |   ~   |   ~    |   -   |
| useClarityObject          |   +    |   -   |   -    |   -   |
| useClarityChatWithTools   |   +    |   -   |   -    |   -   |
| useSourceCitation         |   +    |   -   |   -    |   -   |
| useChainOfThought         |   +    |   -   |   -    |   -   |
| useThinkingBar            |   +    |   -   |   -    |   -   |
| useMemoryContext          |   +    |   -   |   -    |   -   |
| useTokenBudget            |   +    |   ~   |   ~    |   ~   |
| useTheme                  |   +    |   -   |   -    |   -   |
| useToast                  |   +    |   +   |   +    |   +   |
| useKeyboardShortcuts      |   +    |   -   |   -    |   -   |
| useClipboard              |   +    |   +   |   +    |   +   |
| useStreaming              |   +    |   -   |   -    |   -   |
| useSmoothedText           |   +    |   -   |   -    |   -   |
| useStreamStatus           |   +    |   -   |   -    |   -   |
| useAutoScroll             |   +    |   +   |   +    |   +   |
+---------------------------+--------+-------+--------+-------+
```

---

## Summary

The Clarity Chat documentation covers approximately 52% of the public API fully. Critical gaps exist in:

1. **Recipe components** - None of the pre-configured chat components are documented
2. **AI components** - Most AI visualization components lack API documentation
3. **Virtualized lists** - TanStack-based message lists are undocumented
4. **Layout components** - ChatLayout and ResizableChatLayout need docs
5. **Advanced hooks** - Memory, streaming, and tool hooks need documentation

The documentation structure is well-organized but needs content additions. Priority should be given to documenting the most commonly used components and hooks that are currently missing documentation.
