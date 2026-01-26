# Peer Dependencies Installation Helper

Interactive CLI tool to help users install only the peer dependencies they need based on their
feature requirements.

## Quick Start

```bash
# From the react package directory
pnpm install-peers

# Or run directly
node scripts/install-peers.js
```

## Features

### 1. Interactive Feature Selection

The tool guides users through selecting features with:

- Clear descriptions of each feature
- Bundle size estimates
- Feature lists
- Required vs optional markers

### 2. Smart Presets

Choose from common configurations:

**Preset 1: Minimal (Web App)**

- Core dependencies only
- React, React DOM, Framer Motion, Lucide, Zod
- ~580 KB bundle size
- Perfect for basic chat interfaces

**Preset 2: Standard**

- Core + Markdown + Code highlighting
- ~860 KB bundle size
- Most common use case
- Great for documentation/support chats

**Preset 3: Full**

- All features enabled
- ~1.7 MB bundle size
- Enterprise-ready with all capabilities
- Document processing, diagrams, exports

**Preset 4: Document Q&A**

- Core + Markdown + Document processing + Reranking
- ~1.1 MB bundle size
- Optimized for RAG applications
- PDF/DOCX support with semantic search

**Preset 5: Custom**

- Pick exactly what you need
- Interactive feature selection
- Minimize bundle size

### 3. Bundle Size Estimation

Get real-time estimates of your bundle size:

- Individual feature sizes
- Total bundle size
- Comparison against alternatives
- Tree-shaking notes

### 4. Copy-Paste Ready Commands

The tool generates installation commands for:

- npm
- yarn
- pnpm
- bun

Auto-detects your package manager and provides the right syntax.

### 5. Usage Examples

After selection, get code examples showing:

- Basic setup
- Feature-specific configuration
- Import statements
- Quick start code

## Feature Categories

### Core Features (Required)

- **Dependencies**: `react`, `framer-motion`, `lucide-react`, `zod`
- **Size**: ~450 KB
- **Includes**:
  - Basic chat components
  - Message rendering
  - Smooth animations
  - Icon library
  - Input validation

### React DOM (Optional for Web)

- **Dependencies**: `react-dom`
- **Size**: ~130 KB
- **Required for**: Browser/web applications
- **Not needed for**: React Native apps

### Markdown Rendering

- **Dependencies**: `react-markdown`, `remark-gfm`, `rehype-highlight`
- **Size**: ~85 KB
- **Includes**:
  - GitHub Flavored Markdown
  - Tables, task lists, strikethrough
  - Basic syntax highlighting
  - Safe HTML rendering

### Advanced Code Highlighting

- **Dependencies**: `shiki`, `prismjs`
- **Size**: ~195 KB
- **Includes**:
  - Beautiful syntax themes
  - 100+ languages
  - Line numbers & highlighting
  - Copy code button

### Diagram Support

- **Dependencies**: `mermaid`
- **Size**: ~320 KB
- **Includes**:
  - Flowcharts
  - Sequence diagrams
  - Gantt charts
  - Class diagrams
  - State diagrams

### Document Processing

- **Dependencies**: `pdfjs-dist`, `mammoth`
- **Size**: ~450 KB
- **Includes**:
  - PDF text extraction
  - DOCX text extraction
  - Document chunking
  - Vector search integration
- **Use case**: RAG, document Q&A

### Export Features

- **Dependencies**: `jszip`
- **Size**: ~120 KB
- **Includes**:
  - Export chats to ZIP
  - Batch export
  - Multiple format support

### AI Reranking

- **Dependencies**: `cohere-ai`
- **Size**: ~65 KB
- **Includes**:
  - Semantic reranking
  - Better search results
  - RAG optimization

### Advanced Token Optimization

- **Dependencies**: `flowtoken`
- **Size**: ~40 KB
- **Includes**:
  - Accurate token counting
  - Token budget monitoring
  - Cost optimization
- **Status**: Experimental

## Example Output

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🎯 Clarity Chat - Peer Dependencies Installer          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

This tool helps you install only the peer dependencies you need.
Detected package manager: pnpm

Common Presets:
  [P1] Minimal - Core only (web app)
  [P2] Standard - Core + Markdown + Code highlighting
  [P3] Full - All features
  [P4] Document Q&A - Core + Markdown + Document processing
  [P5] Custom - Pick features manually

