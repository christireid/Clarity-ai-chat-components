# Documentation Files Needing Updates - Consolidation Cleanup

**Generated:** 2026-01-23
**Purpose:** Track all documentation files referencing deprecated APIs from consolidation effort

---

## Summary

**Total Files Identified:** 60+
**Categories:**
- Token Counter APIs: 15 files
- Compression APIs: 8 files
- Cache Implementations: 12 files
- Memory Package References: 25+ files
- Deprecated Hooks: 10 files
- General Utility References: 20+ files

---

## Category 1: Token Counter API References

### Files with Deprecated Token Counter APIs

**Status:** These files reference old token counter implementations that have been consolidated to `AccurateTokenCounter`

#### Deprecated APIs to Update:
- `FastTokenCounter` → `AccurateTokenCounter`
- `SimpleTokenCounter` → `AccurateTokenCounter`
- `AdvancedTokenCounter` → `AccurateTokenCounter`
- `LegacyTokenCounter` → `AccurateTokenCounter`
- `TokenCounter` (from memory package) → `AccurateTokenCounter`

#### Files:

1. `/packages/token-optimization/README.md`
   - **Issue:** References `FastTokenCounter`, `SimpleTokenCounter`
   - **Action:** Update to show only `AccurateTokenCounter` as canonical
   - **Priority:** HIGH

2. `/packages/token-optimization/docs/TROUBLESHOOTING.md`
   - **Issue:** Troubleshooting for deprecated counter variants
   - **Action:** Remove sections for deprecated counters
   - **Priority:** MEDIUM

3. `/packages/token-optimization/CHANGELOG.md`
   - **Issue:** Historical references (OK to keep)
   - **Action:** Add deprecation notice at top
   - **Priority:** LOW

4. `/PR_DESCRIPTION.md`
   - **Issue:** Contains outdated API examples
   - **Action:** Update or archive
   - **Priority:** LOW

5. `/apps/storybook/stories/Components/TokenCounter/Overview.mdx`
   - **Issue:** May reference old implementations
   - **Action:** Update to canonical API
   - **Priority:** HIGH

6. `/packages/token-optimization/.storybook/hooks/UseTokenCount.mdx`
   - **Issue:** Hook documentation may reference deprecated counters
   - **Action:** Verify and update examples
   - **Priority:** HIGH

7. `/apps/docs/content/components/token-counter/*` (multiple files)
   - **Issue:** Component documentation
   - **Action:** Review and update
   - **Priority:** HIGH

---

## Category 2: Compression API References

### Files with Deprecated Compression APIs

**Status:** These files reference removed/deprecated compression implementations

#### Deprecated APIs to Update:
- `DynamicCompressionEngine` (REMOVED) → `AdaptiveCompressor` or `LLMLinguaCompressor`
- `BasicCompressionEngine` (internal) → `normalizeWhitespace()` function
- Old compression imports from `@clarity-chat/memory` → `@clarity-chat/token-optimization`

#### Files:

1. `/packages/token-optimization/MIGRATION.md`
   - **Issue:** Migration guide for deprecated APIs
   - **Action:** Already updated, verify completeness
   - **Priority:** HIGH (review)

2. `/packages/token-optimization/docs/ARCHITECTURE.md`
   - **Issue:** May reference old compression architecture
   - **Action:** Update architecture diagrams and examples
   - **Priority:** HIGH

3. `/packages/token-optimization/CHANGELOG.md`
   - **Issue:** Historical references to removed APIs
   - **Action:** Add clear deprecation/removal notices
   - **Priority:** MEDIUM

4. `/packages/token-optimization/docs/SECURITY.md`
   - **Issue:** May reference removed compression methods
   - **Action:** Update security guidelines for new APIs
   - **Priority:** MEDIUM

5. `/apps/docs/content/guides-migration/guides/token-optimization.md`
   - **Issue:** Uses old compression examples
   - **Action:** Update to new compression APIs
   - **Priority:** HIGH

---

## Category 3: Cache Implementation References

### Files with Deprecated Cache APIs

