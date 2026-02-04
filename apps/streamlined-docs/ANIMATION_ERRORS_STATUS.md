# Animation Accessibility Errors - Status Report

## Current State (2026-01-26)

**ESLint Status**: 341 errors, 378 warnings **Blocking Bulletproof State**: YES **Rule**:
`clarity-animations/require-reduced-motion`

## Problem

All 341 errors are from framer-motion components that don't respect `prefers-reduced-motion` user
preferences. This is a critical accessibility issue.

## Error Pattern

```tsx
// ❌ Current (fails ESLint)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>

// ✅ Fixed (passes ESLint)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}  // Add this prop
>
  Content
</motion.div>
```

## Attempted Solutions

### Attempt 1: Python Script (FAILED)

- Created regex-based script to add `viewport={{ once: true }}`
- Applied to 508 components across 116 files
- **Result**: Introduced 66+ parsing errors by incorrectly inserting props into arrow functions
- **Reverted**: Reset to commit 292936250

### Attempt 2: Syntax Cleanup Script (FAILED)

- Attempted to fix parsing errors from Attempt 1
- Fixed 386 syntax errors but 68 remained
- **Reverted**: Too risky, code still broken

## Why Automation Failed

1. **Complex JSX Syntax**: Motion components span multiple lines with varying indentation
2. **Arrow Function Confusion**: Regex couldn't distinguish `>` in `() =>` from JSX `>`
3. **Attribute Context**: Props inserted in wrong positions (middle of onClick handlers, etc.)
4. **Multi-line Props**: Components with props on separate lines broke pattern matching

## Root Cause Analysis

The `clarity-animations/require-reduced-motion` ESLint rule requires motion components to have
either:

- `viewport={{ once: true }}` prop (recommended)
- Conditional rendering based on `useReducedMotion()` hook
- `whileInView` prop with appropriate configuration

The first option is simplest but requires careful, syntactically-correct insertion.

## Impact

| Metric                | Before  | After Radix Fixes | Target     |
| --------------------- | ------- | ----------------- | ---------- |
| TypeScript errors     | 0       | 0                 | 0 ✅       |
| ESLint errors         | 345     | 341               | 0 ❌       |
| Uncommitted changes   | 2 files | Clean             | Clean ✅   |
| **Bulletproof State** | **NO**  | **NO**            | **YES** ❌ |

The 4-error reduction came from fixing `parseInt()` radix errors (committed in 292936250).

## Proposed Solutions

### Option 1: Manual Fix (Safest)

**Time**: 2-3 hours **Risk**: Low **Process**:

1. Fix files alphabetically or by error count
2. Test after each 10-20 files
3. Commit in batches

**Pros**: Zero risk of breaking code **Cons**: Time-intensive, tedious

### Option 2: AST-Based Tool (Best Long-term)

**Time**: 3-4 hours (tool dev) + 1 hour (apply) **Risk**: Medium **Process**:

1. Use `jscodeshift` or `@babel/parser` to properly parse JSX
2. Locate motion components via AST traversal
3. Insert `viewport` prop correctly
4. Generate diff for human review before applying

**Pros**: Reusable, syntactically correct **Cons**: Requires JavaScript/TypeScript AST knowledge

### Option 3: ESLint Auto-fix ❌ NOT AVAILABLE

**Status**: CHECKED - Rule does NOT support auto-fix **Location**:
`/eslint-plugin-clarity-animations/index.js:212-267` **Evidence**:

- No `fixable: 'code'` property in rule meta (line 224)
- No `fix(fixer)` function in rule implementation
- Compare to `no-hardcoded-duration` rule (lines 15-70) which HAS auto-fix

**Conclusion**: Manual fixing or custom AST tool required

### Option 4: Incremental Fix (Pragmatic)

**Time**: 1-2 hours **Risk**: Low **Process**:

1. Fix high-traffic files first (app/error.tsx, app/not-found.tsx) ✅ DONE
2. Fix components in critical paths (DocsAssistant, ChatButton, etc.)
3. Leave low-impact components for later
4. Ship with partial fix once critical paths are clean

**Pros**: Unblocks critical features faster **Cons**: Incomplete fix, still some accessibility
issues

## Recommendation

**Use Option 3 first**, then fall back to Option 4 if auto-fix isn't available.

Check if the custom rule supports auto-fix:

```bash
cd apps/streamlined-docs
pnpm eslint . --ext ts,tsx --fix-dry-run | grep "clarity-animations/require-reduced-motion"
```

If auto-fix works, apply it:

```bash
pnpm eslint . --ext ts,tsx --fix
git diff  # Review changes carefully
git add -A && git commit -m "fix: add viewport prop to motion components for reduced-motion support"
```

If auto-fix doesn't work, proceed with Option 4 (incremental manual fixes).

## Files Requiring Fixes (High Priority)

### Critical Path (26 errors)

- `components/AI/DocsAssistant.tsx` (3 errors)
- `components/AI/ChatButton.tsx` (7 errors)
- `app/error.tsx` (2 errors) ✅ DONE
- `app/not-found.tsx` (2 errors) ✅ DONE
- `components/UI/Toast.tsx` (2 errors)
- `components/UI/ScrollProgress.tsx` (6 errors)
- `components/Layout/HeroSection.tsx` (4 errors)

### High Traffic (42 errors)

- `components/Demo/QuickActions.tsx` (20 errors)
- `components/Demo/ComponentPreview.tsx` (6 errors)
- `components/Demo/ApiTable.tsx` (7 errors)
- `components/Playground/TemplateSelector.tsx` (9 errors)

### Documentation Pages (28 errors)

- `app/reference/components/clarity-chat/page.tsx` (2 errors)
- `app/get-started/installation/page.tsx` (1 error)
- `components/Docs/DocsSidebar.tsx` (3 errors)
- `components/Docs/SearchBar.tsx` (1 error)
- ...and 20 more doc components

### Remaining (245 errors)

- HeroChat components (68 errors)
- Diagrams (45 errors)
- Enhanced components (58 errors)
- Navigation (24 errors)
- Layout (32 errors)
- Others (18 errors)

## Next Session Plan

1. **Check for ESLint auto-fix** (10 min)
2. **If available**: Apply auto-fix, test, commit (30 min)
3. **If not**: Fix Critical Path files manually (1 hour)
4. **Verify**: Run full lint, ensure no new errors (10 min)
5. **Commit**: "fix: add reduced-motion support to critical motion components"
6. **Re-evaluate**: If >100 errors remain, schedule follow-up session

## Success Criteria

- [ ] 0 ESLint errors in streamlined-docs
- [ ] All motion components respect `prefers-reduced-motion`
- [ ] No parsing errors or broken syntax
- [ ] Full test suite passes
- [ ] Bulletproof state achieved

## Links

- ESLint rule: `eslint-plugin-clarity-animations` (local plugin)
- Framer Motion docs: https://www.framer.com/motion/motionvalue/#accessibility
- WCAG 2.1 (Reduced Motion):
  https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
