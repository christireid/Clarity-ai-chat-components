# Design System Migration Scope

## Repository Overview

- **Type**: pnpm monorepo with Turborepo
- **Package Manager**: pnpm 10.21.0
- **Node Version**: >= 20.0.0

## Included in Migration Scope

### Packages (14 total)

| Package                          | Path                            | Styling Impact                                   |
| -------------------------------- | ------------------------------- | ------------------------------------------------ |
| `@clarity-ai/react`              | `/packages/react/`              | **HIGH** - Main component library                |
| `@clarity-ai/primitives`         | `/packages/primitives/`         | **HIGH** - shadcn/ui foundation + glass variants |
| `@clarity-ai/types`              | `/packages/types/`              | LOW - TypeScript definitions                     |
| `@clarity-ai/utils`              | `/packages/utils/`              | LOW - Utility functions                          |
| `@clarity-ai/memory`             | `/packages/memory/`             | LOW - Memory management                          |
| `@clarity-ai/testing-utils`      | `/packages/testing-utils/`      | LOW - Test utilities                             |
| `@clarity-ai/token-optimization` | `/packages/token-optimization/` | LOW - Token management                           |
| `@clarity-ai/error-handling`     | `/packages/error-handling/`     | LOW - Error handling                             |
| `@clarity-ai/dev-tools`          | `/packages/dev-tools/`          | MEDIUM - Dev tools UI                            |
| `@clarity-ai/playground`         | `/packages/playground/`         | MEDIUM - Interactive playground                  |
| `@clarity-ai/cli`                | `/packages/cli/`                | LOW - CLI utilities                              |
| `@clarity-ai/codemods`           | `/packages/codemods/`           | LOW - Code transformations                       |
| `@clarity-ai/license`            | `/packages/license/`            | NONE                                             |
| `typescript-config`              | `/packages/typescript-config/`  | NONE                                             |

### Apps (6 total)

| App                | Path                      | Styling Impact                     |
| ------------------ | ------------------------- | ---------------------------------- |
| `docs`             | `/apps/docs/`             | **HIGH** - Main documentation site |
| `storybook`        | `/apps/storybook/`        | **HIGH** - Component showcase      |
| `streamlined-docs` | `/apps/streamlined-docs/` | **HIGH** - Streamlined docs        |
| `examples`         | `/apps/examples/`         | MEDIUM - 40+ examples              |
| `marketing-site`   | `/apps/marketing-site/`   | MEDIUM - Landing page              |
| `docs-site`        | `/apps/docs-site/`        | MEDIUM - Alternative docs          |

## Key Configuration Files

### Theme System (Primary Targets)

- `/styles/globals.css` - Root global styles
- `/packages/react/src/theme/theme.css` - Theme CSS variables
- `/packages/react/src/theme/ThemeProvider.tsx` - Theme context provider
- `/packages/react/src/theme/tokens/*.ts` - Design tokens
- `/packages/react/src/theme/modern-presets/*.ts` - Theme presets
- `/packages/primitives/src/lib/glass-variants.ts` - CVA glass variants

### Tailwind Configuration

- `/tailwind.config.js` - Root Tailwind config
- 46 additional tailwind configs across packages/apps

## Boundaries and Constraints

### In Scope

- CSS variables and token architecture
- Theme switching mechanism (light/dark)
- Glass surface primitives and utilities
- shadcn/ui component variant extensions
- Accessibility (WCAG AA, reduced motion/transparency)
- Performance optimizations
- Storybook theming decorators

### Out of Scope

- Documentation prose/content changes
- Feature functionality changes
- Adding new dependencies (unless essential)
- Tailwind v4 migration (repo uses v3.4.18)

## Current State Assessment

### Tailwind Version

- **Current**: 3.4.18
- **Note**: Spec references v4 utilities, but implementation will use v3 patterns
- Glass utilities will use v3-compatible backdrop-filter classes

### Existing Glass Implementation

- `glass-variants.ts` - CVA system with intensity/gradient/border/animation variants
- `glassmorphism.ts` - Theme preset with light/dark modes
- `globals.css` - `.glass-panel`, `.glass-animated`, `.glass-glow` utilities
- OKLCH color space for glass effects

### Theme Architecture

- Class-based dark mode (`class` strategy in Tailwind)
- `data-theme` attribute for theme variants
- ThemeProvider with React context
- localStorage persistence with cross-tab sync
- 16 built-in theme presets
