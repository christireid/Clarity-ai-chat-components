'use client'

import { durations } from '@/lib/animations'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ComponentExample {
  id: string
  title: string
  description: string
  category: 'basic' | 'advanced' | 'ai' | 'layout'
  preview: React.ReactNode
  code: string
}

const componentExamples: ComponentExample[] = [
  // Basic Components
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
    description: 'Customizable message components with avatars and timestamps',
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
              That's wonderful to hear!
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
    id: 'message-input',
    title: 'Message Input',
    description: 'Auto-resizing textarea with send button and keyboard shortcuts',
    category: 'basic',
    preview: (
      <div className="w-full h-32 bg-bg-secondary rounded-lg p-4 flex items-center justify-center">
        <div className="w-full max-w-md flex gap-2">
          <div className="flex-1 px-4 py-3 border border-border rounded-xl bg-bg-primary text-sm text-text-secondary">
            Type a message...
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
        </div>
      </div>
    ),
    code: `<MessageInput
  placeholder="Type a message..."
  onSend={(message) => handleSend(message)}
  maxLength={4000}
/>`,
  },
  // Advanced Components
  {
    id: 'command-palette',
    title: 'Command Palette',
    description: 'Keyboard-driven command interface with fuzzy search',
    category: 'advanced',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="bg-bg-primary border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-3 border-b border-border pb-3">
            <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-sm"
              readOnly
            />
            <kbd className="px-2 py-0.5 bg-bg-secondary rounded text-xs text-text-tertiary">Esc</kbd>
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-sm flex justify-between items-center">
              <span>/clear - Clear chat history</span>
              <kbd className="px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd>
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
    { name: 'clear', description: 'Clear history' },
    { name: 'export', description: 'Export chat' },
  ]}
  onSelect={handleCommand}
/>`,
  },
  {
    id: 'code-block',
    title: 'Code Block',
    description: 'Syntax highlighted code with copy button and line numbers',
    category: 'advanced',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-sm text-gray-400">typescript</span>
            <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <pre className="p-4 text-sm overflow-x-auto">
            <code className="text-gray-300">
              <span className="text-purple-400">const</span>{' '}
              <span className="text-blue-300">chat</span> ={' '}
              <span className="text-yellow-300">useClarityChat</span>({'{'}
              {'\n'}  <span className="text-blue-300">api</span>:{' '}
              <span className="text-green-300">"/api/chat"</span>
              {'\n'}{'}'})
            </code>
          </pre>
        </div>
      </div>
    ),
    code: `<CodeBlock
  language="typescript"
  code={codeString}
  showLineNumbers
  copyButton
/>`,
  },
  {
    id: 'file-upload',
    title: 'File Upload',
    description: 'Drag and drop file attachments with preview',
    category: 'advanced',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <svg className="w-10 h-10 mx-auto mb-3 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-text-secondary mb-1">Drag and drop files here</p>
          <p className="text-xs text-text-tertiary">or click to browse</p>
          <div className="mt-3 flex justify-center gap-2">
            <span className="px-2 py-1 bg-bg-tertiary rounded text-xs text-text-tertiary">PDF</span>
            <span className="px-2 py-1 bg-bg-tertiary rounded text-xs text-text-tertiary">PNG</span>
            <span className="px-2 py-1 bg-bg-tertiary rounded text-xs text-text-tertiary">TXT</span>
          </div>
        </div>
      </div>
    ),
    code: `<FileUpload
  accept={['pdf', 'png', 'txt']}
  maxSize={10 * 1024 * 1024}
  onUpload={handleFiles}
/>`,
  },
  // AI Features
  {
    id: 'streaming-response',
    title: 'Streaming Response',
    description: 'Real-time token-by-token response streaming',
    category: 'ai',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex justify-start">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-4 py-3 rounded-2xl rounded-tl-sm max-w-sm">
              <p className="text-sm">Here's how to implement a React hook for</p>
              <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Streaming</span>
            </div>
            <span>•</span>
            <span>127 tokens</span>
            <span>•</span>
            <span>0.8s</span>
          </div>
        </div>
      </div>
    ),
    code: `const { messages, isStreaming } = useClarityChat({
  api: "/api/chat",
  transport: "sse",
  onToken: (token) => console.log(token)
})`,
  },
  {
    id: 'token-counter',
    title: 'Token Counter',
    description: 'Real-time token usage tracking with budget alerts',
    category: 'ai',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4 flex items-center justify-center">
        <div className="w-full max-w-xs space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">Token Usage</span>
            <span className="font-mono font-medium">3,247 / 4,096</span>
          </div>
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" style={{ width: '79%' }} />
          </div>
          <div className="flex justify-between text-xs text-text-tertiary">
            <span>Context: 2,100</span>
            <span>Response: 1,147</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg">
            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs text-amber-700 dark:text-amber-300">Approaching token limit</span>
          </div>
        </div>
      </div>
    ),
    code: `<TokenCounter
  current={3247}
  max={4096}
  warningThreshold={0.75}
  onLimitReached={handleLimit}
