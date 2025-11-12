# Installation

This guide covers different ways to install and set up Clarity Chat in your project.

## Package Managers

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

## Framework-Specific Setup

### Next.js (App Router)

1. Install the package:

```bash
npm install @clarity-chat/react
```

2. Create a client component:

```tsx
// app/components/Chat.tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  // ... rest of your component
}
```

3. Import CSS in your layout:

```tsx
// app/layout.tsx
import '@clarity-chat/react/styles.css'
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import '@clarity-chat/react/styles.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

### Remix

```tsx
// app/root.tsx
import { Links, LiveReload, Meta, Outlet, Scripts } from '@remix-run/react'
import styles from '@clarity-chat/react/styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
```

### Vite

```tsx
// src/main.tsx
import '@clarity-chat/react/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## TypeScript Setup

If you're using TypeScript, you're all set! The library includes type definitions out of the box.

### tsconfig.json

Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

### Type Imports

Import types directly from the types package:

```tsx
import type { Message, ChatWindowProps } from '@clarity-chat/types'
```

## CSS Setup

### Default Styles

Import the default stylesheet:

```tsx
import '@clarity-chat/react/styles.css'
```

### Tailwind CSS

If you're using Tailwind CSS, add the package to your content array:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
}
```

### CSS Modules

The library supports CSS Modules. Import styles in your components:

```tsx
import styles from './Chat.module.css'

<ChatWindow className={styles.chatWindow} />
```

## Peer Dependencies

Clarity Chat requires these peer dependencies:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

These are typically already installed in your project.

## Optional Dependencies

### Framer Motion (for animations)

```bash
npm install framer-motion
```

### React Markdown (for message formatting)

```bash
npm install react-markdown
```

### Highlight.js (for code syntax highlighting)

```bash
npm install highlight.js
```

## Monorepo Setup

If you're using a monorepo (Turborepo, Nx, etc.), install at the workspace level:

```bash
# From workspace root
npm install @clarity-chat/react -w your-app-name
```

Or add to your app's package.json:

```json
{
  "dependencies": {
    "@clarity-chat/react": "^1.0.0"
  }
}
```

## Verification

Verify your installation by creating a simple test component:

```tsx
import { ChatWindow } from '@clarity-chat/react'

export function Test() {
  return (
    <div style={{ width: '400px', height: '500px' }}>
      <ChatWindow messages={[]} onSendMessage={() => {}} />
    </div>
  )
}
```

If this renders without errors, you're all set!

## Troubleshooting

### Module Not Found

If you see "Module not found" errors:

1. Clear your cache:
   ```bash
   rm -rf node_modules .next
   npm install
   ```

2. Restart your dev server

### Type Errors

If TypeScript can't find types:

1. Make sure `skipLibCheck` is `false` in tsconfig.json
2. Delete `node_modules` and reinstall
3. Restart your TypeScript server in your editor

### Style Issues

If components appear unstyled:

1. Make sure you imported the CSS file
2. Check that your bundler processes CSS files
3. Verify CSS file path in your build output

### Build Errors

If you get build errors:

1. Update to the latest version:
   ```bash
   npm update @clarity-chat/react
   ```

2. Check your bundler configuration
3. Ensure peer dependencies are correct versions

## Next Steps

- **[Getting Started](/guide/getting-started)** - Create your first chat
- **[Quick Start](/guide/quick-start)** - Learn the basics
- **[Examples](/examples/)** - See working demos
