# Phase 2 & 3: Complete shadcn/ui Migration

This document outlines how to complete the migration from custom components to shadcn/ui.

## Overview

**Current State:** Phase 1 complete (installation)  
**Remaining Work:** Phases 2 (migration) and 3 (removal)  
**Estimated Effort:** 4-5 weeks  
**Risk Level:** Medium (breaking changes required)

---

## Phase 2: Migration (3-4 weeks)

### Goal
Migrate all consuming code from custom components to shadcn/ui components.

### Tasks

#### 2.1: Visual Validation (Week 1, Day 1-2)

**Priority:** CRITICAL - Must be done first

**Tasks:**
1. Create test page in an example app
2. Render all 7 shadcn components
3. Verify visual appearance
4. Test dark mode
5. Test hover/focus states
6. Verify accessibility with screen reader
7. Measure bundle size

**Example Test Page:**
```tsx
// apps/examples/shadcn-visual-test/src/App.tsx
import {
  ShadcnButton,
  ShadcnDialog,
  ShadcnDropdownMenu,
  ShadcnTooltipProvider,
  ShadcnTooltip,
  ShadcnCheckbox,
  ShadcnPopover,
  ShadcnDrawer
} from '@clarity-chat/primitives'

export function VisualTest() {
  return (
    <div className="p-8 space-y-8">
      <h1>shadcn/ui Visual Validation</h1>
      
      {/* Test each component */}
      <section>
        <h2>Buttons</h2>
        <div className="flex gap-2">
          <ShadcnButton variant="default">Default</ShadcnButton>
          <ShadcnButton variant="secondary">Secondary</ShadcnButton>
          <ShadcnButton variant="destructive">Destructive</ShadcnButton>
          <ShadcnButton variant="outline">Outline</ShadcnButton>
          <ShadcnButton variant="ghost">Ghost</ShadcnButton>
        </div>
      </section>
      
      {/* Add tests for other components */}
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] All components render correctly
- [ ] Colors match design system
- [ ] Dark mode works
- [ ] No console errors
- [ ] Accessibility audit passes
- [ ] Bundle size acceptable (<100KB increase)

---

#### 2.2: Create Migration Tooling (Week 1, Day 3-5)

**Codemod for Automated Migration:**

```typescript
// tools/codemods/migrate-to-shadcn.ts
import { API, FileInfo } from 'jscodeshift'

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift
  const root = j(file.source)

  // Replace import declarations
  root
    .find(j.ImportDeclaration, {
      source: { value: '@clarity-chat/primitives' }
    })
    .forEach(path => {
      path.value.specifiers?.forEach(spec => {
        if (spec.type === 'ImportSpecifier') {
          const componentName = spec.imported.name
          
          // Map custom to shadcn
          const shadcnMap = {
            'Button': 'ShadcnButton',
            'Dialog': 'ShadcnDialog',
            'DialogTrigger': 'ShadcnDialogTrigger',
            // ... etc
          }
          
          if (shadcnMap[componentName]) {
            spec.imported.name = shadcnMap[componentName]
            // Optionally keep local name
            if (!spec.local || spec.local.name === componentName) {
              spec.local = j.identifier(componentName)
            }
          }
        }
      })
    })

  return root.toSource()
}
```

**ESLint Rule:**

```typescript
// eslint-rules/no-deprecated-primitives.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow deprecated custom UI components',
      category: 'Best Practices',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@clarity-chat/primitives') {
          node.specifiers.forEach(spec => {
            const deprecated = [
              'Button', 'Dialog', 'Checkbox', 
              'Dropdown', 'Popover', 'Tooltip', 'Drawer'
            ]
            
            if (deprecated.includes(spec.imported.name)) {
              context.report({
                node: spec,
                message: `Use Shadcn${spec.imported.name} instead of ${spec.imported.name}`,
                fix(fixer) {
                  return fixer.replaceText(
                    spec.imported,
                    `Shadcn${spec.imported.name}`
                  )
                }
              })
            }
          })
        }
      }
    }
  }
}
```

**Bundle Analyzer:**

```bash
# Add to package.json
"scripts": {
  "analyze": "npx vite-bundle-visualizer"
}
```

---

#### 2.3: Migrate @clarity-chat/react (Week 2)

**Strategy:** Migrate one component at a time

**Priority Order:**
1. High-usage components first (Button, Dialog)
2. Complex components next (DropdownMenu)
3. Simple components last (Checkbox, Tooltip)

**Example Migration:**

```typescript
// packages/react/src/components/chat-window.tsx

