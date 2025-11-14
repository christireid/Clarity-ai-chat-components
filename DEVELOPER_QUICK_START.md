# Developer Quick Start Guide
**Getting Started with the Restructured Repository**

This guide helps developers quickly understand the new repository structure and start contributing.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PNPM 8+ (required - NPM removed)
- Git

### Installation
```bash
# Install dependencies
pnpm install

# Verify installation
pnpm --version
```

---

## 📁 Repository Structure

```
clarity-chat/
├── apps/
│   ├── docs/              # 📚 Single documentation site (Next.js)
│   ├── storybook/         # 🎨 Unified Storybook
│   └── marketing-site/    # 🌐 Marketing site
├── packages/              # 📦 All libraries (12 packages)
├── examples/              # 💡 Example applications (37 examples)
├── archive/               # 📦 Historical files (read-only)
└── reports/              # 📊 Restructuring reports
```

---

## 🛠️ Common Commands

### Development
```bash
# Start docs site
pnpm docs
# → http://localhost:3000

# Start Storybook
pnpm storybook
# → http://localhost:6006

# Start all dev servers
pnpm dev
```

### Building
```bash
# Build all packages
pnpm build

# Build docs site
pnpm docs:build

# Build Storybook
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

## 📚 Documentation Locations

### Main Documentation
- **Site**: `apps/docs/` (Next.js)
- **Routes**: `/learn`, `/reference`, `/examples`, `/blog`, `/guides`

### Component Documentation
- **Storybook**: `apps/storybook/`
- **Stories**: `apps/storybook/stories/`

### Guides & References
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Restructuring Info**: `README_RESTRUCTURING.md`
- **Reports**: `reports/INDEX.md`

---

## 🎯 Key Routes

### Documentation Routes
- `/learn` - Learning content
- `/reference` - API reference
- `/examples` - Code examples
- `/blog` - Blog posts
- `/commercial` - Commercial docs
- `/research` - Research docs
- `/guides` - Guides
- `/cookbook` - Recipes

### New Routes (Post-Restructuring)
- `/blog` - Blog listing
- `/commercial` - Commercial documentation
- `/research` - Research documentation
- `/enterprise-standalone` - Enterprise features
- `/reference/api-standalone` - Standalone API docs

---

## 📦 Package Structure

### Core Packages
- `packages/react/` - Main React component library
- `packages/primitives/` - Primitive components
- `packages/types/` - TypeScript types

### Feature Packages
- `packages/memory/` - Memory management
- `packages/error-handling/` - Error handling
- `packages/cli/` - CLI tool

### Workspace References
All packages use workspace protocol:
```json
{
  "dependencies": {
    "@clarity-chat/react": "workspace:*"
  }
}
```

---

## 🔧 Development Workflow

### 1. Making Changes
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ...

# Run tests
pnpm test

# Build to verify
pnpm build
```

### 2. Adding Documentation
```bash
# Add to docs site
apps/docs/app/learn/your-topic/page.tsx

# Add Storybook story
apps/storybook/stories/your-component.stories.tsx
```

### 3. Adding Examples
```bash
# Create new example
examples/your-example/
  ├── package.json
  ├── src/
  └── README.md
```

---

## 📝 Code Style

### TypeScript
- Strict mode enabled
- Use workspace types: `@clarity-chat/types`

### Styling
- Tailwind CSS
- Design tokens in `packages/react/src/theme/`

### Components
- React 19
- Functional components
- TypeScript interfaces

---

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Workspace Issues
```bash
# Verify workspace config
cat pnpm-workspace.yaml

# Reinstall workspace links
pnpm install --force
```

### Docs Site Issues
```bash
# Clear Next.js cache
rm -rf apps/docs/.next
pnpm docs
```

---

## 📖 Key Documentation

### For Understanding Structure
1. `QUICK_REFERENCE.md` - Quick navigation
2. `README_RESTRUCTURING.md` - Restructuring details
3. `reports/INDEX.md` - All reports index

### For Development
1. `CONTRIBUTING.md` - Contribution guidelines
2. `apps/docs/README.md` - Docs site guide
3. `apps/storybook/README.md` - Storybook guide

### For Architecture
1. `reports/target-architecture.md` - Target structure
2. `reports/duplication-map.md` - What was consolidated
3. `reports/COMPLETE_RESTRUCTURING_REPORT.md` - Full report

---

## ✅ Pre-Commit Checklist

Before committing:
- [ ] Code passes linting (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation updated if needed

---

## 🎯 Common Tasks

### Adding a New Component
1. Create component in `packages/react/src/components/`
2. Export from `packages/react/src/index.ts`
3. Add Storybook story in `apps/storybook/stories/`
4. Add docs page in `apps/docs/app/reference/components/`

### Adding Documentation
1. Create page in `apps/docs/app/`
2. Add to navigation if needed (`apps/docs/components/Navigation/`)
3. Update sitemap if needed

### Adding an Example
1. Create directory in `examples/`
2. Add `package.json` with workspace dependencies
3. Create README with description
4. Add to examples catalog if needed

---

## 🔗 Useful Links

- **Main README**: `README.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Restructuring Summary**: `README_RESTRUCTURING.md`
- **Reports Index**: `reports/INDEX.md`
- **Contributing Guide**: `CONTRIBUTING.md`

---

## 💡 Tips

1. **Use PNPM** - NPM has been removed, use PNPM only
2. **Workspace Protocol** - Use `workspace:*` for internal dependencies
3. **Single Docs Site** - All docs are in `apps/docs/`
4. **Unified Storybook** - All stories in `apps/storybook/`
5. **Check Archive** - Old content is in `archive/` if needed

---

## 🆘 Getting Help

1. Check `QUICK_REFERENCE.md` for structure
2. Check `reports/INDEX.md` for detailed reports
3. Check `CONTRIBUTING.md` for contribution guidelines
4. Check existing examples in `examples/`

---

**Last Updated**: Post-restructuring  
**Status**: ✅ Ready for development
