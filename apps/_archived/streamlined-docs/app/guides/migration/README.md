# Migration Guides

Complete migration resources for Clarity Chat version upgrades.

## Available Guides

### [v1.x → v2.0 Migration Guide](./v1-to-v2.mdx)

**Comprehensive migration guide** with:
- Complete breaking changes list with examples
- Automated codemod script for code transformation
- Step-by-step migration process
- Bundle size optimization (60-92% reduction)
- Rollback plan if issues arise
- Deprecation warnings and replacements
- Peer dependency management

**Who should read:** Everyone upgrading from v1.x to v2.0

**Time required:** 10-30 minutes for most projects

### [Migration Checklist](./MIGRATION_CHECKLIST.md)

**Printable checklist** for tracking migration progress:
- Pre-migration planning tasks
- Core migration steps
- Testing requirements
- Deployment checklist
- Rollback procedures
- Sign-off section

**Who should use:** Project managers, tech leads, developers managing complex migrations

**Format:** Markdown with checkboxes for easy tracking

### [Testing Your Migration](./testing.mdx)

**Comprehensive testing guide** covering:
- Automated test suite (unit, integration, E2E)
- Manual QA procedures
- Performance testing and bundle analysis
- Accessibility validation
- Cross-browser compatibility
- Regression testing

**Who should read:** QA engineers, developers responsible for testing

**Time required:** 2-4 hours for thorough testing

---

## Quick Start

### 1. Review the Migration Guide

Start here to understand what's changing and why:

```bash
📖 Read: ./v1-to-v2.mdx
```

### 2. Run Automated Migration

Use the codemod script to automate most changes:

```bash
# Download migration script
curl -O https://raw.githubusercontent.com/christireid/Clarity-ai-chat-components/main/scripts/migrate-v1-to-v2.js

# Dry run (see changes without modifying files)
node migrate-v1-to-v2.js src/ --dry-run

# Run migration with backups
node migrate-v1-to-v2.js src/ --backup --verbose
```

### 3. Install Peer Dependencies

Required for v2.0:

```bash
npm install @clarity-chat/react@2.0.0 \
  framer-motion@^12.23.25 \
  lucide-react@^0.500.0 \
  zod@^3.24.0
```

### 4. Test Thoroughly

Follow the testing guide:

```bash
# TypeScript check
npm run typecheck

# Run tests
npm test

# Build and verify
npm run build
```

### 5. Track Progress

Use the checklist to ensure nothing is missed:

```bash
📋 Open: ./MIGRATION_CHECKLIST.md
```

---

## Files Included

| File | Purpose | Format |
|------|---------|--------|
| `v1-to-v2.mdx` | Main migration guide | MDX (rendered docs) |
| `MIGRATION_CHECKLIST.md` | Tracking checklist | Markdown (printable) |
| `testing.mdx` | Testing procedures | MDX (rendered docs) |
| `README.md` | This file | Markdown |

---

## Migration Overview

### What Changed in v2.0

| Category | Impact | Description |
|----------|--------|-------------|
| **Peer Dependencies** | 🔴 High | Major dependencies externalized |
| **Hook Names** | 🟡 Medium | `useChat` → `useClarityChat` |
| **Component Props** | 🟡 Medium | Flattened nested props |
| **Import Paths** | 🟢 Low | Updated paths for better tree-shaking |
| **Deprecated APIs** | 🟢 Low | Removed with clear replacements |

### Key Benefits

✅ **60-92% smaller bundles** depending on feature usage
✅ **Better tree-shaking** and code splitting
✅ **Improved type safety** with stricter TypeScript
✅ **Enhanced DX** with simpler APIs
✅ **Zero runtime changes** - only build-time improvements

### Migration Time

| Project Size | Estimated Time |
|--------------|----------------|
| Small (< 5 files using Clarity Chat) | 10-15 minutes |
| Medium (5-20 files) | 20-30 minutes |
| Large (20+ files) | 30-60 minutes |
| Enterprise (complex setup) | 1-2 hours |

_Times include running codemod, installing dependencies, and basic testing_

---

## Common Migration Paths

### Path 1: Minimal Chat App

**Before (v1.x):**
```json
{
  "dependencies": {
    "@clarity-chat/react": "^1.1.0"
  }
}
```

**After (v2.0):**
```json
{
  "dependencies": {
    "@clarity-chat/react": "^2.0.0",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.500.0",
    "zod": "^3.24.0"
  }
}
```

**Bundle size reduction:** ~92% (6.2 MB → 0.5 MB)

### Path 2: With Token Optimization

**Additional dependency:**
```json
{
  "dependencies": {
    "flowtoken": "^1.0.0"
  }
}
```

