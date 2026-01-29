import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Components Reference | Clarity Chat',
  description: 'Complete API reference for all Clarity Chat components',
}

export default function ComponentsIndexPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-4xl">
      <h1>Components API Reference</h1>
      
      <p className="lead">
        Complete API documentation for all Clarity Chat components, organized by architecture layer.
      </p>

      <div className="not-prose my-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📘</span>
          <div>
            <h3 className="text-lg font-semibold mb-2">Complete Reference Available</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              A comprehensive API reference document has been created with all 8 core components:
            </p>
            <code className="block bg-white dark:bg-slate-800 px-3 py-2 rounded text-sm">
              COMPONENT_API_REFERENCE.md
            </code>
          </div>
        </div>
      </div>

      <h2>Core Components (Priority)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-8">
        <Link href="/reference/components/clarity-chat" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">ClarityChat</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Drop-in chat component with streaming, memory, and error handling</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Top-Level</span>
        </Link>

        <Link href="/reference/components/clarity-chat-app" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">ClarityChatApp</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">App wrapper with theming, providers, and global state</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Top-Level</span>
        </Link>

        <Link href="/reference/components/chat-window" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">ChatWindow</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Main chat container with message list, input, and header</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">Mid-Level</span>
        </Link>

        <Link href="/reference/components/chat-input" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">ChatInput</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Message input with character counting and validation</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">Mid-Level</span>
        </Link>

        <Link href="/reference/components/message-list" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">MessageList</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Message display with auto-scrolling and grouping</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">Mid-Level</span>
        </Link>

        <Link href="/reference/components/message" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">Message</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Individual message with markdown and actions</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Low-Level</span>
        </Link>

        <Link href="/reference/components/streaming-message" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">StreamingMessage</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Streaming display with tool calls and citations</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">Specialized</span>
        </Link>

        <Link href="/reference/components/typing-indicator" className="block p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <h3 className="text-lg font-semibold mb-1">TypingIndicator</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading state with animated dots</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">UI Component</span>
        </Link>
      </div>

      <h2>Architecture Layers</h2>
      
      <div className="space-y-4 mb-8">
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <h3 className="text-lg font-semibold">Top-Level (Drop-in Ready)</h3>
          <p className="text-sm">
            Complete, batteries-included components for immediate use. Just provide an API endpoint.
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• ClarityChat - Single component for entire chat UI</li>
            <li>• ClarityChatApp - App-level wrapper with providers</li>
          </ul>
        </div>

        <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
          <h3 className="text-lg font-semibold">Mid-Level (Composable)</h3>
          <p className="text-sm">
            Building blocks you compose together for custom UIs. More control, requires state management.
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• ChatWindow - Container with header, messages, and input</li>
            <li>• ChatInput - Standalone input component</li>
            <li>• MessageList - Standalone message list</li>
          </ul>
        </div>

        <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
          <h3 className="text-lg font-semibold">Low-Level (Building Blocks)</h3>
          <p className="text-sm">
            Primitive components for maximum customization. Full control over rendering.
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Message - Individual message renderer</li>
            <li>• StreamingMessage - Specialized streaming renderer</li>
            <li>• TypingIndicator - Loading state indicator</li>
          </ul>
        </div>
      </div>

      <h2>Quick Start Guide</h2>
      
      <h3>Choose Your Level</h3>
      
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
        <h4>1. Just want chat working? → Use ClarityChat</h4>
        <pre className="bg-white dark:bg-slate-800 p-4 rounded mt-2"><code>{`import { ClarityChat } from '@clarity-chat/react'

<ClarityChat api="/api/chat" />`}</code></pre>

        <h4 className="mt-6">2. Need custom UI? → Use ChatWindow + hook</h4>
        <pre className="bg-white dark:bg-slate-800 p-4 rounded mt-2"><code>{`import { ChatWindow, useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat'
})

<ChatWindow messages={messages} onSendMessage={append} />`}</code></pre>

        <h4 className="mt-6">3. Full control? → Compose primitives</h4>
        <pre className="bg-white dark:bg-slate-800 p-4 rounded mt-2"><code>{`import { Message, ChatInput, MessageList } from '@clarity-chat/react'

// Build your own custom chat UI`}</code></pre>
      </div>

      <h2>Related Documentation</h2>
      
      <ul>
        <li><Link href="/reference/hooks">Hooks Reference</Link> - React hooks for chat functionality</li>
        <li><Link href="/guides">Guides</Link> - Step-by-step implementation guides</li>
        <li><Link href="/examples">Examples</Link> - Complete example applications</li>
      </ul>

      <div className="not-prose mt-8 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm m-0">
          💡 <strong>Tip:</strong> Each component page includes installation, usage examples, complete props documentation, accessibility features, and troubleshooting guides.
        </p>
      </div>
    </div>
  )
}
