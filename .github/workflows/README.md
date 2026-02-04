# GitHub Actions Workflows

This directory contains all CI/CD workflows for the Clarity Chat Components monorepo.

## Workflows Overview

### Core CI/CD

#### `ci.yml` - Main CI Pipeline

**Triggers**: Push to main/develop, Pull Requests **Purpose**: Primary build, test, and validation
pipeline

**Jobs**:

- **Lint**: ESLint and Prettier checks
- **Typecheck**: TypeScript type validation
- **Test**: Unit and integration tests
- **Build**: Package builds with peer dependencies
- **CI Summary**: Performance metrics and failure notifications

**Features**:

- ✅ Parallel job execution for speed
- ✅ Turbo Remote Cache for build optimization
- ✅ SHA-pinned actions for security
- ✅ StepSecurity Harden Runner
- ✅ Peer dependency installation
- ✅ Automated PR comments on failure

---

#### `publish.yml` - Package Publishing

**Triggers**: Version tags (`v*`), Manual dispatch **Purpose**: Publish packages to GitHub Packages

**Jobs**:

- **Publish**: Build and publish with provenance
- **Verify**: Installation and import verification

**Features**:

- ✅ Dry-run mode for testing
- ✅ NPM provenance for supply chain security
- ✅ Automatic release notes generation
- ✅ Full peer dependency installation for complete build
- ✅ Security audit before publish

---

### Peer Dependency Management

#### `peer-dependency-tests.yml` - Peer Dependency Validation

**Triggers**: PRs and pushes affecting package.json or source code **Purpose**: Ensure package works
with various peer dependency configurations

**Jobs**:

1. **Test with All Peers**: Validates all features work with all dependencies
2. **Test with Required Peers Only**: Ensures core functionality works with minimal dependencies
3. **Test Optional Peer Degradation**: Validates graceful degradation when optional peers missing
4. **Validate Peer Dependencies**: Checks package.json configuration

**Test Matrix**:

```yaml
Configurations:
  - Without Shiki (code highlighting)
  - Without Mermaid (diagrams)
  - Without PDF.js (PDF processing)
  - Without Mammoth (DOCX processing)
```

**Features**:

- ✅ Tests multiple peer dependency scenarios
- ✅ Validates graceful degradation
- ✅ Ensures required peers are properly marked
- ✅ Verifies optional features fail gracefully

---

### Bundle Size Monitoring

#### `bundle-size-check.yml` - Bundle Size Analysis

**Triggers**: PRs and pushes affecting source code **Purpose**: Monitor and enforce bundle size
limits

**Measurements**:

- Main bundle (`index.js`)
- Core bundle (`core.js`)
- Slim bundle (`slim.js`)

**Limits** (gzipped):

```
MAX_BUNDLE_SIZE_KB: 800 KB
MAX_CORE_SIZE_KB: 250 KB
MAX_SLIM_SIZE_KB: 150 KB
MAX_GROWTH_PERCENT: 5%
```

**Jobs**:

1. **Measure Current**: Build and measure current bundle sizes
2. **Measure Base**: Build and measure base branch (PRs only)
3. **Compare and Report**: Calculate changes and post PR comment
4. **Check Size Limits**: Enforce absolute size limits

**Features**:

- ✅ Automated PR comments with size comparison
- ✅ Fails if bundle grows more than 5%
- ✅ Fails if absolute size limits exceeded
- ✅ Shows before/after comparison
- ✅ Provides optimization tips

**Example PR Comment**:

```markdown
## 📦 Bundle Size Report

| Bundle | Base   | Current | Change             | Status |
| ------ | ------ | ------- | ------------------ | ------ |
| Main   | 450 KB | 460 KB  | 📈 +10 KB (+2.22%) | ✅     |
| Core   | 200 KB | 205 KB  | 📈 +5 KB (+2.50%)  | ✅     |
| Slim   | 120 KB | 120 KB  | ➖ 0 KB (0.00%)    | ✅     |
```

---

### Documentation & Quality

#### `docs-check.yml` - Documentation Validation

**Triggers**: PRs affecting documentation **Purpose**: Validate documentation builds and links

#### `accessibility.yml` - Accessibility Testing

**Triggers**: PRs affecting components **Purpose**: Automated WCAG compliance testing

#### `visual-regression.yml` - Visual Regression Testing

**Triggers**: PRs affecting UI components **Purpose**: Detect unintended visual changes

#### `e2e-tests.yml` - End-to-End Tests

**Triggers**: PRs and scheduled runs **Purpose**: Full integration testing with Playwright

---

## Peer Dependency Installation in CI

### Standard Installation (Build & Test)

```bash
# packages/react/scripts/install-peers-ci.js
node scripts/install-peers-ci.js standard
```

Installs: React, Framer Motion, Lucide, Zod, React Markdown, Shiki

### Minimal Installation (Core Only)

```bash
node scripts/install-peers-ci.js minimal
```

Installs: React, Framer Motion, Lucide, Zod

### Full Installation (All Features)

```bash
node scripts/install-peers-ci.js full
```

Installs: All peer dependencies including optional ones

### Custom Installation

```bash
node scripts/install-peers-ci.js custom core reactDom markdown
```

Installs: Only specified features