**Status:** References to old cache implementations that have been consolidated

#### Deprecated APIs to Update:
- `CacheAPI` (various packages) → Consolidated cache in `@clarity-chat/token-optimization`
- `CacheManager` → Use standard cache APIs
- `SmartCache` (React package) → `useSmartCache` from token-optimization
- `use-smart-cache` (old React hook) → Updated version

#### Files:

1. `/apps/docs/content/hooks/use-smart-cache.mdx`
   - **Issue:** May reference old implementation from React package
   - **Action:** Update to token-optimization package import
   - **Priority:** HIGH

2. `/apps/docs/content/types/use-smart-cache-options.mdx`
   - **Issue:** Type definitions may be outdated
   - **Action:** Verify types match consolidated implementation
   - **Priority:** MEDIUM

3. `/apps/docs/content/types/use-smart-cache-return.mdx`
   - **Issue:** Return type documentation
   - **Action:** Verify and update
   - **Priority:** MEDIUM

4. `/apps/docs/content/guides-migration/guides/token-optimization.md`
   - **Issue:** Cache examples may use old APIs
   - **Action:** Update cache usage examples
   - **Priority:** HIGH

5. `/apps/docs/content/guides-migration/api/token-optimization.md`
   - **Issue:** API reference may be outdated
   - **Action:** Update to consolidated APIs
   - **Priority:** HIGH

6. `/apps/docs/content/guides-migration/TOKEN_OPTIMIZATION_QUICK_REFERENCE.md`
   - **Issue:** Quick reference guide
   - **Action:** Comprehensive update needed
   - **Priority:** HIGH

7. `/apps/examples/token-optimization-demo/README.md`
   - **Issue:** Example code using old cache APIs
   - **Action:** Update examples
   - **Priority:** HIGH

8. `/apps/streamlined-docs/app/api/reference/api-standalone/token-optimization.md`
   - **Issue:** Standalone API reference
   - **Action:** Update cache API documentation
   - **Priority:** MEDIUM

9. `/apps/storybook/README.md`
   - **Issue:** May reference cache stories
   - **Action:** Review and update
   - **Priority:** LOW

10. `/packages/token-optimization/.storybook/hooks/UseTieredCache.mdx`
    - **Issue:** Cache hook documentation
    - **Action:** Verify implementation is current
    - **Priority:** MEDIUM

---

## Category 4: Memory Package Import References

### Files Importing from @clarity-chat/memory

**Status:** Files that import token/cache utilities from the old memory package location

#### Action Required:
- Update imports from `@clarity-chat/memory` to `@clarity-chat/token-optimization`
- Specifically for: `TokenCounter`, `countTokens`, `SemanticChunker`, compression utilities

#### Files:

1. `/CONSOLIDATION_MIGRATION_GUIDE.md`
   - **Issue:** Migration guide itself
   - **Action:** Ensure it's up-to-date
   - **Priority:** HIGH

2. `/docs/clarity-memory/README.md`
   - **Issue:** Memory package documentation
   - **Action:** Add deprecation notice, redirect to new locations
   - **Priority:** HIGH

3. `/docs/clarity-memory/GETTING_STARTED.md`
   - **Issue:** Getting started guide with old imports
   - **Action:** Update to new import paths
   - **Priority:** HIGH

4. `/packages/memory/README.md`
   - **Issue:** Package README
   - **Action:** Add deprecation warnings for moved functionality
   - **Priority:** HIGH

5. `/packages/memory/API.md`
   - **Issue:** API documentation
   - **Action:** Mark deprecated APIs, link to new locations
   - **Priority:** HIGH

6. `/packages/memory/GETTING_STARTED.md`
   - **Issue:** Getting started guide
   - **Action:** Update examples to new packages
   - **Priority:** MEDIUM

7. `/packages/memory/docs/REACT_HOOKS.md`
   - **Issue:** React hooks that may have moved
   - **Action:** Update or mark as deprecated
   - **Priority:** HIGH

