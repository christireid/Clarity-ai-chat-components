# Installation Guide

This guide will walk you through installing Clarity Chat in your React application.

---

## 📋 **Prerequisites**

Before installing, make sure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)
- **React** >= 18.0.0
- **TypeScript** >= 5.0.0 (optional but recommended)

---

## 📦 **Installation Methods**

### **Option 1: npm (Recommended)**

```bash
npm install @clarity-chat/react
```

### **Option 2: yarn**

```bash
yarn add @clarity-chat/react
```

### **Option 3: pnpm**

```bash
pnpm add @clarity-chat/react
```

---

## 🎨 **Install Additional Packages (Optional)**

Depending on your needs, you may want to install additional packages:

### **Error Handling System**
```bash
npm install @clarity-chat/error-handling
```

### **TypeScript Types Only**
```bash
npm install @clarity-chat/types
```

### **Primitive Components**
```bash
npm install @clarity-chat/primitives
```

---

## ⚙️ **Setup CSS**

Clarity Chat requires importing the base styles. Choose one method:

### **Method 1: Import in your main entry file**

```tsx
// src/main.tsx or src/index.tsx
import '@clarity-chat/react/styles.css'
```

### **Method 2: Import in your root component**

```tsx
// src/App.tsx
import '@clarity-chat/react/styles.css'
import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  return <ChatWindow {...props} />
}
```

### **Method 3: Import in CSS file**

```css
/* src/index.css */
@import '@clarity-chat/react/styles.css';
```

---

## 🔧 **Framework-Specific Setup**

### **Next.js (App Router)**

```tsx
// app/layout.tsx
import '@clarity-chat/react/styles.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My AI Chat App',
  description: 'Built with Clarity Chat',
}

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
// app/page.tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])

  return (
    <main className="h-screen">
      <ChatWindow
        messages={messages}
        onSendMessage={async (content) => {
          // Your implementation
        }}
      />
    </main>
  )
}
```

### **Next.js (Pages Router)**

```tsx
// pages/_app.tsx
import '@clarity-chat/react/styles.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

### **Vite + React**

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@clarity-chat/react/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### **Create React App**

```tsx
// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
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

---

## 🎯 **Tailwind CSS Integration (Optional)**

If you're using Tailwind CSS, add Clarity Chat to your content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@clarity-chat/**/*.{js,ts,jsx,tsx}', // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## ✅ **Verify Installation**

Create a simple test component to verify everything works:

```tsx
// src/TestChat.tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import { useState } from 'react'

export default function TestChat() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! Clarity Chat is working perfectly! 🎉',
      timestamp: new Date(),
    },
  ])

  const handleSend = async (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `You said: "${content}"`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div className="h-screen">
      <ThemeProvider theme={themes.ocean}>
        <ChatWindow messages={messages} onSendMessage={handleSend} />
      </ThemeProvider>
    </div>
  )
}
```

If you see a working chat interface, you're all set! 🎉

---

## 🚨 **Troubleshooting**

### **Problem: Styles not loading**

**Solution:** Make sure you've imported the CSS file:
```tsx
import '@clarity-chat/react/styles.css'
```

### **Problem: TypeScript errors**

**Solution:** Ensure you have the correct TypeScript version:
```bash
npm install -D typescript@^5.0.0
```

### **Problem: Module not found errors**

**Solution:** Clear your package manager cache:
```bash
# npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# yarn
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# pnpm
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### **Problem: React version mismatch**

**Solution:** Update to React 18+:
```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

---

## 🔄 **Updating**

To update to the latest version:

```bash
npm update @clarity-chat/react
```

Check the [CHANGELOG.md](../../CHANGELOG.md) for breaking changes.

---

## 📚 **Next Steps**

Now that you've installed Clarity Chat:

1. **[Quick Start Guide](./quick-start.md)** - Build your first chat app
2. **[First Component Tutorial](./first-component.md)** - Understand core concepts
3. **[API Reference](../api/components.md)** - Explore all components

---

## 🤝 **Need Help?**

- 📖 [Documentation](../README.md)
- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

---

**Next:** [Quick Start Guide →](./quick-start.md)
