# Code Assistant

A demonstration of Clarity Chat Components showcasing markdown, export, streaming.

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
- `jszip` - ZIP file generation for exports
- `react-markdown` - Markdown renderer
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-highlight` - Code highlighting for markdown

All dependencies are already included in `package.json`. Just run `pnpm install`.

## Features

- Rich markdown rendering with GFM support
- Batch export and download capabilities
- Real-time streaming responses

## Bundle Size

Estimated production bundle size (gzipped): **352KB**

This includes:
- Core Clarity Chat components
- Required peer dependencies (React, Framer Motion, Lucide, Zod)
- Markdown rendering ecosystem


## Project Structure

```
code-assistant/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   └── lib/
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

### Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/code-assistant)

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
# Your AI provider API key
OPENAI_API_KEY=your-openai-api-key
# or
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Key Features Explained

### Markdown

Rich markdown rendering with GFM support.

### Export

Batch export and download capabilities.

### Streaming

Real-time streaming responses.

## Customization

### Styling

This example uses Tailwind CSS. Customize the theme in `tailwind.config.ts`:

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

- [Streaming Chat](../streaming-chat) - Real-time streaming
- [Basic Chat](../basic-chat) - Simple Vite example

## License

MIT - see repository root for details
