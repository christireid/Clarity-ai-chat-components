# MASTER_CONTEXT.md
# Clarity Chat Codebase Reorganization - Master Context

**Created**: 2026-01-27
**Last Updated**: 2026-01-27
**Current Phase**: Phase 2 - Dead Code Cleanup (In Progress)

---

## A) Current State Inventory

### Package Map (Before)
| Package | Purpose | TS Files | Exports | Key Dependencies | Status |
|---------|---------|----------|---------|------------------|--------|
| @clarity-chat/react | Main components/hooks | 1250 | 6322 | isomorphic-dompurify, react-resizable-panels, react-window, sonner | **MASSIVE** |
| @clarity-chat/primitives | shadcn/ui base | 127 | 437 | class-variance-authority, framer-motion, lucide-react, cmdk | Medium |
| @clarity-chat/memory | Memory system | 88 | 294 | (minimal external) | Medium |
| @clarity-chat/types | Shared types | 17 | 134 | (none) | Small |
| @clarity-chat/error-handling | Error mgmt | 201 | 273 | react-error-boundary | Medium |
| @clarity-chat/dev-tools | Dev utilities | 148 | 351 | boxen, chalk, commander | Medium |
| @clarity-chat/token-optimization | Token features | 708 | 835 | TBD | **LARGE** |
| @clarity-chat/utils | Utilities | 57 | 310 | TBD | Medium |
| @clarity-chat/cli | CLI tool | 83 | 246 | TBD | Medium |
| @clarity-chat/ai-infrastructure | AI infra | 4 | 24 | TBD | Tiny |
| @clarity-chat/codemods | Code transforms | 24 | 24 | TBD | Small |
| @clarity-chat/license | Licensing | 22 | 78 | TBD | Small |
| @clarity-chat/playground | Dev playground | 45 | 125 | TBD | Small |
| @clarity-chat/testing-utils | Test helpers | 10 | 54 | TBD | Tiny |
| @clarity-chat/typescript-config | TS configs | 0 | 0 | N/A | Config only |

**Total**: 15 packages, **~2,784 TypeScript files**, **~771,706 lines of code**

