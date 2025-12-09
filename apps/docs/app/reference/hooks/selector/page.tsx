'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

type Question = {
  id: string
  question: string
  options: {
    label: string
    value: string
    next?: string
    result?: HookRecommendation[]
  }[]
}

type HookRecommendation = {
  hook: string
  href: string
  description: string
  why: string
}

const questions: Question[] = [
  {
    id: 'start',
    question: 'What are you trying to build?',
    options: [
      { label: 'A complete chat interface', value: 'chat', next: 'chat-features' },
      { label: 'Structured data extraction from AI', value: 'structured', result: [
        { hook: 'useClarityObject', href: '/reference/hooks/use-clarity-object', description: 'Generate structured JSON from AI responses', why: 'Best for extracting typed data from AI' }
      ]},
      { label: 'AI agent with tools', value: 'agent', next: 'agent-type' },
      { label: 'Data persistence/storage', value: 'storage', next: 'storage-type' },
      { label: 'UI enhancements', value: 'ui', next: 'ui-type' },
      { label: 'Analytics/monitoring', value: 'analytics', result: [
        { hook: 'useDashboardData', href: '/reference/hooks/use-dashboard-data', description: 'Data fetching with auto-refresh for dashboards', why: 'Provides loading states, caching, and polling' },
        { hook: 'useTokenTracker', href: '/reference/hooks/use-token-tracker', description: 'Track token usage across messages', why: 'Monitor costs and context window usage' }
      ]},
    ],
  },
  {
    id: 'chat-features',
    question: 'What features do you need?',
    options: [
      { label: 'Just basic chat (messages, streaming)', value: 'basic', result: [
        { hook: 'useClarityChat', href: '/reference/hooks/use-clarity-chat', description: 'Primary chat hook with streaming and memory', why: 'Recommended starting point for all chat apps' }
      ]},
      { label: 'Chat with memory/context awareness', value: 'memory', result: [
        { hook: 'useClarityChat', href: '/reference/hooks/use-clarity-chat', description: 'Primary chat hook with built-in memory options', why: 'Has memory: { strategy: "vector-store" } option' },
        { hook: 'useMemoryContext', href: '/reference/hooks/use-memory-context', description: 'Direct memory operations (add, query, delete)', why: 'Use when you need fine-grained memory control' }
      ]},
      { label: 'Chat with function calling/tools', value: 'tools', result: [
        { hook: 'useClarityChatWithTools', href: '/reference/hooks/use-clarity-chat-with-tools', description: 'Chat with tool UI registry integration', why: 'Automatically renders tool results with custom components' }
      ]},
      { label: 'High-performance chat for enterprise', value: 'performance', result: [
        { hook: 'useChatOptimized', href: '/reference/hooks/use-chat-optimized', description: 'Optimized variant with memoization and batching', why: 'Reduces re-renders for complex dashboards' },
        { hook: 'useTokenOptimizationEnhanced', href: '/reference/hooks/use-token-optimization-enhanced', description: 'Advanced token management', why: 'Context compression and budget management' }
      ]},
    ],
  },
  {
    id: 'agent-type',
    question: 'What kind of agent capabilities?',
    options: [
      { label: 'Simple tool calling', value: 'tools', result: [
        { hook: 'useClarityChatWithTools', href: '/reference/hooks/use-clarity-chat-with-tools', description: 'Chat with tool result rendering', why: 'Maps tool names to React components' },
        { hook: 'useAssistant', href: '/reference/hooks/use-assistant', description: 'OpenAI Assistants API integration', why: 'For OpenAI-specific assistant features' }
      ]},
      { label: 'RAG (retrieval augmented generation)', value: 'rag', result: [
        { hook: 'useRAGPipeline', href: '/reference/hooks/use-rag-pipeline', description: 'Complete RAG pipeline management', why: 'Handles chunking, embedding, retrieval' },
        { hook: 'useVectorStore', href: '/reference/hooks/use-vector-store', description: 'Vector store operations', why: 'For custom RAG implementations' },
        { hook: 'useEmbeddings', href: '/reference/hooks/use-embeddings', description: 'Generate text embeddings', why: 'Client-side embedding generation with caching' }
      ]},
      { label: 'Multi-step agent workflows', value: 'workflow', result: [
        { hook: 'useAgent', href: '/reference/hooks/use-agent', description: 'Stateful agent with tool execution', why: 'For complex multi-step agent workflows' }
      ]},
    ],
  },
  {
    id: 'storage-type',
    question: 'What kind of data are you storing?',
    options: [
      { label: 'Small settings/preferences (<5MB)', value: 'small', result: [
        { hook: 'useLocalStorage', href: '/reference/hooks/use-local-storage', description: 'Simple localStorage wrapper with SSR safety', why: 'Best for small, simple data' }
      ]},
      { label: 'Large conversations or files (>5MB)', value: 'large', result: [
        { hook: 'useIndexedDB', href: '/reference/hooks/use-indexed-db', description: 'IndexedDB for large data with fallback', why: 'Handles large data, supports queries' }
      ]},
      { label: 'AI memories/context', value: 'memory', result: [
        { hook: 'useMemoryContext', href: '/reference/hooks/use-memory-context', description: 'Memory operations within MemoryProvider', why: 'Purpose-built for AI memory management' }
      ]},
    ],
  },
  {
    id: 'ui-type',
    question: 'What UI enhancement do you need?',
    options: [
      { label: 'Keyboard shortcuts', value: 'keyboard', result: [
        { hook: 'useKeyboardShortcuts', href: '/reference/hooks/use-keyboard-shortcuts', description: 'Global keyboard shortcut handling', why: 'Handles modifier keys, prevents conflicts' },
        { hook: 'useCommandPalette', href: '/reference/hooks/use-command-palette', description: 'Cmd+K command palette state', why: 'Includes shortcut display helper' }
      ]},
      { label: 'Theming/styling', value: 'theming', result: [
        { hook: 'useTheme', href: '/reference/hooks/use-theme', description: 'Theme switching and detection', why: 'Dark/light mode management' },
        { hook: 'useDesignTokens', href: '/reference/hooks/use-design-tokens', description: 'Access design system tokens', why: 'For consistent custom styling' }
      ]},
      { label: 'Mobile optimizations', value: 'mobile', result: [
        { hook: 'useMobileOptimization', href: '/reference/hooks/use-mobile-optimization', description: 'Mobile-specific optimizations', why: 'Touch handling, viewport adjustments' },
        { hook: 'useMobileKeyboard', href: '/reference/hooks/use-mobile-keyboard', description: 'Mobile keyboard handling', why: 'Input focus and resize handling' }
      ]},
      { label: 'Streaming text display', value: 'streaming', result: [
        { hook: 'useStreamableUI', href: '/reference/hooks/use-streamable-ui', description: 'UI state for streaming content', why: 'Smooth typing effects and transitions' },
        { hook: 'useRealisticTyping', href: '/reference/hooks/use-realistic-typing', description: 'Realistic typing animation', why: 'Human-like character-by-character display' }
      ]},
    ],
  },
]

