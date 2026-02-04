import * as React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  AgentExecutionProvider,
  useAgentExecution,
  useIsAgentExecutionConnected,
  useAgentPlan,
  useAgentTools,
  useAgentThinking,
  useAgentStatus,
  type ExecutionStatus,
  type PlanStep,
  type ToolCall,
  type ThinkingStep,
  type ExecutionError,
} from '../AgentExecutionProvider'

// ============================================================================
// Tests
// ============================================================================

describe('AgentExecutionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('should render children', () => {
      render(
        <AgentExecutionProvider>
          <div data-testid="child">Hello</div>
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('should accept initial state', () => {
      const initialState = {
        status: 'executing' as const,
        progress: 50,
      }

      function TestComponent() {
        const { status, progress } = useAgentExecution()
        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="progress">{progress}</div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider initialState={initialState}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('status')).toHaveTextContent('executing')
      expect(screen.getByTestId('progress')).toHaveTextContent('50')
    })

    it('should accept custom callbacks', () => {
      const onToolApproval = vi.fn()
      const onStatusChange = vi.fn()
      const onEvent = vi.fn()

      render(
        <AgentExecutionProvider
          onToolApproval={onToolApproval}
          onStatusChange={onStatusChange}
          onEvent={onEvent}
        >
          <div>Content</div>
        </AgentExecutionProvider>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('context access', () => {
    it('should provide execution context', () => {
      function TestComponent() {
        const context = useAgentExecution()

        return (
          <div>
            <div data-testid="has-status">{context.status ? 'yes' : 'no'}</div>
            <div data-testid="has-start">{typeof context.startExecution === 'function' ? 'yes' : 'no'}</div>
            <div data-testid="has-plan">{context.plan ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('has-status')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-start')).toHaveTextContent('yes')
      expect(screen.getByTestId('has-plan')).toHaveTextContent('yes')
    })

    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      function TestComponent() {
        useAgentExecution()
        return <div>Should not render</div>
      }

      expect(() => render(<TestComponent />)).toThrow(
        'useAgentExecution must be used within AgentExecutionProvider'
      )

      consoleSpy.mockRestore()
    })

    it('useIsAgentExecutionConnected should return true inside provider', () => {
      function TestComponent() {
        const connected = useIsAgentExecutionConnected()
        return <div data-testid="connected">{connected ? 'yes' : 'no'}</div>
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('connected')).toHaveTextContent('yes')
    })

    it('useIsAgentExecutionConnected should return false outside provider', () => {
      function TestComponent() {
        const connected = useIsAgentExecutionConnected()
        return <div data-testid="connected">{connected ? 'yes' : 'no'}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('connected')).toHaveTextContent('no')
    })
  })

  describe('execution lifecycle', () => {
    it('should start execution', () => {
      const onStatusChange = vi.fn()

      function TestComponent() {
        const { startExecution, status, executionId } = useAgentExecution()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="execution-id">{executionId || 'none'}</div>
            <button onClick={() => startExecution('exec-123')} data-testid="start">
              Start
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onStatusChange={onStatusChange}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('status')).toHaveTextContent('idle')

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('planning')
      expect(screen.getByTestId('execution-id')).toHaveTextContent('exec-123')
      expect(onStatusChange).toHaveBeenCalledWith('planning', 'idle')
    })

    it('should cancel execution', () => {
      const onStatusChange = vi.fn()

      function TestComponent() {
        const { startExecution, cancelExecution, status } = useAgentExecution()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
            <button onClick={() => cancelExecution('User cancelled')} data-testid="cancel">
              Cancel
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onStatusChange={onStatusChange}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('planning')

      act(() => {
        screen.getByTestId('cancel').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('cancelled')
    })

    it('should complete execution', () => {
      function TestComponent() {
        const { startExecution, completeExecution, status, progress } = useAgentExecution()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="progress">{progress}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
            <button onClick={() => completeExecution({ result: 'success' })} data-testid="complete">
              Complete
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      act(() => {
        screen.getByTestId('complete').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('complete')
      expect(screen.getByTestId('progress')).toHaveTextContent('100')
    })

    it('should pause and resume execution', () => {
      const onStatusChange = vi.fn()

      function TestComponent() {
        const { startExecution, pauseExecution, resumeExecution, status } = useAgentExecution()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
            <button onClick={() => pauseExecution()} data-testid="pause">
              Pause
            </button>
            <button onClick={() => resumeExecution()} data-testid="resume">
              Resume
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onStatusChange={onStatusChange}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('planning')

      act(() => {
        screen.getByTestId('pause').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('paused')

      act(() => {
        screen.getByTestId('resume').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('executing')
    })

    it('should handle errors', () => {
      function TestComponent() {
        const { startExecution, setError, status, error } = useAgentExecution()

        const handleError = () => {
          setError({
            code: 'ERROR_001',
            message: 'Test error',
            recoverable: true,
            timestamp: new Date(),
          })
        }

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="error">{error?.message}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
            <button onClick={handleError} data-testid="set-error">
              Set Error
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      act(() => {
        screen.getByTestId('set-error').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('error')
      expect(screen.getByTestId('error')).toHaveTextContent('Test error')
    })

    it('should clear error', () => {
      function TestComponent() {
        const { setError, clearError, error } = useAgentExecution()

        return (
          <div>
            <div data-testid="error">{error ? 'has-error' : 'no-error'}</div>
            <button
              onClick={() =>
                setError({
                  code: 'ERR_001',
                  message: 'Error',
                  recoverable: true,
                  timestamp: new Date(),
                })
              }
              data-testid="set-error"
            >
              Set Error
            </button>
            <button onClick={() => clearError()} data-testid="clear-error">
              Clear Error
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-error').click()
      })

      expect(screen.getByTestId('error')).toHaveTextContent('has-error')

      act(() => {
        screen.getByTestId('clear-error').click()
      })

      expect(screen.getByTestId('error')).toHaveTextContent('no-error')
    })

    it('should reset execution', () => {
      function TestComponent() {
        const { startExecution, reset, status, executionId } = useAgentExecution()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="execution-id">{executionId || 'none'}</div>
            <button onClick={() => startExecution('exec-1')} data-testid="start">
              Start
            </button>
            <button onClick={() => reset()} data-testid="reset">
              Reset
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('planning')
      expect(screen.getByTestId('execution-id')).toHaveTextContent('exec-1')

      act(() => {
        screen.getByTestId('reset').click()
      })

      expect(screen.getByTestId('status')).toHaveTextContent('idle')
      expect(screen.getByTestId('execution-id')).toHaveTextContent('none')
    })
  })

  describe('plan management', () => {
    it('should set execution plan', () => {
      function TestComponent() {
        const { setPlan, plan } = useAgentExecution()

        const handleSetPlan = () => {
          setPlan([
            { id: 'step-1', title: 'Step 1', description: 'First step' },
            { id: 'step-2', title: 'Step 2', description: 'Second step' },
          ])
        }

        return (
          <div>
            <div data-testid="plan-count">{plan.length}</div>
            <button onClick={handleSetPlan} data-testid="set-plan">
              Set Plan
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-plan').click()
      })

      expect(screen.getByTestId('plan-count')).toHaveTextContent('2')
    })

    it('should start a plan step', () => {
      function TestComponent() {
        const { setPlan, startStep, plan, currentStepIndex } = useAgentExecution()

        const handleStart = () => {
          setPlan([{ id: 'step-1', title: 'Step 1' }])
        }

        const handleStartStep = () => {
          startStep('step-1')
        }

        return (
          <div>
            <div data-testid="current-index">{currentStepIndex}</div>
            <button onClick={handleStart} data-testid="set-plan">
              Set Plan
            </button>
            <button onClick={handleStartStep} data-testid="start-step">
              Start Step
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-plan').click()
      })

      act(() => {
        screen.getByTestId('start-step').click()
      })

      expect(screen.getByTestId('current-index')).toHaveTextContent('0')
    })

    it('should complete a plan step', () => {
      const onEvent = vi.fn()

      function TestComponent() {
        const { setPlan, startStep, completeStep, completedSteps, progress } = useAgentExecution()

        const handleStart = () => {
          setPlan([
            { id: 'step-1', title: 'Step 1' },
            { id: 'step-2', title: 'Step 2' },
          ])
        }

        const handleStartStep = () => {
          startStep('step-1')
        }

        const handleCompleteStep = () => {
          completeStep('step-1')
        }

        return (
          <div>
            <div data-testid="completed">{completedSteps.length}</div>
            <div data-testid="progress">{progress}</div>
            <button onClick={handleStart} data-testid="set-plan">
              Set Plan
            </button>
            <button onClick={handleStartStep} data-testid="start-step">
              Start Step
            </button>
            <button onClick={handleCompleteStep} data-testid="complete-step">
              Complete Step
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onEvent={onEvent}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-plan').click()
        screen.getByTestId('start-step').click()
        screen.getByTestId('complete-step').click()
      })

      expect(screen.getByTestId('completed')).toHaveTextContent('1')
      expect(screen.getByTestId('progress')).toHaveTextContent('50')
    })

    it('should fail a plan step', () => {
      function TestComponent() {
        const { setPlan, startStep, failStep, plan } = useAgentExecution()

        const handleStart = () => {
          setPlan([{ id: 'step-1', title: 'Step 1' }])
        }

        const handleStartStep = () => {
          startStep('step-1')
        }

        const handleFailStep = () => {
          failStep('step-1', 'Test error')
        }

        return (
          <div>
            <div data-testid="step-status">{plan[0]?.status}</div>
            <button onClick={handleStart} data-testid="set-plan">
              Set Plan
            </button>
            <button onClick={handleStartStep} data-testid="start-step">
              Start Step
            </button>
            <button onClick={handleFailStep} data-testid="fail-step">
              Fail Step
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-plan').click()
        screen.getByTestId('start-step').click()
        screen.getByTestId('fail-step').click()
      })

      expect(screen.getByTestId('step-status')).toHaveTextContent('failed')
    })

    it('should skip a plan step', () => {
      function TestComponent() {
        const { setPlan, skipStep, plan } = useAgentExecution()

        const handleStart = () => {
          setPlan([{ id: 'step-1', title: 'Step 1' }])
        }

        const handleSkipStep = () => {
          skipStep('step-1', 'Already done')
        }

        return (
          <div>
            <div data-testid="step-status">{plan[0]?.status}</div>
            <button onClick={handleStart} data-testid="set-plan">
              Set Plan
            </button>
            <button onClick={handleSkipStep} data-testid="skip-step">
              Skip Step
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-plan').click()
        screen.getByTestId('skip-step').click()
      })

      expect(screen.getByTestId('step-status')).toHaveTextContent('skipped')
    })

    it('should get current step', () => {
      function TestComponent() {
        const { setPlan, startStep, getCurrentStep } = useAgentExecution()

        const handleStart = () => {
          setPlan([{ id: 'step-1', title: 'Step 1' }])
        }

        const handleStartStep = () => {
          startStep('step-1')
          const currentStep = getCurrentStep()
          return currentStep?.id
        }

        return (
          <div>
            <button onClick={handleStart} data-testid="set-plan">
              Set Plan
            </button>
            <button
              onClick={() => {
                handleStart()
                handleStartStep()
              }}
              data-testid="start-step"
            >
              Start Step
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('set-plan').click()
      })
    })

    it('should use useAgentPlan hook', () => {
      function TestComponent() {
        const { plan, currentStepIndex, completedSteps, currentStep } = useAgentPlan()

        return (
          <div>
            <div data-testid="plan-count">{plan.length}</div>
            <div data-testid="current-index">{currentStepIndex}</div>
            <div data-testid="completed">{completedSteps.length}</div>
            <div data-testid="current-step">{currentStep ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('plan-count')).toHaveTextContent('0')
      expect(screen.getByTestId('current-index')).toHaveTextContent('-1')
      expect(screen.getByTestId('completed')).toHaveTextContent('0')
      expect(screen.getByTestId('current-step')).toHaveTextContent('no')
    })
  })

  describe('tool call flows', () => {
    it('should add a tool call', () => {
      function TestComponent() {
        const { addToolCall, toolCalls } = useAgentExecution()

        const handleAddTool = () => {
          addToolCall({
            name: 'test-tool',
            input: { key: 'value' },
            requiresApproval: false,
          })
        }

        return (
          <div>
            <div data-testid="tool-count">{toolCalls.length}</div>
            <button onClick={handleAddTool} data-testid="add-tool">
              Add Tool
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('add-tool').click()
      })

      expect(screen.getByTestId('tool-count')).toHaveTextContent('1')
    })

    it('should start a tool', async () => {
      function TestComponent() {
        const { addToolCall, startTool, activeTools } = useAgentExecution()

        const handleStart = () => {
          const toolId = addToolCall({
            name: 'test-tool',
            input: {},
            requiresApproval: false,
          })

          setTimeout(() => {
            startTool(toolId)
          }, 50)
        }

        return (
          <div>
            <div data-testid="active-count">{activeTools.length}</div>
            <button onClick={handleStart} data-testid="start">
              Start Tool
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('active-count')).toHaveTextContent('1')
      })
    })

    it('should complete a tool', async () => {
      function TestComponent() {
        const { addToolCall, startTool, completeTool, completedTools } = useAgentExecution()

        const handleComplete = () => {
          const toolId = addToolCall({
            name: 'test-tool',
            input: {},
            requiresApproval: false,
          })

          setTimeout(() => {
            startTool(toolId)
            completeTool(toolId, { result: 'success' })
          }, 50)
        }

        return (
          <div>
            <div data-testid="completed-count">{completedTools.length}</div>
            <button onClick={handleComplete} data-testid="complete">
              Complete Tool
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('complete').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('completed-count')).toHaveTextContent('1')
      })
    })

    it('should fail a tool', async () => {
      function TestComponent() {
        const { addToolCall, startTool, failTool, toolCalls } = useAgentExecution()

        const handleFail = () => {
          const toolId = addToolCall({
            name: 'test-tool',
            input: {},
            requiresApproval: false,
          })

          setTimeout(() => {
            startTool(toolId)
            failTool(toolId, 'Tool execution failed')
          }, 50)
        }

        return (
          <div>
            <div data-testid="tool-status">{toolCalls[0]?.status}</div>
            <button onClick={handleFail} data-testid="fail">
              Fail Tool
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('fail').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('tool-status')).toHaveTextContent('error')
      })
    })

    it('should use useAgentTools hook', () => {
      function TestComponent() {
        const { toolCalls, pendingApprovals, activeTools, completedTools, approveTool, rejectTool } =
          useAgentTools()

        return (
          <div>
            <div data-testid="total">{toolCalls.length}</div>
            <div data-testid="pending">{pendingApprovals.length}</div>
            <div data-testid="active">{activeTools.length}</div>
            <div data-testid="completed">{completedTools.length}</div>
            <div data-testid="has-actions">
              {typeof approveTool === 'function' && typeof rejectTool === 'function' ? 'yes' : 'no'}
            </div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('total')).toHaveTextContent('0')
      expect(screen.getByTestId('pending')).toHaveTextContent('0')
      expect(screen.getByTestId('has-actions')).toHaveTextContent('yes')
    })
  })

  describe('approval workflows', () => {
    it('should request tool approval', () => {
      const onToolApproval = vi.fn()

      function TestComponent() {
        const { addToolCall, requestApproval, pendingApprovals } = useAgentExecution()

        const handleRequest = () => {
          const toolId = addToolCall({
            name: 'dangerous-tool',
            input: {},
            requiresApproval: false,
          })

          requestApproval(toolId, 'This tool requires approval')
        }

        return (
          <div>
            <div data-testid="pending-count">{pendingApprovals.length}</div>
            <button onClick={handleRequest} data-testid="request">
              Request Approval
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onToolApproval={onToolApproval}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('request').click()
      })

      expect(screen.getByTestId('pending-count')).toHaveTextContent('1')
      expect(onToolApproval).toHaveBeenCalled()
    })

    it('should approve a tool', () => {
      const onEvent = vi.fn()

      function TestComponent() {
        const { addToolCall, requestApproval, approveTool, toolCalls } = useAgentExecution()

        const handleApprove = () => {
          const toolId = addToolCall({
            name: 'tool',
            input: {},
            requiresApproval: false,
          })

          requestApproval(toolId)

          setTimeout(() => {
            approveTool(toolId, 'admin')
          }, 50)
        }

        return (
          <div>
            <div data-testid="tool-status">{toolCalls[0]?.status}</div>
            <button onClick={handleApprove} data-testid="approve">
              Approve
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onEvent={onEvent}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('approve').click()
      })

      waitFor(() => {
        expect(screen.getByTestId('tool-status')).toHaveTextContent('approved')
      })
    })

    it('should reject a tool', () => {
      function TestComponent() {
        const { addToolCall, requestApproval, rejectTool, toolCalls } = useAgentExecution()

        const handleReject = () => {
          const toolId = addToolCall({
            name: 'tool',
            input: {},
            requiresApproval: false,
          })

          requestApproval(toolId)

          setTimeout(() => {
            rejectTool(toolId, 'Not safe')
          }, 50)
        }

        return (
          <div>
            <div data-testid="tool-status">{toolCalls[0]?.status}</div>
            <button onClick={handleReject} data-testid="reject">
              Reject
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('reject').click()
      })

      waitFor(() => {
        expect(screen.getByTestId('tool-status')).toHaveTextContent('rejected')
      })
    })

    it('should update status when tool approved', () => {
      function TestComponent() {
        const { addToolCall, requestApproval, approveTool, status } = useAgentExecution()

        const handleApprove = () => {
          const toolId = addToolCall({
            name: 'tool',
            input: {},
            requiresApproval: false,
          })

          requestApproval(toolId)

          setTimeout(() => {
            approveTool(toolId)
          }, 50)
        }

        return (
          <div>
            <div data-testid="status">{status}</div>
            <button onClick={handleApprove} data-testid="approve">
              Approve
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('approve').click()
      })

      waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('executing')
      })
    })
  })

  describe('event system', () => {
    it('should emit execution events', () => {
      const onEvent = vi.fn()

      function TestComponent() {
        const { startExecution } = useAgentExecution()

        return (
          <button onClick={() => startExecution()} data-testid="start">
            Start
          </button>
        )
      }

      render(
        <AgentExecutionProvider onEvent={onEvent}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(onEvent).toHaveBeenCalled()
      expect(onEvent.mock.calls[0][0].type).toBe('execution:started')
    })

    it('should support event subscription', () => {
      const eventHandler = vi.fn()

      function TestComponent() {
        const { startExecution, on } = useAgentExecution()

        React.useEffect(() => {
          return on('execution:started', eventHandler)
        }, [on])

        return (
          <button onClick={() => startExecution()} data-testid="start">
            Start
          </button>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(eventHandler).toHaveBeenCalled()
    })

    it('should support any-event subscription', () => {
      const eventHandler = vi.fn()

      function TestComponent() {
        const { startExecution, onAny } = useAgentExecution()

        React.useEffect(() => {
          return onAny(eventHandler)
        }, [onAny])

        return (
          <button onClick={() => startExecution()} data-testid="start">
            Start
          </button>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(eventHandler).toHaveBeenCalled()
    })

    it('should allow unsubscribing from events', () => {
      const eventHandler = vi.fn()

      function TestComponent() {
        const { startExecution, on } = useAgentExecution()
        const [unsubscribe, setUnsubscribe] = React.useState<(() => void) | null>(null)

        const handleSubscribe = () => {
          const unsub = on('execution:started', eventHandler)
          setUnsubscribe(() => unsub)
        }

        const handleUnsubscribe = () => {
          unsubscribe?.()
        }

        return (
          <div>
            <button onClick={handleSubscribe} data-testid="subscribe">
              Subscribe
            </button>
            <button onClick={() => startExecution()} data-testid="emit">
              Start
            </button>
            <button onClick={handleUnsubscribe} data-testid="unsubscribe">
              Unsubscribe
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
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

      expect(eventHandler).toHaveBeenCalledTimes(1)
    })

    it('should emit plan:step:started event', () => {
      const onEvent = vi.fn()

      function TestComponent() {
        const { setPlan, startStep } = useAgentExecution()

        const handleStart = () => {
          setPlan([{ id: 'step-1', title: 'Step 1' }])
          startStep('step-1')
        }

        return (
          <button onClick={handleStart} data-testid="start">
            Start
          </button>
        )
      }

      render(
        <AgentExecutionProvider onEvent={onEvent}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      const stepStartedEvent = onEvent.mock.calls.find((call) => {
        return call[0].type === 'plan:step:started'
      })

      expect(stepStartedEvent).toBeDefined()
    })
  })

  describe('thinking management', () => {
    it('should provide useAgentThinking hook', () => {
      function TestComponent() {
        const { thoughts, currentThought, startThinking, addThought, completeThinking } =
          useAgentThinking()

        return (
          <div>
            <div data-testid="thoughts">{thoughts.length}</div>
            <div data-testid="current">{currentThought ? 'yes' : 'no'}</div>
            <div data-testid="has-actions">
              {typeof startThinking === 'function' &&
              typeof addThought === 'function' &&
              typeof completeThinking === 'function'
                ? 'yes'
                : 'no'}
            </div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('thoughts')).toHaveTextContent('0')
      expect(screen.getByTestId('current')).toHaveTextContent('no')
      expect(screen.getByTestId('has-actions')).toHaveTextContent('yes')
    })

    it('should add thinking steps', () => {
      function TestComponent() {
        const { addThought, thoughts } = useAgentExecution()

        const handleAddThought = () => {
          addThought('Thinking about this problem...')
        }

        return (
          <div>
            <div data-testid="count">{thoughts.length}</div>
            <button onClick={handleAddThought} data-testid="add">
              Add
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('add').click()
      })

      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })

    it('should complete thinking', () => {
      function TestComponent() {
        const { addThought, completeThinking, currentThought } = useAgentExecution()

        const handleComplete = () => {
          addThought('First thought')
          setTimeout(() => {
            completeThinking()
          }, 50)
        }

        return (
          <div>
            <div data-testid="current">{currentThought ? 'yes' : 'no'}</div>
            <button onClick={handleComplete} data-testid="complete">
              Complete
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('complete').click()
      })

      waitFor(() => {
        expect(screen.getByTestId('current')).toHaveTextContent('no')
      })
    })
  })

  describe('state transitions', () => {
    it('should track status changes', () => {
      const onStatusChange = vi.fn()

      function TestComponent() {
        const { startExecution, completeExecution, status } = useAgentExecution()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
            <button onClick={() => completeExecution()} data-testid="complete">
              Complete
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider onStatusChange={onStatusChange}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(onStatusChange).toHaveBeenCalledWith('planning', 'idle')

      act(() => {
        screen.getByTestId('complete').click()
      })

      expect(onStatusChange).toHaveBeenCalledWith('complete', 'planning')
    })

    it('should calculate progress correctly', () => {
      function TestComponent() {
        const { setPlan, startStep, completeStep, progress } = useAgentExecution()

        const handleStart = () => {
          setPlan([
            { id: 'step-1', title: 'Step 1' },
            { id: 'step-2', title: 'Step 2' },
            { id: 'step-3', title: 'Step 3' },
          ])
        }

        const handleComplete1 = () => {
          startStep('step-1')
          completeStep('step-1')
        }

        const handleComplete2 = () => {
          startStep('step-2')
          completeStep('step-2')
        }

        return (
          <div>
            <div data-testid="progress">{progress}</div>
            <button onClick={handleStart} data-testid="set-plan">
              Set Plan
            </button>
            <button onClick={handleComplete1} data-testid="complete1">
              Complete 1
            </button>
            <button onClick={handleComplete2} data-testid="complete2">
              Complete 2
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('progress')).toHaveTextContent('0')

      act(() => {
        screen.getByTestId('set-plan').click()
        screen.getByTestId('complete1').click()
      })

      expect(screen.getByTestId('progress')).toHaveTextContent('33')

      act(() => {
        screen.getByTestId('complete2').click()
      })

      expect(screen.getByTestId('progress')).toHaveTextContent('66')
    })

    it('should provide useAgentStatus hook', () => {
      function TestComponent() {
        const { status, progress, error, time, canProceed } = useAgentStatus()

        return (
          <div>
            <div data-testid="status">{status}</div>
            <div data-testid="progress">{progress}</div>
            <div data-testid="error">{error ? 'yes' : 'no'}</div>
            <div data-testid="can-proceed">{canProceed ? 'yes' : 'no'}</div>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('status')).toHaveTextContent('idle')
      expect(screen.getByTestId('progress')).toHaveTextContent('0')
      expect(screen.getByTestId('error')).toHaveTextContent('no')
      expect(screen.getByTestId('can-proceed')).toHaveTextContent('yes')
    })
  })

  describe('execution summary', () => {
    it('should get execution summary', () => {
      function TestComponent() {
        const { startExecution, setPlan, addToolCall, getSummary } = useAgentExecution()

        const handleSummary = () => {
          startExecution('exec-123')
          setPlan([{ id: 'step-1', title: 'Step 1' }])
          addToolCall({
            name: 'tool-1',
            input: {},
            requiresApproval: false,
          })

          const summary = getSummary()
          return summary
        }

        return (
          <button onClick={handleSummary} data-testid="get-summary">
            Get Summary
          </button>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('get-summary').click()
      })
    })
  })

  describe('auto-approval', () => {
    it('should auto-approve safe tools', async () => {
      function TestComponent() {
        const { addToolCall, toolCalls } = useAgentExecution()

        const handleAdd = () => {
          addToolCall({
            name: 'safe-tool',
            input: {},
            requiresApproval: false,
          })
        }

        return (
          <div>
            <div data-testid="tool-status">{toolCalls[0]?.status}</div>
            <button onClick={handleAdd} data-testid="add">
              Add
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider autoApproveSafe={true}>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('add').click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('tool-status')).toHaveTextContent('approved')
      })
    })
  })

  describe('time tracking', () => {
    it('should track execution time', () => {
      function TestComponent() {
        const { startExecution, time } = useAgentExecution()

        return (
          <div>
            <div data-testid="started">{time.startedAt ? 'yes' : 'no'}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('started')).toHaveTextContent('no')

      act(() => {
        screen.getByTestId('start').click()
      })

      expect(screen.getByTestId('started')).toHaveTextContent('yes')
    })

    it('should track pause duration', () => {
      function TestComponent() {
        const { startExecution, pauseExecution, time } = useAgentExecution()

        return (
          <div>
            <div data-testid="paused">{time.pausedAt ? 'yes' : 'no'}</div>
            <button onClick={() => startExecution()} data-testid="start">
              Start
            </button>
            <button onClick={() => pauseExecution()} data-testid="pause">
              Pause
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      act(() => {
        screen.getByTestId('start').click()
        screen.getByTestId('pause').click()
      })

      expect(screen.getByTestId('paused')).toHaveTextContent('yes')
    })
  })

  describe('canProceed check', () => {
    it('should return false when pending approvals', () => {
      function TestComponent() {
        const { addToolCall, requestApproval, canProceed } = useAgentExecution()

        const handleRequest = () => {
          const toolId = addToolCall({
            name: 'tool',
            input: {},
            requiresApproval: false,
          })
          requestApproval(toolId)
        }

        return (
          <div>
            <div data-testid="can-proceed">{canProceed() ? 'yes' : 'no'}</div>
            <button onClick={handleRequest} data-testid="request">
              Request
            </button>
          </div>
        )
      }

      render(
        <AgentExecutionProvider>
          <TestComponent />
        </AgentExecutionProvider>
      )

      expect(screen.getByTestId('can-proceed')).toHaveTextContent('yes')

      act(() => {
        screen.getByTestId('request').click()
      })

      expect(screen.getByTestId('can-proceed')).toHaveTextContent('no')
    })
  })
})
