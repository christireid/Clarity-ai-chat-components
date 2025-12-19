# MASTER_CONTEXT.md - Clarity AI Chat Components

> **Living Document** - Updated by each persona during the Zero-Defect Stabilization process. **Last
> Updated:** 2025-12-19 **Status:** Phase 1 - Initial Inventory Complete

---

## 1. Repository Purpose

**Clarity Chat** is a premium AI Chat Component Library for React, providing 70+ components and 35+
hooks for building enterprise-ready AI chat interfaces. The library focuses on:

- Streaming AI responses
- Accessibility (WCAG compliance)
- Token optimization
- Multi-provider support (OpenAI, Anthropic/Claude, etc.)
- Enterprise features (analytics, memory management, security)

---

## 2. Workspace Layout

```
clarity-chat/
├── packages/           # Core library packages (18 packages)
│   ├── react/          # Main React components package (@clarity-chat/react)
│   ├── primitives/     # shadcn/ui-inspired primitives (@clarity-chat/primitives)
│   ├── memory/         # AI memory & context management (@clarity-chat/memory)
│   ├── token-optimization/  # Token counting & optimization
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Shared utilities
│   ├── shared-utils/   # Cross-package utilities
│   ├── errors/         # Error handling utilities
│   ├── error-handling/ # Error boundary components
│   ├── license/        # License validation
│   ├── dev-tools/      # Developer tools
│   ├── cli/            # Command-line interface
│   ├── codemods/       # Code transformation utilities
│   ├── testing-utils/  # Testing utilities
│   ├── playground/     # Interactive playground
│   └── typescript-config/  # Shared TS configs
├── apps/               # Applications
│   ├── docs/           # VitePress documentation site
│   ├── storybook/      # Storybook component showcase
│   ├── marketing-site/ # Marketing website
│   └── examples/       # 38 example applications
├── examples/           # Standalone examples (13 examples)
├── tools/              # Development tooling
│   ├── docs-sync/      # Documentation synchronization
│   ├── mcp-server/     # MCP server
│   ├── vscode-extension/ # VS Code extension
│   ├── generators/     # Code generators
│   └── scripts/        # Build/utility scripts
├── tests/              # Integration/E2E tests
│   ├── e2e/            # Playwright E2E tests
│   ├── integration/    # Integration tests
│   └── visual/         # Visual regression tests
├── docs/               # Documentation source
├── scripts/            # Root-level scripts
└── infrastructure/     # Infrastructure configs
```

---

## 3. Tooling & Environment

### Package Manager

- **pnpm** v10.21.0 (required, enforced via `preinstall` script)
- Workspace: `pnpm-workspace.yaml`

### Node Version

- **Required:** Node.js >= 20.0.0
- **Specified in:** `.nvmrc` (Node 20)
- **Current Environment:** Node v22.21.1

### Monorepo Management

- **Turborepo** v2.6.3 for build orchestration
- Config: `turbo.json`
- Remote caching supported

### Build Tooling

- **tsup** v8.5.1 for package bundling
- **TypeScript** v5.9.3
- **Vite** v7.2.6 for development builds

### Testing

- **Vitest** v4.0.16 for unit/integration tests
- **Playwright** v1.57.0 for E2E tests
- **@testing-library/react** v16.3.1
- **jsdom** v27.3.0 for DOM simulation

### Linting & Formatting

- **ESLint** v9.39.1 with flat config (`eslint.config.js`)
- **Prettier** v3.7.4
- **Husky** v9.1.7 for git hooks
- **lint-staged** v16.2.7

### Documentation

- **VitePress** for docs site
- **Storybook** v10.1.4 for component showcase
- **TypeDoc** for API documentation

### CI/CD

- **GitHub Actions** with 15 workflow files
- Primary CI: `.github/workflows/ci.yml`
- Jobs: lint, typecheck, test, build (parallel with build after others)

---

## 4. Scripts Inventory

### Root-Level Quality Gate Scripts

```bash
# Quick Start
pnpm install               # Install all dependencies
pnpm build                 # Build all packages (turbo)
pnpm storybook             # Run Storybook dev server

# Quality Checks
pnpm lint                  # ESLint via turbo
pnpm typecheck             # TypeScript type checking via turbo
pnpm test                  # Run all tests via turbo
pnpm format:check          # Prettier check

# Combined
pnpm check                 # typecheck + lint + test
pnpm check:all             # typecheck + lint + test + build

# E2E
pnpm test:e2e              # Playwright E2E tests
pnpm test:visual           # Visual regression tests
```

### Package-Specific Scripts (common pattern)

Each package typically has:

- `build` - Build the package
- `dev` - Watch mode
- `clean` - Remove dist
- `typecheck` - TypeScript check
- `lint` - ESLint
- `test` - Vitest tests

