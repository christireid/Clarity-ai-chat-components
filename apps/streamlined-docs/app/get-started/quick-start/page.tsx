'use client'

import { useState } from 'react'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { Callout } from '@/components/MDX/Callout'
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Code2,
  Zap,
  Package,
  Sparkles,
  FileCode,
  Server,
  Rocket,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// =============================================================================
// Package Manager Tabs Component
// =============================================================================

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

interface PackageManagerTabsProps {
  commands: Record<PackageManager, string>
  className?: string
}

function PackageManagerTabs({ commands, className }: PackageManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>('pnpm')

  const tabs: { id: PackageManager; label: string }[] = [
    { id: 'pnpm', label: 'pnpm' },
    { id: 'npm', label: 'npm' },
    { id: 'yarn', label: 'yarn' },
    { id: 'bun', label: 'bun' },
  ]

  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden',
        className
      )}
    >
      {/* Tab header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-brand-500 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <EnhancedCopyButton
          text={commands[activeTab]}
          label="Copy install command"
          size="sm"
          celebration="confetti"
        />
      </div>
      {/* Code area */}
      <div className="bg-neutral-950">
        <pre className="p-4 overflow-x-auto text-sm text-neutral-100">
          <code className="font-mono">{commands[activeTab]}</code>
        </pre>
      </div>
    </div>
  )
}

// =============================================================================
// Code Block with Copy
// =============================================================================

interface CodeWithCopyProps {
  code: string
  language?: string
  title?: string
  highlightLines?: number[]
  className?: string
}

function CodeWithCopy({
  code,
  language = 'tsx',
  title,
  className,
}: CodeWithCopyProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-300">
              {title}
            </span>
          </div>
          <EnhancedCopyButton
            text={code}
            label="Copy code"
            size="sm"
            celebration="pulse"
          />
        </div>
      )}
      {!title && (
        <div className="flex items-center justify-end px-4 py-2 bg-neutral-900">
          <EnhancedCopyButton
            text={code}
            label="Copy code"
            size="sm"
            celebration="pulse"
          />
        </div>
      )}
      <div className="bg-neutral-950">
        <pre className="p-4 overflow-x-auto text-sm text-neutral-100">
          <code className="font-mono">{code}</code>
        </pre>
      </div>
    </div>
  )
}

// =============================================================================
// Code Examples - Accurate to the library API
// =============================================================================

const installCommands: Record<PackageManager, string> = {
  pnpm: 'pnpm add @clarity-chat/react',
  npm: 'npm install @clarity-chat/react',
  yarn: 'yarn add @clarity-chat/react',
  bun: 'bun add @clarity-chat/react',
}

// 3-line minimal example - accurate to ClarityChatApp component
const threeLineExample = `import { ClarityChatApp } from '@clarity-chat/react'

export default function Chat() {
  return <ClarityChatApp api="/api/chat" />
}`

// Basic setup with API route
const basicSetupCode = `// app/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <div className="h-screen">
      <ClarityChatApp
        api="/api/chat"
        systemPrompt="You are a helpful assistant."
      />
    </div>
  )
}`

const apiRouteCode = `// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const { messages } = await request.json()
  const encoder = new TextEncoder()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    stream: true,
  })

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          const data = JSON.stringify({ type: 'text-delta', content })
          controller.enqueue(encoder.encode(\`data: \${data}\\n\\n\`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}`

// With options - memory, presets
const withOptionsCode = `import { ClarityChatApp } from '@clarity-chat/react'

export default function Chat() {
  return (
    <ClarityChatApp
      api="/api/chat"
      // Enable memory with one flag
      features={{ memory: true }}
      // Optional: use a preset for common configurations
      preset="pro"
      // Optional: customize the system prompt
      systemPrompt="You are a helpful coding assistant."
      // Optional: handle events
      onMessageSent={(msg) => console.log('Sent:', msg)}
      onMessageReceived={(msg) => console.log('Received:', msg)}
    />
  )
}`

// Enterprise preset example
const enterpriseExample = `import { ClarityChatApp } from '@clarity-chat/react'

// Enterprise preset includes: memory, token optimization,
// safety features, and observability
export default function EnterpriseChat() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="enterprise"
      config={{
        tokenOptimization: { budget: 16000 },
        memory: { strategy: 'vector-store' },
        safety: { level: 'strict' },
      }}
    />
  )
}`

// =============================================================================
// Page Component
// =============================================================================

