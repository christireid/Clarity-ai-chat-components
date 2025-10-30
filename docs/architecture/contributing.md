# Contributing to Clarity Chat

Thank you for your interest in contributing to Clarity Chat! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Component Guidelines](#component-guidelines)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please:

- **Be respectful** and inclusive
- **Be patient** and helpful
- **Assume good intentions**
- **Give constructive feedback**
- **Focus on what's best** for the community

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Add upstream remote
git remote add upstream https://github.com/christireid/Clarity-ai-chat-components.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Start Development

```bash
# Start Storybook for component development
npm run storybook

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck
```

---

## 🔄 Development Workflow

### Daily Workflow

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run checks locally**
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run format
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Project Structure

```
packages/
├── react/              # Main library
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── __tests__/     # Test files
│   └── package.json
│
├── types/              # TypeScript types
├── primitives/         # Base components
└── error-handling/     # Error system
```

---

## 📝 Coding Standards

### TypeScript

- ✅ Use **strict mode**
- ✅ Explicit return types for functions
- ✅ No `any` types (use `unknown` if needed)
- ✅ Prefer interfaces over type aliases for objects
- ✅ Use const assertions where appropriate

```typescript
// ✅ Good
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

function Button({ label, onClick, disabled = false }: ButtonProps): JSX.Element {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}

// ❌ Bad
function Button(props: any) {
  return <button>{props.label}</button>
}
```

### React

- ✅ Use functional components and hooks
- ✅ Memoize expensive computations with `useMemo`
- ✅ Memoize callbacks with `useCallback`
- ✅ Use `React.memo` for frequently re-rendered components
- ✅ Extract complex logic into custom hooks

```typescript
// ✅ Good
export const Message = memo(function Message({ content, role }: MessageProps) {
  const formattedContent = useMemo(() => formatMarkdown(content), [content])
  const handleCopy = useCallback(() => navigator.clipboard.writeText(content), [content])
  
  return (
    <div className="message">
      <div>{formattedContent}</div>
      <button onClick={handleCopy}>Copy</button>
    </div>
  )
})

// ❌ Bad
export function Message(props: any) {
  const formattedContent = formatMarkdown(props.content) // Runs on every render
  
  return <div>{formattedContent}</div>
}
```

### Naming Conventions

- **Components**: PascalCase (`ChatWindow`, `MessageList`)
- **Hooks**: camelCase with `use` prefix (`useChat`, `useStreaming`)
- **Utilities**: camelCase (`formatDate`, `calculateTokens`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_THEME`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`Message`, `ThemeConfig`)

### File Structure

```
component-name/
├── component-name.tsx          # Component implementation
├── component-name.test.tsx     # Tests
├── component-name.stories.tsx  # Storybook stories
└── index.ts                    # Re-exports
```

---

## 🧪 Testing Guidelines

### Test Requirements

Every component and hook **must have tests** covering:

1. ✅ Basic rendering
2. ✅ User interactions
3. ✅ Edge cases
4. ✅ Error states
5. ✅ Accessibility

### Test Structure

```typescript
import { render, screen, userEvent } from '../test-utils'
import { ChatInput } from './chat-input'

describe('ChatInput', () => {
  it('renders correctly', () => {
    render(<ChatInput onSendMessage={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('sends message on submit', async () => {
    const onSendMessage = vi.fn()
    render(<ChatInput onSendMessage={onSendMessage} />)
    
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello')
    await userEvent.keyboard('{Enter}')
    
    expect(onSendMessage).toHaveBeenCalledWith('Hello')
  })

  it('disables input when loading', () => {
    render(<ChatInput onSendMessage={vi.fn()} isLoading />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
```

### Coverage Goals

| Category | Minimum Coverage |
|----------|-----------------|
| Components | 80% |
| Hooks | 90% |
| Utilities | 95% |
| Overall | 80% |

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode (recommended)
npm run test:ui
```

---

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear, automated changelogs.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes
- `ci`: CI/CD changes
- `revert`: Revert a previous commit

### Examples

```bash
# Feature
git commit -m "feat(chat): add voice input component"

# Bug fix
git commit -m "fix(streaming): handle connection errors correctly"

# Breaking change
git commit -m "feat(theme)!: redesign theme system

BREAKING CHANGE: ThemeProvider now requires explicit theme prop"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(hooks): simplify useChat implementation"
```

### Scope Guidelines

Use package or feature name:
- `chat`, `message`, `input`, `theme`
- `hooks`, `utils`, `types`
- `docs`, `storybook`, `examples`
- `ci`, `build`, `deps`

---

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Tests pass (`npm run test`)
2. ✅ Linting passes (`npm run lint`)
3. ✅ Type checking passes (`npm run typecheck`)
4. ✅ Code is formatted (`npm run format`)
5. ✅ Documentation updated
6. ✅ Storybook stories added (for components)
7. ✅ Changeset created (`npm run changeset`)

### PR Title Format

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update guide`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added tests
- [ ] All tests pass
- [ ] Manual testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests with >80% coverage
- [ ] Storybook stories added
- [ ] Changeset created

## Screenshots (if applicable)
```

### Review Process

1. **Automated checks** run on PR
2. **Maintainer review** (1-2 days)
3. **Address feedback**
4. **Approval** and merge

---

## 🎨 Component Guidelines

### Component Template

```typescript
import { memo, useMemo } from 'react'
import { cn } from '../utils/classnames'

export interface MyComponentProps {
  /**
   * The main content
   */
  content: string
  
  /**
   * Optional className for styling
   */
  className?: string
  
  /**
   * Callback when action occurs
   */
  onAction?: () => void
}

/**
 * MyComponent - Brief description of what it does
 * 
 * @example
 * ```tsx
 * <MyComponent content="Hello" onAction={() => console.log('action')} />
 * ```
 */
export const MyComponent = memo<MyComponentProps>(function MyComponent({
  content,
  className,
  onAction,
}) {
  const processedContent = useMemo(() => {
    // Expensive computation here
    return content.toUpperCase()
  }, [content])

  return (
    <div className={cn('my-component', className)}>
      <p>{processedContent}</p>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  )
})

MyComponent.displayName = 'MyComponent'
```

### Props Best Practices

1. ✅ **Required props first**, optional props last
2. ✅ **Destructure props** in function signature
3. ✅ **Use TypeScript interfaces** for props
4. ✅ **Document all props** with JSDoc
5. ✅ **Provide sensible defaults**
6. ✅ **Use `className` prop** for custom styling

### Accessibility Requirements

Every component must:

1. ✅ Use semantic HTML elements
2. ✅ Include proper ARIA attributes
3. ✅ Support keyboard navigation
4. ✅ Have sufficient color contrast (7:1 for AAA)
5. ✅ Work with screen readers
6. ✅ Pass axe accessibility tests

```typescript
// ✅ Good
<button 
  onClick={handleClick}
  aria-label="Send message"
  disabled={isLoading}
>
  Send
</button>

// ❌ Bad
<div onClick={handleClick}>Send</div>
```

---

## 📚 Documentation

### What Needs Documentation

1. **Components** - Props, usage examples, edge cases
2. **Hooks** - Parameters, return values, examples
3. **Utilities** - Function signature, examples
4. **Guides** - Step-by-step tutorials
5. **API Reference** - Complete API documentation

### Documentation Standards

```typescript
/**
 * useChat - Main hook for chat state management
 * 
 * Manages messages, sending, streaming, and error handling.
 * 
 * @param config - Configuration options
 * @returns Chat state and actions
 * 
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading } = useChat({
 *   apiEndpoint: '/api/chat',
 *   onError: handleError,
 * })
 * ```
 * 
 * @see {@link ChatConfig} for configuration options
 */
export function useChat(config: ChatConfig): ChatState {
  // Implementation
}
```

### Storybook Stories

Every component needs a Storybook story:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './my-component'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    onAction: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    content: 'Hello, World!',
  },
}

export const WithAction: Story = {
  args: {
    content: 'Click me',
    onAction: () => alert('Action!'),
  },
}
```

---

## 🎁 Contribution Ideas

Not sure what to work on? Here are some ideas:

### 🐛 Bug Fixes
Check [Issues](https://github.com/christireid/Clarity-ai-chat-components/issues) labeled `bug`

### ✨ Features
Check [Issues](https://github.com/christireid/Clarity-ai-chat-components/issues) labeled `enhancement`

### 📖 Documentation
- Improve existing docs
- Add more examples
- Create tutorials
- Fix typos

### 🎨 Themes
- Create new themes
- Improve existing themes
- Add theme presets

### 🧪 Tests
- Increase test coverage
- Add integration tests
- Add E2E tests

### 🌍 Internationalization
- Add translations
- Support RTL languages

---

## ❓ Questions?

- 💬 [Discord](https://discord.gg/clarity-chat)
- 🐛 [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💡 [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

## 🙏 Thank You!

Your contributions make Clarity Chat better for everyone. We appreciate your time and effort!

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**
