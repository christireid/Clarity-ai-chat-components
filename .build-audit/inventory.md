# Build & Configuration Inventory

## Root Level Configuration

### Package Management

| File                  | Purpose                           | Status  |
| --------------------- | --------------------------------- | ------- |
| `package.json`        | Root monorepo config with scripts | Active  |
| `pnpm-workspace.yaml` | Workspace definitions             | Active  |
| `pnpm-lock.yaml`      | Lockfile                          | Present |

### TypeScript

| File                 | Purpose                     | Status |
| -------------------- | --------------------------- | ------ |
| `tsconfig.json`      | Root TS config (references) | Active |
| `tsconfig.base.json` | Shared base configuration   | Active |

### Linting & Formatting

| File               | Purpose                | Status |
| ------------------ | ---------------------- | ------ |
| `eslint.config.js` | ESLint flat config     | Active |
| `.prettierrc`      | Prettier configuration | Active |
| `.editorconfig`    | Editor settings        | Active |

### Build Orchestration

| File         | Purpose                 | Status |
| ------------ | ----------------------- | ------ |
| `turbo.json` | Turborepo configuration | Active |

### Publishing

| File                     | Purpose             | Status  |
| ------------------------ | ------------------- | ------- |
| `.changeset/config.json` | Changesets config   | Active  |
| `.npmrc`                 | npm registry config | Present |

---

## Package Configurations

### Core Library Packages (`packages/`)

| Package                            | Build Tool | tsconfig | tsup.config  | Notes                   |
| ---------------------------------- | ---------- | -------- | ------------ | ----------------------- |
| `@clarity-chat/react`              | tsup       | ✅       | ✅ (complex) | Sequential build script |
| `@clarity-chat/primitives`         | tsup       | ✅       | ✅           | Standard                |
| `@clarity-chat/types`              | tsup       | ✅       | ✅           | Types-only              |
| `@clarity-chat/utils`              | tsup       | ✅       | ✅           | Multiple entry points   |
| `@clarity-chat/memory`             | tsup       | ✅       | ✅           | Standard                |
| `@clarity-chat/license`            | tsup       | ✅       | ✅           | Standard                |
| `@clarity-chat/token-optimization` | tsup       | ✅       | ✅           | Standard                |
| `@clarity-chat/error-handling`     | tsup       | ✅       | ✅           | Standard                |
| `@clarity-chat/testing-utils`      | tsup       | ✅       | ✅           | Standard                |
| `@clarity-chat/cli`                | tsup       | ✅       | ✅           | CLI with bin            |
| `@clarity-chat/codemods`           | tsup       | ✅       | ✅ (new)     | DTS disabled            |
| `@clarity-chat/dev-tools`          | tsc        | ✅       | ❌           | Uses raw tsc            |
| `@clarity-chat/playground`         | vite       | ✅       | ❌           | Vite app                |

### Application Configurations (`apps/`)

| App                | Framework     | next.config   | vite.config | Notes                        |
| ------------------ | ------------- | ------------- | ----------- | ---------------------------- |
| `docs`             | Next.js 16    | ✅ TypeScript | -           | Complex with security config |
| `storybook`        | Storybook 8.6 | -             | -           | Uses main.ts/preview.ts      |
| `marketing-site`   | Next.js 16    | ✅ TypeScript | -           | Had Turbopack issues         |
| `streamlined-docs` | Next.js       | ✅ TypeScript | -           | Secondary docs site          |

### Example Applications (`apps/examples/`)

**Next.js Examples (11 apps)**:

- ai-research-platform, analytics-console-demo, code-assistant
- conversational-analytics, customer-support, ecommerce-assistant
- enterprise-ai-ops, enterprise-rag, model-comparison-demo
- rag-workbench-demo, streaming-chat

**Vite Examples (14 apps)**:

- advanced-chat-features, ai-assistant, basic-chat, component-demo
- comprehensive-chat-demo, design-system-showcase, enhanced-ui-ux-showcase
- gallery, multi-user-chat, performance-dashboard, theme-builder
- token-optimization-demo, use-clarity-chat-showcase, vercel-ai-sdk-compatible

---

## CI/CD Workflows

| Workflow                | Trigger    | Purpose                                |
| ----------------------- | ---------- | -------------------------------------- |
| `ci.yml`                | PR/Push    | Main CI (lint, typecheck, test, build) |
| `changeset-check.yml`   | PR         | Validates changeset presence           |
| `changeset-release.yml` | Main merge | Creates release PRs                    |
| `publish.yml`           | Release    | Publishes to npm                       |
| `docs-check.yml`        | PR         | Validates documentation                |
| `docs-sync.yml`         | Push       | Syncs docs across packages             |
| `accessibility.yml`     | PR         | A11y testing                           |
| `visual-regression.yml` | PR         | Visual tests                           |
| `dependency-review.yml` | PR         | Security scan                          |

---

## Critical Flow Mapping

### Local Development

```
pnpm dev
└── turbo run dev
    ├── packages/* → tsup --watch OR vite dev
    └── apps/docs → next dev
```

### Build Pipeline

```
pnpm build
└── turbo run build
    ├── packages/* → tsup (builds CJS + ESM)
    ├── apps/docs → next build
    └── apps/storybook → storybook build
```

### Test Pipeline

```
pnpm test
└── turbo run test
    └── packages/* → vitest run
```

### Lint Pipeline

```
pnpm lint
└── turbo run lint
    └── all packages/apps → eslint
```

### Publish Pipeline

```
pnpm changeset → create changeset
pnpm version-packages → apply versions
pnpm release → build + publish
```

---

## Configuration Duplications/Conflicts Noted

1. **next.config.js vs next.config.ts**: Many apps have both, TS version should be authoritative
2. **vite.config.js vs vite.config.ts**: Same duplication pattern
3. **tailwind.config.js vs tailwind.config.ts**: Same duplication pattern
4. **Multiple tsconfig variations**: Some packages have tsconfig.json + tsconfig.build.json +
   tsconfig.test.json

---

## Key Issues Identified

| ID      | Category | Issue                                                | Location            |
| ------- | -------- | ---------------------------------------------------- | ------------------- |
| CFG-001 | Build    | @clarity-chat/react sequential build script conflict | packages/react      |
| CFG-002 | Build    | @clarity-chat/codemods missing tsup.config           | packages/codemods   |
| CFG-003 | Build    | Marketing-site Turbopack panic                       | apps/marketing-site |
| CFG-004 | Types    | Missing DTS generation (disabled for memory)         | Multiple packages   |
| CFG-005 | Examples | TypeScript errors in example apps                    | apps/examples/\*    |
| CFG-006 | Config   | Duplicate .js/.ts config files                       | apps/examples/\*    |
