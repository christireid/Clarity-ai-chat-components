# Frontend Modernization Checklist 2025
## React 19+ / Next.js 15-16 / Storybook 8.x / TypeScript 5.6+

### Phase 1: Research & Knowledge Baseline ✅

#### React 19.x+ Features
- [x] Server Components (async components)
- [x] Server Actions (form actions, useFormState, useFormStatus)
- [x] Suspense improvements (streaming, loading states)
- [x] use() hook for promises and context
- [x] Transitions API (useTransition, startTransition)
- [x] Modern event handling (onClick, onSubmit improvements)
- [x] Automatic batching improvements
- [x] ref as a prop (no forwardRef needed)
- [x] Context as a provider (no separate Provider component)

#### Next.js 15-16 Features
- [x] App Router (stable)
- [x] Server Actions (stable)
- [x] Partial Prerendering (PPR)
- [x] Improved caching strategies
- [x] Turbopack (stable for dev)
- [x] Typed routes (TypeScript route types)
- [x] Edge runtime improvements
- [x] Middleware enhancements
- [x] Image optimization improvements
- [x] Font optimization

#### Storybook 8.x Features
- [x] CSF3 format (Component Story Format 3)
- [x] Interaction testing (play functions)
- [x] Accessibility testing (a11y addon)
- [x] Vitest integration
- [x] Playwright integration
- [x] Modern config (ESM-first)
- [x] Improved performance
- [x] Better TypeScript support

#### TypeScript 5.6+ Features
- [x] Strict mode enforcement
- [x] Better inference
- [x] Improved type narrowing
- [x] Template literal types
- [x] satisfies operator
- [x] Better JSX support

#### 2025 Frontend Best Practices
- [x] Colocation (components, styles, tests together)
- [x] Semantic HTML
- [x] Accessibility (WCAG 2.1 AA)
- [x] Performance optimization (code splitting, lazy loading)
- [x] Modern state management patterns
- [x] Type-safe APIs
- [x] Test automation (unit + E2E)
- [x] Performance instrumentation

---

### Phase 2: Repository Understanding

#### Current State Analysis
- [x] Monorepo: pnpm workspaces
- [x] Build tool: Turbo
- [x] Current React: 18.2.0 → Target: 19.x
- [x] Current Next.js: 14.2.0 → Target: 15-16
- [x] Current Storybook: 7.6.x → Target: 8.x
- [x] Current TypeScript: 5.3.3 → Target: 5.6+

#### Package Inventory
- [ ] `@clarity-chat/react` - Main component library
- [ ] `@clarity-chat/docs-site` - Next.js docs site
- [ ] `@clarity-chat/storybook` - Storybook app
- [ ] `@clarity-chat/marketing-site` - Next.js marketing site
- [ ] `@clarity-chat/primitives` - Primitive components
- [ ] `@clarity-chat/dev-tools` - Dev tools package
- [ ] `@clarity-chat/error-handling` - Error handling utilities
- [ ] `@clarity-chat/cli` - CLI tool
- [ ] Other packages (types, memory, licensing, etc.)

#### Legacy Patterns Detected
- [ ] React 18 patterns (needs React 19 migration)
- [ ] Next.js 14 App Router (needs Next.js 15-16 features)
- [ ] Storybook 7 config (needs Storybook 8 migration)
- [ ] TypeScript config inconsistencies
- [ ] ESLint config already references React 19 (needs actual upgrade)

---

### Phase 3: Package-by-Package Modernization

#### Package: @clarity-chat/react
- [ ] Phase 3.1: Inventory & Plan
- [ ] Phase 3.2: Dependencies & Config
  - [ ] Upgrade React to 19.x
  - [ ] Upgrade React-DOM to 19.x
  - [ ] Update @types/react to 19.x
  - [ ] Update TypeScript config for React 19
  - [ ] Update ESLint config
- [ ] Phase 3.3: File-by-File Modernization
  - [ ] Convert class components → function components
  - [ ] Apply React 19 idioms (use(), Server Components where applicable)
  - [ ] Remove forwardRef where ref can be prop
  - [ ] Modernize hooks patterns
  - [ ] Strengthen type safety
  - [ ] Remove unused code
