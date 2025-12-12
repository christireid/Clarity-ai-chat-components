'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Zap,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Bot,
  User,
  Send,
  Code2,
  Play,
  ChevronLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { useAutoScroll, TypingIndicator } from '@clarity-chat/react'

const heroCode = `import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      placeholder="Ask me anything..."
    />
  )
}`

const expandedCode = `import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      placeholder="Ask me anything..."
      theme="auto"
      showTimestamps
      enableMarkdown
      onMessageSent={(msg) => console.log('Sent:', msg)}
    />
  )
}`

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
}

const generateId = () => crypto.randomUUID()

const demoResponses: Record<string, string> = {
  default: "I'm the Clarity Chat demo! This entire chat was built with just a few lines of code. Try asking about features, streaming, theming, or anything else!",
  streaming: "Streaming is built-in! Just set `api` to your streaming endpoint, and Clarity Chat handles everything: the typing indicator, character-by-character rendering, and smooth animations. No extra code needed.",
  theme: "Theming is automatic! Use `theme=\"auto\"` to respect system preferences, or set `theme=\"dark\"` or `theme=\"light\"`. You can also use CSS variables for complete customization.",
  features: "Clarity Chat includes: ✨ Streaming support, 🎨 Theming & dark mode, ⌨️ Keyboard shortcuts, 📱 Mobile responsive, ♿ Accessibility (WCAG 2.1 AA), 🔧 70+ components, and much more!",
  code: "The code you see is real! Just `npm install @clarity-chat/react`, import the component, and pass your API endpoint. That's it - you get a production-ready chat with all the polish.",
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('stream')) return demoResponses.streaming
  if (lower.includes('theme') || lower.includes('dark') || lower.includes('light')) return demoResponses.theme
  if (lower.includes('feature') || lower.includes('what can') || lower.includes('capabilities')) return demoResponses.features
  if (lower.includes('code') || lower.includes('how') || lower.includes('work')) return demoResponses.code
  return demoResponses.default
}

