# 📋 DOCUMENTATION CLEANUP & DEDUPLICATION PLAN

**Goal**: Clean, organized repository with contextual READMEs and single source of truth (docs-site)

**Principles**:
1. **apps/docs-site/** = Ultimate source of truth for all technical documentation
2. **Storybook** = Component demos and visual documentation
3. **Contextual READMEs** = Package/directory-level developer docs
4. **Root README.md** = Main project overview
5. **Delete all** status reports, plans, summaries, and temporary files

---

## PHASE 1: DELETE STATUS REPORTS & TEMPORARY FILES

### Root Directory - Delete (58 files)

**Status Reports & Completion Summaries** (42 files):
```bash
rm AI_CHAT_CONTINUATION_SUMMARY.md
rm AI_CHAT_ENHANCEMENTS_COMPLETE.md
rm AI_CHAT_ENHANCEMENTS_FINAL.md
rm AI_CHAT_ENHANCEMENTS_FINAL_SUMMARY.md
rm AI_CHAT_RESEARCH_AND_ENHANCEMENT.md
rm APPLICATION_BUILDS_STATUS.md
rm BUILD_AND_SETUP_COMPLETE_SUMMARY.md
rm CLEANUP_PROGRESS.md
rm CLEANUP_SUMMARY.md
rm CLI_UX_ENHANCEMENT_COMPLETE.md
rm CODEBASE_CLEANUP_COMPLETE.md
rm COMMAND_PALETTE_INTEGRATION_COMPLETE.md
rm COMPLETE_BUILD_SUCCESS_REPORT.md
rm COMPREHENSIVE_STATUS_REPORT.md
rm DOCS_ENHANCEMENT_COMPLETE.md
rm DOCS_ENHANCEMENT_FINAL_SUMMARY.md
rm DOCS_ENHANCEMENT_SUMMARY.md
rm ENHANCEMENT_COMPLETE_SUMMARY.md
rm EXAMPLES_FIXES_SUMMARY.md
rm HOOKS_CLEANUP_SUMMARY.md
rm ICON_FIXES_COMPLETE.md
rm MODERNIZATION_COMPLETE_SUMMARY.md
rm MODERNIZATION_FINAL_REPORT.md
rm PNPM_WORKSPACE_BUILD_SUCCESS.md
rm REACT_19_DEV_TOOLS_COMPLETE.md
rm REACT_19_DEV_TOOLS_ENHANCEMENT_COMPLETE.md
rm REACT_19_DEV_TOOLS_FINAL.md
rm REACT_19_DEV_TOOLS_FINAL_SUMMARY.md
rm REACT_19_REFACTORING_COMPLETE.md
rm REACT_19_REFACTORING_SUMMARY.md
rm REACT_19_STATUS_FINAL.md
rm TEMPLATES_COMPLETE_UPDATE.md
rm TEMPLATES_UPDATE_SUMMARY.md
rm WARNINGS_FIX_PROGRESS.md
rm WARNINGS_FIX_SUMMARY.md
rm "🎉_MISSION_COMPLETE_V2.md"
rm "🎉_REACT_19_COMPLETE.md"
rm "🎊_COMPLETE_SUCCESS_REPORT.md"
rm "🎯_WHAT_TO_DO_NEXT.md"
rm "🏁_FINAL_STATUS_REACT_19_AND_LAUNCH.md"
rm "🏆_MASTER_COMPLETION_SUMMARY.md"
rm "🚀_LAUNCH_NOW.md"
```

**Plans & Strategies** (9 files):
```bash
rm COOKBOOK_MODERNIZATION_PLAN.md
rm DOCS_ENHANCEMENT_PLAN.md
rm ENHANCEMENT_IMPLEMENTATION_PLAN.md
rm FIX_ALL_WARNINGS_STRATEGY.md
rm MODERNIZATION_CHECKLIST.md
rm REACT_19_ENHANCEMENT_PLAN.md
rm REACT_19_REFACTORING_PLAN.md
rm TESTING_IMPROVEMENTS_PLAN.md
rm VALIDATION_CHECKLIST.md
```

**Progress Trackers** (4 files):
```bash
rm MODERNIZATION_PROGRESS.md
rm PRIORITY_1_PROGRESS.md
rm REACT_19_REFACTORING_PROGRESS.md
rm VALIDATION_PROGRESS.md
```

**Analysis/Research Files** (13 files):
```bash
rm COMPLETE_ARCHITECTURAL_INDEX.md
rm FEATURE_COMPLETENESS_REPORT.md
rm GITHUB_RELEASE.md
rm LAUNCH_CHECKLIST.md
rm PHASE_2_COMPONENTS_STATUS.md
rm README_RESEARCH_ANALYSIS.md
rm REACT_19_RESEARCH.md
rm REPOSITORY_DEPENDENCY_MAP.md
rm STORYBOOK_VERSION_NOTE.md
rm MODERNIZATION_STATUS.md
rm VALIDATION_STATUS.md
rm VISUAL_ASSETS_GUIDE.md
rm EXAMPLES_UPDATE_GUIDE.md
```

### Packages - Delete Status Files

**packages/cli/**:
```bash
rm packages/cli/BEAUTIFUL_CLI_COMPLETE.md
rm packages/cli/BEAUTIFUL_CLI_RESEARCH.md
rm packages/cli/CLI_BEST_PRACTICES_RESEARCH.md
rm packages/cli/CLI_COMPLETE_ENHANCEMENT.md
rm packages/cli/CLI_ENHANCEMENT_SUMMARY.md
rm packages/cli/CLI_FINAL_POLISH.md
rm packages/cli/CLI_FINAL_SUMMARY.md
rm packages/cli/CLI_UI_ENHANCEMENT_SUMMARY.md
rm packages/cli/CLI_UX_ENHANCEMENTS.md
rm packages/cli/CLI_UX_RESEARCH.md
```

**packages/dev-tools/**:
```bash
rm packages/dev-tools/DEV_TOOLS_UX_ENHANCEMENT.md
rm packages/dev-tools/REACT_19_MIGRATION.md
```

**packages/react/**:
```bash
rm packages/react/TEST_INFRASTRUCTURE_ISSUES.md
```

**mcp-server/**:
```bash
rm mcp-server/MCP_BEST_PRACTICES_RESEARCH.md
rm mcp-server/MCP_ENHANCEMENT_SUMMARY.md
```

**examples/**:
```bash
rm examples/streaming-chat/README-ENHANCED.md
```

---

## PHASE 2: CONSOLIDATE DUPLICATE CONTENT

### 1. CHANGELOG Consolidation

**Current State**:
- `CHANGELOG.md` - Main semantic versioning changelog
- `CHANGELOG_V2.1.md` - v2.1.0 specific changes
- `COMPREHENSIVE_CHANGELOG.md` - Narrative summary

**Action**: Merge into single `CHANGELOG.md`
```bash
# Keep CHANGELOG.md as base
# Merge v2.1.0 content from CHANGELOG_V2.1.md
# Extract any unique content from COMPREHENSIVE_CHANGELOG.md
# Delete duplicates
rm CHANGELOG_V2.1.md
rm COMPREHENSIVE_CHANGELOG.md
```

**Result**: Single `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format

---

### 2. COOKBOOK Consolidation

**Current State**:
- `COOKBOOK.md` - Original cookbook
- `COOKBOOK_MODERNIZED.md` - Modernized version

**Action**: Keep the modernized version
```bash
# Compare files, use COOKBOOK_MODERNIZED.md as source
mv COOKBOOK_MODERNIZED.md COOKBOOK.md  # overwrite
```

**Result**: Single `COOKBOOK.md` at root (to be migrated to docs-site later)

---

### 3. DESIGN_SYSTEM_GUIDE Consolidation

**Current State**:
- `DESIGN_SYSTEM_GUIDE.md` - Original
- `DESIGN_SYSTEM_GUIDE_V2.md` - Updated version
- `DESIGN_SYSTEM_QUICK_REFERENCE.md` - Quick reference

**Action**: Consolidate into docs-site
```bash
# DESIGN_SYSTEM_GUIDE_V2.md is the most complete
# Move to apps/docs-site/app/guides/design-system/page.tsx
# Create apps/docs-site/app/guides/design-system/quick-reference/page.tsx
# Delete root files
rm DESIGN_SYSTEM_GUIDE.md
rm DESIGN_SYSTEM_GUIDE_V2.md
rm DESIGN_SYSTEM_QUICK_REFERENCE.md
```

**Result**: Design system docs in docs-site under `/guides/design-system/`

---

## PHASE 3: MIGRATE CONTENT TO DOCS-SITE

### Root Files → apps/docs-site/

| Root File | Destination | Action |
|-----------|-------------|--------|
| `ARCHITECTURE_OVERVIEW.md` | `app/learn/architecture/page.tsx` | Migrate content |
| `COMPETITIVE_ANALYSIS.md` | `app/learn/competitive-analysis/page.tsx` | Migrate content |
| `COMPONENT_PATTERNS_GUIDE.md` | `app/guides/component-patterns/page.tsx` | Migrate content |
| `COMPREHENSIVE_USAGE_GUIDE.md` | `app/guides/usage/page.tsx` | Migrate content |
| `DEPLOYMENT_GUIDE.md` | `app/guides/deployment/page.tsx` | Migrate content |
| `HOOKS_ANALYSIS.md` | `app/reference/hooks/analysis/page.tsx` | Migrate content |
| `HOOKS_COMPREHENSIVE_REVIEW.md` | Merge into `app/reference/hooks/page.tsx` | Merge & delete |
| `PERFORMANCE_GUIDE.md` | Merge into `app/guides/performance/page.tsx` | Merge & delete |
| `QUICK_START_GUIDE.md` | Merge into `app/learn/quick-start/page.tsx` | Merge & delete |
| `TESTING.md` | Merge into `app/guides/testing/page.tsx` | Merge & delete |
| `TROUBLESHOOTING.md` | Merge into `app/learn/troubleshooting/page.tsx` | Merge & delete |
| `UI_UX_MIGRATION_GUIDE.md` | `app/guides/migration/ui-ux/page.tsx` | Migrate content |
| `MIGRATION_GUIDE_V2.md` | `app/guides/migration/v2/page.tsx` | Migrate content |
| `COOKBOOK.md` | `app/cookbook/*/page.tsx` | Split into recipes |

---

### docs/ → apps/docs-site/ (Entire Directory)

**Current State**:
- `apps/docs/` - Old VitePress docs (duplicates content)
- `apps/docs-site/` - Active Next.js docs site

**Action**: Delete entire `apps/docs/` directory
```bash
# Verify all content exists in apps/docs-site/
# Delete the old docs directory
rm -rf apps/docs/
```

**Verification Checklist**:
- [ ] All API docs exist in apps/docs-site/app/reference/
- [ ] All guides exist in apps/docs-site/app/guides/
- [ ] All cookbook content in apps/docs-site/app/cookbook/
- [ ] All examples documented in apps/docs-site/app/examples/
- [ ] Integration docs exist

---

### docs/TOKEN_OPTIMIZATION_QUICK_REFERENCE.md

**Action**: Migrate to docs-site
```bash
# Move content to apps/docs-site/app/guides/token-optimization/quick-reference/page.tsx
# Delete original
rm docs/TOKEN_OPTIMIZATION_QUICK_REFERENCE.md
```

---

### docs/api/ Files

All API docs should be in `apps/docs-site/app/reference/`:

| Source | Destination | Status |
|--------|-------------|--------|
| `docs/api/primitives.md` | `app/reference/primitives/` | Check if exists |
| `docs/api/react-components.md` | `app/reference/components/` | Check if exists |
| `docs/api/token-optimization.md` | `app/reference/utilities/token-optimization/` | Check if exists |
| `docs/api/vercel-ai-sdk-hooks.md` | `app/reference/hooks/vercel-ai-sdk/` | Check if exists |

---

### docs/guides/ Files

All guides should be in `apps/docs-site/app/guides/`:

| Source | Destination |
|--------|-------------|
| `docs/guides/best-practices.md` | `app/guides/best-practices/` |
| `docs/guides/integration-guide.md` | `app/guides/integration/` |
| `docs/guides/rag-guide.md` | `app/guides/rag/` |
| `docs/guides/token-optimization.md` | `app/guides/token-optimization/` |
| `docs/guides/usage-examples.md` | `app/guides/usage/` |

---

### docs/enterprise/ Files

Enterprise docs to `apps/docs-site/app/enterprise/`:

| Source | Destination |
|--------|-------------|
| `docs/enterprise/ENTERPRISE_FEATURES.md` | `app/enterprise/features/` |
| `docs/enterprise/QUICK_REFERENCE.md` | `app/enterprise/quick-reference/` |

---

### docs/research/ Files

**Action**: Delete research files (outdated analysis)
```bash
rm -rf docs/research/
```

Research files are temporary and not needed in production docs.

---

## PHASE 4: FINAL REPOSITORY STRUCTURE

### Root Directory (Keep Only Essential Files)

**Meta Documentation** (7 files):
- ✅ `README.md` - Main project overview
- ✅ `CONTRIBUTING.md` - Contribution guide
- ✅ `CONTRIBUTING_EXAMPLES.md` - Example contribution guide
- ✅ `CODE_OF_CONDUCT.md` - Code of conduct
- ✅ `START_HERE.md` - Getting started
- ✅ `LICENSE-ENTERPRISE.md` - Enterprise license
- ✅ `LICENSE-PRO.md` - Pro license

**Project Files** (keep as-is):
- ✅ `CHANGELOG.md` - Consolidated changelog
- ✅ `.gitignore`
- ✅ `package.json`
- ✅ `pnpm-workspace.yaml`
- ✅ `turbo.json`
- ✅ `tsconfig.json`
- ✅ etc.

---

### Contextual READMEs (Keep & Improve)

Each package/directory should have ONE contextual README:

**Packages**:
- ✅ `packages/cli/README.md` - CLI tool docs
- ✅ `packages/dev-tools/README.md` - Dev tools docs
- ✅ `packages/error-handling/README.md` - Error handling docs
- ✅ `packages/memory/README.md` - Memory system docs
- ✅ `packages/playground/README.md` - Playground docs
- ✅ `packages/primitives/README.md` - Primitives docs
- ✅ `packages/react/README.md` - Main package docs
- ✅ `packages/testing-utils/README.md` - Testing utils docs
- ✅ `packages/types/README.md` - Types docs
- ✅ `packages/codemods/README.md` - Codemods docs
- ✅ `packages/licensing/README.md` - Licensing docs
- ✅ `packages/errors/README.md` - Errors docs

**Package Sub-directories** (contextual):
- ✅ `packages/react/src/error/README.md` - Error system
- ✅ `packages/react/src/memory/README.md` - Memory integration
- ✅ `packages/react/src/utils/memory/README.md` - Memory utilities
- ✅ `packages/react/src/utils/TOKEN_OPTIMIZATION.md` - Token optimization

**Apps**:
- ✅ `apps/docs-site/README.md` - Docs site setup
- ✅ `apps/marketing-site/README.md` - Marketing site
- ✅ `apps/storybook/README.md` - Storybook setup

**Examples** (each has one README):
- ✅ `examples/README.md` - Examples overview
- ✅ `examples/*/README.md` - Individual example docs

**Other**:
- ✅ `mcp-server/README.md` - MCP server docs
- ✅ `vscode-extension/README.md` - VSCode extension docs
- ✅ `tests/integration/README.md` - Integration tests
- ✅ `tests/visual/README.md` - Visual regression tests
- ✅ `blog/README.md` - Blog overview
- ✅ `commercial-docs/README.md` - Commercial docs overview

---

### Documentation Site Structure

**apps/docs-site/app/** (Ultimate Source of Truth):

```
app/
├── page.tsx                          # Homepage
├── learn/                            # Learning path
│   ├── installation/
│   ├── quick-start/
│   ├── tutorial/
│   ├── architecture/
│   ├── troubleshooting/
│   ├── competitive-analysis/
│   └── migration/
│       ├── from-vercel-ai-sdk/
│       ├── ui-ux/
│       └── v2/
├── guides/                           # How-to guides
│   ├── accessibility/
│   ├── agents/
│   ├── component-patterns/
│   ├── deployment/
│   ├── design-system/
│   │   ├── page.tsx
│   │   └── quick-reference/
│   ├── performance/
│   ├── rag/
│   ├── security/
│   ├── state-management/
│   ├── streaming/
│   ├── testing/
│   ├── token-optimization/
│   │   └── quick-reference/
│   ├── usage/
│   └── best-practices/
├── reference/                        # API reference
│   ├── components/
│   │   ├── chat-window/
│   │   ├── message/
│   │   └── [70+ components]
│   ├── hooks/
│   │   ├── use-chat/
│   │   ├── use-streaming-sse/
│   │   └── [35+ hooks]
│   ├── utilities/
│   │   ├── token-optimization/
│   │   └── ...
│   └── primitives/
├── cookbook/                         # Recipes
│   ├── agent-with-tools/
│   ├── authentication/
│   ├── openai-streaming-chat/
│   └── [15+ recipes]
├── examples/                         # Example apps
│   ├── simple-chat/
│   ├── code-assistant/
│   └── [40+ examples]
├── playground/                       # Interactive playground
└── enterprise/                       # Enterprise features
    ├── features/
    └── quick-reference/
```

---

## PHASE 5: LINK VERIFICATION

After cleanup and consolidation, verify all links:

### Internal Links to Check

1. **README.md** → All links to docs/guides
2. **CONTRIBUTING.md** → Links to guides
3. **All package READMEs** → Links to docs-site
4. **apps/docs-site/** → All internal links
5. **Examples READMEs** → Links to docs and guides

### Link Verification Script

```bash
# Find all markdown files
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" > /tmp/md_files.txt

# Check for broken links (to be implemented)
# For each file, extract links and verify targets exist
```

---

## PHASE 6: CREATE MISSING REFERENCED DOCS

After link verification, create any missing documentation that is referenced but doesn't exist.

**Process**:
1. Run link verification
2. Catalog broken links
3. Determine if link should be:
   - Fixed (typo)
   - Redirected (content moved)
   - Created (missing doc)
4. Create missing docs with proper content

---

## EXECUTION CHECKLIST

### Phase 1: Delete
- [ ] Delete 42 status report files from root
- [ ] Delete 9 plan/strategy files from root
- [ ] Delete 4 progress tracker files from root
- [ ] Delete 13 analysis/research files from root
- [ ] Delete 10 status files from packages/cli/
- [ ] Delete 2 status files from packages/dev-tools/
- [ ] Delete 1 file from packages/react/
- [ ] Delete 2 files from mcp-server/
- [ ] Delete 1 duplicate from examples/

**Total Deletions**: ~85 files

### Phase 2: Consolidate
- [ ] Consolidate CHANGELOGs (3→1)
- [ ] Consolidate COOKBOOKs (2→1)
- [ ] Consolidate DESIGN_SYSTEM_GUIDEs (3→docs-site)

### Phase 3: Migrate to Docs-Site
- [ ] Migrate ARCHITECTURE_OVERVIEW.md
- [ ] Migrate COMPETITIVE_ANALYSIS.md
- [ ] Migrate COMPONENT_PATTERNS_GUIDE.md
- [ ] Migrate COMPREHENSIVE_USAGE_GUIDE.md
- [ ] Migrate DEPLOYMENT_GUIDE.md
- [ ] Migrate HOOKS_ANALYSIS.md
- [ ] Migrate MIGRATION_GUIDE_V2.md
- [ ] Migrate UI_UX_MIGRATION_GUIDE.md
- [ ] Merge HOOKS_COMPREHENSIVE_REVIEW.md
- [ ] Merge PERFORMANCE_GUIDE.md
- [ ] Merge QUICK_START_GUIDE.md
- [ ] Merge TESTING.md
- [ ] Merge TROUBLESHOOTING.md
- [ ] Delete entire apps/docs/ directory
- [ ] Migrate docs/TOKEN_OPTIMIZATION_QUICK_REFERENCE.md
- [ ] Verify all docs/api/ content exists in docs-site
- [ ] Verify all docs/guides/ content exists in docs-site
- [ ] Verify all docs/enterprise/ content exists in docs-site
- [ ] Delete docs/research/ directory

### Phase 4: Verify Structure
- [ ] Confirm root has only 7 meta docs
- [ ] Confirm all packages have contextual READMEs
- [ ] Confirm docs-site has complete structure
- [ ] Confirm no duplicate content exists

### Phase 5: Link Verification
- [ ] Verify all links in README.md
- [ ] Verify all links in CONTRIBUTING.md
- [ ] Verify all links in package READMEs
- [ ] Verify all links in apps/docs-site/
- [ ] Verify all links in examples/

### Phase 6: Create Missing Docs
- [ ] Create list of missing referenced docs
- [ ] Create missing documentation
- [ ] Re-verify all links

### Phase 7: Final Quality Check
- [ ] No duplicate files
- [ ] No broken links
- [ ] Docs-site is complete
- [ ] Contextual READMEs are helpful
- [ ] Storybook has component demos
- [ ] All essential content preserved

---

## FILES TO DELETE (Complete List)

### Root Directory (68 files to delete)

```bash
rm AI_CHAT_CONTINUATION_SUMMARY.md
rm AI_CHAT_ENHANCEMENTS_COMPLETE.md
rm AI_CHAT_ENHANCEMENTS_FINAL.md
rm AI_CHAT_ENHANCEMENTS_FINAL_SUMMARY.md
rm AI_CHAT_RESEARCH_AND_ENHANCEMENT.md
rm APPLICATION_BUILDS_STATUS.md
rm BUILD_AND_SETUP_COMPLETE_SUMMARY.md
rm CLEANUP_PROGRESS.md
rm CLEANUP_SUMMARY.md
rm CLI_UX_ENHANCEMENT_COMPLETE.md
rm CODEBASE_CLEANUP_COMPLETE.md
rm COMMAND_PALETTE_INTEGRATION_COMPLETE.md
rm COMPLETE_BUILD_SUCCESS_REPORT.md
rm COMPREHENSIVE_STATUS_REPORT.md
rm DOCS_ENHANCEMENT_COMPLETE.md
rm DOCS_ENHANCEMENT_FINAL_SUMMARY.md
rm DOCS_ENHANCEMENT_SUMMARY.md
rm ENHANCEMENT_COMPLETE_SUMMARY.md
rm EXAMPLES_FIXES_SUMMARY.md
rm HOOKS_CLEANUP_SUMMARY.md
rm ICON_FIXES_COMPLETE.md
rm MODERNIZATION_COMPLETE_SUMMARY.md
rm MODERNIZATION_FINAL_REPORT.md
rm PNPM_WORKSPACE_BUILD_SUCCESS.md
rm REACT_19_DEV_TOOLS_COMPLETE.md
rm REACT_19_DEV_TOOLS_ENHANCEMENT_COMPLETE.md
rm REACT_19_DEV_TOOLS_FINAL.md
rm REACT_19_DEV_TOOLS_FINAL_SUMMARY.md
rm REACT_19_REFACTORING_COMPLETE.md
rm REACT_19_REFACTORING_SUMMARY.md
rm REACT_19_STATUS_FINAL.md
rm TEMPLATES_COMPLETE_UPDATE.md
rm TEMPLATES_UPDATE_SUMMARY.md
rm WARNINGS_FIX_PROGRESS.md
rm WARNINGS_FIX_SUMMARY.md
rm "🎉_MISSION_COMPLETE_V2.md"
rm "🎉_REACT_19_COMPLETE.md"
rm "🎊_COMPLETE_SUCCESS_REPORT.md"
rm "🎯_WHAT_TO_DO_NEXT.md"
rm "🏁_FINAL_STATUS_REACT_19_AND_LAUNCH.md"
rm "🏆_MASTER_COMPLETION_SUMMARY.md"
rm "🚀_LAUNCH_NOW.md"
rm COOKBOOK_MODERNIZATION_PLAN.md
rm DOCS_ENHANCEMENT_PLAN.md
rm ENHANCEMENT_IMPLEMENTATION_PLAN.md
rm FIX_ALL_WARNINGS_STRATEGY.md
rm MODERNIZATION_CHECKLIST.md
rm REACT_19_ENHANCEMENT_PLAN.md
rm REACT_19_REFACTORING_PLAN.md
rm TESTING_IMPROVEMENTS_PLAN.md
rm VALIDATION_CHECKLIST.md
rm MODERNIZATION_PROGRESS.md
rm PRIORITY_1_PROGRESS.md
rm REACT_19_REFACTORING_PROGRESS.md
rm VALIDATION_PROGRESS.md
rm COMPLETE_ARCHITECTURAL_INDEX.md
rm FEATURE_COMPLETENESS_REPORT.md
rm GITHUB_RELEASE.md
rm LAUNCH_CHECKLIST.md
rm PHASE_2_COMPONENTS_STATUS.md
rm README_RESEARCH_ANALYSIS.md
rm REACT_19_RESEARCH.md
rm REPOSITORY_DEPENDENCY_MAP.md
rm STORYBOOK_VERSION_NOTE.md
rm MODERNIZATION_STATUS.md
rm VALIDATION_STATUS.md
rm VISUAL_ASSETS_GUIDE.md
rm EXAMPLES_UPDATE_GUIDE.md
```

### Packages

```bash
rm packages/cli/BEAUTIFUL_CLI_COMPLETE.md
rm packages/cli/BEAUTIFUL_CLI_RESEARCH.md
rm packages/cli/CLI_BEST_PRACTICES_RESEARCH.md
rm packages/cli/CLI_COMPLETE_ENHANCEMENT.md
rm packages/cli/CLI_ENHANCEMENT_SUMMARY.md
rm packages/cli/CLI_FINAL_POLISH.md
rm packages/cli/CLI_FINAL_SUMMARY.md
rm packages/cli/CLI_UI_ENHANCEMENT_SUMMARY.md
rm packages/cli/CLI_UX_ENHANCEMENTS.md
rm packages/cli/CLI_UX_RESEARCH.md
rm packages/dev-tools/DEV_TOOLS_UX_ENHANCEMENT.md
rm packages/dev-tools/REACT_19_MIGRATION.md
rm packages/react/TEST_INFRASTRUCTURE_ISSUES.md
rm mcp-server/MCP_BEST_PRACTICES_RESEARCH.md
rm mcp-server/MCP_ENHANCEMENT_SUMMARY.md
rm examples/streaming-chat/README-ENHANCED.md
```

---

## SUCCESS CRITERIA

✅ **Clean Root Directory**:
- Only 7 meta documentation files
- No status reports or plans
- No duplicate content

✅ **Single Source of Truth**:
- apps/docs-site/ has all technical documentation
- No duplicate docs in multiple locations

✅ **Contextual READMEs**:
- Every package has a helpful README
- READMEs link to docs-site for details

✅ **No Broken Links**:
- All internal links work
- All references point to existing docs

✅ **Complete Documentation**:
- All referenced docs exist
- No missing guides or API refs

✅ **Storybook Aligned**:
- Component demos in Storybook
- Documentation in docs-site
- Clear separation of concerns

---

**Next Step**: Execute Phase 1 (Delete status files)