// BEFORE
import { Button, Dialog } from '@clarity-chat/primitives'

// AFTER
import { 
  ShadcnButton as Button, 
  ShadcnDialog as Dialog 
} from '@clarity-chat/primitives'

// Or import with original names:
import { Button, Dialog } from './ui-components'

// ui-components.ts
export { 
  ShadcnButton as Button,
  ShadcnDialog as Dialog,
  // ... etc
} from '@clarity-chat/primitives'
```

**Tasks:**
- [ ] Audit all imports from @clarity-chat/primitives
- [ ] Migrate Button usage
- [ ] Migrate Dialog usage
- [ ] Migrate DropdownMenu usage
- [ ] Migrate Popover usage
- [ ] Migrate Tooltip usage (remember TooltipProvider!)
- [ ] Migrate Checkbox usage
- [ ] Migrate Drawer usage
- [ ] Run all tests
- [ ] Visual regression test

---

#### 2.4: Migrate Example Apps (Week 3)

**Strategy:** Start with simple, move to complex

**Priority Order:**
1. `minimal-chat` (simplest)
2. `basic-chat`
3. `streaming-chat`
4. `customized-chat`
5. `complex-chat`
6. ... (18 more apps)

**Per-App Checklist:**
- [ ] Run codemod
- [ ] Fix any manual issues
- [ ] Add TooltipProvider if using tooltips
- [ ] Verify CSS variables exist
- [ ] Test in development
- [ ] Visual check
- [ ] Update README if needed

---

#### 2.5: Update Storybook (Week 4)

**Tasks:**
- [ ] Create new stories for shadcn components
- [ ] Add controls for all props
- [ ] Add dark mode toggle
- [ ] Add accessibility tab
- [ ] Document differences from custom components
- [ ] Mark old stories as deprecated

**Example Story:**

```typescript
// apps/storybook/stories/shadcn/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ShadcnButton } from '@clarity-chat/primitives'

const meta: Meta<typeof ShadcnButton> = {
  title: 'shadcn/ui/Button',
  component: ShadcnButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon']
    }
  }
}

export default meta
type Story = StoryObj<typeof ShadcnButton>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <ShadcnButton variant="default">Default</ShadcnButton>
      <ShadcnButton variant="secondary">Secondary</ShadcnButton>
      <ShadcnButton variant="destructive">Destructive</ShadcnButton>
      <ShadcnButton variant="outline">Outline</ShadcnButton>
      <ShadcnButton variant="ghost">Ghost</ShadcnButton>
      <ShadcnButton variant="link">Link</ShadcnButton>
    </div>
  )
}
```

---

### Phase 2 Acceptance Criteria

- [ ] All 7 shadcn components visually validated
- [ ] @clarity-chat/react fully migrated
- [ ] All 23 example apps migrated
- [ ] Storybook updated with new stories
- [ ] Codemod tool created and tested
- [ ] ESLint rule added and enforced
- [ ] Bundle size measured and acceptable
- [ ] All tests passing (312+ should still pass)
- [ ] No usage of custom components in new code
- [ ] Documentation updated

---

## Phase 3: Removal (1 week)

### Goal
Remove custom components and ship v2.0.0

### Tasks

#### 3.1: Verify Zero Usage (Day 1)

**Search for remaining usage:**

```bash
# Search entire codebase
rg "from '@clarity-chat/primitives'" --type ts --type tsx | \
  rg -v "Shadcn" | \
  rg "Button|Dialog|Dropdown|Popover|Tooltip|Checkbox|Drawer"

# Should return zero results
```

**If results found:**
- Document locations
- Migrate any remaining code
- Re-verify

---

#### 3.2: Remove Custom Component Files (Day 2)

```bash
# Backup first!
git checkout -b remove-custom-components

