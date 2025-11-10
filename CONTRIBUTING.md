# Contributing to Clarity Chat

**Thank you for your interest in contributing!** 🎉

This guide will help you get started quickly and follow our development workflow.

---

## 🚀 **Quick Start (5 Minutes)**

### **1. Prerequisites**

- **Node.js:** 18.20.0 (use `.nvmrc` file)
- **npm:** 9.0.0 or higher
- **Git:** Latest version

```bash
# Use correct Node version (if using nvm)
nvm use

# Or install the version
nvm install
```

---

### **2. Clone & Install**

```bash
# Clone the repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Install dependencies (this will take a few minutes)
npm install

# Verify installation
npm run validate:quick
```

**Expected time:** 3-5 minutes

---

### **3. Start Development**

```bash
# Option 1: Run Storybook (component development)
npm run storybook
# Opens at http://localhost:6006

# Option 2: Run docs site
npm run docs
# Opens at http://localhost:5173

# Option 3: Run specific example
cd examples/basic-chat
npm run dev
```

---

## 📋 **Development Workflow**

### **Step 1: Create a Branch**

```bash
# Always branch from main
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feat/your-feature-name

# Or bug fix branch
git checkout -b fix/your-bug-fix
```

### **Step 2: Make Changes**

```bash
# Make your code changes
# The dev tools will help you:

# ✅ Auto-format on save (VS Code)
# ✅ ESLint will highlight issues
# ✅ TypeScript will catch errors
# ✅ Tests will run automatically (if in watch mode)
```

### **Step 3: Test Your Changes**

```bash
# Run all quality checks
npm run validate

# Or individually:
npm run lint           # Check code quality
npm run typecheck      # Check types
npm run test           # Run unit tests
npm run build          # Ensure builds succeed
```

### **Step 4: Commit Your Changes**

We use **Conventional Commits** format:

```bash
# Interactive commit (recommended for first-timers)
npm run commit

# Or manual commit (must follow format)
git commit -m "feat(button): add loading state"
```

**Commit Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `build`: Build system changes
- `ci`: CI configuration
- `chore`: Other changes

**Scopes:** `button`, `input`, `card`, `primitives`, `react`, `docs`, `ci`, etc.

**Examples:**
```bash
feat(dialog): add close animation
fix(input): prevent double focus
docs(readme): update installation steps
refactor(hooks): simplify useChat logic
test(button): add accessibility tests
```

### **Step 5: Push & Create PR**

```bash
# Push your branch
git push origin feat/your-feature-name

# Create a pull request on GitHub
# Our CI will automatically:
# ✅ Run linting
# ✅ Run type checking
# ✅ Run tests
# ✅ Check bundle size
# ✅ Verify formatting
```

---

## 🧪 **Testing Guidelines**

### **Writing Tests**

All components should have tests. Use this template:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom">Click</Button>)
    expect(container.firstChild).toHaveClass('custom')
  })
})
```

### **Running Tests**

```bash
# Run all tests
npm run test

# Watch mode (recommended during development)
npm run test:watch

# With coverage
npm run test:coverage

# Visual UI
npm run test:unit:ui

# E2E tests
npm run test:e2e
npm run test:e2e:ui    # Interactive UI mode
npm run test:e2e:debug # Debug mode
```

### **Coverage Requirements**

- **Statements:** 80% minimum
- **Branches:** 70% minimum
- **Functions:** 80% minimum
- **Lines:** 80% minimum

Tests will fail if coverage drops below these thresholds.

---

## 🎨 **Code Style**

### **Formatting (Automatic)**

We use **Prettier** with **Tailwind CSS plugin**:

```bash
# Format all files
npm run format

# Check formatting (without changing files)
npm run format:check
```

**Settings:**
- 2 spaces for indentation
- Single quotes for JS/TS
- No semicolons
- Trailing commas (ES5)
- 80 character line width
- Tailwind classes auto-sorted

### **Linting (Automatic)**

We use **ESLint** with strict rules:

```bash
# Lint all files
npm run lint

# Auto-fix issues
npm run lint:fix
```

**Our lint rules enforce:**
- ✅ No unused variables (prefix with _ if intentional)
- ✅ React Hooks rules
- ✅ Accessibility requirements
- ✅ TypeScript best practices

### **Pre-commit Hooks**

Git hooks automatically run when you commit:

```bash
# Pre-commit (automatically runs):
# 1. ESLint --fix on staged files
# 2. Prettier --write on staged files

