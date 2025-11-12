# Duplication Map Report
**Phase 2: Detect Duplication**

Generated: $(date)

## Executive Summary

This report identifies all duplicated files, folders, packages, and overlapping content across the repository. Each duplication group includes paths, purpose analysis, and recommended actions.

---

## 1. Documentation Systems (CRITICAL DUPLICATION)

### 1.1 Primary Documentation Sites

**Group**: Two separate documentation systems serving the same purpose

**Duplicates**:
1. **`apps/docs`** (VitePress)
   - Technology: VitePress, Vue 3
   - Purpose: Documentation site
   - Content: API docs, guides, examples, integrations, cookbook
   - Status: Simpler, less feature-rich

2. **`apps/docs-site`** (Next.js)
   - Technology: Next.js 16, React 19, MDX
   - Purpose: Documentation site (more feature-rich)
   - Content: Cookbook, examples, guides, learn, reference, tools, playground
   - Status: More advanced, interactive features

**Analysis**:
- Both serve as primary documentation sites
- `apps/docs-site` is more feature-rich with interactive components, playground, tools
- `apps/docs` is simpler but functional
- Content overlaps significantly (guides, cookbook, examples)

**Recommendation**: 
- **KEEP**: `apps/docs-site` (Next.js) - more features, better UX
- **REMOVE**: `apps/docs` (VitePress) - migrate any unique content to docs-site
- **ACTION**: Merge any unique VitePress content into Next.js docs-site

---

### 1.2 Standalone Documentation Directories

**Group**: Multiple root-level documentation directories

**Duplicates**:
1. **`/docs`** (17 files)
   - `/api` - API documentation (4 files)
   - `/enterprise` - Enterprise docs (2 files)
   - `/guides` - Guides (5 files)
   - `/research` - Research docs (5 files)
   - `TOKEN_OPTIMIZATION_QUICK_REFERENCE.md`

2. **`/blog`** (21 files)
   - Blog posts (MD files)
   - `/animations` - Animation demos (8 HTML files)
   - `/assets` - Asset demos (7 HTML files)

3. **`/commercial-docs`** (10 files)
   - License files, pricing, terms, privacy
   - Sales deck, implementation guide

**Analysis**:
- `/docs` contains API docs, guides, and research that may overlap with `apps/docs-site`
- `/blog` is standalone blog content (should be integrated into docs-site)
- `/commercial-docs` is commercial-specific (should be integrated into docs-site or kept separate)

**Recommendation**:
- **MERGE** `/docs` content into `apps/docs-site` (check for duplicates first)
- **INTEGRATE** `/blog` into `apps/docs-site/app/blog` or keep as separate blog app
- **KEEP** `/commercial-docs` separate OR integrate into docs-site under `/commercial` section

---

## 2. Storybook Instances (DUPLICATION)

### 2.1 Multiple Storybook Configurations

**Group**: Two separate Storybook instances

**Duplicates**:
1. **`apps/storybook`** (Main Storybook)
   - Location: `apps/storybook/.storybook/`
   - Stories: 138 files (119 TSX, 11 MDX, 8 disabled)
   - Purpose: Main component library Storybook
   - Config: Full-featured with aliases, addons

2. **`packages/error-handling/.storybook`** (Package-specific Storybook)
   - Location: `packages/error-handling/.storybook/`
   - Stories: Unknown count (in `src/**/*.stories.*`)
   - Purpose: Error handling package-specific stories
   - Config: Basic configuration

**Analysis**:
- Main Storybook already includes error-handling components
- Separate Storybook for a single package is unnecessary
- Creates maintenance burden and confusion

**Recommendation**:
- **KEEP**: `apps/storybook` (main instance)
- **REMOVE**: `packages/error-handling/.storybook`
- **MIGRATE**: Move error-handling stories to `apps/storybook/stories/error-handling/`
- **UPDATE**: Remove Storybook dependencies from `packages/error-handling/package.json`

---

## 3. Error Handling Packages (POTENTIAL OVERLAP)

### 3.1 Error Packages

**Group**: Two error-related packages

**Duplicates**:
1. **`packages/error-handling`** (`@clarity-chat/error-handling`)
   - Version: 2.0.0
   - Purpose: Comprehensive error handling system for React 19
   - Features: Error boundaries, recovery hooks, specialized error classes
   - Tech: React 19, TypeScript, has its own Storybook

2. **`packages/errors`** (`@clarity-chat/errors`)
   - Version: 1.0.0
   - Purpose: Enhanced error handling with developer-friendly messages
   - Features: Clear error messages, actionable solutions, code examples
   - Tech: TypeScript, framework-agnostic

**Analysis**:
- `error-handling` is React-specific (React 19 components, hooks, boundaries)
- `errors` is framework-agnostic (error classes, utilities)
- They serve different but complementary purposes
- However, there may be overlap in error class definitions

