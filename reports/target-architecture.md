# Target Architecture Report
<<<<<<< HEAD
**Generated:** Phase 3 - Define Target Architecture  
**Date:** $(date)

## Executive Summary

This document defines the target repository structure that eliminates duplication, follows modern monorepo best practices, and creates a clean, publish-ready codebase.

**Key Principles:**
- Single source of truth for documentation
- Unified Storybook instance
- Clear separation of concerns
- Minimal root-level clutter
- Logical organization by purpose

---

## 1. Target Directory Structure

```
clarity-chat/
├── .github/                    # GitHub workflows and templates
├── .changeset/                 # Changeset configuration
├── apps/                       # Applications
│   ├── docs/                   # SINGLE documentation site (Next.js)
│   │   ├── app/
│   │   │   ├── api/            # API reference
│   │   │   ├── blog/           # Blog content (moved from /blog)
│   │   │   ├── commercial/     # Commercial docs (moved from /commercial-docs)
│   │   │   ├── cookbook/       # Cookbook recipes
│   │   │   ├── examples/       # Example documentation
│   │   │   ├── guides/         # User guides
│   │   │   ├── learn/          # Learning resources
│   │   │   ├── playground/     # Interactive playground
│   │   │   └── reference/      # Component/hook reference
│   │   └── package.json
│   ├── storybook/              # SINGLE unified Storybook
│   │   ├── .storybook/         # Storybook configuration
│   │   ├── stories/            # All component stories
│   │   └── package.json
│   └── marketing-site/         # Marketing/landing page
│       └── package.json
│
├── packages/                   # Published packages
│   ├── react/                  # Main React component library
│   ├── primitives/             # Primitive components
│   ├── types/                  # TypeScript types
│   ├── errors/                 # Error utilities
│   ├── error-handling/         # Advanced error handling
│   ├── memory/                 # Memory management
│   ├── licensing/              # Licensing utilities
│   ├── testing-utils/           # Testing utilities
│   ├── cli/                    # CLI tool
│   ├── dev-tools/              # DevTools integration
│   ├── codemods/               # Code transformation tools
│   └── playground/             # Interactive playground package
│
├── examples/                   # Example applications
│   ├── basic-chat/             # Basic implementation
│   ├── advanced-chat-features/ # Advanced features
│   ├── streaming-chat/         # Streaming demo
│   ├── token-optimization-demo/ # Token optimization
│   ├── design-system-showcase/ # Design system showcase
│   ├── [other complete examples]/
│   ├── memory-examples/        # Memory examples (consolidated)
│   │   ├── nextjs-api.ts
│   │   ├── nodejs-express.ts
│   │   ├── python-fastapi.py
│   │   ├── system-advanced.tsx
│   │   ├── system-basic.tsx
│   │   └── vanilla-js.html
│   └── README.md               # Examples catalog/index
│
├── tools/                      # Development tools and scripts
│   ├── mcp-server/             # MCP server (moved from root)
│   ├── vscode-extension/       # VSCode extension (moved from root)
│   └── scripts/                # Build/deployment scripts
│       ├── publish-to-github.sh
│       ├── quick-setup.sh
│       └── [other scripts]
│
├── tests/                      # Test suites
│   ├── integration/            # Integration tests
│   ├── e2e/                    # E2E tests
│   └── visual/                 # Visual regression tests
│
├── archive/                    # Archived files (NEW)
│   ├── completion-reports/     # Old completion reports
│   ├── status-reports/         # Old status reports
│   ├── planning/               # Old planning documents
│   ├── summaries/              # Old summary files
│   └── packages/               # Package-specific archives
│       ├── cli/
│       └── dev-tools/
│
├── infrastructure/             # Infrastructure configs
│   └── [SQL files, etc.]
│
├── docs/                       # REMOVED (consolidated into apps/docs)
├── blog/                       # REMOVED (moved to apps/docs/app/blog)
├── commercial-docs/            # REMOVED (moved to apps/docs/app/commercial)
│
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # PNPM workspace config
├── pnpm-lock.yaml              # Lock file
├── tsconfig.json               # Root TypeScript config
├── eslint.config.js            # ESLint config
├── playwright.config.ts        # E2E test config
│
├── README.md                   # Main README (brief, links to docs)
├── LICENSE                     # MIT License
├── LICENSE-ENTERPRISE.md       # Enterprise license
├── LICENSE-PRO.md              # Pro license
├── CODE_OF_CONDUCT.md         # Code of conduct
├── CONTRIBUTING.md             # Contributing guide
├── CHANGELOG.md                # Main changelog
├── QUICK_START_GUIDE.md        # Brief quick start (links to docs)
│
└── [minimal other root files]  # Only essential files
```

---

