# Quick Reference Guide
**Repository Structure - Post Restructuring**

This guide provides a quick reference for navigating the restructured repository.

---

## 📁 Directory Structure

### Root Level
```
clarity-chat/
├── apps/              # Applications
├── packages/          # Libraries and SDKs
├── examples/          # Example applications
├── archive/           # Archived files (historical)
├── tests/             # Test directories
├── scripts/           # Build/deploy scripts
└── [config files]     # Root configuration
```

### Essential Root Files
- `README.md` - Main documentation
- `CHANGELOG.md` - Consolidated changelog
- `CONTRIBUTING.md` - Contribution guidelines
- `CODE_OF_CONDUCT.md` - Code of conduct
- `LICENSE` - Main license
- `package.json` - Workspace configuration
- `pnpm-workspace.yaml` - PNPM workspace config

---

## 📚 Documentation

### Single Documentation Site
**Location**: `apps/docs/` (Next.js)

**Structure**:
```
apps/docs/app/
├── blog/                    # Blog posts
├── commercial/              # Commercial documentation
├── cookbook/                 # Cookbook recipes
├── examples/                 # Example documentation
├── enterprise-standalone/    # Enterprise docs
├── guides/                   # All guides
├── learn/                    # Learning content
├── reference/                # API reference
│   └── api-standalone/      # Standalone API docs
├── research/                 # Research documentation
├── tools/                    # Developer tools
└── playground/              # Interactive playground
```

**Access**:
- Development: `pnpm docs` or `pnpm run dev --workspace=@clarity-chat/docs`
- Build: `pnpm docs:build`
- Local: `http://localhost:3000` (or configured port)

---

## 🎨 Storybook

### Unified Storybook Instance
**Location**: `apps/storybook/`

**Structure**:
```
apps/storybook/
├── .storybook/              # Storybook configuration
│   └── main.ts              # Config (includes error-handling alias)
└── stories/                 # All stories
    ├── [component stories]
    └── error-handling/       # Error-handling stories (moved here)
```

**Access**:
- Development: `pnpm storybook` or `pnpm run dev --workspace=@clarity-chat/storybook`
- Build: `pnpm storybook:build`
- Local: `http://localhost:6006`

---

## 📦 Packages

### Core Packages
- `packages/react/` - Main React component library
- `packages/primitives/` - Primitive components
- `packages/types/` - TypeScript type definitions

### Feature Packages
- `packages/memory/` - Memory management
- `packages/error-handling/` - React error handling (Storybook removed)
- `packages/errors/` - Error utilities
- `packages/licensing/` - License management

### Developer Tools
- `packages/cli/` - CLI tool
- `packages/dev-tools/` - Developer tools
- `packages/codemods/` - Code transformations
- `packages/testing-utils/` - Testing utilities
- `packages/playground/` - Component playground (private)

---

## 🎯 Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Run all dev servers
pnpm dev

# Run specific workspace
pnpm run dev --workspace=@clarity-chat/docs
pnpm run dev --workspace=@clarity-chat/storybook
```

### Building
```bash
# Build all packages
pnpm build

# Build specific workspace
pnpm run build --workspace=@clarity-chat/react
pnpm docs:build
pnpm storybook:build
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm run test --workspace=@clarity-chat/react

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix
```

---

## 📍 Important Paths

### Documentation
- **Main Docs**: `apps/docs/app/`
- **Guides**: `apps/docs/app/guides/`
- **API Reference**: `apps/docs/app/reference/`
- **Examples**: `apps/docs/app/examples/`
- **Cookbook**: `apps/docs/app/cookbook/`
- **Blog**: `apps/docs/app/blog/`
- **Commercial**: `apps/docs/app/commercial/`

### Components
- **React Components**: `packages/react/src/components/`
- **Primitives**: `packages/primitives/src/`
- **Stories**: `apps/storybook/stories/`

### Examples
- **All Examples**: `examples/`
- **Example Docs**: `apps/docs/app/examples/`

---

## 🔄 Migration Notes

### What Changed
1. **Documentation**: `apps/docs-site` → `apps/docs`
2. **Package Name**: `@clarity-chat/docs-site` → `@clarity-chat/docs`
3. **Storybook**: Unified (error-handling stories moved to main Storybook)
4. **Content**: Blog, commercial docs, standalone docs integrated into docs-site

### Old Paths (Archived)
- `/blog` → Now in `apps/docs/app/blog/`
- `/commercial-docs` → Now in `apps/docs/app/commercial/`
- `/docs` → Content integrated into `apps/docs/app/`
- `apps/docs` (VitePress) → Archived in `archive/old-docs/docs-vitepress-old/`

---

## 📊 Statistics

- **Apps**: 3 (docs, storybook, marketing-site)
- **Packages**: 12
- **Examples**: 37
- **Storybook Stories**: 129
- **Docs Files**: 409
- **Archived Files**: 165

---

## 🆘 Troubleshooting

### Docs not building?
- Check Next.js configuration in `apps/docs/`
- Verify all dependencies installed: `pnpm install`
- Check for TypeScript errors: `pnpm typecheck`

### Storybook not loading?
- Verify stories are in `apps/storybook/stories/`
- Check `.storybook/main.ts` configuration
- Ensure error-handling alias is configured

### Package not found?
- Verify workspace configuration in `pnpm-workspace.yaml`
- Check package.json name matches workspace reference
- Run `pnpm install` to update workspace links

---

## 📖 Additional Resources

- **Full Restructuring Report**: `reports/COMPLETE_RESTRUCTURING_REPORT.md`
- **Archive Documentation**: `archive/README.md`
- **Contributing Guide**: `CONTRIBUTING.md`
- **Main README**: `README.md`

---

**Last Updated**: Post-restructuring
**Version**: 1.0