# Remove files
rm packages/primitives/src/components/button.tsx
rm packages/primitives/src/components/dialog.tsx
rm packages/primitives/src/components/dropdown-menu.tsx
rm packages/primitives/src/components/popover.tsx
rm packages/primitives/src/components/tooltip.tsx
rm packages/primitives/src/components/checkbox.tsx
rm packages/primitives/src/components/drawer.tsx

# Remove tests
rm packages/primitives/src/components/__tests__/button.test.tsx
# ... etc
```

---

#### 3.3: Update Exports (Day 2)

```typescript
// packages/primitives/src/index.ts

// REMOVE Legacy exports:
// export { Button } from './components/button'
// export { Dialog } from './components/dialog'
// ... etc

// UPDATE shadcn exports to default names:
export { 
  Button,
  buttonVariants 
} from './components/ui/button'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog'

// ... etc (remove Shadcn prefix)
```

---

#### 3.4: Update Documentation (Day 3)

**Files to update:**
- Remove all "Shadcn" prefix from docs
- Update MIGRATION_GUIDE_SHADCN.md (archive it)
- Update README with v2.0.0 info
- Create CHANGELOG entry
- Update all code examples

---

#### 3.5: Version Bump & Release (Day 4-5)

```bash
# Update version
npm version major  # 1.x.x -> 2.0.0

# Update package.json
{
  "version": "2.0.0",
  "description": "Built with official shadcn/ui components"
}
```

**CHANGELOG.md:**

```markdown
# v2.0.0 - BREAKING CHANGES

## 💥 Breaking Changes

### Removed Custom UI Components

All custom UI components have been removed and replaced with official shadcn/ui components:

- ❌ Removed: Custom `Button`, `Dialog`, `Dropdown`, `Popover`, `Tooltip`, `Checkbox`, `Drawer`
- ✅ Added: Official shadcn/ui components (same names)

### Migration Guide

**Before (v1.x):**
```typescript
import { Button, Dialog } from '@clarity-chat/primitives'
// or
import { ShadcnButton, ShadcnDialog } from '@clarity-chat/primitives'
```

**After (v2.0):**
```typescript
import { Button, Dialog } from '@clarity-chat/primitives'
// Now uses shadcn/ui components
```

### Setup Requirements

⚠️ **IMPORTANT:** v2.0 requires additional setup:

1. CSS variables must be defined (see SHADCN_SETUP_REQUIRED.md)
2. Tailwind config must include color extensions
3. `TooltipProvider` must wrap your app if using tooltips

See: [Setup Guide](./SHADCN_SETUP_REQUIRED.md)

### Feature Changes

**Lost Features:**
- Button ripple effect (custom feature)
- Button loading state with built-in spinner
- Custom animations with Framer Motion

**Gained Features:**
- Better accessibility (WCAG 2.1 AA compliant)
- Proper keyboard navigation
- Better focus management
- Industry-standard component APIs

**Migration:**
For ripple/loading features, wrap the Button:
```typescript
export function LoadingButton({ loading, children, ...props }) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
```

## 🎉 What's New

- Official shadcn/ui components
- Better accessibility
- Radix UI primitives
- Improved keyboard navigation
- Better TypeScript types
- Comprehensive setup documentation

## 📦 Upgrading

```bash
npm install @clarity-chat/primitives@2.0.0
```

Then follow the migration guide: [MIGRATION_GUIDE_SHADCN.md](./MIGRATION_GUIDE_SHADCN.md)

## ⚠️ Breaking Change Checklist

- [ ] Update imports (remove Shadcn prefix if used)
- [ ] Add CSS variables to global CSS
- [ ] Update Tailwind config
- [ ] Wrap app in TooltipProvider if using tooltips
- [ ] Replace custom features (ripple, loading states)
- [ ] Test visually in browser
- [ ] Run accessibility audit

## 🐛 Known Issues

None at release. Report issues at: [GitHub Issues](...)

## 📚 Documentation

