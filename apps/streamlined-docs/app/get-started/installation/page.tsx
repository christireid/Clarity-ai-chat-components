'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import {
  Download,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Zap,
  Settings,
  FileCode,
  Palette,
  Key,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Box,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

// Package manager install commands
const packageManagers = {
  pnpm: 'pnpm add @clarity-chat/react',
  npm: 'npm install @clarity-chat/react',
  yarn: 'yarn add @clarity-chat/react',
  bun: 'bun add @clarity-chat/react',
}

// Peer dependencies from actual package.json
const requiredPeerDeps = `# Required peer dependencies
pnpm add react@^18.0.0 framer-motion@^12.23.25 lucide-react@^0.500.0 zod@^3.24.0`

const optionalPeerDeps = `# Optional peer dependencies (install as needed)

# For markdown rendering
pnpm add react-markdown@^10.0.0 remark-gfm@^4.0.0 rehype-highlight@^7.0.0

# For code syntax highlighting
pnpm add shiki@^3.0.0 prismjs@^1.29.0

# For document processing (RAG features)
pnpm add pdfjs-dist@^3.0.0 mammoth@^1.0.0 jszip@^3.10.0

# For diagram rendering
pnpm add mermaid@^11.0.0

# For AI reranking
pnpm add cohere-ai@^7.0.0

# For streaming token optimization
pnpm add flowtoken@^1.0.0`

// Framework-specific code examples
const frameworkExamples = {
  nextAppRouter: {
    provider: `// app/providers.tsx
'use client'

import { ThemeProvider, ClarityChatProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="clarity-theme">
      <ClarityChatProvider>
        {children}
      </ClarityChatProvider>
    </ThemeProvider>
  )
}`,
    layout: `// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}`,
    page: `// app/chat/page.tsx
'use client'

import { ChatWindow, useChatState } from '@clarity-chat/react'

export default function ChatPage() {
  const { messages, sendMessage, isLoading } = useChatState()

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`,
    apiRoute: `// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import { createStreamingResponse } from '@clarity-chat/react/adapters'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // Connect to your AI provider
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,
    }),
  })

  return createStreamingResponse(response)
}`,
  },
  nextPagesRouter: {
    app: `// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ThemeProvider, ClarityChatProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="clarity-theme">
      <ClarityChatProvider>
        <Component {...pageProps} />
      </ClarityChatProvider>
    </ThemeProvider>
  )
}`,
    page: `// pages/chat.tsx
import { ChatWindow, useChatState } from '@clarity-chat/react'

export default function ChatPage() {
  const { messages, sendMessage, isLoading } = useChatState()

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`,
  },
  vite: {
    main: `// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, ClarityChatProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="clarity-theme">
      <ClarityChatProvider>
        <App />
      </ClarityChatProvider>
    </ThemeProvider>
  </React.StrictMode>
)`,
    viteConfig: `// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@clarity-chat/react'],
  },
})`,
  },
  cra: {
    index: `// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, ClarityChatProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import './index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="clarity-theme">
      <ClarityChatProvider>
        <App />
      </ClarityChatProvider>
    </ThemeProvider>
  </React.StrictMode>
)`,
  },
}

// TypeScript configuration
const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    // Required for @clarity-chat/react
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`

// Environment variables
const envExample = `# .env.local

# OpenAI (if using OpenAI adapter)
OPENAI_API_KEY=sk-...

# Anthropic (if using Claude adapter)
ANTHROPIC_API_KEY=sk-ant-...

# Cohere (for reranking features)
COHERE_API_KEY=...

# Optional: Analytics
CLARITY_ANALYTICS_KEY=...

# Optional: License key (for enterprise features)
CLARITY_LICENSE_KEY=...`

// Troubleshooting issues
const troubleshootingIssues = [
  {
    title: "Module not found: 'react-dom/client'",
    description: 'This error occurs when using React 17 or older.',
    solution: `Upgrade to React 18 or later:

pnpm add react@^18.0.0 react-dom@^18.0.0`,
  },
  {
    title: 'framer-motion peer dependency warning',
    description: 'Framer Motion is a required peer dependency for animations.',
    solution: `Install the required version:

pnpm add framer-motion@^12.23.25`,
  },
  {
    title: 'CSS not loading / Unstyled components',
    description: 'The styles are not being imported correctly.',
    solution: `Import the CSS file in your app entry point:

import '@clarity-chat/react/styles.css'

For Next.js, add it to your layout.tsx or _app.tsx file.`,
  },
  {
    title: 'TypeScript errors with JSX elements',
    description: 'Type errors when using components in TypeScript projects.',
    solution: `Ensure your tsconfig.json has the correct settings:

{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}`,
  },
  {
    title: "Build error: Cannot find module '@clarity-chat/react'",
    description: 'The package is not being resolved correctly.',
    solution: `Clear your package manager cache and reinstall:

