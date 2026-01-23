# Build Audit Findings

## CRITICAL (Build-Breaking)

### CFG-001: @clarity-chat/react Sequential Build Script Race Condition

- **File(s)**: `packages/react/scripts/build-sequential.mjs`, `packages/react/tsup.config.ts`
- **Problem**: The sequential build script ran `npx tsup <entry>` which loaded tsup.config.ts
  containing 13 parallel build configs. This caused 13×13=169 simultaneous build processes racing on
  the dist folder.
- **Impact**: Build failure, non-deterministic outputs
- **Recommendation**: Add `--no-config` flag to bypass tsup.config.ts in sequential build
- **Acceptance Criteria**: `pnpm build` in packages/react succeeds
- **Effort**: S
- **Status**: ✅ FIXED

### CFG-002: @clarity-chat/codemods Missing tsup.config.ts

- **File(s)**: `packages/codemods/package.json`
- **Problem**: Build script calls `tsup` without entry point, tsup.config.ts was missing
- **Impact**: Build failure with "No input files" error
- **Recommendation**: Create tsup.config.ts with proper entry point
- **Acceptance Criteria**: `pnpm build` in packages/codemods succeeds
- **Effort**: S
- **Status**: ✅ FIXED (DTS disabled due to verbatimModuleSyntax issues)

### CFG-003: Marketing-Site Turbopack Panic

- **File(s)**: `apps/marketing-site/next.config.ts`
- **Problem**: Turbopack internal error "Dependency tracking is disabled so invalidation is not
  allowed"
- **Impact**: Build failure for marketing-site
- **Recommendation**: Remove empty `turbopack: {}` config
- **Acceptance Criteria**: `pnpm build` in apps/marketing-site succeeds
- **Effort**: S
- **Status**: ✅ FIXED

---

## HIGH (Type/Build Errors in Examples)

### CFG-004: enterprise-rag Citation Component Type Error

- **File(s)**: `apps/examples/enterprise-rag/src/app/page.tsx:500`
- **Problem**: Missing required `className` prop on Citation component
- **Impact**: Build failure for enterprise-rag-template
- **Recommendation**: Add `className=""` to Citation component
- **Acceptance Criteria**: TypeScript compilation succeeds
- **Effort**: S
- **Status**: ✅ FIXED

### CFG-005: advanced-chat-features Missing Token Functions

- **File(s)**: `apps/examples/advanced-chat-features/src/App.tsx`
- **Problem**: `addInputTokens` and `addOutputTokens` functions don't exist in useTokenTracker hook
- **Impact**: Build failure for advanced-chat-features
- **Recommendation**: Use `addTokenMessage` from useTokenTracker instead
- **Acceptance Criteria**: TypeScript compilation succeeds
- **Effort**: S
- **Status**: ✅ FIXED

### CFG-006: component-demo Import Errors

- **File(s)**: `apps/examples/component-demo/src/App.tsx`
- **Problem**:
  1. `DynamicCompressionEngine` export doesn't exist (did you mean `DynamicCompressionConfig`?)
  2. Duplicate identifier `EnhancedMarkdownRenderer`
- **Impact**: Build failure for component-demo
- **Recommendation**: Fix import names and remove duplicates
- **Acceptance Criteria**: TypeScript compilation succeeds
- **Effort**: S
- **Status**: 🔴 PENDING

---

## MEDIUM (Configuration Issues)

### CFG-007: Duplicate Config Files (JS + TS)

- **File(s)**: Multiple apps have both `.js` and `.ts` versions of configs
  - `next.config.js` + `next.config.ts`
  - `vite.config.js` + `vite.config.ts`
  - `tailwind.config.js` + `tailwind.config.ts`
- **Problem**: Confusion about which config is authoritative, potential conflicts
- **Impact**: Maintenance burden, potential misconfigurations
- **Recommendation**: Remove redundant `.js` files, keep only `.ts` versions
- **Acceptance Criteria**: Only one config file per type per app
- **Effort**: M

### CFG-008: DTS Generation Disabled in Core Packages

- **File(s)**: `packages/react/tsup.config.ts`, `packages/codemods/tsup.config.ts`
- **Problem**: TypeScript declaration files (.d.ts) not being generated during build
- **Impact**: Type inference issues in consuming apps, potential runtime type mismatches
- **Recommendation**: Enable DTS generation with proper configuration, or use tsc for declarations
- **Acceptance Criteria**: All published packages include .d.ts files
- **Effort**: M

### CFG-009: Missing type:module in Some Apps

- **File(s)**: Multiple Next.js apps show warnings about MODULE_TYPELESS_PACKAGE_JSON
- **Problem**: Package.json missing `"type": "module"` causing Node.js to reparse as ESM
- **Impact**: Performance overhead, console warnings
- **Recommendation**: Add `"type": "module"` to affected package.json files
- **Acceptance Criteria**: No MODULE_TYPELESS_PACKAGE_JSON warnings
- **Effort**: S

---

## LOW (DX/Polish Issues)

### CFG-010: ESLint Deprecation Warning

- **File(s)**: `.eslintignore`
- **Problem**: ESLintIgnoreWarning about .eslintignore no longer being supported
- **Impact**: Console warning during lint
- **Recommendation**: Migrate to `ignores` property in eslint.config.js
- **Acceptance Criteria**: No ESLint deprecation warnings
- **Effort**: S

### CFG-011: Vite Chunk Size Warnings

- **File(s)**: Multiple Vite apps
- **Problem**: Chunks larger than 500KB after minification
- **Impact**: Warning during build, potentially slower initial loads
- **Recommendation**: Implement code splitting or manual chunks
- **Acceptance Criteria**: No chunk size warnings (or explicit override with comment)
- **Effort**: M

### CFG-012: Missing Package Engines Field

- **File(s)**: Some workspace packages
- **Problem**: Not all packages specify Node.js version requirements
- **Impact**: Potential compatibility issues
- **Recommendation**: Add `engines` field to all packages matching root
- **Acceptance Criteria**: All packages have consistent engines field
- **Effort**: S

---

## Summary

| Severity  | Total  | Fixed | Pending |
| --------- | ------ | ----- | ------- |
| CRITICAL  | 3      | 3     | 0       |
| HIGH      | 3      | 2     | 1       |
| MEDIUM    | 3      | 0     | 3       |
| LOW       | 3      | 0     | 3       |
| **Total** | **12** | **5** | **7**   |
