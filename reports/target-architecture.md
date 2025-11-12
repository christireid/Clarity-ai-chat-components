# Target Architecture Report
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

---

## Next Steps

Proceed to **Phase 4: Merge, Condense, Clean** to execute the reorganization according to this target architecture.
