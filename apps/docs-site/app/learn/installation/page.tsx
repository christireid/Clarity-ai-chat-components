import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Installation',
  description: 'How to install Clarity Chat UI in your project',
}

export default function InstallationPage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>Installation</h1>
      
      <p className="lead">
        Learn how to install and configure Clarity Chat UI in your React project. We support multiple frameworks and build tools.
      </p>

      <h2 id="requirements">Requirements</h2>
      
      <p>Clarity Chat UI requires the following:</p>

      <ul>
        <li><strong>React 18.0.0</strong> or higher</li>
        <li><strong>Node.js 18.0.0</strong> or higher</li>
        <li><strong>TypeScript 5.0.0</strong> or higher (recommended)</li>
      </ul>

      <h2 id="package-managers">Package Managers</h2>
      
      <p>Install using your preferred package manager:</p>

      <h3>npm</h3>
      <CodeBlock
        code="npm install @clarity-chat/react"
        language="bash"
      />

      <h3>yarn</h3>
      <CodeBlock
        code="yarn add @clarity-chat/react"
        language="bash"
      />

      <h3>pnpm</h3>
      <CodeBlock
        code="pnpm add @clarity-chat/react"
        language="bash"
      />

      <h3>bun</h3>
      <CodeBlock
        code="bun add @clarity-chat/react"
        language="bash"
      />

      <h2 id="peer-dependencies">Peer Dependencies</h2>
      
      <p>Clarity Chat UI has the following peer dependencies that should already be in your project:</p>

      <CodeBlock
        code={`{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}`}
        language="json"
      />

      <Callout type="info">
        These are usually already installed in React projects. If not, install them with your package manager.
      </Callout>

      <h2 id="import-styles">Import Styles</h2>
      
      <p>Import the CSS file in your root component or entry file:</p>

      <CodeBlock
        code={`// In your main App.tsx or index.tsx
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="framework-setup">Framework-Specific Setup</h2>

      <h3>Next.js</h3>
      
      <p>For Next.js 13+ with App Router:</p>

      <CodeBlock
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
      />

      <Callout type="warning">
        Some components use client-side features. Make sure to use <code>'use client'</code> directive when needed.
      </Callout>

      <h3>Vite</h3>
      
      <p>For Vite projects, import styles in your main.tsx:</p>

      <CodeBlock
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
      />

      <h3>Create React App</h3>
      
      <p>For CRA projects, import styles in index.tsx:</p>

      <CodeBlock
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
      />

      <h2 id="typescript">TypeScript Configuration</h2>
      
      <p>Clarity Chat UI is written in TypeScript and includes type definitions. No additional setup needed!</p>

      <Callout type="success">
        <p>
          <strong>Full TypeScript support</strong> - Get autocomplete, type checking, and inline documentation in your IDE.
        </p>
      </Callout>

      <p>For optimal experience, ensure your tsconfig.json includes:</p>

      <CodeBlock
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
      />

      <h2 id="tailwind-css">Tailwind CSS (Optional)</h2>
      
      <p>Clarity Chat UI uses Tailwind CSS internally but doesn't require it in your project. However, if you want to customize styles using Tailwind:</p>

      <CodeBlock
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
      />

      <h2 id="verification">Verify Installation</h2>
      
      <p>Test your installation with a simple component:</p>

      <CodeBlock
        code={`import { ChatWindow } from '@clarity-chat/react'

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <ChatWindow
        messages={[]}
        onSendMessage={(text) => console.log(text)}
      />
    </div>
  )
}

export default App`}
        language="tsx"
      />

      <Callout type="tip">
        <p>
          If you see the chat window, you're all set! If you encounter issues, check our{' '}
          <a href="/learn/guides/troubleshooting">Troubleshooting Guide</a>.
        </p>
      </Callout>

      <h2 id="cdn">CDN (Not Recommended)</h2>
      
      <p>While not recommended for production, you can use Clarity Chat via CDN for quick prototyping:</p>

      <CodeBlock
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
      />

      <Callout type="warning">
        CDN usage is not recommended for production. Use npm/yarn for better performance and tree-shaking.
      </Callout>

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
