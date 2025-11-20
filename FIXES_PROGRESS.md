# Known Issues - Fixes in Progress

## ✅ Issues Fixed

### 1. Docs Package Missing Dependencies
**Status:** ✅ FIXED (Commit f8f1470d)
- ✅ Installed `react-live` for code playground
- ✅ Installed `@heroicons/react` for UI icons  
- ✅ Installed `gray-matter` for frontmatter parsing

### 2. API Route Edge Runtime Issues
**Status:** ✅ FIXED (Commit f8f1470d)
- ✅ Changed docs-assistant from `edge` to `nodejs` runtime
- ✅ Fixed "Can't resolve crypto/fs/promises/path" errors
- ✅ Node.js modules now available for RAG/vector operations

### 3. MDX "source" Property Errors (27 files)
**Status:** ✅ FIXED (Commit f8f1470d)
- ✅ Fixed incompatible MDX rendering approach
- ✅ Replaced `serialize` + client MDXRemote with RSC MDXRemote
- ✅ All 27 guide/blog pages now use correct pattern
- ✅ TypeScript errors resolved

## ⚠️ Remaining Issues

### 4. React Version Conflicts (Build Warnings)
**Status:** ⚠️ IN PROGRESS
**Error:** "A React Element from an older version of React was rendered"
**Affected:** Multiple prerendered pages during static generation
**Likely Cause:** react-live or other deps pre-bundled with React 18
**Impact:** Build fails during static page generation
**Priority:** HIGH - Blocks docs deployment

**Pages Affected:**
- /blog/viral-strategies-research
- /guides/message-operations  
- /guides/webhooks

### 5. Playground ToastProvider Missing
**Status:** ⚠️ IN PROGRESS
**Error:** "useToast must be used within ToastProvider"
**Affected:** /playground page
**Fix Needed:** Wrap playground page/layout with ToastProvider
**Priority:** MEDIUM - Feature-specific

### 6. React Package Tests (Pre-existing)
**Status:** 📋 DEFERRED
- 127 tests failing (React 19 compatibility)
- Memory limit errors in test workers
- Not blocking package functionality
**Priority:** LOW - Tests only, build succeeds

## Summary

**Fixed:** 3 major issues (dependencies, edge runtime, MDX)
**Remaining:** 2 build blockers (React versions, ToastProvider)
**Deferred:** 1 test suite issue (not blocking)

**Next Steps:**
1. Investigate React version conflict (react-live)
2. Add ToastProvider to playground
3. Attempt full docs build

**Commits:**
- 312ecb0f - Phase 6L DTS fixes (38 files)
- c8fb834b - Phase 6L complete (5 files)
- 8fe0d738 - Phase 6L documentation
- f8f1470d - Docs MDX and edge runtime fixes (30 files)
