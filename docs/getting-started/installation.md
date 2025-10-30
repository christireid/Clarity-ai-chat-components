# Installation

Get started with Clarity Chat Components in your React application.

## Prerequisites

- Node.js 18+ and npm 9+
- React 18+ or React 19
- TypeScript 5.3+ (recommended)

## Package Installation

### npm
```bash
npm install @clarity-chat/react
```

### yarn
```bash
yarn add @clarity-chat/react
```

### pnpm
```bash
pnpm add @clarity-chat/react
```

## Peer Dependencies

The following peer dependencies are required:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

## Basic Setup

### 1. Import Styles

Add the CSS import at the top of your application:

```tsx
// In your main App.tsx or index.tsx
import '@clarity-chat/react/styles.css'
```

### 2. Set Up Theme Provider

Wrap your application with the ThemeProvider:

```tsx
import { ThemeProvider, defaultLightTheme } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme={defaultLightTheme}>
      {/* Your app content */}
    </ThemeProvider>
  )
}
```

### 3. Use Components

Now you can import and use any Clarity Chat component:

```tsx
import { ChatWindow, Message } from '@clarity-chat/react'

function MyChat() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => {
        // Handle message sending
      }}
    />
  )
}
```

## TypeScript Setup

Clarity Chat is written in TypeScript and provides full type definitions.

### tsconfig.json

Ensure your TypeScript configuration includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Type Imports

Import types directly from the package:

```tsx
import type { Message, User, ChatConfig } from '@clarity-chat/react'
```

## Framework Integration

### Next.js 14+ (App Router)

```tsx
// app/layout.tsx
import '@clarity-chat/react/styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/chat/page.tsx
'use client'

import { ChatWindow, ThemeProvider, defaultLightTheme } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <ThemeProvider theme={defaultLightTheme}>
      <ChatWindow {...props} />
    </ThemeProvider>
  )
}
```

### Vite

```tsx
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@clarity-chat/react/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Create React App

```tsx
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@clarity-chat/react/styles.css'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## Tailwind CSS Integration

If you're using Tailwind CSS, add our package to your content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}
```

## Environment Variables

For AI provider integration, set up your environment variables:

```bash
# .env.local (Next.js) or .env (Vite)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

## Bundle Size

Clarity Chat supports tree-shaking. Import only what you need:

```tsx
// ✅ Good - only imports what's needed
import { ChatWindow } from '@clarity-chat/react'

// ❌ Avoid - imports entire library
import * as ClarityChat from '@clarity-chat/react'
```

Expected bundle sizes (gzipped):
- Full bundle: ~95KB
- Minimal chat UI: ~30KB
- Single component: ~5-15KB

## Browser Support

Clarity Chat supports all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node"
    "allowSyntheticDefaultImports": true
  }
}
```

### Style Loading Issues

If styles aren't loading:

1. Ensure you're importing the CSS file
2. Check your bundler's CSS handling configuration
3. Try importing in your root component

### TypeScript Errors

If you see TypeScript errors:

1. Update to TypeScript 5.3+
2. Add `"skipLibCheck": true` to tsconfig.json
3. Ensure React types are installed: `npm install -D @types/react @types/react-dom`

## Next Steps

- [Quick Start Guide](./quick-start.md) - Build your first chat interface
- [Components API](../api/components.md) - Explore all available components
- [Theming Guide](../guides/theming.md) - Customize the appearance
- [Examples](../../examples/README.md) - See working implementations