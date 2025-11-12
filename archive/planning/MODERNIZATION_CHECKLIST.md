# Frontend Modernization Checklist 2025

## Overview
This document serves as the shared knowledge base for all modernization agents working on this monorepo. It defines the target standards, patterns, and best practices for React 19+, Next.js 15-16, Storybook latest, and 2025 frontend best practices.

---

## Target Versions & Standards

### Core Framework Versions
- **React**: `^19.0.0` (latest stable)
- **React DOM**: `^19.0.0`
- **Next.js**: `^15.0.0` or `^16.0.0` (latest stable)
- **TypeScript**: `^5.7.0` (latest stable)
- **Storybook**: `^8.0.0` (latest stable)
- **Node.js**: `>=20.0.0` (LTS)

### Build & Tooling
- **Vite**: `^6.0.0` (latest)
- **Turbopack**: Enabled for Next.js where applicable
- **Vitest**: `^3.0.0` (latest)
- **Playwright**: `^1.50.0` (latest)

---

## React 19+ Modernization Standards

### ✅ Required Patterns

1. **Server Components** (Next.js App Router)
   - Use `async` components for data fetching
   - Leverage Server Components by default
   - Client Components only when needed (`'use client'`)

2. **Server Actions**
   - Replace API routes with Server Actions where appropriate
   - Use `'use server'` directive
   - Proper error handling and validation

3. **Suspense & Streaming**
   - Wrap async components in `<Suspense>`
   - Use loading.tsx and error.tsx patterns
   - Implement streaming for better UX

4. **Modern Hooks**
   - `use()` hook for promises and context
   - `useOptimistic()` for optimistic updates
   - `useFormStatus()` for form state
   - `useFormState()` for form actions

5. **Transitions**
   - Use `useTransition()` for non-urgent updates
   - `startTransition()` for state updates

6. **Event Handling**
   - Modern event handling patterns
   - Proper cleanup in effects
   - Avoid memory leaks

### ❌ Deprecated Patterns to Remove

- Class components → Convert to function components
- `componentWillMount`, `componentWillReceiveProps` → Use hooks
- Legacy Context API → Use modern Context
- String refs → Use `useRef()` or callbacks
- `findDOMNode()` → Use refs
- Legacy lifecycle methods

---

## Next.js 15-16 Standards

### App Router Requirements

1. **File Structure**
   ```
   app/
     layout.tsx          # Root layout
     page.tsx            # Page component
     loading.tsx         # Loading UI
     error.tsx           # Error boundary
     not-found.tsx       # 404 page
     route.ts            # API route (if needed)
   ```

2. **Server Components by Default**
   - All components are Server Components unless marked `'use client'`
   - Data fetching in Server Components
   - Minimal Client Components

3. **Server Actions**
   ```typescript
   'use server'
   
   export async function createPost(data: FormData) {
     // Server action logic
   }
   ```

4. **Caching & Revalidation**
   - Use `cache()` for request memoization
   - `revalidatePath()` and `revalidateTag()` for cache invalidation
   - Proper cache strategies

5. **Middleware**
   - Edge runtime where appropriate
   - Type-safe middleware
   - Proper redirects and rewrites

6. **Metadata API**
   - Use `generateMetadata()` for dynamic metadata
   - Proper SEO and OpenGraph tags

### Turbopack (Optional but Recommended)
- Enable Turbopack for faster dev builds
- Migrate webpack configs if needed

---

## Storybook Latest (8.x) Standards

### Configuration

1. **CSF3 Format**
   ```typescript
   import type { Meta, StoryObj } from '@storybook/react'
   
   const meta = {
     title: 'Example/Button',
     component: Button,
   } satisfies Meta<typeof Button>
   
   export default meta
   type Story = StoryObj<typeof meta>
   
   export const Primary: Story = {
     args: {
       label: 'Button',
     },
   }
   ```

2. **Interaction Testing**
   - Use `@storybook/test` for interactions
   - Play functions for user interactions
   - Accessibility testing with `@storybook/addon-a11y`

3. **Modern Addons**
   - `@storybook/addon-essentials` (includes interactions, docs, controls)
   - `@storybook/addon-a11y` for accessibility
   - `@storybook/addon-viewport` for responsive testing

4. **Docs Mode**
   - MDX for documentation
   - Auto-generated docs from components
   - Proper argTypes and controls

5. **Vitest Integration**
   - Use `@storybook/test` for unit tests
   - Playwright for E2E tests in Storybook

---

## TypeScript Standards

### Strict Mode Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Safety Rules

