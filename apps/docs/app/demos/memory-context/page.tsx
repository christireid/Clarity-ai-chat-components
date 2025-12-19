'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Brain as BrainCircuit,
  ChevronLeft,
  User,
  Bot,
  Send,
  Clock,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { durations } from '@/lib/animations'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { useAutoScroll } from '@clarity-chat/react/internal'
import { generateId, sleep } from '@/lib/demos/utils'
import { useMountedRef } from '@/lib/demos/hooks'
import { trackDemoViewed, trackMessageSent } from '@/lib/demos/analytics'

interface MemoryItem {
  id: string
  type: 'fact' | 'preference' | 'context' | 'document'
  content: string
  source: string
  timestamp: Date
  importance: 'high' | 'medium' | 'low'
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  memoryUsed?: string[]
}

const initialMemory: MemoryItem[] = [
  {
    id: '1',
    type: 'fact',
    content: 'User name is Alex',
    source: 'Previous session',
    timestamp: new Date(Date.now() - 86400000),
    importance: 'high',
  },
  {
    id: '2',
    type: 'preference',
    content: 'Prefers TypeScript over JavaScript',
    source: 'Conversation #42',
    timestamp: new Date(Date.now() - 43200000),
    importance: 'medium',
  },
  {
    id: '3',
    type: 'document',
    content: 'Project: E-commerce app with React',
    source: 'Uploaded README.md',
    timestamp: new Date(Date.now() - 21600000),
    importance: 'high',
  },
]

