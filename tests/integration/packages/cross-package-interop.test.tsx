/**
 * Cross-Package Interoperability Tests
 *
 * Tests that components and utilities from different packages work together seamlessly,
 * maintaining API contracts and type compatibility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import {
  // React package
  ClarityChat,
  ChatInput,
  MessageList,
  useClarityChat,
  // Primitives package
  Button,
  Card,
  Input,
  // Types package
  type Message,
  type UseChatOptions,
  // Utils package
  useLocalStorage,
  useRetryWithBackoff,
  // Memory package
  useMemoryContext,
  MemoryProvider,
  // Error handling package
  useErrorBoundary,
  ErrorBoundary,
} from '@clarity-chat/react'

// Mock implementations for testing
const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockImplementation(async () => ({
    ok: true,
    json: () => Promise.resolve({
      role: 'assistant',
      content: 'Mock response'
    })
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Cross-Package Interoperability', () => {
  describe('React + Primitives Integration', () => {
    it('integrates ChatInput with primitive Button', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      // Custom chat input using primitives
      function CustomChatInput({ onSubmit }: { onSubmit: (value: string) => void }) {
        const [value, setValue] = useState('')

        const handleSubmit = () => {
          if (value.trim()) {
            onSubmit(value.trim())
            setValue('')
          }
        }

        return (
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={!value.trim()}>
              Send
            </Button>
          </div>
        )
      }

      render(<CustomChatInput onSubmit={onSubmit} />)

      const input = screen.getByPlaceholderText('Type a message...')
      const button = screen.getByRole('button', { name: 'Send' })

      // Type message
      await user.type(input, 'Hello from primitives integration')

      // Button should be enabled
      expect(button).not.toBeDisabled()

      // Click send
      await user.click(button)

      // Should call onSubmit
      expect(onSubmit).toHaveBeenCalledWith('Hello from primitives integration')

      // Input should be cleared
      expect(input).toHaveValue('')
    })

    it('integrates ClarityChat with Card primitive', async () => {
      const user = userEvent.setup()

      render(
        <Card className="max-w-2xl">
          <Card.Header>
            <Card.Title>Chat with Card Wrapper</Card.Title>
          </Card.Header>
          <Card.Content>
            <ClarityChat api="/api/chat" />
          </Card.Content>
        </Card>
      )

      // Should render chat inside card
      expect(screen.getByText('Chat with Card Wrapper')).toBeInTheDocument()

      // Chat input should be present
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()

      // Send a message
      await user.type(input, 'Message in card wrapper')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should work normally
      await waitFor(() => {
        expect(screen.getByText('Mock response')).toBeInTheDocument()
      })
    })
  })

  describe('React + Memory Integration', () => {
    it('integrates chat with memory context', async () => {
      const user = userEvent.setup()

      function ChatWithMemory() {
        const { conversations, addConversation } = useMemoryContext()

        const handleSendMessage = async (content: string) => {
          const message: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: Date.now(),
          }

          // Add to memory
          addConversation({
            id: `conv-${Date.now()}`,
            title: `Conversation with: ${content.slice(0, 20)}...`,
            messages: [message],
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }

        return (
          <div>
            <div data-testid="conversation-count">
              Conversations: {conversations.length}
            </div>
            <ChatInput
              value=""
              onChange={() => {}}
              onSubmit={handleSendMessage}
            />
          </div>
        )
      }

      render(
        <MemoryProvider>
          <ChatWithMemory />
        </MemoryProvider>
      )

      // Initially no conversations
      expect(screen.getByTestId('conversation-count')).toHaveTextContent('Conversations: 0')

      // Send message
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message for memory')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should create conversation in memory
      await waitFor(() => {
        expect(screen.getByTestId('conversation-count')).toHaveTextContent('Conversations: 1')
      })
    })

    it('shares memory state across chat components', async () => {
      const user = userEvent.setup()

      function MultiChatWithSharedMemory() {
        const { conversations, addConversation } = useMemoryContext()

        const createConversation = (prefix: string) => {
          addConversation({
            id: `conv-${prefix}-${Date.now()}`,
            title: `${prefix} Conversation`,
            messages: [{
              id: `msg-${prefix}-${Date.now()}`,
              role: 'user',
              content: `${prefix} message`,
              timestamp: Date.now(),
            }],
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }

        return (
          <div className="space-y-4">
            <div data-testid="total-conversations">
              Total: {conversations.length}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3>Chat 1</h3>
                <button onClick={() => createConversation('Chat1')}>
                  Add to Chat 1
                </button>
              </div>

              <div>
                <h3>Chat 2</h3>
                <button onClick={() => createConversation('Chat2')}>
                  Add to Chat 2
                </button>
              </div>
            </div>
          </div>
        )
      }

      render(
        <MemoryProvider>
          <MultiChatWithSharedMemory />
        </MemoryProvider>
      )

      // Initially no conversations
      expect(screen.getByTestId('total-conversations')).toHaveTextContent('Total: 0')

      // Add conversation from first chat
      await user.click(screen.getByRole('button', { name: 'Add to Chat 1' }))

      await waitFor(() => {
        expect(screen.getByTestId('total-conversations')).toHaveTextContent('Total: 1')
      })

      // Add conversation from second chat
      await user.click(screen.getByRole('button', { name: 'Add to Chat 2' }))

      await waitFor(() => {
        expect(screen.getByTestId('total-conversations')).toHaveTextContent('Total: 2')
      })
    })
  })

  describe('React + Utils Integration', () => {
    it('integrates chat with local storage utils', async () => {
      const user = userEvent.setup()

      function ChatWithLocalStorage() {
        const [storedMessages, setStoredMessages] = useLocalStorage<Message[]>(
          'test-chat-messages',
          []
        )

        const addMessage = (content: string) => {
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: Date.now(),
          }
          setStoredMessages(prev => [...prev, newMessage])
        }

        return (
          <div>
            <div data-testid="stored-count">Stored: {storedMessages.length}</div>
            <ChatInput
              value=""
              onChange={() => {}}
              onSubmit={addMessage}
            />
            <div data-testid="messages">
              {storedMessages.map(msg => (
                <div key={msg.id}>{msg.content}</div>
              ))}
            </div>
          </div>
        )
      }

      render(<ChatWithLocalStorage />)

      // Initially empty
      expect(screen.getByTestId('stored-count')).toHaveTextContent('Stored: 0')

      // Add message
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message to store')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should be stored and displayed
      await waitFor(() => {
        expect(screen.getByTestId('stored-count')).toHaveTextContent('Stored: 1')
        expect(screen.getByText('Message to store')).toBeInTheDocument()
      })

      // Persists across re-renders (localStorage simulation)
      const { rerender } = render(<ChatWithLocalStorage />)

      await waitFor(() => {
        expect(screen.getByTestId('stored-count')).toHaveTextContent('Stored: 1')
        expect(screen.getByText('Message to store')).toBeInTheDocument()
      })
    })

    it('integrates chat with retry utility', async () => {
      const user = userEvent.setup()
      let attemptCount = 0

      // Mock API that fails twice then succeeds
      mockFetch.mockImplementation(async () => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error('Temporary failure')
        }
        return {
          ok: true,
          json: () => Promise.resolve({
            role: 'assistant',
            content: 'Success after retries'
          })
        }
      })

      function ChatWithRetry() {
        const [messages, setMessages] = useState<Message[]>([])

        const sendWithRetry = useRetryWithBackoff(
          async (content: string) => {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: [{ role: 'user', content }] })
            })

            if (!response.ok) {
              throw new Error('API Error')
            }

            return response.json()
          },
          { maxAttempts: 3, baseDelay: 100 }
        )

        const handleSend = async (content: string) => {
          try {
            const result = await sendWithRetry(content)
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: result.content,
              timestamp: Date.now(),
            }
            setMessages(prev => [...prev, assistantMessage])
          } catch (error) {
            const errorMessage: Message = {
              id: `error-${Date.now()}`,
              role: 'assistant',
              content: 'Failed after retries',
              timestamp: Date.now(),
            }
            setMessages(prev => [...prev, errorMessage])
          }
        }

        return (
          <div>
            <div data-testid="message-count">Messages: {messages.length}</div>
            <ChatInput
              value=""
              onChange={() => {}}
              onSubmit={handleSend}
            />
            <div data-testid="chat-messages">
              {messages.map(msg => (
                <div key={msg.id}>{msg.content}</div>
              ))}
            </div>
          </div>
        )
      }

      render(<ChatWithRetry />)

      // Send message that will fail initially but succeed after retries
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test retry functionality')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should eventually succeed
      await waitFor(() => {
        expect(screen.getByText('Success after retries')).toBeInTheDocument()
      }, { timeout: 2000 })

      expect(attemptCount).toBe(3) // Should have tried 3 times
    })
  })

  describe('React + Error Handling Integration', () => {
    it('integrates chat with error boundary', async () => {
      const user = userEvent.setup()

      // Component that throws an error
      function ErrorThrowingChat() {
        const [shouldError, setShouldError] = useState(false)

        if (shouldError) {
          throw new Error('Simulated chat error')
        }

        return (
          <div>
            <button onClick={() => setShouldError(true)}>
              Trigger Error
            </button>
            <ClarityChat api="/api/chat" />
          </div>
        )
      }

      function TestApp() {
        const { error, resetError } = useErrorBoundary()

        if (error) {
          return (
            <div data-testid="error-boundary">
              <div>Caught Error: {error.message}</div>
              <button onClick={resetError}>Reset</button>
            </div>
          )
        }

        return (
          <ErrorBoundary
            fallback={({ error, resetError }) => (
              <div data-testid="error-fallback">
                <div>Fallback: {error.message}</div>
                <button onClick={resetError}>Reset from Fallback</button>
              </div>
            )}
          >
            <ErrorThrowingChat />
          </ErrorBoundary>
        )
      }

      render(<TestApp />)

      // Initially normal
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      // Trigger error
      await user.click(screen.getByRole('button', { name: 'Trigger Error' }))

      // Should show error boundary
      await waitFor(() => {
        expect(screen.getByTestId('error-fallback')).toBeInTheDocument()
        expect(screen.getByText('Fallback: Simulated chat error')).toBeInTheDocument()
      })

      // Reset error
      await user.click(screen.getByRole('button', { name: 'Reset from Fallback' }))

      // Should return to normal
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument()
        expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument()
      })
    })

    it('handles API errors gracefully across components', async () => {
      const user = userEvent.setup()

      // Mock API error
      mockFetch.mockRejectedValue(new Error('API unavailable'))

      function ChatWithErrorHandling() {
        const { error, resetError } = useErrorBoundary()

        const handleError = (error: Error) => {
          console.error('Chat error:', error)
        }

        return (
          <div>
            {error && (
              <div data-testid="error-display">
                <div>Error: {error.message}</div>
                <button onClick={resetError}>Retry</button>
              </div>
            )}

            <ClarityChat
              api="/api/chat"
              onError={handleError}
            />
          </div>
        )
      }

      render(
        <ErrorBoundary>
          <ChatWithErrorHandling />
        </ErrorBoundary>
      )

      // Send message that will fail
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message that will fail')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should handle error gracefully
      await waitFor(() => {
        // Error should be logged but not crash the component
        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })
    })
  })

  describe('Multi-Package Type Compatibility', () => {
    it('maintains type compatibility across packages', () => {
      // Test that types from different packages work together
      const message: Message = {
        id: 'test-msg',
        role: 'user',
        content: 'Test message',
        timestamp: Date.now(),
        metadata: {
          source: 'test',
          tokens: 10,
        }
      }

      // Should be assignable to chat options
      const chatOptions: UseChatOptions = {
        api: '/api/chat',
        initialMessages: [message],
        onMessage: (msg) => {
          // Message should be compatible
          expect(msg.id).toBeDefined()
          expect(typeof msg.content).toBe('string')
        }
      }

      expect(chatOptions.initialMessages?.[0]).toEqual(message)
    })

    it('supports cross-package component composition', async () => {
      const user = userEvent.setup()

      // Component that combines elements from multiple packages
      function CrossPackageComposition() {
        const [messages, setMessages] = useState<Message[]>([])

        const handleSend = (content: string) => {
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: Date.now(),
          }
          setMessages(prev => [...prev, newMessage])
        }

        return (
          <Card className="max-w-lg">
            <Card.Header>
              <Card.Title>Cross-Package Chat</Card.Title>
            </Card.Header>
            <Card.Content>
              <div data-testid="message-list">
                {messages.map(msg => (
                  <div key={msg.id} className="mb-2 p-2 bg-muted rounded">
                    {msg.content}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <ChatInput
                  value=""
                  onChange={() => {}}
                  onSubmit={handleSend}
                  renderSendButton={(props) => (
                    <Button {...props} size="sm">
                      Send Message
                    </Button>
                  )}
                />
              </div>
            </Card.Content>
          </Card>
        )
      }

      render(<CrossPackageComposition />)

      // Send message using composed components
      const input = screen.getByRole('textbox')
      await user.type(input, 'Cross-package test message')

      const sendButton = screen.getByRole('button', { name: 'Send Message' })
      await user.click(sendButton)

      // Should work seamlessly
      await waitFor(() => {
        expect(screen.getByText('Cross-package test message')).toBeInTheDocument()
      })
    })
  })

  describe('Package API Contract Compliance', () => {
    it('respects published API contracts', () => {
      // Test that all expected exports are available and work as documented

      // React package exports
      expect(ClarityChat).toBeDefined()
      expect(ChatInput).toBeDefined()
      expect(useClarityChat).toBeDefined()

      // Primitives exports
      expect(Button).toBeDefined()
      expect(Card).toBeDefined()
      expect(Input).toBeDefined()

      // Utils exports
      expect(useLocalStorage).toBeDefined()
      expect(useRetryWithBackoff).toBeDefined()

      // Memory exports
      expect(MemoryProvider).toBeDefined()
      expect(useMemoryContext).toBeDefined()

      // Error handling exports
      expect(ErrorBoundary).toBeDefined()
      expect(useErrorBoundary).toBeDefined()

      // Type exports
      expect(Message).toBeDefined()
      expect(UseChatOptions).toBeDefined()
    })

    it('maintains backward compatibility', () => {
      // Test that existing usage patterns still work

      // Old ClarityChat usage should still work
      expect(() => {
        render(
          <ClarityChat
            api="/api/chat"
            initialMessages={[]}
            onMessage={() => {}}
          />
        )
      }).not.toThrow()

      // Old hook usage should still work
      const TestComponent = () => {
        const chat = useClarityChat({
          api: '/api/chat',
        })

        return <div>{chat.messages.length} messages</div>
      }

      expect(() => {
        render(<TestComponent />)
      }).not.toThrow()
    })

    it('supports optional peer dependencies', () => {
      // Test that components work with and without optional dependencies

      // Memory features should work when provider is present
      expect(() => {
        render(
          <MemoryProvider>
            <div>Test with memory</div>
          </MemoryProvider>
        )
      }).not.toThrow()

      // Should not require memory provider for basic functionality
      expect(() => {
        render(<ClarityChat api="/api/chat" />)
      }).not.toThrow()
    })
  })
})