'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Wrench,
  ChevronLeft,
  Search,
  Image,
  Calendar,
  Code,
  Bot,
  User,
  Send,
  ArrowRight,
  Loader2,
  ExternalLink,
  Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { useAutoScroll } from '@clarity-chat/react'

interface Tool {
  id: string
  name: string
  icon: typeof Search
  color: string
  description: string
}

const tools: Tool[] = [
  { id: 'search', name: 'Web Search', icon: Search, color: 'bg-blue-500', description: 'Search the web for information' },
  { id: 'image', name: 'Image Generation', icon: Image, color: 'bg-purple-500', description: 'Generate images from descriptions' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-green-500', description: 'Create and manage calendar events' },
  { id: 'code', name: 'Code Execution', icon: Code, color: 'bg-orange-500', description: 'Execute code in a sandbox' },
]

interface ToolInvocation {
  toolId: string
  status: 'pending' | 'running' | 'complete' | 'error'
  input: string
  output?: any
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  toolInvocation?: ToolInvocation
  timestamp: Date
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

const toolDemos: Record<string, { prompt: string; input: string; output: any; delay: number }> = {
  search: {
    prompt: 'Search for the latest news about AI',
    input: 'query: "latest AI news 2024"',
    output: {
      type: 'search',
      results: [
        { title: 'OpenAI Announces GPT-5', url: 'https://example.com/1', snippet: 'OpenAI has announced the development of GPT-5...' },
        { title: 'Google DeepMind Breakthrough', url: 'https://example.com/2', snippet: 'New research from DeepMind shows promising results...' },
        { title: 'AI in Healthcare 2024', url: 'https://example.com/3', snippet: 'How AI is transforming healthcare this year...' },
      ],
    },
    delay: 1500,
  },
  image: {
    prompt: 'Generate an image of a sunset over mountains',
    input: 'prompt: "A beautiful sunset over snow-capped mountains, digital art"',
    output: {
      type: 'image',
      url: 'https://picsum.photos/400/300',
      description: 'Generated image of sunset over mountains',
    },
    delay: 2000,
  },
  calendar: {
    prompt: 'Create a meeting for tomorrow at 3pm',
    input: 'event: { title: "Team Meeting", date: "tomorrow", time: "3:00 PM" }',
    output: {
      type: 'calendar',
      event: {
        id: 'evt_123',
        title: 'Team Meeting',
        date: 'Tomorrow',
        time: '3:00 PM',
        status: 'created',
      },
    },
    delay: 1000,
  },
  code: {
    prompt: 'Calculate fibonacci sequence up to 10',
    input: 'code: `function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }`',
    output: {
      type: 'code',
      language: 'javascript',
      result: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
      executionTime: '12ms',
    },
    delay: 800,
  },
}

export default function ToolCallingDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "I'm an AI agent with access to tools! Try selecting a tool below and watch how I execute it with custom UI rendering.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const isMountedRef = useRef(true)

  // Cleanup on unmount to prevent state updates after unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const { scrollRef, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  const executeTool = async (toolId: string) => {
    if (isExecuting) return
    setIsExecuting(true)
    setSelectedTool(toolId)

    const demo = toolDemos[toolId]
    const tool = tools.find(t => t.id === toolId)
    if (!tool) {
      setIsExecuting(false)
      return
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: demo.prompt,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    scrollToBottom()

    // Add bot message with tool invocation starting
    await new Promise(r => setTimeout(r, 500))
    if (!isMountedRef.current) {
      setIsExecuting(false)
      return
    }
    const botMessageId = generateId()
    const botMessage: Message = {
      id: botMessageId,
      text: `I'll use the ${tool.name} tool to help with that.`,
      sender: 'bot',
      toolInvocation: {
        toolId,
        status: 'pending',
        input: demo.input,
      },
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botMessage])
    scrollToBottom()

    // Update to running
    await new Promise(r => setTimeout(r, 300))
    if (!isMountedRef.current) {
      setIsExecuting(false)
      return
    }
    setMessages(prev => prev.map(msg =>
      msg.id === botMessageId && msg.toolInvocation
        ? { ...msg, toolInvocation: { ...msg.toolInvocation, status: 'running' } }
        : msg
    ))

    // Wait for "execution"
    await new Promise(r => setTimeout(r, demo.delay))
    if (!isMountedRef.current) {
      setIsExecuting(false)
      return
    }

    // Update to complete
    setMessages(prev => prev.map(msg =>
      msg.id === botMessageId && msg.toolInvocation
        ? { ...msg, toolInvocation: { ...msg.toolInvocation, status: 'complete', output: demo.output } }
        : msg
    ))

    setIsExecuting(false)
  }

  const renderToolOutput = (invocation: ToolInvocation) => {
    if (invocation.status === 'pending') {
      return (
        <div className="flex items-center gap-2 text-text-secondary">
          <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Preparing tool...</span>
        </div>
      )
    }

    if (invocation.status === 'running') {
      return (
        <div className="flex items-center gap-2 text-text-secondary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Executing {tools.find(t => t.id === invocation.toolId)?.name}...</span>
        </div>
      )
    }

    if (invocation.status === 'complete' && invocation.output) {
      const output = invocation.output

      // Search results
      if (output.type === 'search') {
        return (
          <div className="space-y-3 mt-3">
            <div className="text-sm font-medium text-text-secondary">Search Results:</div>
            {output.results.map((result: any, idx: number) => (
              <motion.a
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-bg-primary border border-border hover:border-brand-500 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm text-brand-600 dark:text-brand-400">{result.title}</div>
                    <div className="text-xs text-text-secondary mt-1">{result.snippet}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )
      }

      // Image generation
      if (output.type === 'image') {
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3"
          >
            <div className="rounded-lg overflow-hidden border border-border">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                  <span className="text-sm text-purple-700 dark:text-purple-300">{output.description}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )
      }

      // Calendar event
      if (output.type === 'calendar') {
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-green-700 dark:text-green-300">Event Created</div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {output.event.title} - {output.event.date} at {output.event.time}
                </div>
              </div>
            </div>
          </motion.div>
        )
      }

      // Code execution
      if (output.type === 'code') {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3"
          >
            <div className="rounded-lg overflow-hidden border border-border">
              <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono">{output.language}</span>
                <span className="text-xs text-green-400">✓ Executed in {output.executionTime}</span>
              </div>
              <div className="p-4 bg-gray-900">
                <pre className="text-sm font-mono text-green-400">{output.result}</pre>
              </div>
            </div>
          </motion.div>
        )
      }
    }

    return null
  }

  return (
    <div className="container-docs py-12">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              Agent Capabilities
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tool Calling /{' '}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Agent Demo
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Watch AI agents execute tools with custom UI rendering. Search the web,
              generate images, create events, and run code.
            </p>
          </div>
        </ScrollReveal>

        {/* Tool Selector */}
        <ScrollReveal delay={0.1}>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-center">Select a Tool to Demo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tools.map((tool) => {
                const Icon = tool.icon
                const isSelected = selectedTool === tool.id

                return (
                  <button
                    key={tool.id}
                    onClick={() => executeTool(tool.id)}
                    disabled={isExecuting}
                    className={`p-4 rounded-xl border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                        : 'border-border hover:border-brand-300 bg-bg-secondary'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-text-secondary mt-1">{tool.description}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Chat Demo */}
        <ScrollReveal delay={0.2}>
          <div className="rounded-2xl border-2 border-border shadow-xl overflow-hidden bg-bg-primary">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">AI Agent with Tools</div>
                  <div className="text-xs opacity-90">
                    {tools.length} tools available
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef as React.RefObject<HTMLDivElement>}
              className="h-[450px] overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'bot'
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'
                      : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                  }`}>
                    {message.sender === 'bot' ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${message.sender === 'user' ? '' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'bot'
                        ? 'bg-bg-secondary text-text-primary rounded-tl-sm'
                        : 'bg-brand-500 text-white rounded-tr-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>

                      {/* Tool Invocation UI */}
                      {message.toolInvocation && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              tools.find(t => t.id === message.toolInvocation!.toolId)?.color
                            }`}>
                              {(() => {
                                const Icon = tools.find(t => t.id === message.toolInvocation!.toolId)?.icon || Wrench
                                return <Icon className="w-3 h-3 text-white" />
                              })()}
                            </div>
                            <span className="font-mono">{message.toolInvocation.input}</span>
                          </div>
                          {renderToolOutput(message.toolInvocation)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tool Registry Info */}
            <div className="border-t border-border p-4 bg-bg-secondary">
              <div className="text-sm text-text-secondary text-center">
                💡 Each tool has a custom <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">ToolUIRegistry</code> component for rendering its output
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/guides/agents"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Agents Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
