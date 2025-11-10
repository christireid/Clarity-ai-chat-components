# Developer Workflows

**Visual workflow diagrams for common development tasks**

---

## 🔄 **Workflow 1: First Time Setup**

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Prerequisites                                       │
├─────────────────────────────────────────────────────────────┤
│ Check Node.js: node -v (should be 18.20.0+)                │
│ Check npm: npm -v (should be 9.0.0+)                       │
│ Check Git: git --version                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Clone Repository                                    │
├─────────────────────────────────────────────────────────────┤
│ git clone [repo-url]                                        │
│ cd Clarity-ai-chat-components                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Automated Setup                                     │
├─────────────────────────────────────────────────────────────┤
│ bash scripts/dev-setup.sh                                   │
│                                                              │
│ This automatically:                                          │
│  ✅ Verifies Node version                                   │
│  ✅ Installs dependencies (npm install)                     │
│  ✅ Sets up git hooks (husky)                               │
│  ✅ Builds packages (npm run build)                         │
│  ✅ Validates setup (npm run validate:quick)                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: VS Code Setup (if using)                           │
├─────────────────────────────────────────────────────────────┤
│ code .                                                       │
│ Install recommended extensions (when prompted)              │
│ Verify auto-format on save works                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Start Developing                                    │
├─────────────────────────────────────────────────────────────┤
│ npm run storybook   (→ http://localhost:6006)              │
│ # Or: npm run docs  (→ http://localhost:5173)              │
└─────────────────────────────────────────────────────────────┘

Total Time: 10-15 minutes
Result: ✅ Ready to contribute!
```

---

## 🔄 **Workflow 2: Daily Development**

```
┌─────────────────────────────────────────────────────────────┐
│ Morning: Pull Latest Changes                                │
├─────────────────────────────────────────────────────────────┤
│ git checkout main                                            │
│ git pull origin main                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Create Feature Branch                                        │
├─────────────────────────────────────────────────────────────┤
│ git checkout -b feat/my-feature                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Start Development Servers                                    │
├─────────────────────────────────────────────────────────────┤
│ Terminal 1: npm run storybook                               │
│ Terminal 2: npm run test:watch                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Make Changes (Automatic Quality)                            │
├─────────────────────────────────────────────────────────────┤
│ Edit code in VS Code:                                       │
│  → Auto-format on save ✨                                   │
│  → ESLint auto-fixes ✨                                     │
│  → Tailwind classes sorted ✨                               │
│  → Tests auto-run (watch mode) ✨                           │
│  → Type errors shown inline ✨                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Verify Quality (Optional but Recommended)                   │
├─────────────────────────────────────────────────────────────┤
│ npm run validate:quick                                       │
│  → Lint check (30s)                                         │
│  → Type check (30s)                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Commit (Interactive)                                         │
├─────────────────────────────────────────────────────────────┤
│ git add .                                                    │
│ npm run commit                                               │
│                                                              │
│ → Guided prompts for conventional commit                    │
│ → Pre-commit hook: Lint + format staged files ✨            │
│ → Commit-msg hook: Validate format ✨                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Push Changes                                                 │
├─────────────────────────────────────────────────────────────┤
│ git push origin feat/my-feature                             │
│                                                              │
│ → Pre-push hook: Type check ✨                              │
│ → Pre-push hook: Run tests ✨                               │
│ → Only quality code reaches remote ✨                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Create Pull Request (GitHub)                                │
├─────────────────────────────────────────────────────────────┤
│ → CI runs automatically (7 jobs) ✨                         │
│ → Quality gates enforced ✨                                 │
│ → Can't merge if checks fail ✨                             │
└─────────────────────────────────────────────────────────────┘

Total Time: Varies, but much faster with automation!
```

---

## 🔄 **Workflow 3: Git Commit Process (Detailed)**

```
┌─────────────────────────────────────────────────────────────┐
│ Developer Makes Changes                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ git add .                                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ git commit -m "feat(button): add loading"                  │
│ # Or: npm run commit (interactive)                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ PRE-COMMIT HOOK (Automatic)                                 │
├─────────────────────────────────────────────────────────────┤
│ Runs: lint-staged                                           │
│                                                              │
│ For staged .ts/.tsx/.js/.jsx files:                         │
│  1. eslint --fix                                            │
│  2. prettier --write                                        │
│                                                              │
│ For staged .json/.md files:                                 │
│  1. prettier --write                                        │
│                                                              │
│ If fixes applied → Files re-staged automatically            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ COMMIT-MSG HOOK (Automatic)                                 │
├─────────────────────────────────────────────────────────────┤
│ Runs: commitlint                                            │
│                                                              │
│ Validates:                                                   │
│  ✅ Format: <type>(<scope>): <subject>                      │
│  ✅ Type is valid (feat, fix, docs, etc.)                   │
│  ✅ Scope is valid (button, primitives, etc.)               │
│  ✅ Subject is sentence-case, no period                     │
│  ✅ Max 100 characters                                      │
│                                                              │
│ If invalid → Commit rejected ❌                              │
│ If valid → Commit succeeds ✅                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Commit Created ✅                                            │
│                                                              │
│ All code is:                                                 │
│  ✅ Formatted (Prettier)                                     │
│  ✅ Linted (ESLint)                                          │
│  ✅ Properly committed (Conventional format)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Workflow 4: Push Process (Detailed)**

```
┌─────────────────────────────────────────────────────────────┐
│ Developer Pushes                                             │
├─────────────────────────────────────────────────────────────┤
│ git push origin feat/my-feature                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ PRE-PUSH HOOK (Automatic)                                   │
├─────────────────────────────────────────────────────────────┤
│ Step 1: Type Check                                          │
│  → npm run typecheck                                        │
│  → If fails: Push rejected ❌                               │
│  → If passes: Continue ✅                                   │
│                                                              │
│ Step 2: Run Tests                                           │
│  → npm run test                                             │
│  → If fails: Push rejected ❌                               │
│  → If passes: Continue ✅                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Push Succeeds ✅                                             │
│                                                              │
│ Code that reaches remote is:                                │
│  ✅ Type-safe (no TypeScript errors)                        │
│  ✅ Tested (all tests pass)                                 │
│  ✅ High quality (linted and formatted)                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ CI/CD Pipeline Runs (GitHub Actions)                        │
├─────────────────────────────────────────────────────────────┤
│ Job 1: Lint Check                                           │
│ Job 2: Type Check                                           │
│ Job 3: Unit Tests (with coverage)                           │
│ Job 4: Build Verification                                   │
│ Job 5: Bundle Size Check                                    │
│ Job 6: Format Check                                         │
│ Job 7: Validation Gate (all must pass)                      │
│                                                              │
│ All pass ✅ → PR can be merged                              │
│ Any fail ❌ → Fix required                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Workflow 5: Fix a Bug**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Reproduce Bug                                            │
├─────────────────────────────────────────────────────────────┤
│ npm run storybook                                            │
│ → Navigate to component                                     │
│ → Reproduce the issue                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Create Branch                                            │
├─────────────────────────────────────────────────────────────┤
│ git checkout -b fix/describe-bug                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Write Failing Test (TDD)                                 │
├─────────────────────────────────────────────────────────────┤
│ Edit: component.test.tsx                                    │
│ Add test that reproduces bug                                │
│ Run: npm run test:watch -- component                        │
│ → Test should fail ❌ (confirms bug exists)                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Fix the Bug                                              │
├─────────────────────────────────────────────────────────────┤
│ Edit: component.tsx                                         │
│ Fix the issue                                               │
│ → Test should now pass ✅                                   │
│ → Storybook should show fix                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Verify No Regressions                                    │
├─────────────────────────────────────────────────────────────┤
│ npm run test            (all tests pass)                    │
│ npm run build           (build succeeds)                    │
│ npm run validate:quick  (lint + typecheck)                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Commit & Push                                            │
├─────────────────────────────────────────────────────────────┤
│ npm run commit                                               │
│ → Select: fix                                               │
│ → Scope: component-name                                     │
│ → Subject: describe the fix                                 │
│                                                              │
│ git push origin fix/describe-bug                            │
│ → Pre-push validates ✅                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Create PR                                                │
├─────────────────────────────────────────────────────────────┤
│ → CI runs 7 checks                                          │
│ → All pass ✅                                               │
│ → Ready for review                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Workflow 6: Add a New Component**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Create Branch                                            │
├─────────────────────────────────────────────────────────────┤
│ git checkout -b feat/add-component-name                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Create Component File                                    │
├─────────────────────────────────────────────────────────────┤
│ packages/primitives/src/components/my-component.tsx         │
│                                                              │
│ In VS Code: Type 'rfc' + Tab                                │
│ → Snippet creates component template                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Create Test File                                         │
├─────────────────────────────────────────────────────────────┤
│ packages/primitives/src/components/my-component.test.tsx    │
│                                                              │
│ In VS Code: Type 'vtest' + Tab                              │
│ → Snippet creates test template                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Export Component                                         │
├─────────────────────────────────────────────────────────────┤
│ Edit: packages/primitives/src/index.ts                      │
│ Add: export { MyComponent } from './components/my-component'│
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Create Storybook Story                                   │
├─────────────────────────────────────────────────────────────┤
│ apps/storybook/stories/MyComponent.stories.tsx              │
│                                                              │
│ In VS Code: Type 'story' + Tab                              │
│ → Snippet creates story template                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Develop with Live Preview                                │
├─────────────────────────────────────────────────────────────┤
│ Terminal 1: npm run storybook                               │
│ Terminal 2: npm run test:watch -- my-component              │
│                                                              │
│ → Edit code                                                 │
│ → See changes immediately in Storybook                      │
│ → Tests auto-run                                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Ensure Quality                                           │
├─────────────────────────────────────────────────────────────┤
│ ✅ Test coverage >80%                                       │
│ ✅ No TypeScript errors                                     │
│ ✅ No linting errors                                        │
│ ✅ Accessibility tested                                     │
│ ✅ Dark mode tested                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Create Changeset (if public API change)                 │
├─────────────────────────────────────────────────────────────┤
│ npm run changeset                                            │
│ → Select affected packages                                  │
│ → Choose version bump (minor for new component)             │
│ → Write summary                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Commit, Push, PR                                         │
├─────────────────────────────────────────────────────────────┤
│ npm run commit                                               │
│ git push origin feat/add-component-name                     │
│ → Create PR on GitHub                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Workflow 7: Debugging**

```
┌─────────────────────────────────────────────────────────────┐
│ Issue: Component not working correctly                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Option 1: Debug in Browser (Storybook)                     │
├─────────────────────────────────────────────────────────────┤
│ 1. Open component.tsx in VS Code                           │
│ 2. Set breakpoint (click left of line number)              │
│ 3. Press F5 → Select "Debug: Chrome (Storybook)"           │
│ 4. Interact with component in browser                       │
│ 5. Debugger pauses at breakpoint                            │
│ 6. Inspect variables, step through code                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Option 2: Debug Tests                                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Open test file in VS Code                               │
│ 2. Set breakpoint in test                                   │
│ 3. Press F5 → Select "Debug: Vitest Current File"          │
│ 4. Debugger pauses at breakpoint                            │
│ 5. Inspect test execution                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Option 3: Debug with Console                                │
├─────────────────────────────────────────────────────────────┤
│ Add console.log in component                                │
│ npm run storybook                                            │
│ → Open browser console                                      │
│ → See logged output                                         │
│                                                              │
│ (Remove console.log before committing)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Workflow 8: CI/CD Pipeline (GitHub Actions)**

```
┌─────────────────────────────────────────────────────────────┐
│ Trigger: Push to branch or PR created                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions: quality-checks.yml                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌───────────────────────────────────────┐
        │ Jobs Run in Parallel:                 │
        └───────────────────────────────────────┘
                          ↓
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Job 1:   │ Job 2:   │ Job 3:   │ Job 4:   │ Job 5:   │ Job 6:   │
│ Lint     │ TypeChk  │ Tests    │ Build    │ Size     │ Format   │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ ESLint   │ tsc      │ Vitest   │ Build    │ size-    │ Prettier │
│ check    │ check    │ run      │ all pkgs │ limit    │ check    │
│          │          │          │          │          │          │
│ ~2 min   │ ~2 min   │ ~3 min   │ ~3 min   │ ~1 min   │ ~1 min   │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Job 7: Validation Gate                                      │
├─────────────────────────────────────────────────────────────┤
│ Checks all jobs succeeded                                   │
│                                                              │
│ All pass ✅ → PR can merge                                  │
│ Any fail ❌ → Blocking, must fix                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Workflow 9: Release Process**

```
┌─────────────────────────────────────────────────────────────┐
│ PRs with Changesets Merge to Main                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Changesets Accumulate                                        │
├─────────────────────────────────────────────────────────────┤
│ .changeset/                                                  │
│  ├── feature-1.md                                           │
│  ├── feature-2.md                                           │
│  └── bugfix-1.md                                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Maintainer: Create Release                                  │
├─────────────────────────────────────────────────────────────┤
│ npm run version-packages                                     │
│                                                              │
│ → Updates package.json versions                             │
│ → Updates CHANGELOG.md                                      │
│ → Commits changes                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Build & Publish                                             │
├─────────────────────────────────────────────────────────────┤
│ npm run release                                              │
│                                                              │
│ → Builds all packages                                       │
│ → Publishes to npm                                          │
│ → Creates GitHub release                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Released! 🎉                                                │
│                                                              │
│ Users can now: npm install @clarity-chat/react@latest       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Decision Trees**

### **"Should I run full validate or quick validate?"**

```
Do you have time?
  ├─ Yes (5+ min) → npm run validate (comprehensive)
  └─ No (<2 min)  → npm run validate:quick (lint + typecheck)

Before pushing?
  → Always run npm run validate:quick minimum
  → Pre-push hook will catch test issues anyway

Before PR?
  → Always run npm run validate (full)
  → CI will run same checks
```

### **"Should I use npm run commit or manual commit?"**

```
First time contributing?
  → npm run commit (interactive guide)

Experienced with Conventional Commits?
  → git commit -m "type(scope): subject" (faster)

Not sure about format?
  → npm run commit (safe)
```

### **"Which test command should I use?"**

```
Developing a feature?
  → npm run test:watch (auto-runs as you code)

Quick check?
  → npm run test (one-time run)

Debugging a test?
  → npm run test:unit:ui (visual debugger)

E2E testing?
  → npm run test:e2e:ui (Playwright UI)
```

---

## 🎨 **Visual Tool Flow**

### **Code Quality Flow**

```
Write Code → Save File → Auto-format → Auto-fix
                              ↓
                         Commit
                              ↓
                    Pre-commit Hook
                         ↓    ↓
                    Lint    Format
                         ↓
                  Commit-msg Hook
                         ↓
                   Validate Format
                         ↓
                      Committed
                         ↓
                        Push
                         ↓
                   Pre-push Hook
                     ↓       ↓
                TypeCheck  Tests
                         ↓
                    Remote CI
                         ↓
                    7 Job Checks
                         ↓
                    PR Ready ✅
```

---

## 📊 **Time Estimates**

| Task | Time | Automation |
|------|------|------------|
| First setup | 10 min | Script available |
| Create branch | 30 sec | Manual |
| Make changes | Varies | Auto-format/lint |
| Write tests | 5-15 min | Snippets help |
| Run tests | 1-3 min | Auto in watch mode |
| Commit | 1 min | Interactive helper |
| Pre-commit | 10-30 sec | Automatic |
| Push | 30 sec | Manual |
| Pre-push | 1-2 min | Automatic |
| CI pipeline | 5-8 min | Automatic |

**Total typical feature:** 30-60 min (mostly coding time)

---

## ✅ **Quality Gates Summary**

```
Level 1: IDE (Real-time)
  ✅ TypeScript errors shown inline
  ✅ ESLint warnings shown inline
  ✅ Auto-format on save

Level 2: Pre-Commit (On commit)
  ✅ ESLint --fix on staged files
  ✅ Prettier --write on staged files
  ✅ Commitlint validates message

Level 3: Pre-Push (On push)
  ✅ TypeScript compilation check
  ✅ All tests must pass

Level 4: CI (On PR)
  ✅ 7 automated checks
  ✅ Must all pass to merge

Result: Multi-layer quality enforcement 🛡️
```

---

**Use these workflows for efficient, high-quality development!** ✨
