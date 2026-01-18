'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  RefreshCw,
  ChevronLeft,
  Copy,
  Check,
  Sparkles,
  User,
  Send,
  ArrowRight,
  Code2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/components/Layout/hooks'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { TypingIndicator } from '@clarity-chat/react'
import { generateId, sleep } from '@/lib/demos/utils'
import { useMountedRef, useCopyToClipboard } from '@/lib/demos/hooks'
import {
  trackDemoViewed,
  trackCodeCopied,
  trackProviderSwitched,
  trackMessageSent,
} from '@/lib/demos/analytics'
import { CopyFullExampleButton } from '@/components/Demo/CopyFullExampleButton'

// Simple auto-scroll hook
function useAutoScroll(options?: {
  dependencies?: unknown[]
  threshold?: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  // Auto-scroll when dependencies change
  useEffect(() => {
    scrollToBottom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options?.dependencies || [])

  return { scrollRef, scrollToBottom }
}

interface Provider {
  id: string
  name: string
  model: string
  color: string
  bgColor: string
  logo: string
  description: string
}

const providers: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'GPT-4o',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
    logo: '🟢',
    description: 'Best for general tasks and coding',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    model: 'Claude 3.5',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    logo: '🟠',
    description: 'Best for analysis and writing',
  },
  {
    id: 'google',
    name: 'Google',
    model: 'Gemini Pro',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    logo: '🔵',
    description: 'Best for multimodal and research',
  },
]

const providerResponses: Record<string, Record<string, string>> = {
  openai: {
    greeting:
      "Hello! I'm GPT-4o from OpenAI. I excel at coding, math, and structured reasoning. Try asking me a technical question!",
    capabilities:
      "As GPT-4o, I'm optimized for: 🔧 Code generation & debugging, 📊 Data analysis, 🧮 Mathematical reasoning, 💡 Creative solutions. I have a 128K context window and support function calling.",
    default:
      "I'm GPT-4o. I noticed you switched providers mid-conversation - Clarity Chat makes this seamless! Your conversation history is preserved across provider switches.",
  },
  anthropic: {
    greeting:
      "Hello! I'm Claude 3.5 from Anthropic. I specialize in nuanced analysis, writing, and careful reasoning. What can I help you explore?",
    capabilities:
      "As Claude 3.5, I'm particularly good at: 📝 Long-form writing, 🔍 Nuanced analysis, 🤔 Ethical reasoning, 📚 Research synthesis. I have a 200K context window and strong safety features.",
    default:
      "I'm Claude 3.5. Notice how the conversation continued seamlessly when you switched from another provider? That's Clarity Chat's provider abstraction at work!",
  },
  google: {
    greeting:
      "Hello! I'm Gemini Pro from Google. I'm great with multimodal content, research, and real-time information. How can I assist you?",
    capabilities:
      'As Gemini Pro, my strengths include: 🖼️ Multimodal understanding, 🔎 Research & search integration, 🌐 Real-time information, 📱 Mobile optimization. I support images, video, and audio inputs.',
    default:
      "I'm Gemini Pro. The fact that you can switch between AI providers without any code changes demonstrates the power of Clarity Chat's unified API!",
  },
}

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  provider?: string
  timestamp: Date
  isStreaming?: boolean
}

const apiRouteCode = `// app/api/chat/route.ts
import { createClarityStream } from '@clarity-chat/server'

export async function POST(req: Request) {
  const { messages, provider } = await req.json()

  // Same code works with any provider!
  return createClarityStream({
    provider, // 'openai' | 'anthropic' | 'google'
    messages,
    // Provider-specific config auto-resolved
  })
}`

const clientCode = `// components/Chat.tsx
import { ClarityChat } from '@clarity-chat/react'

export function Chat({ provider }) {
  return (
    <ClarityChat
      api="/api/chat"
      provider={provider}
      // Conversation persists across provider switches!
    />
  )
}`

