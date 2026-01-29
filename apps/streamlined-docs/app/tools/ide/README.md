# VSCode Integration Guide - Configuration Files

Complete VSCode setup for Clarity AI Chat Components development.

## 📁 Files Included

### 1. Main Guide
- **vscode.mdx** - Complete setup guide with instructions and examples

### 2. Configuration Files (Ready to Copy)
- **vscode-settings.json** - Workspace settings for optimal TypeScript/React development
- **vscode-snippets.json** - 30+ code snippets for components, hooks, tests
- **vscode-extensions.json** - Recommended extensions list
- **vscode-launch.json** - Debugging configurations
- **vscode-tasks.json** - Build, test, and development tasks
- **vscode-keybindings.json** - Keyboard shortcuts for common operations

### 3. Navigation
- **page.tsx** - IDE tools overview page

## 🚀 Quick Setup

### Option 1: Manual Setup

1. **Create `.vscode` directory** in project root:
   ```bash
   mkdir -p .vscode
   ```

2. **Copy configuration files**:
   ```bash
   # From apps/streamlined-docs/app/tools/ide/
   cp vscode-settings.json .vscode/settings.json
   cp vscode-snippets.json .vscode/clarity-chat.code-snippets
   cp vscode-extensions.json .vscode/extensions.json
   cp vscode-launch.json .vscode/launch.json
   cp vscode-tasks.json .vscode/tasks.json
   cp vscode-keybindings.json .vscode/keybindings.json  # Optional: User-level
   ```

3. **Install recommended extensions**:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type: "Extensions: Show Recommended Extensions"
   - Click "Install All"

4. **Reload VSCode**:
   - Press `Cmd+Shift+P` / `Ctrl+Shift+P`
   - Type: "Developer: Reload Window"

### Option 2: Use Script (Coming Soon)

```bash
pnpm run setup:vscode
```

## 📦 What You Get

### TypeScript IntelliSense
- Auto-imports from all `@clarity-chat/*` packages
- Inlay hints for types, parameters, and return values
- Path aliases configured (`@/`, `@clarity-chat/*`)
- Optimized TS Server settings (4GB memory)

### Code Snippets (30+)

#### Components
- `cc-component` - Full component template
- `cc-message` - Chat message component
- `cc-input` - Chat input component

#### Hooks
- `cc-hook` - Custom hook template
- `cc-use-chat` - useClarityChat setup
- `cc-use-token` - Token budget monitoring
- `cc-use-stream` - Stream status tracking

#### Tests
- `cc-test` - Component test template
- `cc-hook-test` - Hook test template

#### Utilities
- `cc-async` - Async function with error handling
- `cc-guard` - Type guard
- `cc-brand` - Branded type
- `cc-api` - Next.js API route
- `cc-zod` - Zod schema

### Debugging Configurations
- **Next.js: Full Stack Debug** - Debug server + client together
- **Vitest: Debug Current File** - Debug test file
- **Playwright: Debug Test** - Debug E2E tests

### Tasks
- `Dev Server` - Start development server
- `Build` - Build all packages
- `Test` - Run all tests
- `Type Check` - TypeScript checking
- `Lint` - ESLint checking
- `Format` - Prettier formatting

### Extensions (14 Recommended)

#### Essential
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Error Lens** - Inline error messages
- **Pretty TypeScript Errors** - Readable TS errors

#### Testing
- **Vitest Explorer** - Run tests from sidebar
- **Playwright** - E2E testing support

#### Utilities
- **Import Cost** - Show bundle size
- **Path IntelliSense** - Path autocomplete
- **GitLens** - Enhanced Git features

## ⌨️ Keyboard Shortcuts

### Testing
- `Cmd+K Cmd+T` - Run tests
- `Ctrl+Shift+T` - Run current file tests

### Building
- `Cmd+K Cmd+B` - Build project
- `Cmd+Shift+B` - Build packages only

### Code Actions
- `Cmd+K Cmd+L` - ESLint fix
- `Cmd+K Cmd+F` - Format document
- `Cmd+K Cmd+O` - Organize imports

