# Quick Start: Peer Dependencies

Quick reference for installing peer dependencies in @clarity-chat/react.

## TL;DR

### Minimal Setup (Required)
```bash
npm install @clarity-chat/react react framer-motion lucide-react zod
```

### Common Setup (Recommended)
```bash
npm install @clarity-chat/react react framer-motion lucide-react zod \
  shiki react-markdown remark-gfm rehype-highlight
```

### Full Setup (All Features)
```bash
npm install @clarity-chat/react react framer-motion lucide-react zod \
  shiki react-markdown remark-gfm rehype-highlight mermaid \
  pdfjs-dist jszip flowtoken cohere-ai
```

## By Feature

### Code Highlighting
```bash
npm install shiki
```
- **Used by**: CodeBlock, StreamingCodeBlock
- **Size**: ~200KB
- **Optional**: Falls back to plain text

### Markdown Rendering
```bash
npm install react-markdown remark-gfm rehype-highlight
```
- **Used by**: EnhancedMarkdownRenderer
- **Size**: ~95KB
- **Optional**: Falls back to plain text with basic formatting

### Diagrams
```bash
npm install mermaid
```
- **Used by**: EnhancedMarkdownRenderer (when enableMermaid=true)
- **Size**: ~300KB
- **Optional**: Diagrams won't render without it

### PDF Documents
```bash
npm install pdfjs-dist
```
- **Used by**: PDFLoader
- **Size**: ~600KB
- **Optional**: Throws error if used without installation
- **Setup**: Requires worker configuration

### Word Documents
```bash
npm install jszip
```
- **Used by**: DOCXLoader
- **Size**: ~100KB
- **Optional**: Returns error document if used without installation

### Streaming Animations
```bash
npm install flowtoken
```
- **Used by**: FlowTokenStreamingText
- **Size**: ~15KB
- **Optional**: Falls back to static text

### Reranking
```bash
npm install cohere-ai
```
- **Used by**: CohereReranker
- **Size**: ~50KB
- **Optional**: Use SimpleReranker as alternative
- **Note**: Requires API key

## Component Checker

Run this in your console to check which features you have:

```typescript
const features = {
  'Code Highlighting': typeof window !== 'undefined' && 'shiki',
  'Markdown': typeof window !== 'undefined' && 'react-markdown',
  'Diagrams': typeof window !== 'undefined' && 'mermaid',
  'PDF Loading': typeof window !== 'undefined' && 'pdfjs-dist',
  'DOCX Loading': typeof window !== 'undefined' && 'jszip',
  'FlowToken': typeof window !== 'undefined' && 'flowtoken',
  'Cohere': typeof window !== 'undefined' && 'cohere-ai',
}

Object.entries(features).forEach(([feature, available]) => {
  console.log(`${feature}: ${available ? '✓' : '✗'}`)
})
```

## Common Scenarios

### Building a Code Documentation Site
```bash
npm install shiki react-markdown remark-gfm rehype-highlight
```

### Building a RAG Application
```bash
npm install pdfjs-dist jszip cohere-ai
```

### Building a Chat Interface
```bash
npm install react-markdown remark-gfm rehype-highlight flowtoken
```

### Building a Knowledge Base
```bash
npm install shiki react-markdown remark-gfm pdfjs-dist jszip
```

## Troubleshooting

### Error: Cannot find module 'shiki'
```bash
npm install shiki
```

### Error: Cannot find module 'react-markdown'
```bash
npm install react-markdown remark-gfm rehype-highlight
```

### CodeBlock shows warning banner
Install shiki: `npm install shiki`

### Markdown shows "Install react-markdown" message
Install markdown dependencies: `npm install react-markdown remark-gfm rehype-highlight`

### PDFLoader throws error
Install pdfjs-dist: `npm install pdfjs-dist`

## Need Help?

- 📚 [Full Documentation](https://clarity-chat.dev/docs/peer-dependencies)
- 🐛 [Report Issue](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💬 [Discord Community](https://discord.gg/clarity-chat)