export default function QuickStartPage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              5 minutes to working chat
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Quick Start Guide
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Get from zero to a fully functional AI chat interface in 5 minutes.
            Copy-paste ready code that just works.
          </p>
        </div>
      </ScrollReveal>

      {/* Prerequisites */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-12">
          <Callout type="info" title="Prerequisites">
            <ul className="list-disc list-inside space-y-1">
              <li>React 18+ (Next.js 13+, Vite, or any React framework)</li>
              <li>Node.js 18+</li>
              <li>An OpenAI API key (or any compatible provider)</li>
            </ul>
          </Callout>
        </section>
      </ScrollReveal>

      {/* Step 1: Installation */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold">Install the Package</h2>
          </div>

          <PackageManagerTabs commands={installCommands} />

          <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-emerald-600 dark:text-emerald-400">
                  Works with:
                </strong>{' '}
                Next.js 13+, Vite, Create React App, Remix, Astro, or any React
                18+ project.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Step 2: 3-Line Quick Start */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold">Add the Component</h2>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full">
              3 lines of code
            </span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            You only need three lines of code to render a complete chat
            interface. The{' '}
            <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">
              ClarityChatApp
            </code>{' '}
            component handles messages, input, streaming, and UI out of the box.
          </p>

          <CodeWithCopy code={threeLineExample} title="app/page.tsx" />
        </section>
      </ScrollReveal>

      {/* Step 3: Basic Setup with API Route */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold">Create the API Route</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            You will need a backend endpoint to handle chat requests. Here is a
            minimal Next.js API route that streams responses from OpenAI.
          </p>

          <div className="space-y-4">
            <CodeWithCopy code={basicSetupCode} title="app/page.tsx" />

            <CodeWithCopy code={apiRouteCode} title="app/api/chat/route.ts" />
          </div>

          <Callout type="tip" title="Environment Variable">
            <p>
              Add your OpenAI API key to{' '}
              <code className="px-1.5 py-0.5 bg-violet-100/50 dark:bg-violet-900/30 rounded text-sm font-mono">
                .env.local
              </code>
              :
            </p>
            <pre className="mt-2 p-2 bg-violet-100/50 dark:bg-violet-900/30 rounded text-sm font-mono overflow-x-auto">
              OPENAI_API_KEY=sk-your-api-key-here
            </pre>
          </Callout>
        </section>
      </ScrollReveal>

      {/* Step 4: Run and Test */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              4
            </div>
            <h2 className="text-2xl font-bold">Run Your App</h2>
          </div>

          <PackageManagerTabs
            commands={{
              pnpm: 'pnpm dev',
              npm: 'npm run dev',
              yarn: 'yarn dev',
              bun: 'bun dev',
            }}
          />

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-brand-50 dark:from-emerald-950/30 dark:to-brand-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="w-6 h-6 text-emerald-500" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                You are ready!
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Open{' '}
              <code className="px-1.5 py-0.5 bg-white/60 dark:bg-black/20 rounded text-sm font-mono">
                http://localhost:3000
              </code>{' '}
              in your browser. You should see a fully functional chat interface.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Advanced Options */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Add More Features</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Enable powerful features with simple flags. No additional imports
              needed.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                With Memory and Events
              </h3>
              <CodeWithCopy code={withOptionsCode} title="With Options" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                Enterprise Configuration
              </h3>
              <CodeWithCopy code={enterpriseExample} title="Enterprise Setup" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Available Presets */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Available Presets</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'simple',
                description: 'Streaming + retries + accessible UI',
                features: ['Streaming', 'Error recovery', 'Accessible'],
              },
              {
                name: 'pro',
                description: 'Adds token stats and basic optimization',
                features: ['Token tracking', 'Cost estimates', 'Basic safety'],
              },
              {
                name: 'memory',
                description: 'Conversation persistence with sliding window',
                features: [
                  'Message history',
                  'Context injection',
                  'Auto-cleanup',
                ],
              },
              {
                name: 'rag',
                description: 'Document-based retrieval augmented generation',
                features: ['Document sources', 'Chunking', 'Citations'],
              },
              {
                name: 'tools',
                description: 'Tool calling with registry pattern',
                features: ['Tool registry', 'Auto-approval', 'Results UI'],
              },
              {
                name: 'enterprise',
                description: 'Full features for production deployments',
                features: ['All features', 'Observability', 'Strict safety'],
              },
            ].map((preset) => (
              <div
                key={preset.name}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono text-brand-600 dark:text-brand-400">
                  {preset.name}
                </code>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {preset.description}
                </p>
                <ul className="mt-3 space-y-1">
                  {preset.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-xs text-neutral-500 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* What's Next */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What's Next?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Now that you have a working chat, explore these resources to build
              something amazing.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: 'Explore Components',
                  description: 'Browse 155+ components with interactive demos',
                  href: '/explore',
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: 'API Reference',
                  description:
                    'Complete documentation for all components and hooks',
                  href: '/api',
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Full Tutorial',
                  description: 'Build a complete AI assistant from scratch',
                  href: '/get-started/tutorial',
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
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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

      {/* Quick Tips */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50 p-8 sm:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Tips</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'TypeScript First',
                  tip: 'Full TypeScript support with IntelliSense for all props and options.',
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: 'Tree-Shakeable',
                  tip: 'Import only what you need. Unused code is automatically removed.',
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: 'Accessible by Default',
                  tip: 'WCAG 2.1 AA compliant. Keyboard navigation and screen readers work out of the box.',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Dark Mode Ready',
                  tip: 'All components support dark mode automatically. No extra configuration needed.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-brand-200 dark:border-brand-800/50 text-brand-500 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mt-16">
          <Callout type="warning" title="Common Issues">
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>CORS errors:</strong> Make sure your API route is on the
                same domain or configure CORS headers.
              </li>
              <li>
                <strong>Streaming not working:</strong> Check that your API
                returns{' '}
                <code className="px-1 py-0.5 bg-amber-100/50 dark:bg-amber-900/30 rounded text-xs font-mono">
                  Content-Type: text/event-stream
                </code>
                .
              </li>
              <li>
                <strong>TypeScript errors:</strong> Ensure you have{' '}
                <code className="px-1 py-0.5 bg-amber-100/50 dark:bg-amber-900/30 rounded text-xs font-mono">
                  @clarity-chat/types
                </code>{' '}
                installed (included with the main package).
              </li>
            </ul>
            <p className="mt-3">
              <Link
                href="/get-started/troubleshooting"
                className="text-amber-700 dark:text-amber-300 hover:underline font-medium"
              >
                View full troubleshooting guide
              </Link>
            </p>
          </Callout>
        </section>
      </ScrollReveal>
    </div>
  )
}
