# DECISIONS

**Architectural Decisions for Dead Code Elimination**

Last Updated: 2025-12-19

---

## Decision Record Format

Each decision follows the ADR (Architecture Decision Record) format:

- **Context**: Why this decision was needed
- **Decision**: What was decided
- **Consequences**: Impact of the decision
- **Evidence**: Data supporting the decision

---

## DEC-001: Remove `/plugins/` Directory

### Context

The plugins directory contains a plugin manager system that was started but never completed. All
exports are commented out in both `internal.ts` (line 72) and `exports.ts` (line 417) with the note
"Plugins module has build errors."

### Decision

**❌ REMOVE_FULLY** - Delete the entire `/packages/react/src/plugins/` directory.

### Evidence

1. Grep for `from './plugins'` or `from '../plugins'` returns 0 results outside the directory itself
2. Build errors documented in code comments
3. No Storybook stories reference these components
4. No documentation references the plugin system
5. No examples use the plugin system

### Consequences

- **Positive**: ~320 lines of dead code removed, ~5KB bundle reduction
- **Positive**: Reduced maintenance burden
- **Negative**: None identified (no consumers exist)

### Files Affected

```
packages/react/src/plugins/
├── __tests__/plugins.test.ts  (DELETE)
├── index.ts                   (DELETE)
├── plugin-manager.ts          (DELETE)
└── types.ts                   (DELETE)
```

---

## DEC-002: Remove `/extensions/` Directory

### Context

The extensions directory contains an incomplete integration system with stubs for various
third-party services (auth, CRM, payments, etc.). All exports are commented out with "Extensions
integrations excluded from build."

### Decision

**❌ REMOVE_FULLY** - Delete the entire `/packages/react/src/extensions/` directory.

### Evidence

1. All exports commented out in `internal.ts` (line 74) and `exports.ts` (line 419)
2. No external imports found
3. Integrations are stubs only (no actual implementation)
4. No documentation references extensions
5. Test files exist but test orphaned code

### Consequences

- **Positive**: ~1,780 lines removed, ~15KB bundle reduction
- **Positive**: Removes confusion about incomplete feature
- **Negative**: Future extension work must restart (acceptable - current approach was wrong)

### Files Affected

```
packages/react/src/extensions/
├── __tests__/
│   ├── middleware.test.ts     (DELETE)
│   └── registry.test.ts       (DELETE)
├── integrations/
│   ├── ai-providers.ts        (DELETE)
│   ├── auth.ts                (DELETE)
│   ├── crm.ts                 (DELETE)
│   ├── feature-flags.ts       (DELETE)
│   ├── index.ts               (DELETE)
│   ├── notifications.ts       (DELETE)
│   ├── observability.ts       (DELETE)
│   ├── payments.ts            (DELETE)
│   ├── realtime.ts            (DELETE)
│   ├── search.ts              (DELETE)
│   ├── storage.ts             (DELETE)
│   └── vector-stores.ts       (DELETE)
├── builder.ts                 (DELETE)
├── components.tsx             (DELETE)
├── index.ts                   (DELETE)
├── middleware.ts              (DELETE)
├── react.tsx                  (DELETE)
├── registry.ts                (DELETE)
└── types.ts                   (DELETE)
```

---

## DEC-003: Remove `/templates/` Directory

### Context

The templates directory contains pre-built chat templates (AI assistant, code helper, customer
support, etc.). All exports are commented out with "Templates module has build errors."

### Decision

**❌ REMOVE_FULLY** - Delete the entire `/packages/react/src/templates/` directory.

### Evidence

1. Commented out in `internal.ts` (line 85)
2. Build errors noted in code
3. No external imports found
4. Duplicates exist (code-assistant vs code-helper, customer-support vs support-bot)
5. Templates can be recreated as examples/recipes if needed

### Consequences

- **Positive**: ~1,580 lines removed, ~12KB bundle reduction
- **Positive**: Removes duplicated code patterns
- **Negative**: Loss of template examples (mitigated: examples/ directory serves this purpose
  better)

### Files Affected

```
packages/react/src/templates/
├── ai-assistant.tsx           (DELETE)
├── code-assistant.tsx         (DELETE)
├── code-helper.tsx            (DELETE - duplicate)
├── creative-writing.tsx       (DELETE)
├── customer-support.tsx       (DELETE)
├── data-analyst.tsx           (DELETE)
├── documentation-bot.tsx      (DELETE)
├── education-tutor.tsx        (DELETE)
├── index.ts                   (DELETE)
├── sales-assistant.tsx        (DELETE)
└── support-bot.tsx            (DELETE - duplicate)
```

---

## DEC-004: Remove `/security/` Directory

### Context

The security directory contains a security manager that is excluded from the build. Commented out in
`exports.ts` (line 352).

### Decision

**❌ REMOVE_FULLY** - Delete the entire `/packages/react/src/security/` directory.

### Evidence

1. Commented out in exports with no explanation
2. No imports found outside the directory
3. Security features should be in dedicated package, not bundled here

### Consequences