## 2. Current → Target Mapping

### 2.1 Documentation Consolidation

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `apps/docs/` (VitePress) | `apps/docs/` (Next.js, renamed from docs-site) | **DELETE** - Merge content into target |
| `apps/docs-site/` | `apps/docs/` | **RENAME** - Becomes primary docs |
| `/docs/` | `apps/docs/app/guides/` or `apps/docs/app/api/` | **MERGE** - Consolidate content |
| `/blog/` | `apps/docs/app/blog/` | **MOVE** - Integrate blog into docs |
| `/commercial-docs/` | `apps/docs/app/commercial/` | **MOVE** - Integrate commercial docs |
| Root `.md` guides | `apps/docs/app/guides/` | **MOVE** - Consolidate guides |

### 2.2 Storybook Consolidation

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `apps/storybook/` | `apps/storybook/` | **KEEP** - Primary Storybook |
| `packages/error-handling/.storybook/` | `apps/storybook/stories/error-handling/` | **MOVE** - Consolidate stories |

### 2.3 Status/Report Files

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `*_COMPLETE*.md` (root) | `archive/completion-reports/` | **ARCHIVE** - Move all completion reports |
| `*_STATUS*.md` (root) | `archive/status-reports/` | **ARCHIVE** - Move status reports |
| `*_PLAN*.md` (root) | `archive/planning/` | **ARCHIVE** - Move planning docs |
| `*_SUMMARY*.md` (root) | `archive/summaries/` | **ARCHIVE** - Move summaries |
| `*_PROGRESS*.md` (root) | `archive/status-reports/` | **ARCHIVE** - Move progress reports |
| `*_REPORT*.md` (root) | `archive/status-reports/` | **ARCHIVE** - Move reports |
| `*_GUIDE*.md` (root, non-essential) | `apps/docs/app/guides/` or `archive/` | **MOVE/ARCHIVE** - Based on relevance |
| `*_CHECKLIST*.md` (root) | `archive/planning/` | **ARCHIVE** - Move checklists |

### 2.4 Package Organization

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `packages/*/` | `packages/*/` | **KEEP** - Structure is good |
| `packages/*/CHANGELOG.md` | `packages/*/CHANGELOG.md` | **KEEP** - Package changelogs OK |
| `packages/*/*_COMPLETE*.md` | `archive/packages/[package-name]/` | **ARCHIVE** - Move status files |
| `packages/cli/*_CLI*.md` | `archive/packages/cli/` | **ARCHIVE** - Consolidate CLI docs |
| `packages/dev-tools/*.md` (non-README) | `archive/packages/dev-tools/` or merge into README | **ARCHIVE/MERGE** |

### 2.5 Examples Organization

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `examples/*/` (complete) | `examples/*/` | **KEEP** - Complete examples stay |
| `examples/*/` (stubs) | `examples/*/` or **DELETE** | **DECIDE** - Implement or remove stubs |
| `examples/memory-*.ts` | `examples/memory-examples/` | **MOVE** - Consolidate memory examples |
| `examples/memory-*.tsx` | `examples/memory-examples/` | **MOVE** - Consolidate memory examples |
| `examples/memory-*.html` | `examples/memory-examples/` | **MOVE** - Consolidate memory examples |
| `examples/memory-*.py` | `examples/memory-examples/` | **MOVE** - Consolidate memory examples |

### 2.6 Tools & Scripts

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `mcp-server/` | `tools/mcp-server/` | **MOVE** - Group dev tools |
| `vscode-extension/` | `tools/vscode-extension/` | **MOVE** - Group dev tools |
| Root `*.sh` scripts | `tools/scripts/` | **MOVE** - Group scripts |
| Root `generate-ai-context.js` | `tools/scripts/` | **MOVE** - Group scripts |

### 2.7 Configuration Files

| Current Location | Target Location | Action |
|----------------|----------------|--------|
| `package-lock.json` | **DELETE** | **DELETE** - Not needed for pnpm |
| `pnpm-lock.yaml` | `pnpm-lock.yaml` | **KEEP** - Primary lock file |
| `commercial-docs/LICENSE*` | **DELETE** | **DELETE** - Use root licenses |
| Root `LICENSE*` | Root `LICENSE*` | **KEEP** - Standard location |

---

## 3. Documentation Site Structure (apps/docs)

### 3.1 Target Structure

