/**
 * PromptComposer Examples
 *
 * Comprehensive examples showing all features and use cases.
 */

'use client'

import * as React from 'react'
import { PromptComposer } from './PromptComposer'
import { createContextItem } from '../../hooks/prompt-composer/context-utils'
import type {
  ContextItem,
  ContextProvider,
  Suggestion,
  PromptMessage,
  Command,
} from '../../hooks/prompt-composer/types'

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export function BasicExample() {
  const handleSubmit = async (message: PromptMessage) => {
    console.log('Submitting message:', message)
    // Send to API
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Basic PromptComposer</h2>
      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        placeholder="Ask anything..."
        showTokenBudget
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// ============================================================================
// Example 2: With Context Providers
// ============================================================================

// Mock file provider
const fileProvider: ContextProvider = {
  type: 'file',
  search: async (query) => {
    // Simulate file search
    const mockFiles = [
      { name: 'Button.tsx', path: 'src/components/Button.tsx', lines: 250 },
      { name: 'Input.tsx', path: 'src/components/Input.tsx', lines: 180 },
      { name: 'utils.ts', path: 'src/utils/utils.ts', lines: 120 },
    ]

    return mockFiles
      .filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      )
      .map((file) =>
        createContextItem({
          id: file.path,
          type: 'file',
          label: file.name,
          description: file.path,
          summary: `${file.name} - ${file.lines} lines, exports 3 components`,
          preview: `File: ${file.path}\nLines: ${file.lines}\n\nExports:\n- Button\n- ButtonProps\n- ButtonVariant`,
          full: `// Full file content would go here\n// This is a ${file.lines} line file\n// Located at ${file.path}`,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
            </svg>
          ),
        })
      )
  },
  priority: 80,
}

// Mock documentation provider
const docProvider: ContextProvider = {
  type: 'doc',
  search: async (query) => {
    const mockDocs = [
      {
        title: 'API Reference: Authentication',
        path: '/docs/api/auth',
        content: 'Complete authentication API documentation',
      },
      {
        title: 'Getting Started Guide',
        path: '/docs/getting-started',
        content: 'Quick start guide for new users',
      },
    ]

    return mockDocs
      .filter((doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase())
      )
      .map((doc) =>
        createContextItem({
          id: doc.path,
          type: 'doc',
          label: doc.title,
          description: doc.path,
          summary: `${doc.title} - ${doc.content}`,
          preview: `# ${doc.title}\n\nPath: ${doc.path}\n\n## Overview\n${doc.content}`,
          full: `# ${doc.title}\n\n${doc.content}\n\n## Full Documentation\n[More detailed content would go here]`,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                clipRule="evenodd"
              />
            </svg>
          ),
        })
      )
  },
  priority: 60,
}

// Mock user provider
const userProvider: ContextProvider = {
  type: 'user',
  search: async (query) => {
    const mockUsers = [
      {
        id: 'user-1',
        name: 'Sarah Chen',
        username: 'sarah',
        role: 'Senior Engineer',
        expertise: 'React, TypeScript',
      },
      {
        id: 'user-2',
        name: 'John Smith',
        username: 'john',
        role: 'Tech Lead',
        expertise: 'Architecture, Performance',
      },
      {
        id: 'user-3',
        name: 'Maria Garcia',
        username: 'maria',
        role: 'Designer',
        expertise: 'UI/UX, Accessibility',
      },
    ]

    return mockUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
      )
      .map((user) =>
        createContextItem({
          id: user.id,
          type: 'user',
          label: user.username,
          description: `${user.name} • ${user.role}`,
          summary: `@${user.username} (${user.name}) - ${user.role}`,
          preview: `${user.name}\nRole: ${user.role}\nExpertise: ${user.expertise}`,
          full: `${user.name}\n\nRole: ${user.role}\nExpertise: ${user.expertise}\n\nRecent Activity:\n- Fixed authentication bug\n- Reviewed 15 PRs this week`,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          ),
        })
      )
  },
  priority: 40,
}

