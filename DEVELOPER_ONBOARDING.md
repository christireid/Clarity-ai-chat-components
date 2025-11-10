# Developer Onboarding Guide

**Get up and running with Clarity Chat development in 30 minutes**

---

## 👋 **Welcome!**

This guide will take you from zero to productive contributor in ~30 minutes.

---

## ⏱️ **Quick Setup (10 minutes)**

### **1. Prerequisites** (2 min)

**Check you have:**

```bash
# Node.js 18.20.0+
node -v

# npm 9.0.0+
npm -v

# Git
git --version
```

**Don't have the right Node version?**

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use the project's Node version
nvm install
nvm use
```

---

### **2. Clone & Install** (5 min)

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Install all dependencies (takes 3-5 minutes)
npm install

# This will:
# ✅ Install packages for all workspaces
# ✅ Set up git hooks (Husky)
# ✅ Prepare the development environment
```

**Expected output:**
```
✅ Dependencies installed successfully
✅ Git hooks configured
✅ Ready to develop!
```

---

### **3. Verify Setup** (3 min)

```bash
# Run quick validation
npm run validate:quick

# Expected: ✅ Linting passed, ✅ Type checking passed
```

**If this succeeds, you're ready to code!** ✅

---

## 🚀 **First Development Session (10 minutes)**

### **Option A: Component Development (Storybook)**

**Best for:** Working on UI components

```bash
# Start Storybook
npm run storybook

# Opens at http://localhost:6006
# You'll see all components with interactive controls
```

**What you can do:**
- Browse all components
- Play with props interactively
- See documentation
- Test dark mode
- View source code

---

### **Option B: Documentation Site**

**Best for:** Working on docs or seeing the big picture

```bash
# Start docs site
npm run docs

# Opens at http://localhost:5173
```

---

### **Option C: Example Application**

**Best for:** Testing in a real app

```bash
# Run the basic chat example
cd examples/basic-chat
npm run dev

# Opens at http://localhost:3000
```

---

## 📚 **Understanding the Codebase (10 minutes)**

### **Monorepo Structure**

```
├── packages/              ← Core libraries
│   ├── primitives/       ← Base components (Button, Input, Card)
│   ├── react/            ← Chat components (ChatWindow, Message)
│   ├── types/            ← TypeScript definitions
│   ├── memory/           ← Context/memory management
│   └── error-handling/   ← Error recovery
│
├── apps/                  ← Applications
│   ├── storybook/        ← Component playground
│   └── docs/             ← Documentation site
│
├── examples/              ← Example apps
│   ├── basic-chat/       ← Simple chat
│   ├── streaming-chat/   ← Streaming example
│   └── ...               ← More examples
│
└── scripts/               ← Developer tools
```

---

### **Key Packages**

**@clarity-chat/primitives**
- Base UI components
- Button, Input, Card, Dialog, Badge, etc.
- No chat-specific logic
- Maximum reusability

**@clarity-chat/react**
- Chat-specific components
- ChatWindow, Message, ChatInput, etc.
- Hooks for chat functionality
- Built on primitives

**@clarity-chat/types**
- All TypeScript types
- Shared across packages
- Message, ChatConfig, Provider types

---

### **Important Files**

**Configuration:**
- `.nvmrc` - Node version
- `.editorconfig` - Editor settings
- `eslint.config.js` - Linting rules
- `.prettierrc` - Formatting rules
- `turbo.json` - Build orchestration
- `tsconfig.json` - TypeScript config

**Development:**
- `package.json` - Scripts & dependencies
- `.vscode/` - VS Code integration
- `.husky/` - Git hooks
- `vitest.workspace.ts` - Test configuration

**Documentation:**
- `CONTRIBUTING.md` - This guide
- `DESIGN_SYSTEM_GUIDE.md` - Design principles
- `README.md` - Project overview

---

## 💻 **VS Code Setup (Recommended)**

### **Install Recommended Extensions**

When you open the project in VS Code, you'll see:

```
"This workspace recommends extensions. Would you like to install them?"
```

**Click "Install All"** ✅

**You'll get:**
- ESLint (auto-fix on save)
- Prettier (auto-format on save)
- Tailwind CSS IntelliSense
- Vitest Explorer (run tests in sidebar)
- Pretty TypeScript Errors (better error messages)
- GitLens (advanced git features)

---

### **Verify VS Code is Configured**

**Check these settings are working:**

1. **Auto-format on save:**
   - Edit a file, make it messy
   - Save (Cmd+S / Ctrl+S)
   - Should auto-format ✨

2. **ESLint auto-fix:**
   - Add unused variable
   - Save
   - Should show warning/error

3. **Tailwind IntelliSense:**
   - Type `className="bg-`
   - Should see autocomplete suggestions

4. **TypeScript errors:**
   - Should see inline errors with helpful messages

**All working?** You're set up perfectly! ✅

---