# For pnpm
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install

# For npm
rm -rf node_modules package-lock.json
npm cache clean --force
npm install`,
  },
  {
    title: 'Hydration mismatch in Next.js',
    description:
      "Server and client HTML don't match due to theme initialization.",
    solution: `Add suppressHydrationWarning to your html tag and ensure
ThemeProvider is wrapped in a client component:

// app/layout.tsx
<html lang="en" suppressHydrationWarning>

// app/providers.tsx
'use client' // This directive is required`,
  },
]

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'
type Framework = 'nextApp' | 'nextPages' | 'vite' | 'cra'

export default function InstallationPage() {
  const [selectedPM, setSelectedPM] = useState<PackageManager>('pnpm')
  const [selectedFramework, setSelectedFramework] =
    useState<Framework>('nextApp')

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Download className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Installation Guide
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Get Started with Clarity Chat
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Install and configure Clarity Chat in your React project. Works with
            Next.js, Vite, Create React App, and more.
          </p>
        </div>
      </ScrollReveal>

      {/* Requirements */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Requirements</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Node.js',
                value: '18.0+',
                icon: <Box className="w-4 h-4" />,
              },
              {
                label: 'React',
                value: '18.0+ or 19.0+',
                icon: <Sparkles className="w-4 h-4" />,
              },
              {
                label: 'TypeScript',
                value: '5.0+ (optional)',
                icon: <FileCode className="w-4 h-4" />,
              },
              {
                label: 'Package Manager',
                value: 'pnpm, npm, yarn, bun',
                icon: <Terminal className="w-4 h-4" />,
              },
            ].map((req, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-2 text-brand-500 mb-2">
                  {req.icon}
                  <span className="text-sm font-medium">{req.label}</span>
                </div>
                <p className="text-lg font-semibold">{req.value}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Quick Install */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Quick Install</h2>
          </div>

          {/* Package Manager Tabs */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center gap-1 p-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              {(Object.keys(packageManagers) as PackageManager[]).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setSelectedPM(pm)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedPM === pm
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800'
                  )}
                >
                  {pm}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-sm">Terminal</span>
                </div>
                <EnhancedCopyButton
                  text={packageManagers[selectedPM]}
                  label="Copy install command"
                  size="sm"
                  celebration="confetti"
                />
              </div>
              <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto">
                <code className="text-emerald-400">$ </code>
                <code>{packageManagers[selectedPM]}</code>
              </pre>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-blue-600 dark:text-blue-400">
                  React 18 or 19:
                </strong>{' '}
                Clarity Chat supports both React 18.0+ and React 19.0+. The
                library automatically adapts to your React version.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Peer Dependencies */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Peer Dependencies</h2>
          </div>

          <div className="space-y-4">
            {/* Required Dependencies */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Required Dependencies
                  </span>
                </div>
                <EnhancedCopyButton
                  text={requiredPeerDeps}
                  label="Copy required dependencies"
                  size="sm"
                  celebration="pulse"
                />
              </div>
              <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                <code>{requiredPeerDeps}</code>
              </pre>
            </div>

            {/* Optional Dependencies */}
            <CollapsibleSection
              title="Optional Dependencies"
              badge="Install as needed"
            >
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden mt-2">
                <div className="flex items-center justify-end px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <EnhancedCopyButton
                    text={optionalPeerDeps}
                    label="Copy optional dependencies"
                    size="sm"
                    celebration="pulse"
                  />
                </div>
                <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                  <code>{optionalPeerDeps}</code>
                </pre>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  {
                    name: 'react-markdown',
                    purpose: 'Markdown rendering in messages',
                  },
                  {
                    name: 'shiki/prismjs',
                    purpose: 'Code syntax highlighting',
                  },
                  {
                    name: 'pdfjs-dist',
                    purpose: 'PDF document loading for RAG',
                  },
                  { name: 'mammoth', purpose: 'DOCX document loading' },
                  { name: 'mermaid', purpose: 'Diagram rendering' },
                  { name: 'cohere-ai', purpose: 'AI-powered reranking' },
                ].map((dep, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                    <code className="text-brand-500">{dep.name}</code>
                    <span className="text-neutral-500">- {dep.purpose}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </section>
      </ScrollReveal>

      {/* Framework Guides */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Framework Setup</h2>
          </div>

          {/* Framework Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              {
                id: 'nextApp',
                label: 'Next.js (App Router)',
                badge: 'Recommended',
              },
              { id: 'nextPages', label: 'Next.js (Pages Router)' },
              { id: 'vite', label: 'Vite' },
              { id: 'cra', label: 'Create React App' },
            ].map((fw) => (
              <button
                key={fw.id}
                onClick={() => setSelectedFramework(fw.id as Framework)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  selectedFramework === fw.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                {fw.label}
                {fw.badge && selectedFramework === fw.id && (
                  <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                    {fw.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Framework Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFramework}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: durations.normal }}
              className="space-y-6"
            >
              {selectedFramework === 'nextApp' && (
                <>
                  <StepCard number={1} title="Create providers file">
                    <CodeBlock
                      code={frameworkExamples.nextAppRouter.provider}
                      filename="app/providers.tsx"
                    />
                  </StepCard>
                  <StepCard number={2} title="Update layout">
                    <CodeBlock
                      code={frameworkExamples.nextAppRouter.layout}
                      filename="app/layout.tsx"
                    />
                  </StepCard>
                  <StepCard number={3} title="Create chat page">
                    <CodeBlock
                      code={frameworkExamples.nextAppRouter.page}
                      filename="app/chat/page.tsx"
                    />
                  </StepCard>
                  <StepCard number={4} title="Add API route (optional)">
                    <CodeBlock
                      code={frameworkExamples.nextAppRouter.apiRoute}
                      filename="app/api/chat/route.ts"
                    />
                  </StepCard>
                </>
              )}

              {selectedFramework === 'nextPages' && (
                <>
                  <StepCard number={1} title="Update _app.tsx">
                    <CodeBlock
                      code={frameworkExamples.nextPagesRouter.app}
                      filename="pages/_app.tsx"
                    />
                  </StepCard>
                  <StepCard number={2} title="Create chat page">
                    <CodeBlock
                      code={frameworkExamples.nextPagesRouter.page}
                      filename="pages/chat.tsx"
                    />
                  </StepCard>
                </>
              )}

              {selectedFramework === 'vite' && (
                <>
                  <StepCard number={1} title="Update main.tsx">
                    <CodeBlock
                      code={frameworkExamples.vite.main}
                      filename="src/main.tsx"
                    />
                  </StepCard>
                  <StepCard number={2} title="Update vite.config.ts">
                    <CodeBlock
                      code={frameworkExamples.vite.viteConfig}
                      filename="vite.config.ts"
                    />
                  </StepCard>
                </>
              )}

              {selectedFramework === 'cra' && (
                <>
                  <StepCard number={1} title="Update index.tsx">
                    <CodeBlock
                      code={frameworkExamples.cra.index}
                      filename="src/index.tsx"
                    />
                  </StepCard>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <strong className="text-amber-600 dark:text-amber-400">
                          Note:
                        </strong>{' '}
                        Create React App is no longer recommended by the React
                        team. Consider migrating to Next.js or Vite for better
                        performance and features.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </ScrollReveal>

      {/* TypeScript Configuration */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <FileCode className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">TypeScript Configuration</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Clarity Chat is written in TypeScript and ships with full type
            definitions. Ensure your tsconfig.json includes these settings:
          </p>

          <CodeBlock code={tsConfig} filename="tsconfig.json" language="json" />

          <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-emerald-600 dark:text-emerald-400">
                  IntelliSense Ready:
                </strong>{' '}
                All 200+ components and 95+ hooks include comprehensive JSDoc
                documentation and type definitions.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CSS/Styling Setup */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">CSS / Styling Setup</h2>
          </div>

          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Import the stylesheet in your app entry point to enable all
              component styles:
            </p>

            <CodeBlock
              code={`import '@clarity-chat/react/styles.css'`}
              filename="app/layout.tsx or src/main.tsx"
              language="typescript"
            />

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Tailwind CSS Compatible
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Works seamlessly with Tailwind CSS. Components use CSS custom
                  properties for theming.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Dark Mode Support
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Full dark mode support out of the box. Use ThemeProvider to
                  control the theme.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Environment Variables */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Environment Variables</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Configure API keys for your AI providers and optional features:
          </p>

          <CodeBlock code={envExample} filename=".env.local" language="bash" />

          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-amber-600 dark:text-amber-400">
                  Security:
                </strong>{' '}
                Never expose API keys in client-side code. Use server-side API
                routes to proxy requests to AI providers.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            {troubleshootingIssues.map((issue, i) => (
              <CollapsibleSection
                key={i}
                title={issue.title}
                badge="Common Issue"
              >
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {issue.description}
                  </p>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Solution
                      </span>
                    </div>
                    <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                      <code>{issue.solution}</code>
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Build</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              You're all set! Explore the documentation to learn more about
              Clarity Chat's features.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Quick Start Guide',
                  description: 'Build your first chat interface in 5 minutes',
                  href: '/get-started/quick-start',
                },
                {
                  icon: <Box className="w-5 h-5" />,
                  title: 'Explore Components',
                  description: 'Browse 200+ components with live demos',
                  href: '/explore',
                },
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'API Reference',
                  description: 'Complete documentation for all APIs',
                  href: '/api',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// Helper Components
interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm">
        {number}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  filename: string
  language?: string
}

function CodeBlock({
  code,
  filename,
  language = 'typescript',
}: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
