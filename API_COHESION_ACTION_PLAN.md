# API Surface Cohesion - Action Plan

**Generated**: 2026-01-27 **Overall Score**: 68/100 **Target Score**: 85/100

This document provides a concrete, prioritized action plan for improving API cohesion across Clarity
Chat packages.

---

## Executive Summary

The audit identified **68 specific issues** across 5 packages:

- 🔴 **Critical**: 12 issues (fix immediately)
- 🟡 **High**: 24 issues (fix in next 2 weeks)
- 🟢 **Medium**: 18 issues (fix in next month)
- 🔵 **Low**: 14 issues (backlog)

**Estimated Effort**: 3-4 weeks for high/critical items

---

## Week 1: Critical Fixes (Score: 68 → 75)

### Day 1-2: Package Export Fixes

#### Task 1.1: Remove Duplicate Export in @clarity-chat/types

**File**: `packages/types/package.json` **Issue**: `./memory` export points to same file as main
export **Effort**: 5 minutes

```diff
// packages/types/package.json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
-   "./memory": {
-     "types": "./dist/index.d.ts",
-     "import": "./dist/index.mjs",
-     "require": "./dist/index.js"
-   }
  }
}
```

**Testing**:

```bash
cd packages/types
pnpm build
# Verify no breaking changes
pnpm test
```

---

#### Task 1.2: Document Bundle Variants

**File**: `packages/react/README.md` **Effort**: 2 hours

Create comparison table:

| Import                             | Size   | Includes       | Use Case           |
| ---------------------------------- | ------ | -------------- | ------------------ |
| `@clarity-chat/react`              | 450 KB | Everything     | Full-featured apps |
| `@clarity-chat/react/core`         | 200 KB | Core features  | Most apps          |
| `@clarity-chat/react/core-minimal` | 150 KB | Essential only | Lightweight apps   |
| `@clarity-chat/react/slim`         | 100 KB | Hooks only     | Custom UI          |

**Deliverable**: Updated README with bundle guide

---

### Day 3-4: Hook Naming Standardization

#### Task 1.3: Deprecate Confusing Hook Aliases

**Files**:

- `packages/react/src/public-api.ts`
- `packages/token-optimization/src/hooks/index.ts`

**Effort**: 3 hours (including tests)

**Changes**:

```typescript
// packages/react/src/public-api.ts

// BEFORE:
export {
  useChat as useHeadlessChat, // ❌ Confusing alias
  useClarityChatApp, // ❌ Verbose
  useTokenBudgetMonitor, // ❌ Deprecated name
} from './hooks'

// AFTER:
export {
  useChat, // ✅ Clear name
  /**
   * @deprecated Use useChat instead
   * Will be removed in v3.0.0
   */
  useChat as useHeadlessChat, // Keep for backward compat
  useChatApp, // ✅ Simplified
  /**
   * @deprecated Use useChatApp instead
   */
  useClarityChatApp, // Keep for backward compat
  useTokenBudgetTracking, // ✅ New name
  /**
   * @deprecated Use useTokenBudgetTracking instead
   */
  useTokenBudgetMonitor, // Keep for backward compat
} from './hooks'
```

**Testing**:

```bash
cd packages/react
pnpm test
# Verify no breaking changes
# Verify deprecation warnings appear
```

**Documentation Update**:

- Add migration guide to CHANGELOG.md
- Update examples to use new names
- Add deprecation notices to JSDoc

---

#### Task 1.4: Add Runtime Deprecation Warnings

**File**: `packages/react/src/hooks/index.ts` **Effort**: 1 hour

```typescript
// packages/react/src/hooks/deprecated.ts

function createDeprecationWarning(oldName: string, newName: string, removeVersion: string) {
  let warned = false
  return () => {
    if (!warned && process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Clarity Chat] ${oldName} is deprecated and will be removed in ${removeVersion}. ` +
          `Use ${newName} instead. See migration guide: https://clarity-chat.dev/migration`
      )
      warned = true
    }
  }
}

export function useHeadlessChat(...args: any[]) {
  createDeprecationWarning('useHeadlessChat', 'useChat', 'v3.0.0')()
  return useChat(...args)
}

