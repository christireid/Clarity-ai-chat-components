import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Vite Integration - Clarity Chat Components',
  description: 'Learn how to integrate Clarity Chat Components with Vite, including setup, HMR, and build optimization.',
}

export default function ViteIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Vite Integration</h1>
        <p className="docs-lead">
          Learn how to integrate Clarity Chat Components with Vite, including setup, HMR, build optimization, and plugin configuration.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up Clarity Chat with Vite',
          'Configure plugins',
          'Optimize build',
          'Use HMR effectively',
          'Handle environment variables',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Setup</h2>
        <p>
          Set up Clarity Chat in a Vite project:
        </p>
        <CodePlayground
          initialCode={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClarityChat } from '@clarity-chat/react'
import './index.css'

function App() {
  return (
    <div>
      <h1>Chat App</h1>
      <ClarityChat api="/api/chat" />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`}
        />
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <p>
          Configure environment variables:
        </p>
        <CodePlayground
          initialCode={`// .env
VITE_API_URL=http://localhost:3000/api
VITE_CHAT_API=/api/chat

// vite.config.ts
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})

// src/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  chatApi: import.meta.env.VITE_CHAT_API || '/api/chat',
}

// Usage
import { config } from './config'

function ChatApp() {
  return (
    <ClarityChat api={config.chatApi} />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Build Optimization</h2>
        <p>
          Optimize build for production:
        </p>
        <CodePlayground
          initialCode={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'clarity-chat': ['@clarity-chat/react'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['@clarity-chat/react'],
  },
})`}
        />
      </section>

      <section className="docs-section">
        <h2>HMR Configuration</h2>
        <p>
          Configure Hot Module Replacement:
        </p>
        <CodePlayground
          initialCode={`// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    react({
      // Fast refresh for React components
      fastRefresh: true,
    }),
  ],
})

// Component with HMR
function ChatComponent() {
  const [messages, setMessages] = useState([])

  // HMR will preserve state during development
  return (
    <ClarityChat
      api="/api/chat"
      messages={messages}
      onMessage={(msg) => setMessages([...messages, msg])}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Proxy Configuration</h2>
        <p>
          Configure proxy for API requests:
        </p>
        <CodePlayground
          initialCode={`// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

// Usage (no CORS issues)
function ChatApp() {
  return (
    <ClarityChat
      api="/api/chat" // Proxied to http://localhost:3000/api/chat
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use environment variables for configuration</li>
          <li>Optimize build with code splitting</li>
          <li>Configure proxy for API requests</li>
          <li>Use HMR for faster development</li>
          <li>Optimize dependencies</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/cookbook/server-side-rendering">Server-Side Rendering Patterns</a> - SSR patterns</li>
          <li><a href="/guides/performance-optimization-patterns">Performance Optimization</a> - Performance guide</li>
        </ul>
      </section>
    </div>
  )
}
