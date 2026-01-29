import * as React from 'react'
import { render, screen, act, waitFor, renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  ClarityChatProvider,
  useClarityChat,
  useChatMessages,
  useChatEvents,
  type ChatMessage,
  type ChatAdapter,
  type MessageAttachment,
} from '../ClarityChatProvider'
import {
  AgentExecutionProvider,
  useAgentExecution,
  useAgentPlan,
  useAgentTools,
  type PlanStep,
  type ToolCall,
} from '../AgentExecutionProvider'

// ============================================================================
// Mock Implementations
// ============================================================================

const createMockChatAdapter = (): ChatAdapter => {
  const state = {
    messages: [] as ChatMessage[],
    streamStatus: {
      isStreaming: false,
      phase: 'idle' as const,
      progress: 0,
      tokensUsed: 0,
    },
    activeTools: [] as any[],
    thinkingSteps: [] as any[],
  }

  const subscribers = new Set<() => void>()

  const notify = () => {
    subscribers.forEach((cb) => cb())
  }

  return {
    sendMessage: vi.fn(async (content: string) => {
      const id = String(Date.now())
      state.messages = [
        ...state.messages,
        {
          id: `msg-${id}`,
          role: 'user' as const,
          content,
          createdAt: new Date(),
          status: 'complete' as const,
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
// Combined Provider Tests
// ============================================================================

describe('ClarityChatProvider + AgentExecutionProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('dual provider setup', () => {
    it('should render both providers together', () => {
      render(
        <AgentExecutionProvider>
          <ClarityChatProvider>
            <div data-testid="content">Dual Providers Active</div>
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('content')).toBeInTheDocument()
    })

    it('should allow accessing both contexts simultaneously', () => {
      function DualContextComponent() {
        const chatContext = useClarityChat()
        const executionContext = useAgentExecution()

        return (
          <div>
            <div data-testid="chat-messages">{chatContext.messages.length}</div>
            <div data-testid="execution-status">{executionContext.status}</div>
            <div data-testid="chat-streaming">{chatContext.isStreaming ? 'streaming' : 'idle'}</div>
            <div data-testid="execution-progress">{executionContext.progress}</div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider>
            <DualContextComponent />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('chat-messages')).toHaveTextContent('0')
      expect(screen.getByTestId('execution-status')).toHaveTextContent('idle')
      expect(screen.getByTestId('chat-streaming')).toHaveTextContent('idle')
      expect(screen.getByTestId('execution-progress')).toHaveTextContent('0')
    })

    it('should support reversed provider nesting', () => {
      function DualContextComponent() {
        const chatContext = useClarityChat()
        const executionContext = useAgentExecution()

        return (
          <div data-testid="content">
            Both contexts accessible: {chatContext ? 'chat' : 'x'} {executionContext ? 'exec' : 'x'}
          </div>
        )
      }

      render(
        <ClarityChatProvider>
          <AgentExecutionProvider>
            <DualContextComponent />
          </AgentExecutionProvider>
        </ClarityChatProvider>
      )

      expect(screen.getByTestId('content')).toHaveTextContent('Both contexts accessible: chat exec')
    })

    it('should maintain state isolation between providers', async () => {
      const adapter = createMockChatAdapter()

      function StateComponent() {
        const { messages, sendMessage } = useClarityChat()
        const { plan, setPlan } = useAgentExecution()

        const handleSendMessage = async () => {
          await sendMessage('Test message')
        }

        const handleSetPlan = () => {
          setPlan([
            { id: 'step-1', title: 'Step 1', description: 'First step' },
            { id: 'step-2', title: 'Step 2', description: 'Second step' },
          ])
        }

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="plan-steps">{plan.length}</div>
            <button onClick={handleSendMessage} data-testid="send-msg">
              Send Message
            </button>
            <button onClick={handleSetPlan} data-testid="set-plan">
              Set Plan
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <StateComponent />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('messages')).toHaveTextContent('0')
      expect(screen.getByTestId('plan-steps')).toHaveTextContent('0')

      await act(async () => {
        screen.getByTestId('send-msg').click()
        await waitFor(() => {})
      })

      expect(screen.getByTestId('messages')).toHaveTextContent('1')
      expect(screen.getByTestId('plan-steps')).toHaveTextContent('0')

      act(() => {
        screen.getByTestId('set-plan').click()
      })

      expect(screen.getByTestId('messages')).toHaveTextContent('1')
      expect(screen.getByTestId('plan-steps')).toHaveTextContent('2')
    })
  })

  describe('event coordination', () => {
    it('should track message and execution events separately', async () => {
      const adapter = createMockChatAdapter()
      const chatEventHandler = vi.fn()
      const executionEventHandler = vi.fn()

      function EventTracker() {
        const { on, emit: chatEmit, sendMessage } = useClarityChat()
        const chatExecution = useAgentExecution()

        React.useEffect(() => {
          return on('message:sent', chatEventHandler)
        }, [on])

        React.useEffect(() => {
          return chatExecution.on('execution:started', executionEventHandler)
        }, [chatExecution])

        return (
          <div>
            <button
              onClick={async () => {
                await sendMessage('Test')
                chatExecution.startExecution('exec-1')
              }}
              data-testid="trigger"
            >
              Trigger Events
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <EventTracker />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      await act(async () => {
        screen.getByTestId('trigger').click()
        await waitFor(() => {
          expect(chatEventHandler).toHaveBeenCalled()
        })
      })

      expect(executionEventHandler).toHaveBeenCalled()
    })

    it('should emit coordinated events when tool operations span both providers', async () => {
      const adapter = createMockChatAdapter()
      const toolEventHandler = vi.fn()

      function CoordinatedToolHandler() {
        const chatContext = useClarityChat()
        const executionContext = useAgentExecution()

        React.useEffect(() => {
          return chatContext.on('tool:approved', toolEventHandler)
        }, [chatContext])

        const handleApproveTool = async () => {
          await chatContext.approveTool('tool-1')
          executionContext.approveTool('tool-1')
        }

        return (
          <button onClick={handleApproveTool} data-testid="approve-tool">
            Approve Tool
          </button>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <CoordinatedToolHandler />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      await act(async () => {
        screen.getByTestId('approve-tool').click()
        await waitFor(() => {})
      })

      expect(toolEventHandler).toHaveBeenCalled()
    })
  })

  describe('tool workflow integration', () => {
    it('should handle tool execution across both providers', async () => {
      function ToolWorkflow() {
        const { activeTools, pendingApprovals, approveTool } = useClarityChat()
        const { toolCalls, addToolCall, approveTool: execApproveTool } = useAgentExecution()

        const handleAddTool = () => {
          const toolId = addToolCall({
            name: 'calculator',
            description: 'Calculate something',
            input: { operation: 'add', a: 1, b: 2 },
            requiresApproval: true,
            approvalReason: 'User approval required',
          })
        }

        const handleApproveTool = () => {
          if (toolCalls.length > 0) {
            const toolId = toolCalls[0].id
            execApproveTool(toolId)
          }
        }

        return (
          <div>
            <div data-testid="tool-count">{toolCalls.length}</div>
            <div data-testid="pending-count">{pendingApprovals.length}</div>
            <button onClick={handleAddTool} data-testid="add-tool">
              Add Tool
            </button>
            <button onClick={handleApproveTool} data-testid="approve">
              Approve
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider>
            <ToolWorkflow />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('add-tool').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('tool-count')).toHaveTextContent('1')
      })

      act(() => {
        screen.getByTestId('approve').click()
      })

      await waitFor(() => {})
    })
  })

  describe('state synchronization', () => {
    it('should update both providers based on execution plan', async () => {
      function StateSyncComponent() {
        const { messages, sendMessage } = useClarityChat()
        const { plan, setPlan, startExecution, startStep, completeStep } = useAgentExecution()

        const handleExecute = async () => {
          setPlan([
            { id: 'step-1', title: 'Gather Info', description: 'Get information from user' },
            {
              id: 'step-2',
              title: 'Process',
              description: 'Process the information',
            },
          ])

          startExecution('exec-1')
          startStep('step-1')

          await new Promise((r) => setTimeout(r, 50))

          completeStep('step-1')
          await sendMessage('Step 1 completed')
        }

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="plan-steps">{plan.length}</div>
            <button onClick={handleExecute} data-testid="execute">
              Execute
            </button>
          </div>
        )
      }

      const adapter = createMockChatAdapter()

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <StateSyncComponent />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('execute').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('plan-steps')).toHaveTextContent('2')
      })

      await waitFor(() => {
        expect(screen.getByTestId('messages')).toHaveTextContent('1')
      })
    })

    it('should sync attachments with tool calls', async () => {
      function AttachmentToolSync() {
        const { messages, sendMessage } = useClarityChat()
        const { toolCalls, addToolCall } = useAgentExecution()

        const handleProcessFile = async () => {
          const attachment: MessageAttachment = {
            id: 'att-1',
            name: 'data.json',
            type: 'application/json',
            size: 2048,
          }

          addToolCall({
            name: 'process-file',
            description: 'Process uploaded file',
            input: { fileId: attachment.id, fileName: attachment.name },
            requiresApproval: false,
          })

          await sendMessage('Please analyze this file', [attachment])
        }

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="tools">{toolCalls.length}</div>
            <button onClick={handleProcessFile} data-testid="process">
              Process File
            </button>
          </div>
        )
      }

      const adapter = createMockChatAdapter()

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <AttachmentToolSync />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      await act(async () => {
        screen.getByTestId('process').click()
        await waitFor(() => {})
      })

      expect(screen.getByTestId('messages')).toHaveTextContent('1')
      expect(screen.getByTestId('tools')).toHaveTextContent('1')
    })
  })

  describe('execution with chat integration', () => {
    it('should execute plan steps while maintaining chat history', async () => {
      const adapter = createMockChatAdapter()

      function ExecutionWithChat() {
        const { messages, sendMessage } = useClarityChat()
        const { plan, status, currentStepIndex, setPlan, startExecution, startStep, completeStep } =
          useAgentExecution()

        const runExecution = async () => {
          setPlan([
            { id: 'step-1', title: 'Step 1', description: 'First action' },
            { id: 'step-2', title: 'Step 2', description: 'Second action' },
          ])

          startExecution('exec-1')

          for (const step of plan) {
            startStep(step.id)
            await sendMessage(`Executing: ${step.title}`)
            await new Promise((r) => setTimeout(r, 20))
            completeStep(step.id)
          }
        }

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="current-step">{currentStepIndex}</div>
            <button onClick={runExecution} data-testid="run">
              Run
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <ExecutionWithChat />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('run').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('executing')
      })

      await waitFor(
        () => {
          expect(screen.getByTestId('messages')).toHaveTextContent('2')
        },
        { timeout: 3000 }
      )
    })
  })

  describe('hooks composition', () => {
    it('should compose multiple hooks from both providers', () => {
      function ComposedHooks() {
        const { messages } = useChatMessages()
        const { emit, on } = useChatEvents()
        const { plan, toolCalls } = useAgentPlan()
        const { activeTools, pendingApprovals } = useAgentTools()

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="plan">{plan.length}</div>
            <div data-testid="active-tools">{activeTools.length}</div>
            <div data-testid="pending">{pendingApprovals.length}</div>
            <div data-testid="has-emit">{typeof emit === 'function' ? 'yes' : 'no'}</div>
            <div data-testid="has-on">{typeof on === 'function' ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider>
            <ComposedHooks />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('messages')).toHaveTextContent('0')
      expect(screen.getByTestId('plan')).toHaveTextContent('0')
      expect(screen.getByTestId('active-tools')).toHaveTextContent('0')
      expect(screen.getByTestId('pending')).toHaveTextContent('0')
      expect(screen.getByTestId('has-emit')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-on')).toHaveTextContent('yes')
    })
  })

  describe('complex workflows', () => {
    it('should handle agent plan execution with chat messaging', async () => {
      const adapter = createMockChatAdapter()

      function AgentWorkflow() {
        const { messages, sendMessage } = useClarityChat()
        const {
          plan,
          setPlan,
          startExecution,
          startStep,
          completeStep,
          addToolCall,
          approveTool,
          status,
        } = useAgentExecution()

        const runWorkflow = async () => {
          startExecution('workflow-1')

          setPlan([
            { id: 'analyze', title: 'Analyze Request', description: 'Parse user request' },
            { id: 'gather', title: 'Gather Data', description: 'Get necessary information' },
            { id: 'process', title: 'Process', description: 'Process the data' },
          ])

          for (const step of plan) {
            startStep(step.id)
            await sendMessage(`${step.title}: Analyzing...`)

            const toolId = addToolCall({
              name: `tool-${step.id}`,
              description: step.description,
              input: { stepId: step.id },
              requiresApproval: false,
            })

            await new Promise((r) => setTimeout(r, 20))
            completeStep(step.id)
          }
        }

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="plan-count">{plan.length}</div>
            <button onClick={runWorkflow} data-testid="start-workflow">
              Start Workflow
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <AgentWorkflow />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start-workflow').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('executing')
      })

      await waitFor(
        () => {
          expect(screen.getByTestId('messages')).toHaveTextContent('3')
        },
        { timeout: 3000 }
      )

      expect(screen.getByTestId('plan-count')).toHaveTextContent('3')
    })

    it('should handle user approval requirements across providers', async () => {
      function ApprovalWorkflow() {
        const { messages, sendMessage } = useClarityChat()
        const { toolCalls, addToolCall, approveTool, requestApproval } = useAgentExecution()

        const runWithApproval = async () => {
          await sendMessage('Please analyze this sensitive data')

          const toolId = addToolCall({
            name: 'analyze-sensitive',
            description: 'Analyze sensitive data',
            input: { dataId: 'sensitive-123' },
            requiresApproval: true,
            approvalReason: 'This operation requires user approval',
          })

          setTimeout(() => {
            approveTool(toolId)
          }, 50)
        }

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="tools">{toolCalls.length}</div>
            <div data-testid="pending">
              {toolCalls.filter((t) => t.status === 'waiting_approval').length}
            </div>
            <button onClick={runWithApproval} data-testid="run">
              Run With Approval
            </button>
          </div>
        )
      }

      const adapter = createMockChatAdapter()

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <ApprovalWorkflow />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      await act(async () => {
        screen.getByTestId('run').click()
        await waitFor(() => {})
      })

      expect(screen.getByTestId('messages')).toHaveTextContent('1')
      expect(screen.getByTestId('tools')).toHaveTextContent('1')
    })
  })

  describe('performance and cleanup', () => {
    it('should properly cleanup event subscriptions', async () => {
      const adapter = createMockChatAdapter()

      function SubscriptionTest() {
        const { on } = useClarityChat()
        const handler = vi.fn()

        React.useEffect(() => {
          const unsubscribe = on('message:sent', handler)
          return unsubscribe
        }, [on])

        return <div data-testid="subscribed">Listening</div>
      }

      const { unmount } = render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <SubscriptionTest />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      unmount()

      expect(screen.queryByTestId('subscribed')).not.toBeInTheDocument()
    })

    it('should handle rapid state updates', async () => {
      const adapter = createMockChatAdapter()

      function RapidUpdates() {
        const { messages, sendMessage } = useClarityChat()
        const { toolCalls, addToolCall } = useAgentExecution()

        const handleRapidUpdates = async () => {
          for (let i = 0; i < 5; i++) {
            await sendMessage(`Message ${i}`)
            addToolCall({
              name: `tool-${i}`,
              description: `Tool ${i}`,
              input: { index: i },
              requiresApproval: false,
            })
          }
        }

        return (
          <div>
            <div data-testid="messages">{messages.length}</div>
            <div data-testid="tools">{toolCalls.length}</div>
            <button onClick={handleRapidUpdates} data-testid="rapid">
              Rapid Updates
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <ClarityChatProvider adapter={adapter}>
            <RapidUpdates />
          </ClarityChatProvider>
        </AgentExecutionProvider>
      )

      await act(async () => {
        screen.getByTestId('rapid').click()
        await waitFor(() => {})
      })

      await waitFor(() => {
        expect(screen.getByTestId('messages')).toHaveTextContent('5')
      })

      expect(screen.getByTestId('tools')).toHaveTextContent('5')
    })
  })
})
