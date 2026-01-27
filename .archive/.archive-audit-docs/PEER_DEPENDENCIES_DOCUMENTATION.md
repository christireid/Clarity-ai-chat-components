# Peer Dependencies Documentation

This document provides a comprehensive overview of all peer dependencies in @clarity-chat/react and their usage across components.

## Summary of Peer Dependencies

| Package | Status | Bundle Impact | Components Using It |
|---------|--------|---------------|---------------------|
| **react** | Required | ~40KB | All components |
| **react-dom** | Optional | ~130KB | Browser-only components |
| **framer-motion** | Required | ~80KB | Animation utilities, animated components |
| **lucide-react** | Required | ~5KB (tree-shakeable) | Icon components |
| **zod** | Required | ~15KB | Form validation, type safety |
| **shiki** | Optional | ~200KB | CodeBlock, StreamingCodeBlock |
| **react-markdown** | Optional | ~50KB | EnhancedMarkdownRenderer |
| **remark-gfm** | Optional | ~15KB | EnhancedMarkdownRenderer (GitHub Flavored Markdown) |
| **rehype-highlight** | Optional | ~30KB | EnhancedMarkdownRenderer (syntax highlighting) |
| **mermaid** | Optional | ~300KB | EnhancedMarkdownRenderer (diagrams) |
| **flowtoken** | Optional | ~15KB | FlowTokenStreamingText, FlowTokenMarkdown |
| **pdfjs-dist** | Optional | ~600KB | PDFLoader |
| **mammoth** | Optional | ~100KB | DOCXLoader (Word documents) |
| **jszip** | Optional | ~100KB | DOCXLoader, export utilities |
| **cohere-ai** | Optional | ~50KB | CohereReranker, CohereEmbedder |
| **prismjs** | Optional | ~20KB | Legacy syntax highlighting (deprecated) |

## Component Documentation Updates

All components using optional peer dependencies now include comprehensive JSDoc comments with:

1. **@requires** - Lists required peer dependencies
2. **@installation** - Shows installation command
3. **@bundleImpact** - Documents bundle size impact
4. **@fallback** - Describes behavior when dependency is missing
5. **@docs** - Links to detailed documentation

### Example

```typescript
/**
 * @requires shiki - Syntax highlighting (npm install shiki)
 * @bundleImpact ~200KB when installed
 * @fallback Basic <pre><code> rendering without syntax highlighting
 * @docs https://clarity-chat.dev/docs/peer-dependencies
 */
```

## Updated Components

### Code Highlighting

#### CodeBlock
- **Location**: `src/components/code/CodeBlock.tsx`
- **Peer Dependency**: `shiki` (optional)
- **Bundle Impact**: ~200KB
- **Fallback**: Basic `<pre><code>` rendering with warning banner
- **Installation**: `npm install shiki`

#### StreamingCodeBlock
- **Location**: `src/components/code/StreamingCodeBlock.tsx`
- **Peer Dependency**: `shiki` (optional)
- **Bundle Impact**: ~200KB (lazy-loaded)
- **Fallback**: Plain text rendering
- **Installation**: `npm install shiki`

### Markdown Rendering

#### EnhancedMarkdownRenderer
- **Location**: `src/components/ai/EnhancedMarkdownRenderer.tsx`
- **Peer Dependencies**:
  - `react-markdown` (optional, ~50KB)
  - `remark-gfm` (optional, ~15KB)
  - `rehype-highlight` (optional, ~30KB)
  - `mermaid` (optional, ~300KB, only if enableMermaid=true)
- **Bundle Impact**: ~50KB base, up to ~400KB with all features
- **Fallback**: Plain text with basic formatting
- **Installation**: `npm install react-markdown remark-gfm rehype-highlight mermaid`

### Virtualization (Direct Dependencies)

#### VirtualizedMessageList
- **Location**: `src/components/chat/VirtualizedMessageList.tsx`
- **Dependencies**: `react-window`, `react-virtualized-auto-sizer` (direct, not peer)
- **Bundle Impact**: ~11KB (included)
- **Note**: These are direct dependencies, no installation needed

#### TanStackMessageList
- **Location**: `src/components/chat/TanstackMessageList.tsx`
- **Dependencies**: `@tanstack/react-virtual` (direct, not peer)
- **Bundle Impact**: ~7KB (included)
- **Note**: This is a direct dependency, no installation needed

### Document Loaders

#### PDFLoader
- **Location**: `src/document-loaders/pdf-loader.ts`
- **Peer Dependency**: `pdfjs-dist` (optional)
- **Bundle Impact**: ~600KB (includes worker)
- **Fallback**: Throws error with setup instructions
- **Installation**: `npm install pdfjs-dist`
- **Additional Setup Required**: Worker configuration