**Recommendation**:
- **VERIFY**: Check if error classes overlap
- **KEEP BOTH**: If they serve distinct purposes (React components vs utilities)
- **MERGE**: If there's significant overlap, merge into single package with clear separation
- **RENAME**: Consider `@clarity-chat/error-handling` (React) and `@clarity-chat/error-utils` (agnostic)

---

## 4. Cookbook Files (DUPLICATION)

### 4.1 Multiple Cookbook Versions

**Group**: Multiple cookbook files with overlapping content

**Duplicates**:
1. **`/COOKBOOK.md`** (Root)
   - Size: Large (5400+ lines)
   - Content: 33+ recipes and patterns
   - Status: Original version

2. **`/COOKBOOK_MODERNIZED.md`** (Root)
   - Size: Large (850+ lines visible)
   - Content: 33+ recipes (modernized edition)
   - Status: Updated version

3. **`/COOKBOOK_MODERNIZATION_COMPLETE.md`** (Root)
   - Status: Completion report

4. **`/COOKBOOK_MODERNIZATION_PLAN.md`** (Root)
   - Status: Planning document

5. **`apps/docs/cookbook.md`** (VitePress docs)
   - Content: Cookbook content referencing main COOKBOOK.md

6. **`apps/docs-site/app/cookbook/`** (Next.js docs)
   - Content: Multiple cookbook pages (20+ pages)

**Analysis**:
- Multiple versions of cookbook content
- Root-level cookbook files are status/planning documents
- Actual cookbook content is in docs sites

**Recommendation**:
- **ARCHIVE**: `/COOKBOOK.md`, `/COOKBOOK_MODERNIZED.md` (move to `/archive/`)
- **ARCHIVE**: `/COOKBOOK_MODERNIZATION_*.md` (status files)
- **KEEP**: `apps/docs-site/app/cookbook/` (Next.js docs-site version)
- **REMOVE**: `apps/docs/cookbook.md` (VitePress docs will be removed)

---

## 5. Design System Documentation (DUPLICATION)

### 5.1 Multiple Design System Guides

**Group**: Multiple design system documentation files

**Duplicates**:
1. **`/DESIGN_SYSTEM_GUIDE.md`** (Root)
2. **`/DESIGN_SYSTEM_GUIDE_V2.md`** (Root)
3. **`/DESIGN_SYSTEM_QUICK_REFERENCE.md`** (Root)
4. **`/COMPONENT_PATTERNS_GUIDE.md`** (Root)
5. **`apps/docs-site/app/learn/guides/styling/page.tsx`** (Next.js docs)
6. **`apps/storybook/stories/DesignPrinciples.mdx`** (Storybook)
7. **`apps/storybook/stories/Theming.mdx`** (Storybook)
8. **`packages/react/src/theme/design-tokens.ts`** (Source code)

**Analysis**:
- Multiple versions of design system documentation
- Content scattered across root, docs-site, and Storybook
- No single source of truth

**Recommendation**:
- **CONSOLIDATE**: Create single design system section in `apps/docs-site/app/design-system/`
- **ARCHIVE**: Root-level design system files (move to `/archive/`)
- **MERGE**: Consolidate Storybook design docs into main docs-site
- **REFERENCE**: Keep `design-tokens.ts` as source of truth, generate docs from it

---

## 6. Status/Report Files (MASSIVE DUPLICATION)

### 6.1 Root-Level Status Files

**Group**: 50+ status, completion, and report markdown files at root

**Duplicates**: (See full list in Phase 1 inventory)

**Categories**:
1. **Completion Reports** (20+ files)
   - `🎉_MISSION_COMPLETE_V2.md`
   - `🎉_REACT_19_COMPLETE.md`
   - `🎊_COMPLETE_SUCCESS_REPORT.md`
   - `🏆_MASTER_COMPLETION_SUMMARY.md`
   - `🏁_FINAL_STATUS_REACT_19_AND_LAUNCH.md`
   - `🚀_LAUNCH_NOW.md`
   - `AI_CHAT_ENHANCEMENTS_COMPLETE.md`
   - `AI_CHAT_ENHANCEMENTS_FINAL.md`
   - `AI_CHAT_ENHANCEMENTS_FINAL_SUMMARY.md`
   - `CLI_UX_ENHANCEMENT_COMPLETE.md`
   - `CODEBASE_CLEANUP_COMPLETE.md`
   - `COMMAND_PALETTE_INTEGRATION_COMPLETE.md`
   - `COMPLETE_BUILD_SUCCESS_REPORT.md`
   - `DOCS_ENHANCEMENT_COMPLETE.md`
   - `DOCS_ENHANCEMENT_FINAL_SUMMARY.md`
   - `ENHANCEMENT_COMPLETE_SUMMARY.md`
   - `EXAMPLES_FIXES_SUMMARY.md`
   - `FEATURE_COMPLETENESS_REPORT.md`
   - `HOOKS_CLEANUP_SUMMARY.md`
   - `ICON_FIXES_COMPLETE.md`
   - `MODERNIZATION_COMPLETE_SUMMARY.md`
   - `MODERNIZATION_FINAL_REPORT.md`
   - `REACT_19_DEV_TOOLS_COMPLETE.md`
   - `REACT_19_DEV_TOOLS_ENHANCEMENT_COMPLETE.md`