### TypeScript
- `Cmd+K Cmd+R` - Restart TS Server
- `Alt+T` - Go to type definition

### Snippets
- `Cmd+K Cmd+C Cmd+C` - Insert component snippet
- `Cmd+K Cmd+C Cmd+H` - Insert hook snippet
- `Cmd+K Cmd+C Cmd+T` - Insert test snippet

## 🎯 Features

### Auto-Import Configuration
Imports are automatically organized in this order:
1. React
2. Next.js
3. `@clarity-chat/*` packages
4. Local absolute imports (`@/`)
5. Relative imports
6. Type imports

Example:
```tsx
import * as React from 'react'
import Link from 'next/link'
import { Button, cn } from '@clarity-chat/primitives'
import { useClarityChat } from '@clarity-chat/react'
import { formatDate } from '@/lib/utils'
import { Header } from './Header'
import type { Message } from '@clarity-chat/types'
```

### Tailwind CSS IntelliSense
Works with:
- `cn()` utility function
- `cva()` class variance authority
- All Tailwind classes in TSX files

### Error Lens
Displays errors inline with:
- Color-coded severity (error/warning)
- Status bar integration
- 200 character limit for readability

### Import Cost
Shows bundle size for imports:
- Small: < 20KB
- Medium: 20-50KB
- Large: > 100KB (highlighted)

## 📊 Performance Optimization

Settings optimized for large monorepo:
- File watchers exclude build artifacts
- Search limited to source files
- TS Server memory limit: 4GB
- Reduced file decorations
- Optimized auto-save

## 🔧 Customization

### Modify Path Aliases
Edit `.vscode/settings.json`:
```json
{
  "path-intellisense.mappings": {
    "@custom": "${workspaceFolder}/custom/path"
  }
}
```

### Add Custom Snippets
Edit `.vscode/clarity-chat.code-snippets`:
```json
{
  "My Custom Snippet": {
    "prefix": "my-snippet",
    "body": ["// Your code here"],
    "description": "Description"
  }
}
```

### Modify Tasks
Edit `.vscode/tasks.json` to add custom build/test tasks.

## 🐛 Troubleshooting

### TypeScript IntelliSense Not Working

1. **Restart TS Server**:
   - `Cmd+Shift+P` → "TypeScript: Restart TS Server"

2. **Select Workspace Version**:
   - Click TypeScript version in status bar
   - Select "Use Workspace Version"

3. **Clear Cache**:
   ```bash
   rm -rf node_modules/.cache
   pnpm install
   ```

### Auto-Import Not Suggesting

1. Verify `typescript.suggest.autoImports` is `true`
2. Check path mappings in `tsconfig.json`
3. Restart VSCode

### ESLint Not Running

1. Check Output panel: View → Output → ESLint
2. Verify config: `pnpm eslint --print-config src/index.ts`
3. Restart ESLint Server: `Cmd+Shift+P` → "ESLint: Restart ESLint Server"

## 📚 Additional Resources

- [VSCode TypeScript Docs](https://code.visualstudio.com/docs/languages/typescript)
- [VSCode Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)
- [Clarity Chat Documentation](https://clarity-chat.dev)
- [Main Guide](./vscode.mdx) - Detailed setup instructions

## 💡 Tips

1. **Use Snippet Triggers**: Type snippet prefix and press `Tab`
2. **Multi-Cursor Editing**: `Cmd+D` to select next occurrence
3. **Command Palette**: `Cmd+Shift+P` for all commands
4. **Quick Open**: `Cmd+P` to open files quickly
5. **Go to Symbol**: `Cmd+Shift+O` to jump to functions/classes
6. **Breadcrumbs**: Click breadcrumb at top to navigate hierarchy

## 🎨 Customization Ideas

- Change color theme: `Cmd+K Cmd+T`
- Change icon theme: Preferences → File Icon Theme
- Modify font: `"editor.fontFamily": "JetBrains Mono"`
- Enable ligatures: `"editor.fontLigatures": true`
- Change zoom: `Cmd+` / `Cmd-`

---

**Last Updated**: January 28, 2026

For the complete guide with examples and detailed explanations, see [vscode.mdx](./vscode.mdx).
