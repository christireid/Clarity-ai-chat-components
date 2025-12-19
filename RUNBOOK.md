# RUNBOOK.md

> **Canonical Commands** - Official commands to reproduce all quality gates. **Last Updated:**
> 2025-12-19 **Status:** Initial - will be finalized in Phase 6

---

## Prerequisites

### System Requirements

- **Node.js:** >= 20.0.0 (recommended: use `.nvmrc`)
- **pnpm:** >= 10.0.0 (v10.21.0 recommended)
- **OS:** Linux, macOS, or Windows with WSL

### Quick Setup

```bash
# Use correct Node version
nvm use  # reads .nvmrc (Node 20)

# Verify versions
node --version  # should be v20.x.x or higher
pnpm --version  # should be v10.x.x

# Install dependencies
pnpm install
```

---

## Quality Gate Commands

### Full Validation Suite

```bash
# Run all quality gates in sequence
pnpm check:all
# Equivalent to: pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

### Individual Gates

#### 1. Install Dependencies

```bash
pnpm install
```

**Expected:** Clean install with no warnings about missing peer deps.

#### 2. Build All Packages

```bash
pnpm build
# Or with memory limits:
NODE_OPTIONS='--max-old-space-size=4096' pnpm build
```

**Expected:** All packages build successfully. Key outputs:

- `packages/react/dist/` exists
- `packages/primitives/dist/` exists
- `packages/memory/dist/` exists

#### 3. Type Check

```bash
pnpm typecheck
```

**Expected:** Zero type errors across all packages.

#### 4. Lint

```bash
pnpm lint
```

**Expected:** Zero lint errors. (Warnings may exist if approved in DECISIONS.md)

#### 5. Format Check

```bash
pnpm format:check
```

**Expected:** All files properly formatted.

#### 6. Unit Tests

```bash
pnpm test
```

**Expected:** All tests pass. No flaky tests.

#### 7. E2E Tests

```bash
pnpm test:e2e
```

**Expected:** All E2E tests pass. (Requires packages to be built first)

---

## Clean Rebuild Procedure

When troubleshooting or verifying reproducibility:

```bash
# 1. Clean everything
pnpm clean
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules
rm -rf examples/*/node_modules
rm -rf tools/*/node_modules

# 2. Clear turbo cache
rm -rf .turbo

# 3. Fresh install
pnpm install

# 4. Fresh build
pnpm build

# 5. Full validation
pnpm check:all
```

---

## CI Parity

### Local CI Simulation

To match CI behavior exactly:

```bash
# Set CI environment variable
export CI=true

# Run the full CI sequence
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

### Key Differences from CI

- CI uses Ubuntu latest (linux)
- CI has Turbo remote cache enabled
- CI has security hardening (egress monitoring)

---

## Package-Specific Commands

### @clarity-chat/react

```bash
cd packages/react
pnpm build      # Build the package
pnpm typecheck  # Type check (builds deps first)
pnpm lint       # Lint check
pnpm test       # Run tests
```

### @clarity-chat/primitives

```bash
cd packages/primitives
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

### @clarity-chat/memory

```bash
cd packages/memory
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

---

## Troubleshooting

### Common Issues

#### "Cannot find module" errors during typecheck

**Solution:** Build dependencies first

```bash
pnpm build:packages
pnpm typecheck
```

#### Memory errors during build

**Solution:** Increase Node memory

```bash
NODE_OPTIONS='--max-old-space-size=4096' pnpm build
```

#### Stale cache issues

**Solution:** Force rebuild

```bash
pnpm build --force
# or
rm -rf .turbo && pnpm build
```

---

## Verification Checklist

Before merging, ensure:

- [ ] `pnpm install` - Clean install
- [ ] `pnpm build` - All packages build
- [ ] `pnpm typecheck` - Zero type errors
- [ ] `pnpm lint` - Zero lint errors
- [ ] `pnpm format:check` - All files formatted
- [ ] `pnpm test` - All tests pass
- [ ] Clean checkout reproduces (no local-only config)

---

_Document maintained as part of Zero-Defect Stabilization effort._
