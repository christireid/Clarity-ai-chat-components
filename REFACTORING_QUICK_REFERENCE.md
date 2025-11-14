# Repository Refactoring - Quick Reference

**Quick guide to the refactored repository structure**

---

## 📁 Directory Structure

```
clarity-chat/
├── apps/
│   ├── docs/              # Documentation site (Next.js)
│   ├── storybook/         # Component Storybook
│   └── marketing-site/    # Marketing/landing page
│
├── packages/              # Published packages
│   ├── react/             # Main React library
│   ├── primitives/        # Primitive components
│   ├── types/             # TypeScript types
│   ├── errors/            # Error utilities
│   ├── error-handling/    # Advanced error handling
│   ├── memory/            # Memory management
│   ├── licensing/         # Licensing utilities
│   ├── testing-utils/     # Testing utilities
│   ├── cli/               # CLI tool
│   ├── dev-tools/         # DevTools integration
│   ├── codemods/          # Code transformation
│   └── playground/        # Interactive playground
│
├── examples/              # Example applications
│   └── memory-examples/   # Memory examples (consolidated)
│
├── tools/                 # Development tools
│   ├── mcp-server/        # MCP server
│   ├── vscode-extension/  # VSCode extension
│   └── scripts/           # Build/deployment scripts
│
├── tests/                 # Test suites
│   ├── integration/       # Integration tests
│   ├── e2e/               # E2E tests
│   └── visual/            # Visual regression tests
│
├── archive/               # Archived files
│   ├── completion-reports/
│   ├── status-reports/
│   ├── planning/
│   ├── summaries/
│   ├── root-guides/
│   └── packages/
│
└── reports/               # Refactoring reports
```

---

## 📚 Documentation Structure

**Location:** `apps/docs/app/`

```
docs/app/
├── api/                    # API documentation
├── blog/                   # Blog posts
├── commercial/             # Commercial docs
│   └── enterprise/        # Enterprise features
├── cookbook/               # Cookbook recipes
├── examples/               # Example documentation
├── guides/                 # User guides (38+ directories)
│   └── integrations/      # Integration guides
├── learn/                  # Learning resources
├── playground/             # Interactive playground
├── reference/              # Component/hook reference
├── research/               # Research documentation
└── tools/                  # Developer tools
```

---

## 🚀 Common Commands

### Documentation
```bash
pnpm docs          # Start docs dev server (port 3000)
pnpm docs:build    # Build documentation site
```

### Storybook
```bash
pnpm storybook          # Start Storybook (port 6006)
pnpm storybook:build    # Build Storybook for deployment
```

### Development
```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm lint:fix     # Fix linting issues
pnpm test         # Run all tests
pnpm test:watch   # Run tests in watch mode
pnpm typecheck    # Type check all packages
```

### Package Management
```bash
pnpm install      # Install all dependencies
pnpm clean        # Clean all build artifacts
```

---

## 📦 Package Workspaces

The repository uses **pnpm workspaces**:

- `packages/*` - All published packages
- `apps/*` - All applications
- `examples/*` - Example applications

**Workspace config:** `pnpm-workspace.yaml`

---

## 🔍 Finding Things

### Where is...?

| What | Where |
|------|-------|
| **Documentation** | `apps/docs/app/` |
| **Component Stories** | `apps/storybook/stories/` |
| **Package Source** | `packages/[package-name]/src/` |
| **Examples** | `examples/[example-name]/` |
| **Tools** | `tools/[tool-name]/` |
| **Tests** | `tests/[test-type]/` |
| **Archived Files** | `archive/[category]/` |
| **Reports** | `reports/` |

---

## 📝 File Locations

### Configuration Files
- Root `package.json` - Workspace configuration
- `pnpm-workspace.yaml` - Workspace definition
- `tsconfig.json` - Root TypeScript config
- `eslint.config.js` - ESLint configuration
- `playwright.config.ts` - E2E test config

### Essential Root Files
- `README.md` - Main README
- `CHANGELOG.md` - Main changelog
- `CODE_OF_CONDUCT.md` - Code of conduct
- `CONTRIBUTING.md` - Contributing guide
- `LICENSE*` - License files
- `QUICK_START_GUIDE.md` - Quick start

---

## 🗂️ Archive Structure

**Location:** `/archive/`

- `completion-reports/` - Old completion reports (~25 files)
- `status-reports/` - Old status reports (~20 files)
- `planning/` - Planning documents (~10 files)
- `summaries/` - Summary files (~10 files)
- `root-guides/` - Root-level guide files (~20 files)
- `packages/cli/` - CLI package archives (~9 files)
- `packages/dev-tools/` - Dev-tools package archives (~5 files)

**Total:** 97 files archived

---

## 📊 Statistics

- **Root Files:** 8 essential markdown files (92% reduction)
- **Documentation:** 70+ markdown files in single location
- **Packages:** 12+ packages organized
- **Examples:** 30+ example applications
- **Archived:** 97 files organized
- **Reports:** 10 comprehensive reports

---

## ✅ Refactoring Checklist

- [x] Phase 1: Catalog Everything
- [x] Phase 2: Detect Duplication
- [x] Phase 3: Define Target Architecture
- [x] Phase 4: Merge, Condense, Clean
- [x] Phase 5: Verify Integrity
- [x] Documentation Consolidation
- [x] Storybook Consolidation
- [x] Tools Organization
- [x] Examples Organization
- [x] Root Directory Cleanup
- [x] Archive Creation
- [x] Old Directories Deleted
- [x] Documentation Renamed

---

## 🔗 Quick Links

- **Main README:** `/README.md`
- **Contributing Guide:** `/CONTRIBUTING.md`
- **Changelog:** `/CHANGELOG.md`
- **Refactoring Reports:** `/reports/`
- **Documentation:** `apps/docs/app/`
- **Storybook:** `apps/storybook/`

---

## 💡 Tips

1. **Finding Documentation:** Start at `apps/docs/app/`
2. **Component Examples:** Check `apps/storybook/stories/`
3. **Package Info:** See `packages/[package-name]/README.md`
4. **Example Apps:** Browse `examples/` directory
5. **Archived Content:** Check `archive/` if looking for old files

---

## 🆘 Need Help?

- Check `/reports/` for detailed refactoring information
- See `REFACTORING_SUMMARY.md` for overview
- Review `reports/COMPLETE.md` for completion status
- Check package READMEs for package-specific info

---

**Last Updated:** $(date)  
**Refactoring Status:** ✅ Complete