export function useClarityChatApp(...args: any[]) {
  createDeprecationWarning('useClarityChatApp', 'useChatApp', 'v3.0.0')()
  return useChatApp(...args)
}
```

---

### Day 5: JSDoc Critical Coverage

#### Task 1.5: Add JSDoc to Top 20 Most-Used Exports

**Effort**: 4 hours

**Priority Exports** (by usage frequency):

1. `useClarityChat` ✅ (already has JSDoc)
2. `ClarityChat` ❌ (needs JSDoc)
3. `ChatWindow` ❌
4. `MessageList` ❌
5. `ChatInput` ❌
6. `useTokenCount` ✅
7. `EnhancedMarkdownRenderer` ❌
8. `ThemeProvider` ❌
9. `toast` ✅
10. `cn` ✅
11. `createAgent` ❌ **CRITICAL**
12. `createRAGEngine` ❌ **CRITICAL**
13. `useMemoryContext` ❌
14. `TokenBudgetProvider` ❌
15. `ModelRouter` ✅
16. `LicenseProvider` ❌
17. `AnalyticsDashboard` ❌
18. `ConversationList` ❌
19. `FileUpload` ❌
20. `VoiceInput` ❌

**Template**:

````typescript
/**
 * [One-line description]
 *
 * [Detailed description - 2-3 sentences explaining what it does,
 * why you'd use it, and key features]
 *
 * @param [paramName] - [Description]
 * @returns [Description]
 *
 * @example Basic usage
 * ```tsx
 * // [Show simplest usage]
 * ```
 *
 * @example Advanced usage
 * ```tsx
 * // [Show more complex scenario]
 * ```
 *
 * @see {@link [RelatedType]} for configuration options
 */
````

**Process**:

1. Use GitHub Copilot to generate JSDoc skeletons
2. Review and enhance with actual usage examples
3. Add @see links to related types/functions
4. Validate examples actually work

---

## Week 2: High Priority Fixes (Score: 75 → 80)

### Day 6-7: Type Export Completeness

#### Task 2.1: Export Missing Engine Config Types

**Files**:

- `packages/react/src/public-api.ts`
- `packages/react/src/app-api/index.ts`

**Effort**: 2 hours

```typescript
// packages/react/src/public-api.ts

// BEFORE:
export { createRAGEngine } from './app-api/rag-engine'
export { createToolsEngine } from './app-api/tools-engine'
export { createAgent } from './agents'

// AFTER:
export {
  createRAGEngine,
  type RAGEngineConfig,
  type RAGEngine,
  type RAGDocument,
  type RAGSearchOptions,
  type RAGSearchResult,
} from './app-api/rag-engine'

export {
  createToolsEngine,
  type ToolsEngineConfig,
  type ToolsEngine,
  type ToolDefinition,
  type ToolExecutionResult,
} from './app-api/tools-engine'

export {
  createAgent,
  type AgentConfig,
  type Agent,
  type AgentCapability,
  type AgentContext,
} from './agents'
```

**Testing**:

```typescript
// Type-only import should work:
import type { RAGEngineConfig } from '@clarity-chat/react'

const config: RAGEngineConfig = { ... }
```

---

#### Task 2.2: Audit and Export All Hook Types

**File**: `packages/react/src/public-api.ts` **Effort**: 3 hours

**Process**:

1. Run script to find hooks without exported types
2. Add missing types to public-api.ts
3. Verify TypeScript compilation
4. Update documentation

**Script**:

```typescript
// scripts/audit-hook-types.ts

import { readFileSync } from 'fs'
import { globSync } from 'glob'

const files = globSync('packages/react/src/hooks/**/*.ts')
const publicAPI = readFileSync('packages/react/src/public-api.ts', 'utf-8')