- [ ] Phase 3.4: Storybook & Tests
  - [ ] Migrate stories to CSF3
  - [ ] Add interaction tests
  - [ ] Add accessibility tests
  - [ ] Ensure Vitest coverage
- [ ] Phase 3.5: Validation & Commit

#### Package: @clarity-chat/docs-site
- [ ] Phase 3.1: Inventory & Plan
- [ ] Phase 3.2: Dependencies & Config
  - [ ] Upgrade Next.js to 15-16
  - [ ] Upgrade React to 19.x
  - [ ] Update TypeScript config
  - [ ] Enable App Router features
  - [ ] Configure server actions
- [ ] Phase 3.3: File-by-File Modernization
  - [ ] Migrate to Next.js 15-16 patterns
  - [ ] Implement Server Components
  - [ ] Use Server Actions
  - [ ] Optimize caching
  - [ ] Modernize routing
- [ ] Phase 3.4: Storybook & Tests
  - [ ] Add Playwright E2E tests
  - [ ] Test Server Components
- [ ] Phase 3.5: Validation & Commit

#### Package: @clarity-chat/storybook
- [ ] Phase 3.1: Inventory & Plan
- [ ] Phase 3.2: Dependencies & Config
  - [ ] Upgrade Storybook to 8.x
  - [ ] Upgrade React to 19.x
  - [ ] Update Storybook config (ESM-first)
  - [ ] Migrate to CSF3
- [ ] Phase 3.3: File-by-File Modernization
  - [ ] Convert all stories to CSF3
  - [ ] Add play functions for interaction tests
  - [ ] Add accessibility tests
- [ ] Phase 3.4: Storybook & Tests
  - [ ] Verify all stories work
  - [ ] Add interaction tests
  - [ ] Add accessibility tests
- [ ] Phase 3.5: Validation & Commit

#### Package: @clarity-chat/marketing-site
- [ ] Phase 3.1: Inventory & Plan
- [ ] Phase 3.2: Dependencies & Config
  - [ ] Upgrade Next.js to 15-16
  - [ ] Upgrade React to 19.x
- [ ] Phase 3.3: File-by-File Modernization
  - [ ] Apply Next.js 15-16 patterns
  - [ ] Server Components
- [ ] Phase 3.4: Storybook & Tests
- [ ] Phase 3.5: Validation & Commit

#### Other Packages
- [ ] @clarity-chat/primitives
- [ ] @clarity-chat/dev-tools
- [ ] @clarity-chat/error-handling
- [ ] @clarity-chat/cli
- [ ] @clarity-chat/types
- [ ] @clarity-chat/memory
- [ ] @clarity-chat/licensing
- [ ] @clarity-chat/playground
- [ ] @clarity-chat/testing-utils
- [ ] @clarity-chat/codemods

---

### Phase 4: Cross-Package Consistency & Final Review

- [ ] Global lint passes
- [ ] Global type-check passes
- [ ] Global test suite passes
- [ ] Global build passes
- [ ] Unified TypeScript base config
- [ ] Unified ESLint config
- [ ] Unified Prettier config
- [ ] Unified Storybook config
- [ ] Consistent patterns across packages
- [ ] Documentation updated
- [ ] Final Modernization Report

---

## Modernization Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` or proper types)
- Proper type inference
- Type-safe APIs

### React
- Function components only
- React 19 hooks and patterns
- Server Components where applicable
- Proper Suspense boundaries
- Accessibility (ARIA, semantic HTML)

### Next.js
- App Router
- Server Actions
- Proper caching strategies
- Typed routes
- Edge runtime where appropriate

### Storybook
- CSF3 format
- Interaction tests (play functions)
- Accessibility tests
- Proper documentation

### Testing
- Unit tests (Vitest)
- Component tests (Testing Library)
- E2E tests (Playwright)
- Accessibility tests

### Code Quality
- ESLint passing
- TypeScript strict mode
- No console errors/warnings
- Performance optimized
- Accessible (WCAG 2.1 AA)
