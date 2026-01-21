/**
 * Complete Chat Workflow E2E Tests
 *
 * Tests complete end-to-end chat experiences from initialization to complex interactions,
 * including all features working together: rate limiting, sync, templates, etc.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, useEffect } from 'react'
import {
  ClarityChat,
  useChatSync,
  PromptLibrary,
  TemplateMarketplace,
  ChatSyncStatus
} from '@clarity-chat/react'
import type {
  Message,
  PromptTemplate,
  SharedTemplate
} from '@clarity-chat/react'

// Mock API that simulates real chat behavior with rate limiting
class MockChatAPI {
  private messageCount = 0
  private rateLimitHit = false
  private rateLimitResetTime: number | null = null
  private conversations = new Map<string, Message[]>()

  constructor(
    private rateLimitAfter: number = 5,
    private resetDelay: number = 10000
  ) {}

  async sendMessage(
    conversationId: string,
    message: string,
    history: Message[] = []
  ): Promise<{ content: string; role: 'assistant'; metadata?: any }> {
    this.messageCount++

    // Check rate limit
    if (this.rateLimitHit) {
      if (this.rateLimitResetTime && Date.now() >= this.rateLimitResetTime) {
        this.rateLimitHit = false
        this.rateLimitResetTime = null
        this.messageCount = 1
      } else {
        throw new Error('Rate limit exceeded')
      }
    }

    if (this.messageCount >= this.rateLimitAfter) {
      this.rateLimitHit = true
      this.rateLimitResetTime = Date.now() + this.resetDelay
      throw new Error('Rate limit exceeded')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // Store conversation
    const conversation = this.conversations.get(conversationId) || []
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    }
    conversation.push(userMessage)
    this.conversations.set(conversationId, conversation)

    // Generate contextual response
    let response = `I received: "${message}"`

    if (message.toLowerCase().includes('hello')) {
      response = "Hello! How can I help you today?"
    } else if (message.toLowerCase().includes('code')) {
      response = "I'd be happy to help with coding! What language or framework are you working with?"
    } else if (message.toLowerCase().includes('template')) {
      response = "Templates are a great way to standardize responses. Would you like me to show you some examples?"
    } else if (history.length > 0) {
      response += ` (This is message ${conversation.length} in our conversation)`
    }

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: response,
      timestamp: Date.now() + 100,
    }
    conversation.push(assistantMessage)

    return {
      role: 'assistant',
      content: response,
      metadata: {
        conversationLength: conversation.length,
        processingTime: 200,
      }
    }
  }

  getConversation(conversationId: string): Message[] {
    return this.conversations.get(conversationId) || []
  }

  reset() {
    this.messageCount = 0
    this.rateLimitHit = false
    this.rateLimitResetTime = null
    this.conversations.clear()
  }
}

// Mock API instance
let mockAPI: MockChatAPI

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockAPI = new MockChatAPI()
  mockFetch.mockImplementation(async (url: string, options?: any) => {
    if (url.includes('/api/chat')) {
      const body = JSON.parse(options?.body || '{}')
      const conversationId = body.conversationId || 'default'
      const message = body.messages?.[body.messages.length - 1]?.content || ''

      try {
        const response = await mockAPI.sendMessage(conversationId, message, body.messages)
        return {
          ok: true,
          json: () => Promise.resolve(response),
        }
      } catch (error: any) {
        return {
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: error.message }),
        }
      }
    }

    return { ok: false, status: 404 }
  })
})

afterEach(() => {
  mockAPI.reset()
  vi.clearAllMocks()
})

// Complete chat application component for E2E testing
function CompleteChatApp({
  enableRateLimiting = true,
  enableSync = true,
  enableTemplates = true,
  conversationId = 'e2e-test-conversation'
}: {
  enableRateLimiting?: boolean
  enableSync?: boolean
  enableTemplates?: boolean
  conversationId?: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null)

  // Sync setup
  const sync = useChatSync(
    messages,
    setMessages,
    enableSync ? {
      conversationId,
      apiEndpoint: '/api/sync',
      enableRealtime: false,
      syncInterval: 2000,
    } : undefined
  )

  // Template library
  const sampleTemplates: PromptTemplate[] = [
    {
      id: 'code-review',
      name: 'Code Review Assistant',
      description: 'Helps review code for bugs and improvements',
      content: 'Please review this code:\n\n```\n{{code}}\n```\n\nFocus on:\n- Bugs and errors\n- Performance issues\n- Code style and best practices\n- Security concerns',
      variables: ['code'],
      category: 'development',
      tags: ['code', 'review', 'programming'],
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'writing-assistant',
      name: 'Writing Assistant',
      description: 'Helps with creative and technical writing',
      content: 'Please help me improve this text:\n\n{{text}}\n\nSuggestions for:\n- Clarity and conciseness\n- Grammar and style\n- Structure and flow\n- Engagement and impact',
      variables: ['text'],
      category: 'writing',
      tags: ['writing', 'editing', 'content'],
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Complete Chat Experience</h1>
        <p className="text-muted-foreground">
          Full-featured chat with rate limiting, sync, and templates
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sync Status */}
          {enableSync && (
            <ChatSyncStatus sync={sync} />
          )}

          {/* Current Template Display */}
          {currentTemplate && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Using Template: {currentTemplate.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTemplate.description}</p>
            </div>
          )}

          {/* Chat Interface */}
          <ClarityChat
            api="/api/chat"
            conversationId={conversationId}
            enableRateLimiting={enableRateLimiting}
            maxConcurrentRequests={2}
            maxQueueSize={5}
            showQueueStatus={true}
            enableStreaming={true}
            onMessageSend={(message) => {
              console.log('Message sent:', message)
            }}
            onError={(error) => {
              console.error('Chat error:', error)
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Template Library */}
          {enableTemplates && (
            <div>
              <h3 className="font-semibold mb-2">Templates</h3>
              <div className="space-y-2">
                {sampleTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setCurrentTemplate(template)}
                    className={`w-full p-3 text-left border rounded-lg hover:bg-muted ${
                      currentTemplate?.id === template.id ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Stats */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Conversation Stats</h3>
            <div className="space-y-1 text-sm">
              <div>Messages: {messages.length}</div>
              <div>API Calls: {mockAPI.getConversation(conversationId).length / 2}</div>
              {enableSync && (
                <>
                  <div>Pending Sync: {sync.status.pendingChanges}</div>
                  <div>Online: {sync.status.isOnline ? 'Yes' : 'No'}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

describe('Complete Chat Workflow E2E Tests', () => {
  describe('Basic Chat Experience', () => {
    it('completes full conversation workflow', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp />)

      // Initial state
      expect(screen.getByText('Complete Chat Experience')).toBeInTheDocument()

      // Send first message
      const chatInput = screen.getByRole('textbox')
      await user.type(chatInput, 'Hello!')

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      // Should receive response
      await waitFor(() => {
        expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument()
      })

      // Continue conversation
      await user.clear(chatInput)
      await user.type(chatInput, 'I need help with coding')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/coding.*language.*framework/)).toBeInTheDocument()
      })

      // Check conversation stats
      expect(screen.getByText('Messages: 4')).toBeInTheDocument() // 2 user + 2 assistant
    })

    it('handles template integration', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp enableTemplates={true} />)

      // Select template
      const templateButton = screen.getByRole('button', { name: /Code Review Assistant/i })
      await user.click(templateButton)

      // Template should be selected
      expect(screen.getByText('Using Template: Code Review Assistant')).toBeInTheDocument()

      // Send message with template context
      const chatInput = screen.getByRole('textbox')
      await user.type(chatInput, 'Please review my function')

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      // Should receive response
      await waitFor(() => {
        expect(screen.getByText(/received.*review.*function/)).toBeInTheDocument()
      })
    })

    it('manages conversation state correctly', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp conversationId="state-test" />)

      // Send multiple messages
      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      const messages = ['First message', 'Second message', 'Third message']

      for (const message of messages) {
        await user.clear(chatInput)
        await user.type(chatInput, message)
        await user.click(sendButton)

        // Wait for response
        await waitFor(() => {
          expect(screen.getByText(new RegExp(`received.*${message}`))).toBeInTheDocument()
        })
      }

      // Check final state
      const conversation = mockAPI.getConversation('state-test')
      expect(conversation.length).toBe(6) // 3 user + 3 assistant messages

      // Check UI stats
      expect(screen.getByText('Messages: 6')).toBeInTheDocument()
    })
  })

  describe('Rate Limiting Integration', () => {
    it('handles rate limiting gracefully in full workflow', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp enableRateLimiting={true} />)

      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      // Send messages up to rate limit
      for (let i = 1; i <= 5; i++) {
        await user.clear(chatInput)
        await user.type(chatInput, `Message ${i}`)
        await user.click(sendButton)

        if (i < 5) {
          await waitFor(() => {
            expect(screen.getByText(new RegExp(`received.*Message ${i}`))).toBeInTheDocument()
          })
        }
      }

      // 5th message should trigger rate limit
      await waitFor(() => {
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })

      // Try to send more messages - should be queued
      await user.clear(chatInput)
      await user.type(chatInput, 'Queued message 1')
      await user.click(sendButton)

      await user.clear(chatInput)
      await user.type(chatInput, 'Queued message 2')
      await user.click(sendButton)

      // Should show pending changes
      await waitFor(() => {
        expect(screen.getByText(/pending/i)).toBeInTheDocument()
      })

      // Wait for rate limit reset (mock API resets after 10 seconds)
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 11000))
      })

      // Queued messages should be processed
      await waitFor(() => {
        expect(screen.getByText(/received.*Queued message 1/)).toBeInTheDocument()
        expect(screen.getByText(/received.*Queued message 2/)).toBeInTheDocument()
      })
    })

    it('shows queue status during rate limiting', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp enableRateLimiting={true} />)

      // Trigger rate limiting
      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      // Send 5 messages quickly
      for (let i = 1; i <= 6; i++) {
        await user.clear(chatInput)
        await user.type(chatInput, `Quick message ${i}`)
        await user.click(sendButton)
        await new Promise(resolve => setTimeout(resolve, 50)) // Small delay
      }

      // Should show detailed queue status
      await waitFor(() => {
        expect(screen.getByText(/Sync Status/i)).toBeInTheDocument()
        expect(screen.getByText(/Last Sync/i)).toBeInTheDocument()
        expect(screen.getByText(/Pending Changes/i)).toBeInTheDocument()
      })

      // Should be able to clear queue
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await user.click(clearButton)

      // Queue should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/pending/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Synchronization Integration', () => {
    it('syncs conversations across sessions', async () => {
      const user = userEvent.setup()

      const { rerender } = render(<CompleteChatApp enableSync={true} conversationId="sync-test" />)

      // Send some messages
      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.clear(chatInput)
      await user.type(chatInput, 'First device message')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*First device message/)).toBeInTheDocument()
      })

      // Simulate second device/session
      rerender(<CompleteChatApp enableSync={true} conversationId="sync-test" key="device-2" />)

      // Second device should load synced messages
      await waitFor(() => {
        expect(screen.getByText('First device message')).toBeInTheDocument()
      })

      // Send message from second device
      await user.clear(chatInput)
      await user.type(chatInput, 'Second device message')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*Second device message/)).toBeInTheDocument()
      })

      // First device should see the update
      rerender(<CompleteChatApp enableSync={true} conversationId="sync-test" />)

      await waitFor(() => {
        expect(screen.getByText('Second device message')).toBeInTheDocument()
      })
    })

    it('handles offline/online transitions', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp enableSync={true} />)

      // Initially online
      expect(screen.getByText('Online: Yes')).toBeInTheDocument()

      // Go offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
      window.dispatchEvent(new Event('offline'))

      await waitFor(() => {
        expect(screen.getByText('Online: No')).toBeInTheDocument()
      })

      // Send message offline
      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.clear(chatInput)
      await user.type(chatInput, 'Offline message')
      await user.click(sendButton)

      // Message should appear locally
      await waitFor(() => {
        expect(screen.getByText('Offline message')).toBeInTheDocument()
      })

      // Should be queued for sync
      expect(screen.getByText('Pending Sync: 1')).toBeInTheDocument()

      // Come back online
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
      window.dispatchEvent(new Event('online'))

      await waitFor(() => {
        expect(screen.getByText('Online: Yes')).toBeInTheDocument()
      })

      // Wait for sync
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      // Message should be synced
      expect(screen.getByText('Pending Sync: 0')).toBeInTheDocument()
    })
  })

  describe('Template Integration Workflows', () => {
    it('integrates templates with chat conversation', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp enableTemplates={true} />)

      // Select code review template
      const templateButton = screen.getByRole('button', { name: /Code Review Assistant/i })
      await user.click(templateButton)

      expect(screen.getByText('Using Template: Code Review Assistant')).toBeInTheDocument()

      // Send message that should use template context
      const chatInput = screen.getByRole('textbox')
      await user.type(chatInput, 'function add(a, b) { return a + b; }')

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      // Should receive response with template-aware context
      await waitFor(() => {
        expect(screen.getByText(/received.*function add/)).toBeInTheDocument()
      })

      // Switch templates mid-conversation
      const writingTemplateButton = screen.getByRole('button', { name: /Writing Assistant/i })
      await user.click(writingTemplateButton)

      expect(screen.getByText('Using Template: Writing Assistant')).toBeInTheDocument()

      // Send another message with different template
      await user.clear(chatInput)
      await user.type(chatInput, 'Please improve this paragraph')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*improve.*paragraph/)).toBeInTheDocument()
      })
    })

    it('combines templates with rate limiting', async () => {
      const user = userEvent.setup()

      render(<CompleteChatApp enableRateLimiting={true} enableTemplates={true} />)

      // Select template
      const templateButton = screen.getByRole('button', { name: /Code Review Assistant/i })
      await user.click(templateButton)

      // Send multiple messages to trigger rate limiting
      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      for (let i = 1; i <= 6; i++) {
        await user.clear(chatInput)
        await user.type(chatInput, `Code review request ${i}`)
        await user.click(sendButton)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Should hit rate limit
      await waitFor(() => {
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })

      // Template selection should still work even when rate limited
      const writingTemplateButton = screen.getByRole('button', { name: /Writing Assistant/i })
      await user.click(writingTemplateButton)

      expect(screen.getByText('Using Template: Writing Assistant')).toBeInTheDocument()

      // After rate limit reset, should be able to send with new template
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 11000))
      })

      await user.clear(chatInput)
      await user.type(chatInput, 'Writing improvement request')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*Writing improvement request/)).toBeInTheDocument()
      })
    })
  })

  describe('Complex Multi-Feature Workflows', () => {
    it('handles complete workflow: template + sync + rate limiting', async () => {
      const user = userEvent.setup()

      render(
        <CompleteChatApp
          enableRateLimiting={true}
          enableSync={true}
          enableTemplates={true}
          conversationId="complex-workflow"
        />
      )

      // Phase 1: Template selection and initial conversation
      const templateButton = screen.getByRole('button', { name: /Code Review Assistant/i })
      await user.click(templateButton)

      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(chatInput, 'Review this JavaScript function')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*Review this JavaScript function/)).toBeInTheDocument()
      })

      // Phase 2: Continue conversation with different template
      const writingTemplateButton = screen.getByRole('button', { name: /Writing Assistant/i })
      await user.click(writingTemplateButton)

      await user.clear(chatInput)
      await user.type(chatInput, 'Help me write documentation for this code')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*write documentation/)).toBeInTheDocument()
      })

      // Phase 3: Trigger rate limiting
      for (let i = 3; i <= 7; i++) {
        await user.clear(chatInput)
        await user.type(chatInput, `Message ${i} in complex workflow`)
        await user.click(sendButton)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Should be rate limited
      await waitFor(() => {
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })

      // Phase 4: Test sync while rate limited
      expect(screen.getByText('Pending Sync: 2')).toBeInTheDocument() // 2 queued messages

      // Phase 5: Simulate second device
      const { rerender } = render(
        <CompleteChatApp
          enableRateLimiting={true}
          enableSync={true}
          enableTemplates={true}
          conversationId="complex-workflow"
          key="device-2"
        />
      )

      // Second device should load synced conversation
      await waitFor(() => {
        expect(screen.getByText('Review this JavaScript function')).toBeInTheDocument()
        expect(screen.getByText('Help me write documentation for this code')).toBeInTheDocument()
      })

      // Phase 6: Wait for rate limit reset and sync completion
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 12000))
      })

      // Both devices should show completed sync
      expect(screen.getByText('Pending Sync: 0')).toBeInTheDocument()
      expect(screen.getByText('Messages: 12')).toBeInTheDocument() // All messages synced

      // Phase 7: Continue conversation after reset
      await user.clear(chatInput)
      await user.type(chatInput, 'Final message in complex workflow')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*Final message/)).toBeInTheDocument()
      })
    })

    it('handles error recovery across all features', async () => {
      const user = userEvent.setup()

      // Start with network error simulation
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(
        <CompleteChatApp
          enableRateLimiting={true}
          enableSync={true}
          enableTemplates={true}
        />
      )

      // Try to send message during network error
      const chatInput = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(chatInput, 'Message during network error')
      await user.click(sendButton)

      // Should handle error gracefully
      await waitFor(() => {
        expect(screen.getByText(/Message during network error/)).toBeInTheDocument()
      })

      // Should show sync error
      expect(screen.getByText(/Sync Error/i)).toBeInTheDocument()

      // Restore network and continue
      mockFetch.mockImplementation(async (url: string, options?: any) => {
        if (url.includes('/api/chat')) {
          const body = JSON.parse(options?.body || '{}')
          const conversationId = body.conversationId || 'default'
          const message = body.messages?.[body.messages.length - 1]?.content || ''

          const response = await mockAPI.sendMessage(conversationId, message, body.messages)
          return {
            ok: true,
            json: () => Promise.resolve(response),
          }
        }
        return { ok: false, status: 404 }
      })

      // Send another message - should work now
      await user.clear(chatInput)
      await user.type(chatInput, 'Message after recovery')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByText(/received.*Message after recovery/)).toBeInTheDocument()
      })
    })
  })
})