# Repository Reconnaissance Report

**Generated:** $(date)
**Node Version:** v22.21.1 (Requirement: >=18.0.0)
**Package Manager:** npm@10.2.4 (detected from package-lock.json)
**Repository:** clarity-chat (Clarity AI Chat Components)

## Workspace Structure

### Root Configuration
- **Monorepo Tool:** Turbo
- **Workspaces:** packages/*, apps/*, examples/*
- **TypeScript:** ^5.3.3 (strict mode enabled)
- **Linter:** ESLint (flat config format)

### Packages (10 total)
1. `@clarity-chat/react` - Main React component library
2. `@clarity-chat/types` - TypeScript type definitions
3. `@clarity-chat/primitives` - Primitive components
4. `@clarity-chat/error-handling` - Error handling utilities
5. `@clarity-chat/errors` - Error types
6. `@clarity-chat/licensing` - Licensing utilities
7. `@clarity-chat/cli` - CLI tools
8. `@clarity-chat/codemods` - Code migration tools
9. `@clarity-chat/dev-tools` - Developer tools
10. `@clarity-chat/playground` - Playground app

### Apps (3 total)
1. `@clarity-chat/storybook` - Storybook documentation
2. `@clarity-chat/docs` - Documentation content
3. `apps/docs-site` - Documentation site (Next.js)
4. `apps/marketing-site` - Marketing site (Next.js)

### Examples
- Multiple example apps (basic-chat, streaming-chat, enterprise demos, etc.)

## Quality Gate Scripts

### Root Scripts
- `lint`: `npx turbo run lint`
- `typecheck`: `npx turbo run typecheck`
- `test`: `npx turbo run test`
- `test:coverage`: `npx turbo run test -- --coverage`
- `build`: `npx turbo run build`
- `storybook`: Dev mode
- `storybook:build`: Build Storybook
- `test:e2e`: Playwright E2E tests

### Package Scripts Summary
- **TypeScript Configs:** 33 tsconfig.json files found
- **Test Runners:** Vitest (react, error-handling, licensing, codemods, cli), Jest (errors), none (dev-tools, primitives)
- **Build Tools:** tsup (react, primitives, licensing, types, cli), vite (error-handling, playground), tsc (codemods, errors, dev-tools)
- **Linters:** ESLint configured in root and some packages

## CI/CD Configuration
- Turbo cache enabled for builds
- Playwright configured for E2E (requires Storybook server)
- Changesets for versioning

## Entry Points
- Main library: `packages/react/dist/index.{js,mjs,d.ts}`
- Styles: `packages/react/dist/styles.css`
- CLI: `packages/cli/dist/index.js`

## Environment Requirements
- Node: >=18.0.0
- npm: >=9.0.0
- TypeScript: ^5.3.3
