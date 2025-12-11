# @clarity-chat/playground

Interactive component playground and REPL for Clarity Chat - a commercial-grade live code editing
experience that rivals CodeSandbox, StackBlitz, and CodePen.

## Features

- **Live Code Editor** - Monaco Editor with TypeScript support, syntax highlighting, and
  auto-formatting
- **Real-time Preview** - Hot-reload preview with Babel transpilation
- **Template Library** - 10+ pre-built templates covering chat, streaming, memory, and advanced
  patterns
- **URL Sharing** - Shareable URLs with lz-string compression (like TypeScript Playground)
- **Export Options** - One-click export to CodeSandbox and StackBlitz
- **Console Panel** - Built-in console output viewer with filtering
- **Customizable Settings** - Auto-run, line numbers, word wrap, font size, and more
- **Dark/Light Mode** - Full theme support

## Quick Start

### Development

```bash
pnpm --filter @clarity-chat/playground dev
```

Open [http://localhost:3001](http://localhost:3001)

### Build

```bash
pnpm --filter @clarity-chat/playground build
```

## API Reference

### Templates

```tsx
import {
  templates, // Array of all templates
  templateCategories, // Category metadata (label, icon, description)
  getTemplateById, // Get a single template by ID
  getTemplatesByCategory, // Get templates by category
  searchTemplates, // Search templates by query
} from '@clarity-chat/playground'

// Available categories:
// - getting-started
// - chat-components
// - streaming
// - controls
// - advanced
// - memory
// - patterns
```

### URL State Utilities

```tsx
import {
  compress, // Compress string with lz-string
  decompress, // Decompress lz-string
  encodePlaygroundState, // Encode full state for URL
  decodePlaygroundState, // Decode state from URL
  createShareableUrl, // Generate shareable URL
  parseUrlState, // Parse state from current URL
  updateUrlState, // Update browser URL without navigation
  copyShareableUrl, // Copy URL to clipboard
  estimateCompressionRatio, // Get compression stats
  isShareable, // Check if state fits in URL
} from '@clarity-chat/playground'

// Example: Create a shareable URL
const state = {
  code: 'const x = 1',
  theme: 'dark',
  settings: {
    autoRun: true,
    lineNumbers: true,
    fontSize: 14,
    tabSize: 2,
    wordWrap: false,
    minimap: false,
  },
}
const { url, shortened } = createShareableUrl(state)
```

### Export Utilities

```tsx
import {
  generateCodeSandboxUrl, // Generate CodeSandbox URL
  generateStackBlitzUrl, // Generate StackBlitz URL
  openInCodeSandbox, // Open in new tab
  openInStackBlitz, // Open in new tab
  downloadAsZip, // Download as file
  copyCode, // Copy to clipboard
} from '@clarity-chat/playground'

// Example: Export to CodeSandbox
openInCodeSandbox({
  code: 'function App() { return <div>Hello</div> }',
  title: 'My Clarity Chat App',
  dependencies: { 'custom-lib': '^1.0.0' },
})
```

### Components

```tsx
import {
  LivePreview, // Preview component with iframe execution
  ComponentLibrary, // Template sidebar component
  ConsolePanel, // Console output viewer
} from '@clarity-chat/playground'
```

## Templates

| ID                    | Name                    | Category        | Description                     |
| --------------------- | ----------------------- | --------------- | ------------------------------- |
| `basic-chat`          | Basic Chat              | getting-started | Simple chat interface           |
| `streaming`           | Streaming Response      | streaming       | Word-by-word streaming          |
| `conversation`        | Multi-Turn Conversation | getting-started | Multi-turn with system messages |
| `chat-window`         | Chat Window             | chat-components | Complete chat window UI         |
| `message-bubble`      | Message Bubble          | chat-components | Custom message styling          |
| `token-counter`       | Token Counter           | controls        | Visual token count              |
| `model-selector`      | Model Selector          | controls        | AI model dropdown               |
| `function-calling`    | Function Calling        | advanced        | Tool use pattern                |
| `rag-pattern`         | RAG Pattern             | advanced        | Retrieval-augmented generation  |
| `memory-conversation` | Conversation Memory     | memory          | Session-based memory            |

## URL Parameters

The playground supports the following URL parameters:

| Parameter  | Description                                   |
| ---------- | --------------------------------------------- |
| `state`    | Full compressed state (code, settings, theme) |
| `code`     | Compressed code only                          |
| `template` | Template ID to load                           |
| `theme`    | `light` or `dark`                             |

Example URLs:

- `/playground?template=basic-chat`
- `/playground?code=<compressed>`
- `/playground?state=<compressed>`

## Architecture

```
packages/playground/
├── src/
│   ├── components/
│   │   ├── LivePreview.tsx      # Preview with iframe execution
│   │   ├── ComponentLibrary.tsx # Template sidebar
│   │   └── ConsolePanel.tsx     # Console output viewer
│   ├── templates/
│   │   └── index.ts            # Template definitions
│   ├── utils/
│   │   ├── url-state.ts        # URL compression/sharing
│   │   ├── url-state.test.ts   # Unit tests
│   │   ├── export.ts           # Export utilities
│   │   └── index.ts            # Barrel exports
│   ├── types.ts                # TypeScript definitions
│   ├── App.tsx                 # Main application
│   └── index.ts               # Package exports
├── package.json
├── vitest.config.ts
└── README.md
```

## Development

```bash
# Type checking
pnpm --filter @clarity-chat/playground typecheck

# Run tests
pnpm --filter @clarity-chat/playground test

# Build
pnpm --filter @clarity-chat/playground build

# Development server
pnpm --filter @clarity-chat/playground dev
```

## Keyboard Shortcuts

- `Cmd/Ctrl + S` - Save
- `Cmd/Ctrl + Enter` - Run code
- `Cmd/Ctrl + /` - Toggle comment
- `Cmd/Ctrl + D` - Duplicate line

## Competitive Positioning

| Feature          | Clarity Playground | CodeSandbox | StackBlitz | CodePen |
| ---------------- | ------------------ | ----------- | ---------- | ------- |
| Live editing     | Yes                | Yes         | Yes        | Yes     |
| TypeScript       | Yes                | Yes         | Yes        | Limited |
| URL sharing      | Yes (lz-string)    | Yes         | Yes        | Yes     |
| Export options   | Yes                | N/A         | N/A        | No      |
| Console panel    | Yes                | Yes         | Yes        | Yes     |
| Template library | 10+                | Many        | Many       | Limited |
| Self-hostable    | Yes                | Paid        | Paid       | No      |
| Bundle size      | ~500KB             | Heavy       | Heavy      | Medium  |

## Troubleshooting

### Preview Not Updating

- Check for syntax errors
- Ensure auto-run is enabled
- Try the manual Run button

### Import Errors

- The playground uses UMD React builds
- External imports may not work
- Use inline code only

### Performance Issues

- Disable auto-run for complex code
- Use manual Run button instead
- Clear browser cache

## License

MIT
