# CONSOLIDATION PLAN

**Zero Dead Code Policy Implementation**

Last Updated: 2025-12-19

---

## Decision Matrix Legend

| Label               | Meaning                               |
| ------------------- | ------------------------------------- |
| ✅ KEEP_PUBLIC      | Part of public API, actively used     |
| 🔁 MERGE_PUBLIC     | Merge into existing public component  |
| 🧩 REHOME_INTERNAL  | Move to internal, not exported        |
| ⚠️ DEPRECATE_PUBLIC | Mark deprecated, remove in next major |
| ❌ REMOVE_FULLY     | Delete - unused, no consumers         |

---

## 1. ORPHANED DIRECTORIES (No Active Imports)

### 1.1 `/packages/react/src/plugins/` - ❌ REMOVE_FULLY

| File                        | Lines | Decision  | Evidence                                        |
| --------------------------- | ----- | --------- | ----------------------------------------------- |
| `plugin-manager.ts`         | ~150  | ❌ REMOVE | Commented out in exports.ts:417, internal.ts:72 |
| `types.ts`                  | ~50   | ❌ REMOVE | No external imports found                       |
| `index.ts`                  | ~20   | ❌ REMOVE | Re-exports only, no consumers                   |
| `__tests__/plugins.test.ts` | ~100  | ❌ REMOVE | Tests orphaned code                             |

**Impact**: ~320 lines removed **Bundle Savings**: ~5KB gzipped **Justification**: Plugin system was
never completed. Build errors noted in code comments.

---

### 1.2 `/packages/react/src/extensions/` - ❌ REMOVE_FULLY

| File                        | Lines | Decision  | Evidence                                        |
| --------------------------- | ----- | --------- | ----------------------------------------------- |
| `index.ts`                  | ~30   | ❌ REMOVE | Commented out in internal.ts:74, exports.ts:419 |
| `builder.ts`                | ~200  | ❌ REMOVE | No external imports                             |
| `components.tsx`            | ~150  | ❌ REMOVE | Never rendered                                  |
| `middleware.ts`             | ~100  | ❌ REMOVE | No consumers                                    |
| `react.tsx`                 | ~80   | ❌ REMOVE | Extension provider unused                       |
| `registry.ts`               | ~120  | ❌ REMOVE | Registry never initialized                      |
| `types.ts`                  | ~100  | ❌ REMOVE | Types for unused system                         |
| `integrations/*` (10 files) | ~800  | ❌ REMOVE | All integration stubs                           |
| `__tests__/*` (2 files)     | ~200  | ❌ REMOVE | Tests orphaned code                             |

**Impact**: ~1,780 lines removed **Bundle Savings**: ~15KB gzipped **Justification**: Extension
system incomplete. No production usage.

---

### 1.3 `/packages/react/src/templates/` - ❌ REMOVE_FULLY

| File                    | Lines | Decision  | Evidence                      |
| ----------------------- | ----- | --------- | ----------------------------- |
| `ai-assistant.tsx`      | ~180  | ❌ REMOVE | Commented out in exports.ts   |
| `code-assistant.tsx`    | ~160  | ❌ REMOVE | No imports                    |
| `code-helper.tsx`       | ~150  | ❌ REMOVE | Duplicate of code-assistant   |
| `creative-writing.tsx`  | ~140  | ❌ REMOVE | No imports                    |
| `customer-support.tsx`  | ~160  | ❌ REMOVE | No imports                    |
| `data-analyst.tsx`      | ~170  | ❌ REMOVE | No imports                    |
| `documentation-bot.tsx` | ~150  | ❌ REMOVE | No imports                    |
| `education-tutor.tsx`   | ~140  | ❌ REMOVE | No imports                    |
| `sales-assistant.tsx`   | ~160  | ❌ REMOVE | No imports                    |
| `support-bot.tsx`       | ~150  | ❌ REMOVE | Duplicate of customer-support |
| `index.ts`              | ~20   | ❌ REMOVE | Re-exports only               |

**Impact**: ~1,580 lines removed **Bundle Savings**: ~12KB gzipped **Justification**: Templates
never exported. Commented out due to build errors.

---

### 1.4 `/packages/react/src/security/` - ❌ REMOVE_FULLY

| File                  | Lines | Decision  | Evidence                        |
| --------------------- | ----- | --------- | ------------------------------- |
| `security-manager.ts` | ~200  | ❌ REMOVE | Commented out in exports.ts:352 |
| `index.ts`            | ~10   | ❌ REMOVE | Re-exports only                 |

