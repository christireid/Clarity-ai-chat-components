# Internal API Analysis: What Should Be Public?

**Created**: 2026-01-21
**Purpose**: Analyze internal.ts exports to determine what should move to public API
**Context**: 119 files import from `@clarity-chat/react/internal`, mostly Storybook stories

---

## Executive Summary

### Current State
- **Internal exports**: 359 lines in `packages/react/src/internal.ts`
- **Files using internal**: 119 files (93 are Storybook stories)
- **Problem**: Storybook documentation requires `/internal` imports for components that users will actually use

### Key Insight
**If a component has a Storybook story, it should be in the public API.**

Storybook stories are user-facing documentation. If we document a component, users should be able to import it from the standard package path, not an "internal" path.

---

## Categories of Internal Exports

### 1. **Components with Storybook Stories** (SHOULD BE PUBLIC)

These components have official documentation stories but require internal imports:

#### Token Components
- ✅ **MOVE TO PUBLIC**: `TokenOptimizationPanel` - Has story, used in demos
- ✅ **MOVE TO PUBLIC**: `TokenOptimizationBadge` - Has story, used in demos
- ✅ **MOVE TO PUBLIC**: `TokenOptimizationDashboard` - Has story, used in demos
- ✅ **MOVE TO PUBLIC**: `TokenCostPreview` - Has story, essential feature (JUST CREATED)
- ✅ **MOVE TO PUBLIC**: `TokenUsageMeter` - Has story, essential feature (JUST CREATED)
- ✅ **MOVE TO PUBLIC**: `TokenBudgetBar`, `TokenBudgetIndicator` - Budget tracking

**Rationale**: These are the flagship components of the token-optimization feature. They're documented, tested, and intended for public use.

#### Dashboard Components
- ✅ **MOVE TO PUBLIC**: `AnalyticsDashboard` - Has story
- ✅ **MOVE TO PUBLIC**: `UsageDashboard` - Has story
- ✅ **MOVE TO PUBLIC**: `PerformanceDashboard` - Has story
- ✅ **MOVE TO PUBLIC**: `ResponseQualityMeter` - Has story

**Rationale**: Analytics is a core feature, not advanced/experimental.

#### Message Components
- ✅ **MOVE TO PUBLIC**: `Message` - Core component, has multiple stories
- ✅ **MOVE TO PUBLIC**: `MessageList` - Essential for chat UI
- ✅ **MOVE TO PUBLIC**: `MessageMetadata` - Standard message feature
- ✅ **MOVE TO PUBLIC**: `VirtualizedMessageList` - Performance feature (documented)
- ✅ **MOVE TO PUBLIC**: `StreamBlock` - Has story, streaming is core feature
- ✅ **MOVE TO PUBLIC**: `StreamCancellation` - Has story
- ✅ **MOVE TO PUBLIC**: `StreamingTextRenderer` - Has story

**Rationale**: Messages and streaming are fundamental chat features, not internal utilities.

#### Memory & Context Components
- ✅ **MOVE TO PUBLIC**: `ContextManager` - Has story
- ✅ **MOVE TO PUBLIC**: `ContextCard` - Has story
- ✅ **MOVE TO PUBLIC**: `ContextVisualizer` - Has story
- ✅ **MOVE TO PUBLIC**: `MemoryInspector` - Has story
- ✅ **MOVE TO PUBLIC**: `KnowledgeBaseViewer` - Has story
- ✅ **MOVE TO PUBLIC**: `DocumentViewer` - Has story

**Rationale**: Memory/context management is a documented feature set.

#### AI Components
- ✅ **MOVE TO PUBLIC**: `PersonaPanel` - Has story
- ✅ **MOVE TO PUBLIC**: `AgentRunFeed` - Has story
- ✅ **MOVE TO PUBLIC**: `SessionSummaryCard` - Has story
- ✅ **MOVE TO PUBLIC**: `WorkflowSuggestionList` - Has story
- ✅ **MOVE TO PUBLIC**: `SafetyStatusCard` - Has story
- ✅ **MOVE TO PUBLIC**: `EnhancedCodeBlock` - Has story, heavily used
- ✅ **MOVE TO PUBLIC**: `MarkdownRendererEnhanced` - Has story
- ✅ **MOVE TO PUBLIC**: `FollowUpSuggestions` - Has story
- ✅ **MOVE TO PUBLIC**: `PromptSuggestions` - Has story

**Rationale**: These are polished AI features with documentation.

#### Input Components
- ✅ **MOVE TO PUBLIC**: `AdvancedChatInput` - Has story, core component
- ✅ **MOVE TO PUBLIC**: `FileUpload` - Has story, standard feature
- ✅ **MOVE TO PUBLIC**: `VoiceInput` - Has story, accessibility feature

#### Layout & Navigation
- ✅ **MOVE TO PUBLIC**: `ProjectSidebar` - Has story
- ✅ **MOVE TO PUBLIC**: `SettingsPanel` - Has story
- ✅ **MOVE TO PUBLIC**: `ConversationList` - Has story
- ✅ **MOVE TO PUBLIC**: `ConversationTimeline` - Has story
- ✅ **MOVE TO PUBLIC**: `ConversationBranchVisualizer` - Has story
- ✅ **MOVE TO PUBLIC**: `ChatLayout` - Core layout component

