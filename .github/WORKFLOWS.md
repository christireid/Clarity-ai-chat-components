# CI/CD Workflows Documentation

This document describes all GitHub Actions workflows in the Clarity Chat repository.

## Overview

| Workflow          | Trigger                      | Purpose                  | Estimated Duration |
| ----------------- | ---------------------------- | ------------------------ | ------------------ |
| CI                | PR, Push to main/develop     | Core validation          | ~5-8 min           |
| Release           | Push to main                 | Automated releases       | ~5-10 min          |
| Changeset Check   | PR to main                   | Validate changesets      | ~2 min             |
| Dependency Review | PR (deps changes)            | Security audit           | ~2 min             |
| Accessibility     | PR, Push (component changes) | A11y testing             | ~10-15 min         |
| Visual Regression | PR, Push (component changes) | Screenshot tests         | ~10-15 min         |
| Workflow Lint     | PR, Push (workflow changes)  | Validate workflow syntax | ~1 min             |

## Workflows

### ci.yml - Continuous Integration

**Purpose**: Validates code quality on every PR and push to main/develop.

**Triggers**:

- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`
- Manual dispatch

**Path Filters**: Only runs on changes to:

- `packages/**`
- `apps/**`
- `pnpm-lock.yaml`
- `turbo.json`
- `tsconfig*.json`

**Jobs**:

| Job        | Timeout | Purpose                      | Dependencies                 |
| ---------- | ------- | ---------------------------- | ---------------------------- |
| lint       | 10 min  | ESLint + Prettier            | None                         |
| typecheck  | 10 min  | TypeScript compilation       | None                         |
| test       | 15 min  | Vitest unit tests + coverage | None                         |
| build      | 15 min  | Build all packages           | None                         |
| storybook  | 15 min  | Build Storybook              | build                        |
| ci-success | 5 min   | Aggregate status check       | lint, typecheck, test, build |

**Required Secrets**:

- `CODECOV_TOKEN` (optional): For coverage upload

---

### changeset-release.yml - Package Release

**Purpose**: Automates version bumping and publishing via Changesets.

**Triggers**:

- Push to `main` (on package/changeset changes)
- Manual dispatch

**Behavior**:

1. If changesets exist → Creates "Version Packages" PR with version bumps
2. If version PR is merged → Publishes to npm, creates GitHub release

**Required Secrets**:

- `GITHUB_TOKEN`: Auto-provided for GitHub Packages

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
- Manual dispatch

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

Sets up Node.js, pnpm, and installs dependencies with caching.

**Inputs**:

- `node-version` (default: `20`): Node.js version
- `pnpm-version` (default: `10`): pnpm version
- `install-dependencies` (default: `true`): Whether to run pnpm install
- `frozen-lockfile` (default: `true`): Use frozen lockfile

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

## Security Features

All workflows implement these security best practices:

- **SHA Pinning**: All actions pinned to full commit SHA (not tags)
- **Explicit Permissions**: Least-privilege permissions per workflow/job
- **Timeouts**: All jobs have timeout-minutes to prevent stuck workflows
- **Concurrency**: Prevents duplicate runs, cancels outdated ones
- **Path Filtering**: Workflows only run on relevant file changes

## Caching Strategy

| Cache      | Key Pattern                 | Restoration               |
| ---------- | --------------------------- | ------------------------- |
| pnpm store | `{os}-pnpm-{lockfile-hash}` | Via `setup-node` cache    |
| Turbo      | `{os}-turbo-{task}-{sha}`   | Falls back to task prefix |

## Adding New Workflows

1. Copy an existing workflow as a template
2. Pin all actions to full SHA (use `npx pin-github-action@v1`)
3. Add explicit `permissions` block (least privilege)
4. Set `timeout-minutes` on all jobs
5. Add `concurrency` group to prevent duplicates
6. Add `paths` filter if applicable
7. Update this documentation

## Local Testing

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

## Troubleshooting

### Common Issues

1. **Workflow doesn't trigger**: Check path filters match your changes
2. **Action version mismatch**: Run `npx pin-github-action@v1` to update SHAs
3. **Cache miss**: Check if lockfile or workflow changed
4. **Timeout exceeded**: Increase `timeout-minutes` or optimize the job

### Useful Commands

```bash
# Check workflow syntax
npx actionlint .github/workflows/*.yml

# Update action SHAs
npx pin-github-action@v1 .github/workflows/*.yml

# View recent workflow runs (requires gh CLI)
gh run list --workflow=ci.yml
```