```typescript
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
```

#### DOCXLoader
- **Location**: `src/document-loaders/docx-loader.ts`
- **Peer Dependency**: `jszip` (optional)
- **Bundle Impact**: ~100KB
- **Fallback**: Returns error document with installation instructions
- **Installation**: `npm install jszip`

### RAG and Embeddings

#### CohereReranker
- **Location**: `src/reranking/cohere.ts`
- **Peer Dependency**: `cohere-ai` (optional)
- **Bundle Impact**: ~50KB
- **Alternative**: Use `SimpleReranker` for local reranking
- **Installation**: `npm install cohere-ai`
- **Note**: Requires Cohere API key from https://cohere.com

### Animations

#### FlowTokenStreamingText
- **Location**: `src/components/message/FlowtokenAdapter.tsx`
- **Peer Dependency**: `flowtoken` (optional)
- **Bundle Impact**: ~15KB
- **Fallback**: Static text without animations
- **Installation**: `npm install flowtoken`

#### Motion-Safe Utilities
- **Location**: `src/animations/motion-safe.ts`
- **Peer Dependency**: `framer-motion` (required)
- **Bundle Impact**: ~80KB
- **Note**: Required peer dependency for all animated components
- **Installation**: `npm install framer-motion`

## Installation Guide

### Minimal Installation

For basic chat functionality without optional features:

```bash
npm install @clarity-chat/react react react-dom framer-motion lucide-react zod
```

### Full Installation

For all features including code highlighting, markdown, and document loading:

```bash
# Base installation
npm install @clarity-chat/react react react-dom framer-motion lucide-react zod

# Code highlighting
npm install shiki

# Markdown rendering
npm install react-markdown remark-gfm rehype-highlight mermaid

# Document loaders
npm install pdfjs-dist jszip

# Advanced features
npm install flowtoken cohere-ai
```

### Selective Installation

Install only the features you need:

```bash
# For code highlighting only
npm install shiki

# For markdown rendering only
npm install react-markdown remark-gfm rehype-highlight

# For document loading only
npm install pdfjs-dist jszip

# For RAG with reranking
npm install cohere-ai
```

## Bundle Size Considerations

### Total Impact by Feature

| Feature | Dependencies | Combined Size |
|---------|--------------|---------------|
| Code Highlighting | shiki | ~200KB |
| Markdown Rendering | react-markdown + remark-gfm + rehype-highlight | ~95KB |
| Diagrams | mermaid | ~300KB |
| PDF Loading | pdfjs-dist | ~600KB |
| DOCX Loading | jszip | ~100KB |
| Reranking | cohere-ai | ~50KB |
| Animations | flowtoken | ~15KB |

### Recommendations

1. **Start Small**: Install only base dependencies initially
2. **Add Features**: Install optional dependencies as needed
3. **Tree Shaking**: Ensure your bundler supports tree shaking
4. **Code Splitting**: Use dynamic imports for large features like PDF loading
5. **Monitor Bundle**: Use tools like `webpack-bundle-analyzer` to track size

## Migration from Previous Versions

If you're upgrading from a version where these were bundled:

### Before (< 1.1.0)
```bash
npm install @clarity-chat/react
# Everything was included
```

### After (>= 1.1.0)
```bash
# Install base package
npm install @clarity-chat/react

# Install optional features you use
npm install shiki react-markdown remark-gfm rehype-highlight
```

## Troubleshooting

### "Module not found" errors

If you see errors like:
```
Module not found: Can't resolve 'shiki'
```

Install the missing peer dependency:
```bash
npm install shiki
```

### TypeScript errors with peer dependencies

Ensure all peer dependencies used by your code are installed and have type definitions.

### Bundle size too large

1. Check which optional dependencies are installed
2. Remove unused dependencies: `npm uninstall [package]`
3. Use dynamic imports for large features
4. Enable tree shaking in your bundler

## Documentation Links

- [Peer Dependencies Guide](https://clarity-chat.dev/docs/peer-dependencies)
- [Code Highlighting Setup](https://clarity-chat.dev/docs/components/code-block)
- [Markdown Rendering](https://clarity-chat.dev/docs/components/markdown-renderer)
- [Document Loaders](https://clarity-chat.dev/docs/document-loaders)
- [RAG Setup](https://clarity-chat.dev/docs/rag/setup)
- [Animation System](https://clarity-chat.dev/docs/animations)

## Support

For questions or issues related to peer dependencies:
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Documentation](https://clarity-chat.dev/docs)
- [Discord Community](https://discord.gg/clarity-chat)