### Dead File Candidates
| Path | Age | Last Modified | Reason | Action |
|------|-----|---------------|--------|--------|
| ./.cleanup-results/* | >4 days | Various | Task/temp files from previous cleanups | DELETE |
| ./tools/generators/templates/*.hbs | Old | Various | Template files (>4 days old) | REVIEW |
| ./.archive/.api-dx-audit/* | >4 days | Various | Archived audit documentation | DELETE |
| ./.archive/.archive-audit-docs/* | >4 days | Various | Archived documentation | DELETE |
| ./.archive/.react-imports-backup-* | >4 days | 2026-01-26 | Backup from previous migration | DELETE |
| Various .md files (WAVE_*, SESSION_*, etc.) | >4 days | Recent | Task tracking files at root | DELETE |

**Findings**:
- Found 40+ markdown files at repo root that are task/wave tracking files
- .cleanup-results directory with session artifacts
- .archive directory with old audit docs and backups
- Template files in .pnpm-store should not be deleted (ignored)

### Duplication Map

#### Duplicate Functions (Top Occurrences)
| Function/Const | Count | Likely Locations | Action Needed |
|----------------|-------|------------------|---------------|
| ChatApp | 5 | react, cli, playground | Consolidate to core |
| getContrastRatio | 4 | primitives, react/theme | Keep in primitives |
| estimateTokens | 4 | react, token-optimization | Keep in token-optimization |
| debounce<T> | 4 | utils, react/utils, memory/utils | Keep in utils |
| throttle<T> | 3 | utils, react/utils | Keep in utils |
| warn | 3 | Various packages | Consolidate to utils |
| normalizeError | 3 | error-handling, react, utils | Keep in error-handling |
| handleError | 3 | error-handling, react | Keep in error-handling |
| estimateCost | 3 | token-optimization, react | Keep in token-optimization |
| createUserMessage | 3 | types, react, memory | Keep in types |
| createAssistantMessage | 3 | types, react, memory | Keep in types |
| deepMerge<T> | 3 | utils, react/utils | Keep in utils |

#### Duplicate Type Definitions
| Type/Interface | Count | Likely Locations | Action Needed |
|----------------|-------|------------------|---------------|
| CompressionResult | 11 | token-optimization, memory | Consolidate to types |
| ValidationResult | 9 | Various packages | Consolidate to types |
| CacheStats | 9 | token-optimization, memory | Consolidate to types |
| CompressionStrategy | 6 | token-optimization | Keep in token-optimization |
| TokenOptimizationConfig | 5 | token-optimization, react | Keep in token-optimization |
| ModelPricing | 5 | token-optimization | Keep in token-optimization |
| MemoryStats | 5 | memory | Keep in memory |
| MemoryItem | 5 | memory | Keep in memory |
| ChatMessage | 5 | types, react, memory | Keep in types |
| TokenUsage | 4 | token-optimization, types | Consolidate to types |
| SecurityConfig | 4 | Various | Consolidate to types |
| RetryOptions | 4 | Various | Consolidate to types |
| PerformanceMetrics | 4 | Various | Consolidate to types |

#### Utility Files Duplication
Found utility/helper files in:
- `packages/utils/src/errors/utils.ts`
- `packages/primitives/src/lib/utils.ts`
- `packages/primitives/src/lib/enterprise-utils.ts`
- `packages/react/src/utils/*.ts` (multiple utility files)
- `packages/react/src/internal/helpers.ts`
- `packages/react/src/test-utils/ai-test-helpers.ts`
- `packages/dev-tools/src/test/helpers.ts`
- `packages/memory/src/__tests__/helpers/gdpr-test-helpers.ts`

**CRITICAL**: Many utilities duplicated across packages/react/src/utils and packages/utils

---

## A.1) Critical Implications & Decisions Needed

### Scope Expansion Required
**Original Plan**: Consolidate 6 packages (react, primitives, memory, types, error-handling, dev-tools)
**Reality**: 15 packages exist, with additional complexity:
- Should token-optimization be its own subpath or merged?
- Should utils be separate or merged?
- What to do with cli, codemods, license, playground, testing-utils?

### Consolidation Strategy Options

**Option A: Conservative (Single Core)**
Merge only the originally planned 6 packages into @clarity-chat/core:
- core/components (from react)
- core/hooks (from react)
- core/primitives (from primitives)
- core/memory (from memory)
- core/types (from types)
- core/errors (from error-handling)

Keep separate:
- @clarity-chat/token-optimization
- @clarity-chat/utils
- @clarity-chat/cli (dev tool)
- @clarity-chat/dev-tools (dev tool)
- @clarity-chat/codemods (dev tool)
- Others

**Option B: Aggressive (Everything Core)**
Merge ALL library packages into @clarity-chat/core:
- core/components
- core/hooks
- core/token-optimization ← NEW
- core/primitives
- core/memory
- core/types
- core/errors
- core/utils ← NEW

Keep separate only:
- @clarity-chat/cli (separate tool)
- @clarity-chat/dev-tools (dev-only)
- @clarity-chat/codemods (migration tool)

**Option C: Dual Package (Core + Token)**
- @clarity-chat/core (components, hooks, primitives, memory, types, errors, utils)
- @clarity-chat/token-optimization (keep separate, 708 files)
- Tool packages separate

### Recommendation
**Option B (Aggressive)** - Reasoning:
1. Token optimization is a core feature, not optional
2. Utils should be unified (already duplicated heavily)
3. Simplifies consumer mental model: "one package for app features"
4. Tree-shaking ensures users only bundle what they import
5. Easier to manage dependencies internally

**Trade-off**: Larger initial download, but tree-shaking mitigates this.

---

## B) Target State Design

### New Package Structure (Option B - Recommended)
```
@clarity-chat/core
├── /components              # From packages/react/src/components
│   ├── /ai                 # AI components
│   ├── /conversation       # Conversation management
│   ├── /input              # Input components
│   ├── /message            # Message display
│   ├── /search             # Search components
│   ├── /ui                 # Base UI components
│   ├── ClarityChat.tsx
│   ├── ChatWindow.tsx
│   └── ...
├── /hooks                   # From packages/react/src/hooks
│   ├── /use-clarity-chat   # Core chat hook
│   ├── /clarity-tokens     # Token hooks
│   ├── useClarityChat.ts
│   ├── useStreamingSSE.ts
│   ├── useStreamingWebSocket.ts
│   └── ...
├── /token-optimization      # From packages/token-optimization/src
│   ├── /engines
│   ├── /strategies
│   ├── useTokenBudgetMonitor.ts
│   ├── buildKVCacheOptimizedPrompt.ts
│   ├── semanticCache.ts
│   └── ...
├── /memory                  # From packages/memory/src
│   ├── MemoryProvider.tsx
│   ├── MemoryService.ts
│   ├── strategies/
│   └── ...
├── /primitives              # From packages/primitives/src
│   ├── /ui                 # shadcn/ui components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── /utils                   # From packages/utils/src + packages/react/src/utils
│   ├── /timing             # debounce, throttle
│   ├── /object             # deepMerge, deepClone
│   ├── /string             # string utilities
│   ├── /array              # array utilities
│   ├── /async              # async utilities
│   ├── /dom                # DOM utilities
│   ├── /react              # React-specific utilities
│   └── ...
├── /types                   # From packages/types/src + consolidated duplicates
│   ├── chat-types.ts
│   ├── messages.ts
│   ├── tool-types.ts
│   ├── config-types.ts
│   └── ...
└── /errors                  # From packages/error-handling/src
    ├── ErrorBoundary.tsx
    ├── error-handlers.ts
    ├── hooks/
    └── ...

Separate Packages (Dev Tools):
- @clarity-chat/cli          # CLI tool for scaffolding
- @clarity-chat/dev-tools    # Developer tooling
- @clarity-chat/codemods     # Migration codemods
- @clarity-chat/testing-utils # Test helpers
- @clarity-chat/playground   # Development playground
```

### Import Examples (Target)
```typescript
// Top-level (everything)
import { ClarityChat, useClarityChat } from '@clarity-chat/core'

// Subpath (specific)
import { useStreamingSSE } from '@clarity-chat/core/hooks'
import { useTokenBudgetMonitor } from '@clarity-chat/core/token-optimization'
import { MemoryProvider } from '@clarity-chat/core/memory'
import { Button } from '@clarity-chat/core/primitives'
```

---

## C) Phase Execution Log

### Phase 0: Discovery ✅ COMPLETE
- [COMPLETE] Repository scan
- [COMPLETE] Duplication detection
- [COMPLETE] Dead code detection
- [COMPLETE] Test status verification
- **Status**: ✅ Gate passed, Option B approved

### Phase 1: Research & Architecture Design ✅ COMPLETE
- [COMPLETE] Research modern monorepo patterns
- [COMPLETE] Study reference implementations
- [COMPLETE] Design target architecture
- [COMPLETE] Create detailed specifications
- **Status**: ✅ Gate passed, ready for Phase 2
- **Documents**: PHASE_1_RESEARCH_FINDINGS.md, PHASE_1_ARCHITECTURE_DESIGN.md

**Key Findings**:

1. **Package Complexity**:
   - 15 packages instead of expected 6-7
   - @clarity-chat/react is MASSIVE (1250 TS files, 6322 exports)
   - @clarity-chat/token-optimization is its own large package (708 files, 835 exports)
   - Total codebase: ~771K lines of TypeScript across 2,784 files

2. **Duplication Severity**:
   - HIGH: 12+ duplicate utility functions across packages
   - HIGH: 13+ duplicate type definitions
   - CRITICAL: Utilities split between packages/utils and packages/react/src/utils
   - Functions like debounce, throttle, deepMerge exist in 3-4 places
   - Types like CompressionResult, ValidationResult duplicated 9-11 times

3. **Dead Files**:
   - 40+ markdown task/wave tracking files at root (>4 days old)
   - .cleanup-results/ directory with session artifacts
   - .archive/ directory with old audit docs and import backups
   - Various WAVE_*.md, SESSION_*.md files to be deleted

4. **Unexpected Packages** (not in original plan):
   - @clarity-chat/token-optimization (large, 708 files)
   - @clarity-chat/utils (medium, 57 files)
   - @clarity-chat/cli (medium, 83 files)
   - @clarity-chat/ai-infrastructure (tiny, 4 files)
   - @clarity-chat/codemods (small, 24 files)
   - @clarity-chat/license (small, 22 files)
   - @clarity-chat/playground (small, 45 files)
   - @clarity-chat/testing-utils (tiny, 10 files)

5. **Hooks Inventory**:
   - 100+ custom hooks across packages
   - Many hooks in dev-tools, error-handling, and react packages
   - Potential consolidation into core/hooks needed

### Phase 2: Dead Code Cleanup 🔄 IN PROGRESS
- [COMPLETE] Phase 2.1: Remove task/temp files
  - ✅ Deleted 42 markdown files (WAVE_*, SESSION_*, AGENT_*, VERIFICATION_* patterns)
  - ✅ Removed .cleanup-results/ directory (108KB)
  - ✅ Removed .archive/ directory (13MB)
  - ✅ Freed ~13MB of disk space
- [PENDING] Phase 2.2: Remove orphan files
- [PENDING] Phase 2.3: Remove legacy/deprecated code
- **Status**: 🔄 Gate in progress

---

## D) Decision Log
| Decision | Date | Rationale | Alternatives Considered | Owner |
|----------|------|-----------|------------------------|-------|
| (None yet) | - | - | - | - |

---

## E) Risk Register
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Breaking changes to consumer code | High | High | Backward compat layer + migration guide | All |
| Test failures during consolidation | Medium | High | Run tests after each change | Test Guardian |
| Import path errors | High | Medium | Automated migration script | Migration Engineer |
| Bundle size increase | Low | Medium | Tree-shaking verification | Build Optimizer |

---

## F) Task Backlog (Prioritized)
(To be populated after discovery phase...)

---

## Discovery Progress
- [ ] Phase 0.1: Repository Scan
- [ ] Phase 0.2: Duplication Detection
- [ ] Phase 0.3: Dead Code Detection
- [ ] Gate: Complete Inventory Review