```
apps/docs/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   │
│   ├── api/                     # API Reference
│   │   ├── components/          # Component API docs
│   │   ├── hooks/               # Hook API docs
│   │   ├── utilities/           # Utility API docs
│   │   └── types/               # Type definitions
│   │
│   ├── blog/                    # Blog (moved from /blog)
│   │   ├── page.tsx             # Blog index
│   │   ├── [slug]/              # Blog posts
│   │   └── animations/           # Animation demos
│   │
│   ├── commercial/              # Commercial docs (moved from /commercial-docs)
│   │   ├── pricing/
│   │   ├── case-studies/
│   │   └── implementation/
│   │
│   ├── cookbook/                # Cookbook recipes
│   │   └── [recipe]/            # Individual recipes
│   │
│   ├── examples/                # Example documentation
│   │   ├── page.tsx             # Examples catalog
│   │   └── [example]/           # Individual example docs
│   │
│   ├── guides/                  # User Guides (consolidated)
│   │   ├── getting-started/
│   │   ├── installation/
│   │   ├── streaming/
│   │   ├── token-optimization/
│   │   ├── error-handling/
│   │   ├── memory/
│   │   ├── theming/
│   │   └── [other guides]/
│   │
│   ├── learn/                   # Learning Resources
│   │   ├── quick-start/
│   │   ├── tutorials/
│   │   ├── migration/
│   │   └── troubleshooting/
│   │
│   ├── playground/              # Interactive playground
│   │   └── [demo]/
│   │
│   └── reference/               # Component/Hook Reference
│       ├── components/          # Component docs
│       ├── hooks/               # Hook docs
│       └── utilities/           # Utility docs
│
├── components/                  # Docs site components
├── lib/                         # Docs site utilities
├── styles/                      # Docs site styles
├── package.json
└── [config files]
```

### 3.2 Content Migration Plan

**From `apps/docs/` (VitePress):**
- `guide/*.md` → `apps/docs/app/guides/[guide-name]/page.tsx`
- `api/*.md` → `apps/docs/app/api/[api-name]/page.tsx`
- `examples/*.md` → `apps/docs/app/examples/[example-name]/page.tsx`
- `integrations/*.md` → `apps/docs/app/guides/integrations/[integration]/page.tsx`
- `cookbook.md` → `apps/docs/app/cookbook/page.tsx`

**From `/docs/`:**
- `guides/*.md` → `apps/docs/app/guides/[guide-name]/page.tsx`
- `api/*.md` → `apps/docs/app/api/[api-name]/page.tsx`
- `enterprise/*.md` → `apps/docs/app/commercial/enterprise/[doc]/page.tsx`
- `research/*.md` → Archive or integrate into relevant guides

**From `/blog/`:**
- `*.md` → `apps/docs/app/blog/[slug]/page.tsx`
- `animations/*.html` → `apps/docs/app/blog/animations/[demo]/page.tsx`
- `assets/*.html` → `apps/docs/app/blog/assets/[demo]/page.tsx`

**From `/commercial-docs/`:**
- `*.md` → `apps/docs/app/commercial/[doc-name]/page.tsx`
- `LICENSE*` → Delete (use root licenses)

**Root-level guides:**
- `DESIGN_SYSTEM_GUIDE.md` → `apps/docs/app/guides/design-system/page.tsx`
- `PERFORMANCE_GUIDE.md` → `apps/docs/app/guides/performance/page.tsx`
- `MIGRATION_GUIDE_V2.md` → `apps/docs/app/learn/migration/v2/page.tsx`
- `QUICK_START_GUIDE.md` → Keep brief version in root, link to `apps/docs/app/learn/quick-start/`

---

## 4. Storybook Consolidation

### 4.1 Target Structure

```
apps/storybook/
├── .storybook/
│   ├── main.ts                  # Unified Storybook config
│   ├── preview.tsx              # Preview configuration
│   └── manager-head.html         # Custom head HTML
│
├── stories/
│   ├── components/              # Component stories
│   │   ├── [Component].stories.tsx
│   │   └── ...
│   ├── hooks/                   # Hook stories
│   │   └── ...
│   ├── error-handling/          # Error handling stories (moved)
│   │   └── ...
│   ├── GettingStarted.mdx        # Getting started guide
│   └── Introduction.mdx          # Introduction
│
└── package.json
```

### 4.2 Migration Plan

**From `packages/error-handling/.storybook/`:**
- Move any stories from error-handling package to `apps/storybook/stories/error-handling/`
- Update Storybook config to include error-handling package stories
- Delete `packages/error-handling/.storybook/` directory

---

## 5. Root Directory Cleanup

### 5.1 Files to Keep in Root

**Essential Files:**
- `package.json` - Workspace configuration
- `pnpm-workspace.yaml` - PNPM workspace
- `pnpm-lock.yaml` - Lock file
- `tsconfig.json` - TypeScript config
- `eslint.config.js` - ESLint config
- `playwright.config.ts` - E2E test config
- `docker-compose.memory.yml` - Docker config (if needed)

