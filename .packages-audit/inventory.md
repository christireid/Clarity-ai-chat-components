# Package Inventory

**Date:** 2026-01-23 **Branch:** clean-up **Total Packages:** 17 (14 active, 3 deprecated/empty)

---

## Active Packages (14)

### 1. @clarity-chat/cli

**Path:** `packages/cli/` **Purpose:** Developer productivity toolkit for scaffolding, component
management, and project operations **Boundaries:** CLI-only, should not contain UI components or
React hooks **Size:** 240KB (built) **Dependencies:** @clarity-chat/utils **Public Exports:**
Commands (init, add, generate, docs, analyze, browse, validate-theme), UI utilities

---

### 2. @clarity-chat/codemods

**Path:** `packages/codemods/` **Purpose:** Automated code transformations for API migrations
**Boundaries:** Code transformation only, should be framework-agnostic **Size:** 88KB (built)
**Dependencies:** @clarity-chat/react, @clarity-chat/primitives **Public Exports:** Transform
runner, v1-to-v2 migrations **⚠️ Issues:** No test files found

---

### 3. @clarity-chat/dev-tools

**Path:** `packages/dev-tools/` **Purpose:** Debugging and development utilities **Boundaries:**
Dev-only tools, not for production **Size:** 1.9MB (built) **Dependencies:** @clarity-chat/utils
**Public Exports:** Debug utilities, performance comparison, model comparison, time travel debugging

---

### 4. @clarity-chat/error-handling

**Path:** `packages/error-handling/` **Purpose:** Comprehensive error handling system
**Boundaries:** Error management only **Size:** 1.3MB (built) **Dependencies:** @clarity-chat/utils
**Public Exports:** ErrorBoundary, EnhancedErrorBoundary, ChatErrorBoundary, error hooks
(useErrorHandler, useErrorBoundary, useErrorToast, useErrorRecovery) **⚠️ Issues:** Has its own
ValidationError (should use utils)

---

### 5. @clarity-chat/license

**Path:** `packages/license/` **Purpose:** License validation for pro features **Boundaries:**
License logic only **Size:** 372KB (built) **Dependencies:** None (Layer 0) **Public Exports:**
License validation, UI components

---

### 6. @clarity-chat/memory

**Path:** `packages/memory/` **Purpose:** AI memory and context management (framework-agnostic)
**Boundaries:** Framework-agnostic memory utilities **Size:** 976KB (built) **Dependencies:**
@clarity-chat/token-optimization **Public Exports:** MemoryService, ConsentManager, AuditLogger,
DecayManager, storage adapters **⚠️ Issues:** Contains duplicate token counting logic, should use
token-optimization package

---

### 7. @clarity-chat/playground

**Path:** `packages/playground/` **Purpose:** Interactive component testing environment
**Boundaries:** Development/demo tool (private package) **Size:** 1.8MB (built) **Dependencies:**
None (standalone) **Public Exports:** None (private package) **⚠️ Issues:** Duplicate ErrorBoundary,
cn utility

---

### 8. @clarity-chat/primitives

**Path:** `packages/primitives/` **Purpose:** Base UI components (shadcn/ui + custom)
**Boundaries:** Presentational components only, no business logic **Size:** 976KB (built)
**Dependencies:** @clarity-chat/utils **Public Exports:** 30+ shadcn components, enhanced variants,
custom components **⚠️ Issues:** utils.ts contains 172 functions (1526 lines) - "god module"

---

### 9. @clarity-chat/react

**Path:** `packages/react/` **Purpose:** Main AI chat components library **Boundaries:**
React-specific implementations **Size:** Not built (build disabled in sandbox) **Dependencies:**
@clarity-chat/license, @clarity-chat/memory, @clarity-chat/primitives,
@clarity-chat/token-optimization, @clarity-chat/types, @clarity-chat/utils **Public Exports:** 200+
components, 95+ hooks, utilities **🔴 CRITICAL Issues:** Duplicates token optimization, compression,
caching, error handling from other packages

