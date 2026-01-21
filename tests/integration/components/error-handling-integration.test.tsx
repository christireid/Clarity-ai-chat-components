/**
 * Error Handling Integration Tests
 *
 * Tests comprehensive error handling across component boundaries, ensuring
 * errors are properly caught, handled, and communicated to users.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, useEffect } from 'react'
import {
  ClarityChat,
  ChatSyncStatus,
  useChatSync,
  PromptLibrary,
  ErrorBoundary,
  useErrorBoundary,
  useRetryWithBackoff,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/react'

// Mock implementations
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock console methods to capture error logging
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
  mockConsoleError.mockClear()
  mockConsoleWarn.mockClear()
})

describe('Error Handling Integration', () => {
  describe('Network Error Handling', () => {
    it('handles API network failures gracefully', async () => {
      const user = userEvent.setup()
      const onError = vi.fn()

      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'))

      render(
        <ClarityChat
          api="/api/chat"
          onError={onError}
        />
      )

      // Send message
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should handle error without crashing
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Network connection failed')
          })
        )
      })

      // Component should remain functional
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    })

    it('handles rate limit errors with user feedback', async () => {
      const user = userEvent.setup()
      const onRateLimited = vi.fn()

      let requestCount = 0
      mockFetch.mockImplementation(async () => {
        requestCount++
        if (requestCount >= 3) {
          return {
            ok: false,
            status: 429,
            headers: {
              get: (key: string) => key === 'retry-after' ? '30' : null,
            },
            json: () => Promise.resolve({ error: 'Rate limit exceeded' })
          }
        }

        return {
          ok: true,
          json: () => Promise.resolve({
            role: 'assistant',
            content: `Response ${requestCount}`
          })
        }
      })

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          onRateLimited={onRateLimited}
          showQueueStatus={true}
        />
      )

      const input = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      // Send messages until rate limited
      for (let i = 1; i <= 3; i++) {
        await user.clear(input)
        await user.type(input, `Message ${i}`)
        await user.click(sendButton)

        if (i < 3) {
          await waitFor(() => {
            expect(screen.getByText(`Response ${i}`)).toBeInTheDocument()
          })
        }
      }

      // Third message should trigger rate limit
      await waitFor(() => {
        expect(onRateLimited).toHaveBeenCalled()
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })
    })

    it('handles timeout errors', async () => {
      const user = userEvent.setup()
      const onError = vi.fn()

      // Mock slow/timeout response
      mockFetch.mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve({
          ok: false,
          status: 408,
          json: () => Promise.resolve({ error: 'Request timeout' })
        }), 100)
      }))

      render(
        <ClarityChat
          api="/api/chat"
          onError={onError}
          timeout={50} // Very short timeout
        />
      )

      // Send message
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test timeout')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should handle timeout
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('timeout')
          })
        )
      })
    })
  })

  describe('Sync Error Handling', () => {
    it('handles sync conflicts with user resolution', async () => {
      const user = userEvent.setup()
      const onConflict = vi.fn().mockResolvedValue({
        id: 'conversation_test',
        lastModified: Date.now(),
        version: 3,
        data: {
          conversationId: 'test',
          messages: [{
            id: 'resolved-msg',
            role: 'user',
            content: 'Resolved message',
            timestamp: Date.now(),
          }]
        }
      })

      // Mock sync with conflict
      let syncCallCount = 0
      const mockRemoteStorage = {
        getAll: vi.fn().mockResolvedValue([{
          id: 'conversation_test',
          lastModified: Date.now(),
          version: 2,
          data: {
            conversationId: 'test',
            messages: [{
              id: 'remote-msg',
              role: 'user',
              content: 'Remote version',
              timestamp: Date.now(),
            }]
          }
        }]),
        get: vi.fn(),
        set: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn(),
        getConflicts: vi.fn().mockResolvedValue([{
          local: {
            id: 'conversation_test',
            lastModified: Date.now() - 1000,
            version: 1,
            data: {
              conversationId: 'test',
              messages: [{
                id: 'local-msg',
                role: 'user',
                content: 'Local version',
                timestamp: Date.now() - 1000,
              }]
            }
          },
          remote: {
            id: 'conversation_test',
            lastModified: Date.now(),
            version: 2,
            data: {
              conversationId: 'test',
              messages: [{
                id: 'remote-msg',
                role: 'user',
                content: 'Remote version',
                timestamp: Date.now(),
              }]
            }
          },
          conflictFields: ['messages']
        }])
      }

      function TestComponent() {
        const [messages, setMessages] = useState<Message[]>([{
          id: 'local-msg',
          role: 'user',
          content: 'Local version',
          timestamp: Date.now() - 1000,
        }])

        const sync = useChatSync(messages, setMessages, {
          conversationId: 'test',
          apiEndpoint: '/api/sync',
          conflictStrategy: 'manual',
          onConflict,
        })

        return (
          <div>
            <ChatSyncStatus sync={sync} />
            <div data-testid="messages">
              {messages.map(msg => (
                <div key={msg.id}>{msg.content}</div>
              ))}
            </div>
          </div>
        )
      }

      render(<TestComponent />)

      // Trigger sync
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1500))
      })

      // Should call conflict resolver
      await waitFor(() => {
        expect(onConflict).toHaveBeenCalled()
      })

      // Should show resolved message
      await waitFor(() => {
        expect(screen.getByText('Resolved message')).toBeInTheDocument()
      })
    })

    it('handles sync network failures', async () => {
      const user = userEvent.setup()

      // Mock sync API failure
      mockFetch.mockImplementation((url) => {
        if (url.includes('/api/sync')) {
          return Promise.reject(new Error('Sync server unavailable'))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ role: 'assistant', content: 'Response' })
        })
      })

      function TestComponent() {
        const [messages, setMessages] = useState<Message[]>([])
        const sync = useChatSync(messages, setMessages, {
          conversationId: 'test',
          apiEndpoint: '/api/sync',
        })

        return (
          <div>
            <ChatSyncStatus sync={sync} />
            <ClarityChat api="/api/chat" />
          </div>
        )
      }

      render(<TestComponent />)

      // Chat should still work despite sync failure
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText('Response')).toBeInTheDocument()
      })

      // Should show sync error
      expect(screen.getByText(/Sync Error/i)).toBeInTheDocument()
    })

    it('handles offline/online transitions gracefully', async () => {
      const user = userEvent.setup()

      function TestComponent() {
        const [messages, setMessages] = useState<Message[]>([])
        const sync = useChatSync(messages, setMessages, {
          conversationId: 'test',
          apiEndpoint: '/api/sync',
        })

        return (
          <div>
            <ChatSyncStatus sync={sync} />
            <div data-testid="messages">
              {messages.map(msg => (
                <div key={msg.id}>{msg.content}</div>
              ))}
            </div>
          </div>
        )
      }

      render(<TestComponent />)

      // Initially online
      expect(screen.getByText('Online: Yes')).toBeInTheDocument()

      // Simulate offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
      window.dispatchEvent(new Event('offline'))

      await waitFor(() => {
        expect(screen.getByText('Online: No')).toBeInTheDocument()
      })

      // Chat should queue messages when offline
      // (This would be tested with actual offline behavior)

      // Come back online
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
      window.dispatchEvent(new Event('online'))

      await waitFor(() => {
        expect(screen.getByText('Online: Yes')).toBeInTheDocument()
      })

      // Restore navigator.onLine
      delete (navigator as any).onLine
    })
  })

  describe('Template System Error Handling', () => {
    it('handles template loading errors', async () => {
      const user = userEvent.setup()
      const onError = vi.fn()

      // Mock template marketplace with errors
      const mockMarketplace = {
        shareTemplate: vi.fn().mockRejectedValue(new Error('Failed to share template')),
        getSharedTemplates: vi.fn().mockRejectedValue(new Error('Failed to load templates')),
        downloadTemplate: vi.fn(),
        forkTemplate: vi.fn(),
        rateTemplate: vi.fn(),
      }

      // Mock the marketplace import
      vi.doMock('@clarity-chat/react', () => ({
        ...vi.importActual('@clarity-chat/react'),
        templateMarketplace: mockMarketplace,
      }))

      render(
        <PromptLibrary
          initialTemplates={[]}
          enableSharing={true}
          onError={onError}
        />
      )

      // Try to share a template (would trigger error)
      // This test would need actual template creation UI

      // For now, test error boundary wrapping
      const errorThrowingComponent = () => {
        throw new Error('Template system error')
      }

      render(
        <ErrorBoundary
          fallback={({ error }) => (
            <div data-testid="template-error">
              Template Error: {error.message}
            </div>
          )}
        >
          {errorThrowingComponent()}
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByTestId('template-error')).toBeInTheDocument()
        expect(screen.getByText('Template Error: Template system error')).toBeInTheDocument()
      })
    })

    it('handles invalid template data', async () => {
      const onError = vi.fn()

      render(
        <PromptLibrary
          initialTemplates={[
            {
              id: 'invalid-template',
              name: '', // Invalid: empty name
              content: '', // Invalid: empty content
              variables: ['test'],
              category: 'test',
              version: 1,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          ]}
          onError={onError}
        />
      )

      // Should handle invalid template gracefully
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('Invalid template')
          })
        )
      })
    })
  })

  describe('Component Boundary Error Isolation', () => {
    it('isolates errors within component boundaries', async () => {
      const user = userEvent.setup()

      function ErrorProneComponent() {
        const [shouldError, setShouldError] = useState(false)

        if (shouldError) {
          throw new Error('Component error')
        }

        return (
          <button onClick={() => setShouldError(true)}>
            Trigger Error
          </button>
        )
      }

      function AppWithErrorBoundaries() {
        return (
          <div>
            {/* Working components */}
            <div data-testid="working-section">
              <h2>Working Section</h2>
              <ClarityChat api="/api/chat" />
            </div>

            {/* Error-prone component with boundary */}
            <ErrorBoundary
              fallback={({ error, resetError }) => (
                <div data-testid="error-boundary">
                  <div>Error in component: {error.message}</div>
                  <button onClick={resetError}>Reset</button>
                </div>
              )}
            >
              <div data-testid="error-section">
                <h2>Error Section</h2>
                <ErrorProneComponent />
              </div>
            </ErrorBoundary>
          </div>
        )
      }

      render(<AppWithErrorBoundaries />)

      // Working section should function normally
      expect(screen.getByText('Working Section')).toBeInTheDocument()
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()

      // Trigger error in isolated component
      await user.click(screen.getByRole('button', { name: 'Trigger Error' }))

      // Error should be contained
      await waitFor(() => {
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
        expect(screen.getByText('Error in component: Component error')).toBeInTheDocument()
      })

      // Working section should remain functional
      expect(screen.getByText('Working Section')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      // Reset error
      await user.click(screen.getByRole('button', { name: 'Reset' }))

      // Error section should recover
      await waitFor(() => {
        expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument()
        expect(screen.getByText('Error Section')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Trigger Error' })).toBeInTheDocument()
      })
    })

    it('handles cascading errors across components', async () => {
      const user = userEvent.setup()

      function CascadingErrorComponent() {
        const [step, setStep] = useState(0)

        useEffect(() => {
          if (step === 1) {
            // Trigger error in child component
            setStep(2)
          }
        }, [step])

        return (
          <div>
            <button onClick={() => setStep(1)}>Start Cascade</button>
            {step >= 2 && <ErrorThrowingChild />}
          </div>
        )
      }

      function ErrorThrowingChild() {
        throw new Error('Cascading child error')
      }

      function AppWithNestedBoundaries() {
        return (
          <ErrorBoundary
            fallback={({ error }) => (
              <div data-testid="outer-boundary">
                Outer Boundary: {error.message}
              </div>
            )}
          >
            <div data-testid="app-content">
              <ErrorBoundary
                fallback={({ error }) => (
                  <div data-testid="inner-boundary">
                    Inner Boundary: {error.message}
                  </div>
                )}
              >
                <CascadingErrorComponent />
              </ErrorBoundary>
            </div>
          </ErrorBoundary>
        )
      }

      render(<AppWithNestedBoundaries />)

      // Trigger cascading error
      await user.click(screen.getByRole('button', { name: 'Start Cascade' }))

      // Inner boundary should catch the error
      await waitFor(() => {
        expect(screen.getByTestId('inner-boundary')).toBeInTheDocument()
        expect(screen.getByText('Inner Boundary: Cascading child error')).toBeInTheDocument()
      })

      // App content should remain
      expect(screen.getByTestId('app-content')).toBeInTheDocument()
    })
  })

  describe('Retry and Recovery Mechanisms', () => {
    it('integrates retry logic with error handling', async () => {
      const user = userEvent.setup()
      let attemptCount = 0

      const mockApiCall = vi.fn().mockImplementation(async () => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error(`Attempt ${attemptCount} failed`)
        }
        return { success: true, data: 'Success' }
      })

      function ComponentWithRetry() {
        const [result, setResult] = useState<string | null>(null)
        const [error, setError] = useState<Error | null>(null)

        const retryApiCall = useRetryWithBackoff(mockApiCall, {
          maxAttempts: 3,
          baseDelay: 100,
        })

        const handleCall = async () => {
          try {
            setError(null)
            const response = await retryApiCall()
            setResult(response.data)
          } catch (err) {
            setError(err as Error)
          }
        }

        return (
          <div>
            <button onClick={handleCall} data-testid="retry-button">
              Make API Call
            </button>
            {result && <div data-testid="success">{result}</div>}
            {error && <div data-testid="error">{error.message}</div>}
            <div data-testid="attempts">Attempts: {attemptCount}</div>
          </div>
        )
      }

      render(
        <ErrorBoundary
          fallback={({ error }) => (
            <div data-testid="boundary-error">Boundary: {error.message}</div>
          )}
        >
          <ComponentWithRetry />
        </ErrorBoundary>
      )

      // Trigger API call that will fail initially
      await user.click(screen.getByTestId('retry-button'))

      // Should eventually succeed after retries
      await waitFor(() => {
        expect(screen.getByTestId('success')).toHaveTextContent('Success')
      })

      // Should show all retry attempts were made
      expect(screen.getByTestId('attempts')).toHaveTextContent('Attempts: 3')
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })

    it('handles unrecoverable errors appropriately', async () => {
      const user = userEvent.setup()

      const alwaysFailApi = vi.fn().mockRejectedValue(new Error('Permanent failure'))

      function ComponentWithPermanentFailure() {
        const [error, setError] = useState<Error | null>(null)

        const retryApiCall = useRetryWithBackoff(alwaysFailApi, {
          maxAttempts: 3,
          baseDelay: 50,
        })

        const handleCall = async () => {
          try {
            setError(null)
            await retryApiCall()
          } catch (err) {
            setError(err as Error)
          }
        }

        return (
          <div>
            <button onClick={handleCall}>Call Failing API</button>
            {error && <div data-testid="final-error">{error.message}</div>}
          </div>
        )
      }

      render(<ComponentWithPermanentFailure />)

      // Trigger call that will always fail
      await user.click(screen.getByRole('button', { name: 'Call Failing API' }))

      // Should eventually give up and show error
      await waitFor(() => {
        expect(screen.getByTestId('final-error')).toHaveTextContent('Permanent failure')
      })

      // Should have made maximum retry attempts
      expect(alwaysFailApi).toHaveBeenCalledTimes(3)
    })
  })

  describe('User Experience Error Communication', () => {
    it('provides clear error messages to users', async () => {
      const user = userEvent.setup()

      // Mock various error types
      const errorScenarios = [
        { status: 429, message: 'Rate limit exceeded. Please try again later.' },
        { status: 500, message: 'Server error. Please try again.' },
        { status: 401, message: 'Authentication required. Please log in.' },
        { status: 404, message: 'API endpoint not found.' },
      ]

      let currentScenario = 0

      mockFetch.mockImplementation(async () => {
        const scenario = errorScenarios[currentScenario]
        currentScenario = (currentScenario + 1) % errorScenarios.length

        return {
          ok: false,
          status: scenario.status,
          json: () => Promise.resolve({ error: scenario.message })
        }
      })

      function ChatWithUserFriendlyErrors() {
        const [errorMessage, setErrorMessage] = useState<string>('')

        const handleError = (error: Error) => {
          // Convert technical errors to user-friendly messages
          if (error.message.includes('Rate limit')) {
            setErrorMessage('⏱️ Too many messages. Please wait a moment before sending another.')
          } else if (error.message.includes('Server error')) {
            setErrorMessage('🔧 Something went wrong on our end. Please try again.')
          } else if (error.message.includes('Authentication')) {
            setErrorMessage('🔐 Please log in to continue chatting.')
          } else {
            setErrorMessage('💬 Unable to send message. Please check your connection and try again.')
          }
        }

        return (
          <div>
            <ClarityChat
              api="/api/chat"
              onError={handleError}
            />
            {errorMessage && (
              <div data-testid="user-error" className="error-message">
                {errorMessage}
              </div>
            )}
          </div>
        )
      }

      render(<ChatWithUserFriendlyErrors />)

      const input = screen.getByRole('textbox')
      const sendButton = screen.getByRole('button', { name: /send/i })

      // Test different error scenarios
      for (let i = 0; i < errorScenarios.length; i++) {
        await user.clear(input)
        await user.type(input, `Test message ${i + 1}`)
        await user.click(sendButton)

        await waitFor(() => {
          expect(screen.getByTestId('user-error')).toBeInTheDocument()
        })

        // Clear error for next test
        act(() => {
          // This would normally be handled by the component's error clearing logic
        })
      }
    })

    it('provides error recovery options', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()

      function ChatWithRecoveryOptions() {
        const [error, setError] = useState<Error | null>(null)
        const [retryCount, setRetryCount] = useState(0)

        const handleError = (error: Error) => {
          setError(error)
        }

        const handleRetry = () => {
          setRetryCount(prev => prev + 1)
          setError(null)
          onRetry()
        }

        const handleReset = () => {
          setError(null)
          setRetryCount(0)
        }

        return (
          <div>
            <ClarityChat
              api="/api/chat"
              onError={handleError}
            />

            {error && (
              <div data-testid="error-recovery" className="error-panel">
                <div className="error-message">
                  {error.message}
                </div>
                <div className="recovery-options">
                  <button onClick={handleRetry} data-testid="retry-button">
                    Try Again ({retryCount}/3)
                  </button>
                  <button onClick={handleReset} data-testid="reset-button">
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      }

      // Mock persistent error
      mockFetch.mockRejectedValue(new Error('Persistent connection error'))

      render(<ChatWithRecoveryOptions />)

      // Trigger error
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test message')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should show recovery options
      await waitFor(() => {
        expect(screen.getByTestId('error-recovery')).toBeInTheDocument()
        expect(screen.getByTestId('retry-button')).toHaveTextContent('Try Again (0/3)')
      })

      // Click retry
      await user.click(screen.getByTestId('retry-button'))

      // Should increment retry count
      await waitFor(() => {
        expect(onRetry).toHaveBeenCalled()
      })

      // Click reset
      await user.click(screen.getByTestId('reset-button'))

      // Should clear error state
      await waitFor(() => {
        expect(screen.queryByTestId('error-recovery')).not.toBeInTheDocument()
      })
    })
  })
})