8. `/packages/memory/docs/MIGRATION.md`
   - **Issue:** Migration documentation
   - **Action:** Add section on consolidation changes
   - **Priority:** HIGH

9. `/packages/memory/docs/TROUBLESHOOTING.md`
   - **Issue:** Troubleshooting outdated APIs
   - **Action:** Update to reflect consolidation
   - **Priority:** MEDIUM

10. `/packages/memory/docs/MEMORY_TYPES.md`
    - **Issue:** May reference moved token utilities
    - **Action:** Review and update
    - **Priority:** MEDIUM

11. `/packages/memory/docs/SCOPES.md`
    - **Issue:** Scope documentation
    - **Action:** Review for outdated references
    - **Priority:** LOW

12. `/packages/memory/docs/examples/README.md`
    - **Issue:** Example code with old imports
    - **Action:** Update all examples
    - **Priority:** HIGH

13. `/examples/memory-examples/README.md`
    - **Issue:** Example application
    - **Action:** Update to use consolidated APIs
    - **Priority:** HIGH

14. `/packages/react/TUTORIALS.md`
    - **Issue:** React tutorials
    - **Action:** Update import statements and examples
    - **Priority:** MEDIUM

15. `/apps/docs/content/types/search-options.mdx`
    - **Issue:** Type definitions
    - **Action:** Verify correct package references
    - **Priority:** LOW

16. `/apps/docs/content/types/vector-store-config.mdx`
    - **Issue:** Configuration types
    - **Action:** Verify correct package references
    - **Priority:** LOW

17. `/apps/docs/content/api/memory/index.mdx`
    - **Issue:** Memory API documentation
    - **Action:** Add consolidation migration notes
    - **Priority:** HIGH

---

## Category 5: Deprecated Hooks

### Files with Old Hook References

**Status:** References to deprecated React hooks that have been consolidated

#### Deprecated Hooks:
- `useTokenCounter` (React package) → `useTokenCount` (token-optimization package)
- `useTokenCount` variants (4 implementations) → canonical in token-optimization
- `useTokenOptimization` (React package duplicate) → token-optimization version

#### Files:

1. `/apps/docs/content/vitepress-migration/api/hooks.md`
   - **Issue:** Hook API reference
   - **Action:** Update to consolidated hooks
   - **Priority:** HIGH

2. `/packages/token-optimization/.storybook/hooks/UseTokenCount.mdx`
   - **Issue:** Hook documentation
   - **Action:** Verify it's the canonical version
   - **Priority:** HIGH

3. `/packages/token-optimization/.storybook/hooks/UseTokenOptimization.mdx`
   - **Issue:** Hook documentation
   - **Action:** Verify canonical and complete
   - **Priority:** HIGH

4. `/packages/token-optimization/.storybook/hooks/UseTokenBudgetMonitor.mdx`
   - **Issue:** Hook documentation
   - **Action:** Review for deprecated references
   - **Priority:** MEDIUM

5. `/packages/token-optimization/.storybook/hooks/UseModelRouter.mdx`
   - **Issue:** Hook documentation
   - **Action:** Verify current
   - **Priority:** MEDIUM

6. `/packages/token-optimization/.storybook/hooks/UseOptimizationPipeline.mdx`
   - **Issue:** Hook documentation
   - **Action:** Verify current
   - **Priority:** MEDIUM

7. `/docs/architecture.md`
   - **Issue:** Architecture docs with hook examples
   - **Action:** Update to canonical hooks
   - **Priority:** MEDIUM

---

## Category 6: General Utility References

### Files with References to Moved/Consolidated Utilities

**Status:** References to utilities that were consolidated or moved during cleanup

#### Utilities to Check:
- `SemanticChunker` duplicates
- `ValidationError` variants
- Logger implementations
- Error boundary variants
- Various helper functions moved from React/Memory to Utils

#### Files:

1. `/packages/error-handling/docs/ERROR_HANDLING.md`
   - **Issue:** Error handling utilities
   - **Action:** Verify canonical implementations documented
   - **Priority:** MEDIUM