**Documentation (Brief):**
- `README.md` - Main README (brief, links to docs)
- `LICENSE` - MIT License
- `LICENSE-ENTERPRISE.md` - Enterprise license
- `LICENSE-PRO.md` - Pro license
- `CODE_OF_CONDUCT.md` - Code of conduct
- `CONTRIBUTING.md` - Contributing guide
- `CHANGELOG.md` - Main changelog
- `QUICK_START_GUIDE.md` - Brief quick start (links to full docs)

**Total Root Files:** ~15-20 files (down from 100+)

### 5.2 Files to Archive

**Move to `archive/`:**
- All `*_COMPLETE*.md` files
- All `*_STATUS*.md` files
- All `*_PLAN*.md` files
- All `*_SUMMARY*.md` files
- All `*_PROGRESS*.md` files
- All `*_REPORT*.md` files (except essential)
- All `*_CHECKLIST*.md` files
- Old `*_GUIDE*.md` files (after merging into docs)

**Estimated Archive Size:** 80+ files

### 5.3 Files to Delete

**Delete Completely:**
- `package-lock.json` - Not needed for pnpm
- `commercial-docs/LICENSE*` - Duplicate of root licenses
- Very old/outdated status files (>1 year old)
- Duplicate changelogs (`CHANGELOG_V2.1.md`, `COMPREHENSIVE_CHANGELOG.md` after merge)

---

## 6. Package Structure Standards

### 6.1 Standard Package Layout

```
packages/[package-name]/
├── src/                         # Source code
├── dist/                        # Build output (gitignored)
├── __tests__/                   # Tests
├── README.md                    # Package documentation
├── CHANGELOG.md                 # Package changelog (optional)
├── package.json                 # Package manifest
├── tsconfig.json                # TypeScript config
└── [build config files]         # tsup, vite, etc.
```

### 6.2 Package Documentation Standards

**Each package should have:**
- `README.md` - Comprehensive package documentation
  - Description
  - Installation
  - Usage examples
  - API reference (or link to docs site)
  - Links to full docs on docs site

**Packages should NOT have:**
- Multiple status/planning files
- Duplicate documentation
- Package-specific Storybook instances
- Redundant guides

---

## 7. Examples Organization

### 7.1 Example Categories

```
examples/
├── README.md                    # Examples catalog with categories
│
├── basic/                       # Basic examples
│   ├── basic-chat/
│   └── streaming-chat/
│
├── advanced/                    # Advanced examples
│   ├── advanced-chat-features/
│   ├── token-optimization-demo/
│   └── ...
│
├── integrations/                # Integration examples
│   ├── vercel-ai-sdk-compatible/
│   └── ...
│
├── showcases/                   # Showcase examples
│   ├── design-system-showcase/
│   └── examples-showcase/
│
└── memory-examples/             # Memory examples (consolidated)
    ├── nextjs-api.ts
    ├── nodejs-express.ts
    └── ...
```

### 7.2 Example Standards

**Each example should have:**
- `package.json` - Dependencies and scripts
- `README.md` - Example documentation
- `src/` - Source code
- Clear purpose and use case

**Stub examples:**
- Either implement fully
- Or remove if no longer planned

---

## 8. Migration Checklist

### Phase 1: Documentation Consolidation
- [ ] Merge `apps/docs` (VitePress) content into `apps/docs-site`
- [ ] Rename `apps/docs-site` to `apps/docs`
- [ ] Move `/blog/` content to `apps/docs/app/blog/`
- [ ] Move `/commercial-docs/` content to `apps/docs/app/commercial/`
- [ ] Merge `/docs/` content into `apps/docs/app/`
- [ ] Update all internal links and references
- [ ] Delete old documentation directories

### Phase 2: Storybook Consolidation
- [ ] Move error-handling stories to main Storybook
- [ ] Update Storybook config to include all packages
- [ ] Delete `packages/error-handling/.storybook/`
- [ ] Verify all stories work in unified Storybook

### Phase 3: Archive Status Files
- [ ] Create `archive/` directory structure
- [ ] Move completion reports to `archive/completion-reports/`
- [ ] Move status reports to `archive/status-reports/`
- [ ] Move planning docs to `archive/planning/`
- [ ] Move summaries to `archive/summaries/`
- [ ] Archive package-level status files

### Phase 4: Organize Examples
- [ ] Create `examples/memory-examples/` directory
- [ ] Move standalone memory example files
- [ ] Update examples README with catalog
- [ ] Decide on stub examples (implement or remove)

### Phase 5: Organize Tools
- [ ] Create `tools/` directory
- [ ] Move `mcp-server/` to `tools/mcp-server/`
- [ ] Move `vscode-extension/` to `tools/vscode-extension/`
- [ ] Move root scripts to `tools/scripts/`
- [ ] Update references to moved tools

