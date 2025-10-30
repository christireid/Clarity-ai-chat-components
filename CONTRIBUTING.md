# Contributing to Clarity Chat

Thank you for your interest in contributing to Clarity Chat! 🎉

This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

---

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

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

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
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

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all packages in the monorepo.

### 3. Build Packages

```bash
npm run build
```

### 4. Start Development Environment

```bash
# Start Storybook (component development)
npm run storybook

# Or start the docs site
npm run docs

# Or work on a specific package
npm run dev --workspace=packages/react
```

### 5. Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

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
│   └── docs/             # Documentation site
├── examples/             # Example applications
├── docs/                 # Markdown documentation
└── .archive/             # Archived files
```

### Key Files

- `package.json` - Root package configuration
- `turbo.json` - Monorepo build configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - Linting rules
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
npm run typecheck

# Linting
npm run lint

# Tests
npm test

# Build
npm run build
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
- Use body to explain *what* and *why*, not *how*

---

## Pull Request Process

### Before Submitting

1. ✅ **Tests pass** - `npm test`
2. ✅ **Linting passes** - `npm run lint`
3. ✅ **Type checking passes** - `npm run typecheck`
4. ✅ **Build succeeds** - `npm run build`
5. ✅ **Documentation updated**
6. ✅ **Examples updated** (if applicable)
7. ✅ **Changeset created** (for package changes)

### Creating a Changeset

```bash
npm run changeset
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
npm run version-packages

# Build and publish
npm run release
```

---

## Development Tips

### Hot Reload

```bash
# Watch mode for package development
npm run dev --workspace=packages/react

# Storybook hot reload
npm run storybook
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
npm install
npm run build
```

**Problem:** Type errors after changes

**Solution:**
```bash
npm run typecheck
# Review errors and fix
```

**Problem:** Tests failing

**Solution:**
```bash
npm run test -- --verbose
# Check error messages
```

---

## Getting Help

### Resources

- **[Documentation](./docs/README.md)** - Full docs
- **[Discord](https://discord.gg/clarity-chat)** - Community chat
- **[GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)** - Q&A
- **[GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)** - Bug reports

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

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in helping make Clarity Chat better!

---

**Questions?** Join us on [Discord](https://discord.gg/clarity-chat) or start a [Discussion](https://github.com/christireid/Clarity-ai-chat-components/discussions)!