2. `/packages/error-handling/docs/TROUBLESHOOTING.md`
   - **Issue:** Troubleshooting guide
   - **Action:** Update for consolidated errors
   - **Priority:** LOW

3. `/packages/error-handling/docs/MIGRATION.md`
   - **Issue:** Migration guide
   - **Action:** Add consolidation migration info
   - **Priority:** MEDIUM

4. `/packages/error-handling/docs/ARCHITECTURE.md`
   - **Issue:** Architecture documentation
   - **Action:** Update for consolidation
   - **Priority:** MEDIUM

5. `/packages/error-handling/README.md`
   - **Issue:** Package README
   - **Action:** Update examples
   - **Priority:** MEDIUM

6. `/packages/utils/README.md`
   - **Issue:** Utils package README
   - **Action:** Document consolidated utilities
   - **Priority:** HIGH

7. `/packages/utils/MIGRATION.md`
   - **Issue:** Migration guide
   - **Action:** Add consolidation notes
   - **Priority:** MEDIUM

8. `/packages/react/src/components/README.md`
   - **Issue:** Component documentation
   - **Action:** Update for moved utilities
   - **Priority:** MEDIUM

9. `/apps/docs/content/utilities/error-handling.mdx`
   - **Issue:** Error utility docs
   - **Action:** Update to canonical implementations
   - **Priority:** MEDIUM

10. `/apps/docs/content/utilities/format.mdx`
    - **Issue:** Format utilities
    - **Action:** Verify consolidated version
    - **Priority:** LOW

11. `/apps/docs/content/utilities/logging.mdx`
    - **Issue:** Logger documentation
    - **Action:** Update to canonical logger
    - **Priority:** MEDIUM

12. `/apps/docs/content/utilities/message.mdx`
    - **Issue:** Message utilities
    - **Action:** Verify current
    - **Priority:** LOW

---

## Category 7: Example Applications

### Files in Example Apps

**Status:** Example applications that demonstrate usage and may use old APIs

#### Files:

1. `/examples/token-optimization/README.md`
   - **Issue:** Example using token optimization
   - **Action:** Comprehensive update to new APIs
   - **Priority:** HIGH

2. `/examples/headless-mode/README.md`
   - **Issue:** Contains `estimateTokens` usage
   - **Action:** Update to canonical token counting
   - **Priority:** MEDIUM

3. `/apps/examples/streaming-chat/README.md`
   - **Issue:** May use TokenCounter component
   - **Action:** Verify usage is current
   - **Priority:** MEDIUM

4. `/apps/examples/basic-chat/README.md`
   - **Issue:** Basic chat example
   - **Action:** Verify TokenCounter usage
   - **Priority:** MEDIUM

5. `/apps/examples/ai-assistant/README.md`
   - **Issue:** AI assistant example
   - **Action:** Check for deprecated APIs
   - **Priority:** MEDIUM

6. `/apps/examples/happy-path-workflows/README.md`
   - **Issue:** Workflow examples
   - **Action:** Review for deprecated references
   - **Priority:** LOW

7. `/apps/examples/customized-chat/README.md`
   - **Issue:** Customization examples
   - **Action:** Check for old APIs
   - **Priority:** LOW

---

## Category 8: Storybook Documentation

### Storybook Story Documentation

**Status:** Interactive documentation in Storybook that may show outdated examples

#### Files:

1. `/apps/storybook/stories/Components/Overview.mdx`
   - **Issue:** Components overview
   - **Action:** Update component references
   - **Priority:** HIGH

2. `/apps/storybook/stories/Components/TokenCounter/Overview.mdx`
   - **Issue:** TokenCounter component docs
   - **Action:** Verify current implementation
   - **Priority:** HIGH

3. `/apps/storybook/stories/Components/ChatWindow/Overview.mdx`
   - **Issue:** May reference token counting
   - **Action:** Check examples
   - **Priority:** MEDIUM

4. `/apps/storybook/stories/Components/DataDisplay/Overview.mdx`
   - **Issue:** Data display components
   - **Action:** Review for deprecated refs
   - **Priority:** LOW