### Phase 6: Clean Root Directory
- [ ] Delete `package-lock.json`
- [ ] Delete duplicate LICENSE files from commercial-docs
- [ ] Consolidate changelogs
- [ ] Keep only essential root files
- [ ] Update workspace references

### Phase 7: Update Configuration
- [ ] Update `package.json` workspace paths
- [ ] Update `pnpm-workspace.yaml` if needed
- [ ] Update build scripts
- [ ] Update CI/CD workflows
- [ ] Update import paths across codebase

---

## 9. Benefits of Target Architecture

### 9.1 Clarity
- Single documentation site - no confusion
- Clear separation: apps, packages, examples, tools
- Logical organization by purpose

### 9.2 Maintainability
- One place to update documentation
- Unified Storybook for all components
- Reduced duplication = less maintenance

### 9.3 Discoverability
- Clear structure makes it easy to find things
- Examples catalog helps users find relevant examples
- Centralized documentation improves UX

### 9.4 Publish-Ready
- Clean package structure
- Proper exports and configurations
- Professional organization

### 9.5 Developer Experience
- Less clutter in root directory
- Clear conventions
- Easier onboarding

---

## 10. Risks & Mitigation

### 10.1 Breaking Changes
**Risk:** Moving files may break imports/references  
**Mitigation:**
- Update all imports systematically
- Use find/replace for common patterns
- Test builds after each major move

### 10.2 Lost Content
**Risk:** Accidentally deleting important content  
**Mitigation:**
- Archive before deleting
- Review archived content before permanent deletion
- Keep archive for 6+ months

### 10.3 Documentation Links
**Risk:** External links may break  
**Mitigation:**
- Set up redirects if possible
- Update documentation links systematically
- Add redirects in Next.js if needed
=======
<<<<<<< HEAD
**Phase 3: Define Target Architecture**

Generated: $(date)

## Executive Summary

This report defines the target repository structure that eliminates duplication, follows monorepo best practices, and creates a clean, publish-ready codebase. The architecture maps current locations to target locations with clear migration paths.
=======
**Generated:** $(date)  
**Phase:** 3 - Define Target Architecture

## Executive Summary

This document defines the target repository structure that eliminates duplication and follows modern monorepo best practices. It maps current locations to target locations with clear migration paths.
>>>>>>> 3127164c46766afe413352332d7a11bc9888e937

---

## Architecture Principles

<<<<<<< HEAD
1. **Single Source of Truth**: One authoritative location for each type of content
2. **Clear Separation**: Apps, packages, examples, and docs are clearly separated
3. **Discoverability**: Logical organization makes content easy to find
4. **Publish-Ready**: All packages are properly configured for publishing
5. **No Duplication**: Eliminate all identified duplications
6. **Clean Root**: Root directory contains only essential files
=======
1. **Single Source of Truth:** One documentation site, one Storybook, one changelog
2. **Logical Grouping:** Apps, packages, examples clearly separated
3. **Discoverability:** Clear structure, consistent naming
4. **No Duplication:** Eliminate all overlapping content
5. **Archive Old Content:** Preserve history without cluttering active structure
>>>>>>> 3127164c46766afe413352332d7a11bc9888e937

---

## Target Directory Structure

