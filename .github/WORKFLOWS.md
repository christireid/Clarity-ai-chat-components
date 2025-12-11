# CI/CD Workflows Documentation

This document describes all GitHub Actions workflows in the Clarity Chat repository.

## Overview

| Workflow          | Trigger                      | Purpose                  | Required Check | Duration  |
| ----------------- | ---------------------------- | ------------------------ | -------------- | --------- |
| CI                | PR, Push to main/develop     | Core validation          | ✅ Yes         | ~5-8 min  |
| Changeset Check   | PR to main                   | Validate changesets      | ✅ Yes         | ~2 min    |
| Changeset Release | Push to main                 | Automated releases       | ❌ No          | ~5-10 min |
| Documentation Check | PR, Push               | Validate docs consistency | ✅ Yes         | ~2 min    |
| Documentation Sync | Push to main                | Auto-generate docs       | ❌ No          | ~5 min    |
| Documentation Artifacts | PR, Push            | Detect dev artifacts     | ✅ Yes         | ~2 min    |
| Monthly Docs Audit | Schedule (monthly)          | Health check             | ❌ No          | ~2 min    |
| Validate LLMs     | PR                           | Validate llms.txt        | ✅ Yes         | ~3 min    |
| Generate LLMs     | PR, Push                     | Generate AI docs         | ❌ No          | ~3 min    |
| Dependency Review | PR (deps changes)            | Security audit           | ✅ Yes         | ~2 min    |
| Accessibility     | PR, Push (component changes) | A11y testing             | ✅ Yes         | ~10-15 min |
| Visual Regression | PR, Push (component changes) | Screenshot tests         | ✅ Yes         | ~10-15 min |
| Workflow Lint     | PR, Push (workflow changes)  | Validate workflow syntax | ✅ Yes         | ~1 min    |

## Security Features

All workflows implement these security best practices:

| Feature | Status | Description |
|---------|--------|-------------|
| **SHA Pinning** | ✅ 100% | All 74+ actions pinned to immutable commit hashes |
| **Permissions** | ✅ 100% | Explicit least-privilege `permissions:` blocks |
| **Timeouts** | ✅ 100% | All jobs have `timeout-minutes` set |
| **Concurrency** | ✅ 100% | Duplicate runs cancelled automatically |
| **Harden Runner** | ✅ CI, A11y, Visual | StepSecurity runtime protection (egress monitoring) |
| **Turbo Remote Cache** | ✅ CI | 60-80% faster builds via shared cache |
| **Retry Logic** | ✅ CI | Automatic retry for transient network failures |
| **Dependabot** | ✅ | Auto-updates for GitHub Actions and npm packages |
| **PR Failure Comments** | ✅ CI | Automatic PR comments on CI failures |
| **Manual Dispatch** | ✅ CI | Debug mode and cache bypass options |
| **Cache Statistics** | ✅ CI | Turbo cache hit/miss reporting |
| **Reusable Workflows** | ✅ | `_setup.yml` base workflow available |

---

## Workflows

### ci.yml - Continuous Integration

**Purpose**: Validates code quality on every PR and push to main/develop.

**Triggers**:

- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Path Filters**: Ignores changes to:
- `docs/**`, `*.md`, `.changeset/**`, `.github/ISSUE_TEMPLATE/**`, `.github/PULL_REQUEST_TEMPLATE/**`, `LICENSE`

**Jobs**:

| Job        | Timeout | Purpose                      | Dependencies                 |
| ---------- | ------- | ---------------------------- | ---------------------------- |
| lint       | 10 min  | ESLint + Prettier            | None (parallel)              |
| typecheck  | 10 min  | TypeScript compilation       | None (parallel)              |
| test       | 15 min  | Vitest unit tests            | None (parallel)              |
| build      | 15 min  | Build all packages           | lint, typecheck, test        |

**Security Features**:
- StepSecurity Harden Runner on all jobs
- Turbo Remote Cache for cross-run caching
- Retry logic for dependency installation

---

### changeset-release.yml - Package Release

**Purpose**: Automates version bumping and publishing via Changesets.

**Triggers**:

- Push to `main` (on package/changeset changes)

**Behavior**:

1. If changesets exist → Creates "Version Packages" PR with version bumps
2. If version PR is merged → Publishes to npm, creates GitHub release

**Required Secrets**:

- `NPM_TOKEN`: For npm publishing
- `GITHUB_TOKEN`: Auto-provided for GitHub releases

**Path Filters**: Only runs on changes to:

- `packages/**`
- `.changeset/**`
- `pnpm-lock.yaml`

---

### changeset-check.yml - Changeset Validation