for (const file of files) {
  const content = readFileSync(file, 'utf-8')
  const hookMatch = content.match(/export function (use\w+)/g)

  if (hookMatch) {
    for (const hook of hookMatch) {
      const hookName = hook.replace('export function ', '')
      const optionsType = `${hookName.replace('use', 'Use')}Options`
      const returnType = `${hookName.replace('use', 'Use')}Return`

      if (!publicAPI.includes(optionsType)) {
        console.log(`❌ Missing: ${optionsType}`)
      }
      if (!publicAPI.includes(returnType)) {
        console.log(`❌ Missing: ${returnType}`)
      }
    }
  }
}
```

---

### Day 8-9: Component Naming Cleanup

#### Task 2.3: Consolidate Message List Components

**Files**:

- `packages/react/src/components/message/MessageList.tsx`
- `packages/react/src/components/chat/VirtualizedMessageList.tsx`
- `packages/react/src/components/chat/TanstackMessageList.tsx`
- `packages/react/src/public-api.ts`

**Effort**: 6 hours (including migration guide)

**New Architecture**:

````typescript
// packages/react/src/components/message/MessageList.tsx

export interface MessageListProps {
  messages: Message[]
  variant?: 'auto' | 'basic' | 'virtual'  // New: auto-select
  virtualized?: boolean  // Deprecated: use variant
  // ... other props
}

/**
 * Displays a list of messages with optional virtualization.
 *
 * By default, automatically chooses the best implementation:
 * - < 50 messages: Basic (array.map)
 * - >= 50 messages: Virtual (TanStack Virtual)
 *
 * @example Auto-select (recommended)
 * ```tsx
 * <MessageList messages={messages} />
 * ```
 *
 * @example Force basic mode
 * ```tsx
 * <MessageList messages={messages} variant="basic" />
 * ```
 *
 * @example Force virtualization
 * ```tsx
 * <MessageList messages={messages} variant="virtual" />
 * ```
 */
export function MessageList({
  messages,
  variant = 'auto',
  virtualized,  // Deprecated
  ...props
}: MessageListProps) {
  // Handle deprecated prop
  if (virtualized !== undefined) {
    console.warn(
      '[Clarity Chat] MessageList: `virtualized` prop is deprecated. ' +
      'Use `variant="virtual"` instead.'
    )
    variant = virtualized ? 'virtual' : 'basic'
  }

  // Auto-select variant
  const actualVariant = variant === 'auto'
    ? messages.length >= 50 ? 'virtual' : 'basic'
    : variant

  switch (actualVariant) {
    case 'basic':
      return <MessageListBasic messages={messages} {...props} />
    case 'virtual':
      return <MessageListVirtual messages={messages} {...props} />
  }
}

// Internal components (not exported)
function MessageListBasic(props) { ... }
function MessageListVirtual(props) { ... }

// Named exports for explicit control
export {
  MessageList,
  MessageListBasic,
  MessageListVirtual,
}
````

**Migration Guide**:

````typescript
// packages/react/MIGRATION.md

## MessageList Consolidation

### Before (v2.x)
```tsx
import {
  MessageList,              // Was VirtualizedMessageList
  TanStackMessageList,      // Implementation detail exposed
  AutoTanStackMessageList,  // Confusing auto mode
} from '@clarity-chat/react'

// Confusing: which one to use?
<MessageList messages={messages} />
<TanStackMessageList messages={messages} />
````

### After (v3.x)

```tsx
import { MessageList } from '@clarity-chat/react'

// Auto-selects best implementation (recommended)
<MessageList messages={messages} />

// Explicit control if needed
<MessageList messages={messages} variant="basic" />
<MessageList messages={messages} variant="virtual" />
```

````

---

#### Task 2.4: Remove Implementation Details from Component Names
**Files**: Multiple component files
**Effort**: 3 hours

**Changes**:
```typescript
// packages/react/src/public-api.ts

// BEFORE:
export { TanStackMessageList }      // ❌ Implementation detail
export { VirtualizedMessageList }   // ❌ Implementation detail

// AFTER:
export { MessageListVirtual }       // ✅ Describes behavior
// TanStackMessageList not exported  // ✅ Internal
````

---

### Day 10: Subpath Exports

#### Task 2.5: Add Granular Subpath Exports

**File**: `packages/react/package.json` **Effort**: 4 hours (including build config)

```json
// packages/react/package.json
{
  "exports": {
    ".": "./dist/index.js",

    // NEW: Granular exports
    "./hooks": {
      "types": "./dist/hooks/index.d.ts",
      "import": "./dist/hooks/index.js",
      "require": "./dist/hooks/index.cjs"
    },
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.js",
      "require": "./dist/components/index.cjs"
    },
    "./types": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/types/index.js",
      "require": "./dist/types/index.cjs"
    },

    // Existing exports
    "./core": "./dist/core.js",
    "./memory": "./dist/memory/index.js"
    // ...
  }
}
```

**New Entry Files**:

```typescript
// packages/react/src/hooks/index.ts (new file)
export * from './chat/use-clarity-chat'
export * from './chat/use-chat-enhanced'
export * from './token/use-token-count'
// ... all hooks

// packages/react/src/components/index.ts (new file)
export * from './chat/ClarityChat'
export * from './chat/ChatWindow'
export * from './message/MessageList'
// ... all components

