# Style Audit Scope

## Mission
Consolidate and simplify the theming system to ship **ONLY two themes**: `light` and `dark`.
Remove all ~30 existing theme presets and establish a single canonical theme system with customer customization support.

## Repositories/Areas in Scope

### Packages
- `packages/react/src/theme/` - Main theme system
- `packages/types/src/theme.ts` - Theme type definitions
- `packages/cli/src/commands/theme.ts` - CLI theme commands
- `packages/dev-tools/` - Developer tools styling
- `packages/primitives/` - Animation presets
- `packages/token-optimization/` - Token optimization styles

### Apps
- `apps/docs/` - Documentation site
- `apps/storybook/` - Storybook
- `apps/marketing-site/` - Marketing site
- `apps/streamlined-docs/` - Streamlined docs
- `apps/examples/*` - Example apps (11+ apps)

### Examples (root level)
- `examples/custom-theming/` - Custom theming example
- `examples/basic-chat/`
- `examples/streaming-chat/`
- `examples/accessibility/`
- And 10+ more...

### Configuration Files
- `tailwind.config.js` (root)
- `styles/globals.css` (root)
- Multiple package-specific tailwind configs

## Out of Scope
- `.pnpm-store/` - Package manager cache
- `node_modules/` - Dependencies
- Third-party libraries

## Current Theme Count: 30+ themes to remove

### Modern Presets (packages/react/src/theme/modern-presets/)
1. default / default-dark
2. neutral / neutral-dark
3. vibrant / vibrant-dark
4. high-contrast / high-contrast-dark
5. ocean / ocean-dark
6. sunset / sunset-dark
7. forest / forest-dark
8. rose / rose-dark
9. midnight / midnight-dark
10. slate / slate-dark
11. emerald / emerald-dark
12. amber / amber-dark
13. glassmorphism / glassmorphism-dark
14. aurora / aurora-dark
15. neumorphism / neumorphism-dark

### CSS Theme Variants (theme.css)
- zen / zen.dark
- vivid / vivid.dark
- reduced contrast mode

### Examples Custom Themes (examples/custom-theming/)
- default-light, ocean-light, forest-light, rose-light
- default-dark, midnight, emerald-dark, purple-haze

## Target State
- **2 themes only**: light (default) and dark
- **1 canonical system**: CSS variables with `data-theme` attribute
- **1 customization API**: Safe customer overrides
- **0 legacy themes**: All others deleted