**Impact**: ~210 lines removed **Bundle Savings**: ~2KB gzipped **Justification**: Security module
excluded from build. Never used.

---

### 1.5 `/packages/react/src/components/chat/index.ts` - 🔁 MERGE_PUBLIC

**Current State**: Empty file with only `export {}` **Decision**: Delete file, exports already
handled elsewhere **Impact**: File deletion only

---

## 2. DEPRECATED HOOKS (Replace or Remove)

### 2.1 `/packages/react/src/hooks/chat/use-clarity-chat-helpers.ts` - ❌ REMOVE_FULLY

| Export                          | Lines | Decision  | Evidence                                   |
| ------------------------------- | ----- | --------- | ------------------------------------------ |
| `useClarityChatWithWindow`      | 25    | ❌ REMOVE | Marked @deprecated, recommends ClarityChat |
| `useClarityChatWithAnalytics`   | 50    | ❌ REMOVE | Never imported externally                  |
| `useClarityChatWithPersistence` | 80    | ❌ REMOVE | Never imported externally                  |
| `useClarityChatWithDebounce`    | 25    | ❌ REMOVE | Never imported externally                  |
| `useClarityChatWithAutoSave`    | 60    | ❌ REMOVE | Never imported externally                  |

**Impact**: ~290 lines removed (entire file) **Justification**: All hooks either deprecated or
unused. Commented out in exports.ts:656-662.

---

### 2.2 `/packages/react/src/hooks/chat/use-chat.ts` - ⚠️ DEPRECATE_PUBLIC

**Current State**: Legacy hook, marked @deprecated **Decision**: Keep for v2.x, remove in v3.0
**Action**: Add deprecation warning in JSDoc, export from `/internal` only

---

### 2.3 `/packages/react/src/hooks/chat/use-chat-with-operations.ts` - ❌ REMOVE_FULLY

**Current State**: Marked @deprecated, will merge into useClarityChat in v3.0 **Decision**: Remove
now - consolidation opportunity **Impact**: ~150 lines removed

---

### 2.4 `/packages/react/src/hooks/chat/use-chat-core.ts` - ❌ REMOVE_FULLY

**Current State**: Marked @deprecated, will merge into useChatUnified in v3.0 **Decision**: Remove
now - redundant with use-chat-unified.ts **Impact**: ~200 lines removed

---

## 3. DEPRECATED UTILITY FUNCTIONS

### 3.1 `/packages/react/src/utils/message/clarity-chat-helpers.ts` - 🧩 REHOME_INTERNAL

| Export                       | Decision  | Reason                      |
| ---------------------------- | --------- | --------------------------- |
| `createBasicChatConfig`      | ✅ KEEP   | Useful utility              |
| `createMemoryChatConfig`     | ✅ KEEP   | Useful utility              |
| `createStreamingChatConfig`  | ✅ KEEP   | Useful utility              |
| `createEnterpriseChatConfig` | ✅ KEEP   | Useful utility              |
| `createUserMessage`          | ❌ REMOVE | @deprecated, re-export only |
| `createAssistantMessage`     | ❌ REMOVE | @deprecated, re-export only |
| `createSystemMessage`        | ❌ REMOVE | @deprecated, re-export only |
| `isValidApiEndpoint`         | ✅ KEEP   | Useful utility              |
| `getApiEndpoint`             | ✅ KEEP   | Useful utility              |

**Action**: Remove deprecated re-exports, keep useful utilities

---

### 3.2 `/packages/react/src/utils/message/message-conversion.ts` - Clean Deprecated

| Export                          | Decision       | Reason            |
| ------------------------------- | -------------- | ----------------- |
| `convertCoreMessageToMessage`   | ✅ KEEP_PUBLIC | Active usage      |
| `convertMessageToCoreMessage`   | ✅ KEEP_PUBLIC | Active usage      |
| `convertCoreMessagesToMessages` | ✅ KEEP_PUBLIC | Active usage      |
| `convertMessagesToCoreMessages` | ✅ KEEP_PUBLIC | Active usage      |
| `convertMessages`               | ❌ REMOVE      | @deprecated alias |
| `convertMessagesToMessages`     | ❌ REMOVE      | @deprecated alias |

---

### 3.3 `/packages/react/src/accessibility/core-utilities.ts` - Clean Deprecated

