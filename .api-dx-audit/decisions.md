# Canonical API & Architecture Decisions

**Date**: 2026-01-24
**Phase**: 2 - Strategic Decisions
**Status**: Ready for consolidation execution

---

## 1. Minimal Packages Strategy

### Keep (Core 8 Packages)

**Essential packages that provide clear, non-overlapping value:**

1. **@clarity-chat/react** - Main UI components and hooks (KEEP)
   - **Why**: Primary product surface, React 18+ components
   - **Dependencies**: primitives, types, utils, memory

2. **@clarity-chat/primitives** - Base UI primitives and utilities (KEEP)
   - **Why**: Shared UI utilities (cn, variants, etc.)
   - **Dependencies**: None (foundation layer)

3. **@clarity-chat/types** - TypeScript definitions (KEEP)
   - **Why**: Shared type contracts across all packages
   - **Dependencies**: None (foundation layer)

4. **@clarity-chat/utils** - Unified utilities (KEEP)
   - **Why**: Canonical utilities - format, cache, logger, async, validation, env
   - **Dependencies**: types only

5. **@clarity-chat/memory** - Memory management system (KEEP)
   - **Why**: Core feature - conversation memory, context management
   - **Dependencies**: utils, types

6. **@clarity-chat/token-optimization** - Token counting and optimization (KEEP)
   - **Why**: Essential for AI cost management
   - **Dependencies**: utils, types

7. **@clarity-chat/error-handling** - Error management (KEEP)
   - **Why**: Unified error hierarchy and handling
   - **Dependencies**: utils, types

8. **@clarity-chat/license** - License validation (KEEP)
   - **Why**: Required for paid product protection
   - **Dependencies**: utils, types

### Merge (5 Packages → Consolidate)

9. **@clarity-chat/dev-tools** → **MERGE into @clarity-chat/react/dev-tools**
   - **Reason**: React-specific dev tools, small surface area
   - **Action**: Move to `packages/react/src/dev-tools/`
   - **Breaking Change**: Import path changes from `@clarity-chat/dev-tools` to `@clarity-chat/react/dev-tools`

10. **@clarity-chat/testing-utils** → **MERGE into @clarity-chat/react/test-utils**
    - **Reason**: React testing utilities, already has test-utils entry
    - **Action**: Consolidate with existing test-utils
    - **Breaking Change**: Import path changes

11. **@clarity-chat/errors** → **MERGE into @clarity-chat/error-handling**
    - **Reason**: Duplicate error packages causing confusion
    - **Action**: Merge all error types into error-handling
    - **Breaking Change**: Deprecate @clarity-chat/errors package

12. **@clarity-chat/shared-utils** → **MERGE into @clarity-chat/utils**
    - **Reason**: Already have utils package, duplication
    - **Action**: Move unique utilities to utils package
    - **Breaking Change**: Update imports to @clarity-chat/utils

13. **@clarity-chat/typescript-config** → **KEEP at workspace root only**
    - **Reason**: Build config, not a published package
    - **Action**: Keep as devDependency only
    - **Breaking Change**: Remove from published packages

### Delete (5 Packages → Remove)

14. **@clarity-chat/ai-infrastructure** → **DELETE**
    - **Reason**: Vague purpose, overlaps with react package
    - **Action**: Migrate unique features to react, delete package

15. **@clarity-chat/licensing** → **MERGE into @clarity-chat/license**
    - **Reason**: Duplicate of license package
    - **Action**: Keep only @clarity-chat/license

16. **@clarity-chat/cli** → **DELETE or External Tool**
    - **Reason**: CLI separate from React component library
    - **Action**: Move to separate repository or delete

17. **@clarity-chat/codemods** → **DELETE or External Tool**
    - **Reason**: Migration tool, not core product
    - **Action**: Keep in repo but don't publish

18. **@clarity-chat/playground** → **KEEP as App (not package)**
    - **Reason**: Development tool, not published package
    - **Action**: Move to apps/playground

### Final Package Count: 8 Core Packages

**Before**: 18 packages
**After**: 8 packages
**Reduction**: 56% fewer packages

---

## 2. Canonical API Decisions

### 2.1 Chat Hooks - ONE CANONICAL IMPLEMENTATION

**DUPLICATE CRISIS**: 4+ chat hook implementations found

#### Keep: `useClarityChat` (from app-api/)
**Location**: `packages/react/src/app-api/use-clarity-chat-app.ts`
**Why**: Most complete, supports all features
**Features**:
- Token engine integration
- Memory engine integration
- RAG engine integration
- Full lifecycle management

