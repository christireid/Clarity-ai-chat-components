'use client'

/**
 * Hooks Reference Index Page
 *
 * Overview of all available hooks in Clarity Chat.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  ChevronRight,
  Zap,
  Database,
  Brain,
  Shield,
  Gauge,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

// ISR Configuration
export const revalidate = 3600

interface HookInfo {
  name: string
  description: string
  href: string
  category: string
  stable?: boolean
}

const hooks: HookInfo[] = [
  // Core Chat Hooks
  {
    name: 'useClarityChat',
    description:
      'Primary hook for chat state management with streaming, memory, and optimization.',
    href: '/reference/hooks/use-clarity-chat',
    category: 'Core',
    stable: true,
  },
  {
    name: 'useClarityChatWithTools',
    description: 'Extended chat hook with tool calling and agent support.',
    href: '/reference/hooks/use-clarity-chat-with-tools',
    category: 'Core',
    stable: true,
  },
  {
    name: 'useChatHandlers',
    description:
      'Pre-built handlers for message operations like edit, delete, regenerate.',
    href: '/reference/hooks/use-chat-handlers',
    category: 'Core',
    stable: true,
  },
  {
    name: 'useChatEnhanced',
    description: 'Mid-level chat hook with Vercel AI SDK compatibility.',
    href: '/reference/hooks/use-chat-enhanced',
    category: 'Core',
  },
  {
    name: 'useAssistant',
    description: 'Hook for OpenAI Assistant API integration.',
    href: '/reference/hooks/use-assistant',
    category: 'Core',
  },
  {
    name: 'useCompletion',
    description: 'Hook for text completion (non-chat) use cases.',
    href: '/reference/hooks/use-completion',
    category: 'Core',
  },
  // Message Hooks
  {
    name: 'useMessages',
    description: 'Low-level hook for message state management.',
    href: '/reference/hooks/use-messages',
    category: 'Messages',
  },
  {
    name: 'useTyping',
    description: 'Typing indicator state management.',
    href: '/reference/hooks/use-typing',
    category: 'Messages',
  },
  {
    name: 'useMessageOperations',
    description: 'Edit, delete, branch, and merge message operations.',
    href: '/reference/hooks/use-message-operations',
    category: 'Messages',
  },
  // Streaming Hooks
  {
    name: 'useStreamingSSE',
    description: 'Server-Sent Events streaming implementation.',
    href: '/reference/hooks/use-streaming-sse',
    category: 'Streaming',
  },
  {
    name: 'useStreamingWebSocket',
    description: 'WebSocket streaming with auto-reconnect.',
    href: '/reference/hooks/use-streaming-websocket',
    category: 'Streaming',
  },
  {
    name: 'useStreamableUI',
    description: 'React Server Components streaming support.',
    href: '/reference/hooks/use-streamable-ui',
    category: 'Streaming',
  },
  // Memory Hooks
  {
    name: 'useMemoryContext',
    description: 'Access memory context and operations.',
    href: '/reference/hooks/use-memory-context',
    category: 'Memory',
  },
  {
    name: 'useIndexedDB',
    description: 'Client-side persistence with IndexedDB.',
    href: '/reference/hooks/use-indexed-db',
    category: 'Memory',
  },
  {
    name: 'useEmbeddings',
    description: 'Text embeddings generation and caching.',
    href: '/reference/hooks/use-embeddings',
    category: 'Memory',
  },
  // Token Hooks
  {
    name: 'useTokenOptimization',
    description: 'Comprehensive token optimization and management.',
    href: '/reference/hooks/use-token-optimization',
    category: 'Tokens',
  },
  {
    name: 'useTokenTracker',
    description: 'Token usage tracking and cost estimation.',
    href: '/reference/hooks/use-token-tracker',
    category: 'Tokens',
  },
  // UI Hooks
  {
    name: 'useKeyboardShortcuts',
    description: 'Keyboard shortcut management and handlers.',
    href: '/reference/hooks/use-keyboard-shortcuts',
    category: 'UI',
  },
  {
    name: 'useCommandPalette',
    description: 'Command palette state and commands.',
    href: '/reference/hooks/use-command-palette',
    category: 'UI',
  },
  {
    name: 'useUndoRedo',
    description: 'Undo/redo functionality for messages.',
    href: '/reference/hooks/use-undo-redo',
    category: 'UI',
  },
  {
    name: 'useTheme',
    description: 'Theme management and switching.',
    href: '/reference/hooks/use-theme',
    category: 'UI',
  },
  {
    name: 'useDesignTokens',
    description: 'Access and customize design tokens.',
    href: '/reference/hooks/use-design-tokens',
    category: 'UI',
  },
  {
    name: 'useHaptic',
    description: 'Haptic feedback for mobile devices.',
    href: '/reference/hooks/use-haptic',
    category: 'UI',
  },
  // Performance Hooks
  {
    name: 'usePerformance',
    description: 'Performance monitoring and metrics.',
    href: '/reference/hooks/use-performance',
    category: 'Performance',
  },
  {
    name: 'useSmartCache',
    description: 'Intelligent response caching.',
    href: '/reference/hooks/use-smart-cache',
    category: 'Performance',
  },
  {
    name: 'useModelRouter',
    description: 'Dynamic model selection and routing.',
    href: '/reference/hooks/use-model-router',
    category: 'Performance',
  },
  // Resilience Hooks
  {
    name: 'useCircuitBreaker',
    description: 'Circuit breaker pattern for API calls.',
    href: '/reference/hooks/use-circuit-breaker',
    category: 'Resilience',
  },
  {
    name: 'useRetryWithBackoff',
    description: 'Retry logic with exponential backoff.',
    href: '/reference/hooks/use-retry-with-backoff',
    category: 'Resilience',
  },
  {
    name: 'useRequestDeduplication',
    description: 'Prevent duplicate concurrent requests.',
    href: '/reference/hooks/use-request-deduplication',
    category: 'Resilience',
  },
  // Enterprise Hooks
  {
    name: 'useRAGPipeline',
    description: 'Retrieval-Augmented Generation pipeline.',
    href: '/reference/hooks/use-rag-pipeline',
    category: 'Enterprise',
  },
  {
    name: 'useAgent',
    description: 'Agent orchestration with tools and planning.',
    href: '/reference/hooks/use-agent',
    category: 'Enterprise',
  },
  {
    name: 'useVectorStore',
    description: 'Vector database integration.',
    href: '/reference/hooks/use-vector-store',
    category: 'Enterprise',
  },
  {
    name: 'useDashboardData',
    description: 'Analytics dashboard data aggregation.',
    href: '/reference/hooks/use-dashboard-data',
    category: 'Enterprise',
  },
]

const categories = [
  { name: 'Core', icon: Code2, description: 'Essential chat functionality' },
  {
    name: 'Messages',
    icon: MessageSquare,
    description: 'Message state and operations',
  },
  {
    name: 'Streaming',
    icon: Zap,
    description: 'Real-time streaming protocols',
  },
  {
    name: 'Memory',
    icon: Database,
    description: 'Context persistence and retrieval',
  },
  {
    name: 'Tokens',
    icon: Gauge,
    description: 'Token management and optimization',
  },
  { name: 'UI', icon: Code2, description: 'User interface and interactions' },
  { name: 'Performance', icon: Gauge, description: 'Performance and caching' },
  {
    name: 'Resilience',
    icon: Shield,
    description: 'Error handling and retries',
  },
  { name: 'Enterprise', icon: Brain, description: 'Advanced AI capabilities' },
]

export default function HooksIndexPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.moderate }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Code2 className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">Hooks</h1>

          <p className="text-lg text-muted-foreground max-w-3xl">
            React hooks for building AI chat interfaces. From simple chat state
            management to advanced features like memory, streaming, and token
            optimization.
          </p>
        </motion.header>

        {/* Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, delay: 0.1 }}
          className="mb-12 p-6 rounded-xl bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-200 dark:border-brand-800"
        >
          <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
          <p className="text-muted-foreground mb-4">
            For most use cases, start with{' '}
            <code className="text-brand-600 dark:text-brand-400">
              useClarityChat
            </code>{' '}
            - it provides everything you need for a complete chat
            interface.
          </p>
          <Link
            href="/reference/hooks/use-clarity-chat"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
              'bg-brand-600 text-white hover:bg-brand-700 transition-colors'
            )}
          >
            Get Started with useClarityChat
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.section>

        {/* Hooks by Category */}
        {categories.map((category, categoryIndex) => {
          const categoryHooks = hooks.filter(
            (h) => h.category === category.name
          )
          if (categoryHooks.length === 0) return null

          const Icon = category.icon

          return (
            <motion.section
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1 + categoryIndex * 0.05,
              }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-2xl font-bold text-foreground">
                  {category.name}
                </h2>
              </div>
              <p className="text-muted-foreground mb-6">
                {category.description}
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryHooks.map((hook) => (
                  <Link
                    key={hook.name}
                    href={hook.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {hook.name}
                      </span>
                      {hook.stable && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Stable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hook.description}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.section>
          )
        })}

        {/* Tools Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, delay: 0.5 }}
          className="mt-12 p-6 rounded-xl bg-muted/30 border border-border/50"
        >
          <h2 className="text-xl font-semibold mb-4">Hook Selection Tools</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/reference/hooks/selector"
              className="p-4 rounded-lg border border-border/50 hover:border-brand-500/30 transition-all"
            >
              <h3 className="font-semibold mb-1">Hook Selector</h3>
              <p className="text-sm text-muted-foreground">
                Answer questions to find the right hook for your use case.
              </p>
            </Link>
            <Link
              href="/reference/hooks/compare"
              className="p-4 rounded-lg border border-border/50 hover:border-brand-500/30 transition-all"
            >
              <h3 className="font-semibold mb-1">Compare Hooks</h3>
              <p className="text-sm text-muted-foreground">
                Side-by-side comparison of similar hooks.
              </p>
            </Link>
            <Link
              href="/reference/hooks/graph"
              className="p-4 rounded-lg border border-border/50 hover:border-brand-500/30 transition-all"
            >
              <h3 className="font-semibold mb-1">Hook Graph</h3>
              <p className="text-sm text-muted-foreground">
                Visualize hook dependencies and relationships.
              </p>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