---

## 5. CI Overview

### Primary Workflow: `.github/workflows/ci.yml`

**Triggers:** push to main/develop, pull requests

**Jobs (in order):**

1. **lint** - ESLint + Prettier check (10 min timeout)
2. **typecheck** - TypeScript compilation check (10 min timeout)
3. **test** - Vitest unit tests (15 min timeout)
4. **build** - Build all packages (15 min timeout, depends on lint/typecheck/test)
5. **ci-summary** - Generate report, comment on PR failures

**Security Features:**

- StepSecurity Harden Runner
- SHA-pinned actions
- Minimal permissions
- Turbo remote caching

### Other Workflows

- `changeset-release.yml` - Package publishing
- `accessibility.yml` - A11y checks
- `visual-regression.yml` - Visual tests
- `docs-sync.yml` - Documentation sync
- `dependency-review.yml` - Dependency security

---

## 6. Build Graph & Entry Points

### Dependency Order (packages)

```
1. @clarity-chat/types         (no deps)
2. @clarity-chat/utils         (no deps)
3. @clarity-chat/shared-utils  (no deps)
4. @clarity-chat/license       (no deps)
5. @clarity-chat/token-optimization (no deps)
6. @clarity-chat/memory        (depends: token-optimization)
7. @clarity-chat/primitives    (depends: utils)
8. @clarity-chat/errors        (no deps)
9. @clarity-chat/error-handling (no deps)
10. @clarity-chat/react        (depends: license, memory, primitives, token-optimization, types, utils)
```

### Primary Entry Points

- `packages/react` - Main library entry
- `packages/primitives` - UI primitives
- `packages/memory` - Memory management
- `apps/docs` - Documentation site
- `apps/storybook` - Component showcase

---

## 7. Known Risk Areas

### Identified Concerns (to be validated in Phase 2)

1. **Many example apps** - 38 in `apps/examples/` + 13 in `examples/` - potential for stale/broken
   examples
2. **React 19 migration** - Using React 19.2.0, forwardRef deprecation warnings expected
3. **ESLint rule suppressions** - Several packages have relaxed rules for `no-unused-vars`
4. **Large dependency tree** - Complex peer dependency requirements
5. **TypeScript strict mode** - Using strict mode with additional checks
6. **Generated files** - `.d.ts.map`, `.js.map` files in source directories

### Configuration Files to Monitor

- `eslint.config.js` - Complex flat config with many overrides
- `turbo.json` - Build orchestration
- `tsconfig.base.json` - Shared TypeScript config

---

## 8. How to Reproduce Locally

### Initial Setup

```bash
# 1. Ensure correct Node version
nvm use 20  # or node >= 20

# 2. Install dependencies
pnpm install

# 3. Build all packages
pnpm build

# 4. Verify the repo
pnpm check:all
```

### Individual Quality Gates

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Unit tests
pnpm test

# E2E tests (requires built packages)
pnpm test:e2e

# Format check
pnpm format:check
```

### Clean Rebuild

```bash
# Full clean
pnpm clean

# Reinstall
rm -rf node_modules
pnpm install

# Fresh build
pnpm build
```

---

## 9. Current Status Snapshot

> **To be updated after Phase 2 discovery passes**

| Category      | Count | Status           |
| ------------- | ----- | ---------------- |
| Build Errors  | TBD   | Pending Phase 2A |
| Type Errors   | TBD   | Pending Phase 2A |
| Lint Errors   | TBD   | Pending Phase 2A |
| Test Failures | TBD   | Pending Phase 2A |
| Warnings      | TBD   | Pending Phase 2A |

---

## 10. Stabilization Progress

### Phase Status

- [x] Phase 1: Inventory & Context (COMPLETE)
- [ ] Phase 2A: Baseline Gate Run
- [ ] Phase 2B: Package Isolation
- [ ] Phase 2C: Clean Checkout Repro
- [ ] Phase 3: Plan Review
- [ ] Phase 4: Execution
- [ ] Phase 5: Verification
- [ ] Phase 6: Loop Until Zero
- [ ] Phase 7: Merge & Push

---

## Appendix A: Key File Locations

| Purpose           | Location                    |
| ----------------- | --------------------------- |
| Root package.json | `/package.json`             |
| Turbo config      | `/turbo.json`               |
| Workspace config  | `/pnpm-workspace.yaml`      |
| ESLint config     | `/eslint.config.js`         |
| Base TSConfig     | `/tsconfig.base.json`       |
| Root TSConfig     | `/tsconfig.json`            |
| CI Workflow       | `/.github/workflows/ci.yml` |
| Playwright config | `/playwright.config.ts`     |
| Prettier config   | `/.prettierrc`              |

---

_Document maintained as part of Zero-Defect Stabilization effort._
