'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Code2,
  Terminal,
  FileCode,
  Sparkles,
  AlertCircle,
  Send,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  status: 'sending' | 'sent' | 'error'
}

const quickPrompts = [
  { icon: '🐛', label: 'Debug Code', prompt: 'Help me debug this code:' },
  {
    icon: '✨',
    label: 'Improve Code',
    prompt: 'Suggest improvements for this code:',
  },
  { icon: '📝', label: 'Explain Code', prompt: 'Explain what this code does:' },
  {
    icon: '🔄',
    label: 'Convert Code',
    prompt: 'Convert this code to TypeScript:',
  },
  {
    icon: '🧪',
    label: 'Write Tests',
    prompt: 'Write unit tests for this function:',
  },
  {
    icon: '📖',
    label: 'Add Docs',
    prompt: 'Add documentation comments to this code:',
  },
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  )
}

export default function CodeAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# Welcome to AI Code Assistant! 👋

I'm your expert coding companion. I can help you with:

- **🐛 Debugging** - Find and fix errors in your code
- **✨ Code Review** - Get suggestions for improvements
- **📝 Explanations** - Understand complex code patterns
- **🔄 Conversions** - Transform code between languages
- **🧪 Testing** - Write unit tests and test cases
- **📖 Documentation** - Add comments and docs

**Try pasting some code and asking me about it!**`,
      status: 'sent',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      setError(null)
      setInput('')

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        status: 'sent',
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setIsStreaming(true)
      setTimeout(scrollToBottom, 100)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        status: 'sending',
      }

      setMessages((prev) => [...prev, assistantMessage])

      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to get response')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No reader available')

        let accumulatedContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            status: 'sending' as const,
                          }
                        : msg
                    )
                  )
                  scrollToBottom()
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, status: 'sent' as const }
              : msg
          )
        )
      } catch (err: unknown) {
        const error = err as Error
        if (error.name === 'AbortError') {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== assistantMessage.id)
          )
        } else {
          setError(error.message || 'Something went wrong')
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: 'Sorry, I encountered an error. Please try again.',
                    status: 'error' as const,
                  }
                : msg
            )
          )
        }
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [messages, scrollToBottom]
  )

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setIsLoading(false)
    }
  }, [])

  const handleQuickPrompt = useCallback((prompt: string) => {
    setInput(prompt + '\n\n')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  AI Code Assistant
                </h1>
                <p className="text-sm text-slate-400">Powered by GPT-4</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/"
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Docs
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Quick Actions */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Quick Actions
              </h2>
              <div className="space-y-2">
                {quickPrompts.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleQuickPrompt(item.prompt)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                Supported Languages
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'TypeScript',
                  'JavaScript',
                  'Python',
                  'Rust',
                  'Go',
                  'Java',
                  'C++',
                  'SQL',
                ].map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                Tips
              </h2>
              <ul className="text-xs text-slate-400 space-y-2">
                <li>• Paste code directly for analysis</li>
                <li>• Be specific about what you need</li>
                <li>• Ask follow-up questions</li>
                <li>• Request explanations for any part</li>
              </ul>
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className="lg:col-span-3">
            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Streaming Indicator */}
            {isStreaming && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TypingIndicator />
                  <span className="text-sm text-blue-400">
                    Generating code...
                  </span>
                </div>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Chat Window */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="h-[calc(100vh-380px)] min-h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-700/50 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage(input)
                  }}
                  className="flex gap-3"
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(input)
                      }
                    }}
                    placeholder="Ask about your code..."
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/80 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>AI Code Assistant • Clarity Chat Components</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