# Commit-msg (automatically runs):
# 1. Commitlint validates format

# Pre-push (automatically runs):
# 1. Type check
# 2. Run tests
```

**If hooks fail, your commit/push will be rejected.** Fix the issues and try again.

---

## 🏗️ **Project Structure**

```
clarity-chat/
├── packages/           # Core library packages
│   ├── primitives/    # Base components (Button, Input, etc.)
│   ├── react/         # Chat components (ChatWindow, Message, etc.)
│   ├── types/         # TypeScript types
│   ├── memory/        # Memory/context management
│   └── error-handling/# Error handling utilities
├── apps/              # Applications
│   ├── storybook/     # Component documentation
│   ├── docs/          # Documentation site
│   └── playground/    # Interactive playground
├── examples/          # Example applications
│   ├── basic-chat/    # Simple chat example
│   ├── streaming-chat/# Streaming example
│   └── ...           # More examples
├── scripts/           # Development scripts
└── .vscode/           # VS Code configuration
```

---

## 🔧 **Common Tasks**

### **Add a New Component**

```bash
# 1. Create component file
touch packages/primitives/src/components/my-component.tsx

# 2. Create test file
touch packages/primitives/src/components/my-component.test.tsx

# 3. Export from index
# Edit packages/primitives/src/index.ts

# 4. Create Storybook story
touch apps/storybook/stories/MyComponent.stories.tsx

# 5. Test it
npm run test -- my-component
npm run storybook
```

### **Add a New Hook**

```bash
# 1. Create hook file
touch packages/react/src/hooks/use-my-hook.ts

# 2. Create test file
touch packages/react/src/hooks/use-my-hook.test.ts

# 3. Export from index
# Edit packages/react/src/hooks/index.ts

# 4. Test it
npm run test -- use-my-hook
```

### **Add a New Package**

```bash
# 1. Create package directory
mkdir packages/my-package

# 2. Create package.json
npm init --workspace packages/my-package

# 3. Add to workspace
# Already configured in root package.json

# 4. Install dependencies
npm install --workspace packages/my-package react

# 5. Set up build
# Add tsconfig.json, tsup.config.ts, etc.
```

---

## 📦 **Working with Monorepo**

### **Turborepo Commands**

```bash
# Run command in all packages
npm run build          # Build all
npm run test           # Test all
npm run lint           # Lint all

# Run in specific workspace
npm run build --workspace=@clarity-chat/primitives
npm run test --workspace=@clarity-chat/react

# Filter by package
npx turbo run build --filter=@clarity-chat/primitives
```

### **Adding Dependencies**

```bash
# Add to specific package
npm install react --workspace=@clarity-chat/primitives

# Add dev dependency to root
npm install -D some-tool

# Add to all packages
npm install react --workspaces
```

---

## 🎯 **Pull Request Guidelines**

### **Before Submitting**

✅ All tests pass (`npm run test`)  
✅ Linting passes (`npm run lint`)  
✅ Type checking passes (`npm run typecheck`)  
✅ Build succeeds (`npm run build`)  
✅ Bundle size acceptable (`npm run size`)  
✅ Documentation updated (if needed)  
✅ Changeset added (if public API change)  

### **PR Title Format**

Use Conventional Commits format:

```
feat(button): add loading spinner
fix(input): resolve focus issue on Safari
docs(readme): update installation instructions
```

### **PR Description Template**

```markdown
## What does this PR do?

Brief description of changes.

## Why?

Explanation of motivation and context.

## How to test?

1. Step 1
2. Step 2
3. Expected result

## Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changeset added (if needed)
- [ ] Accessibility verified
- [ ] All checks pass
```

### **Changesets**

If your change affects the public API, add a changeset:

```bash
# Create a changeset
npm run changeset

