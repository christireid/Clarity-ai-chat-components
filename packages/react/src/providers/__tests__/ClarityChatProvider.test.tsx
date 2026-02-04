import * as React from 'react'
import { render, screen, act, renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  ClarityChatProvider,
  useClarityChat,
  useIsConnected,
  useChatMessages,
  useChatStreamStatus,
  useChatTools,
  useChatThinking,
  useChatActions,
  useChatEvents,
  useChatEvent,
  type ChatMessage,
  type ChatAdapter,
  type StreamStatus,
  type ToolExecution,
  type MessageAttachment,
} from '../ClarityChatProvider'

// ============================================================================
// Mock Adapter
// ============================================================================

const createMockAdapter = (): ChatAdapter => {
  const state = {
    messages: [] as ChatMessage[],
    streamStatus: {
      isStreaming: false,
      phase: 'idle' as const,
      progress: 0,
      tokensUsed: 0,
    },
    activeTools: [] as ToolExecution[],
    thinkingSteps: [] as any[],
  }

  const subscribers = new Set<() => void>()

  const notify = () => {
    subscribers.forEach((cb) => cb())
  }

  return {
    sendMessage: vi.fn(async (content: string) => {
      state.messages = [
        ...state.messages,
        {
          id: `msg-${Date.now()}`,
          role: 'user',
          content,
          createdAt: new Date(),
          status: 'complete',
        },
      ]
      notify()
    }),
    stopGeneration: vi.fn(() => {
      state.streamStatus = { ...state.streamStatus, isStreaming: false, phase: 'idle' }
      notify()
    }),
    regenerate: vi.fn(async () => {
      notify()
    }),
    approveTool: vi.fn(async () => {
      notify()
    }),
    rejectTool: vi.fn(async () => {
      notify()
    }),
    getMessages: () => state.messages,
    getStreamStatus: () => state.streamStatus,
    getActiveTools: () => state.activeTools,
    getThinkingSteps: () => state.thinkingSteps,
    subscribe: (callback: () => void) => {
      subscribers.add(callback)
      return () => subscribers.delete(callback)
    },
  }
}

// ============================================================================
// Tests
// ============================================================================