#### Deprecate & Redirect:
- ❌ `useClarityChatApp` → Rename to `useClarityChat`
- ❌ `useChat` → Redirect to `useClarityChat`
- ❌ `useChatEnhanced` → Delete
- ❌ `useChatV2` → Delete
- ❌ `useChatExperimental` → Delete

**Migration Path**:
```typescript
// OLD (deprecated)
import { useChat } from '@clarity-chat/react'
const { messages, sendMessage } = useChat(config)

// NEW (canonical)
import { useClarityChat } from '@clarity-chat/react'
const chat = useClarityChat(config)
const { messages, sendMessage } = chat
```

---

### 2.2 Markdown Rendering - ONE CANONICAL IMPLEMENTATION

**DUPLICATE CRISIS**: 3 markdown renderers found

#### Keep: `EnhancedMarkdownRenderer`
**Location**: `packages/react/src/components/ai/enhanced-markdown-renderer.tsx`
**Why**: Full-featured, React 18 compliant, performance optimized
**Features**:
- Syntax highlighting (highlight.js)
- Math rendering (KaTeX)
- Mermaid diagrams
- GitHub Flavored Markdown
- Code copy buttons
- Performance tracking

#### Delete:
- ❌ `MarkdownRenderer` (old basic version)
- ❌ `MarkdownRendererV2`
- ❌ Any other markdown component variants

**Migration Path**:
```typescript
// OLD
import { MarkdownRenderer } from '@clarity-chat/react'

// NEW
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'
```

---

### 2.3 Error Boundaries - ONE CANONICAL IMPLEMENTATION

#### Keep: `ContentErrorBoundary` (React 18 native)
**Location**: `packages/react/src/components/ui/error-boundary.tsx`
**Why**: Uses React 18 error boundaries, proper typing
**Features**:
- getDerivedStateFromError
- componentDidCatch
- Fallback UI
- Error reporting

#### Delete:
- ❌ `ChatErrorBoundary` (duplicate in error-handling)
- ❌ `EnhancedErrorBoundary` (dev-tools, has type issues)
- ❌ `DashboardErrorBoundary` (over-specialized)

**Consolidation**: Move all error boundary logic to react/components/ui/error-boundary.tsx

---

### 2.4 Performance Utilities - FULLY CONSOLIDATED

#### Canonical: `@clarity-chat/utils/performance-unified`
**Location**: `packages/utils/src/performance-unified.ts`
**Why**: Complete consolidation already done
**Features**:
- Performance timing
- Memory tracking
- FPS monitoring
- Throttle/debounce
- Virtual scrolling
- Web Vitals

#### React Hooks: `packages/react/src/hooks/performance/`
**Location**: React-specific wrappers
**Exports**:
- `usePerformanceTracking` - Component perf tracking
- `usePerformanceMonitoring` - FPS/memory monitoring

#### Delete:
- ❌ All other performance utilities scattered across packages
- ❌ `performance-monitoring.tsx` (already deleted)
- ❌ `performance-profiler.ts`

---

### 2.5 Retry/Backoff Logic - ONE CANONICAL IMPLEMENTATION

**DUPLICATE CRISIS**: Found in 5+ locations

#### Canonical: `@clarity-chat/utils/async`
**Location**: `packages/utils/src/async/index.ts`
**Function**: `retry<T>(fn, options)`
**Features**:
- Exponential backoff
- Jitter
- Max retries
- Custom delays

#### Delete Duplicates In:
- ❌ `packages/react/src/utils/resilience/retry-with-backoff.ts`
- ❌ `packages/react/src/utils/streaming/streaming-helpers.ts`
- ❌ `packages/memory/src/utils/retry.ts`
- ❌ Any other retry implementations

**Action**: Replace all with imports from `@clarity-chat/utils/async`

---

### 2.6 Validation - ONE CANONICAL IMPLEMENTATION

#### Canonical: `@clarity-chat/utils/validation`
**Location**: `packages/utils/src/validation/index.ts`
**Why**: Most complete, includes Zod integration
**Features**:
- Schema validation (Zod)
- Type guards
- Email/URL validation
- Object validation
- Array validation

#### Delete Duplicates:
- ❌ `packages/react/src/utils/validation/`
- ❌ `packages/memory/src/utils/validation-helpers.ts`
- ❌ `packages/error-handling/src/utils/validation.ts`

---

### 2.7 Logger - ONE CANONICAL IMPLEMENTATION

#### Canonical: `@clarity-chat/utils/logger`
**Location**: `packages/utils/src/logger/index.ts`
**Why**: Winston-based, production-ready
**Features**:
- Multiple transports
- Log levels
- Structured logging
- Environment detection