// packages/react/src/types/index.ts (new file)
export type * from './chat-types'
export type * from './clarity-chat-types'
// ... all types
```

**Build Config** (`tsup.config.ts`):

```typescript
export default defineConfig([
  // Main entry
  {
    entry: ['src/public-api.ts'],
    outDir: 'dist',
    // ...
  },

  // NEW: Subpath entries
  {
    entry: ['src/hooks/index.ts'],
    outDir: 'dist/hooks',
    // ...
  },
  {
    entry: ['src/components/index.ts'],
    outDir: 'dist/components',
    // ...
  },
  {
    entry: ['src/types/index.ts'],
    outDir: 'dist/types',
    dts: { only: true }, // Types only
  },
])
```

---

## Week 3: Medium Priority (Score: 80 → 83)

### Day 11-12: Type System Improvements

#### Task 3.1: Standardize Type Naming Conventions

**Effort**: 4 hours

**Convention**:

- Component props: `[Component]Props`
- Hook options: `Use[Hook]Options`
- Hook returns: `Use[Hook]Return`
- Configuration: `[Feature]Config`
- Function options: `[Function]Options`
- Function results: `[Function]Result`

**Migration**:

```typescript
// Find and rename inconsistent types

// BEFORE:
TokenBudgetSettings // ❌ Should be TokenBudgetConfig
UseTokenCountResult // ❌ Should be UseTokenCountReturn

// AFTER:
TokenBudgetConfig // ✅
UseTokenCountReturn // ✅
```

**Codemod**:

```typescript
// scripts/codemods/standardize-type-names.ts
// (See TECHNICAL_APPENDIX.md section 7.3)
```

---

#### Task 3.2: Add Type-Only Entry Points

**Files**:

- `packages/react/package.json`
- `packages/token-optimization/package.json`

**Effort**: 2 hours

```json
// packages/react/package.json
{
  "exports": {
    "./types": {
      "types": "./dist/types.d.ts"
      // No runtime exports - types only
    }
  }
}
```

**Benefits**:

- Better tree-shaking
- Faster TypeScript compilation
- Clear separation of types and runtime

---

### Day 13-14: Documentation Improvements

#### Task 3.3: Complete JSDoc Coverage for Types

**File**: `packages/types/src/*.ts` **Effort**: 8 hours

**Target**: 90%+ coverage (currently ~30%)

**Process**:

1. Generate JSDoc skeletons with script
2. Fill in descriptions for each type
3. Add examples for complex types
4. Document enum values

**Example**:

````typescript
// BEFORE:
export interface ChatSession {
  id: string
  userId: string
  projectId?: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// AFTER:
/**
 * Represents a chat conversation session.
 *
 * Sessions group related messages and maintain conversation context.
 * Each session belongs to a user and optionally to a project.
 *
 * @example Creating a new session
 * ```typescript
 * const session: ChatSession = {
 *   id: generateSessionId(),
 *   userId: 'user_123',
 *   messages: [],
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface ChatSession {
  /**
   * Unique identifier for the session.
   * Format: `chat_[a-zA-Z0-9]{21}`
   */
  id: string

  /**
   * ID of the user who owns this session.
   * @see {@link User.id}
   */
  userId: string

  /**
   * Optional project this session belongs to.
   * When set, session context is scoped to project documents.
   * @see {@link Project.id}
   */
  projectId?: string

  /**
   * Messages in this conversation, ordered chronologically.
   * @see {@link Message}
   */
  messages: Message[]

  /**
   * Timestamp when the session was created.
   * Immutable after creation.
   */
  createdAt: Date

  /**
   * Timestamp of the last activity in this session.
   * Updated when messages are added or session is modified.
   */
  updatedAt: Date
}
````

---

#### Task 3.4: Create Migration Guide

**File**: `packages/react/MIGRATION.md` (new file) **Effort**: 4 hours

**Structure**:

```markdown
# Migration Guide

## v2.x → v3.0

### Hook Naming Changes

| Old Name                | New Name                 | Status                              |
| ----------------------- | ------------------------ | ----------------------------------- |
| `useHeadlessChat`       | `useChat`                | Deprecated in v2.5, removed in v3.0 |
| `useClarityChatApp`     | `useChatApp`             | Deprecated in v2.5, removed in v3.0 |
| `useTokenBudgetMonitor` | `useTokenBudgetTracking` | Deprecated in v2.5, removed in v3.0 |

### Component Changes

| Old Name                 | New Name             | Status          |
| ------------------------ | -------------------- | --------------- |
| `TanStackMessageList`    | `MessageListVirtual` | Removed in v3.0 |
| `VirtualizedMessageList` | `MessageList`        | Renamed in v3.0 |

### Type Changes

| Old Name              | New Name              | Status          |
| --------------------- | --------------------- | --------------- |
| `TokenBudgetSettings` | `TokenBudgetConfig`   | Renamed in v3.0 |
| `UseTokenCountResult` | `UseTokenCountReturn` | Renamed in v3.0 |

### Breaking Changes

1. **MessageList auto-selection**: Now automatically chooses virtualization
2. **Hook aliases removed**: Use new canonical names
3. **Type suffixes standardized**: See table above

### Automated Migration

Run the codemod to automatically migrate your code:

\`\`\`bash npx @clarity-chat/codemod migrate-v3 \`\`\`

### Manual Steps

1. Update imports for renamed hooks
2. Replace deprecated component names
3. Update type references
4. Test thoroughly

### Need Help?

- [Full migration guide](https://clarity-chat.dev/migration/v3)
- [Migration issues](https://github.com/clarity/issues/new?template=migration)
```

---

### Day 15: Code Quality

#### Task 3.5: Remove Internal Type Exports

**Files**: Multiple index.ts files **Effort**: 3 hours

**Process**:

1. Identify internal types (Debug, Internal, etc.)
2. Move to `./internal` export
3. Update imports
4. Verify no breaking changes

**Example**:

```typescript
// packages/token-optimization/src/index.ts

// BEFORE: Internal types exported publicly
export type {
  LLMLinguaDebugInfo,        // ❌ Internal
  MonitoringStats,           // ❌ Internal
}

// AFTER: Move to internal exports
// packages/token-optimization/src/internal.ts
export type {
  LLMLinguaDebugInfo,
  MonitoringStats,
}

// packages/token-optimization/package.json
{
  "exports": {
    "./internal": "./dist/internal.js"
  }
}
```

---

## Week 4: Polish & Verification (Score: 83 → 85+)

### Day 16-17: Bundle Optimization

#### Task 4.1: Set Bundle Size Budgets

**File**: `packages/react/package.json` **Effort**: 3 hours

```json
// packages/react/package.json
{
  "size-limit": [
    {
      "name": "Full bundle",
      "path": "dist/index.js",
      "limit": "450 KB"
    },
    {
      "name": "Core bundle",
      "path": "dist/core.js",
      "limit": "200 KB"
    },
    {
      "name": "Minimal bundle",
      "path": "dist/core-minimal.js",
      "limit": "150 KB"
    },
    {
      "name": "Slim bundle",
      "path": "dist/slim.js",
      "limit": "100 KB"
    },
    {
      "name": "Hooks only",
      "path": "dist/hooks/index.js",
      "limit": "50 KB"
    }
  ]
}
```

**CI Enforcement**:

```yaml
# .github/workflows/size-check.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3

      - run: pnpm install
      - run: pnpm build

      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

#### Task 4.2: Create Bundle Analyzer Dashboard

**File**: `packages/react/scripts/bundle-dashboard.html` (new) **Effort**: 4 hours

Interactive dashboard showing:

- Bundle sizes over time
- Comparison between variants
- Dependency breakdown
- Tree-shaking effectiveness

---

### Day 18-19: Testing & Verification

#### Task 4.3: Add API Surface Tests

**File**: `packages/react/__tests__/api-surface.test.ts` (new) **Effort**: 4 hours

```typescript
// Verify no accidental breaking changes

describe('Public API Surface', () => {
  it('exports expected hooks', () => {
    const { useClarityChat, useTokenCount } = require('@clarity-chat/react')
    expect(useClarityChat).toBeDefined()
    expect(useTokenCount).toBeDefined()
  })

  it('does not export internal types', () => {
    const publicAPI = require('@clarity-chat/react')
    expect(publicAPI.LLMLinguaDebugInfo).toBeUndefined()
  })

  it('deprecated exports show warnings', () => {
    const warn = jest.spyOn(console, 'warn')
    const { useHeadlessChat } = require('@clarity-chat/react')
    useHeadlessChat({ api: '/test' })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('deprecated'))
  })
})
```

---

#### Task 4.4: Run Full Test Suite

**Effort**: 2 hours

```bash
# Verify all changes
pnpm test