2. **Planning/Research Documents** (15+ files)
   - `AI_CHAT_RESEARCH_AND_ENHANCEMENT.md`
   - `DOCS_ENHANCEMENT_PLAN.md`
   - `DOCS_ENHANCEMENT_RESEARCH.md`
   - `ENHANCEMENT_IMPLEMENTATION_PLAN.md`
   - `MODERNIZATION_CHECKLIST.md`
   - `MODERNIZATION_PROGRESS.md`
   - `MODERNIZATION_STATUS.md`
   - `PHASE_2_COMPONENTS_STATUS.md`
   - `PRIORITY_1_PROGRESS.md`
   - `REACT_19_REFACTORING_PLAN.md`
   - `REACT_19_ENHANCEMENT_PLAN.md`
   - `COOKBOOK_MODERNIZATION_PLAN.md`

3. **Guide/Reference Files** (15+ files)
   - `ARCHITECTURE_OVERVIEW.md`
   - `CHANGELOG.md`
   - `CHANGELOG_V2.1.md`
   - `COMPREHENSIVE_CHANGELOG.md`
   - `COMPREHENSIVE_STATUS_REPORT.md`
   - `COMPREHENSIVE_USAGE_GUIDE.md`
   - `DEPLOYMENT_GUIDE.md`
   - `MIGRATION_GUIDE_V2.md`
   - `PERFORMANCE_GUIDE.md`
   - `QUICK_START_GUIDE.md`
   - `TROUBLESHOOTING.md`
   - `EXAMPLES_UPDATE_GUIDE.md`
   - `FIX_ALL_WARNINGS_STRATEGY.md`
   - `GITHUB_RELEASE.md`
   - `LAUNCH_CHECKLIST.md`

**Analysis**:
- These are historical status/report files from development
- They clutter the root directory
- Some may contain useful information, but most are outdated

**Recommendation**:
- **ARCHIVE ALL**: Move to `/archive/status-reports/` directory
- **KEEP**: Only essential files like `CHANGELOG.md`, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- **CONSOLIDATE**: Merge multiple changelogs into single `CHANGELOG.md`
- **REMOVE**: Emoji-prefixed files (temporary status indicators)

---

## 7. Guide Files (OVERLAP)

### 7.1 Multiple Guide Locations

**Group**: Guides scattered across multiple locations

**Duplicates**:
1. **`apps/docs/guide/`** (VitePress) - 30+ guide files
2. **`apps/docs-site/app/guides/`** (Next.js) - Multiple guide pages
3. **`apps/docs-site/app/learn/guides/`** (Next.js) - Learning guides
4. **`/docs/guides/`** (Root) - 5 guide files
5. **`/QUICK_START_GUIDE.md`** (Root)
6. **`/PERFORMANCE_GUIDE.md`** (Root)
7. **`/MIGRATION_GUIDE_V2.md`** (Root)
8. **`/DEPLOYMENT_GUIDE.md`** (Root)

**Analysis**:
- Guides exist in multiple locations with potential overlap
- Root-level guides may duplicate content in docs sites

**Recommendation**:
- **CONSOLIDATE**: All guides into `apps/docs-site/app/guides/`
- **ARCHIVE**: Root-level guide files (move to `/archive/`)
- **REMOVE**: `apps/docs/guide/` (VitePress docs will be removed)
- **VERIFY**: Check for content overlap before archiving

---

## 8. Changelog Files (DUPLICATION)

### 8.1 Multiple Changelogs

**Group**: Multiple changelog files

**Duplicates**:
1. **`/CHANGELOG.md`** (Root)
2. **`/CHANGELOG_V2.1.md`** (Root)
3. **`/COMPREHENSIVE_CHANGELOG.md`** (Root)
4. **`packages/cli/CHANGELOG.md`**
5. **`packages/dev-tools/CHANGELOG.md`**

**Analysis**:
- Multiple root-level changelogs
- Package-level changelogs are appropriate

**Recommendation**:
- **MERGE**: Root-level changelogs into single `CHANGELOG.md`
- **KEEP**: Package-level changelogs (standard practice)
- **ARCHIVE**: Old changelog versions

