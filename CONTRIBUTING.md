# Contributing to Clarity Chat

**Welcome! We're excited you're here.**

Whether you're fixing a typo, adding a feature, or sharing an idea, every contribution makes Clarity Chat better. This guide will help you get started quickly.

**New to open source?** No problem! We've marked beginner-friendly issues with `good first issue`. Start there, and don't hesitate to ask questions.

---

## Quick Links

| I want to... | Go to... |
|-------------|----------|
| Report a bug | [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues/new?template=bug_report.md) |
| Suggest a feature | [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions/new?category=ideas) |
| Ask a question | [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions) |
| Fix a bug | [See Development Setup](#development-setup) |
| Add a feature | [See Pull Request Process](#pull-request-process) |

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Documentation Guidelines](#documentation-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

---

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow
our [Code of Conduct](./CODE_OF_CONDUCT.md).

**In short:**

- Be respectful and inclusive
- Welcome newcomers
- Be patient and helpful
- Focus on constructive feedback
- Report unacceptable behavior

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 20.0.0
- **pnpm** >= 10.0.0
- **Git** >= 2.0.0
- **A GitHub account**

### Types of Contributions

We welcome:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📝 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ♿ **Accessibility improvements**
- 🧪 **Tests**
- 🌍 **Translations**
- 💡 **Examples**

---

## Development Setup

### Prerequisites

Before you begin, make sure you have:

| Tool | Version | Check with |
|------|---------|------------|
| Node.js | >= 20.0.0 | `node --version` |
| pnpm | >= 10.0.0 | `pnpm --version` |
| Git | >= 2.0.0 | `git --version` |

**Don't have pnpm?** Install it with `npm install -g pnpm`

### Quick Setup (5 minutes)

```bash
# 1. Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# 2. Install all dependencies
pnpm install

# 3. Build all packages
pnpm build

# 4. Start development (pick one)
pnpm storybook     # Component development (recommended for UI work)
pnpm docs          # Documentation site
pnpm dev           # All packages in watch mode
```

### Verify Your Setup

```bash
# Run these commands - all should pass
pnpm typecheck     # TypeScript validation
pnpm lint          # Code style checks
pnpm test          # Unit tests
```

**Troubleshooting:**

| Problem | Solution |
|---------|----------|
| `pnpm: command not found` | Run `npm install -g pnpm` |
| Build fails | Try `pnpm clean && pnpm install && pnpm build` |
| Tests fail | Ensure Node.js >= 20: `node --version` |
| Port in use | Kill process or use `pnpm storybook --port 6007` |

---

## Project Structure

```
clarity-chat/
├── .github/              # GitHub Actions workflows
├── .husky/               # Git hooks
├── packages/
│   ├── react/            # Main React library
│   ├── types/            # TypeScript definitions
│   ├── primitives/       # Base UI components
│   ├── error-handling/   # Error recovery system
│   ├── dev-tools/        # Developer utilities
│   └── cli/              # CLI tools
├── apps/
│   ├── storybook/        # Component documentation
│   ├── docs-site/        # Documentation site
│   └── examples/         # Example applications
├── docs/                 # Markdown documentation
└── archive/              # Archived files
```

### Key Files

- `package.json` - Root package configuration
- `turbo.json` - Monorepo build configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - Linting rules (ESLint flat config)
- `.prettierrc` - Code formatting rules

---

## Development Workflow

### 1. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/fixes
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Test Your Changes

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Tests
pnpm test

# Build
pnpm build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Conventions](#commit-conventions) for commit message format.

### 5. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript

- **Always use TypeScript**
- **Strict mode enabled** - No `any` types
- **Explicit return types** for functions
- **Interface over type** for object shapes
- **Descriptive names** for types

**Good:**

```typescript
interface MessageProps {
  message: Message
  onCopy?: () => void
}

function MessageComponent({ message, onCopy }: MessageProps): JSX.Element {
  // ...
}
```

**Bad:**

```typescript
function MessageComponent(props: any) {
  // ...
}
```

### React

- **Functional components only**
- **Hooks for state management**
- **Props destructuring**
- **Explicit prop types**
- **Memoization when appropriate**

**Good:**

```typescript
import { memo } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export const Button = memo(function Button({
  label,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
})
```

### CSS/Styling

- **Use Tailwind CSS utilities** first
- **CSS modules** for component-specific styles
- **Consistent naming** (BEM-like)
- **Responsive design** (mobile-first)
- **Accessibility** (color contrast, focus states)

**Example:**

```tsx
<div className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2">
  Click me
</div>
```

### File Organization

```
component-name/
├── component-name.tsx       # Component implementation
├── component-name.test.tsx  # Tests
├── component-name.stories.tsx # Storybook story
├── index.ts                 # Exports
└── README.md                # Component documentation
```

---

## Documentation Guidelines

### Documentation Policy

**IMPORTANT**: Clarity Chat maintains a clean, professional documentation structure. Please review our [Documentation Policy](./.github/DOCUMENTATION_POLICY.md) before adding or modifying documentation.

### What to Commit

**✅ DO commit**:
- User-facing documentation (guides, tutorials, API references)
- Package READMEs and getting started guides
- Architecture and design documents (when stable)
- Migration guides for breaking changes
- Updated CHANGELOG entries via changesets

**❌ DON'T commit**:
- Status reports or progress summaries (`*_COMPLETE.md`, `*_SUMMARY.md`)
- Phase tracking documents (`PHASE_1_*.md`, `PHASE_2_*.md`)
- Implementation notes after completion (archive instead)
- Temporary notes or scratch files
- Duplicate guides with version numbers

### Documentation Checklist

Before committing documentation:

- [ ] Is this essential for users or contributors?
- [ ] Is there already a file that serves this purpose?
- [ ] Will this file be needed 3+ months from now?
- [ ] Does the filename follow essential documentation patterns?
- [ ] Have I checked for duplicate content?

### Where Documentation Goes

**User-Facing Documentation**:
```
apps/docs/content/          # Documentation site content
  ├── guides/               # User guides
  ├── api/                  # API references
  └── examples/             # Code examples
```

**Package Documentation**:
```
packages/*/
  ├── README.md             # Package overview and quick start
  ├── CHANGELOG.md          # Version history (via changesets)
  └── API.md                # Detailed API documentation (optional)
```

**Historical Documentation**:
```
.archive/
  ├── implementation-notes/ # Technical implementation details
  ├── status-reports/       # Project status and completion reports
  └── design-decisions/     # Architectural decisions
```

### Archiving Completed Work

When a project phase or task is complete:

1. **Move to `.archive/`**:
   ```bash
   # Move to appropriate category
   mv IMPLEMENTATION_COMPLETE.md .archive/implementation-notes/
   mv PHASE_3_SUMMARY.md .archive/status-reports/
   ```

2. **Update archive README** (if needed):
   ```bash
   # Add entry to .archive/README.md if adding new category
   ```

3. **Don't commit artifacts**:
   ```bash
   # These should NEVER be in the main repository:
   # ❌ CLEANUP_COMPLETE.md
   # ❌ FINAL_STATUS.md
   # ❌ PROJECT_SUMMARY.md
   ```

### Common Mistakes to Avoid

**❌ Creating duplicate guides**:
```bash
# Bad: Multiple versions
QUICK_START.md
QUICK_START_V2.md
QUICK_START_FINAL.md

# Good: Single canonical version
README.md  # With quick start section
```

**❌ Committing status files**:
```bash
# Bad: Status files in repository
git add IMPLEMENTATION_COMPLETE.md
git add CLEANUP_SUMMARY.md

# Good: Use git commit messages
git commit -m "feat: implement user authentication"
```

**❌ Keeping temporary notes**:
```bash
# Bad: Temporary files committed
TODO.md
NOTES.md
SCRATCH.md

# Good: Use local files or GitHub Issues
# Keep notes locally, track work in issues
```

### Documentation Updates

When updating code, also update:

1. **README** - If public API or usage changes
2. **CHANGELOG** - Create a changeset for package changes
3. **API docs** - If function signatures change
4. **Examples** - If usage patterns change
5. **Migration guide** - If breaking changes introduced

### Monthly Documentation Audit

We conduct monthly audits (first Monday) to:
- Remove development artifacts
- Archive completed work
- Check for duplicate content
- Update outdated guides

**You can help** by following the documentation policy and archiving your completed work!

---

## Testing Guidelines

### Unit Tests

- **Test all public APIs**
- **Test edge cases**
- **Mock external dependencies**
- **Use descriptive test names**

**Example:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button label="Click" onClick={onClick} />)

    fireEvent.click(screen.getByText('Click'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={() => {}} disabled />)
    expect(screen.getByText('Click')).toBeDisabled()
  })
})
```

### Integration Tests

- **Test component interactions**
- **Test user workflows**
- **Test error scenarios**

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<Button label="Click" onClick={() => {}} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Coverage Requirements

- **Minimum 80% overall coverage**
- **90%+ for critical paths**
- **100% for utility functions**

---

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `build` - Build system changes

### Scope (Optional)

- `react` - React package
- `types` - Types package
- `docs` - Documentation
- `storybook` - Storybook
- `ci` - CI/CD

### Examples

```bash
# Feature
feat(react): add voice input component

