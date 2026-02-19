# Contributing Quick Reference

Quick reference for common development tasks in Clarity Chat.

---

## Setup

```bash
# First time setup
./scripts/setup-dev-environment.sh

# Manual setup
pnpm install
pnpm build:packages
pnpm check
```

---

## Development Workflow

### Starting Development

```bash
# Start all in dev mode
pnpm dev

# Start specific packages
pnpm dev:react        # React package only
pnpm dev:docs         # Documentation site
pnpm storybook        # Component explorer
```

### Making Changes

```bash
# 1. Create branch
git checkout -b feature/your-feature

# 2. Make changes + add tests

# 3. Run checks
pnpm check            # Typecheck, lint, test

# 4. Commit
git add .
git commit -m "feat: your feature description"

# 5. Push
git push origin feature/your-feature
```

---

## Testing

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e
pnpm test:e2e:ui      # With UI

# Specific file
pnpm test ChatMessage.test.tsx

# Update snapshots
pnpm test -u
```

---

## Code Quality

```bash
# Lint
pnpm lint
pnpm lint:fix         # Auto-fix issues

# Type check
pnpm typecheck

# Format
pnpm format
pnpm format:check

# All checks
pnpm check            # Lint + typecheck + test
pnpm check:all        # Also builds
```

---

## Building

```bash
# Build all
pnpm build

# Build packages only
pnpm build:packages

# Sequential build (lower memory)
pnpm build:sequential

# With more memory
NODE_OPTIONS='--max-old-space-size=4096' pnpm build
```

---

## Commit Message Format

```bash
# Format: <type>(<scope>): <description>

feat: add voice input component
fix: resolve memory leak in chat hook
docs: update contributing guide
test: add tests for message renderer
refactor: simplify token counter
perf: optimize message list rendering
style: format code
chore: update dependencies
ci: fix build workflow

# With scope
feat(chat): add message reactions
fix(memory): prevent overflow

# Breaking change
feat!: redesign chat API

BREAKING CHANGE: Hook now returns object instead of array
```

---

## PR Process

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Create branch
git checkout -b feature/your-feature

# 3. Make changes
# ... code, test, commit ...

# 4. Push
git push origin feature/your-feature

# 5. Create PR on GitHub
# Fill out template completely

# 6. Address review feedback
# Make changes, commit, push

# 7. After approval, maintainer will merge
```

---

## Release Process

```bash
# Add changeset (for contributors)
pnpm changeset
# Select packages, bump type, write summary

# Version bump (maintainers only)
pnpm version-packages

# Publish (maintainers only)
pnpm release
```

---

## Common Commands

### Install Peer Dependencies

```bash
cd packages/react
node scripts/install-peers-ci.js standard
```

### Link Package Locally

```bash
# In clarity-chat repo
cd packages/react
pnpm build
pnpm link

# In your project
pnpm link @clarity-chat/react
```

### Clean Build

```bash
# Clean everything
pnpm clean

# Reinstall
pnpm install

# Rebuild
pnpm build
```

### Analyze Bundle

```bash
pnpm analyze
pnpm bundle-analysis
```

### Security Audit

```bash
pnpm audit
pnpm security:audit
```

---

## Troubleshooting

### Build Fails (Out of Memory)

```bash
NODE_OPTIONS='--max-old-space-size=4096' pnpm build:sequential
```

### Tests Fail Locally

```bash
# Clear cache
rm -rf node_modules/.cache

# Rebuild packages
pnpm build:packages

# Run tests
pnpm test
```

### Lint Errors

```bash
# Auto-fix
pnpm lint:fix

# Check specific file
pnpm lint src/components/ChatMessage.tsx
```

### Type Errors

```bash
# Full type check
pnpm typecheck

# Check specific package
cd packages/react
pnpm typecheck
```

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
pnpm dev -- --port 3001
```

### Merge Conflicts

```bash
# Update branch
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# Resolve conflicts
# Then continue
git rebase --continue
```

---

## File Organization

### Component Files

```
packages/react/src/components/
├── message/
│   ├── ChatMessage.tsx          # Component
│   ├── types.ts                 # Types
│   ├── utils.ts                 # Utilities
│   └── __tests__/
│       ├── ChatMessage.test.tsx # Tests
│       └── ChatMessage.a11y.test.tsx
```

### Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utilities: `camelCase.ts`
- Types: `PascalCase` or `camelCase`
- Constants: `UPPER_SNAKE_CASE`

---

## Git Workflow

### Feature Branch

```bash
git checkout -b feature/voice-input
# Make changes
git add .
git commit -m "feat: add voice input"
git push origin feature/voice-input
```

### Bug Fix

```bash
git checkout -b fix/memory-leak
# Make changes
git add .
git commit -m "fix: resolve memory leak in chat hook"
git push origin fix/memory-leak
```

### Update Branch

```bash
# Pull latest main
git checkout main
git pull origin main

# Update feature branch
git checkout feature/your-feature
git rebase main
```

---

## Documentation

### Where to Add Docs

- **User docs**: `apps/streamlined-docs/app/`
- **API docs**: Package `README.md` files
- **Architecture**: `docs/architecture.md`
- **Guides**: `docs/guides/`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`

### Don't Commit

- Status reports (`*_COMPLETE.md`)
- Phase tracking (`PHASE_*.md`)
- Temporary notes (`TODO.md`, `NOTES.md`)
- Implementation notes (`CLEANUP_*.md`)

See `.github/DOCUMENTATION_POLICY.md` for details.

---

## Testing Patterns

### Hook Test

```tsx
import { renderHook, act } from '@testing-library/react'

test('hook works', async () => {
  const { result } = renderHook(() => useMyHook())

  await act(async () => {
    await result.current.doSomething()
  })

  expect(result.current.value).toBe('expected')
})
```

### Component Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react'

test('component works', () => {
  render(<MyComponent />)

  expect(screen.getByText('Hello')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button'))

  expect(screen.getByText('Clicked')).toBeInTheDocument()
})
```

### Accessibility Test

```tsx
import { axe } from 'jest-axe'

test('has no a11y violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Useful Links

- **Contributing Guide**: `apps/streamlined-docs/app/contributing/index.mdx`
- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **Architecture**: `docs/architecture.md`
- **GitHub Issues**: https://github.com/christireid/Clarity-ai-chat-components/issues
- **Discussions**: https://github.com/christireid/Clarity-ai-chat-components/discussions
- **Discussions**: https://github.com/christireid/Clarity-ai-chat-components/discussions

---

## Getting Help

- **Documentation site**: Check docs first
- **GitHub Issues**: Search existing issues
- **Discussions**: Ask questions
- **Email**: hello@codeclarity.ai

---

**Pro Tips**

1. Run `pnpm check` before committing
2. Write tests as you code, not after
3. Keep PRs focused and small
4. Ask for help early if stuck
5. Review your own diff before pushing
6. Add meaningful commit messages
7. Update docs with code changes
8. Test accessibility (keyboard, screen reader)
9. Check performance impact
10. Be kind in code reviews

---

For detailed information, see the full contributing guide:
`apps/streamlined-docs/app/contributing/index.mdx`