Choose a preset (P1-P5): P2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Installation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Selected Features:
  ✓ Core Features (~450 KB)
  ✓ React DOM (~130 KB)
  ✓ Markdown Rendering (~85 KB)
  ✓ Advanced Code Highlighting (~195 KB)

Total Bundle Size Estimate: 860 KB
(Actual size may vary based on tree-shaking and compression)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Installation Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Install peer dependencies:

pnpm add react@"^18.0.0 || ^19.0.0" react-dom@"^18.0.0 || ^19.0.0" framer-motion@"^12.23.25" lucide-react@"^0.500.0" zod@"^3.24.0" react-markdown@"^10.0.0" remark-gfm@"^4.0.0" rehype-highlight@"^7.0.0" shiki@"^3.0.0" prismjs@"^1.29.0"

2. Install TypeScript types (if using TypeScript):

pnpm add -D @types/react @types/react-dom typescript

3. Install Clarity Chat:

pnpm add @clarity-chat/react

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Quick Start Example
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Example usage with your selected features

import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function App() {
  return (
    <ClarityChat
      api='/api/chat'
      markdown={{ enabled: true }}
    />
  )
}

💡 Tip: Copy the commands above and save them to a script file for easy re-installation.
   You can also add them to your package.json postinstall script.

✨ Setup complete! Happy coding!

For more info, visit: https://clarity-chat.dev/docs/installation
```

## Implementation Details

### Package Manager Detection

The tool automatically detects your package manager by checking:

1. `npm_config_user_agent` environment variable
2. Falls back to npm if detection fails

### Bundle Size Calculations

Bundle sizes are estimated based on:

- Minified + gzipped production builds
- Tree-shaking optimizations
- Typical usage patterns

Actual sizes may vary based on:

- Your bundler configuration
- Compression settings
- Which exports you import
- Dynamic imports usage

### Color Support

The tool uses ANSI color codes for better UX:

- Green: Success, commands
- Blue: Options, numbers
- Yellow: Warnings, size estimates
- Cyan: Headers, branding
- Dim: Descriptions, tips

Colors are disabled in non-TTY environments (CI/CD).

## Advanced Usage

### Programmatic API

You can also import and use the functions programmatically:

```javascript
import {
  FEATURES,
  detectPackageManager,
  generateInstallCommand,
  calculateTotalSize,
} from './scripts/install-peers.js'

// Get feature info
console.log(FEATURES.markdown)

// Detect package manager
const pm = detectPackageManager()

// Generate install command
const selectedFeatures = [FEATURES.core, FEATURES.markdown]
const command = generateInstallCommand(selectedFeatures, pm)

// Calculate bundle size
const totalSize = calculateTotalSize(selectedFeatures)
```

### CI/CD Integration

For automated installations, you can skip the interactive prompts:

```bash
# Install minimal preset (non-interactive)
echo "P1" | node scripts/install-peers.js

# Or use direct commands from your CI config
pnpm add react framer-motion lucide-react zod
```

### Custom Presets

To add custom presets, edit the `applyPreset` function in `install-peers.js`:

```javascript
case '6': // Your custom preset
  return ['core', 'reactDom', 'customFeature']
```

## Testing

Test the script locally:

```bash
# Test with pnpm
pnpm install-peers

# Test with npm
npm run install-peers

# Test directly
node scripts/install-peers.js
```

## Troubleshooting

### "Cannot find module" error

Make sure you're running Node.js 16+ with ES modules support:

```bash
node --version  # Should be 16.0.0 or higher
```

### Colors not showing

If colors aren't displaying correctly:

- Check if your terminal supports ANSI colors
- Some CI environments don't support colors
- The tool gracefully degrades to plain text

### Package manager not detected

If your package manager isn't detected correctly:

- The tool defaults to npm
- You can still use the generated commands with your preferred PM
- Edit `detectPackageManager()` to add custom detection

## Contributing

To improve the tool:

1. Edit `scripts/install-peers.js`
2. Update `FEATURES` object for new dependencies
3. Test with all package managers
4. Update this README
5. Submit a PR

## Related Documentation

- [Main README](/packages/react/README.md)
- [Peer Dependencies Guide](/packages/react/PEER_DEPENDENCIES_DOCUMENTATION.md)
- [Migration Guide](/packages/react/MIGRATION_GUIDE.md)
- [Quick Start](/packages/react/QUICK_START.md)

## License

MIT - See LICENSE file in the repository root.