1. **No `any` Types**
   - Use `unknown` instead of `any`
   - Proper type guards
   - Generic constraints

2. **Proper Type Definitions**
   - Export types from components
   - Use `satisfies` operator where appropriate
   - Proper generic types

3. **Type Imports**
   - Use `import type` for type-only imports
   - Separate type and value imports

---

## Testing Standards

### Unit Tests (Vitest)

1. **Component Testing**
   - Use `@testing-library/react` v16+
   - Test user interactions, not implementation
   - Accessibility testing

2. **Coverage Requirements**
   - Minimum 80% coverage for utilities
   - Minimum 70% coverage for components
   - Critical paths: 100% coverage

3. **Test Structure**
   ```typescript
   import { describe, it, expect } from 'vitest'
   import { render, screen } from '@testing-library/react'
   
   describe('ComponentName', () => {
     it('should render correctly', () => {
       render(<ComponentName />)
       expect(screen.getByRole('button')).toBeInTheDocument()
     })
   })
   ```

### E2E Tests (Playwright)

1. **Critical User Flows**
   - User authentication
   - Form submissions
   - Navigation flows
   - Error handling

2. **Accessibility Testing**
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA attributes

---

## Accessibility Standards (WCAG 2.1 AA)

### Required Practices

1. **Semantic HTML**
   - Proper heading hierarchy
   - Landmark regions
   - Form labels

2. **ARIA Attributes**
   - `aria-label` for icon-only buttons
   - `aria-describedby` for help text
   - `aria-live` for dynamic content

3. **Keyboard Navigation**
   - All interactive elements focusable
   - Logical tab order
   - Escape key handlers

4. **Color Contrast**
   - Minimum 4.5:1 for text
   - Minimum 3:1 for UI components

---

## Performance Standards

### Optimization Targets

1. **Bundle Size**
   - Code splitting
   - Tree shaking
   - Dynamic imports

2. **Runtime Performance**
   - React.memo for expensive components
   - useMemo/useCallback where appropriate
   - Virtualization for long lists

3. **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## Code Quality Standards

### File Structure

```
package-name/
  src/
    components/        # React components
    hooks/            # Custom hooks
    utils/            # Utility functions
    types/            # TypeScript types
    styles/           # CSS/styling
    __tests__/        # Test files
  stories/            # Storybook stories
  package.json
  tsconfig.json
  vitest.config.ts
```

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserData.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Code Style

- Use functional components only
- Prefer named exports
- Use const assertions where appropriate
- Proper JSDoc comments for public APIs

---

## Dependency Management

### Peer Dependencies

- React packages should use `peerDependencies` for React/ReactDOM
- Avoid bundling React in library packages

### Workspace Dependencies

- Use `workspace:*` for internal packages
- Proper versioning with changesets

---

## Migration Priorities

### Phase 1: Foundation
1. ✅ Root dependencies upgrade
2. ✅ TypeScript strict mode
3. ✅ ESLint configuration

### Phase 2: Core Packages
1. `@clarity-chat/react` - Main component library
2. `@clarity-chat/primitives` - Base primitives
3. `@clarity-chat/types` - Type definitions

### Phase 3: Apps
1. `@clarity-chat/storybook` - Storybook app
2. `@clarity-chat/docs-site` - Documentation site
3. `@clarity-chat/marketing-site` - Marketing site

### Phase 4: Supporting Packages
1. `@clarity-chat/dev-tools` - Dev tools
2. `@clarity-chat/cli` - CLI tool
3. `@clarity-chat/error-handling` - Error handling
4. Other utility packages

### Phase 5: Examples & Final Polish
1. Update all example apps
2. Cross-package consistency
3. Final validation and documentation

---

## Validation Checklist (Per Package)

- [ ] Dependencies upgraded to target versions
- [ ] TypeScript strict mode enabled
- [ ] All tests passing
- [ ] Linting passes with zero errors
- [ ] Storybook stories updated to CSF3
- [ ] Accessibility tests passing
- [ ] Build succeeds
- [ ] No deprecated React APIs
- [ ] Proper Server Components usage (Next.js apps)
- [ ] Documentation updated

---

## Breaking Changes Tracking

Document all breaking changes per package:
- API changes
- Prop changes
- Behavior changes
- Migration path for consumers

---

## Resources

- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Storybook 8 Migration Guide](https://storybook.js.org/docs)
- [TypeScript 5.7 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html)

---

*Last Updated: 2025-01-XX*
*Maintained by: Frontend Modernization AI Agents*
