/**
 * Vercel AI SDK Compatible Example
 * 
 * Demonstrates the useChat, useCompletion, and useAssistant hooks
 * with full Vercel AI SDK API compatibility.
 */

import * as React from 'react'
import { useChat, useCompletion, useAssistant, useClarityChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'
import { MemoryProvider } from '@clarity-chat/react/memory'
import { ThemeProvider, themes } from '@clarity-chat/react'
import { convertCoreMessagesToMessages } from '@clarity-chat/react'
import AdvancedExamples from './AdvancedExample'

function ChatExample() {
  const { messages, append, isLoading, handleSubmit, input, setInput, error } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Message finished:', message)
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  return (
    <div className="flex flex-col h-screen">
      <ChatWindow
        messages={messages.map((msg) => ({
          id: msg.id || '',
          chatId: 'default',
          role: msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'assistant' : 'system',
          content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
          status: isLoading && msg.role === 'assistant' ? 'streaming' : 'sent',
          createdAt: new Date(),
          updatedAt: new Date(),
        }))}
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
  const { completion, complete, isLoading, stop } = useCompletion({
    api: '/api/completion',
    onFinish: (prompt, completion) => {
      console.log('Completion finished:', { prompt, completion })
    },
  })

  const [prompt, setPrompt] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      complete(prompt)
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
          {isLoading && (
            <button
              type="button"
              onClick={stop}
              className="px-6 py-2 bg-red-600 text-white rounded-lg"
            >
              Stop
            </button>
          )}
        </div>
      </form>
      <div className="p-4 bg-gray-50 rounded-lg min-h-[200px]">
        {completion || 'Completion will appear here...'}
      </div>
    </div>
  )
}

function AssistantExample() {
  const {
    status,
    messages,
    submitMessage,
    input,
    setInput,
    isLoading,
    toolInvocations,
  } = useAssistant({
    api: '/api/assistant',
    assistantId: 'example-assistant',
    onToolCall: (toolCall) => {
      console.log('Tool called:', toolCall)
    },
    onFinish: (message) => {
      console.log('Assistant finished:', message)
    },
  })

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
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === 'idle' ? 'bg-green-100 text-green-800' :
          status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
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
            <div>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</div>
          </div>
        ))}
      </div>

      {toolInvocations.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Tool Invocations:</h3>
          {toolInvocations.map((invocation, idx) => (
            <div key={idx} className="text-sm">
              <strong>{invocation.toolName}</strong>: {invocation.state}
            </div>
          ))}
        </div>
      )}

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
    messages: coreMessages,
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

  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-bold mb-2">useClarityChat (Flagship Hook)</h2>
        <p className="text-sm text-gray-600 mb-2">
          Clarity's enhanced chat hook with memory integration and transport selection.
        </p>
        {memoryEnabled && (
          <div className="text-xs text-green-700">
            ✓ Memory Enabled {contextSummary && `- Context: ${contextSummary.substring(0, 50)}...`}
          </div>
        )}
      </div>
      <ChatWindow
        messages={messages}
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
  const [activeTab, setActiveTab] = React.useState<'chat' | 'completion' | 'assistant' | 'clarity' | 'advanced' | 'performance'>('chat')

  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ThemeProvider theme={themes.ocean}>
        <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold mb-4">Vercel AI SDK Compatible Examples</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                useChat
              </button>
              <button
                onClick={() => setActiveTab('completion')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'completion' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                useCompletion
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'assistant' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                useAssistant
              </button>
              <button
                onClick={() => setActiveTab('clarity')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'clarity' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                useClarityChat ⭐
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'advanced' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Advanced
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-200'
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
