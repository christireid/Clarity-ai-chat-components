'use client'

/**
 * Connected Component Hooks
 *
 * These hooks automatically connect clarity-chat components to the
 * ClarityChatProvider context. Use them to get pre-configured props
 * for components without manual wiring.
 *
 * @example
 * ```tsx
 * // Instead of manually wiring:
 * const { isThinking, thinkingSteps } = useClarityChat()
 * <ThinkingBar isActive={isThinking} steps={thinkingSteps.length} />
 *
 * // Use connected hook:
 * const thinkingBarProps = useConnectedThinkingBar()
 * <ThinkingBar {...thinkingBarProps} />
 *
 * // Or use the connected prop:
 * <ThinkingBar connected />
 * ```
 */

import * as React from 'react'
import {
  useClarityChat,
  useIsConnected,
  type ChatMessage,
  type StreamStatus,
  type ThinkingStep,
  type ToolExecution,
  type MessageAttachment,
} from '../../providers/ClarityChatProvider'

// ============================================================================
// ThinkingBar Connected Hook
// ============================================================================

export interface ConnectedThinkingBarProps {
  isActive: boolean
  status: 'idle' | 'thinking' | 'processing' | 'complete' | 'error'
  progress?: number
  currentStep?: string
  totalSteps?: number
  estimatedTime?: number
}

/**
 * Get props for ThinkingBar connected to ClarityChatProvider
 */
export function useConnectedThinkingBar(): ConnectedThinkingBarProps {
  const { isThinking, thinkingSteps, streamStatus } = useClarityChat()

  const currentStep = thinkingSteps.find((s) => s.status === 'active')

  return {
    isActive: isThinking || streamStatus.isStreaming,
    status: isThinking
      ? 'thinking'
      : streamStatus.phase === 'receiving'
        ? 'processing'
        : streamStatus.phase === 'complete'
          ? 'complete'
          : streamStatus.phase === 'error'
            ? 'error'
            : 'idle',
    progress: streamStatus.progress,
    currentStep: currentStep?.content,
    totalSteps: thinkingSteps.length,
    estimatedTime: streamStatus.estimatedCompletion
      ? streamStatus.estimatedCompletion.getTime() - Date.now()
      : undefined,
  }
}

// ============================================================================
// ThinkingPill Connected Hook
// ============================================================================

export interface ConnectedThinkingPillProps {
  isActive: boolean
  label?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

/**
 * Get props for ThinkingPill connected to ClarityChatProvider
 */
export function useConnectedThinkingPill(): ConnectedThinkingPillProps {
  const { isThinking, thinkingSteps, streamStatus } = useClarityChat()

  const currentStep = thinkingSteps.find((s) => s.status === 'active')

  return {
    isActive: isThinking || streamStatus.isStreaming,
    label: currentStep?.content || (streamStatus.isStreaming ? 'Generating...' : undefined),
  }
}

// ============================================================================
// StreamStatusProgress Connected Hook
// ============================================================================

export interface ConnectedStreamProgressProps {
  progress: number
  status: 'idle' | 'connecting' | 'streaming' | 'complete' | 'error'
  tokensUsed: number
  tokensTotal?: number
  timeElapsed?: number
  timeRemaining?: number
  showTokens?: boolean
  showTime?: boolean
}

/**
 * Get props for StreamStatusProgress connected to ClarityChatProvider
 */
export function useConnectedStreamProgress(): ConnectedStreamProgressProps {
  const { streamStatus } = useClarityChat()

  const timeElapsed = streamStatus.startedAt
    ? Date.now() - streamStatus.startedAt.getTime()
    : undefined

  const timeRemaining = streamStatus.estimatedCompletion
    ? streamStatus.estimatedCompletion.getTime() - Date.now()
    : undefined

  return {
    progress: streamStatus.progress,
    status:
      streamStatus.phase === 'receiving'
        ? 'streaming'
        : streamStatus.phase === 'connecting'
          ? 'connecting'
          : streamStatus.phase === 'complete'
            ? 'complete'
            : streamStatus.phase === 'error'
              ? 'error'
              : 'idle',
    tokensUsed: streamStatus.tokensUsed,
    tokensTotal: streamStatus.tokensTotal,
    timeElapsed,
    timeRemaining: timeRemaining && timeRemaining > 0 ? timeRemaining : undefined,
    showTokens: true,
    showTime: true,
  }
}

// ============================================================================
// Conversations Connected Hook
// ============================================================================

export interface ConnectedConversationsProps {
  items: Array<{
    key: string
    label: string
    messages: ChatMessage[]
  }>
  activeKey?: string
  showTimestamps?: boolean
}

/**
 * Get props for Conversations connected to ClarityChatProvider
 */
export function useConnectedConversations(): ConnectedConversationsProps {
  const { messages, streamingMessage } = useClarityChat()

  // Group messages into a single conversation for now
  // Could be extended to support multiple conversations
  return {
    items: [
      {
        key: 'main',
        label: 'Chat',
        messages,
      },
    ],
    activeKey: 'main',
    showTimestamps: true,
  }
}

// ============================================================================
// Sender Connected Hook
// ============================================================================

export interface ConnectedSenderProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => Promise<void>
  onStop?: () => void
  isLoading: boolean
  disabled?: boolean
  placeholder?: string
}

