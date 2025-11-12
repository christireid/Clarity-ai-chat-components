# Target Architecture Report
**Generated:** $(date)  
**Phase:** 3 - Define Target Architecture

## Executive Summary

This document defines the target repository structure that eliminates duplication and follows modern monorepo best practices. It maps current locations to target locations with clear migration paths.

---

## Architecture Principles

1. **Single Source of Truth:** One documentation site, one Storybook, one changelog
2. **Logical Grouping:** Apps, packages, examples clearly separated
3. **Discoverability:** Clear structure, consistent naming
4. **No Duplication:** Eliminate all overlapping content
5. **Archive Old Content:** Preserve history without cluttering active structure

---

## Target Directory Structure

```
/workspace/
├── apps/                          # All applications
│   ├── docs-site/                 # ✅ UNIFIED documentation (Next.js)
│   │   ├── app/
│   │   │   ├── blog/              # Blog content (moved from /blog)
│   │   │   ├── commercial/        # Commercial docs (moved from /commercial-docs)
│   │   │   ├── cookbook/          # Cookbook (consolidated)
│   │   │   ├── examples/          # Example docs
│   │   │   ├── guides/            # Guides (consolidated)
│   │   │   ├── learn/             # Learning content
│   │   │   ├── reference/         # API reference
│   │   │   └── tools/             # Tools documentation
│   │   └── ...
│   ├── examples/                  # ✅ All example apps (moved from /examples)
│   │   ├── advanced-chat-features/
│   │   ├── ai-assistant/
│   │   ├── basic-chat/
│   │   └── ... (all 30+ examples)
│   ├── marketing-site/            # Marketing website
│   └── storybook/                 # ✅ UNIFIED Storybook
│       ├── .storybook/
│       └── stories/
│           ├── components/         # Main component stories
│           ├── error-handling/     # Error handling stories (moved)
│           └── primitives/         # Primitive stories
│
├── packages/                       # All library packages
│   ├── cli/                       # CLI tool
│   ├── codemods/                  # Code transformation tools
│   ├── dev-tools/                 # Developer tools
│   ├── error-handling/            # Error handling (no .storybook)
│   ├── errors/                    # Error utilities
│   ├── licensing/                 # Licensing utilities
│   ├── memory/                    # Memory management
│   ├── mcp-server/                # ✅ MCP server (moved from root)
│   ├── playground/                # Interactive playground
│   ├── primitives/                # Primitive components
│   ├── react/                     # Main React library
│   ├── testing-utils/             # Testing utilities
│   └── types/                     # TypeScript types
│
├── archive/                        # ✅ NEW: Archived content
│   ├── completion-reports/        # Old completion reports
│   ├── enhancement-reports/       # Old enhancement reports
│   ├── status-reports/            # Old status reports
│   ├── planning/                  # Old planning documents
│   └── package-reports/           # Package-level reports
│
├── scripts/                        # Build and dev scripts
│   ├── analyze-bundle.js
│   ├── benchmark.js
│   └── ...
│
├── tests/                          # Test suites
│   ├── integration/
│   ├── e2e/
│   └── visual/
│
├── infrastructure/                 # Infrastructure files
│
├── .changeset/                     # Changeset config
│
├── CHANGELOG.md                    # ✅ SINGLE changelog (consolidated)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                         # ✅ SINGLE license files
├── LICENSE-ENTERPRISE.md
├── LICENSE-PRO.md
├── README.md                       # Main README
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

---

## Migration Map: Current → Target

### 1. Documentation Consolidation

#### 1.1 Primary Documentation Site
**Target:** `apps/docs-site` (Next.js - keep and enhance)

**Actions:**
- ✅ **KEEP:** `apps/docs-site` as unified documentation
- **MERGE:** Content from `apps/docs/` into `apps/docs-site/app/`
- **MERGE:** Unique content from `/docs` into `apps/docs-site/app/`
- **DELETE:** `apps/docs/` after migration
- **DELETE:** `/docs/` after migration

**Content Mapping:**
```
apps/docs/guide/*.md          → apps/docs-site/app/guides/*/
apps/docs/api/*.md            → apps/docs-site/app/reference/*/
apps/docs/examples/*.md       → apps/docs-site/app/examples/*/
apps/docs/integrations/*.md   → apps/docs-site/app/integrations/*/
docs/api/*.md                 → apps/docs-site/app/reference/*/
docs/guides/*.md              → apps/docs-site/app/guides/*/
docs/enterprise/*.md           → apps/docs-site/app/commercial/enterprise/
docs/research/*.md             → apps/docs-site/app/research/ (or archive)
```

#### 1.2 Getting Started Guides
**Target:** `apps/docs-site/app/learn/quick-start/`

**Actions:**
- **MERGE:** Best content from `QUICK_START_GUIDE.md` into docs site
- **MERGE:** Content from `apps/docs/guide/getting-started.md`
- **MERGE:** Content from `apps/docs/guide/quick-start.md`
- **DELETE:** All source files after migration

#### 1.3 Cookbook
**Target:** `apps/docs-site/app/cookbook/`

**Actions:**
- **KEEP:** `apps/docs-site/app/cookbook/` (most complete)
- **MERGE:** Content from `COOKBOOK_MODERNIZED.md` if needed
- **DELETE:** `apps/docs/cookbook.md`
- **ARCHIVE:** `COOKBOOK*.md` status files

#### 1.4 Design System Documentation
**Target:** `apps/docs-site/app/guides/design-system/`

**Actions:**
- **MERGE:** `DESIGN_SYSTEM_GUIDE_V2.md` into docs site
- **KEEP:** `DESIGN_SYSTEM_QUICK_REFERENCE.md` as separate page if unique
- **DELETE:** `DESIGN_SYSTEM_GUIDE.md` (superseded)
- **ARCHIVE:** Old versions if needed

---

### 2. Storybook Consolidation

**Target:** `apps/storybook` (unified)

**Actions:**
- ✅ **KEEP:** `apps/storybook` as main Storybook
- **MOVE:** Stories from `packages/error-handling/src/**/*.stories.*` to `apps/storybook/stories/error-handling/`
- **DELETE:** `packages/error-handling/.storybook/` after migration
- **UPDATE:** `apps/storybook/.storybook/main.ts` to include error-handling stories

**Story Organization:**
```
apps/storybook/stories/
├── components/           # Main React components
├── primitives/           # Primitive components
├── error-handling/       # Error handling (moved)
└── hooks/                # Hook stories
```

---

### 3. Examples Reorganization

**Target:** `apps/examples/`

**Actions:**
- **MOVE:** All `/examples/*` to `/apps/examples/*`
- **ORGANIZE:** Keep current structure, ensure all have package.json
- **CLEAN:** Remove or mark placeholder examples clearly

**Example Structure:**
```
apps/examples/
├── basic-chat/
├── advanced-chat-features/
├── ai-assistant/
├── ... (all 30+ examples)
└── README.md              # Examples index
```

---

### 4. Blog Integration

**Target:** `apps/docs-site/app/blog/`

**Actions:**
- **MOVE:** `/blog/*.md` to `apps/docs-site/app/blog/`
- **MOVE:** `/blog/animations/` to `apps/docs-site/app/blog/animations/`
- **MOVE:** `/blog/assets/` to `apps/docs-site/app/blog/assets/`
- **DELETE:** `/blog/` after migration

**Alternative:** If blog should be separate app:
- **MOVE:** `/blog/` to `apps/blog/` (new blog app)

---

### 5. Commercial Documentation

**Target:** `apps/docs-site/app/commercial/`

**Actions:**
- **MOVE:** `/commercial-docs/*.md` to `apps/docs-site/app/commercial/`
- **DELETE:** `/commercial-docs/` after migration

**Structure:**
```
apps/docs-site/app/commercial/
├── pricing.md
├── case-studies.md
├── implementation-guide.md
├── terms-of-service.md
├── privacy-policy.md
└── sales-deck-outline.md
```

---

### 6. Changelog Consolidation

**Target:** `CHANGELOG.md` (root)

**Actions:**
- ✅ **KEEP:** `CHANGELOG.md` as main changelog
- **MERGE:** `CHANGELOG_V2.1.md` entries chronologically into `CHANGELOG.md`
- **MERGE:** Relevant entries from `COMPREHENSIVE_CHANGELOG.md`
- **DELETE:** `CHANGELOG_V2.1.md` after merge
- **ARCHIVE:** `COMPREHENSIVE_CHANGELOG.md` (or delete if fully merged)

---

### 7. Status/Report Files Cleanup

**Target:** `archive/` (new directory)

**Actions:**
- **CREATE:** `/archive/` directory structure
- **MOVE:** All completion/enhancement/status reports to archive
- **ORGANIZE:** By category in archive subdirectories

**Archive Structure:**
```
archive/
├── completion-reports/     # Mission complete, launch reports
├── enhancement-reports/    # Feature enhancement reports
├── status-reports/         # Build, cleanup, modernization status
├── planning/               # Planning and research docs
└── package-reports/        # Package-level reports
```

**Files to Archive:**
- All `🎉_*.md`, `🎊_*.md`, `🏁_*.md`, `🏆_*.md`, `🚀_*.md` files
- All `*_COMPLETE*.md`, `*_SUMMARY.md`, `*_STATUS.md` files
- All `*_PLAN.md`, `*_RESEARCH.md` files
- Package-level status reports

**Files to Delete:**
- Truly obsolete reports (after review)
- Duplicate status files

---

### 8. License Files

**Target:** Root level (keep standard location)

**Actions:**
- ✅ **KEEP:** `/LICENSE`, `/LICENSE-ENTERPRISE.md`, `/LICENSE-PRO.md`
- **DELETE:** `/commercial-docs/LICENSE*` (duplicates)
- **REFERENCE:** Commercial licenses from root in commercial docs

---

### 9. MCP Server

**Target:** `packages/mcp-server/` (for consistency)

**Actions:**
- **OPTION A:** Move `/mcp-server/` to `/packages/mcp-server/`
- **OPTION B:** Keep at root if special case
- **CLEAN:** Remove status reports from mcp-server

**Recommendation:** Move to packages for consistency

---

### 10. Package Documentation

**Target:** Keep package-level READMEs, consolidate subdirectory docs

**Actions:**
- ✅ **KEEP:** All package `README.md` files (standard practice)
- **MERGE:** Subdirectory READMEs into main package README or docs site
- **CONSOLIDATE:** Package-specific docs into unified docs site where appropriate

**Examples:**
- `packages/react/src/memory/README.md` → Merge into docs site or package README
- `packages/error-handling/docs/*.md` → Merge into docs site

---

## File Deletion List

### High Priority Deletions (After Migration)

1. **Documentation:**
   - `apps/docs/` (entire directory after migration)
   - `/docs/` (entire directory after migration)
   - `QUICK_START_GUIDE.md` (after merge)
   - `apps/docs/guide/getting-started.md` (after merge)
   - `apps/docs/guide/quick-start.md` (after merge)
   - `apps/docs/cookbook.md` (after merge)

2. **Storybook:**
   - `packages/error-handling/.storybook/` (after migration)

3. **Changelogs:**
   - `CHANGELOG_V2.1.md` (after merge)
   - `COMPREHENSIVE_CHANGELOG.md` (after merge or archive)

4. **Design System:**
   - `DESIGN_SYSTEM_GUIDE.md` (superseded by V2)

5. **Cookbook:**
   - `COOKBOOK.md` (if superseded)
   - `apps/docs/cookbook.md` (after merge)

6. **Licenses:**
   - `/commercial-docs/LICENSE*` (duplicates)

7. **Blog:**
   - `/blog/` (entire directory after migration)

8. **Commercial Docs:**
   - `/commercial-docs/` (entire directory after migration)

9. **Examples:**
   - `/examples/` (entire directory after move)

---

## Archive List

### Files to Archive (Move to `/archive/`)

**Completion Reports:**
- `🎉_MISSION_COMPLETE_V2.md`
- `🎉_REACT_19_COMPLETE.md`
- `🎊_COMPLETE_SUCCESS_REPORT.md`
- `🏁_FINAL_STATUS_REACT_19_AND_LAUNCH.md`
- `🏆_MASTER_COMPLETION_SUMMARY.md`
- `🚀_LAUNCH_NOW.md`

**Enhancement Reports:**
- `AI_CHAT_*` (5 files)
- `CLI_UX_ENHANCEMENT_COMPLETE.md`
- `COMMAND_PALETTE_INTEGRATION_COMPLETE.md`
- `DOCS_ENHANCEMENT_*` (3 files)
- `ENHANCEMENT_*` (2 files)
- `REACT_19_DEV_TOOLS_*` (2 files)

**Status Reports:**
- `APPLICATION_BUILDS_STATUS.md`
- `BUILD_AND_SETUP_COMPLETE_SUMMARY.md`
- `CLEANUP_*` (2 files)
- `CODEBASE_CLEANUP_COMPLETE.md`
- `COMPLETE_BUILD_SUCCESS_REPORT.md`
- `COMPREHENSIVE_STATUS_REPORT.md`
- `MODERNIZATION_*` (5 files)
- `PHASE_2_COMPONENTS_STATUS.md`
- `PRIORITY_1_PROGRESS.md`
- `PNPM_WORKSPACE_BUILD_SUCCESS.md`

**Planning/Research:**
- `🎯_WHAT_TO_DO_NEXT.md`
- `COMPETITIVE_ANALYSIS.md`
- `DOCS_ENHANCEMENT_PLAN.md`
- `DOCS_ENHANCEMENT_RESEARCH.md`
- `ENHANCEMENT_IMPLEMENTATION_PLAN.md`
- `FIX_ALL_WARNINGS_STRATEGY.md`

**Package Reports:**
- `packages/cli/*_*.md` (10+ enhancement reports)
- `mcp-server/*_*.md` (enhancement reports)

---

## Import/Reference Updates Required

### 1. Package.json Updates

**Root `package.json`:**
- Update workspace paths if examples move
- Update scripts if paths change

**Example package.json files:**
- Update import paths if package locations change

### 2. Storybook Configuration

**`apps/storybook/.storybook/main.ts`:**
- Add error-handling stories path
- Update story paths if reorganized

### 3. Documentation Links

**All documentation:**
- Update internal links after consolidation
- Update navigation after reorganization

### 4. README Files

**Root and package READMEs:**
- Update links to documentation
- Update example paths
- Update Storybook links

---

## Migration Checklist

### Phase 1: Documentation Consolidation
- [ ] Merge `apps/docs/` content into `apps/docs-site/`
- [ ] Merge `/docs/` content into `apps/docs-site/`
- [ ] Consolidate getting started guides
- [ ] Consolidate cookbook content
- [ ] Consolidate design system docs
- [ ] Delete `apps/docs/` directory
- [ ] Delete `/docs/` directory
- [ ] Update all documentation links

### Phase 2: Storybook Consolidation
- [ ] Move error-handling stories to main Storybook
- [ ] Update Storybook configuration
- [ ] Delete `packages/error-handling/.storybook/`
- [ ] Test Storybook build

### Phase 3: Examples Reorganization
- [ ] Move `/examples/` to `/apps/examples/`
- [ ] Update workspace configuration
- [ ] Update example references
- [ ] Clean up placeholder examples

### Phase 4: Content Integration
- [ ] Move blog to docs site
- [ ] Move commercial docs to docs site
- [ ] Delete source directories
- [ ] Update links

### Phase 5: Changelog Consolidation
- [ ] Merge changelog files
- [ ] Delete duplicate changelogs
- [ ] Update changelog references

### Phase 6: Archive Creation
- [ ] Create `/archive/` structure
- [ ] Move status/report files to archive
- [ ] Organize by category
- [ ] Update any references

### Phase 7: Cleanup
- [ ] Delete duplicate license files
- [ ] Move MCP server (optional)
- [ ] Consolidate package docs
- [ ] Final cleanup

### Phase 8: Verification
- [ ] Update all imports
- [ ] Update all links
- [ ] Test builds
- [ ] Test documentation site
- [ ] Test Storybook
- [ ] Verify examples work

---

## Benefits of Target Architecture

1. **Single Documentation Site:** One place for all docs, easier to maintain
2. **Unified Storybook:** All component stories in one place
3. **Clean Root:** No clutter from status files
4. **Logical Organization:** Clear separation of apps, packages, examples
5. **Better Discoverability:** Consistent structure, clear naming
6. **Easier Maintenance:** Less duplication, single source of truth
7. **Professional Appearance:** Clean, organized repository

---

## Next Steps

Proceed to **Phase 4: Merge, Condense, Clean** to execute the migration according to this architecture.