| Export                   | Decision  | Reason                                |
| ------------------------ | --------- | ------------------------------------- |
| `announceToScreenReader` | ❌ REMOVE | @deprecated, use useA11y().announce() |
| `createLiveRegion`       | ❌ REMOVE | @deprecated, use A11yProvider         |

---

## 4. VECTOR STORE DEPRECATED TYPES

All vector store files have deprecated type exports. Clean these up:

| File          | Deprecated Export | Action                         |
| ------------- | ----------------- | ------------------------------ |
| `chroma.ts`   | Old type pattern  | Remove deprecated, keep active |
| `pinecone.ts` | Old type pattern  | Remove deprecated, keep active |
| `qdrant.ts`   | Old type pattern  | Remove deprecated, keep active |
| `weaviate.ts` | Old type pattern  | Remove deprecated, keep active |

---

## 5. ANIMATION DEPRECATIONS

### `/packages/react/src/animations/constants.ts`

| Export               | Decision  | Reason                    |
| -------------------- | --------- | ------------------------- |
| `FASTER`             | ❌ REMOVE | @deprecated, use 'slower' |
| Old duration pattern | ❌ REMOVE | Use DURATION_SECONDS      |

### `/packages/react/src/animations/spring-presets.ts`

| Export              | Decision  | Reason                             |
| ------------------- | --------- | ---------------------------------- |
| Old preset patterns | ❌ REMOVE | Use getSpring() with named presets |

---

## 6. COMMENTED-OUT EXPORTS TO DELETE

These exports are commented out in `exports.ts` and `internal.ts` and should be removed entirely:

| Location           | Lines | Content                | Action          |
| ------------------ | ----- | ---------------------- | --------------- |
| exports.ts:86-100  | 14    | Tier 2 chat components | DELETE comments |
| exports.ts:172-177 | 5     | useRAGPipeline         | DELETE comments |
| exports.ts:208-209 | 1     | embeddings             | DELETE comments |
| exports.ts:235-240 | 5     | useAgent               | DELETE comments |
| exports.ts:295-296 | 1     | tokenization duplicate | DELETE comments |
| exports.ts:309-310 | 1     | optimization duplicate | DELETE comments |
| exports.ts:352     | 1     | security               | DELETE comments |
| exports.ts:357-358 | 1     | safety                 | DELETE comments |
| exports.ts:361     | 1     | enterprise             | DELETE comments |
| exports.ts:369-377 | 8     | clarity-chat-helpers   | DELETE comments |
| exports.ts:402-403 | 1     | adapters               | DELETE comments |
| exports.ts:406-408 | 2     | prompts/prompt         | DELETE comments |
| exports.ts:411-412 | 1     | document-loaders       | DELETE comments |
| exports.ts:416-419 | 3     | plugins/extensions     | DELETE comments |
| exports.ts:431-432 | 1     | animations             | DELETE comments |
| exports.ts:435-436 | 1     | accessibility          | DELETE comments |
| exports.ts:545-546 | 1     | search                 | DELETE comments |
| exports.ts:576-577 | 1     | prompt components      | DELETE comments |
| exports.ts:608-609 | 1     | performance hooks      | DELETE comments |
| exports.ts:626-627 | 1     | security hooks         | DELETE comments |
| exports.ts:654-662 | 8     | helper hooks           | DELETE comments |
| internal.ts:54     | 1     | enterprise             | DELETE comment  |
| internal.ts:72     | 1     | plugins                | DELETE comment  |
| internal.ts:74     | 1     | extensions             | DELETE comment  |
| internal.ts:85     | 1     | templates              | DELETE comment  |

---

## 7. SUMMARY STATISTICS

### Before Consolidation

- Total orphaned directories: 4
- Total deprecated functions: 15+
- Total commented-out exports: 50+ lines
- Estimated dead code: ~4,500 lines

### After Consolidation

- Orphaned directories: 0
- Deprecated functions: 0 (or moved to /internal with warning)
- Commented-out exports: 0
- Dead code removed: ~4,500 lines
- Bundle size reduction: ~35KB gzipped

---

## 8. IMPLEMENTATION ORDER

1. **Phase 1**: Delete orphaned directories (plugins, extensions, templates, security)
2. **Phase 2**: Delete deprecated hook files
3. **Phase 3**: Clean deprecated utility functions
4. **Phase 4**: Remove commented-out export lines
5. **Phase 5**: Clean empty index files
6. **Phase 6**: Verify build and tests
7. **Phase 7**: Update CHANGELOG

---

_Each deletion must pass: `pnpm build && pnpm test`_