## 🧪 **Running Your First Test**

### **1. Find a Component**

```bash
# Open a component file
code packages/primitives/src/components/button.tsx
```

### **2. Find Its Test**

```bash
# Open the test file
code packages/primitives/src/components/button.test.tsx
```

### **3. Run the Test**

```bash
# Option 1: Command line
npm run test -- button

# Option 2: VS Code Testing sidebar
# Click the beaker icon → Run test

# Option 3: Watch mode
npm run test:watch -- button
```

---

## 🎨 **Making Your First Change**

### **Example: Add a New Button Variant**

**1. Create a branch:**
```bash
git checkout -b feat/button-ghost-variant
```

**2. Edit the component:**
```tsx
// packages/primitives/src/components/button.tsx

const buttonVariants = cva(
  'base-classes...',
  {
    variants: {
      variant: {
        default: '...',
        outline: '...',
        ghost: 'hover:bg-accent hover:text-accent-foreground', // ← Add this
      },
    },
  }
)
```

**3. Add a test:**
```tsx
// packages/primitives/src/components/button.test.tsx

it('renders ghost variant', () => {
  const { container } = render(<Button variant="ghost">Ghost</Button>)
  expect(container.firstChild).toHaveClass('hover:bg-accent')
})
```

**4. Add Storybook story:**
```tsx
// apps/storybook/stories/Button.stories.tsx

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}
```

**5. Test it:**
```bash
# Run tests
npm run test -- button

# Check Storybook
npm run storybook
# Navigate to Button → Ghost
```

**6. Commit:**
```bash
# Using commitizen (interactive)
npm run commit

# Or manual:
git add .
git commit -m "feat(button): add ghost variant"
```

**7. Push & create PR:**
```bash
git push origin feat/button-ghost-variant
# Create PR on GitHub
```

**Congratulations! You just contributed!** 🎉

---

## 🛠️ **Development Commands Reference**

### **Most Common**

```bash
npm run storybook      # Component development ⭐
npm run test:watch     # Test while coding ⭐
npm run lint:fix       # Fix linting issues ⭐
npm run typecheck      # Check types ⭐
```

### **Quality Checks**

```bash
npm run validate       # Run ALL checks (comprehensive)
npm run validate:quick # Lint + typecheck only (fast)
bash scripts/check-quality.sh # Full quality gate
```

### **Testing**

```bash
npm run test           # All tests
npm run test:watch     # Watch mode (recommended)
npm run test:coverage  # With coverage report
npm run test:unit:ui   # Visual UI for debugging
npm run test:e2e       # E2E tests
npm run test:e2e:ui    # E2E with UI
```

### **Building**

```bash
npm run build          # Build all packages
npm run build --workspace=@clarity-chat/primitives  # Build one
npm run clean          # Clean all builds
```

### **Bundle Analysis**

```bash
npm run size           # Check bundle sizes
npm run size:why       # Why is bundle large?
npm run analyze        # Full analysis (HTML report)
```

---

## 🎯 **Common Workflows**

### **Workflow 1: Fix a Bug**

```bash
# 1. Reproduce the bug
npm run storybook
# Navigate to component and reproduce

# 2. Create branch
git checkout -b fix/describe-the-bug

# 3. Write a failing test
# Edit component.test.tsx
npm run test:watch -- component

# 4. Fix the bug
# Edit component.tsx
# Test should now pass

# 5. Commit and push
npm run commit
git push origin fix/describe-the-bug
```

---

### **Workflow 2: Add a Feature**

```bash
# 1. Create branch
git checkout -b feat/describe-feature

# 2. Implement feature with TDD:
#    a. Write test (red)
#    b. Implement (green)
#    c. Refactor (clean)

# 3. Add Storybook story
# So others can see/test it

# 4. Update docs
# If public API changed

# 5. Create changeset
npm run changeset

# 6. Commit and push
npm run commit
git push origin feat/describe-feature
```

---

### **Workflow 3: Improve Documentation**

```bash
# 1. Create branch
git checkout -b docs/what-you-are-documenting

# 2. Edit markdown files
# VS Code will auto-format on save

# 3. Preview (if docs site)
npm run docs
# See live changes

# 4. Commit and push
git commit -m "docs: improve installation guide"
git push origin docs/what-you-are-documenting
```

---

## 🐛 **Troubleshooting**

### **Problem: "Module not found"**

**Solution:**
```bash
# Install dependencies
npm install

# Build packages
npm run build
```

---

### **Problem: "Git hooks not working"**

**Solution:**
```bash
# Reinstall hooks
rm -rf .husky/_
npm run prepare

# Verify
ls -la .husky/
# Should see: pre-commit, commit-msg, pre-push
```

---

### **Problem: "Tests failing"**

**Solution:**
```bash
# Run with verbose output
npm run test -- --verbose

# Or run specific test
npm run test -- button.test

# Or open UI
npm run test:unit:ui
```

