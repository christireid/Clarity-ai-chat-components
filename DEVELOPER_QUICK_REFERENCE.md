# Developer Quick Reference

**One-page cheat sheet for daily development**

---

## ⚡ **Essential Commands**

### **Most Used (Daily)**
```bash
npm run storybook       # Component development
npm run test:watch      # Test while coding
npm run commit          # Interactive commit
git push                # Auto-validates before push
```

### **Quality Checks**
```bash
npm run lint            # Check linting
npm run lint:fix        # Auto-fix linting
npm run typecheck       # Check TypeScript
npm run test            # Run all tests
npm run format          # Format all files
npm run validate        # Run EVERYTHING
```

### **Setup & Tools**
```bash
bash scripts/dev-setup.sh        # Initial setup
bash scripts/check-quality.sh    # Pre-push validation
npm run analyze         # Bundle analysis
npm run size            # Check bundle sizes
```

---

## 🎯 **Quick Workflows**

### **Start Your Day**
```bash
git pull origin main
npm run storybook       # Or docs/examples
npm run test:watch      # In separate terminal
```

### **Make a Change**
```bash
# 1. Create branch
git checkout -b feat/my-feature

# 2. Make changes (auto-format on save in VS Code)

# 3. Test
npm run test:watch      # Tests auto-run

# 4. Commit (interactive)
npm run commit

# 5. Push (auto-validates)
git push origin feat/my-feature
```

### **Before Submitting PR**
```bash
npm run validate        # Run all checks
npm run changeset       # If API changed
```

---

## 🔍 **Finding Things**

### **File Locations**
```
Components:    packages/primitives/src/components/
Chat logic:    packages/react/src/components/
Hooks:         packages/react/src/hooks/
Types:         packages/types/src/
Tests:         **/*.test.tsx
Stories:       apps/storybook/stories/
```

### **Common Files**
```
Config:        Root directory (eslint.config.js, etc.)
VS Code:       .vscode/
Scripts:       scripts/
Workflows:     .github/workflows/
Hooks:         .husky/
```

---

## 💻 **VS Code Shortcuts**

### **Navigation**
- `Cmd+P` (Ctrl+P) - Quick open file
- `Cmd+Shift+P` - Command palette
- `Cmd+T` - Go to symbol

### **Editing**
- `Cmd+/` - Toggle comment
- `Cmd+D` - Select next occurrence
- `Alt+Up/Down` - Move line up/down
- `Shift+Alt+F` - Format document

### **Debugging**
- `F5` - Start debugging
- `F9` - Toggle breakpoint
- `F10` - Step over
- `F11` - Step into

### **Testing**
- Open Testing sidebar (beaker icon)
- Click play icon to run test
- Right-click → Debug test

---

## 🧪 **Testing Quick Guide**

### **Run Tests**
```bash
npm run test                  # All tests
npm run test -- button        # Specific test
npm run test:watch            # Watch mode
npm run test:unit:ui          # Visual UI
npm run test:coverage         # With coverage
```

