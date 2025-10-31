# Clarity Chat Documentation Site

> Production-ready documentation site built with Next.js 14, inspired by React.dev

## 🚀 Features

- **Next.js 14** with App Router and React Server Components
- **MDX** for interactive documentation with embedded React components
- **Sandpack** for live code editing and previewing
- **Instant Search** powered by Fuse.js with Cmd+K support
- **Dark Mode** with seamless theme switching
- **Syntax Highlighting** with Prism React Renderer
- **Framer Motion** animations for delightful UX
- **TypeScript** throughout for type safety
- **Tailwind CSS** for beautiful, responsive styling
- **Accessibility** WCAG AAA compliant

## 📁 Structure

```
apps/docs-site/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Homepage
│   ├── providers.tsx       # Theme and MDX providers
│   ├── learn/              # Tutorial-style content
│   ├── reference/          # API documentation
│   ├── examples/           # Code examples
│   └── blog/               # Blog posts
├── components/
│   ├── MDX/                # MDX custom components
│   │   ├── CodeBlock.tsx   # Syntax-highlighted code
│   │   ├── Callout.tsx     # Info/Warning/Error boxes
│   │   └── mdx-components.tsx
│   ├── Demo/               # Live demos
│   ├── Navigation/         # Header, search, etc.
│   └── Layout/             # Page layouts
├── content/                # MDX content files
├── lib/                    # Utilities
├── styles/                 # Global styles
└── public/                 # Static assets
```

## 🛠️ Development

```bash
# Install dependencies (from root)
npm install

# Run development server
npm run dev --workspace=@clarity-chat/docs-site

# Or from this directory
cd apps/docs-site
npm run dev
```

The site will be available at `http://localhost:3001`

## 📝 Writing Documentation

### MDX Files

Create MDX files in the `content/` directory:

```mdx
---
title: Getting Started
description: Learn how to install and use Clarity Chat
---

# Getting Started

<Callout type="info">
  This is an info callout!
</Callout>

## Installation

\`\`\`bash
npm install @clarity-chat/react
\`\`\`

## Example

\`\`\`tsx
import { ChatWindow } from '@clarity-chat/react'

function App() {
  return <ChatWindow />
}
\`\`\`
```

### Available Components

- `<Callout>` - Info, warning, error, success, tip boxes
- `<CodeBlock>` - Syntax-highlighted code with copy button
- `<Sandpack>` - Live code editor (from @codesandbox/sandpack-react)

## 🎨 Design System

Inspired by React.dev:

- **Colors**: Brand blues, semantic colors (success, warning, error)
- **Typography**: Geist Sans & Geist Mono fonts
- **Spacing**: Consistent 8px grid system
- **Animations**: Subtle, purposeful motion
- **Dark Mode**: Seamless switching with next-themes

## 📦 Building

```bash
npm run build
```

## 🚢 Deployment

The site can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Cloudflare Pages**
- Any platform supporting Next.js

## 🎯 Goals

1. **Masterful Documentation**: Comprehensive, actionable, easy to follow
2. **Copy-Paste Ready**: All code examples work out of the box
3. **Beautiful Design**: Delightful, professional appearance
4. **Fast Performance**: Optimized for speed
5. **Accessibility**: WCAG AAA compliant
6. **SEO**: Excellent search engine optimization

## 📚 Inspiration

- [React.dev](https://react.dev) - Beautiful design and interactive examples
- [Next.js Docs](https://nextjs.org/docs) - Clear structure and navigation
- [Tailwind CSS](https://tailwindcss.com) - Excellent search and organization

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the root directory.

## 📄 License

MIT - See [LICENSE](../../LICENSE)