# Bug fix
fix(react): resolve streaming connection leak

# Documentation
docs(guides): add theming guide

# Breaking change
feat(react)!: redesign chat input API

BREAKING CHANGE: ChatInput now requires onSendMessage prop
```

### Commit Message Tips

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to" not "moves cursor to")
- Keep subject line under 50 characters
- Capitalize subject line
- No period at the end
- Separate subject from body with blank line
- Wrap body at 72 characters
- Use body to explain _what_ and _why_, not _how_

---

## Pull Request Process

### Before Submitting

1. ✅ **Tests pass** - `pnpm test`
2. ✅ **Linting passes** - `pnpm lint`
3. ✅ **Type checking passes** - `pnpm typecheck`
4. ✅ **Build succeeds** - `pnpm build`
5. ✅ **Documentation updated**
6. ✅ **Examples updated** (if applicable)
7. ✅ **Changeset created** (for package changes)

### Creating a Changeset

```bash
pnpm changeset
```

Follow the prompts to describe your changes. This will:

- Update CHANGELOG.md
- Determine version bump (major/minor/patch)
- Group changes for release

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changeset created
- [ ] Examples updated
- [ ] Accessibility tested
- [ ] Browser tested

## Screenshots (if applicable)

Attach screenshots or GIFs

## Related Issues

Closes #123
```