export default function HookSelectorPage() {
  const [currentQuestion, setCurrentQuestion] = useState<string>('start')
  const [results, setResults] = useState<HookRecommendation[] | null>(null)
  const [history, setHistory] = useState<string[]>([])

  const question = questions.find((q) => q.id === currentQuestion)

  const handleSelect = (option: (typeof questions)[0]['options'][0]) => {
    if (option.result) {
      setResults(option.result)
    } else if (option.next) {
      setHistory([...history, currentQuestion])
      setCurrentQuestion(option.next)
    }
  }

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setHistory(history.slice(0, -1))
      setCurrentQuestion(prev)
      setResults(null)
    }
  }

  const handleReset = () => {
    setCurrentQuestion('start')
    setResults(null)
    setHistory([])
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Which Hook Should I Use?</h1>
        <p className="text-xl text-muted-foreground">
          Answer a few questions to find the right hook for your use case.
        </p>
      </div>

      {!results ? (
        <div className="border rounded-xl p-8">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            {history.map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-brand-500" />
            ))}
            <div className="w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-900" />
          </div>

          <h2 className="text-2xl font-semibold mb-6">{question?.question}</h2>

          <div className="space-y-3">
            {question?.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-3 border rounded-lg hover:bg-muted hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <button
              onClick={handleBack}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to previous question
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold mb-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Recommended Hooks
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              Based on your answers, here are the best hooks for your use case:
            </p>
          </div>

          <div className="space-y-4">
            {results.map((result, i) => (
              <Link
                key={result.hook}
                href={result.href}
                className="block border rounded-lg p-5 hover:bg-muted hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {i === 0 && (
                        <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded text-xs font-medium">
                          Best Match
                        </span>
                      )}
                      <h3 className="text-lg font-mono font-semibold">{result.hook}</h3>
                    </div>
                    <p className="text-muted-foreground mb-2">{result.description}</p>
                    <p className="text-sm">
                      <span className="font-medium">Why:</span> {result.why}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Start Over
            </button>
            <Link
              href="/reference/hooks"
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse All Hooks →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
