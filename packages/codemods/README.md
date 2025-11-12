# @clarity-chat/codemods

Automated code transformations for Clarity Chat version migrations.

## Features

- 🔄 **Automated Migrations**: Update your code automatically when upgrading versions
- 🎯 **AST-based**: Precise transformations using jscodeshift
- 🔍 **Dry Run**: Preview changes before applying them
- 📝 **Multiple Transforms**: Supports various migration scenarios
- 🚀 **CLI Tool**: Easy-to-use command-line interface

## Installation

```bash
npm install -D @clarity-chat/codemods
```

Or use directly with npx:

```bash
npx @clarity-chat/codemods
```

## Usage

### List Available Codemods

```bash
clarity-codemod list
```

### Run a Specific Codemod

```bash
# Dry run (preview changes)
clarity-codemod run v1-to-v2 ./src --dry

# Apply changes
clarity-codemod run v1-to-v2 ./src
```

### Migrate Between Versions

```bash
# Dry run
clarity-codemod migrate 1 2 ./src --dry

# Apply migration
clarity-codemod migrate 1 2 ./src
```

## Available Transforms

### v1-to-v2

Migrates from Clarity Chat v1 to v2:

- Renames `ChatWindow` to `ChatInterface`
- Changes `onMessage` prop to `onSend`
- Updates configuration object structure
- Modernizes API key management

**Before:**

```typescript
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  onMessage={(msg) => console.log(msg)}
  config={{ apiKey: 'sk-...' }}
/>
```

**After:**

```typescript
import { ChatInterface } from '@clarity-chat/react'

<ChatInterface
  onSend={(msg) => console.log(msg)}
  config={{ credentials: { apiKey: 'sk-...' } }}
/>
```

## Options

### `--dry` / `-d`

Preview changes without modifying files.

### `--print` / `-p`

Print transformed files to stdout.

### `--verbose` / `-v`

Show detailed transformation information.

### `--parser <parser>`

Specify parser to use: `babel`, `tsx`, `ts` (default: `tsx`)

## Examples

### Migrate a Single File

```bash
clarity-codemod run v1-to-v2 ./src/Chat.tsx
```

### Migrate an Entire Directory

```bash
clarity-codemod run v1-to-v2 ./src --verbose
```

### Preview Changes First

```bash
# See what would change
clarity-codemod run v1-to-v2 ./src --dry --print

# Apply if everything looks good
clarity-codemod run v1-to-v2 ./src
```

### Migrate Multiple Versions

```bash
# Migrate from v1 to v3 (applies v1-to-v2 and v2-to-v3)
clarity-codemod migrate 1 3 ./src
```

## How It Works

Codemods use [jscodeshift](https://github.com/facebook/jscodeshift) to parse your code into an
Abstract Syntax Tree (AST), transform it, and generate updated code. This ensures precise, safe
transformations that preserve:

- Code formatting
- Comments
- Non-related code
- Custom logic

## Writing Custom Codemods

You can extend the codemods with your own transformations:

```typescript
import type { Transform } from 'jscodeshift'

const transform: Transform = (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  // Your transformation logic here

  return root.toSource()
}

transform.parser = 'tsx'

export default transform
```

## Best Practices

1. **Always run with `--dry` first** to preview changes
2. **Commit your code before running** codemods
3. **Review the changes** after applying transformations
4. **Run tests** to ensure nothing broke
5. **Update gradually** - migrate one version at a time

## Troubleshooting

### Transform Not Found

Make sure you're using the exact transform name from `clarity-codemod list`.

### Parsing Errors

Try specifying a different parser:

```bash
clarity-codemod run v1-to-v2 ./src --parser babel
```

### Unexpected Results

Run with `--verbose` to see detailed transformation logs:

```bash
clarity-codemod run v1-to-v2 ./src --verbose
```

## Contributing

To add a new codemod:

1. Create a new transform file in `src/transforms/`
2. Add it to the registry in `src/transforms/index.ts`
3. Test it thoroughly with `--dry` flag
4. Update this README with examples

## License

MIT