---

### **Problem: "Type errors"**

**Solution:**
```bash
# Check which files have errors
npm run typecheck

# Restart TypeScript server (VS Code)
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

### **Problem: "Build fails"**

**Solution:**
```bash
# Clean and rebuild
npm run clean
npm run build

# Or build specific package
npm run build --workspace=@clarity-chat/primitives
```

---

## 📖 **Learning Resources**

### **Project Documentation**

**Essential reading:**
1. `CONTRIBUTING.md` - Contributing guidelines (this file)
2. `DESIGN_SYSTEM_GUIDE.md` - Design principles
3. `ARCHITECTURE_OVERVIEW.md` - System architecture
4. `README.md` - Project overview

**Component development:**
1. `packages/primitives/README.md` - Primitives guide
2. `packages/react/README.md` - React components guide
3. Browse Storybook stories for examples

**v2.2 specific:**
1. `START_HERE_V2.2.md` - v2.2 overview
2. `V2.2_DESIGN_PRINCIPLES.md` - Design philosophy
3. `TECHNICAL_DEEP_DIVE_V2.2.md` - Implementation details

---

### **External Resources**

**React:**
- [React Docs](https://react.dev) - Official React documentation
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

**Testing:**
- [Vitest](https://vitest.dev) - Fast unit testing
- [React Testing Library](https://testing-library.com/react) - React testing
- [Playwright](https://playwright.dev) - E2E testing

**Styling:**
- [Tailwind CSS](https://tailwindcss.com) - Utility CSS
- [CVA](https://cva.style) - Class variance authority

**Tooling:**
- [Turborepo](https://turbo.build) - Monorepo build system
- [Changesets](https://github.com/changesets/changesets) - Version management

---

## 🎯 **Your First Week**

### **Day 1: Setup & Explore**
- ✅ Complete environment setup
- ✅ Run Storybook, browse components
- ✅ Read CONTRIBUTING.md
- ✅ Join Discord/GitHub Discussions

### **Day 2-3: Small Contribution**
- ✅ Find a "good first issue"
- ✅ Ask questions if unclear
- ✅ Create PR
- ✅ Iterate based on feedback

### **Day 4-5: Deeper Dive**
- ✅ Read design system guide
- ✅ Understand architecture
- ✅ Review test patterns
- ✅ Explore advanced examples

### **Week 2+: Independent Contributor**
- ✅ Take on bigger features
- ✅ Help others in discussions
- ✅ Suggest improvements
- ✅ Become a regular contributor

---

## 💡 **Pro Tips**

### **Tip 1: Use Watch Mode**
```bash
# Tests auto-run as you code
npm run test:watch

# Much faster than manual reruns
```

### **Tip 2: VS Code Shortcuts**
- `Cmd+P` (Ctrl+P) - Quick open file
- `Cmd+Shift+P` - Command palette
- `F5` - Start debugging
- `Cmd+/` - Toggle comment

### **Tip 3: Git Aliases**
```bash
# Add to ~/.gitconfig
[alias]
  co = checkout
  br = branch
  st = status
  cm = commit -m
```

### **Tip 4: Check Examples**
Stuck? Look at existing code:
```bash
# Find similar patterns
grep -r "useChat" packages/
grep -r "forwardRef" packages/primitives/
```

### **Tip 5: Use Commitizen**
```bash
# Interactive commit (guides you through format)
npm run commit
```

---

## ✅ **Checklist: Am I Ready?**

**Environment:**
- [ ] Node.js 18.20.0 installed
- [ ] npm 9.0.0+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install` succeeded)
- [ ] Build succeeded (`npm run build`)

**Editor:**
- [ ] VS Code installed (or your preferred editor)
- [ ] Recommended extensions installed
- [ ] Auto-format on save working
- [ ] ESLint highlighting errors

**Understanding:**
- [ ] Read CONTRIBUTING.md
- [ ] Explored Storybook
- [ ] Ran tests successfully
- [ ] Know how to create a branch

**First Contribution:**
- [ ] Found a "good first issue" or know what to work on
- [ ] Asked questions if unclear
- [ ] Ready to create a branch

**All checked?** → **You're ready to contribute!** 🚀

---

## 🆘 **Need Help?**

**Stuck on setup?**
1. Check troubleshooting section above
2. Search GitHub Issues
3. Ask in GitHub Discussions
4. Join Discord for real-time help

**Common Questions:**
See `❓_FAQ.md` for frequently asked questions.

---

## 🎉 **Welcome to the Team!**

**You're now ready to contribute to Clarity Chat!**

**Remember:**
- Don't be afraid to ask questions
- Start small, grow gradually
- Quality over speed
- Have fun! Coding should be enjoyable ✨

**Your first PR is just the beginning. Welcome aboard!** 🚀

---

**Next:** Pick a "good first issue" on GitHub and start coding!
