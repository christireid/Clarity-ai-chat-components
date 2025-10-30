# Contributing to Clarity Chat

Thank you for your interest in contributing to Clarity Chat! 🎉

This document provides guidelines and instructions for contributing to the project.

---

## 📋 **Table of Contents**

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Commit Message Format](#commit-message-format)

---

## 🤝 **Code of Conduct**

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

**In summary:**
- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

---

## 🚀 **Getting Started**

### **Prerequisites**

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** for version control
- Code editor (VS Code recommended)

### **Fork and Clone**

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/christireid/Clarity-ai-chat-components.git
```

### **Install Dependencies**

```bash
npm install
```

### **Verify Setup**

```bash
# Run tests
npm run test

# Start Storybook
npm run storybook

# Build packages
npm run build
```

---

## 💻 **Development Workflow**

### **1. Create a Branch**

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/fixes
- `chore/` - Maintenance tasks

### **2. Make Changes**

- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### **3. Test Your Changes**

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint
```

### **4. Preview Changes**

```bash
# Start Storybook
npm run storybook

# Start docs site
npm run docs
```

### **5. Commit Changes**

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add voice input component"
```

See [Commit Message Format](#commit-message-format) for details.

### **6. Push to Your Fork**

```bash
git push origin feature/your-feature-name
```

### **7. Create Pull Request**

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit for review

---

## 🔄 **Pull Request Process**

### **Before Submitting**

- ✅ Tests pass (`npm run test`)
- ✅ Code is formatted (`npm run format`)
- ✅ Types are correct (`npm run typecheck`)
- ✅ Linting passes (`npm run lint`)
- ✅ Documentation is updated
- ✅ Storybook stories added (for UI changes)
- ✅ CHANGELOG.md updated (for significant changes)

### **PR Template**

Your PR should include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Storybook stories added
- [ ] No breaking changes (or documented)
```

### **Review Process**

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, maintainers will merge

**Review criteria:**
- Code quality and readability
- Test coverage
- Documentation completeness
- Performance impact
- Breaking changes justified

---

## 📏 **Coding Standards**

### **TypeScript**

- Use strict mode (`strict: true`)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use `unknown` if necessary

**Example:**

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Bad
type User = {
  id: any
  name: any
}

function getUser(id) {
  // ...
}
```

### **React**

- Use functional components with hooks
- Prefer named exports
- Use TypeScript for prop types
- Memoize expensive computations

**Example:**

```typescript
// ✅ Good
export interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// ❌ Bad
export default function Button(props: any) {
  return <button {...props} />
}
```

### **CSS/Styling**

- Use Tailwind CSS utilities
- Use `clsx` for conditional classes
- Follow BEM naming for custom CSS
- Mobile-first responsive design

**Example:**

```typescript
import { clsx } from 'clsx'

export function Alert({ variant, children }: AlertProps) {
  return (
    <div
      className={clsx(
        'rounded-lg p-4',
        {
          'bg-blue-100 text-blue-900': variant === 'info',
          'bg-red-100 text-red-900': variant === 'error',
        }
      )}
    >
      {children}
    </div>
  )
}
```

### **File Organization**

```
src/
├── components/
│   ├── button.tsx          # Component file
│   ├── button.stories.tsx  # Storybook story
│   └── __tests__/
│       └── button.test.tsx # Tests
├── hooks/
│   ├── use-chat.ts
│   └── __tests__/
│       └── use-chat.test.ts
└── utils/
    ├── format.ts
    └── __tests__/
        └── format.test.ts
```

---

## 🧪 **Testing Guidelines**

### **Unit Tests**

Write unit tests for:
- All utility functions
- Complex hooks
- Business logic

**Example:**

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from './format'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('January 1, 2024')
  })

  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('')
  })
})
```

### **Component Tests**

Write component tests for:
- User interactions
- Rendering different states
- Accessibility

**Example:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<Button label="Click me" onClick={onClick} />)

    await user.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" onClick={() => {}} disabled />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### **Test Coverage**

Aim for:
- **80%+** overall coverage
- **90%+** for critical paths
- **100%** for utilities

Check coverage:

```bash
npm run test:coverage
```

---

## 📚 **Documentation**

### **Code Comments**

Use JSDoc for public APIs:

```typescript
/**
 * Formats a date into a human-readable string.
 *
 * @param date - The date to format
 * @param format - The format string (optional)
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date()) // "January 1, 2024"
 * formatDate(new Date(), 'short') // "1/1/24"
 * ```
 */
export function formatDate(date: Date, format?: string): string {
  // ...
}
```

### **Component Documentation**

Add Storybook stories for all components:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    label: 'Click me',
    variant: 'primary',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
}
```

### **Markdown Documentation**

Update relevant docs in `/docs`:
- Getting Started guides
- API documentation
- Examples

---

## 📝 **Commit Message Format**

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Types**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions/fixes
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### **Scope** (optional)

- `components` - Component changes
- `hooks` - Hook changes
- `theme` - Theme system
- `docs` - Documentation
- `deps` - Dependencies

### **Examples**

```bash
# Feature
feat(components): add voice input component

# Bug fix
fix(hooks): resolve memory leak in useChat

# Breaking change
feat(theme)!: redesign theme system

BREAKING CHANGE: Theme structure has changed. See migration guide.

# Documentation
docs(getting-started): update installation guide

# Chore
chore(deps): update react to v19.0.0
```

---

## 🏗️ **Architecture Decisions**

When proposing significant changes:

1. Open an issue for discussion
2. Provide use cases and examples
3. Consider backwards compatibility
4. Document breaking changes
5. Update migration guides

---

## 🐛 **Reporting Bugs**

Found a bug? Please [open an issue](https://github.com/christireid/Clarity-ai-chat-components/issues/new) with:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment info (OS, Node version, etc.)

---

## 💡 **Suggesting Features**

Have an idea? [Open a discussion](https://github.com/christireid/Clarity-ai-chat-components/discussions) with:

- Clear use case
- Example implementation
- Potential API design
- Alternatives considered

---

## 🎓 **Resources**

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📞 **Getting Help**

- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 📖 [Documentation](./docs/README.md)

---

## 🙏 **Thank You!**

Your contributions make Clarity Chat better for everyone. We appreciate your time and effort!

---

**Happy Coding! 🚀**
