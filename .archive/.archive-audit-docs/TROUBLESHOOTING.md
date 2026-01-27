# Troubleshooting Guide

Common issues and solutions for @clarity-ai/react peer dependencies.

## Table of Contents

- [Module Not Found Errors](#module-not-found-errors)
- [Version Conflicts](#version-conflicts)
- [Shiki Module Not Found](#shiki-module-not-found)
- [Build Failures](#build-failures)
- [TypeScript Errors](#typescript-errors)
- [Bundle Size Not Reduced](#bundle-size-not-reduced)

---

## Module Not Found Errors

### Problem

```
Error: Cannot find module 'react'
Error: Cannot find module 'react-dom'
Error: Cannot find module 'next'
```

### Solution

Install the missing peer dependencies:

```bash
# For npm
npm install react react-dom

# For pnpm
pnpm add react react-dom

# For yarn
yarn add react react-dom
```

If using Next.js:

```bash
# For npm
npm install next react react-dom

# For pnpm
pnpm add next react react-dom

# For yarn
yarn add next react react-dom
```

### Verify Installation

```bash
# Check installed versions
npm list react react-dom next

# Or check package.json
cat package.json | grep -A 3 '"dependencies"'
```

---

## Version Conflicts

### Problem

```
npm WARN ERESOLVE overriding peer dependency
ERESOLVE unable to resolve dependency tree
```

### Diagnosis

Check for version mismatches:

```bash
# List all peer dependency warnings
npm list --depth=0 2>&1 | grep UNMET

# Or for pnpm
pnpm list --depth=0 2>&1 | grep "peer"
```

### Solution 1: Update Dependencies

Update to compatible versions:

```bash
# For npm
npm install react@latest react-dom@latest

# For pnpm
pnpm add react@latest react-dom@latest

# For yarn
yarn add react@latest react-dom@latest
```

### Solution 2: Use Specific Compatible Versions

Install exact compatible versions:

```bash
# React 18.x (recommended)
npm install react@^18.2.0 react-dom@^18.2.0

# Next.js 14.x (recommended)
npm install next@^14.0.0

# Next.js 15.x (also supported)
npm install next@^15.0.0
```

### Solution 3: Force Resolution (Last Resort)

**npm (package.json):**

```json
{
  "overrides": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

**pnpm (pnpm-workspace.yaml or pnpm):**

```yaml
overrides:
  react: ^18.2.0
  react-dom: ^18.2.0
```

**yarn (package.json):**

```json
{
  "resolutions": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

Then reinstall:

```bash
# Delete lock file and node_modules
rm -rf node_modules package-lock.json
npm install

# For pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install

# For yarn
rm -rf node_modules yarn.lock
yarn install
```

---

## Shiki Module Not Found

### Problem

```
Error: Cannot find module 'shiki'
Module not found: Can't resolve 'shiki'
```

### Cause

Shiki is an optional peer dependency for syntax highlighting in code blocks.

### Solution 1: Install Shiki (Recommended)

```bash
# For npm
npm install shiki

# For pnpm
pnpm add shiki

# For yarn
yarn add shiki
```

### Solution 2: Disable Syntax Highlighting

If you don't need syntax highlighting:

```tsx
import { ClarityChat } from '@clarity-ai/react'

;<ClarityChat
  config={{
    features: {
      codeHighlighting: false,
    },
  }}
/>
```

Or use a simpler code block renderer:

```tsx
import { ClarityChat } from '@clarity-ai/react'

const CustomCodeBlock = ({ children, className }) => (
  <pre className={className}>
    <code>{children}</code>
  </pre>
)

;<ClarityChat
  components={{
    code: CustomCodeBlock,
  }}
/>
```

### Verify Shiki Installation

```bash
# Check if shiki is installed
npm list shiki

# Test import in Node
node -e "require('shiki')"
```

---

## Build Failures

### Problem 1: Peer Dependency Warnings Break Build

```
npm ERR! peer dep missing: react@^18.0.0
Build failed with errors
```

### Solution

Install all peer dependencies before building:

```bash
# Install peer dependencies
npm install react@^18.2.0 react-dom@^18.2.0

# Clear cache and rebuild
npm run clean
npm run build
```

### Problem 2: Next.js Build Failures

```
Error: Module not found in Next.js build
```

### Solution

Ensure Next.js is installed as a peer dependency:

```bash
npm install next@^14.0.0 react@^18.2.0 react-dom@^18.2.0
```

Update `next.config.js` to transpile the package:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@clarity-ai/react'],
  // If using App Router
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
```

### Problem 3: TypeScript Build Errors

```
TS2307: Cannot find module '@clarity-ai/react' or its corresponding type declarations
```

### Solution

```bash
# Install types for dependencies
npm install --save-dev @types/react @types/react-dom @types/node

# Verify TypeScript can find the package
npx tsc --noEmit
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "skipLibCheck": true
  }
}
```

### Problem 4: Vite Build Failures

```
Error: Failed to resolve entry for package "@clarity-ai/react"
```

### Solution

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@clarity-ai/react'],
  },
  resolve: {
    alias: {
      '@clarity-ai/react': '@clarity-ai/react',
    },
  },
})
```

---

## TypeScript Errors

### Problem 1: Missing Type Declarations

```
TS7016: Could not find a declaration file for module '@clarity-ai/react'
```

### Solution

Install type dependencies:

```bash
# Install React types
npm install --save-dev @types/react @types/react-dom

# If using Next.js
npm install --save-dev @types/node

# Clear TypeScript cache
rm -rf node_modules/.cache
npx tsc --build --clean
```

### Problem 2: JSX Type Errors

```
TS2786: 'ClarityChat' cannot be used as a JSX component
```

### Solution

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "types": ["react", "react-dom"]
  }
}
```

For Next.js projects:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  }
}
```

### Problem 3: Incompatible React Types

```
Types of property 'children' are incompatible
```

### Solution

Ensure consistent React versions:

```bash
# Remove all React-related packages
npm uninstall react react-dom @types/react @types/react-dom

# Reinstall with exact versions
npm install react@18.2.0 react-dom@18.2.0
npm install --save-dev @types/react@18.2.0 @types/react-dom@18.2.0

# Clear TypeScript cache
rm -rf node_modules/.cache tsconfig.tsbuildinfo
```

---

## Bundle Size Not Reduced

### Problem

Bundle size remains large after installing peer dependencies.

### Diagnosis

Check if dependencies are properly externalized:

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# For Next.js
npm install @next/bundle-analyzer
```

**Next.js: `next.config.js`**

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})
```

Run analysis:

```bash
ANALYZE=true npm run build
```

### Solution 1: Verify Peer Dependencies Are Installed

```bash
# Check that these are NOT in dependencies of @clarity-ai/react
npm list --depth=1 @clarity-ai/react | grep -E "(react|react-dom|next)"

# Should show them as peer dependencies, not bundled
```

### Solution 2: Use Tree Shaking

Ensure you're importing only what you need:

```tsx
// Good: Named imports
import { ClarityChat, useClarityChat } from '@clarity-ai/react'

// Avoid: Default import of everything
import ClarityAI from '@clarity-ai/react'
```

### Solution 3: Enable Production Optimizations

```bash
# Build in production mode
NODE_ENV=production npm run build

# For Next.js
npm run build
```

**Webpack projects:**

```js
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true,
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
  },
}
```

### Solution 4: Verify Package Exports

Check that the package is using modern module formats:

```bash
# View package.json exports
npm view @clarity-ai/react exports

# Should show both CJS and ESM entries
```

### Verification Script

Create `scripts/check-bundle.js`:

```js
const fs = require('fs')
const path = require('path')

const buildDir = path.join(__dirname, '../.next') || path.join(__dirname, '../dist')
const files = fs.readdirSync(buildDir, { recursive: true })

const jsFiles = files.filter((f) => f.endsWith('.js'))
let totalSize = 0

jsFiles.forEach((file) => {
  const filePath = path.join(buildDir, file)
  const stats = fs.statSync(filePath)
  totalSize += stats.size
  console.log(`${file}: ${(stats.size / 1024).toFixed(2)} KB`)
})

console.log(`\nTotal bundle size: ${(totalSize / 1024).toFixed(2)} KB`)
console.log(`Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
```

Run it:

```bash
node scripts/check-bundle.js
```

---

## Still Having Issues?

### Debugging Checklist

Run through this checklist:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Verify peer dependencies
npm list react react-dom next

# 3. Check for conflicts
npm list --depth=0 2>&1 | grep -i "unmet\|conflict"

# 4. Verify package installation
npm list @clarity-ai/react

# 5. Clear all caches
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
npm cache clean --force

# 6. Rebuild
npm run build
```

### Get Help

If you're still experiencing issues:

1. **Check the version compatibility matrix** in README.md
2. **Review the CHANGELOG** for breaking changes
3. **Search existing issues**: [GitHub Issues](https://github.com/clarity-ai/react/issues)
4. **Create a minimal reproduction**:

```bash
npx create-next-app@latest my-test-app
cd my-test-app
npm install @clarity-ai/react
# Add minimal code that reproduces the issue
```

5. **Open a new issue** with:
   - Error message (full stack trace)
   - `package.json` dependencies
   - Node version: `node --version`
   - npm/pnpm/yarn version
   - Operating system
   - Minimal reproduction repository

### Quick Reference: Required Versions

| Package    | Minimum Version | Recommended Version |
| ---------- | --------------- | ------------------- |
| react      | 18.0.0          | 18.2.0              |
| react-dom  | 18.0.0          | 18.2.0              |
| next       | 13.0.0          | 14.0.0+             |
| typescript | 4.9.0           | 5.0.0+              |
| node       | 18.0.0          | 20.0.0+             |

### Installation Command Reference

```bash
# Complete installation (recommended)
npm install @clarity-ai/react react@^18.2.0 react-dom@^18.2.0

# With Next.js
npm install @clarity-ai/react next@^14.0.0 react@^18.2.0 react-dom@^18.2.0

# With TypeScript
npm install @clarity-ai/react
npm install --save-dev typescript @types/react @types/react-dom @types/node

# With optional features
npm install @clarity-ai/react shiki  # For code highlighting
```

---

**Last Updated**: 2026-01-26 **Package Version**: See package.json for current version
