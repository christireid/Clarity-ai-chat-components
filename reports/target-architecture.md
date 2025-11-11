# Target Architecture Report

**Generated**: 2025-11-11

This report defines the target repository structure that eliminates duplication and follows modern monorepo best practices.

---

## Architecture Principles

1. **Single Source of Truth**: One authoritative location for each type of content
2. **Clear Separation**: Apps, packages, examples, docs, tools clearly separated
3. **Discoverability**: Logical structure that's easy to navigate
4. **Maintainability**: Minimal duplication, clear ownership
5. **Publish-Ready**: All packages configured for npm/publishing

---

## Target Directory Structure

```
/workspace/
├── apps/
│   ├── docs/                    # ✅ Single authoritative docs site (Next.js)
│   │   ├── app/
│   │   │   ├── guides/          # All guides consolidated here
│   │   │   ├── reference/       # API reference
│   │   │   ├── examples/        # Example documentation
│   │   │   ├── cookbook/        # Cookbook recipes
│   │   │   ├── learn/           # Learning resources
│   │   │   ├── enterprise/      # Enterprise docs (from docs/enterprise/)
│   │   │   └── blog/            # Blog content (from /blog)
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   ├── storybook/               # ✅ Single unified Storybook
│   │   ├── stories/
│   │   │   ├── components/      # Main component stories
│   │   │   ├── error-handling/  # Moved from packages/error-handling/.storybook
│   │   │   └── ...
│   │   ├── .storybook/
│   │   └── package.json
│   └── marketing-site/          # ✅ Keep as-is
│       └── ...
│
├── packages/
│   ├── react/                    # ✅ Main library
│   ├── primitives/               # ✅ UI primitives
│   ├── types/                    # ✅ TypeScript types
│   ├── error-handling/           # ✅ Error handling (no .storybook/)
│   ├── errors/                   # ⚠️ Review: merge or clarify purpose
│   ├── cli/                      # ✅ CLI tool
│   ├── codemods/                 # ✅ Code transformations
│   ├── dev-tools/                # ✅ Dev tools
│   ├── memory/                   # ✅ Memory management
│   ├── licensing/                # ✅ Licensing
│   ├── testing-utils/            # ✅ Test utilities
│   └── playground/               # ✅ Component playground
│
├── examples/                     # ✅ All examples here
│   ├── basic-chat/
│   ├── advanced-chat-features/
│   ├── ... (all 22 examples)
│   └── .archive/                 # ⚠️ Incomplete examples (README only)
│       ├── ai-agents-workflow/
│       ├── ai-tutor/
│       └── ...
│
├── tools/                        # ✅ Dev tools and scripts
│   ├── scripts/                  # Build/utility scripts
│   ├── mcp-server/              # MCP server (moved from root)
│   └── vscode-extension/         # VSCode extension (moved from root)
│
├── tests/                        # ✅ Test suites
│   ├── integration/
│   └── e2e/
│
├── infrastructure/               # ✅ Infrastructure configs
│   ├── docker-compose.memory.yml
│   └── *.sql                     # Database schemas
│
├── .archive/                     # ✅ Archived files
│   ├── completion-reports/      # Status files
│   ├── status-reports/
│   ├── summaries/
│   ├── planning/
│   └── old-docs/                 # Old docs/docs-site content
│
├── docs/                         # ❌ DELETE (merged into apps/docs)
├── blog/                         # ❌ DELETE (merged into apps/docs/app/blog)
├── commercial-docs/              # ⚠️ MERGE into apps/docs/app/enterprise/
│
├── package.json                  # ✅ Root package.json
├── pnpm-workspace.yaml           # ✅ Workspace config
├── pnpm-lock.yaml                # ✅ Lock file
├── README.md                     # ✅ Main README
├── CHANGELOG.md                  # ✅ Single changelog
├── CONTRIBUTING.md               # ✅ Contributing guide
├── LICENSE                       # ✅ License
├── .gitignore                    # ✅ Git ignore
└── [minimal root files]          # Only essential files
```

---

## Current → Target Mapping

### Documentation Consolidation