/**
 * Get props for Sender connected to ClarityChatProvider
 */
export function useConnectedSender(): ConnectedSenderProps {
  const { sendMessage, stopGeneration, isStreaming } = useClarityChat()

  return {
    onSend: sendMessage,
    onStop: stopGeneration,
    isLoading: isStreaming,
    disabled: false,
    placeholder: isStreaming ? 'Generating response...' : 'Type a message...',
  }
}

// ============================================================================
// ToolCard Connected Hook
// ============================================================================

export interface ConnectedToolCardProps {
  tools: ToolExecution[]
  onApprove?: (toolId: string) => void
  onReject?: (toolId: string) => void
}

/**
 * Get props for ToolCard/ToolExecutionCard connected to ClarityChatProvider
 */
export function useConnectedToolCard(): ConnectedToolCardProps {
  const { activeTools, approveTool, rejectTool } = useClarityChat()

  return {
    tools: activeTools,
    onApprove: approveTool,
    onReject: rejectTool,
  }
}

// ============================================================================
// ChainOfThought Connected Hook
// ============================================================================

export interface ConnectedChainOfThoughtProps {
  steps: Array<{
    id: string
    content: string
    status: 'pending' | 'active' | 'complete'
  }>
  isExpanded?: boolean
}

/**
 * Get props for ChainOfThought connected to ClarityChatProvider
 */
export function useConnectedChainOfThought(): ConnectedChainOfThoughtProps {
  const { thinkingSteps, isThinking } = useClarityChat()

  return {
    steps: thinkingSteps.map((step) => ({
      id: step.id,
      content: step.content,
      status: step.status,
    })),
    isExpanded: isThinking,
  }
}

// ============================================================================
// ResponseActions Connected Hook
// ============================================================================

export interface ConnectedResponseActionsProps {
  onRegenerate?: () => void
  onCopy?: () => void
  onLike?: () => void
  onDislike?: () => void
  isRegenerating?: boolean
  messageId?: string
}

/**
 * Get props for ResponseActions connected to ClarityChatProvider
 */
export function useConnectedResponseActions(
  messageId?: string
): ConnectedResponseActionsProps {
  const { regenerate, lastMessage, isStreaming, emit } = useClarityChat()

  const targetMessageId = messageId || lastMessage?.id

  return {
    onRegenerate: targetMessageId
      ? () => regenerate(targetMessageId)
      : undefined,
    onCopy: lastMessage
      ? () => {
          navigator.clipboard.writeText(lastMessage.content)
          emit('message:sent', { action: 'copy', messageId: targetMessageId })
        }
      : undefined,
    onLike: () => emit('message:sent', { action: 'like', messageId: targetMessageId }),
    onDislike: () => emit('message:sent', { action: 'dislike', messageId: targetMessageId }),
    isRegenerating: isStreaming,
    messageId: targetMessageId,
  }
}

// ============================================================================
// Welcome Connected Hook
// ============================================================================

export interface ConnectedWelcomeProps {
  onSuggestionClick?: (suggestion: { text: string }) => void
}

/**
 * Get props for Welcome connected to ClarityChatProvider
 */
export function useConnectedWelcome(): ConnectedWelcomeProps {
  const { sendMessage } = useClarityChat()

  return {
    onSuggestionClick: (suggestion) => {
      sendMessage(suggestion.text)
    },
  }
}

// ============================================================================
// Prompts Connected Hook
// ============================================================================

export interface ConnectedPromptsProps {
  onSelect?: (prompt: { description: string }, variables?: Record<string, string>) => void
}

/**
 * Get props for Prompts connected to ClarityChatProvider
 */
