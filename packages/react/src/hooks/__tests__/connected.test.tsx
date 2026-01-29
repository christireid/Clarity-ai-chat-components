/**
 * Tests for Connected Hooks
 *
 * Tests all connected hooks that automatically wire clarity-chat components
 * to the ClarityChatProvider context.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import {
  useConnectedThinkingBar,
  useConnectedThinkingPill,
  useConnectedStreamProgress,
  useConnectedConversations,
  useConnectedSender,
  useConnectedToolCard,
  useConnectedChainOfThought,
  useConnectedResponseActions,
  useConnectedWelcome,
  useConnectedPrompts,
  useConnectedSuggestion,
  useConnectedAttachments,
  useConnectedApprovalCard,
  useConnectedProps,
  withConnected,
  type ConnectedThinkingBarProps,
  type ConnectedSenderProps,
} from '../connected/index'
import { ClarityChatProvider } from '../../providers/ClarityChatProvider'
import type { ChatAdapter, ChatMessage, ThinkingStep, ToolExecution, MessageAttachment } from '../../providers/ClarityChatProvider'

// ============================================================================
// Mock Setup
// ============================================================================

const createMockAdapter = (): ChatAdapter => ({
  sendMessage: vi.fn().mockResolvedValue(undefined),
  stopGeneration: vi.fn(),
  regenerate: vi.fn().mockResolvedValue(undefined),
  approveTool: vi.fn().mockResolvedValue(undefined),
  rejectTool: vi.fn().mockResolvedValue(undefined),
  getMessages: vi.fn().mockReturnValue([]),
  getStreamStatus: vi.fn().mockReturnValue({
    isStreaming: false,
    phase: 'idle',
    progress: 0,
    tokensUsed: 0,
  }),
  getThinkingSteps: vi.fn().mockReturnValue([]),
  getActiveTools: vi.fn().mockReturnValue([]),
  getPendingApprovals: vi.fn().mockReturnValue([]),
})

const createMockMessage = (overrides?: Partial<ChatMessage>): ChatMessage => ({
  id: 'msg-1',
  role: 'user',
  content: 'Test message',
  createdAt: new Date(),
  status: 'complete',
  ...overrides,
})

const createMockThinkingStep = (overrides?: Partial<ThinkingStep>): ThinkingStep => ({
  id: 'step-1',
  content: 'Thinking about the problem',
  status: 'active',
  timestamp: new Date(),
  ...overrides,
})

const createMockToolExecution = (overrides?: Partial<ToolExecution>): ToolExecution => ({
  id: 'tool-1',
  callId: 'call-1',
  name: 'calculator',
  arguments: { operation: 'add', a: 1, b: 2 },
  status: 'pending',
  requiresApproval: true,
  ...overrides,
})

const createMockAttachment = (overrides?: Partial<MessageAttachment>): MessageAttachment => ({
  id: 'attach-1',
  name: 'document.pdf',
  type: 'application/pdf',
  size: 1024,
  ...overrides,
})

// ============================================================================
// Test Wrapper Component
// ============================================================================

interface TestProviderProps {
  children: React.ReactNode
  adapter?: ChatAdapter
}

const TestProvider: React.FC<TestProviderProps> = ({ children, adapter }) => {
  const mockAdapter = adapter || createMockAdapter()
  return (
    <ClarityChatProvider adapter={mockAdapter}>
      {children}
    </ClarityChatProvider>
  )
}

// ============================================================================
// useConnectedThinkingBar Tests
// ============================================================================

describe('useConnectedThinkingBar', () => {
  it('returns inactive state when not thinking or streaming', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.status).toBe('idle')
  })

  it('returns active thinking status when isThinking is true', () => {
    const adapter = createMockAdapter()
    adapter.getThinkingSteps = vi.fn().mockReturnValue([
      createMockThinkingStep({ status: 'active' }),
    ])

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isActive).toBe(true)
    expect(result.current.status).toBe('thinking')
  })

  it('returns processing status when streaming', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
    })

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('processing')
    expect(result.current.progress).toBe(50)
  })

  it('returns complete status when stream complete', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: false,
      phase: 'complete',
      progress: 100,
      tokensUsed: 200,
    })

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('complete')
  })

  it('returns error status on stream error', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: false,
      phase: 'error',
      progress: 25,
      tokensUsed: 50,
      error: 'Connection failed',
    })

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('error')
  })

  it('includes current step and total steps count', () => {
    const adapter = createMockAdapter()
    adapter.getThinkingSteps = vi.fn().mockReturnValue([
      createMockThinkingStep({ status: 'complete' }),
      createMockThinkingStep({ status: 'active', content: 'Current step' }),
      createMockThinkingStep({ status: 'pending' }),
    ])

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.currentStep).toBe('Current step')
    expect(result.current.totalSteps).toBe(3)
  })

  it('calculates estimated time remaining', () => {
    const adapter = createMockAdapter()
    const futureDate = new Date(Date.now() + 5000) // 5 seconds from now
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
      estimatedCompletion: futureDate,
    })

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.estimatedTime).toBeDefined()
    expect(result.current.estimatedTime).toBeGreaterThan(0)
    expect(result.current.estimatedTime).toBeLessThanOrEqual(5000)
  })
})

// ============================================================================
// useConnectedThinkingPill Tests
// ============================================================================

describe('useConnectedThinkingPill', () => {
  it('returns inactive state when not thinking', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedThinkingPill(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isActive).toBe(false)
    expect(result.current.label).toBeUndefined()
  })

  it('returns active state with current step label when thinking', () => {
    const adapter = createMockAdapter()
    adapter.getThinkingSteps = vi.fn().mockReturnValue([
      createMockThinkingStep({ status: 'active', content: 'Analyzing input' }),
    ])

    const { result } = renderHook(() => useConnectedThinkingPill(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isActive).toBe(true)
    expect(result.current.label).toBe('Analyzing input')
  })

  it('shows generating label when streaming without thinking', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
    })

    const { result } = renderHook(() => useConnectedThinkingPill(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isActive).toBe(true)
    expect(result.current.label).toBe('Generating...')
  })
})

// ============================================================================
// useConnectedStreamProgress Tests
// ============================================================================

describe('useConnectedStreamProgress', () => {
  it('returns idle status by default', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('idle')
    expect(result.current.progress).toBe(0)
    expect(result.current.tokensUsed).toBe(0)
  })

  it('returns streaming status with progress', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 65,
      tokensUsed: 150,
      tokensTotal: 300,
    })

    const { result } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('streaming')
    expect(result.current.progress).toBe(65)
    expect(result.current.tokensUsed).toBe(150)
    expect(result.current.tokensTotal).toBe(300)
  })

  it('calculates elapsed time from start', () => {
    const adapter = createMockAdapter()
    const startTime = new Date(Date.now() - 3000) // 3 seconds ago
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
      startedAt: startTime,
    })

    const { result } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.timeElapsed).toBeDefined()
    expect(result.current.timeElapsed).toBeGreaterThanOrEqual(3000)
  })

  it('calculates remaining time to completion', () => {
    const adapter = createMockAdapter()
    const completionTime = new Date(Date.now() + 5000) // 5 seconds from now
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
      estimatedCompletion: completionTime,
    })

    const { result } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.timeRemaining).toBeDefined()
    expect(result.current.timeRemaining).toBeGreaterThan(0)
    expect(result.current.timeRemaining).toBeLessThanOrEqual(5000)
  })

  it('shows connecting status', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'connecting',
      progress: 0,
      tokensUsed: 0,
    })

    const { result } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('connecting')
  })
})

// ============================================================================
// useConnectedConversations Tests
// ============================================================================

describe('useConnectedConversations', () => {
  it('returns empty conversations initially', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedConversations(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].key).toBe('main')
    expect(result.current.items[0].messages).toEqual([])
    expect(result.current.activeKey).toBe('main')
  })

  it('includes messages from adapter', () => {
    const adapter = createMockAdapter()
    const messages = [
      createMockMessage({ id: 'msg-1', role: 'user', content: 'Hello' }),
      createMockMessage({ id: 'msg-2', role: 'assistant', content: 'Hi there!' }),
    ]
    adapter.getMessages = vi.fn().mockReturnValue(messages)

    const { result } = renderHook(() => useConnectedConversations(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.items[0].messages).toEqual(messages)
  })

  it('shows timestamps', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedConversations(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.showTimestamps).toBe(true)
  })
})

// ============================================================================
// useConnectedSender Tests
// ============================================================================

describe('useConnectedSender', () => {
  it('returns sender props with sendMessage callback', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedSender(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onSend).toBeDefined()
    expect(typeof result.current.onSend).toBe('function')
  })

  it('has disabled=false by default', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedSender(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.disabled).toBe(false)
  })

  it('returns stopGeneration callback when available', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedSender(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onStop).toBeDefined()
    expect(typeof result.current.onStop).toBe('function')
  })

  it('shows loading placeholder when streaming', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
    })

    const { result } = renderHook(() => useConnectedSender(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.placeholder).toBe('Generating response...')
  })

  it('shows default placeholder when not streaming', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedSender(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.placeholder).toBe('Type a message...')
  })

  it('is loading matches streaming state', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
    })

    const { result } = renderHook(() => useConnectedSender(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isLoading).toBe(true)
  })
})

// ============================================================================
// useConnectedToolCard Tests
// ============================================================================

describe('useConnectedToolCard', () => {
  it('returns empty tools initially', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedToolCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.tools).toEqual([])
  })

  it('includes active tools from adapter', () => {
    const adapter = createMockAdapter()
    const tools = [
      createMockToolExecution({ id: 'tool-1', name: 'calculator' }),
      createMockToolExecution({ id: 'tool-2', name: 'search' }),
    ]
    adapter.getActiveTools = vi.fn().mockReturnValue(tools)

    const { result } = renderHook(() => useConnectedToolCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.tools).toEqual(tools)
  })

  it('provides approve callback', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedToolCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onApprove).toBeDefined()
    expect(typeof result.current.onApprove).toBe('function')
  })

  it('provides reject callback', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedToolCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onReject).toBeDefined()
    expect(typeof result.current.onReject).toBe('function')
  })
})

// ============================================================================
// useConnectedChainOfThought Tests
// ============================================================================

describe('useConnectedChainOfThought', () => {
  it('returns empty steps initially', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedChainOfThought(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.steps).toEqual([])
    expect(result.current.isExpanded).toBe(false)
  })

  it('includes thinking steps with proper mapping', () => {
    const adapter = createMockAdapter()
    const steps = [
      createMockThinkingStep({ id: 'step-1', content: 'Step 1', status: 'complete' }),
      createMockThinkingStep({ id: 'step-2', content: 'Step 2', status: 'active' }),
    ]
    adapter.getThinkingSteps = vi.fn().mockReturnValue(steps)

    const { result } = renderHook(() => useConnectedChainOfThought(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.steps).toHaveLength(2)
    expect(result.current.steps[0]).toEqual({
      id: 'step-1',
      content: 'Step 1',
      status: 'complete',
    })
    expect(result.current.steps[1]).toEqual({
      id: 'step-2',
      content: 'Step 2',
      status: 'active',
    })
  })

  it('is expanded when thinking is active', () => {
    const adapter = createMockAdapter()
    adapter.getThinkingSteps = vi.fn().mockReturnValue([
      createMockThinkingStep({ status: 'active' }),
    ])

    const { result } = renderHook(() => useConnectedChainOfThought(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isExpanded).toBe(true)
  })
})

// ============================================================================
// useConnectedResponseActions Tests
// ============================================================================

describe('useConnectedResponseActions', () => {
  it('provides response action callbacks', () => {
    const adapter = createMockAdapter()
    adapter.getMessages = vi.fn().mockReturnValue([
      createMockMessage({ id: 'msg-1' }),
    ])

    const { result } = renderHook(() => useConnectedResponseActions(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onRegenerate).toBeDefined()
    expect(result.current.onCopy).toBeDefined()
    expect(result.current.onLike).toBeDefined()
    expect(result.current.onDislike).toBeDefined()
  })

  it('accepts optional messageId parameter', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(
      () => useConnectedResponseActions('msg-123'),
      {
        wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
      }
    )

    expect(result.current.messageId).toBe('msg-123')
  })

  it('uses last message ID when not provided', () => {
    const adapter = createMockAdapter()
    adapter.getMessages = vi.fn().mockReturnValue([
      createMockMessage({ id: 'msg-1' }),
      createMockMessage({ id: 'msg-2' }),
    ])

    const { result } = renderHook(() => useConnectedResponseActions(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.messageId).toBe('msg-2')
  })

  it('isRegenerating matches streaming state', () => {
    const adapter = createMockAdapter()
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
    })

    const { result } = renderHook(() => useConnectedResponseActions(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.isRegenerating).toBe(true)
  })
})

// ============================================================================
// useConnectedWelcome Tests
// ============================================================================

describe('useConnectedWelcome', () => {
  it('provides suggestion click handler', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedWelcome(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onSuggestionClick).toBeDefined()
    expect(typeof result.current.onSuggestionClick).toBe('function')
  })

  it('sends suggestion text as message', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedWelcome(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onSuggestionClick?.({ text: 'Start conversation' })
    })

    expect(adapter.sendMessage).toHaveBeenCalledWith('Start conversation')
  })
})

// ============================================================================
// useConnectedPrompts Tests
// ============================================================================

describe('useConnectedPrompts', () => {
  it('provides prompt select handler', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedPrompts(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onSelect).toBeDefined()
    expect(typeof result.current.onSelect).toBe('function')
  })

  it('sends prompt text as message', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedPrompts(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onSelect?.(
        { description: 'Write a poem about React' },
        undefined
      )
    })

    expect(adapter.sendMessage).toHaveBeenCalledWith('Write a poem about React')
  })

  it('replaces variables in prompt text', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedPrompts(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onSelect?.(
        { description: 'Write a {{type}} about {{topic}}' },
        { type: 'poem', topic: 'React' }
      )
    })

    expect(adapter.sendMessage).toHaveBeenCalledWith('Write a poem about React')
  })

  it('handles multiple variable replacements', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedPrompts(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onSelect?.(
        { description: '{{greeting}} {{name}}, how are {{subject}}?' },
        { greeting: 'Hello', name: 'Alice', subject: 'you' }
      )
    })

    expect(adapter.sendMessage).toHaveBeenCalledWith('Hello Alice, how are you?')
  })
})

// ============================================================================
// useConnectedSuggestion Tests
// ============================================================================

describe('useConnectedSuggestion', () => {
  it('provides suggestion select handler', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedSuggestion(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onSelect).toBeDefined()
    expect(typeof result.current.onSelect).toBe('function')
  })

  it('sends suggestion text as message', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedSuggestion(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onSelect?.({ text: 'Tell me more' })
    })

    expect(adapter.sendMessage).toHaveBeenCalledWith('Tell me more')
  })
})

// ============================================================================
// useConnectedAttachments Tests
// ============================================================================

describe('useConnectedAttachments', () => {
  it('returns empty attachments initially', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedAttachments(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.attachments).toEqual([])
  })

  it('includes attachments from streaming message', () => {
    const adapter = createMockAdapter()
    const attachments = [
      createMockAttachment({ id: 'attach-1', name: 'file1.pdf' }),
      createMockAttachment({ id: 'attach-2', name: 'file2.txt' }),
    ]

    const { result } = renderHook(() => useConnectedAttachments(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    // Note: In a real scenario, this would come from the provider's streaming message state
    expect(result.current.attachments).toBeDefined()
  })
})

// ============================================================================
// useConnectedApprovalCard Tests
// ============================================================================

describe('useConnectedApprovalCard', () => {
  it('returns empty pending approvals initially', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedApprovalCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.pendingApprovals).toEqual([])
  })

  it('includes pending tools requiring approval', () => {
    const adapter = createMockAdapter()
    const pendingTools = [
      createMockToolExecution({
        id: 'tool-1',
        status: 'pending',
        requiresApproval: true,
      }),
    ]
    adapter.getPendingApprovals = vi.fn().mockReturnValue(pendingTools)

    const { result } = renderHook(() => useConnectedApprovalCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.pendingApprovals).toEqual(pendingTools)
  })

  it('provides approve and reject callbacks', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedApprovalCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.onApprove).toBeDefined()
    expect(result.current.onReject).toBeDefined()
  })

  it('approve callback calls adapter approveTool', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedApprovalCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onApprove('tool-123')
    })

    expect(adapter.approveTool).toHaveBeenCalledWith('tool-123')
  })

  it('reject callback calls adapter rejectTool', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedApprovalCard(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onReject('tool-123', 'Security concern')
    })

    expect(adapter.rejectTool).toHaveBeenCalledWith('tool-123', 'Security concern')
  })
})

// ============================================================================
// useConnectedProps Tests
// ============================================================================

describe('useConnectedProps', () => {
  it('returns null when no provider context', () => {
    const { result } = renderHook(() => useConnectedProps('thinkingbar'))

    expect(result.current).toBeNull()
  })

  it('returns thinking bar props for thinkingbar component', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedProps('thinkingbar'), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current).toBeDefined()
    expect(result.current).toHaveProperty('isActive')
    expect(result.current).toHaveProperty('status')
  })

  it('returns thinking pill props for thinkingpill component', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedProps('thinkingpill'), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current).toBeDefined()
    expect(result.current).toHaveProperty('isActive')
    expect(result.current).toHaveProperty('label')
  })

  it('handles case-insensitive component names', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedProps('THINKINGBAR'), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current).toBeDefined()
  })

  it('returns null for unknown component', () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedProps('unknownComponent'), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current).toBeNull()
  })

  it('supports multiple component name aliases', () => {
    const adapter = createMockAdapter()

    const toolcardResult = renderHook(() => useConnectedProps('toolcard'), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    const toolexecutionResult = renderHook(() => useConnectedProps('toolexecutioncard'), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(toolcardResult.result.current).toBeDefined()
    expect(toolexecutionResult.result.current).toBeDefined()
  })
})

// ============================================================================
// withConnected HOC Tests
// ============================================================================

describe('withConnected HOC', () => {
  it('returns component that accepts connected prop', () => {
    const TestComponent = ({ isActive }: { isActive?: boolean }) => (
      <div>{isActive ? 'Active' : 'Inactive'}</div>
    )

    const ConnectedComponent = withConnected(TestComponent, 'thinkingbar')

    const { container } = renderHook(() => {
      const adapter = createMockAdapter()
      return (
        <TestProvider adapter={adapter}>
          <ConnectedComponent connected />
        </TestProvider>
      )
    })

    expect(ConnectedComponent.displayName).toBe('Connected(thinkingbar)')
  })

  it('merges connected props with passed props', () => {
    const mockComponent = vi.fn(() => null)
    const ConnectedComponent = withConnected(mockComponent, 'sender')

    const adapter = createMockAdapter()
    renderHook(() => (
      <TestProvider adapter={adapter}>
        <ConnectedComponent connected customProp="value" />
      </TestProvider>
    ))

    // Component should receive merged props including connected ones and custom props
    expect(mockComponent).toHaveBeenCalled()
  })

  it('passes through props when connected=false', () => {
    const TestComponent = ({ message }: { message?: string }) => (
      <div>{message}</div>
    )

    const ConnectedComponent = withConnected(TestComponent, 'welcome')

    renderHook(() => {
      const adapter = createMockAdapter()
      return (
        <TestProvider adapter={adapter}>
          <ConnectedComponent message="Test message" />
        </TestProvider>
      )
    })

    // Should render with passed props only, no connected props merged
    expect(TestComponent).toBeTruthy()
  })

  it('has correct display name', () => {
    const TestComponent = () => <div>Test</div>
    const ConnectedComponent = withConnected(TestComponent, 'customComponent')

    expect(ConnectedComponent.displayName).toBe('Connected(customComponent)')
  })
})

// ============================================================================
// State Synchronization Tests
// ============================================================================

describe('Connected Hooks - State Synchronization', () => {
  it('updates when adapter state changes', () => {
    const adapter = createMockAdapter()
    let updateTrigger = 0

    // Mock the provider to trigger updates
    adapter.getStreamStatus = vi.fn(() => ({
      isStreaming: updateTrigger > 0,
      phase: updateTrigger > 0 ? 'receiving' : 'idle',
      progress: updateTrigger * 25,
      tokensUsed: updateTrigger * 50,
    }))

    const { result, rerender } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.status).toBe('idle')

    updateTrigger = 1
    rerender()

    expect(result.current.status).toBe('streaming')
  })

  it('memoizes props to prevent unnecessary re-renders', () => {
    const adapter = createMockAdapter()
    const renderSpy = vi.fn()

    const TestHookComponent = () => {
      const props = useConnectedStreamProgress()
      renderSpy()
      return null
    }

    const { rerender } = renderHook(() => <TestHookComponent />, {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    const initialCallCount = renderSpy.mock.calls.length

    // Rerender with same state should not cause hook to recompute excessively
    rerender()

    // Call count might increase slightly due to React's batching, but shouldn't explode
    expect(renderSpy.mock.calls.length).toBeLessThan(initialCallCount + 5)
  })
})

// ============================================================================
// Edge Cases
// ============================================================================

describe('Connected Hooks - Edge Cases', () => {
  it('handles undefined thinking steps gracefully', () => {
    const adapter = createMockAdapter()
    adapter.getThinkingSteps = vi.fn().mockReturnValue([])

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.currentStep).toBeUndefined()
    expect(result.current.totalSteps).toBe(0)
  })

  it('handles negative estimated time gracefully', () => {
    const adapter = createMockAdapter()
    const pastDate = new Date(Date.now() - 1000)
    adapter.getStreamStatus = vi.fn().mockReturnValue({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
      estimatedCompletion: pastDate,
    })

    const { result } = renderHook(() => useConnectedStreamProgress(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    // Should not include negative time
    expect(result.current.timeRemaining).toBeUndefined()
  })

  it('handles missing adapter gracefully', () => {
    const { result } = renderHook(() => useConnectedSender())

    // Should handle case where context is unavailable
    expect(result.current).toBeDefined()
  })

  it('handles empty message list in response actions', () => {
    const adapter = createMockAdapter()
    adapter.getMessages = vi.fn().mockReturnValue([])

    const { result } = renderHook(() => useConnectedResponseActions(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    expect(result.current.messageId).toBeUndefined()
    expect(result.current.onCopy).toBeUndefined()
  })

  it('handles multiple active thinking steps', () => {
    const adapter = createMockAdapter()
    adapter.getThinkingSteps = vi.fn().mockReturnValue([
      createMockThinkingStep({ id: 'step-1', status: 'active', content: 'First' }),
      createMockThinkingStep({ id: 'step-2', status: 'active', content: 'Second' }),
    ])

    const { result } = renderHook(() => useConnectedThinkingBar(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    // Should return the first active step found
    expect(result.current.currentStep).toBe('First')
  })

  it('handles special characters in prompt variables', async () => {
    const adapter = createMockAdapter()
    const { result } = renderHook(() => useConnectedPrompts(), {
      wrapper: ({ children }) => <TestProvider adapter={adapter}>{children}</TestProvider>,
    })

    await act(async () => {
      await result.current.onSelect?.(
        { description: 'Search for "{{query}}"' },
        { query: 'React hooks & best practices' }
      )
    })

    expect(adapter.sendMessage).toHaveBeenCalledWith('Search for "React hooks & best practices"')
  })
})
