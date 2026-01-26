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
import { durations } from '@/lib/animations'
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
  Brain,
  Wrench,
  Database,
  Cloud,
  Github,
  Trophy,
  Target,
  GraduationCap,
  PartyPopper,
  Eye,
  Search,
  Sun,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// Types
// =============================================================================

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

// =============================================================================
// Package Manager Tabs Component
// =============================================================================

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
          label="Copy command"
          size="sm"
          celebration="confetti"
        />
      </div>
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
}

function CodeBlock({ code, filename, className }: CodeBlockProps) {
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
// Progress Indicator Component
// =============================================================================

interface ProgressIndicatorProps {
  currentPart: number
  totalParts: number
}

function ProgressIndicator({ currentPart, totalParts }: ProgressIndicatorProps) {
  const progress = (currentPart / totalParts) * 100

  return (
    <div className="sticky top-20 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 py-3">
      <div className="container-docs">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: durations.moderate }}
              />
            </div>
          </div>
          <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Part {currentPart} of {totalParts}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Milestone Celebration Component
// =============================================================================

interface MilestoneCelebrationProps {
  title: string
  description: string
  icon?: React.ReactNode
}

function MilestoneCelebration({
  title,
  description,
  icon,
}: MilestoneCelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: durations.moderate }}
      className="my-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-brand-50 to-purple-50 dark:from-emerald-950/30 dark:via-brand-950/30 dark:to-purple-950/30 border border-emerald-200 dark:border-emerald-800/50"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-brand-500 text-white shadow-lg shadow-emerald-500/25">
          {icon || <Trophy className="w-7 h-7" />}
        </div>
        <div>
          <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            {title}
            <PartyPopper className="w-5 h-5" />
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// =============================================================================
// Part Header Component
// =============================================================================

interface PartHeaderProps {
  partNumber: number
  title: string
  timeEstimate: string
  icon: React.ReactNode
  color: string
}

function PartHeader({
  partNumber,
  title,
  timeEstimate,
  icon,
  color,
}: PartHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div
        className={cn(
          'flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg',
          color
        )}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <span>Part {partNumber}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-400" />
          <Clock className="w-3.5 h-3.5" />
          <span>{timeEstimate}</span>
        </div>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
    </div>
  )
}

// =============================================================================
// Step Component
// =============================================================================

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
}

function Step({ number, title, children }: StepProps) {
  return (
    <div className="relative pl-12 pb-8 last:pb-0">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800 last:hidden" />
      {/* Step number */}
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/25">
        {number}
      </div>
      {/* Content */}
      <div>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}

// =============================================================================
// Code Examples
// =============================================================================

// Part 1: Project Setup
const createNextAppCommands: Record<PackageManager, string> = {
  pnpm: 'pnpm create next-app@latest my-chat-app --typescript --tailwind --eslint --app',
  npm: 'npx create-next-app@latest my-chat-app --typescript --tailwind --eslint --app',
  yarn: 'yarn create next-app my-chat-app --typescript --tailwind --eslint --app',
  bun: 'bunx create-next-app@latest my-chat-app --typescript --tailwind --eslint --app',
}

const installDepsCommands: Record<PackageManager, string> = {
  pnpm: 'pnpm add @clarity-chat/react framer-motion lucide-react zod',
  npm: 'npm install @clarity-chat/react framer-motion lucide-react zod',
  yarn: 'yarn add @clarity-chat/react framer-motion lucide-react zod',
  bun: 'bun add @clarity-chat/react framer-motion lucide-react zod',
}

const tsconfigCode = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`

// Part 2: Basic Chat
const basicChatPageCode = `// app/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <main className="h-screen">
      <ClarityChatApp api="/api/chat" />
    </main>
  )
}`

// Part 3: Connect to AI
const openaiApiRouteCode = `// app/api/chat/route.ts
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

const anthropicApiRouteCode = `// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const { messages } = await request.json()
  const encoder = new TextEncoder()

  // Separate system message from user/assistant messages
  const systemMessage = messages.find((m: { role: string }) => m.role === 'system')
  const chatMessages = messages.filter((m: { role: string }) => m.role !== 'system')

  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: chatMessages,
    system: systemMessage?.content || 'You are a helpful assistant.',
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

const envFileCode = `# .env.local

