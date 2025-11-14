# Repository Dependency Map

## Monorepo Structure

### Root Configuration
- **Package Manager**: pnpm 10.21.0
- **Build System**: Turbo 2.0.0
- **Workspaces**: packages/*, apps/*, examples/*

---

## Core Packages

### 1. `@clarity-chat/react` (Main Component Library)
- **Purpose**: Primary React component library
- **Dependencies**: 
  - React 18.2.0 (peer) → **Upgrade to 19+**
  - @clarity-chat/memory
  - @radix-ui/react-slot
  - framer-motion, lucide-react, react-markdown
- **Build**: tsup
- **Testing**: Vitest
- **Status**: ⚠️ Needs React 19 upgrade

### 2. `@clarity-chat/primitives`
- **Purpose**: Base UI primitives
- **Dependencies**: Minimal
- **Build**: tsup
- **Testing**: Vitest
- **Status**: ⚠️ Needs review

### 3. `@clarity-chat/types`
- **Purpose**: Shared TypeScript type definitions
- **Dependencies**: None
- **Build**: TypeScript compiler
- **Status**: ✅ Likely minimal changes needed

### 4. `@clarity-chat/memory`
- **Purpose**: Memory management utilities
- **Dependencies**: Minimal
- **Build**: tsup
- **Status**: ⚠️ Needs review

### 5. `@clarity-chat/error-handling`
- **Purpose**: Error handling utilities
- **Dependencies**: Minimal
- **Build**: Vite
- **Testing**: Vitest
- **Status**: ⚠️ Needs review

### 6. `@clarity-chat/errors`
- **Purpose**: Error definitions
- **Dependencies**: Minimal
- **Testing**: Jest (needs migration to Vitest)
- **Status**: ⚠️ Needs Jest → Vitest migration

### 7. `@clarity-chat/licensing`
- **Purpose**: Licensing utilities
- **Dependencies**: Minimal
- **Build**: tsup
- **Status**: ⚠️ Needs review

### 8. `@clarity-chat/dev-tools`
- **Purpose**: Developer tools and utilities
- **Dependencies**: React 18.2.0 → **Upgrade to 19+**
- **Build**: tsup
- **Status**: ⚠️ Needs React 19 upgrade

### 9. `@clarity-chat/cli`
- **Purpose**: CLI tooling
- **Dependencies**: Node.js only
- **Build**: tsup
- **Testing**: Vitest
- **Status**: ⚠️ Needs review

### 10. `@clarity-chat/codemods`
- **Purpose**: Code transformation utilities
- **Dependencies**: Minimal
- **Status**: ⚠️ Needs review

### 11. `@clarity-chat/testing-utils`
- **Purpose**: Testing utilities
- **Dependencies**: Testing libraries
- **Status**: ⚠️ Needs review

### 12. `@clarity-chat/playground`
- **Purpose**: Component playground
- **Dependencies**: React 18.2.0 → **Upgrade to 19+**
- **Build**: Vite
- **Status**: ⚠️ Needs React 19 upgrade

---

## Applications

### 1. `@clarity-chat/storybook`
- **Purpose**: Storybook documentation
- **Framework**: Storybook 7.6.0 → **Upgrade to 8.x**
- **Dependencies**: 
  - React 18.2.0 → **Upgrade to 19+**
  - @storybook/react-vite 7.6.0 → **Upgrade to 8.x**
- **Status**: ⚠️ Needs Storybook 8.x + React 19 upgrade

### 2. `@clarity-chat/docs-site`
- **Purpose**: Documentation website
- **Framework**: Next.js 14.2.2 → **Upgrade to 15-16**
- **Dependencies**:
  - React 18.2.0 → **Upgrade to 19+**
  - Next.js 14.2.2 → **Upgrade to 15-16**
- **Status**: ⚠️ Needs Next.js 15-16 + React 19 upgrade

### 3. `@clarity-chat/marketing-site`
- **Purpose**: Marketing website
- **Framework**: Next.js (version TBD)
- **Dependencies**: React 18.2.0 → **Upgrade to 19+**
- **Status**: ⚠️ Needs Next.js + React 19 upgrade

### 4. `@clarity-chat/docs`
- **Purpose**: Documentation content
- **Dependencies**: Minimal
- **Status**: ✅ Likely minimal changes

---

## Examples (Many - Needs Inventory)

Examples directory contains multiple demo applications:
- performance-dashboard
- theme-builder
- advanced-chat-features
- comprehensive-chat-demo
- component-demo
- design-system-showcase
- rag-workbench-demo
- token-optimization-demo
- vercel-ai-sdk-compatible
- streaming-chat
- enterprise-knowledge-hub
- multi-user-chat
- model-comparison-demo
- examples-showcase
- enterprise-ai-ops
- devops-command-center
- ecommerce-assistant
- customer-support
- conversational-analytics
- ai-sales-copilot
- ai-assistant
- basic-chat
- analytics-console-demo
- ai-research-platform
- code-assistant

**Status**: ⚠️ All examples need React 19+ upgrade

---

## Legacy Patterns Detected

### React Patterns
- ✅ Using functional components (good)
- ⚠️ React 18.2.0 (needs upgrade)
- ⚠️ Check for class components
- ⚠️ Check for deprecated lifecycle methods

### Next.js Patterns
- ⚠️ Next.js 14.2.2 (needs upgrade to 15-16)
- ⚠️ Verify App Router usage
- ⚠️ Check for Pages Router migration needs

### Storybook Patterns
- ⚠️ Storybook 7.6.0 (needs upgrade to 8.x)
- ⚠️ Check for CSF2 → CSF3 migration
- ⚠️ Verify interaction testing setup

### TypeScript Patterns
- ✅ TypeScript 5.3.3 (check for latest)
- ⚠️ Verify strict mode enabled everywhere
- ⚠️ Check for `any` types

### Testing Patterns
- ⚠️ Mixed testing frameworks (Jest in errors package, Vitest elsewhere)
- ⚠️ Standardize on Vitest
- ⚠️ Verify Playwright setup

---

## Dependency Upgrade Priority

### Priority 1: Root Dependencies
1. React 18.2.0 → 19.0.0
2. React DOM 18.2.0 → 19.0.0
3. Next.js 14.2.2 → 15.0.0 (or 16.0.0)
4. Storybook 7.6.0 → 8.0.0
5. TypeScript 5.3.3 → 5.7.0

### Priority 2: Core Packages
1. @clarity-chat/react
2. @clarity-chat/primitives
3. @clarity-chat/types

### Priority 3: Applications
1. @clarity-chat/storybook
2. @clarity-chat/docs-site
3. @clarity-chat/marketing-site

### Priority 4: Supporting Packages
1. @clarity-chat/dev-tools
2. @clarity-chat/cli
3. @clarity-chat/error-handling
4. @clarity-chat/errors (Jest → Vitest migration)

### Priority 5: Examples
- Update all examples after core packages are modernized

---

## Cross-Package Dependencies

```
@clarity-chat/react
  ├── @clarity-chat/memory
  ├── @clarity-chat/types
  └── @clarity-chat/primitives (potential)

@clarity-chat/storybook
  └── @clarity-chat/react

@clarity-chat/docs-site
  └── @clarity-chat/react

@clarity-chat/dev-tools
  └── @clarity-chat/react (potential)
```

**Modernization Order**: Types → Primitives → Memory → React → Apps → Dev Tools → Examples

---

*Last Updated: 2025-01-XX*
*Maintained by: Frontend Modernization AI Agents*