```
<<<<<<< HEAD
clarity-chat/
├── .github/                    # GitHub workflows and templates
├── .changeset/                  # Changeset configuration
├── apps/                       # Applications
│   ├── docs/                   # Single documentation site (Next.js)
│   │   ├── app/
│   │   │   ├── blog/           # Blog content (from /blog)
│   │   │   ├── commercial/     # Commercial docs (from /commercial-docs)
│   │   │   ├── cookbook/       # Cookbook recipes
│   │   │   ├── examples/       # Example documentation
│   │   │   ├── guides/         # All guides consolidated
│   │   │   ├── learn/          # Learning content
│   │   │   ├── reference/      # API reference
│   │   │   ├── tools/          # Developer tools
│   │   │   └── playground/     # Interactive playground
│   │   ├── components/         # Docs site components
│   │   └── lib/                # Docs site utilities
│   ├── storybook/              # Unified Storybook instance
│   │   ├── .storybook/         # Storybook config
│   │   └── stories/            # All stories (including error-handling)
│   └── marketing-site/         # Marketing website
├── packages/                   # All libraries and SDKs
│   ├── react/                  # Main React component library
│   ├── primitives/             # Primitive components
│   ├── types/                  # TypeScript types
│   ├── memory/                 # Memory management
│   ├── error-handling/         # React error handling (keep, verify overlap)
│   ├── errors/                 # Error utilities (keep, verify overlap)
│   ├── licensing/              # License management
│   ├── cli/                    # CLI tool
│   ├── dev-tools/              # Developer tools
│   ├── codemods/               # Code transformations
│   ├── testing-utils/          # Testing utilities
│   └── playground/             # Component playground (private)
├── examples/                   # All example applications
│   ├── basic/                  # Basic examples
│   │   ├── basic-chat/
│   │   └── component-demo/
│   ├── advanced/               # Advanced examples
│   │   ├── advanced-chat-features/
│   │   ├── enterprise-ai-ops/
│   │   └── ...
│   ├── integrations/           # Integration examples
│   │   └── vercel-ai-sdk-compatible/
│   └── [other examples]/      # Remaining examples
├── tools/                      # Development tools and scripts
│   ├── scripts/                # Build/deploy scripts
│   └── [other tools]/         # Other dev tools
├── archive/                    # Archived files (gitignored or separate branch)
│   ├── status-reports/         # Old status/report files
│   ├── old-docs/               # Old documentation
│   └── deprecated/            # Deprecated content
├── infrastructure/             # Infrastructure configs
├── tests/                      # Test directories
├── mcp-server/                 # MCP server (keep as-is)
├── vscode-extension/           # VSCode extension (keep as-is)
├── README.md                   # Main README
├── CHANGELOG.md                # Single consolidated changelog
├── CONTRIBUTING.md             # Contributing guide
├── CODE_OF_CONDUCT.md          # Code of conduct
├── LICENSE                     # Main license
├── LICENSE-ENTERPRISE.md       # Enterprise license
├── LICENSE-PRO.md              # Pro license
├── package.json                # Root workspace config
├── pnpm-workspace.yaml         # PNPM workspace config
├── pnpm-lock.yaml              # PNPM lockfile
├── eslint.config.js            # Root ESLint config
├── playwright.config.ts        # E2E test config
└── docker-compose.memory.yml   # Docker compose
=======
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
>>>>>>> 3127164c46766afe413352332d7a11bc9888e937
```

---

## Migration Map: Current → Target

### 1. Documentation Consolidation

<<<<<<< HEAD
#### Current State
- `apps/docs` (VitePress) - **REMOVE**
- `apps/docs-site` (Next.js) - **KEEP & EXPAND**
- `/docs` (root markdown) - **MERGE INTO docs-site**
- `/blog` (root) - **MOVE TO docs-site**
- `/commercial-docs` (root) - **MOVE TO docs-site**

#### Target State
- `apps/docs` (Next.js) - Single authoritative docs site

#### Migration Steps
1. **Rename**: `apps/docs-site` → `apps/docs`
2. **Merge Content**:
   - Move `/docs` content → `apps/docs/app/reference/` or appropriate sections
   - Move `/blog` → `apps/docs/app/blog/`
   - Move `/commercial-docs` → `apps/docs/app/commercial/`
3. **Remove**: `apps/docs` (VitePress version)
4. **Update**: All references to docs locations
5. **Update**: Root `package.json` scripts (`docs` → point to new location)

---

### 2. Storybook Unification

#### Current State
- `apps/storybook` - **KEEP**
- `packages/error-handling/.storybook` - **REMOVE**

#### Target State
- `apps/storybook` - Single unified Storybook

#### Migration Steps
1. **Move Stories**: `packages/error-handling/src/**/*.stories.*` → `apps/storybook/stories/error-handling/`
2. **Remove**: `packages/error-handling/.storybook/`
3. **Update**: `packages/error-handling/package.json` (remove Storybook deps, scripts)
4. **Update**: `apps/storybook/.storybook/main.ts` (ensure error-handling stories are included)
5. **Verify**: All stories build correctly

---

### 3. Status Files Archival

#### Current State
- 50+ root-level status/report files - **ARCHIVE**

#### Target State
- `archive/status-reports/` - All archived status files

#### Migration Steps
1. **Create**: `archive/status-reports/` directory
2. **Move**: All emoji-prefixed files (`🎉_*.md`, `🏆_*.md`, etc.)
3. **Move**: All `*_COMPLETE.md`, `*_SUMMARY.md`, `*_STATUS.md` files
4. **Move**: All `*_PLAN.md`, `*_RESEARCH.md` files
5. **Keep**: Only essential files in root (`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`)
6. **Update**: `.gitignore` to ignore archive (or keep in separate branch)

---

### 4. Cookbook Consolidation

#### Current State
- `/COOKBOOK.md` - **ARCHIVE**
- `/COOKBOOK_MODERNIZED.md` - **ARCHIVE**
- `/COOKBOOK_MODERNIZATION_*.md` - **ARCHIVE**
- `apps/docs/cookbook.md` (VitePress) - **REMOVE** (with VitePress docs)
- `apps/docs-site/app/cookbook/` - **KEEP**