export default function ZeroToChatDemo() {
  const [copied, setCopied] = useState(false)
  const [showExpanded, setShowExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm a fully functional AI chat built in just 8 lines of code. Go ahead, type something!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const { scrollRef, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  const copyCode = () => {
    navigator.clipboard.writeText(showExpanded ? expandedCode : heroCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const simulateStream = async (text: string, messageId: string) => {
    const words = text.split(' ')
    let currentText = ''

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i]
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, text: currentText } : msg
      ))
      scrollToBottom()
      await new Promise(r => setTimeout(r, 30 + Math.random() * 30))
    }

    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isStreaming: false } : msg
    ))
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    const userInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    scrollToBottom()

    await new Promise(r => setTimeout(r, 800))

    const botMessageId = generateId()
    setMessages(prev => [...prev, {
      id: botMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true,
    }])
    setIsTyping(false)

    await simulateStream(getResponse(userInput), botMessageId)
  }

  return (
    <div className="container-docs py-12">
      {/* Breadcrumb */}
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Hero Demo
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Zero to Chat in{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                8 Lines
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              A fully functional AI chat with streaming, theming, and polish—no boilerplate required.
              Type below and experience it yourself.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Code Panel */}
          <ScrollReveal delay={0.1}>
            <div className="sticky top-24">
              <div className="rounded-2xl border border-border overflow-hidden bg-gray-900 shadow-2xl">
                {/* Code Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300 font-medium">App.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowExpanded(!showExpanded)}
                      className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                    >
                      {showExpanded ? 'Minimal' : 'Expanded'}
                    </button>
                    <button
                      onClick={copyCode}
                      className="p-2 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm overflow-x-auto">
                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={showExpanded ? 'expanded' : 'minimal'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-gray-300"
                    >
                      {showExpanded ? (
                        <>
                          <span className="text-purple-400">import</span>{' '}
                          <span className="text-yellow-300">{'{ ClarityChat }'}</span>{' '}
                          <span className="text-purple-400">from</span>{' '}
                          <span className="text-green-400">'@clarity-chat/react'</span>
                          {'\n\n'}
                          <span className="text-purple-400">export default function</span>{' '}
                          <span className="text-blue-400">App</span>
                          <span className="text-yellow-300">()</span> {'{'}
                          {'\n  '}
                          <span className="text-purple-400">return</span> (
                          {'\n    '}
                          <span className="text-blue-400">{'<ClarityChat'}</span>
                          {'\n      '}
                          <span className="text-cyan-300">api</span>=
                          <span className="text-green-400">"/api/chat"</span>
                          {'\n      '}
                          <span className="text-cyan-300">placeholder</span>=
                          <span className="text-green-400">"Ask me anything..."</span>
                          {'\n      '}
                          <span className="text-cyan-300">theme</span>=
                          <span className="text-green-400">"auto"</span>
                          {'\n      '}
                          <span className="text-cyan-300">showTimestamps</span>
                          {'\n      '}
                          <span className="text-cyan-300">enableMarkdown</span>
                          {'\n      '}
                          <span className="text-cyan-300">onMessageSent</span>=
                          <span className="text-yellow-300">{'{(msg) => console.log(msg)}'}</span>
                          {'\n    '}
                          <span className="text-blue-400">{'/>'}</span>
                          {'\n  '}
                          )
                          {'\n'}
                          {'}'}
                        </>
                      ) : (
                        <>
                          <span className="text-purple-400">import</span>{' '}
                          <span className="text-yellow-300">{'{ ClarityChat }'}</span>{' '}
                          <span className="text-purple-400">from</span>{' '}
                          <span className="text-green-400">'@clarity-chat/react'</span>
                          {'\n\n'}
                          <span className="text-purple-400">export default function</span>{' '}
                          <span className="text-blue-400">App</span>
                          <span className="text-yellow-300">()</span> {'{'}
                          {'\n  '}
                          <span className="text-purple-400">return</span> (
                          {'\n    '}
                          <span className="text-blue-400">{'<ClarityChat'}</span>
                          {'\n      '}
                          <span className="text-cyan-300">api</span>=
                          <span className="text-green-400">"/api/chat"</span>
                          {'\n      '}
                          <span className="text-cyan-300">placeholder</span>=
                          <span className="text-green-400">"Ask me anything..."</span>
                          {'\n    '}
                          <span className="text-blue-400">{'/>'}</span>
                          {'\n  '}
                          )
                          {'\n'}
                          {'}'}
                        </>
                      )}
                    </motion.pre>
                  </AnimatePresence>
                </div>

                {/* Line Count */}
                <div className="px-6 py-3 bg-gray-800 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {showExpanded ? '14' : '8'} lines of code
                    </span>
                    <span className="text-green-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Production ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  'Streaming built-in',
                  'Dark mode ready',
                  'Mobile responsive',
                  'Accessible',
                  'Markdown support',
                  'Keyboard shortcuts',
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Live Chat Demo */}
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl border-2 border-brand-500/30 shadow-2xl overflow-hidden bg-bg-primary">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-brand-500 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Live Demo</div>
                    <div className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Interactive - Try it!
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary scroll-smooth"
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
                        ? 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400'
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    }`}>
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.sender === 'bot'
                        ? 'bg-bg-secondary text-text-primary rounded-tl-sm'
                        : 'bg-brand-500 text-white rounded-tr-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <TypingIndicator
                    showAvatar
                    avatarFallback="AI"
                    label="Thinking..."
                    variant="dots"
                  />
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
                    placeholder="Try: 'How does streaming work?'"
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to build your own?</h2>
            <p className="text-text-secondary mb-8">
              Install Clarity Chat and have a working chat interface in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/learn/quick-start"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors"
              >
                <Play className="w-4 h-4" />
                Open Playground
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