# Follow the prompts:
# 1. Select affected packages
# 2. Choose version bump (major/minor/patch)
# 3. Write summary of changes
```

This ensures proper semantic versioning and changelog generation.

---

## 🎨 **Component Development**

### **Design Principles**

Follow our **v2.2 design principles:**
- ✨ Whisper-soft shadows (4-15% opacity)
- 📏 Refined borders (1px @ 40% opacity)
- 🎯 Soft focus glows (ring + shadow)
- ⚡ Subtle animations (1px lift, 200ms)
- ♿ WCAG AAA accessibility

See `DESIGN_SYSTEM_GUIDE.md` for complete guidelines.

### **Component Checklist**

When creating components, ensure:

- [ ] **TypeScript** - Full type safety
- [ ] **forwardRef** - Accepts ref prop
- [ ] **Accessibility** - ARIA attributes, keyboard nav
- [ ] **Variants** - Use CVA for variants
- [ ] **Customization** - Accept className prop
- [ ] **Tests** - 80%+ coverage
- [ ] **Storybook** - Interactive documentation
- [ ] **Performance** - No unnecessary re-renders

---

## 🐛 **Reporting Bugs**

### **Before Reporting**

1. **Search existing issues** - Might already be reported
2. **Try latest version** - Might already be fixed
3. **Minimal reproduction** - Isolate the bug

### **Bug Report Template**

```markdown
**Describe the bug**
Clear description of what's wrong.

**To Reproduce**
1. Step 1
2. Step 2
3. See error

**Expected behavior**
What should happen instead.

**Screenshots**
If applicable.

**Environment:**
- Clarity Chat version: 2.2.0
- React version: 19.0.0
- Browser: Chrome 120
- OS: macOS 14
```

---

## 💡 **Requesting Features**

### **Feature Request Template**

```markdown
**Is your feature related to a problem?**
Description of the problem.

**Describe the solution**
How the feature should work.

**Describe alternatives**
Other approaches considered.

**Additional context**
Any other information.
```

---

## 📚 **Documentation**

### **Component Documentation**

Every component needs:
1. **JSDoc comments** - Explain props and usage
2. **Storybook stories** - Interactive examples
3. **Tests** - Usage examples

**Example:**
```tsx
/**
 * Button component with loading states and variants.
 * 
 * @example
 * ```tsx
 * <Button variant="default" size="lg">
 *   Click me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // ...
  }
)
```

---

## 🎯 **Code Review Process**

### **What We Look For**

✅ **Code Quality:**
- Clean, readable code
- Proper TypeScript usage
- No unnecessary complexity

✅ **Testing:**
- Tests cover new functionality
- Edge cases handled
- Accessibility tested

✅ **Documentation:**
- JSDoc comments added
- Storybook stories created
- README updated if needed

✅ **Performance:**
- No performance regressions
- Bundle size impact minimal
- 60fps animations

✅ **Accessibility:**
- WCAG AAA compliant
- Keyboard navigation works
- Screen reader compatible

### **Review Timeline**

- **Initial feedback:** Within 2-3 days
- **Follow-ups:** Within 1-2 days
- **Merge:** Once all checks pass and approved

---

## 🔧 **Development Tools**

### **VS Code (Recommended)**

We have a complete VS Code setup:

**Recommended Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Pretty TypeScript Errors
- Vitest Explorer
- Playwright

**Install all:**
```bash
# VS Code will prompt to install recommended extensions
# Or press: Cmd+Shift+P > "Extensions: Show Recommended Extensions"
```

**Auto-formatting:**
- Format on save is enabled
- ESLint auto-fixes on save
- Tailwind classes auto-sorted

**Debugging:**
- Press `F5` to start debugging
- Multiple debug configurations available
- Breakpoints work in components and tests

---

### **Available Scripts**

```bash
# Development
npm run dev             # Start all dev servers
npm run storybook       # Component development
npm run docs            # Documentation site

# Quality Checks
npm run lint            # Check linting
npm run lint:fix        # Fix linting issues
npm run typecheck       # Check types
npm run test            # Run tests
npm run format          # Format all files
npm run format:check    # Check formatting

# Comprehensive Validation
npm run validate        # Run ALL checks
npm run validate:quick  # Lint + typecheck only

# Testing
npm run test            # All tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
npm run test:unit       # Unit tests only
npm run test:unit:ui    # Visual UI
npm run test:e2e        # E2E tests
npm run test:e2e:ui     # E2E with UI
npm run test:e2e:debug  # Debug mode

# Build
npm run build           # Build all packages
npm run clean           # Clean all builds

# Bundle Analysis
npm run size            # Check bundle sizes
npm run size:why        # Analyze why large
npm run analyze         # Full bundle analysis
npm run benchmark       # Performance benchmarks

# Release
npm run changeset       # Create changeset
npm run version-packages# Version bump
npm run release         # Publish to npm

# Commits
npm run commit          # Interactive commit (conventional)
```

---

## 📐 **Coding Standards**

### **TypeScript**

```tsx
// ✅ Good: Explicit types
interface ButtonProps {
  variant?: 'default' | 'outline'
  onClick?: () => void
}

export const Button = ({ variant = 'default' }: ButtonProps) => {
  // ...
}

// ❌ Bad: Implicit any
export const Button = ({ variant, onClick }: any) => {
  // ...
}
```

### **React**

```tsx
// ✅ Good: forwardRef for DOM components
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <button ref={ref} {...props} />
)

// ✅ Good: Destructure with defaults
const { variant = 'default', size = 'md' } = props

// ✅ Good: Use cn() for className merging
<button className={cn('base-classes', className)} />

// ❌ Bad: Template literals for classes (hard to purge)
<button className={`base-classes ${className}`} />
```

### **Hooks**

```tsx
// ✅ Good: Descriptive names, proper deps
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])

// ✅ Good: useCallback for functions passed as props
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])

// ❌ Bad: Missing dependencies (ESLint will warn)
useEffect(() => {
  doSomething(value)
}, []) // Missing 'value' in deps
```

### **CSS (Tailwind)**

```tsx
// ✅ Good: Semantic variants with CVA
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      outline: 'border border-input',
    },
  },
})

// ✅ Good: Consistent spacing scale (4px grid)
<div className="p-4 gap-2 rounded-lg" />

// ✅ Good: Use design tokens
<div className="shadow-xs border-border/40" />

// ❌ Bad: Arbitrary values (unless necessary)
<div className="p-[13px] rounded-[11px]" />
```

---

## 🎯 **Accessibility Requirements**

All components must be accessible:

### **Keyboard Navigation**
```tsx
// ✅ Focusable elements need visible focus
<button className="focus-visible:ring-1 focus-visible:shadow-focus-primary">
  
// ✅ Implement keyboard handlers
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick()
  }
}}
```

### **ARIA Attributes**
```tsx
// ✅ Proper labels
<button aria-label="Close dialog">

// ✅ Live regions for dynamic content
<div role="status" aria-live="polite">

// ✅ Descriptions for complex UI
<div aria-describedby="hint-id">
<span id="hint-id">Helpful hint</span>
```

### **Color Contrast**
- Text: 7:1 minimum (WCAG AAA)
- UI chrome: 3:1 minimum (WCAG AA)
- Test with browser devtools

---

## 📊 **Performance Guidelines**

### **Bundle Size**

```bash
# Check impact of your changes
npm run size

# Detailed analysis
npm run analyze
```

**Limits:**
- @clarity-chat/primitives: 50KB gzipped
- @clarity-chat/react: 80KB gzipped

### **Rendering Performance**

```tsx
// ✅ Good: Memoize expensive computations
const filtered = useMemo(
  () => messages.filter(m => m.role === 'user'),
  [messages]
)

// ✅ Good: Prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component)

// ❌ Bad: Creating functions in render
<button onClick={() => handleClick(id)}>
// Better: useCallback or bind
```

### **Animation Performance**

```css
/* ✅ Good: GPU-accelerated properties */
transform: translateY(-1px);
opacity: 0.9;