# OpenAI (choose one)
OPENAI_API_KEY=sk-your-openai-api-key-here

# OR Anthropic
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here`

// Part 4: Add Memory
const memoryEnabledChatCode = `// app/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <main className="h-screen">
      <ClarityChatApp
        api="/api/chat"
        features={{
          memory: true,  // Enable conversation memory
        }}
        config={{
          memory: {
            strategy: 'sliding-window',  // Keep recent messages
            maxMessages: 50,             // Limit context size
            persistKey: 'my-chat-app',   // LocalStorage key
          },
        }}
        systemPrompt="You are a helpful assistant. You can remember previous conversations."
      />
    </main>
  )
}`

const memoryWithVectorStoreCode = `// Advanced: Vector-based memory for long conversations
<ClarityChatApp
  api="/api/chat"
  features={{ memory: true }}
  config={{
    memory: {
      strategy: 'vector-store',
      embedding: {
        provider: 'openai',
        model: 'text-embedding-3-small',
      },
      maxTokens: 8000,
      similarityThreshold: 0.7,
    },
  }}
/>`

// Part 5: Add Tools
const toolDefinitionCode = `// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Define available tools
const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name, e.g., San Francisco, CA',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit',
          },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_web',
      description: 'Search the web for information',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query',
          },
        },
        required: ['query'],
      },
    },
  },
]

// Tool execution functions
async function executeWeather(args: { location: string; unit?: string }) {
  // In production, call a real weather API
  const temp = Math.floor(Math.random() * 30) + 10
  const unit = args.unit || 'celsius'
  return {
    location: args.location,
    temperature: temp,
    unit,
    conditions: 'Partly cloudy',
  }
}

async function executeSearch(args: { query: string }) {
  // In production, call a real search API
  return {
    query: args.query,
    results: [
      { title: 'Example Result 1', snippet: 'This is a sample search result...' },
      { title: 'Example Result 2', snippet: 'Another relevant result...' },
    ],
  }
}