5. `/apps/storybook/stories/Utilities.mdx`
   - **Issue:** Utilities documentation
   - **Action:** Update to consolidated utils
   - **Priority:** HIGH

6. `/apps/storybook/stories/BestPractices.mdx`
   - **Issue:** Best practices guide
   - **Action:** Update with consolidation best practices
   - **Priority:** MEDIUM

7. `/apps/storybook/stories/FAQ.mdx`
   - **Issue:** FAQ entries
   - **Action:** Update for new APIs
   - **Priority:** MEDIUM

---

## Category 9: API Reference Documentation

### Auto-generated and Manual API Docs

**Status:** API reference documentation that needs updating

#### Files:

1. `/apps/docs/content/api/react/index.mdx`
   - **Issue:** React API reference
   - **Action:** Comprehensive review and update
   - **Priority:** HIGH

2. `/apps/docs/content/vitepress-migration/api/components.md`
   - **Issue:** Components API
   - **Action:** Update component APIs
   - **Priority:** MEDIUM

3. `/apps/docs/content/vitepress-migration/api/utilities.md`
   - **Issue:** Utilities API
   - **Action:** Update to consolidated utilities
   - **Priority:** MEDIUM

4. `/apps/docs/content/guides-migration/api/react-components.md`
   - **Issue:** React components reference
   - **Action:** Update for consolidation
   - **Priority:** MEDIUM

5. `/docs/api-reference.md`
   - **Issue:** General API reference
   - **Action:** Comprehensive update
   - **Priority:** HIGH

---

## Priority Matrix

### HIGH Priority (Must Update) - 25 files
Files with incorrect or misleading API examples that users actively reference:
- Token optimization package documentation
- Component documentation (TokenCounter)
- Hook documentation (useTokenCount, useSmartCache)
- Migration guides
- API references
- Example applications

### MEDIUM Priority (Should Update) - 20 files
Files with deprecated references but less critical:
- Troubleshooting guides
- Architecture documentation
- Type definitions
- Secondary examples

### LOW Priority (Nice to Update) - 15 files
Files with historical or minor references:
- Changelogs (keep history but add notes)
- FAQ entries
- Legacy documentation
- PR descriptions

---

## Recommended Update Strategy

### Phase 1: Critical Documentation (Week 1)
1. Update all token-optimization package docs
2. Fix component documentation (TokenCounter)
3. Update primary migration guide
4. Fix main API references

### Phase 2: Examples & Guides (Week 2)
1. Update all example applications
2. Fix hook documentation
3. Update best practices guides
4. Fix tutorial content

### Phase 3: Secondary Documentation (Week 3)
1. Update type definitions
2. Fix architecture docs
3. Update troubleshooting guides
4. Add deprecation notices to old docs

### Phase 4: Cleanup (Week 4)
1. Review all updates
2. Add cross-references
3. Create migration checklist for users
4. Update changelog

---

## Verification Commands

After updates, run these commands to verify:

```bash
# Check for remaining deprecated API references
rg "DynamicCompressionEngine|BasicCompressionEngine" --glob "*.md" --glob "*.mdx" | grep -v CHANGELOG

# Check for old token counter references
rg "FastTokenCounter|SimpleTokenCounter|AdvancedTokenCounter" --glob "*.md" --glob "*.mdx" | grep -v CHANGELOG

# Check for old memory imports
rg "from '@clarity-chat/memory'" --glob "*.md" --glob "*.mdx" | grep -v "docs/clarity-memory"

# Check for deprecated hooks
rg "useTokenCounter[^)]" --glob "*.md" --glob "*.mdx"
```

---

## Notes

- Some files (like CHANGELOGs) should keep historical references but add deprecation notices
- Migration guides should be preserved and enhanced, not replaced
- Auto-generated documentation may need source code updates to fix
- Example applications should be fully functional with new APIs

---

**Next Steps:**
1. Review this list with team
2. Prioritize based on user impact
3. Create tickets for each category
4. Assign to documentation team
5. Track progress in project board
