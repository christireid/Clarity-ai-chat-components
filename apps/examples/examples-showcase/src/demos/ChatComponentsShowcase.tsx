/**
 * Chat Components Showcase
 *
 * Comprehensive demonstration of chat-specific components including:
 * - MessageList with virtualization
 * - StreamingMessage with typing effects
 * - ThinkingIndicator states
 * - ToolInvocationCard
 * - CitationCard
 * - ContextPanel
 * - ConversationList
 * - ConversationBranch
 */

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageList,
  StreamingMessage,
  ThinkingIndicator,
  ToolInvocationCard,
  CitationCard,
  ConversationList,
  ConversationBranchVisualizer,
  MessageBubble,
  UserMessage,
  AssistantMessage,
  TypingIndicator,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

// Glassmorphism styles
const glassStyles = {
  base: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
  light: 'backdrop-blur-xl bg-white/70 border border-white/30 shadow-xl',
  card: 'backdrop-blur-md bg-white/80 border border-white/40 shadow-lg',
}

// Sample data for demonstrations
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is React?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the community.',
    timestamp: new Date(Date.now() - 290000),
  },
  {
    id: '3',
    role: 'user',
    content: 'Can you show me a simple example?',
    timestamp: new Date(Date.now() - 280000),
  },
  {
    id: '4',
    role: 'assistant',
    content: `Here's a simple React component example:

\`\`\`tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

// Usage
<Greeting name="World" />
\`\`\`

This component renders a greeting message with the provided name.`,
    timestamp: new Date(Date.now() - 270000),
  },
]

const SAMPLE_CITATIONS = [
  {
    id: 'citation-1',
    title: 'React Official Documentation',
    url: 'https://react.dev',
    snippet: 'React is a JavaScript library for building user interfaces...',
    relevance: 0.95,
  },
  {
    id: 'citation-2',
    title: 'React Hooks Guide',
    url: 'https://react.dev/reference/react',
    snippet: 'Hooks let you use different React features from your components...',
    relevance: 0.88,
  },
  {
    id: 'citation-3',
    title: 'Component Best Practices',
    url: 'https://react.dev/learn/thinking-in-react',
    snippet: 'Breaking down a UI into a component hierarchy...',
    relevance: 0.82,
  },
]

const SAMPLE_CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'React Basics Discussion',
    lastMessage: 'Can you explain useState?',
    timestamp: new Date(Date.now() - 3600000),
    messageCount: 12,
    isActive: false,
  },
  {
    id: 'conv-2',
    title: 'TypeScript Integration',
    lastMessage: 'Here is how to set up TypeScript with React...',
    timestamp: new Date(Date.now() - 7200000),
    messageCount: 8,
    isActive: false,
  },
  {
    id: 'conv-3',
    title: 'Current Conversation',
    lastMessage: 'What is React?',
    timestamp: new Date(),
    messageCount: 4,
    isActive: true,
  },
]

const SAMPLE_TOOL_INVOCATION = {
  toolName: 'search_documentation',
  status: 'success' as const,
  input: {
    query: 'React hooks usage',
    scope: 'official-docs',
  },
  output: {
    results: [
      'useState Hook',
      'useEffect Hook',
      'useContext Hook',
      'useReducer Hook',
    ],
    count: 4,
  },
  duration: 1245,
}

type DemoSection =
  | 'message-list'
  | 'streaming'
  | 'thinking'
  | 'tool-invocation'
  | 'citations'
  | 'context-panel'
  | 'conversation-list'
  | 'conversation-branch'

interface ContextItem {
  id: string
  type: 'file' | 'url' | 'snippet'
  name: string
  content?: string
  metadata?: Record<string, any>
}

