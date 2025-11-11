import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Installation - Clarity Chat',
  description: 'This guide covers different ways to install and set up Clarity Chat in your project.',
}

export default function InstallationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Installation</h1>
        <p className="docs-lead">
          This guide covers different ways to install and set up Clarity Chat in your project.
        </p>
      </div>

      <section className="docs-section">
        <h2>Package Managers</h2>

        <h3>npm</h3>
        <CodeBlock language="bash" code="npm install @clarity-chat/react" />

        <h3>yarn</h3>
        <CodeBlock language="bash" code="yarn add @clarity-chat/react" />

        <h3>pnpm</h3>
        <CodeBlock language="bash" code="pnpm add @clarity-chat/react" />
      </section>

      <section className="docs-section">
        <h2>Framework-Specific Setup</h2>

        <h3>Next.js (App Router)</h3>
        <p>1. Install the package:</p>
        <CodeBlock language="bash" code="npm install @clarity-chat/react" />
        
        <p>2. Create a client component:</p>
        <CodeBlock
          language="tsx"
          code={`// app/components/Chat.tsx
'use client'

import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  // ... rest of your component
}`}
        />

        <p>3. Import CSS in your layout:</p>
        <CodeBlock
          language="tsx"
          code={`// app/layout.tsx
import '@clarity-chat/react/styles.css'`}
        />

        <h3>Next.js (Pages Router)</h3>
        <CodeBlock
          language="tsx"
          code={`// pages/_app.tsx
import '@clarity-chat/react/styles.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}`}
        />

        <h3>Remix</h3>
        <CodeBlock
          language="tsx"
          code={`// app/root.tsx
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
}`}
        />

        <h3>Vite</h3>
        <CodeBlock
          language="tsx"
          code={`// src/main.tsx
import '@clarity-chat/react/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`}
        />
      </section>

      <section className="docs-section">
        <h2>TypeScript Setup</h2>
        <p>If you&apos;re using TypeScript, you&apos;re all set! The library includes type definitions out of the box.</p>

        <h3>tsconfig.json</h3>
        <p>Make sure your <code>tsconfig.json</code> includes:</p>
        <CodeBlock
          language="json"
          code={`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}`}
        />

        <h3>Type Imports</h3>
        <p>Import types directly from the types package:</p>
        <CodeBlock
          language="tsx"
          code={`import type { Message, ChatWindowProps } from '@clarity-chat/types'`}
        />
      </section>

      <section className="docs-section">
        <h2>CSS Setup</h2>

        <h3>Default Styles</h3>
        <p>Import the default stylesheet:</p>
        <CodeBlock language="tsx" code={`import '@clarity-chat/react/styles.css'`} />

        <h3>Tailwind CSS</h3>
        <p>If you&apos;re using Tailwind CSS, add the package to your content array:</p>
        <CodeBlock
          language="js"
          code={`// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
}`}
        />

        <h3>CSS Modules</h3>
        <p>The library supports CSS Modules. Import styles in your components:</p>
        <CodeBlock
          language="tsx"
          code={`import styles from './Chat.module.css'

<ChatWindow className={styles.chatWindow} />`}
        />
      </section>

      <section className="docs-section">
        <h2>Peer Dependencies</h2>
        <p>Clarity Chat requires these peer dependencies:</p>
        <CodeBlock
          language="json"
          code={`{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}`}
        />
        <p>These are typically already installed in your project.</p>
      </section>

      <section className="docs-section">
        <h2>Optional Dependencies</h2>

        <h3>Framer Motion (for animations)</h3>
        <CodeBlock language="bash" code="npm install framer-motion" />

        <h3>React Markdown (for message formatting)</h3>
        <CodeBlock language="bash" code="npm install react-markdown" />

        <h3>Highlight.js (for code syntax highlighting)</h3>
        <CodeBlock language="bash" code="npm install highlight.js" />
      </section>

      <section className="docs-section">
        <h2>Monorepo Setup</h2>
        <p>If you&apos;re using a monorepo (Turborepo, Nx, etc.), install at the workspace level:</p>
        <CodeBlock language="bash" code="# From workspace root\nnpm install @clarity-chat/react -w your-app-name" />
        <p>Or add to your app&apos;s package.json:</p>
        <CodeBlock
          language="json"
          code={`{
  "dependencies": {
    "@clarity-chat/react": "^1.0.0"
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Verification</h2>
        <p>Verify your installation by creating a simple test component:</p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'

export function Test() {
  return (
    <div style={{ width: '400px', height: '500px' }}>
      <ChatWindow messages={[]} onSendMessage={() => {}} />
    </div>
  )
}`}
        />
        <p>If this renders without errors, you&apos;re all set!</p>
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>Module Not Found</h3>
        <p>If you see &quot;Module not found&quot; errors:</p>
        <ol>
          <li>Clear your cache:
            <CodeBlock language="bash" code="rm -rf node_modules .next\nnpm install" />
          </li>
          <li>Restart your dev server</li>
        </ol>

        <h3>Type Errors</h3>
        <p>If TypeScript can&apos;t find types:</p>
        <ol>
          <li>Make sure <code>skipLibCheck</code> is <code>false</code> in tsconfig.json</li>
          <li>Delete <code>node_modules</code> and reinstall</li>
          <li>Restart your TypeScript server in your editor</li>
        </ol>

        <h3>Style Issues</h3>
        <p>If components appear unstyled:</p>
        <ol>
          <li>Make sure you imported the CSS file</li>
          <li>Check that your bundler processes CSS files</li>
          <li>Verify CSS file path in your build output</li>
        </ol>

        <h3>Build Errors</h3>
        <p>If you get build errors:</p>
        <ol>
          <li>Update to the latest version:
            <CodeBlock language="bash" code="npm update @clarity-chat/react" />
          </li>
          <li>Check your bundler configuration</li>
          <li>Ensure peer dependencies are correct versions</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/guides/getting-started">Getting Started</a> - Create your first chat</li>
          <li><a href="/guides/quick-start">Quick Start</a> - Learn the basics</li>
          <li><a href="/examples">Examples</a> - See working demos</li>
        </ul>
      </section>
    </div>
  )
}
