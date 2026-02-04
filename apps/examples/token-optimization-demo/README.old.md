# Token Optimization Demo

A demonstration of Clarity Chat Components showcasing embeddings, export, chat-history, theming.

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Requirements

This example requires the following peer dependencies:

- `react` - React library
- `react-dom` - React DOM renderer
- `framer-motion` - Animation library for smooth transitions
- `lucide-react` - Icon library
- `zod` - TypeScript schema validation
- `cohere-ai` - Cohere API client for reranking/embeddings
- `jszip` - ZIP file generation for exports

All dependencies are already included in `package.json`. Just run `pnpm install`.

## Features

- Vector embeddings generation
- Batch export and download capabilities
- Persistent conversation history
- Dynamic theme customization

## Bundle Size

Estimated production bundle size (gzipped): **402KB**

This includes:
- Core Clarity Chat components
- Required peer dependencies (React, Framer Motion, Lucide, Zod)
- Cohere AI SDK for RAG features


## Project Structure

```
token-optimization-demo/
├── src/
│   ├── app/              # Application code
│   ├── components/       # React components
│   └── main.tsx
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Development

### Running Locally

```bash
pnpm dev
```

The app will be available at:
- Vite apps: `http://localhost:5173`
- Next.js apps: `http://localhost:3000` (or custom port)

### Building for Production

```bash
pnpm build
```


## Configuration

### API Integration

Replace the mock responses with your actual API:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
});
```

### Environment Variables

```env
# Cohere API (for RAG features)
COHERE_API_KEY=your-cohere-api-key

# Your AI provider
OPENAI_API_KEY=your-openai-api-key
```

## Key Features Explained

### Embeddings

Vector embeddings generation.

### Export

Batch export and download capabilities.

### Chat History

Persistent conversation history.

### Theming

Dynamic theme customization.

## Customization

### Styling

This example uses Tailwind CSS. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
};
```

### Components

All Clarity Chat components are customizable via props and CSS classes:

```tsx
<ChatWindow
  className="custom-class"
  theme="dark"
  // ... other props
/>
```

## Troubleshooting

### Common Issues

**Build errors about missing peer dependencies**

Run `pnpm install` to ensure all peer dependencies are installed.

**TypeScript errors**

Ensure you have the latest TypeScript version:

```bash
pnpm add -D typescript@latest
```

**Bundle size too large**

This example includes several features, which increases bundle size. For a smaller bundle:
1. Use the `/core-minimal` export for basic features
2. Import only the components you need
3. Enable tree-shaking in your bundler
4. Consider lazy loading heavy features

### Getting Help

- [Clarity Chat Documentation](https://clarity-chat.dev/docs)
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Examples Gallery](../gallery)

## Related Examples

- [Basic Chat](../basic-chat) - Simplest example
- [Customer Support](../customer-support) - Next.js with Supabase
- [Theme Builder](../theme-builder) - Theme customization

## License

MIT - see repository root for details
