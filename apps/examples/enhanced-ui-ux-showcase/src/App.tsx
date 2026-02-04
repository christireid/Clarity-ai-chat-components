/**
 * Enhanced UI/UX Showcase - 2025 Trends Demo
 *
 * This example demonstrates the world-class UI/UX improvements
 * implementing 2025 trends: glassmorphism, aurora gradients,
 * neumorphism, quantum animations, and AI-powered features.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Message, PromptSuggestion } from '@clarity-chat/types'

// Define interface for EnhancedChatWindow props
interface EnhancedChatWindowProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
  animationVariant?: string
  starterPrompts?: PromptSuggestion[]
  showThinkingIndicator?: boolean
  thinkingIndicator?: React.ReactNode
  glassIntensity?: number
  auroraSpeed?: string
  neumorphicDepth?: string
  adaptiveAnimations?: boolean
  voiceInput?: boolean
}

// Simple EnhancedChatWindow component for the demo
function EnhancedChatWindow({
  messages,
  isLoading,
  onSendMessage,
  starterPrompts,
  showThinkingIndicator,
  thinkingIndicator,
}: EnhancedChatWindowProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'bg-white/20 backdrop-blur-lg border border-white/30'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && showThinkingIndicator && thinkingIndicator}
      </div>

      {starterPrompts && messages.length === 1 && (
        <div className="p-4 grid grid-cols-2 gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onSendMessage(prompt.text)}
              className="p-2 text-sm bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all text-left"
            >
              {prompt.text}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

// Advanced thinking indicator with quantum effects
function QuantumThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4 m-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-200/30">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-spin" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">
          AI is thinking quantum thoughts...
        </p>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-4 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Aurora background component
function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
          backgroundSize: '400% 400%',
          animation: 'aurora 15s ease infinite',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.4) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
    </div>
  )
}

// Glassmorphism card component
function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`
      bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20
      shadow-glass hover:shadow-glass-hover transition-all duration-500
      ${className}
    `}
    >
      {children}
    </div>
  )
}

// Neumorphic card component
function NeumorphicCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`
      bg-gray-100 rounded-3xl shadow-neumorphic
      hover:shadow-neumorphic-inset transition-all duration-500
      ${className}
    `}
    >
      {children}
    </div>
  )
}

export default function EnhancedUIUXShowcase() {
  const [currentTheme, setCurrentTheme] = useState('aurora')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content:
        "Welcome to the future of AI chat interfaces! I'm demonstrating the enhanced UI/UX with 2025 design trends. Try different themes to see glassmorphism, aurora gradients, and neumorphic effects in action.",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [animationVariant, setAnimationVariant] = useState<
    'quantum' | 'aurora' | 'glass' | 'neumorphic'
  >('aurora')

  const starterPrompts: PromptSuggestion[] = [
    {
      id: '1',
      text: '✨ Show me glassmorphism',
      category: 'demo',
      relevance: 1,
    },
    {
      id: '2',
      text: '🌈 Aurora gradients',
      category: 'demo',
      relevance: 1,
    },
    {
      id: '3',
      text: '🎯 Neumorphism design',
      category: 'demo',
      relevance: 1,
    },
    {
      id: '4',
      text: '⚡ Quantum animations',
      category: 'demo',
      relevance: 1,
    },
  ]

  const themes = [
    {
      name: 'aurora',
      label: '🌈 Aurora',
      description: 'Flowing gradient animations',
    },
    {
      name: 'glassmorphism',
      label: '💎 Glass',
      description: 'Frosted glass effects',
    },
    {
      name: 'neumorphism',
      label: '🎯 Neumorphic',
      description: 'Soft tactile interface',
    },
    {
      name: 'quantum',
      label: '⚡ Quantum',
      description: 'Quantum-inspired animations',
    },
  ]

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response with different themes
    setTimeout(() => {
      const aiResponses = {
        aurora:
          'The aurora theme creates an immersive experience with flowing gradients that adapt to your conversation. Notice how the background subtly shifts colors as you type, creating a dynamic visual experience.',
        glassmorphism:
          'Glassmorphism provides a modern, premium feel with frosted glass effects. The transparency creates depth while maintaining readability. Perfect for professional applications that need a sophisticated touch.',
        neumorphism:
          'Neumorphism offers a soft, tactile interface with subtle extrusions. The gentle shadows create a calming effect, making interactions feel more natural and less digital.',
        quantum:
          'Quantum-inspired animations use physics-based motion for natural movement. The micro-interactions respond to your input with magnetic-like attraction, creating an intuitive user experience.',
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content:
          aiResponses[animationVariant as keyof typeof aiResponses] ||
          'This is an enhanced response demonstrating the power of modern UI/UX design.',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Aurora background */}
      <AuroraBackground />

      {/* Header with theme selector */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Clarity Chat - Enhanced UI/UX 2025
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              World-class AI chat interfaces with cutting-edge design trends
            </p>

            {/* Theme selector */}
            <div className="flex justify-center gap-4 mb-8">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    setCurrentTheme(theme.name)
                    setAnimationVariant(theme.name as any)
                  }}
                  className={`
                    px-6 py-3 rounded-2xl font-medium transition-all duration-300
                    ${
                      currentTheme === theme.name
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90'
                    }
                    hover:scale-105 hover:shadow-xl
                  `}
                >
                  <div className="text-lg mb-1">{theme.label}</div>
                  <div className="text-xs opacity-80">{theme.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Chat Window */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Enhanced Chat Interface
              </h2>

              <GlassCard className="h-[600px]">
                <EnhancedChatWindow
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  animationVariant={animationVariant}
                  starterPrompts={starterPrompts}
                  showThinkingIndicator={true}
                  thinkingIndicator={<QuantumThinkingIndicator />}
                  glassIntensity={0.3}
                  auroraSpeed="medium"
                  neumorphicDepth="normal"
                  adaptiveAnimations={true}
                  voiceInput={true}
                />
              </GlassCard>
            </div>

            {/* Feature showcase */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                2025 UI/UX Features
              </h2>

              <div className="space-y-6">
                {/* Glassmorphism showcase */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    Glassmorphism 2.0
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Frosted glass effects with dynamic transparency and backdrop
                    blur. Creates depth while maintaining readability.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-2" />
                        <div className="h-2 bg-white/40 rounded mb-1" />
                        <div className="h-2 bg-white/20 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Aurora gradients showcase */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🌈</span>
                    Aurora Gradients
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Dynamic flowing gradients inspired by natural aurora
                    phenomena. Creates immersive, captivating visual
                    experiences.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-4 text-white">
                      <div className="text-sm font-medium">Dawn Flow</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-400 to-green-400 rounded-xl p-4 text-white">
                      <div className="text-sm font-medium">Ocean Wave</div>
                    </div>
                  </div>
                </GlassCard>

                {/* Neumorphism showcase */}
                <NeumorphicCard className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Neumorphism
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Soft, extruded UI elements with tactile realism. Creates a
                    calming, sophisticated interface.
                  </p>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-100 rounded-xl p-4 shadow-neumorphic hover:shadow-neumorphic-inset transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-300 rounded-lg shadow-neumorphic-inset" />
                          <div className="h-2 bg-gray-300 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </NeumorphicCard>

                {/* Quantum animations showcase */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Quantum Animations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Physics-based motion with magnetic attraction and
                    entanglement effects. Natural, intuitive movement.
                  </p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"
                      />
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations - using regular style tag for Vite compatibility */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .shadow-glass {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .shadow-glass-hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .shadow-neumorphic {
          box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.7);
        }

        .shadow-neumorphic-inset {
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.7);
        }

        .shadow-quantum-glow {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }
      `,
        }}
      />
    </div>
  )
}