# Verify types
pnpm typecheck

# Verify builds
pnpm build

# Verify bundle sizes
pnpm size

# Verify documentation builds
pnpm docs:build
```

---

### Day 20: Documentation & Communication

#### Task 4.5: Update Documentation Site

**Files**: Various documentation files **Effort**: 4 hours

**Updates**:

1. Bundle size guide
2. Migration guide
3. API reference
4. Examples
5. Blog post announcing changes

---

#### Task 4.6: Communication Plan

**Effort**: 2 hours

**Channels**:

1. **Changelog**: Detailed migration guide
2. **Blog post**: Announcing improvements
3. **Twitter**: Highlights
4. **Discord**: Discussion thread
5. **Email**: Newsletter to users

**Message**:

```markdown
# Clarity Chat v3.0: Improved API Consistency

We've made significant improvements to API consistency and developer experience:

✅ Standardized hook naming (no more confusion!) ✅ Clearer component naming (no implementation
details) ✅ Better type coverage (90%+ JSDoc) ✅ Granular imports (better tree-shaking) ✅
Comprehensive migration guide

Migration is straightforward with our automated codemod:

\`\`\`bash npx @clarity-chat/codemod migrate-v3 \`\`\`

[Read the full migration guide →](https://clarity-chat.dev/migration/v3)
```

---

## Success Metrics

### Before (Current State)

- ❌ API Cohesion Score: **68/100**
- ❌ JSDoc Coverage: 55%
- ❌ Type Coverage: 80%
- ❌ Bundle Documentation: Poor
- ❌ Developer Confusion: High (duplicate APIs)

### After (Target State)

- ✅ API Cohesion Score: **85/100** (+17 points)
- ✅ JSDoc Coverage: 90% (+35%)
- ✅ Type Coverage: 95% (+15%)
- ✅ Bundle Documentation: Excellent
- ✅ Developer Confusion: Low (clear API)

---

## Risk Mitigation

### Breaking Changes Strategy

1. **Deprecate, don't remove** (keep for 1 major version)
2. **Runtime warnings** for deprecated APIs
3. **Automated codemod** for migration
4. **Comprehensive docs** for manual migration

### Rollback Plan

1. Keep old exports as aliases (deprecated)
2. Version all changes in git
3. Tag release candidates for testing
4. Beta release period before stable

### Testing Strategy

1. **Unit tests**: All new/changed exports
2. **Integration tests**: Real-world usage scenarios
3. **Type tests**: TypeScript compilation
4. **Bundle tests**: Size limits enforced
5. **E2E tests**: Full application flows

---

## Timeline Summary

| Week   | Focus           | Key Deliverables                                | Score Impact |
| ------ | --------------- | ----------------------------------------------- | ------------ |
| Week 1 | Critical Fixes  | Bundle docs, hook deprecations, JSDoc top 20    | 68 → 75      |
| Week 2 | High Priority   | Type exports, component consolidation, subpaths | 75 → 80      |
| Week 3 | Medium Priority | Type standardization, docs, internal cleanup    | 80 → 83      |
| Week 4 | Polish          | Bundle budgets, tests, communication            | 83 → 85+     |

**Total**: 4 weeks to reach 85/100 target

---

## Appendix: Quick Reference

### Files to Modify

**Week 1**:

- `packages/types/package.json`
- `packages/react/README.md`
- `packages/react/src/public-api.ts`
- `packages/token-optimization/src/hooks/index.ts`
- Top 20 component/hook files

**Week 2**:

- `packages/react/src/app-api/index.ts`
- `packages/react/src/components/message/MessageList.tsx`
- `packages/react/package.json` (add subpaths)
- `packages/react/tsup.config.ts` (build config)

**Week 3**:

- All type definition files
- `packages/react/MIGRATION.md` (new)
- Internal export files

**Week 4**:

- `packages/react/package.json` (size limits)
- `.github/workflows/size-check.yml` (new)
- Documentation files
- Test files

---

## Next Steps

1. **Review this plan** with team
2. **Assign tasks** to developers
3. **Create GitHub issues** for tracking
4. **Set up project board** for visibility
5. **Schedule kickoff** meeting
6. **Begin Week 1** tasks

---

**Document Status**: Ready for Review **Last Updated**: 2026-01-27 **Related Docs**:

- API_COHESION_AUDIT.md (main report)
- API_COHESION_TECHNICAL_APPENDIX.md (technical details)