export default function ProviderHotswapDemo() {
  const [activeProvider, setActiveProvider] = useState<string>('openai')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm GPT-4o from OpenAI. Try switching providers using the buttons above - your conversation will continue seamlessly!",
      role: 'assistant',
      provider: 'openai',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [switchCount, setSwitchCount] = useState(0)
  const isMountedRef = useMountedRef()
  const { copy, isCopied } = useCopyToClipboard()
  const prefersReducedMotion = useReducedMotion()

  const { scrollRef, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  useEffect(() => {
    trackDemoViewed('provider-hotswap')
  }, [])

  const copyCode = async (code: string, id: string) => {
    const success = await copy(code, id)
    if (success) {
      trackCodeCopied('provider-hotswap', id)
    }
  }

  const handleProviderSwitch = (providerId: string) => {
    if (providerId === activeProvider) return

    const provider = providers.find((p) => p.id === providerId)
    if (!provider) return

    trackProviderSwitched('provider-hotswap', activeProvider, providerId)
    setActiveProvider(providerId)
    setSwitchCount((prev) => prev + 1)

    // Add a system message about the switch
    const switchMessage: Message = {
      id: generateId(),
      content: `Switched to ${provider.name} (${provider.model}). The conversation continues...`,
      role: 'assistant',
      provider: providerId,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, switchMessage])
    scrollToBottom()
  }

  const simulateStream = async (text: string, messageId: string) => {
    const words = text.split(' ')
    let currentText = ''

    for (let i = 0; i < words.length; i++) {
      if (!isMountedRef.current) return
      currentText += (i > 0 ? ' ' : '') + words[i]
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: currentText } : msg
        )
      )
      scrollToBottom()
      await sleep(25 + Math.random() * 25)
    }

    if (!isMountedRef.current) return
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    )
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    trackMessageSent('provider-hotswap')

    const userMessage: Message = {
      id: generateId(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    }

    const userInput = input.toLowerCase()
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    scrollToBottom()

    await sleep(700)

    const responses = providerResponses[activeProvider]
    let responseText = responses.default

    if (
      userInput.includes('hello') ||
      userInput.includes('hi') ||
      userInput.includes('hey')
    ) {
      responseText = responses.greeting
    } else if (
      userInput.includes('what can') ||
      userInput.includes('capabilities') ||
      userInput.includes('good at')
    ) {
      responseText = responses.capabilities
    }

    const botMessageId = generateId()
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        content: '',
        role: 'assistant',
        provider: activeProvider,
        timestamp: new Date(),
        isStreaming: true,
      },
    ])
    setIsTyping(false)

    await simulateStream(responseText, botMessageId)
  }

  const currentProvider =
    providers.find((p) => p.id === activeProvider) ?? providers[0]

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <RefreshCw className="w-4 h-4" />
              Provider Abstraction
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hot-Swap{' '}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                AI Providers
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Switch between OpenAI, Claude, and Gemini mid-conversation. Same
              code, same conversation, different providers.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chat Panel */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border-2 border-border shadow-2xl overflow-hidden bg-bg-primary">
              {/* Provider Selector */}
              <div className="p-4 bg-bg-secondary border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-text-secondary">
                    Select Provider
                  </span>
                  <span className="text-xs text-text-secondary">
                    Switches: {switchCount}
                  </span>
                </div>
                <div className="flex gap-2">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleProviderSwitch(provider.id)}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        activeProvider === provider.id
                          ? `border-brand-500 ${provider.bgColor}`
                          : 'border-transparent bg-bg-primary hover:bg-bg-secondary'
                      }`}
                    >
                      <div className="text-2xl mb-1">{provider.logo}</div>
                      <div className="text-xs font-medium">{provider.name}</div>
                      <div className="text-[10px] text-text-secondary">
                        {provider.model}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Header */}
              <div className={`px-6 py-4 ${currentProvider.bgColor}`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{currentProvider.logo}</div>
                  <div>
                    <div className={`font-semibold ${currentProvider.color}`}>
                      {currentProvider.name} - {currentProvider.model}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {currentProvider.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                className="h-[350px] overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                {messages.map((message) => {
                  const msgProvider = message.provider
                    ? providers.find((p) => p.id === message.provider)
                    : undefined

                  return (
                    <motion.div
                      key={message.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      animate={
                        prefersReducedMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0 }
                      }
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'assistant'
                            ? msgProvider?.bgColor ||
                              'bg-gray-100 dark:bg-gray-800'
                            : 'bg-purple-100 dark:bg-purple-900'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <span className="text-lg">
                            {msgProvider?.logo || '🤖'}
                          </span>
                        ) : (
                          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.role === 'assistant'
                            ? 'bg-bg-secondary text-text-primary rounded-tl-sm'
                            : 'bg-brand-500 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

                {isTyping && (
                  <TypingIndicator
                    showAvatar
                    avatarSrc=""
                    avatarFallback={currentProvider.logo}
                    label={`${currentProvider.name} is thinking...`}
                    variant="dots"
                    className=""
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
                    placeholder="Ask something, then switch providers..."
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

          {/* Code Panel */}
          <ScrollReveal delay={0.2}>
            <div className="space-y-6">
              {/* API Route Code */}
              <div className="rounded-2xl border border-border overflow-hidden bg-gray-900">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300 font-medium">
                      API Route (Server)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(apiRouteCode, 'api')}
                      className="p-2 hover:bg-gray-700 rounded transition-colors"
                      title="Copy snippet"
                    >
                      {isCopied('api') ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <CopyFullExampleButton
                      demoId="provider-hotswap"
                      variant="compact"
                    />
                  </div>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                  <code>{apiRouteCode}</code>
                </pre>
              </div>

              {/* Client Code */}
              <div className="rounded-2xl border border-border overflow-hidden bg-gray-900">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300 font-medium">
                      Client Component
                    </span>
                  </div>
                  <button
                    onClick={() => copyCode(clientCode, 'client')}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="Copy snippet"
                  >
                    {isCopied('client') ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                  <code>{clientCode}</code>
                </pre>
              </div>

              {/* Key Benefits */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Why This Matters
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>No vendor lock-in:</strong> Switch providers
                      without changing code
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Cost optimization:</strong> Route to cheaper
                      models for simple queries
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Fallback support:</strong> Auto-switch when a
                      provider is down
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>A/B testing:</strong> Compare model quality
                      side-by-side
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center">
            <Link
              href="/guides/model-adapters"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Learn More About Model Adapters <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
