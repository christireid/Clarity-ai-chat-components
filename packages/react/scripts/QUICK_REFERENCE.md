# Peer Dependencies Installer - Quick Reference

One-page reference for the peer dependencies installation helper.

## Commands

### Interactive Mode

```bash
pnpm install-peers
```

### Preset Installations (CI/CD)

```bash
pnpm install-peers:minimal    # 580 KB - Core + React DOM
pnpm install-peers:standard   # 860 KB - + Markdown + Code (default)
pnpm install-peers:full       # 1.7 MB - All features
pnpm install-peers:document   # 1.1 MB - RAG-optimized setup
```

### Get Command Only

```bash
pnpm install-peers:cmd [preset] [pm]

# Examples
pnpm install-peers:cmd standard pnpm
pnpm install-peers:cmd minimal npm

# Use with eval
eval $(pnpm install-peers:cmd standard)
```

## Presets

| Preset | Size | Features | Use Case |
|--------|------|----------|----------|
| **Minimal** | 580 KB | Core + React DOM | Basic chat |
| **Standard** | 860 KB | + Markdown + Code highlighting | Docs/support |
| **Full** | 1.7 MB | All features | Enterprise |
| **Document** | 1.1 MB | + PDF/DOCX + Reranking | RAG/Q&A |

## Features

| Feature | Dependencies | Size | Optional |
|---------|-------------|------|----------|
| Core | react, framer-motion, lucide-react, zod | 450 KB | No |
| React DOM | react-dom | 130 KB | Yes |
| Markdown | react-markdown, remark-gfm, rehype-highlight | 85 KB | Yes |
| Code Highlighting | shiki, prismjs | 195 KB | Yes |
| Diagrams | mermaid | 320 KB | Yes |
| Document Processing | pdfjs-dist, mammoth | 450 KB | Yes |
| Export | jszip | 120 KB | Yes |
| Reranking | cohere-ai | 65 KB | Yes |
| Token Optimization | flowtoken | 40 KB | Yes |

## Direct Script Usage

```bash
# Interactive
node scripts/install-peers.js

# CI/CD with preset
node scripts/install-peers-ci.js [preset]

# Custom features
node scripts/install-peers-ci.js custom core reactDom markdown

# Get command only
node scripts/get-install-command.js [preset] [pm]
```

## Package Manager Support

Auto-detected or specify explicitly:
- npm
- yarn
- pnpm
- bun

## Example Workflows

### New Project Setup

```bash
# 1. Choose features interactively
pnpm install-peers

# 2. Run the generated command
pnpm add react@"^18.0.0" ...

# 3. Install Clarity Chat
pnpm add @clarity-chat/react
```

### CI/CD

```yaml
# .github/workflows/install.yml
- name: Install peers
  run: pnpm install-peers:standard

- name: Install Clarity Chat
  run: pnpm add @clarity-chat/react
```

### Docker

```dockerfile
# Get install command and run it
RUN node scripts/install-peers-ci.js minimal && \
    pnpm add react framer-motion lucide-react zod react-dom
```

### Scripting

```bash
# Save to file
pnpm install-peers:cmd standard > install.sh
chmod +x install.sh
./install.sh

# Or eval directly
eval $(pnpm install-peers:cmd standard)
```

## Common Use Cases

### Basic Chat Widget

```bash
pnpm install-peers:minimal
```

### Documentation Site

```bash
pnpm install-peers:standard
```

### PDF Document Q&A

```bash
pnpm install-peers:document
```

### Full-Featured Enterprise App

```bash
pnpm install-peers:full
```

## Troubleshooting

### "Cannot find module"

Requires Node.js 16+

```bash
node --version  # Should be 16.0.0+
```

### Package manager not detected

Falls back to npm, or specify explicitly:

```bash
pnpm install-peers:cmd standard pnpm
```

### Bundle too large

Use minimal or custom selection:

```bash
# Check sizes first
pnpm install-peers:minimal   # 580 KB
pnpm install-peers:standard  # 860 KB
pnpm install-peers:full      # 1.7 MB

# Choose appropriate size
```

## Files

- `scripts/install-peers.js` - Interactive CLI
- `scripts/install-peers-ci.js` - CI/CD version
- `scripts/get-install-command.js` - Command-only output
- `scripts/INSTALL_PEERS_README.md` - Full documentation
- `scripts/USAGE_EXAMPLES.md` - Real-world examples
- `scripts/INSTALLATION_HELPER_SUMMARY.md` - Complete guide
- `scripts/install-peers.test.js` - Test suite

## Quick Tips

1. Start with minimal, add features as needed
2. Use standard preset for most projects
3. Only use full if you need all features
4. Document preset is optimized for RAG
5. Check bundle sizes before committing

## Links

- [Installation Guide](./INSTALL_PEERS_README.md)
- [Usage Examples](./USAGE_EXAMPLES.md)
- [Complete Summary](./INSTALLATION_HELPER_SUMMARY.md)
- [Main README](../README.md)
- [Peer Dependencies Guide](../PEER_DEPENDENCIES_DOCUMENTATION.md)

---

**Last Updated**: January 26, 2026