| Current | Target | Action |
|---------|--------|--------|
| `apps/docs/` (VitePress) | `apps/docs/` (Next.js) | **DELETE** - Merge content into `apps/docs-site`, rename to `apps/docs` |
| `apps/docs-site/` (Next.js) | `apps/docs/` | **RENAME** - Become single docs site |
| `docs/` (root) | `apps/docs/app/guides/` | **MERGE** - Move content into docs site |
| `docs/enterprise/` | `apps/docs/app/enterprise/` | **MOVE** - Enterprise docs |
| `docs/research/` | `apps/docs/app/research/` or archive | **MOVE** or archive |
| `blog/` | `apps/docs/app/blog/` | **MOVE** - Blog into docs site |
| `commercial-docs/` | `apps/docs/app/enterprise/` | **MERGE** - Commercial docs |

**Result**: Single docs site at `apps/docs/` (Next.js-based)

---

### Storybook Consolidation

| Current | Target | Action |
|---------|--------|--------|
| `apps/storybook/` | `apps/storybook/` | **KEEP** - Main Storybook |
| `packages/error-handling/.storybook/` | `apps/storybook/stories/error-handling/` | **MOVE** - Stories to main Storybook |
| `packages/error-handling/.storybook/` | (delete) | **DELETE** - Remove package Storybook |

**Result**: Single Storybook at `apps/storybook/`

---

### Package Structure

| Package | Current Status | Target Status | Action |
|---------|---------------|---------------|--------|
| `packages/react` | ✅ Good | ✅ Keep | No changes |
| `packages/primitives` | ✅ Good | ✅ Keep | No changes |
| `packages/types` | ✅ Good | ✅ Keep | No changes |
| `packages/error-handling` | ⚠️ Has Storybook | ✅ Remove Storybook | Remove `.storybook/`, update package.json |
| `packages/errors` | ⚠️ Potential duplicate | ⚠️ Review | Review vs error-handling, merge or clarify |
| `packages/cli` | ✅ Good | ✅ Keep | Archive status files |
| `packages/codemods` | ✅ Good | ✅ Keep | No changes |
| `packages/dev-tools` | ✅ Good | ✅ Keep | Archive status files |
| `packages/memory` | ✅ Good | ✅ Keep | No changes |
| `packages/licensing` | ✅ Good | ✅ Keep | No changes |
| `packages/testing-utils` | ✅ Good | ✅ Keep | No changes |
| `packages/playground` | ✅ Good | ✅ Keep | No changes |

---

### Examples Organization

| Current | Target | Action |
|---------|--------|--------|
| `examples/*` (22 examples) | `examples/*` | **KEEP** - All working examples |
| `examples/ai-agents-workflow/` (README only) | `examples/.archive/ai-agents-workflow/` | **MOVE** - Incomplete examples |
| `examples/ai-tutor/` (README only) | `examples/.archive/ai-tutor/` | **MOVE** |
| `examples/complete-features-demo/` (README only) | `examples/.archive/complete-features-demo/` | **MOVE** |
| `examples/document-summarizer/` (README only) | `examples/.archive/document-summarizer/` | **MOVE** |
| `examples/email-assistant/` (README only) | `examples/.archive/email-assistant/` | **MOVE** |
| `examples/financial-advisor/` (README only) | `examples/.archive/financial-advisor/` | **MOVE** |
| `examples/healthcare-assistant/` (README only) | `examples/.archive/healthcare-assistant/` | **MOVE** |
| `examples/integration-examples/` (README only) | `examples/.archive/integration-examples/` | **MOVE** |

**Result**: Clean examples directory with only working examples

---

### Root Directory Cleanup

| Current | Target | Action |
|---------|--------|--------|
| `97+ .md files` | `~10 essential files` | **ARCHIVE** 77+ status files to `.archive/` |
| `CHANGELOG.md` | `CHANGELOG.md` | **KEEP** - Merge others into this |
| `CHANGELOG_V2.1.md` | (delete) | **DELETE** - Merge into CHANGELOG.md |
| `COMPREHENSIVE_CHANGELOG.md` | (delete) | **DELETE** - Merge into CHANGELOG.md |
| `DESIGN_SYSTEM_GUIDE.md` | (delete) | **DELETE** - Merge into DESIGN_SYSTEM_GUIDE_V2.md |
| `DESIGN_SYSTEM_GUIDE_V2.md` | `DESIGN_SYSTEM_GUIDE.md` | **RENAME** - Remove V2 suffix |
| `package-lock.json` | (delete) | **DELETE** - Using pnpm |
| `mcp-server/` | `tools/mcp-server/` | **MOVE** - Dev tools |
| `vscode-extension/` | `tools/vscode-extension/` | **MOVE** - Dev tools |