**Bundle size reduction:** ~90% (6.3 MB → 0.6 MB)

### Path 3: With RAG Features

**Additional dependencies:**
```json
{
  "dependencies": {
    "pdfjs-dist": "^4.0.0",
    "mammoth": "^1.0.0",
    "jszip": "^3.10.0",
    "cohere-ai": "^7.0.0"
  }
}
```

**Bundle size reduction:** ~69% (6.8 MB → 2.1 MB)

### Path 4: Full Featured

**All dependencies:**
```json
{
  "dependencies": {
    "@clarity-chat/react": "^2.0.0",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.500.0",
    "zod": "^3.24.0",
    "flowtoken": "^1.0.0",
    "mermaid": "^11.0.0",
    "pdfjs-dist": "^4.0.0",
    "mammoth": "^1.0.0",
    "cohere-ai": "^7.0.0",
    "shiki": "^3.0.0",
    "jszip": "^3.10.0",
    "prismjs": "^1.29.0",
    "react-markdown": "^10.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0"
  }
}
```

**Bundle size reduction:** ~49% (9.6 MB → 4.9 MB)

---

## Automated Tools

### Codemod Script

**Location:** `/scripts/migrate-v1-to-v2.js`

**Features:**
- Renames `useChat` to `useClarityChat`
- Updates import paths
- Replaces deprecated components
- Checks peer dependencies
- Generates detailed report
- Creates backups (optional)

**Usage:**
```bash
# Dry run
node migrate-v1-to-v2.js . --dry-run

# With backups
node migrate-v1-to-v2.js . --backup

# Verbose output
node migrate-v1-to-v2.js . --verbose
```

### Verification Script

Create automated verification:

```typescript
// scripts/verify-migration.ts
import { execSync } from 'child_process'

const checks = [
  { name: 'No useChat imports', cmd: 'grep -r "useChat" src/' },
  { name: 'TypeScript compiles', cmd: 'npm run typecheck' },
  { name: 'Tests pass', cmd: 'npm test' },
  { name: 'Build succeeds', cmd: 'npm run build' },
]

checks.forEach(({ name, cmd }) => {
  try {
    execSync(cmd, { stdio: 'pipe' })
    console.log(`✅ ${name}`)
  } catch {
    console.log(`❌ ${name}`)
  }
})
```

---

## Troubleshooting

### Common Issues

**Issue: Missing peer dependency**
```
Solution: npm install <missing-package>
Guide: v1-to-v2.mdx § Troubleshooting
```

**Issue: TypeScript errors**
```
Solution: Restart TS server, clear caches
Guide: v1-to-v2.mdx § Common Issues
```

**Issue: Tests failing**
```
Solution: Update test setup for peer deps
Guide: testing.mdx § Automated Tests
```

**Issue: Bundle size not reduced**
```
Solution: Verify externalization config
Guide: v1-to-v2.mdx § Bundle Size Optimization
```

### Getting Help

- **GitHub Issues:** [Report migration issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **Discord:** [Join community](https://discord.gg/clarity-chat)
- **Documentation:** [Full docs](https://clarity-chat.dev)

---

## Related Documentation

### Before Migration
- [Current Architecture](/docs/architecture)
- [Feature Inventory](/docs/features)
- [v1.x Documentation](/docs/v1)

### During Migration
- [Breaking Changes](/guides/migration/v1-to-v2#breaking-changes)
- [Codemod Usage](/guides/migration/v1-to-v2#automated-migration)
- [Manual Updates](/guides/migration/v1-to-v2#step-by-step-migration)

### After Migration
- [Performance Optimization](/guides/performance)
- [Bundle Analysis](/guides/performance/bundle-optimization)
- [Production Deployment](/guides/deployment/production)

---

---

## Support

Need help with your migration?

1. **Read the full guide:** Start with [v1-to-v2.mdx](./v1-to-v2.mdx)
2. **Use the checklist:** Track progress with [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)
3. **Test thoroughly:** Follow [testing.mdx](./testing.mdx)
4. **Get help:** Open a [GitHub issue](https://github.com/christireid/Clarity-ai-chat-components/issues) with the `migration` label

---

**Last Updated:** 2026-01-28
**Clarity Chat Version:** 2.0.0
**Maintained By:** Clarity Chat Team

---

## Quick Links

- [Main Migration Guide](./v1-to-v2.mdx)
- [Printable Checklist](./MIGRATION_CHECKLIST.md)
- [Testing Guide](./testing.mdx)
- [Codemod Script](/scripts/migrate-v1-to-v2.js)
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Documentation](https://clarity-chat.dev)
