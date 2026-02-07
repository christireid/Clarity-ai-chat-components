/**
 * Live ChatAdapter that calls /api/chat for real AI responses.
 *
 * Implements the ChatAdapter interface expected by ClarityChatProvider.
 * Manages message state internally and notifies subscribers on changes,
 * so the provider can sync its React state.
 */
import type {
  ChatAdapter,
  ChatMessage,
  StreamStatus,
  ThinkingStep,
  ToolExecution,
  MessageAttachment,
  ChatConfig,
} from './clarity-chat-types'
import { parseSSEStream } from './sse-utils'

const DEFAULT_STREAM_STATUS: StreamStatus = {
  isStreaming: false,
  phase: 'idle',
  progress: 0,
  tokensUsed: 0,
}

export function createLiveChatAdapter(config: {
  apiKey: string
  model: string
}): ChatAdapter {
  let currentConfig = { ...config }
  let messages: ChatMessage[] = []
  let streamStatus: StreamStatus = { ...DEFAULT_STREAM_STATUS }
  let thinkingSteps: ThinkingStep[] = []
  const subscribers = new Set<() => void>()
  let abortController: AbortController | null = null

  const notify = () => subscribers.forEach((cb) => cb())

  return {
    sendMessage: async (content: string, attachments?: MessageAttachment[]) => {
      // Add user message
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date(),
        status: 'complete',
        attachments,
      }
      messages = [...messages, userMsg]
      notify()

      // Start streaming
      abortController = new AbortController()
      streamStatus = {
        isStreaming: true,
        phase: 'connecting',
        progress: 0,
        tokensUsed: 0,
      }
      thinkingSteps = []
      notify()

      // Create assistant message placeholder
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        status: 'streaming',
      }

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': currentConfig.apiKey,
          },
          body: JSON.stringify({
            messages: messages
              .filter((m) => m.role === 'user' || m.role === 'assistant')
              .map((m) => ({ role: m.role, content: m.content })),
            model: currentConfig.model,
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error')
          throw new Error(
            `API error ${response.status}: ${errorText.slice(0, 200)}`
          )
        }

        if (!response.body) throw new Error('No response body')

        // Add the streaming assistant message
        messages = [...messages, assistantMsg]
        streamStatus = {
          isStreaming: true,
          phase: 'receiving',
          progress: 0,
          tokensUsed: 0,
        }
        notify()

        let fullContent = ''

        for await (const event of parseSSEStream(response.body)) {
          if (event.type === 'text') {
            fullContent += event.text
            const updated: ChatMessage = {
              ...assistantMsg,
              content: fullContent,
            }
            messages = [...messages.slice(0, -1), updated]
            streamStatus = {
              isStreaming: true,
              phase: 'receiving',
              progress: 0,
              tokensUsed: Math.floor(fullContent.length / 4),
            }
            notify()
          }

          if (event.type === 'thinking') {
            const thinkingId = `think-${thinkingSteps.length}`
            const existing = thinkingSteps.find((t) => t.id === thinkingId)
            if (existing) {
              existing.content += event.thinking
            } else {
              thinkingSteps = [
                ...thinkingSteps,
                {
                  id: thinkingId,
                  content: event.thinking,
                  status: 'active' as const,
                  timestamp: new Date(),
                },
              ]
            }
            notify()
          }

          if (event.type === 'done') {
            const finalMsg: ChatMessage = {
              ...assistantMsg,
              content: fullContent,
              status: 'complete',
            }
            messages = [...messages.slice(0, -1), finalMsg]
            streamStatus = {
              isStreaming: false,
              phase: 'complete',
              progress: 100,
              tokensUsed: Math.floor(fullContent.length / 4),
            }
            thinkingSteps = thinkingSteps.map((t) => ({
              ...t,
              status: 'complete' as const,
            }))
            notify()
          }

          if (event.type === 'error') {
            throw new Error(event.error)
          }
        }

        // Ensure complete state if stream ended without message_stop
        if (streamStatus.isStreaming) {
          const finalMsg: ChatMessage = {
            ...assistantMsg,
            content: fullContent,
            status: 'complete',
          }
          messages = [...messages.slice(0, -1), finalMsg]
          streamStatus = {
            isStreaming: false,
            phase: 'complete',
            progress: 100,
            tokensUsed: Math.floor(fullContent.length / 4),
          }
          notify()
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          streamStatus = { ...DEFAULT_STREAM_STATUS }
        } else {
          streamStatus = {
            isStreaming: false,
            phase: 'error',
            progress: 0,
            tokensUsed: 0,
            error: (error as Error).message,
          }
          // Mark streaming message as error
          const lastMsg = messages[messages.length - 1]
          if (lastMsg?.status === 'streaming') {
            messages = [
              ...messages.slice(0, -1),
              {
                ...lastMsg,
                status: 'error',
                content: lastMsg.content || (error as Error).message,
              },
            ]
          }
        }
        notify()
      }

      abortController = null
    },

    stopGeneration: () => {
      abortController?.abort()
      abortController = null
      streamStatus = { ...DEFAULT_STREAM_STATUS }
      // Mark any streaming message as complete with current content
      const lastMsg = messages[messages.length - 1]
      if (lastMsg?.status === 'streaming') {
        messages = [
          ...messages.slice(0, -1),
          { ...lastMsg, status: 'complete' },
        ]
      }
      notify()
    },

    regenerate: async (messageId?: string) => {
      // Remove last assistant message
      if (messages.length >= 2) {
        const lastAssistant = [...messages]
          .reverse()
          .find((m) => m.role === 'assistant')
        if (lastAssistant) {
          messages = messages.filter((m) => m.id !== lastAssistant.id)
          notify()
        }
      }
    },

    getMessages: () => messages,
    getStreamStatus: () => streamStatus,
    getActiveTools: () => [] as ToolExecution[],
    getThinkingSteps: () => thinkingSteps,

    subscribe: (callback: () => void) => {
      subscribers.add(callback)
      return () => {
        subscribers.delete(callback)
      }
    },

    setConfig: (cfg: Partial<ChatConfig>) => {
      if (cfg.model) currentConfig.model = cfg.model
    },
  }
}
