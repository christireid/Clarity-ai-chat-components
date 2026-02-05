'use client'

import { useState } from 'react'
import { LiveCodeEditor } from './LiveCodeEditor'
import { Code2, FileCode, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const exampleTemplates = [
  {
    id: 'hello-world',
    name: 'Hello World',
    code: `// Simple Hello World
console.log('Hello, World!')

const message = 'Welcome to the Live Code Editor!'
console.log(message)

return 'Code executed successfully!'`,
  },
  {
    id: 'react-component',
    name: 'React Component',
    code: `// React Component Example
const MyComponent = () => {
  const [count, setCount] = useState(0)

  console.log('Component rendered with count:', count)

  return {
    count,
    increment: () => setCount(count + 1)
  }
}

const component = MyComponent()
console.log('Initial state:', component)

return component`,
  },
  {
    id: 'async-fetch',
    name: 'Async/Await',
    code: `// Async/Await Example
async function fetchData() {
  console.log('Fetching data...')

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  const data = {
    users: 42,
    posts: 127,
    comments: 856
  }

  console.log('Data fetched:', data)
  return data
}

return await fetchData()`,
  },
  {
    id: 'array-operations',
    name: 'Array Operations',
    code: `// Array Operations
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log('Original array:', numbers)

const doubled = numbers.map(n => n * 2)
console.log('Doubled:', doubled)

const evens = numbers.filter(n => n % 2 === 0)
console.log('Even numbers:', evens)

const sum = numbers.reduce((acc, n) => acc + n, 0)
console.log('Sum:', sum)

return {
  original: numbers,
  doubled,
  evens,
  sum
}`,
  },
  {
    id: 'error-handling',
    name: 'Error Handling',
    code: `// Error Handling Example
try {
  console.log('Starting operation...')

  const riskyOperation = () => {
    const random = Math.random()
    console.log('Random value:', random)

    if (random < 0.5) {
      throw new Error('Random number too low!')
    }

    return 'Success!'
  }

  const result = riskyOperation()
  console.log('Result:', result)

  return result
} catch (error) {
  console.error('Caught error:', error.message)
  return 'Error handled gracefully'
}`,
  },
  {
    id: 'clarity-chat',
    name: 'Clarity Chat Demo',
    code: `// Clarity Chat Components Demo
const messages = [
  { id: 1, role: 'user', content: 'Hello!' },
  { id: 2, role: 'assistant', content: 'Hi! How can I help?' }
]

console.log('Chat messages:', messages)

const addMessage = (content, role = 'user') => {
  const newMessage = {
    id: messages.length + 1,
    role,
    content,
    timestamp: new Date().toISOString()
  }
  messages.push(newMessage)
  return newMessage
}

const newMsg = addMessage('Tell me about Clarity Chat')
console.log('Added message:', newMsg)

return {
  totalMessages: messages.length,
  messages
}`,
  },
]

const initialCode = `// Welcome to the Live Code Editor!
//
// Features:
// - Full TypeScript support with IntelliSense
// - Auto-completion (Ctrl+Space)
// - Run code with ⌘+Enter
// - Format code with Shift+⌘+F
// - Save code with ⌘+S
// - Console output and error handling
//
// Try running this example:

console.log('🚀 Starting demo...')

async function demo() {
  const data = {
    name: 'Clarity Chat',
    version: '2.0',
    features: ['Monaco Editor', 'TypeScript', 'Live Preview']
  }

  console.log('Data:', data)

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log('✅ Demo complete!')

  return data
}

return await demo()
`

export function CodeEditorDemo() {
  const [activeTab, setActiveTab] = useState<'editor' | 'features' | 'shortcuts'>('editor')

  const features = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: 'Monaco Editor',
      description: 'Same editor that powers VS Code with full IntelliSense',
    },
    {
      icon: <FileCode className="w-5 h-5" />,
      title: 'TypeScript Support',
      description: 'Full TypeScript with type checking and auto-completion',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Hot Reload',
      description: 'Instant preview with runtime error handling',
    },
  ]

  const shortcuts = [
    { keys: '⌘ + Enter', description: 'Run code' },
    { keys: '⌘ + S', description: 'Save code' },
    { keys: 'Shift + ⌘ + F', description: 'Format code' },
    { keys: 'Ctrl + Space', description: 'Trigger auto-completion' },
    { keys: '⌘ + /', description: 'Toggle comment' },
    { keys: '⌘ + D', description: 'Add cursor to next match' },
    { keys: 'Alt + ↑/↓', description: 'Move line up/down' },
    { keys: 'Shift + Alt + ↑/↓', description: 'Copy line up/down' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-4">
          <Code2 className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Live Code Editor
          </span>
        </div>

        <h2 className="text-3xl font-bold mb-2">Write, Run, and Preview Code</h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Full-featured Monaco editor with TypeScript support, auto-completion, and live execution.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'editor'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Live Editor
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'features'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Features
        </button>
        <button
          onClick={() => setActiveTab('shortcuts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'shortcuts'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Keyboard Shortcuts
        </button>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'editor' && (
          <LiveCodeEditor
            initialCode={initialCode}
            language="typescript"
            height="600px"
            showPreview={true}
            exampleTemplates={exampleTemplates}
          />
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand-50 dark:bg-brand-950/50 rounded-lg text-brand-500">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 p-6 bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 rounded-xl border border-brand-200 dark:border-brand-800/50"
            >
              <h3 className="font-semibold mb-3">Additional Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  Error highlighting with diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  Format on save and paste
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  Multiple file tab support (coming soon)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  Code execution sandbox
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  Console output with timestamps
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                  Export and save functionality
                </li>
              </ul>
            </motion.div>
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <motion.div
                key={shortcut.keys}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
              >
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-300 dark:border-neutral-700 text-xs font-mono">
                  {shortcut.keys}
                </kbd>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
