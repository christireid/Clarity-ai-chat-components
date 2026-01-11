/**
 * Vercel AI SDK Compatible Example
 *
 * Demonstrates the useChat, useCompletion, and useAssistant hooks
 * with full Vercel AI SDK API compatibility.
 */

import * as React from 'react'
import {
  useClarityChat,
  ChatWindow,
  MemoryProvider,
  ThemeProvider,
} from '@clarity-chat/react'
import AdvancedExamples from './AdvancedExample'

// Helper to convert messages to display format
function convertToDisplayMessage(msg: { id?: string; role: string; content: unknown }) {
  return {
    id: msg.id || String(Date.now()),
    chatId: 'default',
    role: msg.role === 'user' ? 'user' as const : msg.role === 'assistant' ? 'assistant' as const : 'system' as const,
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    status: 'sent' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function ChatExample() {
  const {
    messages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat',
    transport: 'sse',
  })

  const [input, setInput] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      append({
        role: 'user',
        content: input.trim(),
      })
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatWindow
        messages={messages.map(convertToDisplayMessage)}
        isLoading={isLoading}
        onSendMessage={(content) => {
          append({
            role: 'user',
            content,
          })
        }}
      />
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            Error: {error.message}
          </div>
        )}
      </form>
    </div>
  )
}

function CompletionExample() {
  const [completion, setCompletion] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [prompt, setPrompt] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setCompletion('')

    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error('Failed to fetch completion')

      const data = await response.json()
      setCompletion(data.completion || 'No completion received')
    } catch (err) {
      console.error('Completion error:', err)
      setCompletion('Error fetching completion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Text Completion</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Complete
          </button>
        </div>
      </form>
      <div className="p-4 bg-gray-50 rounded-lg min-h-[200px]">
        {isLoading ? 'Loading...' : completion || 'Completion will appear here...'}
      </div>
    </div>
  )
}

function AssistantExample() {
  const [messages, setMessages] = React.useState<Array<{ id: string; role: string; content: string }>>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'in_progress'>('idle')

  const submitMessage = async (content: string) => {
    const userMessage = { id: Date.now().toString(), role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setStatus('in_progress')

    try {
      // Simulate assistant response
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You asked: "${content}". This is a demo assistant response.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
      setStatus('idle')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      submitMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'idle'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
            }`}
          >
            <div className="text-sm font-semibold mb-1">{msg.role}</div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the assistant..."
          className="flex-1 px-4 py-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}

import PerformanceExample from './PerformanceExample'

function ClarityChatExample() {
  const {
    messages,
    append,
    isLoading,
    error,
    memoryEnabled,
    contextSummary,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
    transport: 'sse',
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-bold mb-2">
          useClarityChat (Flagship Hook)
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Clarity's enhanced chat hook with memory integration and transport
          selection.
        </p>
        {memoryEnabled && (
          <div className="text-xs text-green-700">
            Memory Enabled{' '}
            {contextSummary &&
              `- Context: ${contextSummary.substring(0, 50)}...`}
          </div>
        )}
      </div>
      <ChatWindow
        messages={messages.map(convertToDisplayMessage)}
        isLoading={isLoading}
        onSendMessage={(content) => {
          append({
            role: 'user',
            content,
          })
        }}
        showHeader
        sessionTitle="useClarityChat Example"
        sessionSubtitle="Memory-enabled chat with SSE transport"
      />
      {error && (
        <div className="p-4 bg-red-50 border-t text-red-600 text-sm">
          Error: {error.message}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = React.useState<
    'chat' | 'completion' | 'assistant' | 'clarity' | 'advanced' | 'performance'
  >('chat')

  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold mb-4">
                Vercel AI SDK Compatible Examples
              </h1>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'chat'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('completion')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'completion'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Completion
                </button>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'assistant'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Assistant
                </button>
                <button
                  onClick={() => setActiveTab('clarity')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'clarity'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  useClarityChat
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'advanced'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Advanced
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'performance'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Performance
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-6">
            {activeTab === 'chat' && <ChatExample />}
            {activeTab === 'completion' && <CompletionExample />}
            {activeTab === 'assistant' && <AssistantExample />}
            {activeTab === 'clarity' && <ClarityChatExample />}
            {activeTab === 'advanced' && <AdvancedExamples />}
            {activeTab === 'performance' && <PerformanceExample />}
          </div>
        </div>
      </ThemeProvider>
    </MemoryProvider>
  )
}