**Result**: Clean root with only essential files

---

### Archive Structure

```
.archive/
├── completion-reports/          # 21 completion report files
├── status-reports/               # 6 status report files
├── summaries/                    # 9 summary files
├── planning/                     # 6 planning/research files
├── old-docs/                     # Content from old docs sites
└── package-status/               # Package-level status files
    ├── cli/
    ├── dev-tools/
    └── mcp-server/
```

---

## Package.json Structure

### Root package.json
- ✅ Keep workspaces: `["packages/*", "apps/*", "examples/*"]`
- ✅ Update scripts to reference new structure
- ✅ Remove references to old docs/storybook paths

### Apps package.json Files

**apps/docs/package.json** (renamed from docs-site):
- ✅ Keep Next.js setup
- ✅ Update name to `@clarity-chat/docs`
- ✅ Update build/deploy scripts

**apps/storybook/package.json**:
- ✅ Keep Storybook setup
- ✅ Ensure all packages are included
- ✅ Update story paths

### Packages package.json Files
- ✅ All packages should have proper `exports`, `main`, `module`, `types`
- ✅ All packages should have `publishConfig` if publishable
- ✅ Remove storybook scripts from `packages/error-handling/package.json`

---

## Import/Reference Updates

### Documentation References
- Update all README links from `apps/docs-site` → `apps/docs`
- Update all internal links to new structure
- Update external links in docs

### Storybook References
- Update imports in `packages/error-handling` stories
- Update Storybook config to include all packages
- Update any references to package-specific Storybook

### Package References
- Update workspace references if packages move
- Update import paths in examples
- Update test file paths

---

## Migration Checklist

### Phase 1: Documentation Consolidation
- [ ] Merge `apps/docs/` content into `apps/docs-site/`
- [ ] Merge `docs/` content into `apps/docs-site/`
- [ ] Move `blog/` into `apps/docs-site/app/blog/`
- [ ] Merge `commercial-docs/` into `apps/docs-site/app/enterprise/`
- [ ] Rename `apps/docs-site/` → `apps/docs/`
- [ ] Delete old `apps/docs/` (VitePress)
- [ ] Delete old `docs/` directory
- [ ] Delete old `blog/` directory
- [ ] Update all documentation links

### Phase 2: Storybook Consolidation
- [ ] Move `packages/error-handling/.storybook/` stories to `apps/storybook/stories/error-handling/`
- [ ] Update Storybook config to include error-handling stories
- [ ] Remove `.storybook/` from `packages/error-handling/`
- [ ] Remove storybook scripts from `packages/error-handling/package.json`
- [ ] Test Storybook build

### Phase 3: Root Cleanup
- [ ] Create `.archive/` directory structure
- [ ] Move 77+ status files to `.archive/`
- [ ] Merge changelogs into single `CHANGELOG.md`
- [ ] Merge design system guides
- [ ] Delete `package-lock.json`
- [ ] Move `mcp-server/` to `tools/mcp-server/`
- [ ] Move `vscode-extension/` to `tools/vscode-extension/`
- [ ] Update root `package.json` scripts

### Phase 4: Examples Organization
- [ ] Create `examples/.archive/` directory
- [ ] Move incomplete examples (README only) to archive
- [ ] Update examples README

### Phase 5: Package Review
- [ ] Review `packages/errors` vs `packages/error-handling`
- [ ] Merge or clarify purpose
- [ ] Update package.json files
- [ ] Ensure all packages are publish-ready

### Phase 6: Verification
- [ ] Update all import paths
- [ ] Update all documentation links
- [ ] Run lint
- [ ] Run type checks
- [ ] Run tests
- [ ] Build all packages
- [ ] Build docs site
- [ ] Build Storybook

---

## Benefits of Target Architecture

1. **Single Source of Truth**: One docs site, one Storybook
2. **Clear Structure**: Apps, packages, examples, tools clearly separated
3. **Reduced Duplication**: No overlapping docs or Storybook instances
4. **Better Discoverability**: Logical organization
5. **Easier Maintenance**: Less duplication to maintain
6. **Publish-Ready**: All packages properly configured
7. **Clean Root**: Only essential files in root

---

**Next Steps**: See `reports/refactor-status.md` for execution plan and progress tracking.