---

## Bundle Size Monitoring Best Practices

### Local Testing

```bash
# Measure bundle sizes locally
cd packages/react
pnpm build
node scripts/measure-bundle-sizes.ts
```

### Before Submitting PR

1. Run `pnpm build` to verify build succeeds
2. Check bundle sizes: `pnpm size`
3. Review size-limit output
4. Ensure changes don't exceed 5% growth

### When Bundle Size Grows

If the bundle size check fails:

1. **Review Imports**
   - Use tree-shakeable imports: `import { specific } from 'lib'`
   - Avoid `import * as` unless necessary
   - Use `import type` for TypeScript types

2. **Check Dependencies**
   - Ensure large dependencies are peer dependencies
   - Consider marking more dependencies as optional
   - Use dynamic imports for heavy features

3. **Lazy Loading**

   ```tsx
   // ✅ Lazy load heavy components
   const MonacoEditor = lazy(() => import('./MonacoEditor'))

   <Suspense fallback={<Skeleton />}>
     <MonacoEditor />
   </Suspense>
   ```

4. **Code Splitting**
   - Split large features into separate entry points
   - Use entry point exports: `@clarity-chat/react/animations`

5. **Bundle Analysis**
   ```bash
   pnpm size:why
   pnpm size:analyze
   ```

---

## Security Features

All workflows include:

### StepSecurity Harden Runner

```yaml
- name: Harden Runner
  uses: step-security/harden-runner@v2.11.1
  with:
    egress-policy: audit
    disable-sudo: true
```

### SHA-Pinned Actions

```yaml
# ✅ Good: SHA-pinned
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

# ❌ Bad: Version tag only
uses: actions/checkout@v4
```

### Minimal Permissions

```yaml
permissions:
  contents: read
  pull-requests: write
```

---

## Workflow Dispatch (Manual Triggers)

### CI Workflow

```bash
# Run CI with debugging enabled
gh workflow run ci.yml -f debug_enabled=true

# Run CI with cache disabled
gh workflow run ci.yml -f skip_cache=true

# Run all jobs regardless of path filters
gh workflow run ci.yml -f run_all_jobs=true
```

### Publish Workflow

```bash
# Dry run (no actual publish)
gh workflow run publish.yml -f dry_run=true
```

---

## Monitoring & Alerts

### Failed Workflows

- Automated PR comments with failure details
- Links to full logs
- Suggestions for debugging

### Bundle Size Growth

- PR comments when size increases
- Fails if growth exceeds 5%
- Provides optimization tips

### Peer Dependency Issues

- Lists missing required peers
- Validates graceful degradation
- Ensures proper peerDependenciesMeta

---

## Local Development

### Running CI Checks Locally

```bash
# Run all checks (matches CI)
pnpm check

# Individual checks
pnpm typecheck
pnpm lint
pnpm test
pnpm build

# Peer dependency tests
cd packages/react
node scripts/install-peers-ci.js minimal
pnpm build
pnpm test
```

### Bundle Size Analysis

```bash
cd packages/react

# Measure current sizes
pnpm build
node scripts/measure-bundle-sizes.ts

# Size limit check
pnpm size

# Detailed analysis
pnpm size:why
```

---

## Troubleshooting

### Build Failures

1. Check peer dependencies are installed
2. Clear dist and node_modules: `pnpm clean && pnpm install`
3. Run typecheck: `pnpm typecheck`
4. Check build logs for specific errors

### Test Failures

1. Run tests locally: `pnpm test`
2. Check for missing peer dependencies
3. Verify test environment matches CI

### Bundle Size Failures

1. Check what changed: `git diff main -- packages/react/src`
2. Run local bundle analysis
3. Review imports for tree-shaking issues
4. Consider code splitting or lazy loading

### Peer Dependency Issues

1. Verify peerDependencies in package.json
2. Check peerDependenciesMeta for optional flags
3. Test with minimal peers: `node scripts/install-peers-ci.js minimal`

---

## Maintenance

### Updating Workflows

- All action versions are SHA-pinned for security
- Check for updates: https://github.com/step-security/harden-runner
- Update SHA pins when updating action versions

### Adjusting Bundle Size Limits

Edit `.github/workflows/bundle-size-check.yml`:

```yaml
env:
  MAX_BUNDLE_SIZE_KB: 800 # Increase if needed
  MAX_CORE_SIZE_KB: 250
  MAX_SLIM_SIZE_KB: 150
  MAX_GROWTH_PERCENT: 5 # Tighten to prevent bloat
```

### Adding New Peer Dependencies

1. Add to `peerDependencies` in package.json
2. Add to `peerDependenciesMeta` with optional flag
3. Update install-peers.js FEATURES mapping
4. Add test case to peer-dependency-tests.yml

---

## Related Documentation

- [Main CI Documentation](../../CLAUDE.md)
- [Package Development Guide](../../packages/react/CLAUDE.md)
- [Peer Dependencies Guide](../../packages/react/scripts/INSTALL_PEERS_README.md)
- [Bundle Size Strategy](../../docs/bundle-size-strategy.md)
- [Security Guidelines](../../SECURITY.md)

---

**Last Updated**: 2026-01-26 **Maintained By**: Clarity Chat Team
