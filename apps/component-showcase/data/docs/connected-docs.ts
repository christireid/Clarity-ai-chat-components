import type { ComponentDoc } from '@/components/doc-panel'

export const connectedDocs: Record<string, ComponentDoc | ComponentDoc[]> = {
  // ===========================================================================
  // Live Connected Chat
  // ===========================================================================
  'Live Connected Chat': [
    {
      name: 'ClarityChatProvider',
      description:
        'Unified context provider that connects all clarity-chat components. Provides shared state for messages, streaming, tools, thinking, and configuration via React context. Wrap your chat UI in this provider and all child components can use connected hooks.',
      importPath: '@clarity-chat/react',
      usageCode: `import { ClarityChatProvider } from '@clarity-chat/react'
import { createLiveChatAdapter } from '@/lib/live-chat-adapter'

function ChatApp() {
  const adapter = createLiveChatAdapter({
    apiKey: 'sk-ant-...',
    model: 'claude-sonnet-4-5-20250929',
  })

  return (
    <ClarityChatProvider adapter={adapter}>
      <ChatMessages />
      <ChatInput />
      <StatusBar />
    </ClarityChatProvider>
  )
}`,
      props: [
        {
          name: 'adapter',
          type: 'ChatAdapter',
          description:
            'Chat adapter implementing sendMessage, stopGeneration, getMessages, subscribe, etc. Use createLiveChatAdapter for real Anthropic API calls.',
          commonlyUsed: true,
        },
        {
          name: 'config',
          type: 'ChatConfig',
          default: '{ streaming: true }',
          description:
            'Initial configuration with model, temperature, maxTokens, systemPrompt, and streaming toggle.',
        },
        {
          name: 'initialMessages',
          type: 'ChatMessage[]',
          default: '[]',
          description: 'Pre-seed the conversation with existing messages.',
        },
        {
          name: 'onMessagesChange',
          type: '(messages: ChatMessage[]) => void',
          description:
            'Callback fired whenever the messages array changes. Useful for persistence or analytics.',
        },
        {
          name: 'onError',
          type: '(error: Error) => void',
          description: 'Global error handler for adapter errors.',
        },
      ],
      notes: [
        'The provider syncs with external adapters via the subscribe/getMessages pattern.',
        'All connected hooks (useChatMessages, useChatStreamStatus, etc.) must be used inside a ClarityChatProvider.',
        'If no adapter is provided, a built-in mock adapter is used for development.',
      ],
      sourceFile: 'packages/react/src/providers/ClarityChatProvider.tsx',
    },
    {
      name: 'useClarityChatContext',
      description:
        'Hook providing the full ClarityChatProvider context: messages, stream status, thinking steps, and all actions (sendMessage, stopGeneration, clearMessages, etc.).',
      importPath: '@clarity-chat/react',
      usageCode: `import { useClarityChatContext } from '@clarity-chat/react'

function ChatInput() {
  const { sendMessage, stopGeneration, isStreaming, clearMessages } =
    useClarityChatContext()

  return (
    <div>
      <button onClick={() => sendMessage('Hello!')}>Send</button>
      {isStreaming && <button onClick={stopGeneration}>Stop</button>}
    </div>
  )
}`,
      props: [
        {
          name: 'messages',
          type: 'ChatMessage[]',
          description: 'All messages in the conversation.',
          commonlyUsed: true,
        },
        {
          name: 'streamStatus',
          type: 'StreamStatus',
          description:
            'Current streaming state with phase, progress, tokensUsed, and error fields.',
          commonlyUsed: true,
        },
        {
          name: 'isStreaming',
          type: 'boolean',
          description: 'Whether a response is currently being streamed.',
          commonlyUsed: true,
        },
        {
          name: 'sendMessage',
          type: '(content: string) => Promise<void>',
          description:
            'Send a user message and trigger AI response generation.',
          commonlyUsed: true,
        },
        {
          name: 'stopGeneration',
          type: '() => void',
          description: 'Abort the current streaming response.',
          commonlyUsed: true,
        },
        {
          name: 'clearMessages',
          type: '() => void',
          description: 'Clear all messages from the conversation.',
        },
        {
          name: 'thinkingSteps',
          type: 'ThinkingStep[]',
          description: 'Extended thinking steps from the AI model.',
        },
      ],
      notes: [
        'Must be used inside a ClarityChatProvider — throws if used outside.',
        'For focused access, use useChatMessages(), useChatStreamStatus(), or useChatThinking() instead.',
      ],
    },
  ],

  // ===========================================================================
  // Provider Architecture
  // ===========================================================================
  'Provider Architecture': {
    name: 'ChatAdapter',
    description:
      'Interface for connecting any AI backend to ClarityChatProvider. Manages internal state and notifies the provider via a subscribe/callback pattern. Implement this to connect custom AI services.',
    importPath: '@clarity-chat/react',
    importName: 'ChatAdapter (type)',
    usageCode: `import type { ChatAdapter } from '@/lib/clarity-chat-types'

function createMyAdapter(): ChatAdapter {
  let messages = []
  const subscribers = new Set()

  return {
    sendMessage: async (content) => {
      // Call your AI API here
      messages.push({ role: 'user', content, ... })
      subscribers.forEach(cb => cb())
    },
    stopGeneration: () => { /* abort logic */ },
    regenerate: async () => { /* remove last + resend */ },
    getMessages: () => messages,
    getStreamStatus: () => ({ isStreaming: false, phase: 'idle', progress: 0, tokensUsed: 0 }),
    getActiveTools: () => [],
    getThinkingSteps: () => [],
    subscribe: (cb) => {
      subscribers.add(cb)
      return () => subscribers.delete(cb)
    },
  }
}`,
    props: [
      {
        name: 'sendMessage',
        type: '(content: string, attachments?: MessageAttachment[]) => Promise<void>',
        required: true,
        description: 'Send a message to the AI and process the response.',
        commonlyUsed: true,
      },
      {
        name: 'stopGeneration',
        type: '() => void',
        required: true,
        description: 'Abort the current generation.',
        commonlyUsed: true,
      },
      {
        name: 'getMessages',
        type: '() => ChatMessage[]',
        required: true,
        description: 'Return the current message array.',
        commonlyUsed: true,
      },
      {
        name: 'getStreamStatus',
        type: '() => StreamStatus',
        required: true,
        description: 'Return the current streaming status.',
      },
      {
        name: 'subscribe',
        type: '(callback: () => void) => () => void',
        required: true,
        description:
          'Register a callback for state changes. Returns an unsubscribe function.',
        commonlyUsed: true,
      },
      {
        name: 'regenerate',
        type: '(messageId?: string) => Promise<void>',
        required: true,
        description: 'Regenerate the last assistant response.',
      },
    ],
    notes: [
      'The provider calls subscribe() on mount and syncs state on every callback.',
      'Adapters are plain functions — no React hooks or class hierarchy needed.',
      'See createLiveChatAdapter in lib/live-chat-adapter.ts for a full implementation.',
    ],
  },
}