#### Delete Duplicates:
- ❌ All package-specific loggers
- ❌ `packages/memory/src/utils/logger.ts` (uses canonical)
- ❌ `packages/react/src/utils/logger.ts`

---

### 2.8 Streaming Utilities - CONSOLIDATE

#### Keep: React streaming hooks
**Location**: `packages/react/src/hooks/streaming/`
**Exports**:
- `useStreamingResponse`
- `useStreamProcessor`

#### Canonical Utils: `@clarity-chat/utils/async`
**Location**: Add streaming utilities to async module
**Action**: Move non-React streaming logic to utils

---

### 2.9 Search Components - REFACTORED ARCHITECTURE

**Status**: Already refactored into modular structure ✅

#### Canonical: `AdvancedMessageSearch`
**Location**: `packages/react/src/components/search/advanced-message-search.tsx`
**Structure**:
- Shared types: `types.ts`
- Shared components: `components/`
- Shared hooks: `hooks/`
- Semantic search: `semantic/`

#### Delete:
- ❌ Old search variants
- ❌ Duplicate search components

---

### 2.10 Webhook Management - ONE CANONICAL IMPLEMENTATION

**SECURITY CRITICAL**: Insecure backup files found

#### Canonical: `packages/react/src/webhooks/webhook-manager.ts`
**Why**: Secure, validated implementation

#### IMMEDIATE DELETE:
- ❌ `webhook-manager-insecure-backup.ts` (SECURITY RISK)
- ❌ `webhook-manager-old-backup.ts`
- ❌ `webhook-manager-enhanced.ts`

**Action**: Already consolidated, delete backups immediately

---

## 3. Directory Structure - CANONICAL ORGANIZATION

### 3.1 React Package Structure (Current: 50 dirs, Target: 12 dirs)

**Current State**: 2/10 coherence score, 50+ directories

#### Canonical Structure:
```
packages/react/src/
├── app-api/              # App initialization (useClarityChat)
├── components/           # All UI components
│   ├── ai/              # AI-specific (markdown, citations)
│   ├── chat/            # Chat UI (messages, input)
│   ├── code/            # Code blocks, syntax highlighting
│   ├── dashboards/      # Dashboard components
│   ├── enterprise/      # Enterprise features
│   ├── input/           # Input components
│   ├── message/         # Message components
│   ├── search/          # Search components
│   ├── theme-components/# Theme customization
│   └── ui/              # Base UI primitives
├── hooks/               # All React hooks
│   ├── chat/           # Chat hooks
│   ├── keyboard/       # Keyboard navigation
│   ├── performance/    # Performance monitoring
│   └── streaming/      # Streaming hooks
├── adapters/            # External service adapters
├── animations/          # Animation utilities
├── analytics/           # Analytics integration
├── core/               # Core business logic
├── memory/             # Memory integration
├── prompt/             # Prompt engineering
├── utils/              # React-specific utilities
├── webhooks/           # Webhook management
├── dev-tools/          # Development tools (merged from dev-tools package)
├── test-utils/         # Testing utilities (merged from testing-utils package)
├── public-api.ts       # Main barrel export
├── core.ts             # Core minimal bundle
├── core-minimal.ts     # Ultra-light bundle
└── slim.ts             # Minimal bundle

Total: 12 top-level directories
```

#### Files to Move/Consolidate:
- Move dev-tools package → `src/dev-tools/`
- Move testing-utils → `src/test-utils/`
- Delete `src/examples/` (move to apps/playground)

---

### 3.2 Utils Package Structure

**Current**: Good structure, maintain as-is ✅

```
packages/utils/src/
├── format/             # Formatting utilities
├── cache/              # Caching utilities
├── logger/             # Logging
├── progress/           # Progress bars
├── errors/             # Error utilities
├── async/              # Async/retry/backoff
├── validation/         # Validation
├── math/               # Math utilities
├── env/                # Environment detection ✅ (fixed)
└── performance-unified.ts  # Performance utilities
```

**Action**: Keep as-is, add streaming utilities to async/

---

### 3.3 Memory Package Structure

**Current**: Good structure, maintain ✅

```
packages/memory/src/
├── memory-service/     # Core service (split)
│   ├── base.ts
│   ├── sync.ts
│   └── async.ts
├── types/              # Type definitions
├── audit/              # GDPR audit
├── consent/            # GDPR consent
├── react/              # React hooks
└── utils/              # Memory-specific utilities
```

**Action**: Keep structure, ensure GDPR compliance tests pass

---

