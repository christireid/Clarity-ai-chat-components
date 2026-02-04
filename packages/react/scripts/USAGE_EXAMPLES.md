# Peer Dependencies Installer - Usage Examples

Complete guide with real-world examples for different use cases.

## Table of Contents

- [Interactive Mode](#interactive-mode)
- [CI/CD Mode](#cicd-mode)
- [Preset Examples](#preset-examples)
- [Custom Configurations](#custom-configurations)
- [Integration Examples](#integration-examples)

---

## Interactive Mode

### Basic Usage

```bash
# Run the interactive installer
pnpm install-peers

# Or directly
node scripts/install-peers.js
```

### Example Session

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
```

---

## CI/CD Mode

### Basic Usage

```bash
# Run with preset name
node scripts/install-peers-ci.js [preset]
```

### Available Presets

- `minimal` or `min` or `p1` - Core only
- `standard` or `std` or `p2` - Standard setup (default)
- `full` or `all` or `p3` - All features
- `document` or `doc` or `rag` or `p4` - Document Q&A
- `custom` - Custom feature list

---

## Preset Examples

### 1. Minimal Setup (Basic Chat)

**Use Case**: Simple chat interface without advanced features

```bash
# Interactive
echo "P1" | node scripts/install-peers.js

# CI/CD
node scripts/install-peers-ci.js minimal
```

**Output**:
```
Package Manager: npm
Estimated Bundle Size: 580 KB

Features:
  - Core Features (450 KB)
  - React DOM (130 KB)

Installation Command:
npm install react@"^18.0.0 || ^19.0.0" framer-motion@"^12.23.25" lucide-react@"^0.500.0" zod@"^3.24.0" react-dom@"^18.0.0 || ^19.0.0"
```

**Example Code**:
```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function App() {
  return (
    <ClarityChat
      api='/api/chat'
      placeholder='Ask me anything...'
    />
  )
}
```

---

### 2. Standard Setup (Markdown + Code)

**Use Case**: Documentation, support chats, technical Q&A

```bash
# Interactive
echo "P2" | node scripts/install-peers.js

# CI/CD
node scripts/install-peers-ci.js standard
```

**Output**:
```
Package Manager: pnpm
Estimated Bundle Size: 860 KB

Features:
  - Core Features (450 KB)
  - React DOM (130 KB)
  - Markdown Rendering (85 KB)
  - Advanced Code Highlighting (195 KB)

Installation Command:
pnpm add react@"^18.0.0 || ^19.0.0" react-dom@"^18.0.0 || ^19.0.0" framer-motion@"^12.23.25" lucide-react@"^0.500.0" zod@"^3.24.0" react-markdown@"^10.0.0" remark-gfm@"^4.0.0" rehype-highlight@"^7.0.0" shiki@"^3.0.0" prismjs@"^1.29.0"
```

**Example Code**:
```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function App() {
  return (
    <ClarityChat
      api='/api/chat'
      markdown={{
        enabled: true,
        gfm: true, // GitHub Flavored Markdown
      }}
      codeHighlighting={{
        theme: 'github-dark',
        showLineNumbers: true,
      }}
    />
  )
}
```

---

### 3. Full Setup (All Features)

**Use Case**: Enterprise applications with all capabilities

```bash
# Interactive
echo "P3" | node scripts/install-peers.js

# CI/CD
node scripts/install-peers-ci.js full
```

**Output**:
```
Package Manager: yarn
Estimated Bundle Size: 1.7 MB

Features:
  - Core Features (450 KB)
  - React DOM (130 KB)
  - Markdown Rendering (85 KB)
  - Advanced Code Highlighting (195 KB)
  - Diagram Support (320 KB)
  - Document Processing (450 KB)
  - Export Features (120 KB)
  - AI Reranking (65 KB)
  - Advanced Token Optimization (40 KB)
```

**Example Code**:
```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function App() {
  return (
    <ClarityChat
      api='/api/chat'
      markdown={{ enabled: true }}
      mermaid={{ enabled: true }}
      documentUpload={{
        enabled: true,
        accept: '.pdf,.docx',
      }}
      export={{ enabled: true }}
      reranking={{
        provider: 'cohere',
        apiKey: process.env.COHERE_API_KEY,
      }}
    />
  )
}
```

---

### 4. Document Q&A Setup (RAG)

**Use Case**: Document question-answering, semantic search, RAG applications

```bash
# Interactive
echo "P4" | node scripts/install-peers.js

# CI/CD
node scripts/install-peers-ci.js document
```

**Output**:
```
Package Manager: bun
Estimated Bundle Size: 1.1 MB

Features:
  - Core Features (450 KB)
  - React DOM (130 KB)
  - Markdown Rendering (85 KB)
  - Document Processing (450 KB)
  - AI Reranking (65 KB)

Installation Command:
bun add react@"^18.0.0 || ^19.0.0" react-dom@"^18.0.0 || ^19.0.0" framer-motion@"^12.23.25" lucide-react@"^0.500.0" zod@"^3.24.0" react-markdown@"^10.0.0" remark-gfm@"^4.0.0" rehype-highlight@"^7.0.0" pdfjs-dist@"^3.0.0 || ^4.0.0" mammoth@"^1.0.0" cohere-ai@"^7.0.0"
```

**Example Code**:
```tsx
import { ClarityChat, useRAGPipeline } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function App() {
  const { addDocuments, search } = useRAGPipeline({
    embedding: 'openai',
    reranking: {
      enabled: true,
      provider: 'cohere',
    },
  })

  return (
    <ClarityChat
      api='/api/chat'
      documentUpload={{
        enabled: true,
        onUpload: async (files) => {
          await addDocuments(files)
        },
      }}
      onBeforeQuery={async (query) => {
        const context = await search(query)
        return { query, context }
      }}
    />
  )
}
```

---

## Custom Configurations

### Custom Feature Selection (Interactive)

```bash
# Run and choose P5 (Custom)
node scripts/install-peers.js

# Then select features manually:
Choose a preset (P1-P5): P5

[1] Markdown Rendering (~85 KB)
    Enhanced markdown support with syntax highlighting
    Features: GitHub Flavored Markdown, Tables, task lists, ...
Include Markdown Rendering? (y/N): y

[2] Advanced Code Highlighting (~195 KB)
    Premium syntax highlighting for code blocks
    Features: Beautiful syntax themes, 100+ language support, ...
Include Advanced Code Highlighting? (y/N): n

[3] Diagram Support (~320 KB)
    Render flowcharts, sequence diagrams, and more
    Features: Flowcharts, Sequence diagrams, Gantt charts, ...
Include Diagram Support? (y/N): y
```

### Custom Feature Selection (CI/CD)

```bash
# Specify exact features as arguments
node scripts/install-peers-ci.js custom core reactDom markdown diagrams

# Output will show only selected features
```

---

## Integration Examples

### GitHub Actions

```yaml
# .github/workflows/install.yml
name: Install Dependencies

on: [push]

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Clarity Chat Peers
        run: |
          node packages/react/scripts/install-peers-ci.js standard
          # Copy the command from output and run it

      - name: Install Clarity Chat
        run: pnpm add @clarity-chat/react
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/react/scripts/install-peers-ci.js ./scripts/

# Run peer installer (minimal for production)
RUN node scripts/install-peers-ci.js minimal && \
    # Extract and run the command
    INSTALL_CMD=$(node scripts/install-peers-ci.js minimal | grep "pnpm add" | tail -1) && \
    eval $INSTALL_CMD

# Install main package
RUN pnpm add @clarity-chat/react

# Copy app code
COPY . .

CMD ["pnpm", "start"]
```

### Package.json Scripts

```json
{
  "scripts": {
    "preinstall": "node scripts/install-peers-ci.js standard || true",
    "install-peers": "node scripts/install-peers.js",
    "install-peers:minimal": "node scripts/install-peers-ci.js minimal",
    "install-peers:full": "node scripts/install-peers-ci.js full"
  }
}
```

### Makefile

```makefile
# Makefile
.PHONY: install-minimal install-standard install-full

install-minimal:
	@echo "Installing minimal peer dependencies..."
	@node scripts/install-peers-ci.js minimal
	@# Copy and run the command manually or parse it

install-standard:
	@echo "Installing standard peer dependencies..."
	@node scripts/install-peers-ci.js standard

install-full:
	@echo "Installing all peer dependencies..."
	@node scripts/install-peers-ci.js full

install-clarity: install-standard
	pnpm add @clarity-chat/react
```

---

## Real-World Scenarios

### Scenario 1: E-commerce Support Chat

**Requirements**: Basic chat with markdown for product descriptions

```bash
node scripts/install-peers-ci.js custom core reactDom markdown
```

### Scenario 2: Code Documentation Assistant

**Requirements**: Markdown + Advanced code highlighting

```bash
node scripts/install-peers-ci.js standard
```

### Scenario 3: Legal Document Analysis

**Requirements**: Document processing, RAG, reranking

```bash
node scripts/install-peers-ci.js document
```

### Scenario 4: Engineering Wiki with Diagrams

**Requirements**: Markdown + Diagrams + Code highlighting

```bash
node scripts/install-peers-ci.js custom core reactDom markdown codeHighlighting diagrams
```

---

## Tips and Best Practices

### 1. Start Minimal, Add as Needed

```bash
# Start with minimal
node scripts/install-peers-ci.js minimal

# Later, add features incrementally
pnpm add react-markdown remark-gfm
pnpm add mermaid  # Add diagrams when needed
```

### 2. Save Installation Commands

```bash
# Save to a script
node scripts/install-peers-ci.js standard > install-peers.sh
chmod +x install-peers.sh

# Run later
./install-peers.sh
```

### 3. Use Environment Variables

```bash
# Set in CI/CD
export CLARITY_PRESET=standard
node scripts/install-peers-ci.js $CLARITY_PRESET
```

### 4. Bundle Size Monitoring

```bash
# Check before and after
node scripts/install-peers-ci.js minimal  # Note the size
node scripts/install-peers-ci.js full     # Compare

# Use size-limit for production
pnpm size
```

---

## Troubleshooting

### Issue: "Cannot find module"

**Solution**: Make sure you're running Node.js 16+

```bash
node --version  # Should be 16.0.0+
```

### Issue: Package manager not detected

**Solution**: Explicitly use the command for your PM

```bash
# The tool generates commands for all PMs
# Just use the one you need from the output
```

### Issue: Bundle too large

**Solution**: Use custom selection to exclude heavy features

```bash
# Check sizes
node scripts/install-peers-ci.js minimal   # 580 KB
node scripts/install-peers-ci.js standard  # 860 KB
node scripts/install-peers-ci.js full      # 1.7 MB

# Choose the smallest that meets your needs
```

---

## Additional Resources

- [Main README](../README.md)
- [Peer Dependencies Guide](../PEER_DEPENDENCIES_DOCUMENTATION.md)
- [Installation README](./INSTALL_PEERS_README.md)
- [Migration Guide](../MIGRATION_GUIDE.md)

---

**Last Updated**: January 26, 2026
