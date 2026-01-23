# Build Audit Scope

## Repository Type

- **Type**: pnpm monorepo with Turborepo orchestration
- **Workspace Structure**:
  - `packages/*` - Core libraries (14 packages)
  - `apps/*` - Applications (4 main apps)
  - `apps/examples/*` - Example applications (~25 examples)
  - `tools/*` - Development tools (3 tools)

## Package Manager

- **Manager**: pnpm 10.21.0 (defined in package.json `packageManager` field)
- **Lockfile**: pnpm-lock.yaml (present)
- **Workspace Config**: pnpm-workspace.yaml

## Node Version

- **Required**: Node >=20.0.0, pnpm >=10.0.0 (defined in `engines`)
- **Current**: Node 22.22.0, pnpm 10.21.0

## Workspace Packages

### Core Packages (`packages/`)

| Package                          | Version | Build Tool      |
| -------------------------------- | ------- | --------------- |
| @clarity-chat/react              | 1.1.0   | tsup            |
| @clarity-chat/primitives         | 1.0.0   | tsup            |
| @clarity-chat/types              | 1.0.0   | tsup            |
| @clarity-chat/utils              | 1.0.0   | tsup            |
| @clarity-chat/memory             | -       | tsup            |
| @clarity-chat/license            | 1.0.0   | tsup            |
| @clarity-chat/token-optimization | 1.0.0   | tsup            |
| @clarity-chat/error-handling     | 2.0.0   | tsup            |
| @clarity-chat/testing-utils      | 2.0.0   | tsup            |
| @clarity-chat/cli                | 0.1.0   | tsup            |
| @clarity-chat/codemods           | 1.0.0   | tsup            |
| @clarity-chat/dev-tools          | -       | tsup            |
| @clarity-chat/playground         | 0.1.0   | vite            |
| @clarity-chat/typescript-config  | -       | (shared config) |

### Applications (`apps/`)

| App                            | Framework     | Private |
| ------------------------------ | ------------- | ------- |
| @clarity-chat/docs             | Next.js 16    | Yes     |
| @clarity-chat/storybook        | Storybook 8.6 | Yes     |
| @clarity-chat/marketing-site   | Next.js       | Yes     |
| @clarity-chat/streamlined-docs | Next.js       | Yes     |

### Tools (`tools/`)

| Tool                           | Purpose                       |
| ------------------------------ | ----------------------------- |
| @clarity-chat/docs-sync        | Documentation synchronization |
| @clarity-chat/mcp-server       | MCP server implementation     |
| @clarity-chat/vscode-extension | VS Code extension             |

## Build Orchestration

- **Tool**: Turborepo 2.6.3
- **Config**: turbo.json at root
- **Tasks**: build, dev, lint, typecheck, test, clean, docs-sync

## Key Configuration Files

- `tsconfig.json` / `tsconfig.base.json` - TypeScript root configs
- `eslint.config.js` - ESLint flat config
- `.prettierrc` - Prettier config
- `.changeset/config.json` - Changesets config
- `turbo.json` - Turborepo config

## Identified Build Issues (Baseline)

1. **CRITICAL**: @clarity-chat/react build fails with "Failed to build main"
2. **ROOT CAUSE**: Sequential build script runs tsup 13x, each triggering ALL 13 configs from
   tsup.config.ts (169 parallel builds!)
3. **SYMPTOM**: Race conditions from multiple "CLI Cleaning output folder" operations running in
   parallel

## Scripts Inventory (Root)

- `build` - Turbo build with memory limits
- `build:packages` - Build only packages
- `build:sequential` - Build with concurrency=1
- `lint` / `lint:fix` - ESLint via Turbo
- `typecheck` - TypeScript checking via Turbo
- `test` - Vitest via Turbo
- `storybook` / `storybook:build` - Storybook
- `docs` / `docs:build` - Documentation site
- `changeset` / `version-packages` / `release` - Publishing
- `prepare` - Husky hooks

## CI/CD Workflows

Located in `.github/workflows/`:

- `ci.yml` - Main CI (lint, typecheck, test, build)
- `changeset-check.yml` - Changeset validation
- `changeset-release.yml` - Release automation
- `publish.yml` - Package publishing
- `docs-check.yml` - Documentation checks
- `accessibility.yml` - A11y testing
- `visual-regression.yml` - Visual testing
- Others: dependency-review, ci-metrics, workflow-lint
