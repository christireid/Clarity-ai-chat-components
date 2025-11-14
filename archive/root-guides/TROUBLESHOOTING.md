# Troubleshooting Guide

This document provides solutions for common issues encountered during development and building.

## 🔧 Build and Dependency Issues

### Issue: "Cannot find module 'framer-motion'" or import path errors

**Fixed in this PR:**
- ✅ Updated import paths in primitives package from `../utils/cn` to `../lib/utils`
- ✅ Added `framer-motion` as a dependency to `@clarity-chat/primitives` package.json
- ✅ Files affected:
  - `packages/primitives/src/components/drawer.tsx`
  - `packages/primitives/src/components/dialog.tsx`
  - `packages/primitives/src/components/tooltip.tsx`
  - `packages/primitives/src/components/popover.tsx`
  - `packages/primitives/package.json`

### Issue: Corrupted or incomplete `node_modules`

**Symptoms:**
- Commands like `tsup`, `tsc`, or `vite` not found
- Empty or partially installed packages
- `ENOTEMPTY` errors during npm install

**Solution:**
```bash
# 1. Complete clean (recommended for corrupted state)
rm -rf node_modules package-lock.json
find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name "package-lock.json" -type f -delete

# 2. Reinstall with legacy peer deps
npm install --legacy-peer-deps

# 3. If that fails, try with force
npm install --force

# 4. Generate lock file
npm install --package-lock-only --legacy-peer-deps
```

### Issue: Peer dependency conflicts (React 18 vs 19)

**Symptoms:**
- Error: `ERESOLVE unable to resolve dependency tree`
- Conflict between React 18 and React 19 peer dependencies

**Solution:**
Always use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
npm ci --legacy-peer-deps
```

**Why this happens:**
- Some packages require React 18 (e.g., `@remix-run/react`)
- Other packages use React 19
- npm's strict peer dependency resolution conflicts

### Issue: Turbo can't find workspaces

**Symptoms:**
```
WARNING: Could not resolve workspaces.
Lockfile not found at /home/user/webapp/package-lock.json
```

**Solution:**
```bash
# Generate package-lock.json
npm install --package-lock-only --legacy-peer-deps

# Or just proceed - Turbo will still work without lock file
npm run build
```

### Issue: Build failures with exit code 127

**Symptoms:**
```
sh: 1: tsup: not found
npm error command sh -c tsup
```

**Root cause:** Workspace dependencies not properly installed

**Solution:**
```bash
# Method 1: Reinstall everything
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Method 2: Install workspace dependencies individually
npm install --workspace=@clarity-chat/primitives --legacy-peer-deps
npm install --workspace=@clarity-chat/types --legacy-peer-deps
npm install --workspace=@clarity-chat/react --legacy-peer-deps

# Method 3: Build with npx (temporary workaround)
cd packages/types
npx -p typescript -p tsup tsup src/index.ts --format cjs,esm --dts
```

## 📦 Publishing Issues

### Issue: "You must sign up for private packages"

**Solution:**
You need an npm account with a paid plan to publish private packages:
1. Upgrade at: https://www.npmjs.com/products
2. Choose Pro ($7/month) for personal use
3. Or use GitHub Packages (free tier available)

See [PUBLISHING.md](./PUBLISHING.md) for complete instructions.

### Issue: Publishing permission denied

**Solution:**
1. Verify you have a valid npm token:
   ```bash
   npm whoami
   ```

2. Check .npmrc configuration:
   ```bash
   cat .npmrc
   # Should have: //registry.npmjs.org/:_authToken=YOUR_TOKEN
   ```

3. Ensure your account has access to @clarity-chat scope

## 🧪 Testing Issues

### Issue: Tests not running

**First check dependencies are installed:**
```bash
npm install --legacy-peer-deps
```

**Then run tests:**
```bash
# All tests
npm test

# Specific workspace
npm test --workspace=@clarity-chat/react

# With coverage
npm run test:coverage
```

### Issue: Type errors in tests

**Solution:**
```bash
# Run typecheck first
npm run typecheck

# Fix any TypeScript errors before running tests
```

## 🔍 TypeScript Issues

### Issue: "Cannot find module" errors

**Common causes:**
1. Missing dependencies
2. Incorrect tsconfig.json paths
3. Missing type definitions

**Solutions:**
```bash
# Install type definitions
npm install --save-dev @types/node @types/react @types/react-dom

# Verify tsconfig.json has correct paths
cat tsconfig.json | grep "paths"

# Rebuild packages
npm run clean
npm run build
```

### Issue: Incremental build cache causing issues

**Solution:**
```bash
# Clean all dist folders
npm run clean

# Clean TypeScript cache
find . -name "*.tsbuildinfo" -type f -delete

# Rebuild
npm run build
```

## 🚀 CI/CD Issues

### Issue: CI build fails but local works

**Common causes:**
1. Missing .npmrc in CI
2. Different Node version
3. Missing environment variables

**Solution for GitHub Actions:**
```yaml
- name: Setup Node
  uses: actions/setup-node@v3
  with:
    node-version: '18'  # Match your local version

- name: Configure NPM
  run: |
    echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > .npmrc

- name: Install dependencies
  run: npm ci --legacy-peer-deps  # Use ci for reproducible builds
```

## 💾 Memory Issues

### Issue: Build process killed or runs out of memory

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Then run build
npm run build
```

## 🔧 Development Workflow

### Recommended workflow for clean development:

```bash
# 1. Fresh start
git pull origin main
rm -rf node_modules package-lock.json
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# 2. Install
npm install --legacy-peer-deps

# 3. Build packages
npm run build

# 4. Run tests
npm test

# 5. Start development
npm run dev
```

## 📝 Additional Resources

- [NPM Workspaces Documentation](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Node.js Memory Management](https://nodejs.org/en/docs/guides/simple-profiling)
- [NPM Troubleshooting](https://docs.npmjs.com/common-errors)

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check existing GitHub Issues
2. Run with verbose logging: `npm install --legacy-peer-deps --verbose`
3. Clear npm cache: `npm cache clean --force`
4. Try with a fresh Node.js installation
5. Create a new issue with:
   - Node version: `node --version`
   - NPM version: `npm --version`
   - OS: `uname -a` (Linux/Mac) or `ver` (Windows)
   - Full error output