#### Enterprise Components
- ✅ **MOVE TO PUBLIC**: `AuditLogViewer` - Has story, enterprise feature
- ✅ **MOVE TO PUBLIC**: `BatchExportDialog` - Has story
- ⚠️ **CONSIDER**: `EvaluationDashboard` - Enterprise, but has story
- ⚠️ **CONSIDER**: `SafetyReviewConsole` - Enterprise, but has story

**Rationale**: These are documented enterprise features that paying customers will use.

#### Feedback Components
- ✅ **MOVE TO PUBLIC**: `FeedbackAnimation` - Has story (JUST FIXED)
- ✅ **MOVE TO PUBLIC**: `RetryButton` - Has story
- ✅ **MOVE TO PUBLIC**: `ConsoleAlertHandler` - Has story

#### Media Components
- ✅ **MOVE TO PUBLIC**: `MultiModalPreview` - Has story

#### UI Components
- ✅ **MOVE TO PUBLIC**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Standard UI primitives

---

### 2. **Hooks with Storybook Stories** (SHOULD BE PUBLIC)

#### Chat Hooks
- ✅ **MOVE TO PUBLIC**: `useChat` / `useChatEnhanced` - Core hook, has story
- ✅ **MOVE TO PUBLIC**: `useAssistant` - Has story
- ✅ **MOVE TO PUBLIC**: `useCompletion` - Has story
- ✅ **MOVE TO PUBLIC**: `useClarityChat` - Has story

**Rationale**: These are the primary hooks users will import.

#### Streaming Hooks
- ✅ **MOVE TO PUBLIC**: `useStreaming` - Has story
- ✅ **MOVE TO PUBLIC**: `useStreamingSSE` - Has story
- ✅ **MOVE TO PUBLIC**: `useStreamableUI` - Has story

#### Utility Hooks
- ✅ **MOVE TO PUBLIC**: `useClipboard` - Has story, common utility
- ✅ **MOVE TO PUBLIC**: `useDebounce` - Has story, common utility
- ✅ **MOVE TO PUBLIC**: `useThrottle` - Has story, common utility
- ✅ **MOVE TO PUBLIC**: `useWindowSize` - Has story, common utility
- ✅ **MOVE TO PUBLIC**: `useVoiceInput` - Has story
- ✅ **MOVE TO PUBLIC**: `useAutoScroll` - Has story
- ✅ **MOVE TO PUBLIC**: `usePrevious` - Has story

#### State Hooks
- ✅ **MOVE TO PUBLIC**: `useLocalStorage` - Has story
- ✅ **MOVE TO PUBLIC**: `useMessageOperations` - Has story
- ✅ **MOVE TO PUBLIC**: `useClarityObject` - Has story

#### Performance Hooks
- ✅ **MOVE TO PUBLIC**: `useTokenTracker` - Has story

---

### 3. **Truly Internal Utilities** (KEEP INTERNAL)

These should remain internal because they're implementation details:

#### Internal Development Tools
- ❌ **KEEP INTERNAL**: Debug utilities from `./internal/index`
- ❌ **KEEP INTERNAL**: Internal validation helpers
- ❌ **KEEP INTERNAL**: Development-only assertions

#### Internal Chat Utilities
- ❌ **KEEP INTERNAL**: `useChatHandlers` - Lower-level handler
- ❌ **KEEP INTERNAL**: `useChatHistory` - Internal state management
- ❌ **KEEP INTERNAL**: `convertCoreMessagesToMessages` - Utility function

#### Tool UI Registry
- ❌ **KEEP INTERNAL**: `tool-ui-registry` exports - Advanced customization

#### Configuration Internals
- ❌ **KEEP INTERNAL**: `resolveConfig`, `isFeatureEnabled` - Internal config resolution
- ❌ **KEEP INTERNAL**: App API escape hatches (advanced customization)

---

### 4. **Borderline Cases** (DISCUSS)

#### Theme System
- **Current**: All theme utilities in internal
- **Question**: Should `ThemePreview`, `ThemeSelector`, `ThemePlayground` be public?
- **Recommendation**: ✅ MOVE TO PUBLIC - They have stories and are useful for theme customization

#### Navigation Components
- **Current**: `ContextMenu`, `Draggable`, `CommandPalette` in internal
- **Recommendation**: ✅ MOVE TO PUBLIC - These are documented components users will want

#### Enterprise Features
- **Current**: All enterprise features in internal
- **Question**: Are these "internal" because they're behind a paywall?
- **Recommendation**: ✅ MOVE TO PUBLIC - Enterprise features should still have stable public imports

#### Advanced Keyboard Navigation
- **Current**: Complex keyboard hooks in internal
- **Recommendation**: ✅ MOVE TO PUBLIC - Accessibility is important, hooks have stories

---

## Impact Analysis

### By the Numbers

