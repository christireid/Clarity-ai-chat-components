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
import { Callout } from '@/components/MDX/Callout'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
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
  Palette,
  Terminal,
  Play,
  BookOpen,
  Layers,
  Settings,
  MessageSquare,
  Wand2,
  ChevronRight,
  ExternalLink,
  Info,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

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

interface CodeBlockProps {
  code: string
  filename?: string
  language?: string
  className?: string
  highlightLines?: number[]
}

function CodeBlock({
  code,
  filename,
  language = 'tsx',
  className,
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden',
        className
      )}
    >
      {filename && (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-300">
              {filename}
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
      {!filename && (
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
// Step Card Component
// =============================================================================

interface StepCardProps {
  number: number
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}

function StepCard({ number, title, subtitle, icon, children }: StepCardProps) {
  return (
    <div className="relative">
      {/* Step indicator */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-brand-500/25 flex-shrink-0">
          {icon || number}
        </div>
        <div className="pt-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="pl-16">{children}</div>
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

const peerDepsCommands: Record<PackageManager, string> = {
  pnpm: 'pnpm add react@^18 framer-motion@^12 lucide-react@^0.500 zod@^3.24',
  npm: 'npm install react@^18 framer-motion@^12 lucide-react@^0.500 zod@^3.24',
  yarn: 'yarn add react@^18 framer-motion@^12 lucide-react@^0.500 zod@^3.24',
  bun: 'bun add react@^18 framer-motion@^12 lucide-react@^0.500 zod@^3.24',
}

// Step 1: Basic chat component - minimal code
const basicChatCode = `'use client'

import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <div className="h-screen">
      <ClarityChatApp api="/api/chat" />
    </div>
  )
}`

// Step 2: API Route for OpenAI
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

// Alternative: Anthropic API Route
const anthropicApiRoute = `// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const { messages } = await request.json()
  const encoder = new TextEncoder()

  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: messages.filter((m: { role: string }) => m.role !== 'system'),
    system: messages.find((m: { role: string }) => m.role === 'system')?.content,
  })

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const data = JSON.stringify({ type: 'text-delta', content: event.delta.text })
          controller.enqueue(encoder.encode(\`data: \${data}\\n\\n\`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}`

// Step 3: Streaming with system prompt
const streamingChatCode = `'use client'

import { ClarityChatApp } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <div className="h-screen">
      <ClarityChatApp
        api="/api/chat"
        systemPrompt="You are a helpful assistant. Be concise and friendly."
        onMessageSent={(msg) => console.log('User sent:', msg)}
        onMessageReceived={(msg) => console.log('AI responded:', msg)}
        onError={(error) => console.error('Chat error:', error)}
      />
    </div>
  )
}`

// Step 4: Customization options
const customizedChatCode = `'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <ClarityChatApp
        api="/api/chat"
        preset="pro"
        systemPrompt="You are a helpful coding assistant."
        features={{
          memory: true,        // Enable conversation memory
        }}
        config={{
          ui: {
            theme: 'auto',     // 'light' | 'dark' | 'auto'
            showTimestamps: true,
            showAvatars: true,
          },
        }}
        header={
          <div className="p-4 border-b bg-white/80 backdrop-blur">
            <h1 className="text-xl font-semibold">AI Assistant</h1>
            <p className="text-sm text-neutral-500">Ask me anything</p>
          </div>
        }
      />
    </div>
  )
}`

// Complete working example
const completeExample = `// app/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] rounded-2xl overflow-hidden shadow-2xl">
        <ClarityChatApp
          api="/api/chat"
          preset="pro"
          systemPrompt="You are a helpful, friendly AI assistant. Provide clear and concise answers."
          features={{ memory: true }}
          onError={(error) => {
            console.error('Chat error:', error)
          }}
        />
      </div>
    </main>
  )
}

// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
}

// .env.local
// OPENAI_API_KEY=sk-your-api-key-here`

// Enterprise example
const enterpriseExample = `import { ClarityChatApp } from '@clarity-chat/react'

// Enterprise preset: memory, token optimization, safety, observability
export default function EnterpriseChat() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="enterprise"
      config={{
        tokenOptimization: { budget: 16000 },
        memory: { strategy: 'vector-store' },
        safety: { level: 'strict' },
        observability: { enabled: true },
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
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-brand-50 dark:from-emerald-950/50 dark:to-brand-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Build a chat in 5 minutes
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Quick Start Guide
          </KineticText>

          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
            Go from zero to a fully functional AI chat interface in under 5
            minutes. Copy-paste ready code that just works.
          </p>

          {/* Time estimates */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { time: '2 min', label: 'Install & Setup' },
              { time: '2 min', label: 'API Route' },
              { time: '1 min', label: 'Customize' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-white/[0.02] rounded-full border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <Zap className="w-4 h-4 text-brand-500" />
                <span className="font-semibold text-brand-600 dark:text-brand-400">
                  {item.time}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Prerequisites */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-12">
          <Callout type="info" title="Prerequisites">
            <p className="mb-3">
              Before you begin, make sure you have:
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                <strong>Node.js 18+</strong> installed
              </li>
              <li>
                A <strong>React 18+</strong> project (Next.js 13+, Vite, or any
                React framework)
              </li>
              <li>
                An AI API key (
                <Link
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OpenAI
                </Link>
                {' or '}
                <Link
                  href="https://console.anthropic.com/"
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Anthropic
                </Link>
                )
              </li>
            </ul>
            <p className="mt-3">
              <Link
                href="/get-started/installation"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                See full installation guide
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </Callout>
        </section>
      </ScrollReveal>

      {/* Step 1: Install */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <StepCard
            number={1}
            title="Install the Package"
            subtitle="Add Clarity Chat to your project"
          >
            <PackageManagerTabs commands={installCommands} className="mb-4" />

            <CollapsibleSection
              title="Required Peer Dependencies"
              badge="Usually already installed"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                If you get peer dependency warnings, install these packages:
              </p>
              <PackageManagerTabs commands={peerDepsCommands} />
            </CollapsibleSection>

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
          </StepCard>
        </section>
      </ScrollReveal>

      {/* Step 2: Create Basic Chat */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <StepCard
            number={2}
            title="Create Your Chat Page"
            subtitle="Add the ClarityChatApp component to your page"
          >
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              The{' '}
              <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono text-brand-600 dark:text-brand-400">
                ClarityChatApp
              </code>{' '}
              component gives you a complete chat interface with messages, input,
              streaming, and error handling out of the box.
            </p>

            <CodeBlock code={basicChatCode} filename="app/page.tsx" />

            <Callout type="tip" title="That's it for the UI!">
              <p>
                With just 3 lines of component code, you have a fully functional
                chat interface. The{' '}
                <code className="px-1.5 py-0.5 bg-violet-100/50 dark:bg-violet-900/30 rounded text-sm font-mono">
                  api
                </code>{' '}
                prop tells the component where to send messages.
              </p>
            </Callout>
          </StepCard>
        </section>
      </ScrollReveal>

      {/* Step 3: Connect to AI API */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <StepCard
            number={3}
            title="Connect to an AI Provider"
            subtitle="Create an API route to handle chat requests"
          >
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Create a backend endpoint that connects to your AI provider. Here
              are examples for the most popular providers:
            </p>

            <div className="space-y-4">
              <CodeBlock code={apiRouteCode} filename="app/api/chat/route.ts (OpenAI)" />

              <CollapsibleSection
                title="Using Anthropic Claude instead?"
                badge="Alternative"
              >
                <CodeBlock
                  code={anthropicApiRoute}
                  filename="app/api/chat/route.ts (Anthropic)"
                />
              </CollapsibleSection>
            </div>

            <div className="mt-6">
              <Callout type="warning" title="Add your API key">
                <p>
                  Create a{' '}
                  <code className="px-1.5 py-0.5 bg-amber-100/50 dark:bg-amber-900/30 rounded text-sm font-mono">
                    .env.local
                  </code>{' '}
                  file in your project root:
                </p>
                <pre className="mt-2 p-3 bg-amber-100/50 dark:bg-amber-900/30 rounded text-sm font-mono overflow-x-auto">
                  OPENAI_API_KEY=sk-your-api-key-here{'\n'}# or{'\n'}
                  ANTHROPIC_API_KEY=sk-ant-your-api-key-here
                </pre>
                <p className="mt-2 text-amber-700 dark:text-amber-300">
                  <strong>Security:</strong> Never expose API keys in client-side
                  code. Always use server-side API routes.
                </p>
              </Callout>
            </div>
          </StepCard>
        </section>
      </ScrollReveal>

      {/* Step 4: Add Streaming Support */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <StepCard
            number={4}
            title="Add Streaming & Events"
            subtitle="Handle streaming responses and track events"
          >
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Streaming is enabled by default. Add event handlers to track
              messages and errors:
            </p>

            <CodeBlock code={streamingChatCode} filename="app/page.tsx" />

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-500" />
                  Event Callbacks
                </h4>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>
                    <code className="text-brand-600 dark:text-brand-400">
                      onMessageSent
                    </code>{' '}
                    - User sends a message
                  </li>
                  <li>
                    <code className="text-brand-600 dark:text-brand-400">
                      onMessageReceived
                    </code>{' '}
                    - AI response complete
                  </li>
                  <li>
                    <code className="text-brand-600 dark:text-brand-400">
                      onError
                    </code>{' '}
                    - Handle errors gracefully
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  Streaming Features
                </h4>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                  <li>Real-time token-by-token display</li>
                  <li>Automatic retry on network errors</li>
                  <li>Cancel in-progress requests</li>
                </ul>
              </div>
            </div>
          </StepCard>
        </section>
      </ScrollReveal>

      {/* Step 5: Customize */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <StepCard
            number={5}
            title="Customize the Appearance"
            subtitle="Add presets, memory, and custom styling"
            icon={<Palette className="w-6 h-6" />}
          >
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Enable powerful features with simple flags. Import the stylesheet
              for polished default styling:
            </p>

            <CodeBlock code={customizedChatCode} filename="app/page.tsx" />

            <div className="mt-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-500" />
                Available Presets
              </h4>
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
                    description: 'Conversation persistence',
                    features: ['Message history', 'Context injection', 'Auto-cleanup'],
                  },
                  {
                    name: 'rag',
                    description: 'Document-based retrieval',
                    features: ['Document sources', 'Chunking', 'Citations'],
                  },
                  {
                    name: 'tools',
                    description: 'Tool calling with registry',
                    features: ['Tool registry', 'Auto-approval', 'Results UI'],
                  },
                  {
                    name: 'enterprise',
                    description: 'Full production features',
                    features: ['All features', 'Observability', 'Strict safety'],
                  },
                ].map((preset) => (
                  <div
                    key={preset.name}
                    className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
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
            </div>
          </StepCard>
        </section>
      </ScrollReveal>

      {/* Step 6: Run Your App */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <StepCard
            number={6}
            title="Run Your App"
            subtitle="Start the development server"
            icon={<Play className="w-6 h-6" />}
          >
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
                <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-lg">
                  You are ready!
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Open{' '}
                <code className="px-2 py-1 bg-white/60 dark:bg-black/20 rounded text-sm font-mono">
                  http://localhost:3000
                </code>{' '}
                in your browser. You should see a fully functional chat interface
                ready to talk to your AI!
              </p>
            </div>
          </StepCard>
        </section>
      </ScrollReveal>

      {/* Complete Example */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Complete Working Example</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Copy this entire example to get started immediately
              </p>
            </div>
          </div>

          <CodeBlock code={completeExample} filename="Complete Example" />

          <CollapsibleSection
            title="Enterprise Configuration"
            badge="Advanced"
            className="mt-4"
          >
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              For production deployments with all features enabled:
            </p>
            <CodeBlock code={enterpriseExample} filename="Enterprise Setup" />
          </CollapsibleSection>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: 'Explore Components',
                  description: 'Browse 155+ components with interactive demos',
                  href: '/explore',
                  color: 'from-brand-500/10 to-purple-500/10',
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: 'API Reference',
                  description:
                    'Complete documentation for all components and hooks',
                  href: '/api',
                  color: 'from-purple-500/10 to-pink-500/10',
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: 'Full Tutorial',
                  description: 'Build a complete AI assistant from scratch',
                  href: '/get-started/tutorial',
                  color: 'from-pink-500/10 to-rose-500/10',
                },
                {
                  icon: <Layers className="w-5 h-5" />,
                  title: 'Architecture Guide',
                  description: 'Understand the component architecture',
                  href: '/get-started/architecture',
                  color: 'from-emerald-500/10 to-teal-500/10',
                },
                {
                  icon: <Terminal className="w-5 h-5" />,
                  title: 'Try Playground',
                  description: 'Experiment with live code editing',
                  href: '/playground',
                  color: 'from-amber-500/10 to-orange-500/10',
                },
                {
                  icon: <Wand2 className="w-5 h-5" />,
                  title: 'Customization Guide',
                  description: 'Theming, styling, and custom components',
                  href: '/get-started/guides',
                  color: 'from-blue-500/10 to-cyan-500/10',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br text-brand-500 mb-4 group-hover:scale-110 transition-transform',
                        item.color
                      )}
                    >
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
        <section className="mb-16">
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
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Common Issues
          </h2>

          <div className="space-y-4">
            <CollapsibleSection
              title="CORS errors when calling API"
              badge="Common Issue"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Make sure your API route is on the same domain, or configure CORS
                headers in your API response:
              </p>
              <CodeBlock
                code={`return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*',
  },
})`}
                filename="API Route CORS"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Streaming not working"
              badge="Common Issue"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Ensure your API returns the correct Content-Type header:
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1 mb-3">
                <li>
                  Header must be{' '}
                  <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    Content-Type: text/event-stream
                  </code>
                </li>
                <li>
                  Data format:{' '}
                  <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    data: {'{'}"type":"text-delta","content":"..."{'}'}\n\n
                  </code>
                </li>
                <li>
                  End with:{' '}
                  <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    data: [DONE]\n\n
                  </code>
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Styles not loading" badge="Common Issue">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Import the CSS file at the top of your layout or page:
              </p>
              <CodeBlock
                code={`import '@clarity-chat/react/styles.css'`}
                filename="Import Styles"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="TypeScript errors"
              badge="Common Issue"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Ensure your tsconfig.json has the correct settings:
              </p>
              <CodeBlock
                code={`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}`}
                filename="tsconfig.json"
              />
            </CollapsibleSection>
          </div>

          <p className="mt-6">
            <Link
              href="/get-started/troubleshooting"
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              View full troubleshooting guide
              <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
        </section>
      </ScrollReveal>
    </div>
  )
}