## 4. Frontend Packaging Strategy

### 4.1 CSS Export - CRITICAL FIX REQUIRED

#### Issue: CSS not in dist/
**Affected**:
- `packages/react/package.json` exports `./styles.css` → `./dist/styles/index.css`
- `packages/dev-tools/package.json` exports point to `src/` instead of `dist/`

#### Solution:
1. **React Package**:
   - tsup.config.ts already has `loader: { '.css': 'copy' }`
   - **Fix**: Ensure CSS files copy to dist/styles/
   - **Verify**: Check `dist/styles/index.css` exists after build

2. **Dev-Tools Package** (after merge):
   - Update exports to point to dist/
   - OR merge into react and use react's CSS

#### CSS Packaging Standards:
```json
{
  "exports": {
    "./styles.css": {
      "import": "./dist/styles/index.css",
      "require": "./dist/styles/index.css"
    }
  },
  "sideEffects": [
    "dist/styles/**/*.css"
  ]
}
```

---

### 4.2 SSR Boundaries - "use client" Directives

#### Issue: 12 components missing "use client"

#### Components Requiring Directive:
1. `packages/memory/src/react/use-memory.ts`
2. `packages/react/src/hooks/chat/*`
3. `packages/react/src/hooks/streaming/*`
4. `packages/react/src/hooks/performance/*`
5. All components using useState/useEffect/useCallback

#### Solution:
- Add `'use client'` to top of every React hook/component using:
  - useState
  - useEffect
  - useCallback
  - useMemo
  - useRef
  - Browser APIs (window, document)

#### Verification:
```typescript
// ✅ Correct pattern
'use client'

import { useState } from 'react'

export function useMyHook() {
  const [state, setState] = useState()
  // ...
}
```

---

### 4.3 Peer Dependencies - STANDARDIZE

#### Issue: Inconsistent React versions, workspace:* in peerDeps

#### Standard Peer Dependencies:
```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": false },
    "react-dom": { "optional": false }
  }
}
```

#### Action:
- Update all packages to use exact peer dependency format
- Remove `workspace:*` from peerDependencies
- Add to dependencies instead if needed

---

### 4.4 Tree-Shaking - OPTIMIZE

#### Issue: Missing sideEffects, barrel exports

#### Solutions:
1. **Add sideEffects field**:
```json
{
  "sideEffects": [
    "**/*.css",
    "dist/styles/**/*"
  ]
}
```

2. **Optimize Barrel Exports**:
   - Current: `public-api.ts` exports 114+ items
   - Target: Add subpath exports for major features

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./chat": "./dist/chat/index.js",
    "./components": "./dist/components/index.js",
    "./hooks": "./dist/hooks/index.js",
    "./core": "./dist/core.js",
    "./core-minimal": "./dist/core-minimal.js"
  }
}
```

---

### 4.5 Bundle Sizes - TARGETS

#### Current:
- Main bundle: ~400KB
- Too large for edge functions

#### Targets:
- `@clarity-chat/react/core-minimal`: ≤30KB
- `@clarity-chat/react/core`: ≤100KB
- `@clarity-chat/react` (full): ≤200KB
- Each component: ≤10KB individually importable

#### Actions:
- Implement code splitting
- Lazy load heavy features (mermaid, katex)
- Tree-shake unused code
- Minify production builds

---

## 5. Migration Plan - v2.0 Breaking Changes

### 5.1 Package Consolidation

**Timeline**: v2.0 (Major version bump required)

#### Breaking Changes:
1. **dev-tools** → `@clarity-chat/react/dev-tools`
2. **testing-utils** → `@clarity-chat/react/test-utils`
3. **errors** → `@clarity-chat/error-handling`
4. **shared-utils** → `@clarity-chat/utils`
5. **ai-infrastructure** → DELETED (features moved to react)
6. **licensing** → `@clarity-chat/license`

#### Migration Codemod:
```bash
npx @clarity-chat/codemods v2-migration
```

**Automated Replacements**:
- `@clarity-chat/dev-tools` → `@clarity-chat/react/dev-tools`
- `@clarity-chat/testing-utils` → `@clarity-chat/react/test-utils`
- `@clarity-chat/errors` → `@clarity-chat/error-handling`

---

### 5.2 API Consolidation

#### Chat Hook Migration:
```typescript
// Before v2.0
import { useChat, useChatEnhanced, useClarityChatApp } from '@clarity-chat/react'

// After v2.0
import { useClarityChat } from '@clarity-chat/react'
```

#### Markdown Renderer:
```typescript
// Before v2.0
import { MarkdownRenderer } from '@clarity-chat/react'

