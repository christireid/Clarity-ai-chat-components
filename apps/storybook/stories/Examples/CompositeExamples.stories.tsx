import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatWindow, ModelSelector, KeyboardHint } from '@clarity-chat/react'
import {
  UsageDashboard,
  FollowUpSuggestions,
} from '@clarity-chat/react/internal'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

const meta: Meta = {
  title: 'Examples/CompositeExamples',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Composite examples showing multiple components working together in real-world scenarios.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta

export const FullChatExperience: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: '1',
        role: 'assistant',
        content:
          'Hello! I can help you with React, TypeScript, and web development.',
        timestamp: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ])
    const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
    const [showShortcuts, setShowShortcuts] = useState(false)

    const handleSendMessage = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setMessages([...messages, userMessage])
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <ModelSelector
            models={[
              { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
              { id: 'claude-3', name: 'Claude 3', provider: 'anthropic' },
            ]}
            value={selectedModel}
            onChange={(model) => setSelectedModel(model)}
          />
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="px-3 py-1 text-sm border rounded"
          >
            Shortcuts (?)
          </button>
        </div>
        <div className="flex-1 relative">
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
          <KeyboardHint
            shortcuts={[
              {
                keys: ['Ctrl', 'K'],
                description: 'Command palette',
                category: 'Navigation',
              },
              {
                keys: ['Ctrl', 'Enter'],
                description: 'Send message',
                category: 'Actions',
              },
              { keys: ['Esc'], description: 'Close', category: 'Navigation' },
            ]}
            visible={showShortcuts}
            onClose={() => setShowShortcuts(false)}
            position="center"
          />
        </div>
      </div>
    )
  },
}

export const ChatWithSuggestions: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [showSuggestions, setShowSuggestions] = useState(true)

    const handleSendMessage = (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setMessages([...messages, userMessage])
      setShowSuggestions(false)
    }

    const handleSuggestion = (suggestion: any) => {
      handleSendMessage(suggestion.title)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="flex-1">
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
        </div>
        {showSuggestions && messages.length === 0 && (
          <div className="border-t p-4 bg-muted/50">
            <FollowUpSuggestions
              suggestions={[
                {
                  id: '1',
                  title: 'Examples/CompositeExamples',
                  description: 'Learn about React fundamentals',
                },
                {
                  id: '2',
                  title: 'Examples/CompositeExamples',
                  description: 'TypeScript code examples',
                },
                {
                  id: '3',
                  title: 'Examples/CompositeExamples',
                  description: 'Understanding React hooks',
                },
              ]}
              onSelect={handleSuggestion}
            />
          </div>
        )}
      </div>
    )
  },
}

export const DashboardView: StoryObj = {
  render: () => {
    return (
      <div className="h-screen p-6 space-y-6 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold mb-4">Usage Dashboard</h1>
          <UsageDashboard
            usage={{
              totalMessages: 1234,
              totalTokens: 45678,
              totalCost: 12.34,
              period: 'last-30-days',
            }}
            trends={{
              messages: { current: 1234, previous: 1000, change: 23.4 },
              tokens: { current: 45678, previous: 40000, change: 14.2 },
              cost: { current: 12.34, previous: 10.0, change: 23.4 },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Activity feed would go here...
            </p>
          </div>
        </div>
      </div>
    )
  },
}

export const ResponsiveLayout: StoryObj = {
  render: () => {
    const [messages, setMessages] = useState<Message[]>([])

    return (
      <div className="h-screen flex flex-col md:flex-row">
        <div className="hidden md:block w-64 border-r p-4">
          <h3 className="font-semibold mb-4">Sidebar</h3>
          <ul className="space-y-2 text-sm">
            <li>Conversations</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>
        <div className="flex-1 flex flex-col">
          <ChatWindow
            messages={messages}
            onSendMessage={(content) => {
              const msg: Message = {
                id: Date.now().toString(),
                role: 'user',
                content,
                timestamp: Date.now(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
              }
              setMessages([...messages, msg])
            }}
          />
        </div>
      </div>
    )
  },
}