/>`,
  },
  {
    id: 'thinking-indicator',
    title: 'Thinking Indicator',
    description: 'Show AI reasoning process with expandable details',
    category: 'ai',
    preview: (
      <div className="w-full h-48 bg-bg-secondary rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Thinking...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
              <div className="text-xs text-text-tertiary bg-bg-tertiary px-3 py-2 rounded-lg">
                Analyzing code structure and identifying best practices...
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `<ThinkingIndicator
  isThinking={true}
  thoughts={thoughts}
  expandable={true}
/>`,
  },
  // Layout Components
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
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-2 rounded-lg max-w-xs text-sm">
                Hello! How can I help you today?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg max-w-xs text-sm">
                I need help with React components
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-2 rounded-lg max-w-xs text-sm">
                I'd be happy to help! What aspect would you like to know about?
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
  <MessageList messages={messages} />
  <MessageInput onSend={handleSend} />
</ChatWindow>`,
  },
  {
    id: 'sidebar-layout',
    title: 'Sidebar Layout',
    description: 'Conversation history sidebar with search and organization',
    category: 'layout',
    preview: (
      <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden flex">
        <div className="w-48 bg-bg-tertiary border-r border-border p-3 flex flex-col">
          <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm mb-3 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
          <div className="space-y-1 flex-1">
            <div className="px-3 py-2 rounded-lg bg-bg-secondary text-sm truncate">React hooks question</div>
            <div className="px-3 py-2 rounded-lg hover:bg-bg-secondary text-sm text-text-secondary truncate">API design help</div>
            <div className="px-3 py-2 rounded-lg hover:bg-bg-secondary text-sm text-text-secondary truncate">Debug assistance</div>
          </div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center text-text-tertiary text-sm">
          Chat content area
        </div>
      </div>
    ),
    code: `<ChatLayout>
  <Sidebar>
    <ConversationList />
  </Sidebar>
  <ChatWindow />
</ChatLayout>`,
  },
  {
    id: 'split-view',
    title: 'Split View',
    description: 'Side-by-side chat and preview panels',
    category: 'layout',
    preview: (
      <div className="w-full h-64 bg-bg-secondary rounded-lg overflow-hidden flex">
        <div className="flex-1 border-r border-border p-3 flex flex-col">
          <div className="text-xs text-text-tertiary mb-2 font-medium">CHAT</div>
          <div className="flex-1 space-y-2">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-1.5 rounded-lg text-xs max-w-[80%]">
              Here's the component code...
            </div>
          </div>
          <div className="mt-2 px-3 py-2 border border-border rounded-lg text-xs text-text-tertiary">
            Ask about the code...
          </div>
        </div>
        <div className="flex-1 p-3 bg-gray-900">
          <div className="text-xs text-gray-500 mb-2 font-medium">PREVIEW</div>
          <pre className="text-xs text-gray-300">
            <span className="text-purple-400">function</span>{' '}
            <span className="text-blue-300">Button</span>() {'{'}
          </pre>
        </div>
      </div>
    ),
    code: `<SplitView>
  <ChatPanel />
  <PreviewPanel>
    <CodePreview code={code} />
  </PreviewPanel>
</SplitView>`,
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

          {/* Component Showcase */}
          <AnimatePresence mode="wait">
            {currentExample ? (
              <motion.div
                key={currentExample.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: durations.moderate }}
                className="bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-2xl p-8 border border-border"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      {currentExample.title}
                    </h3>
                    <p className="text-text-secondary mb-6">
                      {currentExample.description}
                    </p>

                    {/* Code Preview */}
                    <div className="bg-bg-primary border border-border rounded-lg p-4 font-mono text-sm">
                      <pre className="whitespace-pre-wrap text-text-secondary">
                        {currentExample.code}
                      </pre>
                    </div>
                  </div>

                  {/* Component Preview */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      {currentExample.preview}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                {filteredExamples.length > 1 && (
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

                    <div className="flex gap-2">
                      {filteredExamples.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedExample(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            selectedExample === index
                              ? 'bg-blue-500'
                              : 'bg-bg-tertiary hover:bg-text-tertiary'
                          }`}
                          aria-label={`Go to example ${index + 1}`}
                        />
                      ))}
                    </div>

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
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: durations.moderate }}
                className="bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-2xl p-12 border border-border text-center"
              >
                <p className="text-text-secondary">
                  No examples available for this category yet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
