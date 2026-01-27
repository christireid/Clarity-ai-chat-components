# Task B: Component Documentation Plan

**Status:** Ready to implement (Consolidation Phase A complete)

## Overview

Create 60+ individual documentation pages with interactive demos for all components exported from `extended.ts`.

**Current State:**
- ✅ 17 existing documentation pages
- ❌ ~47 pages needed to reach 60+ target
- 📦 60-64 component/hook exports in extended.ts

## Documentation Structure

Each page should include:
1. **Component Overview** - Description and primary use cases
2. **Props API** - Complete TypeScript interface documentation
3. **Live Demo** - Interactive component demonstration
4. **Code Examples** - Common usage patterns
5. **Best Practices** - Recommended implementation patterns

## Existing Documentation (17 pages)

### Components (13 pages)
1. `/reference/components/button-demo`
2. `/reference/components/chat-window`
3. `/reference/components/clarity-chat`
4. `/reference/components/generative-ui`
5. `/reference/components/message-branch`
6. `/reference/components/message-list`
7. `/reference/components/model-selector`
8. `/reference/components/prompt-suggestions`
9. `/reference/components/streaming-message`
10. `/reference/components/token-budget-bar`
11. `/reference/components/token-optimization-panel`
12. `/reference/components/token-usage-meter`
13. `/reference/components/tool-approval`

### Hooks (4 pages)
1. `/reference/hooks/use-clarity-chat`
2. `/reference/hooks/use-memory`
3. `/reference/hooks/use-streaming`
4. `/reference/hooks/use-token-optimization`

## Missing Documentation Categories

### High Priority Chat Components (~8 pages)
- [ ] ClarityChatApp
- [ ] ClarityChat
- [ ] ClarityChatSimple
- [ ] ChatInput
- [ ] MobileChatWindow
- [ ] ChatWithErrorBoundary
- [ ] VirtualizedMessageList
- [ ] MessageThreadView

### Input Components (~6 pages)
- [ ] AdvancedChatInput
- [ ] VoiceInput (partial)
- [ ] FileUpload (partial)
- [ ] MentionInput/MentionList
- [ ] StructuredInputBuilder
- [ ] OutputPreferenceSelector

### Rendering Components (~5 pages)
- [ ] MarkdownRenderer (EnhancedMarkdownRenderer)
- [ ] CodeBlock
- [ ] StreamingText
- [ ] ToolResultDisplay
- [ ] ErrorDisplay

### AI Components (~8 pages)
- [ ] PersonaPanel
- [ ] ModelSelector (exists but may need update)
- [ ] KnowledgeBasePanel
- [ ] PromptLibrary
- [ ] AIResponseActions
- [ ] ContextViewer
- [ ] ConversationExporter
- [ ] RAGConfigPanel

### Token Optimization Components (~5 pages)
- [ ] TokenCounter
- [ ] TokenBudgetMonitor
- [ ] TokenOptimizationDashboard
- [ ] (Others documented)

### Navigation Components (~4 pages)
- [ ] CommandPalette
- [ ] CommandPaletteEnhanced
- [ ] SearchBar
- [ ] ConversationList

### Conversation Components (~3 pages)
- [ ] ConversationTimeline
- [ ] ConversationExportButton
- [ ] ConversationMetadata

### Feedback Components (~3 pages)
- [ ] FeedbackButtons
- [ ] RatingWidget
- [ ] ShareConversation

### Memory Components (~2 pages)
- [ ] MemoryIndicator
- [ ] MemoryConfigPanel

### Hooks (~8 pages)
- [ ] useChat
- [ ] useChatEnhanced
- [ ] useChatHandlers
- [ ] useTokenBudget
- [ ] usePromptRecipe
- [ ] useMemory (exists)
- [ ] useReducedMotion
- [ ] useMemoryFeedback

## Implementation Strategy

### Phase 1: Template Creation (Priority 1)
Create reusable documentation template with:
- Standard page layout
- Props table component
- Live demo container
- Code example formatter

### Phase 2: High-Priority Components (Priority 1)
Document the most commonly used components first:
1. ClarityChatApp (primary entry point)
2. ClarityChat (main component)
3. ChatInput
4. MessageList (enhance existing)
5. AdvancedChatInput

### Phase 3: AI & Optimization Features (Priority 2)
6. TokenOptimizationDashboard
7. PersonaPanel
8. ModelSelector (enhance)
9. KnowledgeBasePanel
10. PromptLibrary

### Phase 4: Specialized Components (Priority 3)
11. VirtualizedMessageList
12. MentionInput/MentionList
13. StructuredInputBuilder
14. ConversationTimeline
15. RAGConfigPanel

### Phase 5: Utilities & Hooks (Priority 3)
16. Remaining hooks
17. Utility components
18. Edge case components

## Documentation Template Structure

```tsx
// app/reference/[category]/[component-name]/page.tsx

import { ComponentDemo } from '@/components/Docs/ComponentDemo'
import { PropsTable } from '@/components/Docs/PropsTable'
import { CodeExample } from '@/components/Docs/CodeExample'

export default function ComponentNamePage() {
  return (
    <div className="docs-page">
      <h1>ComponentName</h1>

      <section className="overview">
        <p>Brief description and primary use cases</p>
      </section>

      <section className="demo">
        <h2>Live Demo</h2>
        <ComponentDemo component={ComponentName} />
      </section>

      <section className="api">
        <h2>Props</h2>
        <PropsTable component={ComponentName} />
      </section>

      <section className="examples">
        <h2>Examples</h2>
        <CodeExample title="Basic Usage" code={basicExample} />
        <CodeExample title="Advanced Usage" code={advancedExample} />
      </section>

      <section className="best-practices">
        <h2>Best Practices</h2>
        <ul>
          <li>Recommendation 1</li>
          <li>Recommendation 2</li>
        </ul>
      </section>
    </div>
  )
}
```

## Progress Tracking

**Completion Target:** 60+ pages
- Current: 17 pages (28%)
- Needed: 43+ pages (72%)
- Estimated effort: ~2-3 pages per hour with template

## Next Actions

1. ✅ Create documentation page template
2. ✅ Generate PropsTable component (auto-extract from TypeScript)
3. ✅ Create ComponentDemo wrapper
4. Start with Phase 1 (High-Priority Components)
5. Use AI to accelerate page generation while maintaining quality

## Related Files

- Source: `/packages/react/src/extended.ts`
- Docs: `/apps/streamlined-docs/app/reference/`
- Templates: `/apps/streamlined-docs/components/Docs/`

---

**Last Updated:** 2026-01-27
**Task Owner:** Claude Code Session
**Priority:** High (Task B in A→B→C sequence)