describe('ClarityChatProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render children', () => {
      render(
        <ClarityChatProvider>
          <div data-testid="child">Hello</div>
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('should use mock adapter when none provided', () => {
      render(
        <ClarityChatProvider>
          <div>Content</div>
        </ClarityChatProvider>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should accept initial configuration', () => {
      function TestComponent() {
        const { config } = useClarityChat()
        return <div data-testid="model">{config.model}</div>
      }

      render(
        <ClarityChatProvider config={{ model: 'claude-3-sonnet' }}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('model')).toHaveTextContent('claude-3-sonnet')
    })

    it('should accept initial messages', () => {
      const initialMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date(),
          status: 'complete',
        },
      ]

      function TestComponent() {
        const { messages } = useClarityChat()
        return <div data-testid="count">{messages.length}</div>
      }

      render(
        <ClarityChatProvider initialMessages={initialMessages}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })
  })

  describe('context value access', () => {
    it('should provide all context values', () => {
      function TestComponent() {
        const context = useClarityChat()

        return (
          <div>
            <div data-testid="has-messages">{context.messages ? 'yes' : 'no'}</div>
            <div data-testid="has-status">{context.streamStatus ? 'yes' : 'no'}</div>
            <div data-testid="has-tools">{context.activeTools ? 'yes' : 'no'}</div>
            <div data-testid="has-send">{typeof context.sendMessage === 'function' ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('has-messages')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-status')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-tools')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-send')).toHaveTextContent('yes')
    })

    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      function TestComponent() {
        useClarityChat()
        return <div>Should not render</div>
      }

      expect(() => render(<TestComponent />)).toThrow(
        'useClarityChat must be used within a ClarityChatProvider'
      )

      consoleSpy.mockRestore()
    })

    it('useIsConnected should return true inside provider', () => {
      function TestComponent() {
        const connected = useIsConnected()
        return <div data-testid="connected">{connected ? 'yes' : 'no'}</div>
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('connected')).toHaveTextContent('yes')
    })

    it('useIsConnected should return false outside provider', () => {
      function TestComponent() {
        const connected = useIsConnected()
        return <div data-testid="connected">{connected ? 'yes' : 'no'}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('connected')).toHaveTextContent('no')
    })
  })

  describe('message operations', () => {
    it('should send message and update state', async () => {
      const adapter = createMockAdapter()

      function TestComponent() {
        const { messages, sendMessage } = useClarityChat()
        const [loading, setLoading] = React.useState(false)

        const handleSend = async () => {
          setLoading(true)
          try {
            await sendMessage('Test message')
          } finally {
            setLoading(false)
          }
        }

        return (
          <div>
            <div data-testid="count">{messages.length}</div>
            <button onClick={handleSend} data-testid="send">
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('count')).toHaveTextContent('0')

      await act(async () => {
        screen.getByTestId('send').click()
        await waitFor(() => {
          expect(screen.getByTestId('send')).toHaveTextContent('Send')
        })
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      })
    })

    it('should clear messages', () => {
      const initialMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date(),
          status: 'complete',
        },
      ]

      function TestComponent() {
        const { messages, clearMessages } = useClarityChat()

        return (
          <div>
            <div data-testid="count">{messages.length}</div>
            <button onClick={clearMessages} data-testid="clear">
              Clear
            </button>
          </div>
        )
      }

      render(
        <ClarityChatProvider initialMessages={initialMessages}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('count')).toHaveTextContent('1')

      act(() => {
        screen.getByTestId('clear').click()
      })

      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })

    it('should get last message', () => {
      const initialMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'First',
          createdAt: new Date(),
          status: 'complete',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Second',
          createdAt: new Date(),
          status: 'complete',
        },
      ]

      function TestComponent() {
        const { lastMessage } = useClarityChat()
        return <div data-testid="last">{lastMessage?.content}</div>
      }

      render(
        <ClarityChatProvider initialMessages={initialMessages}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('last')).toHaveTextContent('Second')
    })

    it('should get streaming message', () => {
      const initialMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'Streaming...',
          createdAt: new Date(),
          status: 'streaming',
        },
      ]

      function TestComponent() {
        const { streamingMessage } = useClarityChat()
        return <div data-testid="streaming">{streamingMessage?.content}</div>
      }

      render(
        <ClarityChatProvider initialMessages={initialMessages}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('streaming')).toHaveTextContent('Streaming...')
    })

    it('should handle message attachments', async () => {
      const adapter = createMockAdapter()

      function TestComponent() {
        const { sendMessage } = useClarityChat()

        const handleSendWithAttachment = async () => {
          const attachment: MessageAttachment = {
            id: 'att-1',
            name: 'test.pdf',
            type: 'application/pdf',
            size: 1024,
          }
          await sendMessage('Check this file', [attachment])
        }

        return (
          <button onClick={handleSendWithAttachment} data-testid="send-with-file">
            Send with File
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('send-with-file').click()
        await waitFor(() => {})
      })

      expect(adapter.sendMessage).toHaveBeenCalled()
    })

    it('should call onMessagesChange callback', async () => {
      const onMessagesChange = vi.fn()
      const adapter = createMockAdapter()

      function TestComponent() {
        const { sendMessage } = useClarityChat()

        return (
          <button onClick={() => sendMessage('Test')} data-testid="send">
            Send
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter} onMessagesChange={onMessagesChange}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('send').click()
        await waitFor(() => {})
      })

      expect(onMessagesChange).toHaveBeenCalled()
    })
  })

  describe('streaming behavior', () => {
    it('should track streaming status', () => {
      function TestComponent() {
        const { streamStatus, isStreaming } = useClarityChat()
        return (
          <div>
            <div data-testid="streaming">{isStreaming ? 'yes' : 'no'}</div>
            <div data-testid="phase">{streamStatus.phase}</div>
            <div data-testid="progress">{streamStatus.progress}</div>
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('streaming')).toHaveTextContent('no')
      expect(screen.getByTestId('phase')).toHaveTextContent('idle')
      expect(screen.getByTestId('progress')).toHaveTextContent('0')
    })

    it('should provide useChatStreamStatus hook', () => {
      function TestComponent() {
        const { streamStatus, isStreaming } = useChatStreamStatus()
        return (
          <div>
            <div data-testid="streaming">{isStreaming ? 'yes' : 'no'}</div>
            <div data-testid="phase">{streamStatus.phase}</div>
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('streaming')).toHaveTextContent('no')
    })

    it('should stop generation', () => {
      const adapter = createMockAdapter()

      function TestComponent() {
        const { stopGeneration } = useClarityChat()

        return (
          <button onClick={stopGeneration} data-testid="stop">
            Stop
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('stop').click()
      })

      expect(adapter.stopGeneration).toHaveBeenCalled()
    })
  })

  describe('event emission', () => {
    it('should emit message:sending event', async () => {
      const adapter = createMockAdapter()
      const eventHandler = vi.fn()

      function TestComponent() {
        const { sendMessage, on } = useClarityChat()

        React.useEffect(() => {
          return on('message:sending', eventHandler)
        }, [on])

        return (
          <button onClick={() => sendMessage('Test')} data-testid="send">
            Send
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('send').click()
        await waitFor(() => {
          expect(eventHandler).toHaveBeenCalled()
        })
      })
    })

    it('should provide event system via useChatEvents hook', () => {
      function TestComponent() {
        const { emit, on } = useChatEvents()
        const handler = vi.fn()

        React.useEffect(() => {
          return on('message:sent', handler)
        }, [on])

        return (
          <button
            onClick={() => emit('message:sent', { content: 'test' })}
            data-testid="emit"
          >
            Emit
          </button>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('emit').click()
      })
    })

    it('should allow subscribing to specific events via useChatEvent', () => {
      const eventHandler = vi.fn()

      function TestComponent() {
        useChatEvent('message:sent', eventHandler)
        const { emit } = useChatEvents()

        return (
          <button onClick={() => emit('message:sent', {})} data-testid="emit">
            Emit
          </button>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('emit').click()
      })

      expect(eventHandler).toHaveBeenCalled()
    })

    it('should allow unsubscribing from events', () => {
      const eventHandler = vi.fn()

      function TestComponent() {
        const { on, emit } = useClarityChat()
        const [unsubscribe, setUnsubscribe] = React.useState<() => void | null>(null)

        const handleSubscribe = () => {
          const unsub = on('message:sent', eventHandler)
          setUnsubscribe(() => unsub)
        }

        const handleEmit = () => {
          emit('message:sent', {})
        }

        const handleUnsubscribe = () => {
          unsubscribe?.()
        }

        return (
          <div>
            <button onClick={handleSubscribe} data-testid="subscribe">
              Subscribe
            </button>
            <button onClick={handleEmit} data-testid="emit">
              Emit
            </button>
            <button onClick={handleUnsubscribe} data-testid="unsubscribe">
              Unsubscribe
            </button>
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('subscribe').click()
        screen.getByTestId('emit').click()
      })

      expect(eventHandler).toHaveBeenCalledTimes(1)

      act(() => {
        screen.getByTestId('unsubscribe').click()
        screen.getByTestId('emit').click()
      })

      // Should still be 1 call, not 2
      expect(eventHandler).toHaveBeenCalledTimes(1)
    })

    it('should emit tool-related events', () => {
      const adapter = createMockAdapter()
      const eventHandler = vi.fn()

      function TestComponent() {
        const { approveTool, on } = useClarityChat()

        React.useEffect(() => {
          return on('tool:approved', eventHandler)
        }, [on])

        return (
          <button onClick={() => approveTool('tool-123')} data-testid="approve">
            Approve
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('approve').click()
      })

      expect(eventHandler).toHaveBeenCalled()
    })
  })

  describe('adapter integration', () => {
    it('should accept external adapter', () => {
      const adapter = createMockAdapter()

      function TestComponent() {
        const { adapter: contextAdapter } = useClarityChat()
        return <div data-testid="has-adapter">{contextAdapter ? 'yes' : 'no'}</div>
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('has-adapter')).toHaveTextContent('yes')
    })

    it('should sync with adapter state', async () => {
      const adapter = createMockAdapter()

      function TestComponent() {
        const { messages } = useClarityChat()
        return <div data-testid="count">{messages.length}</div>
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        await adapter.sendMessage('Test message')
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      })
    })

    it('should update config via adapter', () => {
      const adapter = {
        ...createMockAdapter(),
        setConfig: vi.fn(),
      }

      function TestComponent() {
        const { updateConfig, config } = useClarityChat()

        return (
          <div>
            <div data-testid="model">{config.model}</div>
            <button
              onClick={() => updateConfig({ model: 'gpt-4' })}
              data-testid="update-config"
            >
              Update
            </button>
          </div>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('update-config').click()
      })

      expect(adapter.setConfig).toHaveBeenCalled()
    })

    it('should handle tool approval via adapter', async () => {
      const adapter = {
        ...createMockAdapter(),
        approveTool: vi.fn(),
      }

      function TestComponent() {
        const { approveTool } = useClarityChat()

        return (
          <button onClick={() => approveTool('tool-1')} data-testid="approve">
            Approve
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('approve').click()
        await waitFor(() => {})
      })

      expect(adapter.approveTool).toHaveBeenCalledWith('tool-1')
    })

    it('should handle tool rejection via adapter', async () => {
      const adapter = {
        ...createMockAdapter(),
        rejectTool: vi.fn(),
      }

      function TestComponent() {
        const { rejectTool } = useClarityChat()

        return (
          <button
            onClick={() => rejectTool('tool-1', 'Not safe')}
            data-testid="reject"
          >
            Reject
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('reject').click()
        await waitFor(() => {})
      })

      expect(adapter.rejectTool).toHaveBeenCalledWith('tool-1', 'Not safe')
    })
  })

  describe('tool operations', () => {
    it('should provide useChatTools hook', () => {
      function TestComponent() {
        const { activeTools, pendingApprovals, approveTool, rejectTool } = useChatTools()

        return (
          <div>
            <div data-testid="active">{activeTools.length}</div>
            <div data-testid="pending">{pendingApprovals.length}</div>
            <div data-testid="has-actions">
              {typeof approveTool === 'function' && typeof rejectTool === 'function'
                ? 'yes'
                : 'no'}
            </div>
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('active')).toHaveTextContent('0')
      expect(screen.getByTestId('pending')).toHaveTextContent('0')
      expect(screen.getByTestId('has-actions')).toHaveTextContent('yes')
    })
  })

  describe('thinking operations', () => {
    it('should provide useChatThinking hook', () => {
      function TestComponent() {
        const { thinkingSteps, isThinking } = useChatThinking()

        return (
          <div>
            <div data-testid="steps">{thinkingSteps.length}</div>
            <div data-testid="is-thinking">{isThinking ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('steps')).toHaveTextContent('0')
      expect(screen.getByTestId('is-thinking')).toHaveTextContent('no')
    })

    it('should track thinking state', () => {
      const initialMessages: ChatMessage[] = []

      function TestComponent() {
        const { isThinking } = useClarityChat()
        return <div data-testid="thinking">{isThinking ? 'yes' : 'no'}</div>
      }

      render(
        <ClarityChatProvider initialMessages={initialMessages}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('thinking')).toHaveTextContent('no')
    })
  })

  describe('chat actions hook', () => {
    it('should provide useChatActions hook', () => {
      function TestComponent() {
        const { sendMessage, stopGeneration, regenerate, clearMessages } = useChatActions()

        return (
          <div data-testid="has-actions">
            {typeof sendMessage === 'function' &&
            typeof stopGeneration === 'function' &&
            typeof regenerate === 'function' &&
            typeof clearMessages === 'function'
              ? 'yes'
              : 'no'}
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('has-actions')).toHaveTextContent('yes')
    })
  })

  describe('useChatMessages hook', () => {
    it('should select message-related state', () => {
      const initialMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date(),
          status: 'complete',
        },
      ]

      function TestComponent() {
        const { messages, lastMessage, streamingMessage } = useChatMessages()

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="last">{lastMessage?.content}</div>
            <div data-testid="streaming">{streamingMessage ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <ClarityChatProvider initialMessages={initialMessages}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('messages')).toHaveTextContent('1')
      expect(screen.getByTestId('last')).toHaveTextContent('Hello')
      expect(screen.getByTestId('streaming')).toHaveTextContent('no')
    })
  })

  describe('error handling', () => {
    it('should call onError callback on send error', async () => {
      const onError = vi.fn()
      const adapter = {
        ...createMockAdapter(),
        sendMessage: vi.fn(async () => {
          throw new Error('Send failed')
        }),
      }

      function TestComponent() {
        const { sendMessage } = useClarityChat()

        return (
          <button onClick={() => sendMessage('Test')} data-testid="send">
            Send
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter} onError={onError}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('send').click()
        await waitFor(() => {})
      })

      expect(onError).toHaveBeenCalled()
    })
  })

  describe('configuration management', () => {
    it('should update configuration', () => {
      function TestComponent() {
        const { config, updateConfig } = useClarityChat()

        return (
          <div>
            <div data-testid="model">{config.model || 'none'}</div>
            <button
              onClick={() => updateConfig({ model: 'gpt-4' })}
              data-testid="update"
            >
              Update
            </button>
          </div>
        )
      }

      render(
        <ClarityChatProvider config={{ model: 'claude' }}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('model')).toHaveTextContent('claude')

      act(() => {
        screen.getByTestId('update').click()
      })

      expect(screen.getByTestId('model')).toHaveTextContent('gpt-4')
    })

    it('should merge configuration updates', () => {
      function TestComponent() {
        const { config, updateConfig } = useClarityChat()

        return (
          <div>
            <div data-testid="model">{config.model}</div>
            <div data-testid="streaming">{config.streaming ? 'yes' : 'no'}</div>
            <button
              onClick={() => updateConfig({ model: 'gpt-4' })}
              data-testid="update"
            >
              Update
            </button>
          </div>
        )
      }

      render(
        <ClarityChatProvider config={{ model: 'claude', streaming: true }}>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('update').click()
      })

      expect(screen.getByTestId('model')).toHaveTextContent('gpt-4')
      expect(screen.getByTestId('streaming')).toHaveTextContent('yes')
    })
  })

  describe('edge cases', () => {
    it('should handle multiple subscribers', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      function TestComponent() {
        const { on, emit } = useClarityChat()

        React.useEffect(() => {
          const unsub1 = on('message:sent', handler1)
          const unsub2 = on('message:sent', handler2)

          return () => {
            unsub1()
            unsub2()
          }
        }, [on])

        return (
          <button onClick={() => emit('message:sent', {})} data-testid="emit">
            Emit
          </button>
        )
      }

      render(
        <ClarityChatProvider>
          <TestComponent />
        </ClarityChatProvider>
      )

      act(() => {
        screen.getByTestId('emit').click()
      })

      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should handle null messages gracefully', () => {
      function TestComponent() {
        const { lastMessage, streamingMessage } = useClarityChat()

        return (
          <div>
            <div data-testid="last">{lastMessage ? 'has' : 'none'}</div>
            <div data-testid="streaming">{streamingMessage ? 'has' : 'none'}</div>
          </div>
        )
      }

      render(
        <ClarityChatProvider initialMessages={[]}>
          <TestComponent />
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('last')).toHaveTextContent('none')
      expect(screen.getByTestId('streaming')).toHaveTextContent('none')
    })

    it('should regenerate message', async () => {
      const adapter = createMockAdapter()

      function TestComponent() {
        const { regenerate } = useClarityChat()

        return (
          <button onClick={() => regenerate('msg-1')} data-testid="regenerate">
            Regenerate
          </button>
        )
      }

      render(
        <ClarityChatProvider adapter={adapter}>
          <TestComponent />
        </ClarityChatProvider>
      )

      await act(async () => {
        screen.getByTestId('regenerate').click()
        await waitFor(() => {})
      })

      expect(adapter.regenerate).toHaveBeenCalledWith('msg-1')
    })
  })
})