**Purpose**: Ensures PRs that modify package source code include a changeset.

**Triggers**:

- Pull requests to `main`

**Path Filters**: Only runs on changes to:

- `packages/**/src/**`
- `.changeset/**`

**Behavior**:

- Fails if package source files changed without a changeset
- Skips check for non-source changes (docs, configs, etc.)

---

### docs-check.yml - Documentation Check

**Purpose**: Validates documentation consistency with code.

**Triggers**:
- Push to `main` or `develop`
- Pull requests to `main`

**Path Filters**: Only runs on changes to:
- `docs/**`, `README.md`, `packages/*/README.md`
- `apps/docs/lib/**`, `apps/docs/app/reference/**`

**Checks**:
- Node.js version consistency across docs
- TypeScript version consistency
- Documented exports actually exist in code

---

### docs-sync.yml - Documentation Sync

**Purpose**: Auto-generates documentation from source code.

**Triggers**:
- Push to `main`
- Manual dispatch

**Path Filters**: Only runs on changes to:
- `packages/*/src/**/*.ts`, `packages/*/src/**/*.tsx`

**Process**:
1. Detects documentation-relevant changes
2. Runs docs-sync tool
3. Commits and pushes updates with `[skip ci]`

---

### docs-artifact-check.yml - Documentation Artifacts

**Purpose**: Detects development artifacts that shouldn't be committed.

**Triggers**:
- Pull requests
- Push to `main`

**Path Filters**: Only runs on changes to:
- `**.md`, `**.txt`, `docs/**`

**Blocked patterns**:
- `*_COMPLETE.md`, `*_SUMMARY.md`, `*_STATUS.md`, `*_REPORT.md`
- `PHASE_1_*.md` through `PHASE_5_*.md`
- `CLEANUP_*.md`, `OPTIMIZATION_*.md`, `REFACTOR_*.md`

---

### monthly-docs-audit.yml - Monthly Documentation Audit

**Purpose**: Monthly automated documentation health check.

**Triggers**:
- Schedule: First Monday of each month at 9 AM UTC
- Manual dispatch

**Creates GitHub Issue with**:
- File count trends
- Health report
- Action items

---

### dependency-review.yml - Security Review

**Purpose**: Reviews dependency changes for security vulnerabilities and license issues.

**Triggers**:

- Pull requests to `main` or `develop` (on dependency changes)

**Path Filters**: Only runs on changes to:

- `package.json`
- `pnpm-lock.yaml`
- `packages/**/package.json`

**Jobs**:

| Job               | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| dependency-review | GitHub dependency review (vulnerabilities, licenses) |
| audit             | pnpm audit for known vulnerabilities                 |

**Configuration**:

- Fails on: `moderate` severity or higher
- Denied licenses: `GPL-2.0`, `GPL-3.0`

---

### accessibility.yml - Accessibility Testing

**Purpose**: Runs accessibility tests on Storybook components and Lighthouse audits.

**Triggers**:

- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Path Filters**: Only runs on changes to:

- `packages/**/src/**`
- `apps/storybook/**`
- `apps/docs/**`

**Jobs**:

| Job            | Purpose                                            |
| -------------- | -------------------------------------------------- |
| a11y-storybook | Axe accessibility tests via Storybook test-runner  |
| lighthouse     | Lighthouse CI performance and accessibility audits |

---

### visual-regression.yml - Visual Regression Testing

**Purpose**: Detects unintended visual changes to components.

**Triggers**:

- Pull requests to `main`
- Pushes to `main`

**Path Filters**: Only runs on changes to:

- `packages/**/src/**`
- `apps/storybook/**`
- `tests/visual/**`

**Artifacts**: On failure, uploads screenshot diffs for review.

---

### workflow-lint.yml - Workflow Validation

**Purpose**: Validates GitHub Actions workflow syntax using actionlint.

**Triggers**:

- Pull requests modifying `.github/workflows/**` or `.github/actions/**`
- Pushes to `main` with workflow changes

**Jobs**:

| Job        | Purpose                                           |
| ---------- | ------------------------------------------------- |
| actionlint | Validates workflow YAML syntax and best practices |

---

## Composite Actions

Reusable composite actions in `.github/actions/`:

### setup-node-pnpm

Sets up Node.js, pnpm, and installs dependencies with caching and **retry logic**.

**Inputs**:

- `node-version` (default: `20`): Node.js version
- `pnpm-version` (default: `10`): pnpm version
- `install-dependencies` (default: `true`): Whether to run pnpm install
- `frozen-lockfile` (default: `true`): Use frozen lockfile

**Features**:
- Automatic retry (3 attempts) with exponential backoff
- pnpm store caching via setup-node