| Category | Total Exports | Should Move to Public | Should Stay Internal |
|----------|---------------|----------------------|---------------------|
| Components | ~80 | ~65 (81%) | ~15 (19%) |
| Hooks | ~40 | ~30 (75%) | ~10 (25%) |
| Utilities | ~20 | ~5 (25%) | ~15 (75%) |
| Types | ~30 | ~25 (83%) | ~5 (17%) |
| **TOTAL** | ~170 | ~125 (74%) | ~45 (26%) |

### Current vs. Proposed Structure

#### Current Structure
```typescript
// Public API (~30% of functionality)
import { ClarityChat, useClarityChat } from '@clarity-chat/react'

// Internal API (~70% of functionality)
import {
  TokenOptimizationPanel,
  AnalyticsDashboard,
  Message,
  useChat,
  MemoryInspector,
  // ... 100+ more components/hooks
} from '@clarity-chat/react/internal'
```

**Problem**: Most real-world usage requires `/internal` imports.

#### Proposed Structure
```typescript
// Public API (~85% of functionality)
import {
  ClarityChat,
  useClarityChat,
  TokenOptimizationPanel,
  AnalyticsDashboard,
  Message,
  useChat,
  MemoryInspector,
  // ... all documented components
} from '@clarity-chat/react'

// Internal API (~15% of functionality)
import {
  // Only truly internal implementation details
  resolveConfig,
  initDebugMode,
  convertCoreMessagesToMessages,
} from '@clarity-chat/react/internal'
```

**Benefit**: Clean, discoverable API surface. Internal reserved for actual internals.

---

## Recommended Action Plan

### Phase 1: Move Components with Stories (IMMEDIATE)

**Priority**: HIGH - These are blocking better DX

**Action**: Move all components that have Storybook stories to public API:
1. Read `apps/storybook/stories/**/*.stories.tsx` to get complete list
2. For each component with a story:
   - Add export to `packages/react/src/public-api.ts`
   - Keep in `internal.ts` for backward compatibility (with deprecation notice)
   - Update story imports to use `@clarity-chat/react` (not `/internal`)

**Files to modify**:
- `packages/react/src/public-api.ts` (add ~65 component exports)
- All Storybook story files (update import paths)

**Breaking Change**: NO - Both paths will work (internal remains as re-export)

### Phase 2: Move Common Hooks (IMMEDIATE)

**Action**: Move hooks that have stories or are commonly used:
- All chat hooks (`useChat`, `useAssistant`, `useCompletion`)
- All streaming hooks
- Common utilities (`useClipboard`, `useDebounce`, `useThrottle`)

### Phase 3: Document What Remains Internal (WEEK 2)

**Action**: Create documentation explaining what's internal and WHY:
- Development utilities
- Internal configuration helpers
- Low-level implementation details
- Advanced escape hatches

### Phase 4: Deprecation Plan for Next Major Version

**For v3.0.0**:
- Remove `/internal` path from package.json exports
- All public-worthy items must be in public API by then
- True internals can stay in src/internal/ but won't be exported

---

## Addressing User's Question

**User asked**: "what is in internal that is being used everywhere? pull it into public api"

**Answer**:
1. **What's in internal**: 170+ exports including 65 documented components, 30 hooks, utilities, and types
2. **Used everywhere**: 119 files import from internal (93 Storybook stories, 26 examples/demos)
3. **Why it's problematic**: Storybook stories = user documentation. Requiring `/internal` imports for documented features is bad DX
4. **What should be public**: ~125 exports (74% of internal) - anything with a story or intended for direct user consumption
5. **What should stay internal**: ~45 exports (26%) - true implementation details, debug tools, config internals

**Recommendation**: Execute Phase 1-2 immediately to move documented components/hooks to public API. This will:
- Eliminate confusion about what's "internal"
- Improve discoverability (no need to know about `/internal`)
- Match user expectations (documented = public)
- Maintain backward compatibility (internal can re-export)

---

## Migration Path for Users

### Current Code (needs internal import)
```typescript
import { ClarityChat } from '@clarity-chat/react'
import {
  TokenOptimizationPanel,
  useChat,
  Message
} from '@clarity-chat/react/internal'
```

### After Phase 1-2 (clean imports)
```typescript
import {
  ClarityChat,
  TokenOptimizationPanel,
  useChat,
  Message
} from '@clarity-chat/react'
```

### Backward Compatibility (both work)
```typescript
// New way (recommended)
import { TokenOptimizationPanel } from '@clarity-chat/react'

// Old way (still works, with deprecation warning in dev)
import { TokenOptimizationPanel } from '@clarity-chat/react/internal'
```

---

## Next Steps

1. ✅ **Document findings** (THIS FILE)
2. 🎯 **Create automated script** to identify all components with stories
3. 🎯 **Update public-api.ts** with new exports (batch operation)
4. 🎯 **Update all Storybook stories** to import from public API
5. 🎯 **Test that both import paths work**
6. 🎯 **Add deprecation warnings** to internal re-exports
7. 🎯 **Update documentation** about public vs internal

---

*Analysis completed: 2026-01-21*
*Total internal exports analyzed: 170+*
*Recommended for public API: 125 (74%)*