---

### 10. @clarity-chat/testing-utils

**Path:** `packages/testing-utils/` **Purpose:** Testing helpers for accessibility, performance,
mocks **Boundaries:** Test utilities only **Size:** 108KB (built) **Dependencies:**
@clarity-chat/react, @clarity-chat/primitives (peer dependencies) **Public Exports:**
renderWithProviders, mock generators, accessibility testing, performance testing

---

### 11. @clarity-chat/token-optimization

**Path:** `packages/token-optimization/` **Purpose:** LLM token management (counting, optimization,
compression, caching) **Boundaries:** Token counting, optimization, compression, caching **Size:**
3.9MB (built) 🔴 LARGEST PACKAGE **Dependencies:** @clarity-chat/primitives (⚠️ CIRCULAR RISK)
**Public Exports:** 10+ token counters, 8+ compression strategies, caching, hooks **🔴 CRITICAL
Issues:**

- Too large (3.9MB)
- Circular dependency with primitives
- Multiple duplicate implementations

---

### 12. @clarity-chat/types

**Path:** `packages/types/` **Purpose:** TypeScript type definitions **Boundaries:** Types only, no
implementation **Size:** 164KB (built) **Dependencies:** None (Layer 0) **Public Exports:** 93 type
exports across 13 files (Message, User, Chat, Memory, Theme, etc.)

---

### 13. @clarity-chat/utils

**Path:** `packages/utils/` **Purpose:** Shared utilities (framework-agnostic) **Boundaries:**
Framework-agnostic utilities **Size:** 1.3MB (built) **Dependencies:** None (Layer 0) **Public
Exports:** Logger, cache, validation, format, errors, async, file system utilities

---

### 14. @clarity-chat/typescript-config

**Path:** `packages/typescript-config/` **Purpose:** Shared TypeScript configurations
**Boundaries:** Config only **Dependencies:** None (Layer 0) **Public Exports:** tsconfig.json
presets

---

## Deprecated/Empty Packages (3)

### ❌ errors

**Path:** `packages/errors/` **Status:** Empty (only dist/node_modules) **Action:** DELETE

### ❌ licensing

**Path:** `packages/licensing/` **Status:** Empty (only dist/node_modules) **Action:** DELETE

### ❌ shared-utils

**Path:** `packages/shared-utils/` **Status:** Empty (only node_modules) **Action:** DELETE

---

## Package Layer Architecture

```
Layer 0 (Foundation):
├── types
├── utils
├── license
└── typescript-config

Layer 1 (Infrastructure):
├── primitives → utils
├── error-handling → utils
├── cli → utils
└── dev-tools → utils

Layer 2 (Domain):
├── token-optimization → primitives ⚠️ CIRCULAR RISK
└── memory → token-optimization

Layer 3 (Integration):
└── react → license, memory, primitives, token-optimization, types, utils

Layer 4 (Development):
├── testing-utils → react, primitives (peers)
├── codemods → react, primitives
└── playground (standalone)
```

---

## Boundary Violations

1. **token-optimization → primitives** (⚠️ CIRCULAR DEPENDENCY RISK)
   - Should not depend on UI layer
   - Uses: cn, glassVariants, getSemanticGradient

2. **react/src/utils/** (🔴 CRITICAL DUPLICATION)
   - Duplicates functionality from: token-optimization, memory, error-handling, utils, primitives
   - 47 subdirectories with duplicate code

3. **memory package** (⚠️ BOUNDARY VIOLATION)
   - Contains token counting logic (should use token-optimization)

---

## Summary Statistics

- **Total Packages:** 14 active, 3 empty
- **Total TypeScript Files:** ~2,714
- **Largest Package:** token-optimization (3.9MB)
- **Most Complex Package:** react (1,090 files)
- **Cleanest Package:** types (164KB, zero deps)
- **Empty Packages to Delete:** 3
