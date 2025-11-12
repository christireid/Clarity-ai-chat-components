# Target Architecture Report
**Phase 3: Define Target Architecture**

Generated: $(date)

## Executive Summary

This report defines the target repository structure that eliminates duplication, follows monorepo best practices, and creates a clean, publish-ready codebase. The architecture maps current locations to target locations with clear migration paths.

---

## Architecture Principles

1. **Single Source of Truth**: One authoritative location for each type of content
2. **Clear Separation**: Apps, packages, examples, and docs are clearly separated
3. **Discoverability**: Logical organization makes content easy to find
4. **Publish-Ready**: All packages are properly configured for publishing
5. **No Duplication**: Eliminate all identified duplications
6. **Clean Root**: Root directory contains only essential files

---

## Target Directory Structure

```
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
```

---

## Migration Map: Current → Target

### 1. Documentation Consolidation

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

---

## Import/Reference Updates Required

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