- **Positive**: ~210 lines removed, ~2KB bundle reduction
- **Positive**: Security concerns should be separate concern
- **Negative**: None (code was never used)

### Files Affected

```
packages/react/src/security/
├── index.ts                   (DELETE)
└── security-manager.ts        (DELETE)
```

---

## DEC-005: Remove `/hooks/chat/use-clarity-chat-helpers.ts`

### Context

This file contains 5 helper hooks that are all either deprecated or never imported:

- `useClarityChatWithWindow` - @deprecated
- `useClarityChatWithAnalytics` - no imports
- `useClarityChatWithPersistence` - no imports
- `useClarityChatWithDebounce` - no imports
- `useClarityChatWithAutoSave` - no imports

### Decision

**❌ REMOVE_FULLY** - Delete the entire file.

### Evidence

1. `useClarityChatWithWindow` marked @deprecated with note "Consider using the ClarityChat
   component"
2. Commented out in exports.ts (lines 656-662)
3. Grep for hook names returns 0 external imports
4. Functionality available through other means (persistence via memory system, debounce via
   useDeferredValue)

### Consequences

- **Positive**: ~290 lines removed
- **Positive**: Reduces API surface confusion
- **Negative**: None (deprecated/unused)

---

## DEC-006: Remove Deprecated Hooks

### Context

Multiple hooks are marked @deprecated and have replacements available.

### Decision

Remove the following hooks:

| Hook                          | Replacement      | Decision  |
| ----------------------------- | ---------------- | --------- |
| `use-chat-with-operations.ts` | `useClarityChat` | ❌ REMOVE |
| `use-chat-core.ts`            | `useChatUnified` | ❌ REMOVE |

### Evidence

1. Both files have `@deprecated` markers at the top
2. Replacement hooks exist and are documented
3. No breaking change for users (deprecated for 1+ version)

### Consequences

- **Positive**: ~350 lines removed
- **Positive**: Single source of truth for chat state
- **Negative**: Users on deprecated hooks must migrate (expected behavior)

---

## DEC-007: Remove Empty Index File

### Context

`/packages/react/src/components/chat/index.ts` contains only:

```typescript
export {}
```

With a comment explaining exports are commented out due to missing dependencies.

### Decision

**❌ REMOVE_FULLY** - Delete the file.

### Evidence

1. File exports nothing
2. Imports are handled by direct file imports elsewhere
3. No module resolution depends on this barrel

### Consequences

- **Positive**: Cleaner codebase
- **Negative**: None

---

## DEC-008: Clean Deprecated Utility Functions

### Context

Several utility files contain deprecated re-exports for backward compatibility.

### Decision

Remove deprecated re-exports from:

- `/utils/message/clarity-chat-helpers.ts` - Remove 3 deprecated message creators
- `/utils/message/message-conversion.ts` - Remove 2 deprecated aliases
- `/accessibility/core-utilities.ts` - Remove 2 deprecated functions

### Evidence

1. All marked with `@deprecated` JSDoc
2. Canonical versions exist in other files
3. Re-exports only add confusion

### Consequences

- **Positive**: Single source of truth for each function
- **Positive**: Reduced import confusion
- **Negative**: Possible breaking change for users importing deprecated (expected)

---

## DEC-009: Remove Commented-Out Export Lines

### Context

`exports.ts` and `internal.ts` contain 50+ lines of commented-out exports. These serve no purpose
and add confusion.

### Decision

Delete all commented-out export lines.

### Evidence

1. Commented code is not documentation
2. Git history preserves removed code if needed
3. Comments explain "build errors" but don't help users

### Consequences

- **Positive**: Cleaner export files
- **Positive**: Easier to understand actual API surface
- **Negative**: None

---

## DEC-010: Retain Legacy useChat Hook

### Context

`/hooks/chat/use-chat.ts` is marked @deprecated but may have active users.

### Decision

**⚠️ DEPRECATE_PUBLIC** - Keep in codebase but:

1. Move export to `/internal` only
2. Add console.warn for deprecation
3. Remove in v3.0

### Evidence

1. Grep shows some usage in examples
2. Migration path documented (use useClarityChat)
3. Removing now would be breaking change

### Consequences

- **Positive**: Provides migration path
- **Negative**: Slight code bloat until v3.0

---

## Summary of Removed Code

| Category             | Lines Removed | Bundle Impact |
| -------------------- | ------------- | ------------- |
| plugins/             | 320           | -5KB          |
| extensions/          | 1,780         | -15KB         |
| templates/           | 1,580         | -12KB         |
| security/            | 210           | -2KB          |
| Deprecated hooks     | 640           | -5KB          |
| Empty/duplicate code | 100           | -1KB          |
| **TOTAL**            | **~4,630**    | **~40KB**     |

---

## Verification Checklist

Before each removal:

- [ ] Grep for imports confirms no consumers
- [ ] No Storybook stories depend on code
- [ ] No documentation references code
- [ ] No examples use the code
- [ ] Build succeeds after removal
- [ ] Tests pass after removal

---

_All decisions can be reversed via git history if needed._
