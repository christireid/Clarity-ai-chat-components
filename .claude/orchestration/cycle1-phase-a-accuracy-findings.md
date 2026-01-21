# Cycle 1 Phase A: Accuracy Audit Findings

**Date**: 2026-01-19
**Status**: COMPLETED
**Total Issues Found**: 47

---

## 1. Code Example Issues (6 Critical)

### Issue A1: Landing Page Uses Deprecated Component
- **File**: `apps/docs/app/page.tsx` (lines 120-141)
- **Severity**: HIGH
- **Issue**: Code example imports `ClarityChat` but library recommends `ClarityChatApp`
- **Fix**: Change to `import { ClarityChatApp } from '@clarity-chat/react'`

### Issue A2: Non-Existent FeatureLoader Export
- **File**: `apps/docs/app/learn/guides/bundle-size/page.tsx` (lines 346-410)
- **Severity**: CRITICAL
- **Issue**: `FeatureLoader` class doesn't exist in `@clarity-chat/react/core-minimal`
- **Fix**: Remove or add export to library

### Issue A3: FAQ Page Uses Internal Import Path
- **File**: `apps/docs/app/learn/faq/page.tsx` (lines 98-106)
- **Severity**: HIGH
- **Issue**: Recommends `@clarity-chat/react/internal` for public API
- **Fix**: Change to public import path

### Issue A4: Missing useTyping Hook Export
- **File**: `apps/docs/app/learn/tutorial/page.tsx`
- **Severity**: HIGH
- **Issue**: Tutorial imports `useTyping` but it's not exported
- **Fix**: Add to public-api.ts or update docs

### Issue A5: Bundle Size Guide Invalid Exports
- **File**: `apps/docs/app/learn/guides/bundle-size/page.tsx`
- **Severity**: MEDIUM
- **Issue**: References exports not available from core-minimal
- **Fix**: Verify all imports match actual exports

### Issue A6: Inconsistent Component Naming
- **Multiple files**
- **Severity**: MEDIUM
- **Issue**: Mix of ClarityChat and ClarityChatApp in examples
- **Fix**: Standardize on ClarityChatApp

---

## 2. Props Table Issues (35 Discrepancies)

### ChatWindow Component - 🔴 11 MISSING PROPS
Missing from docs:
- `onStopGeneration?: () => void`
- `editingMessageId?: string | null`
- `onSaveEdit?: (messageId: string, newContent: string) => void`
- `onCancelEdit?: (messageId: string) => void`
- `error?: string | null`
- `onRetry?: () => void`
- `onDismissError?: () => void`
- `starterPrompts?: PromptSuggestion[]`
- `followUpSuggestions?: PromptSuggestion[]`
- `showStarterPrompts?: boolean`
- `showFollowUpSuggestions?: boolean`

Signature error:
- `onMessageFeedback` - Missing optional `comment` parameter

### CodeBlock Component - 🔴 CRITICAL (14 MISSING)
Only 7 of ~21 props documented (33% coverage):
- `language?: string`
- `theme?: CodeThemeName | BundledTheme`
- `showLineNumbers?: boolean`
- `startingLineNumber?: number`
- `title?: string`
- `showCopyButton?: boolean`
- `showLanguageBadge?: boolean`
- `maxHeight?: number`
- `wordWrap?: boolean`
- `fontFamily?: CodeFontFamily`
- `enableLigatures?: boolean`
- `onCopy?: () => void`
- `autoDetectLanguage?: boolean`
- `showDownloadButton?: boolean`

### MessageList Component - 🟡 9 MISSING PROPS
Missing accessibility and editing props

### ClarityChat Component - 🟡 1 SIGNATURE ERROR
- `onMessageFeedback` missing optional `comment` param

---

## 3. Import Path Issues (12 Questionable)

Invalid paths found in docs code examples:
1. `@clarity-chat/react/components/chat-window`
2. `@clarity-chat/react/hooks`
3. `@clarity-chat/react/server`
4. `@clarity-chat/react/error`
5. `@clarity-chat/react/logging`
6. `@clarity-chat/react/observability`
7. `@clarity-chat/react/evaluation`
8. `@clarity-chat/react/theme`
9. `@clarity-chat/react/types`
10. `@clarity-chat/react/agents`
11. `@clarity-chat/react/templates`
12. `@clarity-chat/react/testing`

---

## 4. Broken Links (15-20)

| Link | Issue |
|------|-------|
| `/docs` | Should be `/reference` |
| `/contact` | Page does not exist |
| `/home` | Should be `/` |
| `/examples/rag-workbench-demo` | Page doesn't exist |
| `/examples/realtime` | Page doesn't exist |
| `/reference/hooks/use-messages` | Hook not exported |
| `/reference/hooks/use-notification` | Hook not in package |
| `/reference/hooks/use-breakpoint` | Hook not exported |
| `/reference/components/select` | Component not exported |
| `/reference/components/snackbar` | Component not exported |
| `/reference/components/spinner` | Component not exported |

---

## 5. API Reference Gaps (7 Hooks)

### Missing Documentation Entirely:
1. **useStreamStatus** - Complex streaming state tracking
2. **useSmoothedText** - Text animation utility
3. **useClarityChatApp** - Unified app hook
4. **useTheme** - Theme context hook
5. **useTokenBudget** - Token context hook

### Incomplete Documentation:
6. **useStreaming** - Only 67 lines (stub)
7. **useClipboard** - Only 53 lines (minimal)

---

## Summary Scores

| Category | Issues | Severity |
|----------|--------|----------|
| Code Examples | 6 | Critical |
| Props Tables | 35 | High |
| Import Paths | 12 | Medium |
| Broken Links | 15+ | Medium |
| API Reference | 7 | High |
| **TOTAL** | **75+** | - |

---

## Next Steps

All issues must be fixed in Phase F before Cycle 1 completes.