export default function MemoryContextDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome back, Alex! I remember you're working on that e-commerce app with React and TypeScript. How's the project going?",
      sender: 'bot',
      timestamp: new Date(),
      memoryUsed: ['1', '2', '3'],
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [memory, setMemory] = useState<MemoryItem[]>(initialMemory)
  const [showMemoryPanel, setShowMemoryPanel] = useState(true)
  const [activeMemoryIds, setActiveMemoryIds] = useState<string[]>([
    '1',
    '2',
    '3',
  ])
  const isMountedRef = useMountedRef()

  useEffect(() => {
    trackDemoViewed('memory-context')
  }, [])

  const { scrollRef, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  const getMemoryResponse = (
    input: string
  ): { text: string; memoryIds: string[]; newMemory?: MemoryItem } => {
    const lower = input.toLowerCase()

    if (
      lower.includes('color') ||
      lower.includes('theme') ||
      lower.includes('dark')
    ) {
      const newMem: MemoryItem = {
        id: generateId(),
        type: 'preference',
        content: 'Prefers dark mode themes',
        source: 'Current conversation',
        timestamp: new Date(),
        importance: 'medium',
      }
      return {
        text: "I've noted that you prefer dark mode! I'll remember this for future suggestions. It works great with your TypeScript project - dark themes are easier on the eyes during long coding sessions.",
        memoryIds: ['2'],
        newMemory: newMem,
      }
    }

    if (
      lower.includes('name') ||
      lower.includes('call me') ||
      lower.includes("i'm ")
    ) {
      const nameMatch = input.match(/(?:call me|i'm |my name is )\s*(\w+)/i)
      if (nameMatch) {
        const newName = nameMatch[1]
        setMemory((prev) =>
          prev.map((m) =>
            m.id === '1'
              ? {
                  ...m,
                  content: `User name is ${newName}`,
                  timestamp: new Date(),
                }
              : m
          )
        )
        return {
          text: `Got it, ${newName}! I've updated my memory. I'll remember your name across all our future conversations.`,
          memoryIds: ['1'],
        }
      }
    }

    if (
      lower.includes('project') ||
      lower.includes('app') ||
      lower.includes('working on')
    ) {
      return {
        text: "Based on the README you uploaded, I see you're building an e-commerce app with React and TypeScript. The product catalog feature we discussed would integrate well with your existing component structure. Should I help with that?",
        memoryIds: ['2', '3'],
      }
    }

    if (lower.includes('remember') || lower.includes('know about me')) {
      return {
        text: `Here's what I remember about you, Alex:\n\n• You prefer TypeScript over JavaScript\n• You're working on an e-commerce app with React\n• All from our previous conversations!\n\nThis context helps me give you more relevant suggestions.`,
        memoryIds: ['1', '2', '3'],
      }
    }

    return {
      text: "I'm keeping track of our conversation context. Anything I should remember for next time? You can tell me preferences, facts about your project, or upload documents for me to reference.",
      memoryIds: [],
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    trackMessageSent('memory-context')

    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    const userInput = input
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    scrollToBottom()

    await sleep(1000)
    if (!isMountedRef.current) return

    const { text, memoryIds, newMemory } = getMemoryResponse(userInput)

    if (newMemory) {
      setMemory((prev) => [...prev, newMemory])
    }

    setActiveMemoryIds(memoryIds)

    const botMessage: Message = {
      id: generateId(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      memoryUsed: memoryIds,
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)

    // Clear active memory highlight after a delay
    setTimeout(() => setActiveMemoryIds([]), 2000)
  }

  const resetDemo = () => {
    setMessages([
      {
        id: '1',
        text: "Welcome back, Alex! I remember you're working on that e-commerce app with React and TypeScript. How's the project going?",
        sender: 'bot',
        timestamp: new Date(),
        memoryUsed: ['1', '2', '3'],
      },
    ])
    setMemory(initialMemory)
    setActiveMemoryIds(['1', '2', '3'])
  }

  const memoryTypeIcon = {
    fact: User,
    preference: Sparkles,
    context: MessageSquare,
    document: FileText,
  }

  const memoryTypeColor = {
    fact: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    preference:
      'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    context:
      'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    document:
      'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium mb-6">
              <BrainCircuit className="w-4 h-4" />
              Long-Term Memory
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Memory &{' '}
              <span className="bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent">
                Context
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              See how the AI remembers your name, preferences, and context
              across sessions. The memory panel shows what's being retained and
              used.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Panel */}
          <ScrollReveal delay={0.1}>
            <div className="lg:col-span-2 rounded-2xl border-2 border-border shadow-xl overflow-hidden bg-bg-primary">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Memory-Enhanced Chat</div>
                    <div className="text-xs opacity-90">
                      {memory.length} items in memory
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMemoryPanel(!showMemoryPanel)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title={
                      showMemoryPanel
                        ? 'Hide memory panel'
                        : 'Show memory panel'
                    }
                  >
                    {showMemoryPanel ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={resetDemo}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                className="h-[400px] overflow-y-auto p-6 space-y-4 scroll-smooth"
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
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'bot'
                          ? 'bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400'
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {message.sender === 'bot' ? (
                        <BrainCircuit className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="max-w-[75%]">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'bot'
                            ? 'bg-bg-secondary text-text-primary rounded-tl-sm'
                            : 'bg-brand-500 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>
                      {message.memoryUsed && message.memoryUsed.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                          <BrainCircuit className="w-3 h-3" />
                          Used {message.memoryUsed.length} memory items
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-rose-500"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: durations.slower,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm">Recalling memories...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border p-4 bg-bg-primary">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Try: 'What do you know about me?' or 'I prefer dark mode'"
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          {/* Memory Panel */}
          <AnimatePresence>
            {showMemoryPanel && (
              <ScrollReveal delay={0.2}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="p-6 rounded-xl bg-bg-secondary border border-border">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-rose-500" />
                      Memory Store
                    </h3>
                    <div className="space-y-3">
                      {memory.map((item) => {
                        const Icon = memoryTypeIcon[item.type]
                        const isActive = activeMemoryIds.includes(item.id)

                        return (
                          <motion.div
                            key={item.id}
                            animate={{
                              scale: isActive ? 1.02 : 1,
                              borderColor: isActive
                                ? 'rgb(244, 63, 94)'
                                : 'transparent',
                            }}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              isActive
                                ? 'bg-rose-50 dark:bg-rose-950 border-rose-500'
                                : 'bg-bg-primary border-transparent'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${memoryTypeColor[item.type]}`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">
                                  {item.content}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                                  <Clock className="w-3 h-3" />
                                  {item.source}
                                </div>
                              </div>
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 rounded-full bg-rose-500"
                                />
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 border border-rose-200 dark:border-rose-800">
                    <h4 className="font-medium text-sm mb-2">Memory Types</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        Facts
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-purple-500" />
                        Preferences
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        Context
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-orange-500" />
                        Documents
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/guides/memory"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Memory Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
