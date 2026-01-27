# Shared Example Configurations

This directory contains shared configuration files used by all Clarity Chat examples. This eliminates duplication and ensures consistency across all example applications.

## Files

### `tailwind.config.base.ts`
Base Tailwind CSS configuration with:
- Standard content paths
- Clarity brand colors
- Animation presets
- Common keyframes

**Usage in examples:**
```typescript
// apps/examples/my-example/tailwind.config.ts
import { baseConfig } from '../../../config/examples/tailwind.config.base'

export default {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      // Add example-specific extensions here
    },
  },
} satisfies Config
```

### `next.config.base.ts`
Base Next.js configuration with:
- React strict mode enabled
- Turbopack support
- Workspace package transpilation
- Static export enabled
- Image optimization disabled

**Usage in examples:**
```typescript
// apps/examples/my-example/next.config.ts
import type { NextConfig } from 'next'
import { baseNextConfig } from '../../../config/examples/next.config.base'

const nextConfig: NextConfig = {
  ...baseNextConfig,
  // Add example-specific overrides here
}

export default nextConfig
```

### `vitest.config.base.ts`
Base Vitest configuration with:
- React plugin
- jsdom environment
- Global test APIs
- Coverage reporting
- Path alias `@/*` → `./src/*`

**Usage in examples:**
```typescript
// apps/examples/my-example/vitest.config.ts
import { baseVitestConfig } from '../../../config/examples/vitest.config.base'

export default baseVitestConfig
```

### `postcss.config.js`
Standard PostCSS configuration with:
- Tailwind CSS
- Autoprefixer

**Usage in examples:**
```javascript
// apps/examples/my-example/postcss.config.js
module.exports = require('../../../config/examples/postcss.config')
```

## Benefits

### 1. Consistency
All examples use the same base configuration, ensuring:
- Consistent behavior across examples
- Same optimization settings
- Unified styling system

### 2. Maintainability
Update once, apply everywhere:
- Add new Tailwind plugins → update base config
- Upgrade Next.js settings → update base config
- Change test configuration → update base config

### 3. Developer Experience
New examples get best practices automatically:
- No need to copy-paste configs
- Can't accidentally use outdated settings
- Clear override mechanism

### 4. Reduced Duplication
Before:
- 29 tailwind.config files (10+ duplicates)
- 29 next.config files
- 29 vitest.config files
- ~87 total configuration files

After:
- 4 base config files
- 29 slim example configs that extend base
- ~33 total configuration files (62% reduction)

## Migration Guide

### Migrating Existing Examples

To migrate an existing example to use shared configs:

1. **Backup current config:**
   ```bash
   cd apps/examples/your-example
   cp tailwind.config.ts tailwind.config.ts.backup
   ```

2. **Update to extend base:**
   ```typescript
   // tailwind.config.ts
   import { baseConfig } from '../../../config/examples/tailwind.config.base'
   export default baseConfig
   ```

3. **Test the example:**
   ```bash
   pnpm dev
   pnpm build
   ```

4. **If custom settings needed:**
   ```typescript
   import { baseConfig } from '../../../config/examples/tailwind.config.base'

   export default {
     ...baseConfig,
     theme: {
       ...baseConfig.theme,
       extend: {
         ...baseConfig.theme?.extend,
         // Your customizations
       },
     },
   }
   ```

### Batch Migration Script

```bash
#!/bin/bash
# scripts/migrate-example-configs.sh

for dir in apps/examples/*/; do
  if [ "$dir" = "apps/examples/_template/" ] || [ "$dir" = "apps/examples/_shared/" ]; then
    continue
  fi

  example=$(basename "$dir")

  # Update Tailwind config
  cat > "$dir/tailwind.config.ts" <<EOF
import { baseConfig } from '../../../config/examples/tailwind.config.base'
export default baseConfig
EOF

  echo "✓ Migrated $example"
done
```

## Extending Base Configs

### Adding Example-Specific Settings

```typescript
// For unique requirements, extend rather than replace
import { baseConfig } from '../../../config/examples/tailwind.config.base'

export default {
  ...baseConfig,
  // Override content if needed
  content: [
    ...baseConfig.content,
    './additional-dir/**/*.tsx',
  ],
  theme: {
    extend: {
      ...(baseConfig.theme?.extend || {}),
      // Add your customizations
      colors: {
        special: '#ff0000',
      },
    },
  },
}
```

### When to Override

✅ **Do override** when:
- Example has unique feature requirements
- Need additional Tailwind plugins
- Special Next.js configuration needed

❌ **Don't override** for:
- Simple styling changes (use Tailwind classes)
- Standard configurations (use base)
- One-off tweaks (may indicate base needs update)

## Updating Base Configs

When updating shared configs:

1. **Test thoroughly:**
   ```bash
   # Run all example builds
   pnpm build --filter './apps/examples/*'
   ```

2. **Document changes:**
   - Update this README
   - Note breaking changes
   - Provide migration guide if needed

3. **Version control:**
   - Use conventional commits
   - Tag major changes
   - Update CHANGELOG

## Troubleshooting

### Config Not Found

```bash
# Ensure you're using correct relative path
# From apps/examples/your-example/:
import { baseConfig } from '../../../config/examples/tailwind.config.base'

# NOT:
import { baseConfig } from '../../config/examples/tailwind.config.base'
```

### Build Errors After Migration

```bash
# Clear Next.js cache
rm -rf apps/examples/your-example/.next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### TypeScript Errors

```bash
# Ensure types are correct
pnpm typecheck --filter your-example

# If issues persist, check tsconfig path aliases
```

## Future Improvements

- [ ] Create migration script for batch updates
- [ ] Add ESLint shared config
- [ ] Add Prettier shared config
- [ ] Create config validator
- [ ] Auto-generate config documentation

## Related

- [Example Template](../../apps/examples/_template/)
- [Technical Debt Analysis](../../TECHNICAL_DEBT_ANALYSIS.md)
- [Development Guide](../../CLAUDE.md)

---

**Last Updated**: January 27, 2026
**Maintained By**: Engineering Team
