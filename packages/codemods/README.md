# @clarity-chat/codemods

Automated migration tools for API changes in Clarity Chat components. These codemods help migrate from deprecated APIs to the latest versions with improved performance and maintainability.

## Installation

```bash
npm install -g @clarity-chat/codemods
# or
yarn global add @clarity-chat/codemods
# or
pnpm add -g @clarity-chat/codemods
```

## Available Codemods

### migrate-toast

Migrates from the custom toast system to Sonner-based toast.

**Changes:**
- `useToast` → direct `toast` calls
- `ToastProvider` → `ClarityToaster`
- `ToastContainer` removal

**Usage:**
```bash
npx @clarity-chat/codemods migrate-toast --source src/
```

**Before:**
```typescript
import { useToast, ToastProvider, ToastContainer } from '@clarity-chat/react'

function MyComponent() {
  const { toast } = useToast()

  return (
    <ToastProvider>
      <button onClick={() => toast({ title: "Hello" })}>
        Show Toast
      </button>
      <ToastContainer />
    </ToastProvider>
  )
}
```

**After:**
```typescript
import { ClarityToaster, toast } from '@clarity-chat/react'

function MyComponent() {
  return (
    <>
      <button onClick={() => toast("Hello")}>
        Show Toast
      </button>
      <ClarityToaster />
    </>
  )
}
```

### migrate-markdown-renderers

Migrates from deprecated markdown renderers to `EnhancedMarkdownRenderer`.

**Changes:**
- `MarkdownRendererEnhanced` → `EnhancedMarkdownRenderer`
- `MessageMarkdownRenderer` removal
- Props API updates

**Usage:**
```bash
npx @clarity-chat/codemods migrate-markdown-renderers --source src/
```

**Before:**
```typescript
import { MarkdownRendererEnhanced } from '@clarity-chat/react/internal'

<MarkdownRendererEnhanced
  content="# Hello"
  enableHighlight={true}
  enableGFM={true}
/>
```

**After:**
```typescript
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

<EnhancedMarkdownRenderer
  content="# Hello"
  config={{
    enableSyntaxHighlight: true,
    enableGFM: true
  }}
/>
```

### migrate-reduced-motion

Standardizes `useReducedMotion` imports to use the canonical source.

**Changes:**
- Consolidates imports to `@clarity-chat/primitives`

**Usage:**
```bash
npx @clarity-chat/codemods migrate-reduced-motion --source src/
```

**Before:**
```typescript
import { useReducedMotion } from '@clarity-chat/react/hooks/ui/use-reduced-motion'
```

**After:**
```typescript
import { useReducedMotion } from '@clarity-chat/primitives'
```

## Running Codemods

### Basic Usage

```bash
npx @clarity-chat/codemods [codemod-name] --source [directory]
```

### Options

- `--source` (required): Directory containing files to migrate
- `--dry-run`: Show changes without applying them
- `--verbose`: Show detailed output

### Examples

```bash
# Migrate toast usage in src directory
npx @clarity-chat/codemods migrate-toast --source src/

# Dry run to see what would change
npx @clarity-chat/codemods migrate-toast --source src/ --dry-run

# Migrate with verbose output
npx @clarity-chat/codemods migrate-toast --source src/ --verbose

# Run all migrations
npx @clarity-chat/codemods migrate-toast --source src/
npx @clarity-chat/codemods migrate-markdown-renderers --source src/
npx @clarity-chat/codemods migrate-reduced-motion --source src/
```

## Integration with Build Tools

### Prettier

Add to your `.prettierrc`:

```json
{
  "overrides": [
    {
      "files": "*.{js,jsx,ts,tsx}",
      "options": {
        "parser": "babel"
      }
    }
  ]
}
```

### ESLint

The codemods are designed to work with your existing ESLint configuration. Run ESLint after migration to catch any remaining issues.

### TypeScript

Run `tsc --noEmit` after migration to ensure type safety.

## Troubleshooting

### Codemod doesn't find files

Ensure you're running from the project root and the source directory exists:

```bash
ls -la src/  # Verify source directory
pwd          # Should be project root
```

### Import errors after migration

Some imports may need manual adjustment. Check that:

1. All `@clarity-chat/react` imports are correct
2. All `@clarity-chat/primitives` imports are available
3. Component props match the new API

### Build fails after migration

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check for TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Contributing

When adding new codemods:

1. Create a new file in `src/` following the naming pattern `migrate-[feature].ts`
2. Export the function from `src/index.ts`
3. Add tests in `__tests__/` directory
4. Update this README

### Testing Codemods

```bash
# Run codemod tests
npm test

# Test specific codemod
npm test -- migrate-toast.test.ts
```

## Version Compatibility

- **v1.0.0+**: Latest API with performance improvements
- **v0.x.x**: Legacy APIs (deprecated)

Use these codemods to migrate from v0.x.x to v1.0.0+.

## Support

- 📖 [Migration Guide](../docs/migration-interactive-components.md)
- 🐛 [Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💬 [Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

**Made with ❤️ by the Clarity Chat team**