export function WithContextProviders() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">With Context Providers</h2>
        <p className="text-gray-600">
          Type <code className="px-1 py-0.5 bg-gray-100 rounded">@</code> to
          trigger context mentions
        </p>
      </div>

      {/* Usage Guide */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
        <h3 className="font-semibold text-sm">How @mentions work:</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              @
            </code>{' '}
            → Shows context types: file, doc, user
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              @file:
            </code>{' '}
            → Search files (Button.tsx, Input.tsx)
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              @doc:
            </code>{' '}
            → Search documentation
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              @user:
            </code>{' '}
            → Mention team members
          </li>
          <li className="text-xs text-gray-500 mt-2">
            Use ↑↓ arrows to navigate, Enter to select, Escape to close
          </li>
        </ul>
      </div>

      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        features={{
          context: {
            triggers: ['@'],
            providers: [fileProvider, docProvider, userProvider],
            fuzzySearch: true,
          },
        }}
        placeholder="Try typing @file:Button or @user:sarah..."
        showTokenBudget
        showTokenSavings
        onSubmit={(message) => {
          console.log('Message:', message)
          console.log('Context items:', message.contextItems)
        }}
      />
    </div>
  )
}

// ============================================================================
// Example 3: With Command Palette
// ============================================================================

// Mock commands
const mockCommands: Command[] = [
  {
    id: 'search',
    trigger: '/search',
    label: 'Search Codebase',
    description: 'Search for files, functions, and code',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    category: 'navigation',
    execute: async () => {
      console.log('Executing search command')
    },
    shortcut: '⌘K',
  },
  {
    id: 'code',
    trigger: '/code',
    label: 'Generate Code',
    description: 'Generate code from natural language',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
          clipRule="evenodd"
        />
      </svg>
    ),
    category: 'generation',
    execute: async () => {
      console.log('Executing code generation command')
    },
  },
  {
    id: 'explain',
    trigger: '/explain',
    label: 'Explain Code',
    description: 'Get detailed explanation of selected code',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    category: 'generation',
    execute: async () => {
      console.log('Executing explain command')
    },
  },
  {
    id: 'test',
    trigger: '/test',
    label: 'Generate Tests',
    description: 'Generate unit tests for your code',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    category: 'generation',
    execute: async () => {
      console.log('Executing test generation command')
    },
  },
  {
    id: 'refactor',
    trigger: '/refactor',
    label: 'Refactor Code',
    description: 'Improve code quality and structure',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
      </svg>
    ),
    category: 'optimization',
    execute: async () => {
      console.log('Executing refactor command')
    },
  },
]

export function WithCommands() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">With Command Palette</h2>
        <p className="text-gray-600">
          Type <code className="px-1 py-0.5 bg-gray-100 rounded">/</code> to
          trigger command palette
        </p>
      </div>

      {/* Usage Guide */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-2">
        <h3 className="font-semibold text-sm">How /commands work:</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              /
            </code>{' '}
            → Shows all available commands
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              /search
            </code>{' '}
            → Search codebase
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              /code
            </code>{' '}
            → Generate code
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              /explain
            </code>{' '}
            → Explain code
          </li>
          <li>
            <code className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">
              /test
            </code>{' '}
            → Generate tests
          </li>
          <li className="text-xs text-gray-500 mt-2">
            Use ↑↓ arrows to navigate, Enter to execute, Escape to close
          </li>
        </ul>
      </div>

      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        placeholder="Try typing /search or /code..."
        showTokenBudget
        commands={mockCommands}
        onCommandExecute={(command) => {
          console.log('Command executed:', command)
        }}
        onSubmit={(message) => console.log('Message:', message)}
      />
    </div>
  )
}

// ============================================================================
// Example 4: With Suggestions
// ============================================================================

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'starter',
    text: 'Explain this code',
    icon: '📖',
  },
  {
    id: '2',
    type: 'starter',
    text: 'Write tests for...',
    icon: '🧪',
  },
  {
    id: '3',
    type: 'starter',
    text: 'Debug issue',
    icon: '🐛',
  },
  {
    id: '4',
    type: 'starter',
    text: 'Refactor to improve performance',
    icon: '🔧',
  },
]