export async function POST(request: NextRequest) {
  const { messages } = await request.json()
  const encoder = new TextEncoder()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    tools,
    tool_choice: 'auto',
    stream: true,
  })

  const stream = new ReadableStream({
    async start(controller) {
      let toolCalls: OpenAI.ChatCompletionMessageToolCall[] = []

      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta

        // Handle text content
        if (delta?.content) {
          const data = JSON.stringify({ type: 'text-delta', content: delta.content })
          controller.enqueue(encoder.encode(\`data: \${data}\\n\\n\`))
        }

        // Collect tool calls
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            if (tc.index !== undefined) {
              if (!toolCalls[tc.index]) {
                toolCalls[tc.index] = { id: '', type: 'function', function: { name: '', arguments: '' } }
              }
              if (tc.id) toolCalls[tc.index].id = tc.id
              if (tc.function?.name) toolCalls[tc.index].function.name += tc.function.name
              if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments
            }
          }
        }
      }

      // Execute tool calls
      for (const toolCall of toolCalls) {
        if (toolCall?.function?.name) {
          const args = JSON.parse(toolCall.function.arguments)
          let result: unknown

          // Send tool start event
          const startData = JSON.stringify({
            type: 'tool-start',
            toolName: toolCall.function.name,
            toolCallId: toolCall.id,
          })
          controller.enqueue(encoder.encode(\`data: \${startData}\\n\\n\`))

          // Execute the tool
          if (toolCall.function.name === 'get_weather') {
            result = await executeWeather(args)
          } else if (toolCall.function.name === 'search_web') {
            result = await executeSearch(args)
          }

          // Send tool result
          const resultData = JSON.stringify({
            type: 'tool-result',
            toolCallId: toolCall.id,
            toolName: toolCall.function.name,
            result,
          })
          controller.enqueue(encoder.encode(\`data: \${resultData}\\n\\n\`))
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

const chatWithToolsCode = `// app/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <main className="h-screen">
      <ClarityChatApp
        api="/api/chat"
        features={{
          memory: true,
          tools: true,  // Enable tool UI
        }}
        config={{
          tools: {
            showProgress: true,     // Show tool execution status
            collapsible: true,      // Allow collapsing tool results
            autoApprove: true,      // Auto-approve tool execution
          },
        }}
        systemPrompt="You are a helpful assistant with access to weather and search tools."
      />
    </main>
  )
}`

// Part 6: Customize UI
const customizedUICode = `// app/page.tsx
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <main className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <ClarityChatApp
        api="/api/chat"
        preset="pro"
        features={{
          memory: true,
          tools: true,
        }}
        config={{
          ui: {
            theme: 'auto',           // 'light' | 'dark' | 'auto'
            showTimestamps: true,
            showAvatars: true,
            borderRadius: 'lg',      // 'sm' | 'md' | 'lg' | 'xl'
          },
        }}
        // Custom header
        header={
          <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h1 className="font-semibold">My AI Assistant</h1>
                <p className="text-xs text-neutral-500">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-neutral-500">Online</span>
            </div>
          </div>
        }
        // Starter prompts
        starterPrompts={[
          {
            title: 'Weather check',
            prompt: "What's the weather like in San Francisco?",
            icon: '🌤️',
          },
          {
            title: 'Code help',
            prompt: 'Help me write a React component',
            icon: '💻',
          },
          {
            title: 'Learn something',
            prompt: 'Explain quantum computing simply',
            icon: '📚',
          },
        ]}
        // Welcome message
        welcomeMessage={{
          title: 'Welcome to My AI Assistant',
          subtitle: 'I can help with weather, search, coding, and more!',
        }}
        systemPrompt="You are a helpful, friendly AI assistant. Be concise and use emojis occasionally."
      />
    </main>
  )
}`

const themeCustomizationCode = `// Custom theme with CSS variables
// Add to your globals.css

:root {
  --clarity-primary: 147 51 234;     /* Purple */
  --clarity-primary-foreground: 255 255 255;
  --clarity-secondary: 241 245 249;
  --clarity-accent: 16 185 129;       /* Emerald */
  --clarity-radius: 1rem;
}

.dark {
  --clarity-primary: 168 85 247;
  --clarity-secondary: 30 41 59;
  --clarity-accent: 52 211 153;
}`

// Complete final code
const finalCompleteCode = `// app/page.tsx - Complete Chat Application
'use client'

import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function ChatPage() {
  return (
    <main className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <ClarityChatApp
        api="/api/chat"
        preset="pro"
        features={{
          memory: true,
          tools: true,
        }}
        config={{
          ui: {
            theme: 'auto',
            showTimestamps: true,
            showAvatars: true,
          },
          memory: {
            strategy: 'sliding-window',
            maxMessages: 50,
            persistKey: 'my-chat-app',
          },
          tools: {
            showProgress: true,
            collapsible: true,
            autoApprove: true,
          },
        }}
        header={
          <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h1 className="font-semibold">My AI Assistant</h1>
                <p className="text-xs text-neutral-500">Powered by Clarity Chat</p>
              </div>
            </div>
          </div>
        }
        starterPrompts={[
          { title: 'Weather', prompt: "What's the weather in NYC?", icon: '🌤️' },
          { title: 'Code help', prompt: 'Write a React hook', icon: '💻' },
          { title: 'Search', prompt: 'Search for latest AI news', icon: '🔍' },
        ]}
        welcomeMessage={{
          title: 'Welcome!',
          subtitle: 'I can help with weather, search, and more.',
        }}
        systemPrompt="You are a helpful assistant with weather and search capabilities."
        onMessageSent={(msg) => console.log('User:', msg)}
        onMessageReceived={(msg) => console.log('AI:', msg)}
        onError={(err) => console.error('Error:', err)}
      />
    </main>
  )
}`

// =============================================================================
// Main Page Component
// =============================================================================

export default function TutorialPage() {
  const [activePart, setActivePart] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic'>('openai')
  const totalParts = 6

  return (
    <div className="min-h-screen">
      {/* Progress Indicator */}
      <ProgressIndicator currentPart={activePart} totalParts={totalParts} />

      <div className="container-docs py-8 sm:py-12">
        <Breadcrumbs />

        {/* Hero Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-brand-50 dark:from-purple-950/50 dark:to-brand-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                30-Minute Tutorial
              </span>
            </div>

            <KineticText className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Build a Complete Chat App
            </KineticText>

            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
              Follow this step-by-step tutorial to build a production-ready AI chat
              application with memory, tools, and beautiful UI customization.
            </p>

            {/* Learning Outcomes */}
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                What you will learn
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: <Package className="w-4 h-4" />, text: 'Set up a Next.js project with Clarity Chat' },
                  { icon: <Server className="w-4 h-4" />, text: 'Connect to OpenAI or Claude APIs' },
                  { icon: <Brain className="w-4 h-4" />, text: 'Add conversation memory' },
                  { icon: <Wrench className="w-4 h-4" />, text: 'Implement custom tools' },
                  { icon: <Palette className="w-4 h-4" />, text: 'Customize themes and UI' },
                  { icon: <Rocket className="w-4 h-4" />, text: 'Deploy to production' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-white/[0.02] rounded-lg border border-neutral-200/60 dark:border-white/[0.06]"
                  >
                    <span className="text-brand-500">{item.icon}</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time estimates */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { part: 1, time: '5 min', label: 'Project Setup', active: activePart === 1 },
                { part: 2, time: '5 min', label: 'Basic Chat', active: activePart === 2 },
                { part: 3, time: '5 min', label: 'Connect AI', active: activePart === 3 },
                { part: 4, time: '5 min', label: 'Add Memory', active: activePart === 4 },
                { part: 5, time: '5 min', label: 'Add Tools', active: activePart === 5 },
                { part: 6, time: '5 min', label: 'Customize UI', active: activePart === 6 },
              ].map((item) => (
                <button
                  key={item.part}
                  onClick={() => setActivePart(item.part)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                    item.active
                      ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/25'
                      : 'bg-white/60 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700'
                  )}
                >
                  <span className="text-xs font-bold">{item.part}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className={cn(
                    'text-xs',
                    item.active ? 'text-white/80' : 'text-neutral-500'
                  )}>
                    {item.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* What We'll Build Preview */}
        <ScrollReveal direction="up" delay={0.15}>
          <section className="mb-20">
            <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="text-xl font-semibold text-white">What We Are Building</h3>
              </div>

              <div className="rounded-xl bg-white dark:bg-neutral-950 overflow-hidden shadow-2xl">
                {/* Mock chat header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">My AI Assistant</div>
                      <div className="text-xs text-neutral-500">Powered by Clarity Chat</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-neutral-500">Online</span>
                  </div>
                </div>

                {/* Mock chat messages */}
                <div className="p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950 min-h-[200px]">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">
                      U
                    </div>
                    <div className="flex-1">
                      <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 inline-block border border-neutral-200 dark:border-neutral-800">
                        <p className="text-sm">What is the weather in San Francisco?</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="bg-brand-50 dark:bg-brand-950/30 rounded-xl p-3 inline-block border border-brand-200 dark:border-brand-800/50">
                        <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-2">
                          <Wrench className="w-3 h-3" />
                          <span>Using weather tool...</span>
                        </div>
                        <p className="text-sm">It is currently 18C and partly cloudy in San Francisco. Perfect weather for a walk!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock input */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-3">
                    <span className="text-sm text-neutral-400">Type a message...</span>
                    <div className="ml-auto">
                      <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Memory enabled</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tool calling</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Custom theme</span>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Prerequisites */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="mb-16">
            <Callout type="info" title="Prerequisites">
              <p className="mb-3">Before starting this tutorial, make sure you have:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>
                  <strong>Node.js 18+</strong> installed (
                  <Link
                    href="https://nodejs.org/"
                    target="_blank"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    download here
                  </Link>
                  )
                </li>
                <li>
                  A code editor like <strong>VS Code</strong>
                </li>
                <li>
                  An AI API key from{' '}
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
                </li>
                <li>
                  Basic familiarity with <strong>React</strong> and <strong>TypeScript</strong>
                </li>
              </ul>
            </Callout>
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* PART 1: Project Setup */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section id="part-1" className="mb-20 scroll-mt-32">
            <PartHeader
              partNumber={1}
              title="Project Setup"
              timeEstimate="5 minutes"
              icon={<Package className="w-7 h-7" />}
              color="bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25"
            />

            <Step number={1} title="Create a new Next.js project">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Start by creating a fresh Next.js project with TypeScript and Tailwind CSS.
                Run this command in your terminal:
              </p>
              <PackageManagerTabs commands={createNextAppCommands} className="mb-4" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                When prompted, accept the default options. This creates a project with the App Router.
              </p>
            </Step>

            <Step number={2} title="Navigate to your project">
              <CodeBlock
                code="cd my-chat-app"
                filename="Terminal"
              />
            </Step>

            <Step number={3} title="Install Clarity Chat and dependencies">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Install the Clarity Chat package along with its peer dependencies:
              </p>
              <PackageManagerTabs commands={installDepsCommands} />
            </Step>

            <Step number={4} title="Verify TypeScript configuration">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Ensure your <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">tsconfig.json</code> has the correct settings:
              </p>
              <CodeBlock code={tsconfigCode} filename="tsconfig.json" />
            </Step>

            <MilestoneCelebration
              title="Part 1 Complete!"
              description="Your project is set up and ready for development."
              icon={<CheckCircle2 className="w-7 h-7" />}
            />
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* PART 2: Basic Chat */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section id="part-2" className="mb-20 scroll-mt-32">
            <PartHeader
              partNumber={2}
              title="Basic Chat"
              timeEstimate="5 minutes"
              icon={<MessageSquare className="w-7 h-7" />}
              color="bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/25"
            />

            <Step number={1} title="Create the chat page">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Replace the contents of <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">app/page.tsx</code> with the ClarityChatApp component:
              </p>
              <CodeBlock code={basicChatPageCode} filename="app/page.tsx" />
            </Step>

            <Step number={2} title="Understand the component">
              <div className="space-y-4">
                <p className="text-neutral-600 dark:text-neutral-400">
                  The <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono text-brand-600 dark:text-brand-400">ClarityChatApp</code> component provides:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: <MessageSquare className="w-4 h-4" />, title: 'Message Display', desc: 'Renders user and AI messages with proper formatting' },
                    { icon: <Terminal className="w-4 h-4" />, title: 'Input Field', desc: 'Text input with send button and keyboard shortcuts' },
                    { icon: <Zap className="w-4 h-4" />, title: 'Streaming', desc: 'Real-time token-by-token display as AI responds' },
                    { icon: <AlertTriangle className="w-4 h-4" />, title: 'Error Handling', desc: 'Graceful error states with retry functionality' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
                    >
                      <div className="flex items-center gap-2 text-brand-500 mb-2">
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Step>

            <Callout type="tip" title="Quick test">
              <p>
                You can start the dev server now with <code className="px-1.5 py-0.5 bg-violet-100/50 dark:bg-violet-900/30 rounded text-sm font-mono">pnpm dev</code>, but the chat will not work yet because we have not created the API route. That is next!
              </p>
            </Callout>

            <MilestoneCelebration
              title="Part 2 Complete!"
              description="The chat UI is ready. Now let's connect it to an AI."
              icon={<MessageSquare className="w-7 h-7" />}
            />
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* PART 3: Connect to AI */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section id="part-3" className="mb-20 scroll-mt-32">
            <PartHeader
              partNumber={3}
              title="Connect to AI"
              timeEstimate="5 minutes"
              icon={<Cloud className="w-7 h-7" />}
              color="bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/25"
            />

            <Step number={1} title="Choose your AI provider">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Select which AI provider you want to use:
              </p>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setSelectedProvider('openai')}
                  className={cn(
                    'flex-1 p-4 rounded-xl border transition-all',
                    selectedProvider === 'openai'
                      ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700'
                      : 'bg-white/60 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700'
                  )}
                >
                  <div className="font-semibold mb-1">OpenAI</div>
                  <div className="text-sm text-neutral-500">GPT-4, GPT-3.5</div>
                </button>
                <button
                  onClick={() => setSelectedProvider('anthropic')}
                  className={cn(
                    'flex-1 p-4 rounded-xl border transition-all',
                    selectedProvider === 'anthropic'
                      ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700'
                      : 'bg-white/60 dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700'
                  )}
                >
                  <div className="font-semibold mb-1">Anthropic</div>
                  <div className="text-sm text-neutral-500">Claude 3.5, Claude 3</div>
                </button>
              </div>
            </Step>

            <Step number={2} title="Install the SDK">
              <PackageManagerTabs
                commands={
                  selectedProvider === 'openai'
                    ? {
                        pnpm: 'pnpm add openai',
                        npm: 'npm install openai',
                        yarn: 'yarn add openai',
                        bun: 'bun add openai',
                      }
                    : {
                        pnpm: 'pnpm add @anthropic-ai/sdk',
                        npm: 'npm install @anthropic-ai/sdk',
                        yarn: 'yarn add @anthropic-ai/sdk',
                        bun: 'bun add @anthropic-ai/sdk',
                      }
                }
              />
            </Step>

            <Step number={3} title="Create the API route">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Create a new file at <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">app/api/chat/route.ts</code>:
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProvider}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: durations.normal }}
                >
                  <CodeBlock
                    code={selectedProvider === 'openai' ? openaiApiRouteCode : anthropicApiRouteCode}
                    filename="app/api/chat/route.ts"
                  />
                </motion.div>
              </AnimatePresence>
            </Step>

            <Step number={4} title="Add your API key">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Create a <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono">.env.local</code> file in your project root:
              </p>
              <CodeBlock code={envFileCode} filename=".env.local" />

              <Callout type="warning" title="Security reminder">
                <p>
                  Never commit your <code className="px-1.5 py-0.5 bg-amber-100/50 dark:bg-amber-900/30 rounded text-sm font-mono">.env.local</code> file to version control. Add it to your <code className="px-1.5 py-0.5 bg-amber-100/50 dark:bg-amber-900/30 rounded text-sm font-mono">.gitignore</code>.
                </p>
              </Callout>
            </Step>

            <Step number={5} title="Test the chat">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Start the development server and test your chat:
              </p>
              <PackageManagerTabs
                commands={{
                  pnpm: 'pnpm dev',
                  npm: 'npm run dev',
                  yarn: 'yarn dev',
                  bun: 'bun dev',
                }}
              />
              <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Open <code className="px-1.5 py-0.5 bg-emerald-100/50 dark:bg-emerald-900/30 rounded text-sm font-mono">http://localhost:3000</code> and try sending a message. You should see the AI respond with streaming text!
                  </p>
                </div>
              </div>
            </Step>

            <MilestoneCelebration
              title="Part 3 Complete!"
              description="Your chat is now connected to a real AI. You have a working chat application!"
              icon={<Cloud className="w-7 h-7" />}
            />
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* PART 4: Add Memory */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section id="part-4" className="mb-20 scroll-mt-32">
            <PartHeader
              partNumber={4}
              title="Add Memory"
              timeEstimate="5 minutes"
              icon={<Brain className="w-7 h-7" />}
              color="bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25"
            />

            <Step number={1} title="Enable conversation memory">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Update your chat page to enable memory. This allows the AI to remember previous messages:
              </p>
              <CodeBlock code={memoryEnabledChatCode} filename="app/page.tsx" />
            </Step>

            <Step number={2} title="Understand memory strategies">
              <div className="space-y-4">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Clarity Chat supports multiple memory strategies:
                </p>
                <div className="grid gap-4">
                  {[
                    {
                      strategy: 'sliding-window',
                      title: 'Sliding Window',
                      desc: 'Keeps the most recent N messages. Simple and efficient.',
                      badge: 'Recommended',
                    },
                    {
                      strategy: 'token-limited',
                      title: 'Token Limited',
                      desc: 'Manages context by token count. Prevents exceeding model limits.',
                      badge: 'For long chats',
                    },
                    {
                      strategy: 'vector-store',
                      title: 'Vector Store',
                      desc: 'Uses embeddings for semantic search. Best for very long conversations.',
                      badge: 'Advanced',
                    },
                  ].map((item) => (
                    <div
                      key={item.strategy}
                      className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-sm font-mono text-brand-600 dark:text-brand-400">
                          {item.strategy}
                        </code>
                        <span className="px-2 py-0.5 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{item.title}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Step>

            <Step number={3} title="Test memory persistence">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Try these tests to verify memory is working:
              </p>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span>Send a message like &quot;My name is Alex&quot;</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span>Then ask &quot;What is my name?&quot; - the AI should remember</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  <span>Refresh the page and ask again - memory persists in localStorage</span>
                </li>
              </ul>
            </Step>

            <CollapsibleSection title="Advanced: Vector-based memory" badge="Optional">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                For applications with very long conversations, use vector-based memory:
              </p>
              <CodeBlock code={memoryWithVectorStoreCode} />
            </CollapsibleSection>

            <MilestoneCelebration
              title="Part 4 Complete!"
              description="Your AI now remembers conversations across sessions."
              icon={<Brain className="w-7 h-7" />}
            />
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* PART 5: Add Tools */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section id="part-5" className="mb-20 scroll-mt-32">
            <PartHeader
              partNumber={5}
              title="Add Tools"
              timeEstimate="5 minutes"
              icon={<Wrench className="w-7 h-7" />}
              color="bg-gradient-to-br from-rose-500 to-red-500 shadow-rose-500/25"
            />

            <Step number={1} title="Update the API route with tools">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Replace your API route with this enhanced version that includes weather and search tools:
              </p>
              <CodeBlock code={toolDefinitionCode} filename="app/api/chat/route.ts" />
            </Step>

            <Step number={2} title="Enable tools in the chat component">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Update your chat page to show tool execution in the UI:
              </p>
              <CodeBlock code={chatWithToolsCode} filename="app/page.tsx" />
            </Step>

            <Step number={3} title="Test the tools">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Try these prompts to test tool functionality:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <Sun className="w-4 h-4" />, prompt: "What's the weather in Tokyo?", tool: 'get_weather' },
                  { icon: <Search className="w-4 h-4" />, prompt: 'Search for latest AI news', tool: 'search_web' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
                  >
                    <div className="flex items-center gap-2 text-brand-500 mb-2">
                      {item.icon}
                      <code className="text-xs bg-brand-100 dark:bg-brand-900/30 px-2 py-0.5 rounded">
                        {item.tool}
                      </code>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      &quot;{item.prompt}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </Step>

            <Callout type="info" title="Tool execution flow">
              <ol className="list-decimal list-inside space-y-1">
                <li>User sends a message that requires tool use</li>
                <li>AI decides which tool to call and with what parameters</li>
                <li>The API executes the tool and streams the result</li>
                <li>AI incorporates the result into its response</li>
                <li>UI shows tool execution status and results</li>
              </ol>
            </Callout>

            <MilestoneCelebration
              title="Part 5 Complete!"
              description="Your chat can now use tools to fetch weather and search the web."
              icon={<Wrench className="w-7 h-7" />}
            />
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* PART 6: Customize UI */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section id="part-6" className="mb-20 scroll-mt-32">
            <PartHeader
              partNumber={6}
              title="Customize UI"
              timeEstimate="5 minutes"
              icon={<Palette className="w-7 h-7" />}
              color="bg-gradient-to-br from-violet-500 to-purple-500 shadow-violet-500/25"
            />

            <Step number={1} title="Add custom header and starter prompts">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Create a polished UI with a custom header, starter prompts, and welcome message:
              </p>
              <CodeBlock code={customizedUICode} filename="app/page.tsx" />
            </Step>

            <Step number={2} title="Customize the theme">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Add custom CSS variables to match your brand colors:
              </p>
              <CodeBlock code={themeCustomizationCode} filename="app/globals.css" />
            </Step>

            <Step number={3} title="Explore available presets">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Use presets for quick configuration:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'simple', desc: 'Basic streaming chat', features: ['Streaming', 'Error recovery'] },
                  { name: 'pro', desc: 'Token stats, optimization', features: ['Token tracking', 'Cost estimates'] },
                  { name: 'memory', desc: 'Conversation persistence', features: ['Context memory', 'Auto-cleanup'] },
                  { name: 'rag', desc: 'Document retrieval', features: ['Citations', 'Document sources'] },
                  { name: 'tools', desc: 'Tool calling support', features: ['Tool registry', 'Auto-approval'] },
                  { name: 'enterprise', desc: 'Full production features', features: ['All features', 'Observability'] },
                ].map((preset) => (
                  <div
                    key={preset.name}
                    className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
                  >
                    <code className="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 rounded text-sm font-mono text-brand-600 dark:text-brand-400">
                      preset=&quot;{preset.name}&quot;
                    </code>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {preset.desc}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {preset.features.map((f) => (
                        <li key={f} className="text-xs text-neutral-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Step>

            <MilestoneCelebration
              title="Tutorial Complete!"
              description="Congratulations! You have built a complete AI chat application."
              icon={<Trophy className="w-7 h-7" />}
            />
          </section>
        </ScrollReveal>

        {/* =========================================================================== */}
        {/* Complete Code & Conclusion */}
        {/* =========================================================================== */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-500 text-white shadow-lg shadow-emerald-500/25">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Complete Application</h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Here is the final code with all features combined
                </p>
              </div>
            </div>

            <CodeBlock code={finalCompleteCode} filename="app/page.tsx - Complete" />

            {/* Repository Link */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Github className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold text-lg">Full Code Repository</h3>
                    <p className="text-neutral-400 text-sm">
                      Clone the complete example with all features
                    </p>
                  </div>
                </div>
                <Link
                  href="https://github.com/clarity-chat/tutorial-example"
                  target="_blank"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                >
                  View on GitHub
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* What's Next */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What is Next?</h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Continue learning with these advanced guides and resources.
              </p>
            </div>

            <ScrollRevealStagger staggerDelay={0.1}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Database className="w-5 h-5" />,
                    title: 'RAG Integration',
                    description: 'Add document retrieval for knowledge-based chat',
                    href: '/guides/rag',
                    color: 'from-blue-500/10 to-cyan-500/10',
                  },
                  {
                    icon: <Layers className="w-5 h-5" />,
                    title: 'Architecture Guide',
                    description: 'Deep dive into component architecture',
                    href: '/get-started/architecture',
                    color: 'from-purple-500/10 to-pink-500/10',
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    title: 'Streaming Guide',
                    description: 'Advanced streaming patterns and optimization',
                    href: '/guides/streaming',
                    color: 'from-emerald-500/10 to-teal-500/10',
                  },
                  {
                    icon: <Code2 className="w-5 h-5" />,
                    title: 'API Reference',
                    description: 'Complete documentation for all APIs',
                    href: '/api',
                    color: 'from-amber-500/10 to-orange-500/10',
                  },
                  {
                    icon: <BookOpen className="w-5 h-5" />,
                    title: 'Explore Examples',
                    description: 'Browse production-ready examples',
                    href: '/explore/examples',
                    color: 'from-rose-500/10 to-red-500/10',
                  },
                  {
                    icon: <Rocket className="w-5 h-5" />,
                    title: 'Deployment Guide',
                    description: 'Deploy to Vercel, AWS, or self-host',
                    href: '/get-started/deployment',
                    color: 'from-violet-500/10 to-purple-500/10',
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

        {/* Final CTA */}
        <ScrollReveal direction="up" delay={0.2}>
          <section>
            <div className="rounded-2xl bg-gradient-to-br from-brand-500 via-purple-500 to-pink-500 p-8 sm:p-12 text-center text-white">
              <Trophy className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                You Did It!
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                You have successfully built a production-ready AI chat application with
                memory, tools, and custom UI. The possibilities are endless!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/playground"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-xl font-medium hover:bg-white/90 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Try Playground
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore Components
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
