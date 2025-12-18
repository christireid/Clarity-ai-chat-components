'use client'

import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { InstallationFlow } from '@/components/Diagrams/InstallationFlow'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

export default function InstallationPage() {
  return (
    <>
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            Setup
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            Installation
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Learn how to install and configure Clarity Chat UI in your React
            project. We support multiple frameworks and build tools.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h2 id="requirements">Requirements</h2>
        <p>Clarity Chat UI requires the following:</p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span>
              <strong>React 18.0.0</strong> or higher
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span>
              <strong>Node.js 18.0.0</strong> or higher
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span>
              <strong>TypeScript 5.0.0</strong> or higher (recommended)
            </span>
          </li>
        </ul>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="my-8">
          <InstallationFlow />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="package-managers">Package Managers</h2>
        <p className="mb-4">Install using your preferred package manager:</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">npm</h3>
            <EnhancedCodeBlock
              code="npm install @clarity-chat/react"
              language="bash"
              showCopyButton
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">yarn</h3>
            <EnhancedCodeBlock
              code="yarn add @clarity-chat/react"
              language="bash"
              showCopyButton
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">pnpm</h3>
            <EnhancedCodeBlock
              code="pnpm add @clarity-chat/react"
              language="bash"
              showCopyButton
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">bun</h3>
            <EnhancedCodeBlock
              code="bun add @clarity-chat/react"
              language="bash"
              showCopyButton
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="peer-dependencies" className="mt-8">
          Peer Dependencies
        </h2>
        <p className="mb-4">
          Clarity Chat UI has the following peer dependencies that should
          already be in your project:
        </p>

        <EnhancedCodeBlock
          code={`{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}`}
          language="json"
          showCopyButton
        />

        <Callout type="info" className="mt-4">
          These are usually already installed in React projects. If not, install
          them with your package manager.
        </Callout>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <h2 id="import-styles" className="mt-8">
          Import Styles
        </h2>
        <p className="mb-4">
          Import the CSS file in your root component or entry file:
        </p>

        <EnhancedCodeBlock
          code={`// In your main App.tsx or index.tsx
import '@clarity-chat/react/styles.css'`}
          language="tsx"
          showCopyButton
        />
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <h2 id="framework-setup" className="mt-8">
          Framework-Specific Setup
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Next.js</h3>
            <p className="mb-4">For Next.js 13+ with App Router:</p>
            <EnhancedCodeBlock
              code={`// app/layout.tsx
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
}`}
              language="tsx"
              title="app/layout.tsx"
              showCopyButton
            />
            <Callout type="warning" className="mt-4">
              Some components use client-side features. Make sure to use{' '}
              <code>'use client'</code> directive when needed.
            </Callout>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Vite</h3>
            <p className="mb-4">
              For Vite projects, import styles in your main.tsx:
            </p>
            <EnhancedCodeBlock
              code={`// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@clarity-chat/react/styles.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`}
              language="tsx"
              title="src/main.tsx"
              showCopyButton
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Create React App</h3>
            <p className="mb-4">
              For CRA projects, import styles in index.tsx:
            </p>
            <EnhancedCodeBlock
              code={`// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@clarity-chat/react/styles.css'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`}
              language="tsx"
              title="src/index.tsx"
              showCopyButton
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <h2 id="typescript" className="mt-8">
          TypeScript Configuration
        </h2>
        <p className="mb-4">
          Clarity Chat UI is written in TypeScript and includes type
          definitions. No additional setup needed!
        </p>

        <Callout type="success" className="mb-4">
          <p>
            <strong>Full TypeScript support</strong> - Get autocomplete, type
            checking, and inline documentation in your IDE.
          </p>
        </Callout>

        <p className="mb-4">
          For optimal experience, ensure your tsconfig.json includes:
        </p>

        <EnhancedCodeBlock
          code={`{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`}
          language="json"
          title="tsconfig.json"
          showCopyButton
        />
      </ScrollReveal>

      <ScrollReveal delay={0.8}>
        <h2 id="tailwind-css" className="mt-8">
          Tailwind CSS (Optional)
        </h2>
        <p className="mb-4">
          Clarity Chat UI uses Tailwind CSS internally but doesn't require it in
          your project. However, if you want to customize styles using Tailwind:
        </p>

        <EnhancedCodeBlock
          code={`// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}
          language="javascript"
          title="tailwind.config.js"
          showCopyButton
        />
      </ScrollReveal>

      <ScrollReveal delay={0.9}>
        <h2 id="verification" className="mt-8">
          Verify Installation
        </h2>
        <p className="mb-4">Test your installation with a simple component:</p>

        <EnhancedCodeBlock
          code={`import { ChatWindow } from '@clarity-chat/react'

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <ChatWindow
        messages={[]}
        onSendMessage={(text) => logger.debug(text)}
      />
    </div>
  )
}

export default App`}
          language="tsx"
          showCopyButton
        />

        <Callout type="tip" className="mt-4">
          <p>
            If you see the chat window, you're all set! If you encounter issues,
            check our <a href="/learn/troubleshooting">Troubleshooting Guide</a>
            .
          </p>
        </Callout>
      </ScrollReveal>

      <ScrollReveal delay={1.0}>
        <h2 id="cdn" className="mt-8">
          CDN (Not Recommended)
        </h2>
        <p className="mb-4">
          While not recommended for production, you can use Clarity Chat via CDN
          for quick prototyping:
        </p>

        <EnhancedCodeBlock
          code={`<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/@clarity-chat/react/dist/styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@clarity-chat/react/dist/index.umd.js"></script>
  </body>
</html>`}
          language="html"
          showCopyButton
        />

        <Callout type="warning" className="mt-4">
          CDN usage is not recommended for production. Use npm/yarn for better
          performance and tree-shaking.
        </Callout>
      </ScrollReveal>

      <Pagination
        prev={{
          title: 'Quick Start',
          href: '/learn/quick-start',
        }}
        next={{
          title: 'Tutorial',
          href: '/learn/tutorial',
        }}
      />
    </>
  )
}