export function useConnectedPrompts(): ConnectedPromptsProps {
  const { sendMessage } = useClarityChat()

  return {
    onSelect: (prompt, variables) => {
      let text = prompt.description
      if (variables) {
        Object.entries(variables).forEach(([name, value]) => {
          text = text.replace(new RegExp(`\\{\\{${name}\\}\\}`, 'g'), value)
        })
      }
      sendMessage(text)
    },
  }
}

// ============================================================================
// Suggestion Connected Hook
// ============================================================================

export interface ConnectedSuggestionProps {
  onSelect?: (suggestion: { text: string }) => void
}

/**
 * Get props for Suggestion connected to ClarityChatProvider
 */
export function useConnectedSuggestion(): ConnectedSuggestionProps {
  const { sendMessage, emit } = useClarityChat()

  return {
    onSelect: (suggestion) => {
      emit('suggestion:selected', suggestion)
      sendMessage(suggestion.text)
    },
  }
}

// ============================================================================
// Attachments Connected Hook
// ============================================================================

export interface ConnectedAttachmentsProps {
  attachments: MessageAttachment[]
  onRemove?: (id: string) => void
}

/**
 * Get props for Attachments from current streaming message
 */
export function useConnectedAttachments(): ConnectedAttachmentsProps {
  const { streamingMessage } = useClarityChat()

  return {
    attachments: streamingMessage?.attachments || [],
    onRemove: undefined, // Handled by Sender
  }
}

// ============================================================================
// ApprovalCard Connected Hook
// ============================================================================

export interface ConnectedApprovalCardProps {
  pendingApprovals: ToolExecution[]
  onApprove: (toolId: string) => void
  onReject: (toolId: string, reason?: string) => void
}

/**
 * Get props for ApprovalCard connected to ClarityChatProvider
 */
export function useConnectedApprovalCard(): ConnectedApprovalCardProps {
  const { pendingApprovals, approveTool, rejectTool } = useClarityChat()

  return {
    pendingApprovals,
    onApprove: approveTool,
    onReject: rejectTool,
  }
}

// ============================================================================
// Universal Connected Props Hook
// ============================================================================

/**
 * Get connected props for any component by name
 */
export function useConnectedProps(
  componentName: string
): Record<string, unknown> | null {
  const isConnected = useIsConnected()

  if (!isConnected) return null

  switch (componentName.toLowerCase()) {
    case 'thinkingbar':
      return useConnectedThinkingBar() as unknown as Record<string, unknown>
    case 'thinkingpill':
      return useConnectedThinkingPill() as unknown as Record<string, unknown>
    case 'streamstatusprogress':
    case 'streamprogress':
      return useConnectedStreamProgress() as unknown as Record<string, unknown>
    case 'conversations':
      return useConnectedConversations() as unknown as Record<string, unknown>
    case 'sender':
      return useConnectedSender() as unknown as Record<string, unknown>
    case 'toolcard':
    case 'toolexecutioncard':
      return useConnectedToolCard() as unknown as Record<string, unknown>
    case 'chainofthought':
      return useConnectedChainOfThought() as unknown as Record<string, unknown>
    case 'responseactions':
      return useConnectedResponseActions() as unknown as Record<string, unknown>
    case 'welcome':
      return useConnectedWelcome() as unknown as Record<string, unknown>
    case 'prompts':
      return useConnectedPrompts() as unknown as Record<string, unknown>
    case 'suggestion':
      return useConnectedSuggestion() as unknown as Record<string, unknown>
    case 'attachments':
      return useConnectedAttachments() as unknown as Record<string, unknown>
    case 'approvalcard':
      return useConnectedApprovalCard() as unknown as Record<string, unknown>
    default:
      return null
  }
}

// ============================================================================
// HOC for Connected Components
// ============================================================================

export interface WithConnectedProps {
  connected?: boolean
}

/**
 * HOC that adds `connected` prop support to any component
 */
export function withConnected<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P & WithConnectedProps> {
  const ConnectedComponent: React.FC<P & WithConnectedProps> = ({
    connected,
    ...props
  }) => {
    const connectedProps = connected ? useConnectedProps(componentName) : null

    const mergedProps = connectedProps
      ? { ...connectedProps, ...props }
      : props

    return React.createElement(WrappedComponent, mergedProps as P)
  }

  ConnectedComponent.displayName = `Connected(${componentName})`

  return ConnectedComponent
}

// Re-export types
export type {
  ChatMessage,
  StreamStatus,
  ThinkingStep,
  ToolExecution,
  MessageAttachment,
}