#### Target State
- `apps/docs/app/cookbook/` - Single cookbook location

#### Migration Steps
1. **Keep**: `apps/docs-site/app/cookbook/` (becomes `apps/docs/app/cookbook/`)
2. **Archive**: All root-level cookbook files → `archive/old-docs/`
3. **Remove**: `apps/docs/cookbook.md` (with VitePress removal)

---

### 5. Design System Documentation

#### Current State
- `/DESIGN_SYSTEM_GUIDE.md` - **ARCHIVE**
- `/DESIGN_SYSTEM_GUIDE_V2.md` - **ARCHIVE**
- `/DESIGN_SYSTEM_QUICK_REFERENCE.md` - **ARCHIVE**
- `/COMPONENT_PATTERNS_GUIDE.md` - **ARCHIVE**
- `apps/docs-site/app/learn/guides/styling/page.tsx` - **KEEP**
- `apps/storybook/stories/DesignPrinciples.mdx` - **MERGE INTO docs**
- `apps/storybook/stories/Theming.mdx` - **MERGE INTO docs**

#### Target State
- `apps/docs/app/design-system/` - Single design system section

#### Migration Steps
1. **Create**: `apps/docs/app/design-system/` directory
2. **Consolidate**: Merge all design system content into docs-site
3. **Archive**: Root-level design system files → `archive/old-docs/`
4. **Reference**: `packages/react/src/theme/design-tokens.ts` as source of truth

---

### 6. Guide Consolidation

#### Current State
- `apps/docs/guide/` (VitePress) - **REMOVE** (with VitePress)
- `apps/docs-site/app/guides/` - **KEEP**
- `apps/docs-site/app/learn/guides/` - **KEEP** (learning-focused)
- `/docs/guides/` - **MERGE INTO docs-site**
- Root-level guides (`QUICK_START_GUIDE.md`, etc.) - **ARCHIVE**

#### Target State
- `apps/docs/app/guides/` - All guides consolidated
- `apps/docs/app/learn/guides/` - Learning guides (keep separate)

#### Migration Steps
1. **Merge**: `/docs/guides/` → `apps/docs/app/guides/` (check for duplicates)
2. **Archive**: Root-level guide files → `archive/old-docs/`
3. **Remove**: `apps/docs/guide/` (with VitePress removal)
4. **Keep**: Learning guides separate (different audience)

---

### 7. Changelog Consolidation

#### Current State
- `/CHANGELOG.md` - **KEEP & MERGE**
- `/CHANGELOG_V2.1.md` - **MERGE INTO CHANGELOG.md**
- `/COMPREHENSIVE_CHANGELOG.md` - **MERGE INTO CHANGELOG.md**
- Package-level changelogs - **KEEP** (standard practice)

#### Target State
- `/CHANGELOG.md` - Single consolidated changelog
- Package-level changelogs - Keep as-is

#### Migration Steps
1. **Merge**: All root-level changelogs into single `CHANGELOG.md`
2. **Archive**: Old changelog versions → `archive/old-docs/`
3. **Keep**: Package-level changelogs (standard monorepo practice)

---

### 8. Examples Organization

#### Current State
- `/examples/` - 30+ examples (some stubs)

#### Target State
- `/examples/` - Organized by category (optional improvement)

#### Migration Steps
1. **EVALUATE**: Stub examples - implement or remove
2. **OPTIONAL**: Organize into categories:
   - `examples/basic/` - Basic examples
   - `examples/advanced/` - Advanced examples
   - `examples/integrations/` - Integration examples
3. **KEEP**: Current flat structure is acceptable if preferred

---

### 9. Package Organization

#### Current State
- Packages are well-organized in `/packages/`
- Some packages have status files - **ARCHIVE**

#### Target State
- Clean packages with only essential files

#### Migration Steps
1. **Archive**: Package-level status files → `archive/status-reports/`
2. **Keep**: Package READMEs (essential)
3. **Evaluate**: Package-level additional docs - link to main docs if duplicated

---

### 10. Lock File Cleanup

#### Current State
- `/package-lock.json` (NPM) - **REMOVE**
- `/pnpm-lock.yaml` (PNPM) - **KEEP**

#### Target State
- `/pnpm-lock.yaml` only

#### Migration Steps
1. **Remove**: `/package-lock.json`
2. **Update**: `.gitignore` to ignore NPM lockfiles
3. **Verify**: PNPM is primary package manager

---

### 11. Tools Organization

#### Current State
- Scripts scattered (root, various locations)

#### Target State
- `tools/scripts/` - All dev tools and scripts

#### Migration Steps
1. **Create**: `tools/scripts/` directory
2. **Move**: Root-level scripts → `tools/scripts/`
3. **Update**: References to scripts in package.json

