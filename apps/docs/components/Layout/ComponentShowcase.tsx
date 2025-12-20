'use client'

import { durations } from '@/lib/animations'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react'

interface ComponentExample {
  id: string
  title: string
  description: string
  category: 'basic' | 'advanced' | 'ai' | 'layout'
  preview: React.ReactNode
  code: string
}

const componentExamples: ComponentExample[] = [
  {
    id: 'chat-window',
    title: 'Chat Window',
    description: 'Complete chat interface with streaming support',
    category: 'layout',
    preview: (
      <div className="w-full h-64 bg-bg-secondary rounded-lg p-4">
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-2 overflow-y-auto">
            <div className="flex justify-start">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-2 rounded-lg max-w-xs">
                Hello! How can I help you today?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg max-w-xs">
                I need help with React components
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-2 rounded-lg max-w-xs">
                I'd be happy to help with React components! What specific aspect
                would you like to know about?
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-bg-primary text-sm"
              readOnly
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    ),
    code: `<ChatWindow>
  <MessageList>
    <Message role="assistant">
      Hello! How can I help you today?
    </Message>
    <Message role="user">
      I need help with React components
    </Message>
  </MessageList>
  <MessageInput />
</ChatWindow>`,
  },
  {
    id: 'typing-indicator',
    title: 'Typing Indicator',
    description: 'Smooth typing animation for better UX',
    category: 'basic',
    preview: (
      <div className="w-full h-32 bg-bg-secondary rounded-lg p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">AI is thinking</span>
          <div className="flex gap-1">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    ),
    code: `<TypingIndicator 
  isTyping={true}
  users={[{ name: 'AI Assistant' }]}
/>`,
  },
  {
    id: 'message-bubbles',
    title: 'Message Bubbles',
    description: 'Customizable message components',
    category: 'basic',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex justify-start">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
              Hey! How are you doing?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs">
              I'm doing great, thanks for asking!
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
              That's wonderful to hear! 😊
            </div>
          </div>
        </div>
      </div>
    ),
    code: `<Message 
  content="Hello!" 
  role="assistant"
  avatar={true}
  timestamp={true}
/>`,
  },
  {
    id: 'command-palette',
    title: 'Command Palette',
    description: 'Keyboard-driven command interface',
    category: 'advanced',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="bg-bg-primary border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <input
              type="text"
              placeholder="Search commands..."
              className="flex-1 bg-transparent outline-none text-sm"
              readOnly
            />
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-sm">
              /clear - Clear chat history
            </div>
            <div className="px-3 py-2 rounded-md hover:bg-bg-secondary text-sm transition-colors">
              /export - Export conversation
            </div>
            <div className="px-3 py-2 rounded-md hover:bg-bg-secondary text-sm transition-colors">
              /theme - Change theme
            </div>
          </div>
        </div>
      </div>
    ),
    code: `<CommandPalette
  commands={[
    { name: 'clear', description: 'Clear chat history' },
    { name: 'export', description: 'Export conversation' },
    { name: 'theme', description: 'Change theme' }
  ]}
  onSelect={(command) => handleCommand(command)}
/>`,
  },
]

const categories = [
  { id: 'basic', name: 'Basic Components', icon: '🧱' },
  { id: 'advanced', name: 'Advanced', icon: '⚡' },
  { id: 'ai', name: 'AI Features', icon: '🤖' },
  { id: 'layout', name: 'Layout', icon: '📐' },
]

export function ComponentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic')
  const [selectedExample, setSelectedExample] = useState(0)
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  )

  const filteredExamples = componentExamples.filter(
    (example) => example.category === selectedCategory
  )

  const currentExample = filteredExamples[selectedExample]

  return (
    <section className="py-20 md:py-28">
      <div className="container-docs">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for Every Use Case
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            From simple chat interfaces to complex AI workflows, our components
            scale with your needs.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSelectedExample(0)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Example Navigation */}
          {filteredExamples.length > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {filteredExamples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExample(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    selectedExample === index
                      ? 'bg-blue-500'
                      : 'bg-bg-tertiary hover:bg-bg-secondary'
                  }`}
                  aria-label={`Go to example ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Component Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExample?.id || 'empty'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: durations.moderate }}
              className="bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-2xl p-8 border border-border"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    {currentExample?.title}
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {currentExample?.description}
                  </p>

                  {/* Code Preview */}
                  <div className="bg-bg-primary border border-border rounded-lg p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap text-text-secondary">
                      {currentExample?.code}
                    </pre>
                  </div>
                </div>

                {/* Component Preview */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    {currentExample?.preview}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                <button
                  onClick={() =>
                    setSelectedExample(Math.max(0, selectedExample - 1))
                  }
                  disabled={selectedExample === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={() =>
                    setSelectedExample(
                      Math.min(filteredExamples.length - 1, selectedExample + 1)
                    )
                  }
                  disabled={selectedExample === filteredExamples.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