**Usage**:

```yaml
- uses: ./.github/actions/setup-node-pnpm
  with:
    node-version: '20'
```

### turbo-cache

Configures Turbo local caching for GitHub Actions.

**Inputs**:

- `task` (required): Task name for cache key segmentation
- `extra-hash-files`: Additional files to include in hash

**Usage**:

```yaml
- uses: ./.github/actions/turbo-cache
  with:
    task: 'build'
```

---

## Reusable Workflows

### _setup.yml

A reusable workflow that provides standardized setup for all CI jobs:
- Security hardening with Harden Runner
- Node.js and pnpm setup with caching
- Dependency installation with retry logic
- Turbo Remote Cache configuration

**Inputs**:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `node-version` | string | `'20'` | Node.js version |
| `pnpm-version` | string | `'10'` | pnpm version |
| `run-command` | string | `''` | Command to run after setup |
| `timeout-minutes` | number | `15` | Job timeout |
| `skip-cache` | boolean | `false` | Skip Turbo cache |
| `enable-harden-runner` | boolean | `true` | Enable StepSecurity |
| `fetch-depth` | number | `1` | Git fetch depth |

**Outputs**:

| Output | Description |
|--------|-------------|
| `duration` | Job duration in seconds |
| `cache-hit` | Whether pnpm cache was hit |

**Usage**:

```yaml
jobs:
  my-job:
    uses: ./.github/workflows/_setup.yml
    with:
      node-version: '20'
      run-command: 'pnpm lint'
```

---

## Caching Strategy

| Cache Type | Implementation | Key Pattern | Benefit |
| ---------- | -------------- | ----------- | ------- |
| pnpm store | `actions/setup-node` | `{os}-pnpm-{lockfile-hash}` | Fast dependency install |
| Turbo Remote | `rharkor/caching-for-turbo` | Automatic | 60-80% faster builds |
| Turbo Local | `.github/actions/turbo-cache` | `{os}-turbo-{task}-{sha}` | Task-level caching |

---

## Adding New Workflows

When creating new workflows, follow these requirements:

```yaml
# Required security configuration
permissions:
  contents: read  # Minimal permissions

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  job-name:
    runs-on: ubuntu-latest
    timeout-minutes: 10  # REQUIRED
    steps:
      # Recommended: Add Harden Runner for security monitoring
      - name: Harden Runner
        uses: step-security/harden-runner@c6295a65d1254861815972266d5933fd6e532bdf # v2.11.1
        with:
          egress-policy: audit

      # SHA-pinned actions only (not tags like @v4)
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

**Checklist**:
1. ✅ Pin all actions to full SHA (use `npx pin-github-action@v1`)
2. ✅ Add explicit `permissions` block (least privilege)
3. ✅ Set `timeout-minutes` on all jobs
4. ✅ Add `concurrency` group to prevent duplicates
5. ✅ Add `paths` filter if applicable
6. ✅ Consider adding `step-security/harden-runner`
7. ✅ Update this documentation

---

## Local Testing

### Quick Commands

```bash
# Validate workflow syntax
npx actionlint

# Run CI checks locally
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Run specific workflow with act (requires Docker)
act -W .github/workflows/ci.yml
```

### Workflow Test Script

A comprehensive test script is available at `scripts/test-workflows.sh`:

```bash
# Run all validations
./scripts/test-workflows.sh

# Only run actionlint
./scripts/test-workflows.sh --lint

# Security checks only
./scripts/test-workflows.sh --security

# Dry-run ci.yml with act
./scripts/test-workflows.sh --ci

# Dry-run specific workflow
./scripts/test-workflows.sh --dry-run docs-sync.yml
```

**Features**:
- YAML syntax validation
- actionlint checks
- Security audit (SHA pinning, permissions, timeouts, concurrency)
- Best practices verification
- Optional act dry-run support

---

## Troubleshooting

### Common Issues

1. **Workflow doesn't trigger**: Check path filters match your changes
2. **Action version mismatch**: Run `npx pin-github-action@v1` to update SHAs
3. **Cache miss**: Check if lockfile or workflow changed
4. **Timeout exceeded**: Increase `timeout-minutes` or optimize the job
5. **Harden Runner warnings**: Review egress in StepSecurity dashboard

### Useful Commands

```bash
# Check workflow syntax
npx actionlint .github/workflows/*.yml

# Update action SHAs
npx pin-github-action@v1 .github/workflows/*.yml

# View recent workflow runs (requires gh CLI)
gh run list --workflow=ci.yml

# Test workflow locally
act push -W .github/workflows/ci.yml
```

---

*Last updated: December 2025*