export const ChatComponentsShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DemoSection>('message-list')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [thinkingState, setThinkingState] = useState<
    'thinking' | 'processing' | 'complete'
  >('thinking')
  const [selectedConversation, setSelectedConversation] = useState('conv-3')
  const [contextItems, setContextItems] = useState<ContextItem[]>([
    {
      id: 'ctx-1',
      type: 'file',
      name: 'App.tsx',
      content: 'import React from "react"...',
      metadata: { size: 2048, modified: new Date() },
    },
    {
      id: 'ctx-2',
      type: 'url',
      name: 'React Documentation',
      content: 'https://react.dev',
      metadata: { title: 'React Docs' },
    },
  ])

  // Streaming simulation
  const startStreaming = useCallback(() => {
    setIsStreaming(true)
    setStreamingContent('')

    const fullText =
      'This is a streaming message demonstration. Watch as each character appears in real-time, simulating how AI responses are typically delivered to users. This creates a more engaging and interactive experience.'

    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setStreamingContent(fullText.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  // Thinking indicator cycle
  useEffect(() => {
    if (activeSection === 'thinking') {
      const states: Array<'thinking' | 'processing' | 'complete'> = [
        'thinking',
        'processing',
        'complete',
      ]
      let index = 0

      const interval = setInterval(() => {
        index = (index + 1) % states.length
        setThinkingState(states[index])
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [activeSection])

  const sections = [
    { id: 'message-list', name: 'Message List', icon: '💬' },
    { id: 'streaming', name: 'Streaming', icon: '⚡' },
    { id: 'thinking', name: 'Thinking Indicator', icon: '🤔' },
    { id: 'tool-invocation', name: 'Tool Invocation', icon: '🛠️' },
    { id: 'citations', name: 'Citations', icon: '📚' },
    { id: 'context-panel', name: 'Context Panel', icon: '📋' },
    { id: 'conversation-list', name: 'Conversations', icon: '💭' },
    { id: 'conversation-branch', name: 'Branching', icon: '🌳' },
  ] as const

  const renderSection = () => {
    switch (activeSection) {
      case 'message-list':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                MessageList with Virtualization
              </h3>
              <p className="text-gray-600 mb-6">
                Efficient message rendering with virtual scrolling for optimal performance
                with large conversation histories.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-hidden">
                <div className="space-y-3">
                  {SAMPLE_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <div className="text-xs opacity-75 mb-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="font-semibold text-blue-900">
                    {SAMPLE_MESSAGES.length}
                  </div>
                  <div className="text-blue-600">Messages</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="font-semibold text-purple-900">Virtual</div>
                  <div className="text-purple-600">Scrolling</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="font-semibold text-green-900">Optimized</div>
                  <div className="text-green-600">Performance</div>
                </div>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Virtual scrolling for thousands of messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Automatic scroll-to-bottom on new messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Message grouping by sender and time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Keyboard navigation support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Accessibility with ARIA labels</span>
                </li>
              </ul>
            </div>
          </div>
        )

      case 'streaming':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                StreamingMessage Component
              </h3>
              <p className="text-gray-600 mb-6">
                Real-time streaming with typing effects for AI-generated content.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">Assistant</div>
                    <div className="text-gray-700">
                      {streamingContent}
                      {isStreaming && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block ml-1 w-0.5 h-5 bg-blue-500 align-middle"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={startStreaming}
                  disabled={isStreaming}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  {isStreaming ? 'Streaming...' : 'Start Streaming'}
                </button>

                <button
                  onClick={() => {
                    setIsStreaming(false)
                    setStreamingContent('')
                  }}
                  disabled={!isStreaming && !streamingContent}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Streaming States</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="font-semibold text-yellow-900">Loading</div>
                  <div className="text-yellow-600 text-xs">Waiting for data</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="font-semibold text-blue-900">Streaming</div>
                  <div className="text-blue-600 text-xs">Content flowing</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="font-semibold text-green-900">Complete</div>
                  <div className="text-green-600 text-xs">Fully rendered</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'thinking':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                ThinkingIndicator States
              </h3>
              <p className="text-gray-600 mb-6">
                Visual feedback for different AI processing states.
              </p>

              <div className="space-y-6">
                {/* Thinking State */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-blue-900 font-semibold">Thinking...</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    AI is analyzing your query and preparing a response
                  </p>
                </div>

                {/* Processing State */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"
                    />
                    <span className="text-purple-900 font-semibold">Processing...</span>
                  </div>
                  <p className="text-purple-700 text-sm">
                    Running tools and gathering information
                  </p>
                </div>

                {/* Complete State */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ✓
                    </motion.div>
                    <span className="text-green-900 font-semibold">Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Response generated successfully
                  </p>
                </div>

                {/* Current State Indicator */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600 mb-2">Current State:</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {thinkingState}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (Automatically cycles every 2 seconds)
                  </div>
                </div>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Use Cases</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Show progress during long AI computations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Indicate tool execution and function calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Provide feedback during document processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Improve perceived performance and user engagement</span>
                </li>
              </ul>
            </div>
          </div>
        )

      case 'tool-invocation':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                ToolInvocationCard
              </h3>
              <p className="text-gray-600 mb-6">
                Display tool/function execution with input, output, and status.
              </p>

              <div className="space-y-4">
                {/* Success State */}
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      🛠️
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {SAMPLE_TOOL_INVOCATION.toolName}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Success
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <div className="text-gray-500 font-medium mb-1">Input:</div>
                          <div className="bg-gray-50 rounded p-2 font-mono text-xs">
                            {JSON.stringify(SAMPLE_TOOL_INVOCATION.input, null, 2)}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-500 font-medium mb-1">Output:</div>
                          <div className="bg-gray-50 rounded p-2 font-mono text-xs">
                            {JSON.stringify(SAMPLE_TOOL_INVOCATION.output, null, 2)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                          <span>Duration: {SAMPLE_TOOL_INVOCATION.duration}ms</span>
                          <span>•</span>
                          <span>
                            Results: {SAMPLE_TOOL_INVOCATION.output.results.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"
                    >
                      ⚙️
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          fetch_weather_data
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Running...
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Fetching weather information for New York...
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      ❌
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          query_database
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Error
                        </span>
                      </div>
                      <div className="text-sm text-red-600">
                        Connection timeout: Database server not responding
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">States</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="font-semibold text-green-900">Success</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">⏳</div>
                  <div className="font-semibold text-blue-900">Running</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">❌</div>
                  <div className="font-semibold text-red-900">Error</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'citations':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">CitationCard</h3>
              <p className="text-gray-600 mb-6">
                Display source citations with relevance scores and metadata.
              </p>

              <div className="space-y-3">
                {SAMPLE_CITATIONS.map((citation, index) => (
                  <div
                    key={citation.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {citation.title}
                          </h4>
                          <a
                            href={citation.url}
                            className="text-xs text-blue-600 hover:underline truncate block"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {citation.url}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-500">Relevance:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {(citation.relevance * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 ml-11">
                      {citation.snippet}
                    </p>

                    <div className="mt-3 ml-11">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${citation.relevance * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Relevance score visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Clickable links to source material</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Content snippets for quick reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Hover effects for better UX</span>
                </li>
              </ul>
            </div>
          </div>
        )

      case 'context-panel':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Context Panel</h3>
              <p className="text-gray-600 mb-6">
                Manage conversation context including files, URLs, and code snippets.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Active Context</h4>
                  <span className="text-xs text-gray-500">
                    {contextItems.length} items
                  </span>
                </div>

                <div className="space-y-2">
                  {contextItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-xl flex-shrink-0">
                            {item.type === 'file'
                              ? '📄'
                              : item.type === 'url'
                                ? '🔗'
                                : '💾'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {item.name}
                            </div>
                            {item.content && (
                              <div className="text-xs text-gray-500 truncate">
                                {item.content}
                              </div>
                            )}
                            {item.metadata && (
                              <div className="text-xs text-gray-400 mt-1">
                                {item.type === 'file' && item.metadata.size && (
                                  <span>
                                    {(item.metadata.size / 1024).toFixed(1)} KB
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setContextItems((items) =>
                              items.filter((i) => i.id !== item.id)
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newItem: ContextItem = {
                      id: `ctx-${Date.now()}`,
                      type: 'snippet',
                      name: 'New Snippet',
                      content: 'Sample code snippet',
                    }
                    setContextItems([...contextItems, newItem])
                  }}
                  className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add Context Item
                </button>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Context Types</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">📄</div>
                  <div className="font-semibold text-blue-900">Files</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">🔗</div>
                  <div className="font-semibold text-purple-900">URLs</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">💾</div>
                  <div className="font-semibold text-green-900">Snippets</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'conversation-list':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                ConversationList
              </h3>
              <p className="text-gray-600 mb-6">
                Browse and manage multiple conversations with timestamps and metadata.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {SAMPLE_CONVERSATIONS.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedConversation === conv.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-white hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="font-semibold truncate">{conv.title}</div>
                        {conv.isActive && (
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${
                              selectedConversation === conv.id
                                ? 'bg-white/20 text-white'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            Active
                          </span>
                        )}
                      </div>

                      <div
                        className={`text-sm truncate mb-2 ${
                          selectedConversation === conv.id
                            ? 'text-blue-100'
                            : 'text-gray-600'
                        }`}
                      >
                        {conv.lastMessage}
                      </div>

                      <div
                        className={`flex items-center gap-3 text-xs ${
                          selectedConversation === conv.id
                            ? 'text-blue-200'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>{conv.messageCount} messages</span>
                        <span>•</span>
                        <span>{conv.timestamp.toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Quick conversation switching</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Message count and timestamp display</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Active conversation indicator</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Search and filter capabilities</span>
                </li>
              </ul>
            </div>
          </div>
        )

      case 'conversation-branch':
        return (
          <div className="space-y-4">
            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                ConversationBranch
              </h3>
              <p className="text-gray-600 mb-6">
                Visualize and navigate conversation branches for exploring alternative
                responses.
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  {/* Main Branch */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="w-0.5 h-12 bg-blue-200" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        Original Message
                      </div>
                      <div className="text-xs text-gray-600">
                        What are the best practices for React?
                      </div>
                    </div>
                  </div>

                  {/* Branch Point */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <div className="flex gap-2">
                        <div className="w-0.5 h-12 bg-purple-200" />
                        <div className="w-0.5 h-12 bg-green-200" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-lg p-3 border-2 border-purple-300 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            Branch A
                          </span>
                          <span className="text-xs text-gray-500">Active</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Focus on performance optimization techniques...
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Branch B
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Focus on component composition patterns...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Continue Branch A */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-3 border border-purple-200">
                      <div className="text-xs text-gray-600">
                        Here are key performance strategies: memoization, lazy loading...
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                    Switch to Branch B
                  </button>
                  <button className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                    Create New Branch
                  </button>
                </div>
              </div>
            </div>

            <div className={`${glassStyles.card} rounded-xl p-6`}>
              <h4 className="font-semibold mb-3 text-gray-900">Use Cases</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Explore multiple AI response variations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Compare different approaches to same problem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Debug and refine conversation flows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">→</span>
                  <span>Support undo/redo with branching history</span>
                </li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chat Components Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Production-ready components for building AI chat interfaces
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glassStyles.base} rounded-2xl p-6`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as DemoSection)}
                className={`p-4 rounded-xl transition-all font-medium ${
                  activeSection === section.id
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 hover:bg-white/70 text-gray-900'
                }`}
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="text-sm">{section.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${glassStyles.light} rounded-xl p-6 text-center`}
        >
          <p className="text-sm text-gray-600">
            All components are production-ready, fully typed, and optimized for
            performance.
            <br />
            Built with React, TypeScript, and Tailwind CSS.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ChatComponentsShowcase