/* ❌ Bad: CPU-bound properties */
margin-top: -1px;
width: 100px;
```

---

## 🚢 **Release Process**

### **For Maintainers**

```bash
# 1. Ensure all PRs have changesets
npm run changeset:status

# 2. Version bump (creates PR)
npm run version-packages

# 3. Merge version PR

# 4. Publish to npm
npm run release

# 5. Create GitHub release
gh release create v2.x.x --generate-notes
```

---

## ❓ **Getting Help**

**Questions?**
- GitHub Discussions - Ask the community
- Discord - Real-time chat (link in README)
- Issues - Report bugs or request features

**Documentation:**
- `README.md` - Project overview
- `DESIGN_SYSTEM_GUIDE.md` - Design guidelines
- `ARCHITECTURE_OVERVIEW.md` - Architecture
- `START_HERE_V2.2.md` - v2.2 specific

---

## 🎉 **Recognition**

All contributors are recognized:

- ✅ Added to CHANGELOG
- ✅ Mentioned in release notes
- ✅ Listed in contributors
- ✅ Special thanks for major contributions

**Thank you for contributing!** 🙏

---

## 📞 **Contact**

- **Email:** christi@codeclarity.ai
- **GitHub:** @christireid
- **Issues:** https://github.com/christireid/Clarity-ai-chat-components/issues

---

**Happy coding!** ✨

Remember: Quality over speed. We'd rather wait for excellent code than ship broken code quickly.