---

## Package Configuration Updates

### Apps

#### `apps/docs` (renamed from `apps/docs-site`)
- **Name**: `@clarity-chat/docs`
- **Purpose**: Single authoritative documentation site
- **Content**: All docs, blog, commercial docs, cookbook, guides, reference
- **Tech**: Next.js 16, React 19, MDX

#### `apps/storybook`
- **Name**: `@clarity-chat/storybook`
- **Purpose**: Unified Storybook for all components
- **Stories**: All stories including error-handling
- **Tech**: Storybook 8.6.14, React 19, Vite

#### `apps/marketing-site`
- **Name**: `@clarity-chat/marketing-site`
- **Purpose**: Marketing website
- **Status**: Keep as-is

### Packages

All packages remain in `/packages/` with clean configurations:

- `@clarity-chat/react` - Main React library
- `@clarity-chat/primitives` - Primitive components
- `@clarity-chat/types` - TypeScript types
- `@clarity-chat/memory` - Memory management
- `@clarity-chat/error-handling` - React error handling (verify overlap)
- `@clarity-chat/errors` - Error utilities (verify overlap)
- `@clarity-chat/licensing` - License management
- `@clarity-chat/cli` - CLI tool
- `@clarity-chat/dev-tools` - Developer tools
- `@clarity-chat/codemods` - Code transformations
- `@clarity-chat/testing-utils` - Testing utilities
- `@clarity-chat/playground` - Component playground (private)

---

## Root Directory Cleanup

### Files to Keep in Root
- `README.md` - Main README
- `CHANGELOG.md` - Consolidated changelog
- `CONTRIBUTING.md` - Contributing guide
- `CODE_OF_CONDUCT.md` - Code of conduct
- `LICENSE` - Main license
- `LICENSE-ENTERPRISE.md` - Enterprise license
- `LICENSE-PRO.md` - Pro license
- `package.json` - Root workspace config
- `pnpm-workspace.yaml` - PNPM workspace config
- `pnpm-lock.yaml` - PNPM lockfile
- `eslint.config.js` - Root ESLint config
- `playwright.config.ts` - E2E test config
- `docker-compose.memory.yml` - Docker compose

### Files to Archive
- All status/report files (50+)
- Old cookbook files
- Old design system guides
- Old changelog versions
- Planning/research documents

### Files to Remove
- `package-lock.json` (NPM lockfile)
- `apps/docs` (VitePress version)
- `packages/error-handling/.storybook/`

---

## Workspace Configuration

### Current `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'examples/*'
```

### Target `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'examples/*'
```

**Status**: No changes needed (workspace config is correct)
=======
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
>>>>>>> 3127164c46766afe413352332d7a11bc9888e937

---

## Import/Reference Updates Required

<<<<<<< HEAD
After migration, update references in:

1. **Package.json scripts**:
   - `docs` → point to `apps/docs`
   - `storybook` → ensure includes all stories

2. **Documentation links**:
   - Update all internal links to new doc locations
   - Update README links

3. **CI/CD workflows**:
   - Update build/deploy paths
   - Update documentation build paths

4. **Package imports**:
   - Verify all package imports still work
   - Update Storybook aliases if needed

---

## Verification Checklist

After migration, verify:

- [ ] All documentation builds successfully
- [ ] All Storybook stories load correctly
- [ ] All package builds pass
- [ ] All tests pass
- [ ] All examples work
- [ ] All internal links work
- [ ] Root directory is clean
- [ ] No duplicate content remains
- [ ] All packages are publish-ready

---

## Migration Priority

### Phase 1 (Critical - Do First)
1. Archive status files (quick win, cleans root)
2. Consolidate documentation (removes major duplication)
3. Unify Storybook (removes duplication)

### Phase 2 (Important - Do Next)
4. Consolidate guides
5. Consolidate cookbook
6. Consolidate changelogs
7. Remove NPM lockfile

### Phase 3 (Polish - Do Last)
8. Organize examples (optional)
9. Organize tools/scripts
10. Final cleanup and verification

---

**Report Generated**: Phase 3 Complete
**Status**: Ready for Phase 4 (Execute Refactoring)
=======
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
>>>>>>> dadc7ccf96aa617a83f2232f393f75671ff32990

---

## Next Steps

<<<<<<< HEAD
Proceed to **Phase 4: Merge, Condense, Clean** to execute the reorganization according to this target architecture.
=======
Proceed to **Phase 4: Merge, Condense, Clean** to execute the migration according to this architecture.
>>>>>>> 3127164c46766afe413352332d7a11bc9888e937
>>>>>>> dadc7ccf96aa617a83f2232f393f75671ff32990