### **Write a Test**
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders', () => {
    render(<Button>Click</Button>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })
})
```

---

## 📝 **Commit Format**

### **Structure**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### **Types**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

### **Scopes**
- Component: `button`, `input`, `card`, etc.
- Package: `primitives`, `react`, `types`
- Infrastructure: `ci`, `deps`, `config`

### **Examples**
```bash
feat(button): add loading state
fix(input): resolve focus issue
docs(readme): update install steps
refactor(hooks): simplify useChat
test(dialog): add keyboard tests
chore(deps): upgrade React to 19
```

### **Interactive Helper**
```bash
npm run commit    # Guided prompts
```

---

## 🎨 **Code Snippets (VS Code)**

Type these prefixes and press Tab:

- `rfc` → React component with forwardRef
- `rhook` → Custom React hook
- `vtest` → Vitest test suite
- `cva` → Class variance authority
- `story` → Storybook story

---

## 🔧 **Troubleshooting**

### **Common Issues**

**"Module not found"**
```bash
npm install && npm run build
```

**"Git hooks not running"**
```bash
npm run prepare
```

**"Tests failing"**
```bash
npm run test -- --verbose
npm run test:unit:ui    # Visual debugging
```

**"Type errors"**
```bash
npm run typecheck
# Restart TS server in VS Code: Cmd+Shift+P → Restart TS Server
```

**"Build fails"**
```bash
npm run clean
npm run build
```

---

## 📦 **Package.json Scripts**

### **Development**
- `dev` - Start all dev servers
- `storybook` - Component development
- `docs` - Documentation site

### **Quality**
- `lint` - Check linting
- `lint:fix` - Auto-fix
- `typecheck` - Type checking
- `test` - Run tests
- `format` - Format files
- `format:check` - Check formatting
- `validate` - All checks
- `validate:quick` - Lint + typecheck

### **Building**
- `build` - Build all packages
- `clean` - Clean builds

### **Testing**
- `test` - All tests
- `test:watch` - Watch mode
- `test:coverage` - With coverage
- `test:unit` - Unit tests
- `test:unit:ui` - Visual UI
- `test:e2e` - E2E tests
- `test:e2e:ui` - E2E UI
- `test:e2e:debug` - Debug mode

### **Analysis**
- `size` - Check sizes
- `size:why` - Why large?
- `analyze` - Full analysis
- `benchmark` - Performance

### **Release**
- `changeset` - Create changeset
- `version-packages` - Bump versions
- `release` - Publish to npm

### **Commits**
- `commit` - Interactive commit

---

## 🎯 **Git Hooks Reference**

### **Pre-Commit (Automatic)**
```
Runs when: You commit
Does:
  1. ESLint --fix on staged files
  2. Prettier --write on staged files
  
Result: Only formatted code gets committed
```

### **Commit-Msg (Automatic)**
```
Runs when: You commit
Does:
  1. Validates commit message format
  
Result: Only conventional commits allowed
```

### **Pre-Push (Automatic)**
```
Runs when: You push
Does:
  1. Type checking
  2. Run all tests
  
Result: Only quality code reaches remote
```

---

## 🏃 **Quick Actions**

### **I want to...**

**Start developing:**
```bash
npm run storybook
```

**Run tests:**
```bash
npm run test:watch
```

**Debug a component:**
```
Press F5 in VS Code → Select config → Debug!
```

**Check if my code is good:**
```bash
npm run validate:quick   # Fast
npm run validate         # Comprehensive
```

**Commit changes:**
```bash
npm run commit           # Interactive
# Or: git commit -m "feat(x): y"
```

**Before pushing:**
```bash
bash scripts/check-quality.sh
```

**Update dependencies:**
```
Wait for Dependabot PR, review and merge
```

---

## 📋 **File Types**

### **Component File**
```tsx
// packages/primitives/src/components/button.tsx
import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'

const variants = cva(/* ... */)

export const Button = forwardRef<HTMLButtonElement, Props>(
  (props, ref) => <button ref={ref} {...props} />
)

Button.displayName = 'Button'
```

### **Test File**
```tsx
// packages/primitives/src/components/button.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

describe('Button', () => {
  it('renders', () => {
    // Test here
  })
})
```

### **Story File**
```tsx
// apps/storybook/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'

const meta = { /* ... */ } satisfies Meta<typeof Button>
export default meta

export const Default: Story = { args: { /* ... */ } }
```

---

## 🎓 **Learning Resources**

**Internal:**
- `DEVELOPER_ONBOARDING.md` - 30-min guide
- `CONTRIBUTING.md` - Complete guide
- `DESIGN_SYSTEM_GUIDE.md` - Design principles

**External:**
- [React Docs](https://react.dev)
- [Vitest Docs](https://vitest.dev)
- [Tailwind Docs](https://tailwindcss.com)

---

## ✅ **Daily Checklist**

**Starting work:**
- [ ] `git pull origin main`
- [ ] `npm run storybook` (or docs)
- [ ] `npm run test:watch`

**Before committing:**
- [ ] Tests pass
- [ ] No lint errors
- [ ] No type errors

**Before pushing:**
- [ ] `npm run validate:quick` passes
- [ ] Created changeset (if API changed)

---

## 🆘 **Need Help?**

**Quick:**
- This guide
- `❓_FAQ.md`
- `🔧_TROUBLESHOOTING_GUIDE.md`

**Detailed:**
- `DEVELOPER_ONBOARDING.md`
- `CONTRIBUTING.md`
- GitHub Discussions

---

**Print this guide or bookmark it!** 📌

**Status:** Complete quick reference ✅