- [Setup Guide](./SHADCN_SETUP_REQUIRED.md)
- [Migration Guide](./MIGRATION_GUIDE_SHADCN.md)
- [Component Documentation](./packages/primitives/src/components/ui/README.md)
```

---

#### 3.6: Testing & Release (Day 5)

```bash
# Run full test suite
pnpm test

# Run linter
pnpm lint

# Build all packages
pnpm build

# Test in example app
cd apps/examples/minimal-chat
pnpm dev
# Visual test

# Publish (if ready)
pnpm publish --access restricted
```

---

### Phase 3 Acceptance Criteria

- [ ] All custom component files deleted
- [ ] Exports updated (no Shadcn prefix)
- [ ] Tests updated and passing
- [ ] Documentation updated
- [ ] CHANGELOG created
- [ ] Version bumped to 2.0.0
- [ ] Visual testing complete
- [ ] Breaking changes documented
- [ ] Migration guide published
- [ ] Released to npm/GitHub packages

---

## Timeline Summary

### Week 1: Validation & Tooling
- Days 1-2: Visual validation
- Days 3-5: Create codemod, ESLint rule, bundle analyzer

### Week 2: Migrate React Package
- Days 1-5: Migrate @clarity-chat/react

### Week 3: Migrate Example Apps
- Days 1-5: Migrate all 23 example apps

### Week 4: Storybook & Finalization
- Days 1-3: Update Storybook
- Days 4-5: Final validation

### Week 5: Removal & Release
- Days 1-2: Remove custom components
- Day 3: Update documentation
- Days 4-5: Testing & release

**Total: 5 weeks**

---

## Risk Mitigation

### High Risk: Breaking Changes

**Mitigation:**
- Clear communication to users
- Comprehensive migration guide
- Gradual rollout (v1.x supported for 6 months)
- Automated migration tools

### Medium Risk: Visual Regressions

**Mitigation:**
- Visual regression testing
- Manual QA
- Storybook visual testing
- User acceptance testing

### Medium Risk: Bundle Size

**Mitigation:**
- Measure before/after
- Optimize imports
- Use tree-shaking
- Document size impact

### Low Risk: Accessibility Issues

**Mitigation:**
- Use official components (already accessible)
- Run automated audits
- Manual screen reader testing
- Follow WCAG guidelines

---

## Success Metrics

### Code Metrics
- [ ] Zero custom component files
- [ ] 100% migration to shadcn
- [ ] All tests passing
- [ ] Bundle size increase <10%

### Quality Metrics
- [ ] Accessibility audit score >90
- [ ] Zero critical bugs
- [ ] Visual consistency maintained
- [ ] TypeScript errors: 0

### User Metrics
- [ ] Migration guide completion rate >80%
- [ ] Issue reports <5
- [ ] User satisfaction survey >4/5

---

## Rollback Plan

If critical issues found after v2.0.0 release:

1. **Immediate:** Revert npm package to v1.x
2. **Short-term:** Fix issues in v2.0.1
3. **Medium-term:** If unfixable, consider v3.0.0 with different approach

**Rollback Trigger:** >10 critical bugs OR >50% user migration failures

---

## Communication Plan

### Pre-Release
- [ ] Blog post announcing v2.0.0
- [ ] Migration guide published
- [ ] Video tutorial created
- [ ] Discord announcement
- [ ] Email to known users

### Release
- [ ] GitHub release notes
- [ ] npm package published
- [ ] Documentation site updated
- [ ] Social media announcement

### Post-Release
- [ ] Monitor issue tracker
- [ ] Respond to questions
- [ ] Update docs based on feedback
- [ ] Create v2.0.1 if needed

---

## Next Steps

**If Proceeding with Phases 2 & 3:**

1. Get stakeholder approval
2. Allocate 5 weeks of developer time
3. Create tracking issue for Phase 2
4. Create tracking issue for Phase 3
5. Start with visual validation (Week 1, Day 1)

**If Not Proceeding:**

1. Accept Phase 1 as complete
2. Document as "installation phase only"
3. Plan future migration separately
4. Keep both systems indefinitely

**Questions?**
See [SHADCN_EXECUTIVE_SUMMARY.md](./SHADCN_EXECUTIVE_SUMMARY.md) for decision tree.