### PR Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Changes requested** (if needed)
4. **Approval** from maintainer
5. **Merge** to main branch

### Review Expectations

- **Response time:** Within 48 hours
- **Iteration:** Be prepared for feedback
- **Communication:** Ask questions if unclear

---

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0) - Breaking changes
- **Minor** (0.X.0) - New features
- **Patch** (0.0.X) - Bug fixes

### Release Workflow

1. **Changesets accumulate** on main branch
2. **Release PR created** automatically by Changesets
3. **Review and merge** release PR
4. **Packages published** to npm automatically
5. **GitHub release** created with changelog

### Manual Release (Maintainers)

```bash
# Update versions
pnpm version-packages

# Build and publish
pnpm release
```

---

## Development Tips

### Hot Reload

```bash
# Watch mode for package development
pnpm --filter @clarity-chat/react dev

# Storybook hot reload
pnpm storybook
```

### Debugging

```typescript
// Use React DevTools
// Add debugger statements
debugger

// Console logging (remove before commit)
console.log('Debug:', value)
```

### Common Issues

**Problem:** Module not found after adding dependency

**Solution:**

```bash
pnpm install
pnpm build
```

**Problem:** Type errors after changes

**Solution:**

```bash
pnpm typecheck
# Review errors and fix
```

**Problem:** Tests failing

**Solution:**

```bash
pnpm test -- --verbose
# Check error messages
```

---

## Getting Help

### Resources

- **[Documentation](./docs/getting-started.md)** - Getting started guide
- **[GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)** -
  Q&A and community chat
- **[GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)** - Bug
  reports

### Asking Questions

When asking for help:

1. Search existing issues/discussions first
2. Provide context and examples
3. Include error messages
4. Share relevant code snippets
5. Mention what you've tried

---

## Recognition

Contributors are recognized in:

- **CHANGELOG.md** - Listed in release notes
- **README.md** - Contributors section
- **All Contributors** - Visual recognition

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🙏

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in
helping make Clarity Chat better!

---

**Questions?** Start a [Discussion](https://github.com/christireid/Clarity-ai-chat-components/discussions)!