---

## 9. Example Applications (ORGANIZATIONAL ISSUE)

### 9.1 Examples Location

**Group**: Examples in `/examples` but workspace includes `examples/*`

**Analysis**:
- Examples are correctly located in `/examples`
- Workspace config includes `examples/*` which is correct
- Some examples are stubs (README only)

**Recommendation**:
- **KEEP**: Current structure is fine
- **EVALUATE**: Stub examples - either implement or remove
- **ORGANIZE**: Consider grouping by category (e.g., `/examples/basic/`, `/examples/advanced/`)

---

## 10. Package-Level Documentation (SCATTERED)

### 10.1 Package READMEs and Docs

**Group**: Package-level documentation scattered

**Duplicates**:
- Each package has `README.md` (appropriate)
- Some packages have additional docs:
  - `packages/error-handling/docs/` (2 MD files)
  - `packages/dev-tools/INTEGRATION_GUIDE.md`
  - `packages/dev-tools/QUICK_START.md`
  - `packages/dev-tools/USAGE_EXAMPLES.md`
  - `packages/dev-tools/REACT_19_MIGRATION.md`
  - `packages/cli/` (multiple status files)

**Analysis**:
- Package READMEs are standard and should be kept
- Additional package docs may duplicate main docs-site content

**Recommendation**:
- **KEEP**: Package READMEs (essential)
- **EVALUATE**: Additional package docs - link to main docs-site if duplicated
- **ARCHIVE**: Package-level status files (move to `/archive/`)

---

## 11. License Files (MULTIPLE LOCATIONS)

### 11.1 License Files

**Group**: License files in multiple locations

**Duplicates**:
1. **`/LICENSE`** (Root) - Main license
2. **`/LICENSE-ENTERPRISE.md`** (Root)
3. **`/LICENSE-PRO.md`** (Root)
4. **`/commercial-docs/LICENSE`**
5. **`/commercial-docs/LICENSE-ENTERPRISE.md`**

**Analysis**:
- License files exist in root and commercial-docs
- Some duplication

**Recommendation**:
- **KEEP**: Root-level licenses (standard location)
- **REMOVE**: Duplicates in commercial-docs (or consolidate)
- **ORGANIZE**: Keep all licenses in root, reference from commercial-docs

---

## 12. Configuration Files (MINOR DUPLICATION)

### 12.1 Lock Files

**Group**: Multiple package manager lock files

**Duplicates**:
1. **`/package-lock.json`** (NPM)
2. **`/pnpm-lock.yaml`** (PNPM)

**Analysis**:
- Repository uses PNPM (primary)
- NPM lockfile is legacy

**Recommendation**:
- **REMOVE**: `/package-lock.json` (NPM lockfile)
- **KEEP**: `/pnpm-lock.yaml` (PNPM is primary)

---

## Summary of Actions

### Critical Actions (Must Do)
1. ✅ **Consolidate Documentation**: Merge `apps/docs` into `apps/docs-site`, remove VitePress docs
2. ✅ **Unify Storybook**: Remove `packages/error-handling/.storybook`, migrate stories to main Storybook
3. ✅ **Archive Status Files**: Move 50+ root-level status/report files to `/archive/status-reports/`
4. ✅ **Consolidate Cookbook**: Keep only `apps/docs-site/app/cookbook/`, archive root cookbook files
5. ✅ **Merge Changelogs**: Consolidate root-level changelogs into single `CHANGELOG.md`

### Important Actions (Should Do)
6. ✅ **Consolidate Guides**: Merge all guides into `apps/docs-site/app/guides/`
7. ✅ **Organize Design System Docs**: Create single design system section in docs-site
8. ✅ **Verify Error Packages**: Check overlap between `error-handling` and `errors` packages
9. ✅ **Integrate Blog**: Move blog content into docs-site or create separate blog app
10. ✅ **Remove NPM Lockfile**: Delete `package-lock.json`

### Optional Actions (Nice to Have)
11. ✅ **Organize Examples**: Group examples by category
12. ✅ **Clean Package Docs**: Evaluate package-level additional docs for duplication
13. ✅ **Consolidate Licenses**: Organize license files

---

## Duplication Statistics

- **Documentation Systems**: 2 (should be 1)
- **Storybook Instances**: 2 (should be 1)
- **Root Status Files**: 50+ (should be ~5)
- **Cookbook Files**: 6+ (should be 1 location)
- **Design System Docs**: 8+ (should be 1 location)
- **Guide Files**: 8+ locations (should be 1)
- **Changelog Files**: 3 root-level (should be 1)
- **Lock Files**: 2 (should be 1)

---

**Report Generated**: Phase 2 Complete
**Status**: Ready for Phase 3 (Target Architecture Design)