export function WithSuggestions() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">With Smart Suggestions</h2>
      <p className="text-gray-600 mb-4">
        Click or focus the input to see suggestion chips
      </p>
      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        suggestions={mockSuggestions}
        onSuggestionClick={(suggestion) =>
          console.log('Suggestion clicked:', suggestion)
        }
        showTokenBudget
        onSubmit={(message) => console.log('Message:', message)}
      />
    </div>
  )
}

// ============================================================================
// Example 4: Full Featured
// ============================================================================

export function FullFeatured() {
  const [conversationHistory, setConversationHistory] = React.useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])

  const handleSubmit = async (message: PromptMessage) => {
    // Add user message to history
    setConversationHistory((prev) => [
      ...prev,
      { role: 'user', content: message.content },
    ])

    // Simulate API response
    setTimeout(() => {
      setConversationHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I received your message with ${message.contextItems.length} context items and ${message.metadata?.totalTokens} tokens.`,
        },
      ])
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Full Featured Example</h2>

      {/* Conversation History */}
      <div className="mb-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
        {conversationHistory.length === 0 ? (
          <p className="text-gray-500 text-center">
            Start a conversation...
          </p>
        ) : (
          conversationHistory.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-lg',
                msg.role === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900 ml-12'
                  : 'bg-white dark:bg-gray-800 mr-12'
              )}
            >
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PromptComposer */}
      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        placeholder="Ask anything with context and attachments..."
        features={{
          context: {
            triggers: ['@'],
            providers: [fileProvider, docProvider],
          },
          suggestions: true,
          attachments: {
            maxFiles: 5,
            maxSize: 10 * 1024 * 1024, // 10MB
          },
        }}
        suggestions={mockSuggestions}
        showTokenBudget
        showTokenSavings
        showContextBreakdown
        onSubmit={handleSubmit}
      />

      {/* Stats */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {conversationHistory.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Messages
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              90%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Token Savings
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              $0.02
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cost per Conv.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: With Voice Input
// ============================================================================

export function WithVoiceInput() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">With Voice Input</h2>
        <p className="text-gray-600">
          Click the microphone button to dictate your message
        </p>
      </div>

      {/* Usage Guide */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-2">
        <h3 className="font-semibold text-sm">How Voice Input works:</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>🎤 Click microphone button to start recording</li>
          <li>🗣️ Speak your message clearly</li>
          <li>📝 Real-time transcription appears as you speak</li>
          <li>✅ Auto-submits when you stop speaking (or manually stop)</li>
          <li>🌍 Multi-language support (English default)</li>
          <li className="text-xs text-gray-500 mt-2">
            Note: Requires browser support for Web Speech API (Chrome, Edge, Safari)
          </li>
        </ul>
      </div>

      <PromptComposer
        api="/api/chat"
        tokenBudget={8000}
        features={{
          voice: {
            lang: 'en-US', // Or 'es-ES', 'fr-FR', etc.
          },
        }}
        placeholder="Type or click microphone to speak..."
        showTokenBudget
        onSubmit={(message) => {
          console.log('Voice message:', message)
        }}
      />

      {/* Demo Stats */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Voice Input Benefits</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              3x
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Faster Input
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Hands-Free
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accessibility
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              95%+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Accuracy
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              30+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Languages
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// All Examples
// ============================================================================

export function PromptComposerExamples() {
  const [activeExample, setActiveExample] = React.useState<
    'basic' | 'context' | 'suggestions' | 'voice' | 'full'
  >('basic')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            PromptComposer Examples
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Progressive disclosure prompt system with 90% token savings
          </p>
        </div>

        {/* Example Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'basic', label: 'Basic' },
            { id: 'context', label: 'With Context' },
            { id: 'suggestions', label: 'With Suggestions' },
            { id: 'voice', label: 'With Voice' },
            { id: 'full', label: 'Full Featured' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveExample(tab.id as typeof activeExample)
              }
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeExample === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Example */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
          {activeExample === 'basic' && <BasicExample />}
          {activeExample === 'context' && <WithContextProviders />}
          {activeExample === 'suggestions' && <WithSuggestions />}
          {activeExample === 'voice' && <WithVoiceInput />}
          {activeExample === 'full' && <FullFeatured />}
        </div>
      </div>
    </div>
  )
}

// Helper for cn function if not imported
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