// After v2.0
import { EnhancedMarkdownRenderer as MarkdownRenderer } from '@clarity-chat/react'
```

#### Performance Utils:
```typescript
// Before v2.0
import { retry } from '@clarity-chat/react/utils'

// After v2.0
import { retry } from '@clarity-chat/utils/async'
```

---

### 5.3 Directory Structure Changes

**React Package**:
- `src/examples/` → Moved to `apps/playground`
- `src/utils/performance-monitoring.tsx` → DELETED (use hooks/performance/)
- 50 directories → 12 directories

**No breaking changes** if using public-api.ts imports

---

## 6. Immediate Action Items (Priority Order)

### P1 - Critical (Do First)
1. ✅ **Delete insecure webhook backups** (SECURITY)
   - Delete `webhook-manager-insecure-backup.ts`
   - Delete `webhook-manager-old-backup.ts`

2. **Fix CSS build configuration**
   - Verify CSS copies to dist/styles/
   - Update dev-tools CSS exports

3. **Add missing "use client" directives**
   - 12 components/hooks need directive
   - Prioritize: memory/react/use-memory.ts

4. **Fix /env export** ✅ COMPLETE
   - Already fixed in P0

### P2 - High (This Week)
5. **Consolidate duplicate retry logic**
   - Delete 4 duplicate implementations
   - Use canonical from utils/async

6. **Consolidate duplicate validation**
   - Delete 3 duplicate implementations
   - Use canonical from utils/validation

7. **Merge errors package into error-handling**
   - Consolidate error types
   - Update imports

8. **Delete deprecated chat hooks**
   - Keep only `useClarityChat`
   - Add deprecation warnings

### P3 - Medium (This Sprint)
9. **Merge dev-tools into react**
   - Move to react/src/dev-tools/
   - Update imports

10. **Merge testing-utils into react**
    - Consolidate with existing test-utils
    - Update exports

11. **Restructure react package directories**
    - Reduce from 50 to 12 top-level dirs
    - Update imports

12. **Add subpath exports to react**
    - Enable tree-shaking
    - Reduce bundle sizes

### P4 - Low (Next Sprint)
13. **Delete ai-infrastructure package**
    - Migrate unique features to react
    - Update documentation

14. **Generate v2.0 migration codemod**
    - Automate breaking change migrations
    - Test on example projects

15. **Update all documentation**
    - Reflect new package structure
    - Update migration guides

---

## 7. Success Metrics

### Quantitative Targets
- **Packages**: 18 → 8 (56% reduction)
- **Exports in react**: 114+ → ~40 (65% reduction)
- **Duplicate APIs**: 11 sets → 0
- **Duplicate LOC**: ~2,000 → 0
- **React directories**: 50 → 12 (76% reduction)
- **Typecheck pass**: ⚠️ → ✅ (100%)
- **Score**: 15/100 → 98/100

### Qualitative Goals
- ✅ ONE canonical API per concern
- ✅ Clear package boundaries
- ✅ Predictable import paths
- ✅ Tree-shakeable bundles
- ✅ SSR-safe components
- ✅ React 18/19 compatible
- ✅ Frontend-ready packaging

---

## 8. Risk Assessment

### High Risk
1. **Breaking Changes**: v2.0 migration affects all users
   - **Mitigation**: Comprehensive codemod + documentation

2. **CSS Build Issues**: CSS not copying correctly
   - **Mitigation**: Fix and verify in CI/CD

3. **Import Path Updates**: 1000+ import statements to update
   - **Mitigation**: Use multi-agent parallel updates

### Medium Risk
4. **Dev-Tools Type Errors**: Existing issues in dev-tools
   - **Mitigation**: Fix before merge into react

5. **Package Merge Conflicts**: Potential namespace collisions
   - **Mitigation**: Careful namespace planning

### Low Risk
6. **Documentation Sync**: Docs may lag behind changes
   - **Mitigation**: Update docs in same PR as code changes

---

## 9. Approval & Next Steps

**This document defines**:
- ✅ 8 core packages (from 18)
- ✅ Canonical API choices for 10 major concerns
- ✅ Directory structure targets
- ✅ Frontend packaging strategy
- ✅ Migration plan and timelines

**Ready for**:
- Phase 3: Create unified remediation plan
- Phase 4: Execute consolidation (parallel agents)
- Phase 5: Verification and testing
- Phase 6: Score until ≥98/100

**Awaiting**: User approval to proceed with consolidation

---

*Generated by 20-agent parallel audit swarm*
*Quality score: 15/100 → Target: 98/100*
