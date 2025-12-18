import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Hooks API Reference - Clarity Chat',
  description: 'Complete reference for all Clarity Chat hooks.',
}

export default function HooksAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Hooks API</h1>
        <p className="docs-lead">
          Complete reference for all Clarity Chat hooks.
        </p>
      </div>

      <section className="docs-section">
        <h2>useChat</h2>
        <p>
          Main hook for managing chat state and operations.
        </p>

        <h3>Signature</h3>
        <CodeBlock
          language="typescript"
          code={`function useChat(options?: UseChatOptions): UseChatReturn`}
        />

        <h3>Options</h3>
        <CodeBlock
          language="typescript"
          code={`interface UseChatOptions {
  initialMessages?: Message[]
  onError?: (error: Error) => void
  maxMessages?: number
}`}
        />

        <h3>Return Value</h3>
        <CodeBlock
          language="typescript"
          code={`interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}`}
        />

        <h3>Usage</h3>
        <CodeBlock
          language="typescript"
          code={`const { 
  messages, 
  isLoading, 
  sendMessage,
  undo,
  redo,
} = useChat({
  initialMessages: [{
    id: '1',
    role: 'assistant',
    content: 'Hello!',
    timestamp: Date.now(),
  }],
  onError: (error) => logger.error(error),
})`}
        />
      </section>

      <section className="docs-section">
        <h2>useStreamingChat</h2>
        <p>
          Hook for handling streaming AI responses with Server-Sent Events.
        </p>

        <h3>Signature</h3>
        <CodeBlock
          language="typescript"
          code={`function useStreamingChat(options: UseStreamingChatOptions): UseStreamingChatReturn`}
        />

        <h3>Options</h3>
        <CodeBlock
          language="typescript"
          code={`interface UseStreamingChatOptions {
  apiEndpoint: string
  onChunk?: (chunk: string) => void
  onComplete?: (fullMessage: string) => void
  onError?: (error: Error) => void
}`}
        />

        <h3>Return Value</h3>
        <CodeBlock
          language="typescript"
          code={`interface UseStreamingChatReturn {
  messages: Message[]
  isStreaming: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  cancelStream: () => void
}`}
        />
      </section>

      <section className="docs-section">
        <h2>useMessageOperations</h2>
        <p>
          Hook for message editing, regeneration, and branching.
        </p>

        <h3>Signature</h3>
        <CodeBlock
          language="typescript"
          code={`function useMessageOperations(messages: Message[]): UseMessageOperationsReturn`}
        />

        <h3>Return Value</h3>
        <CodeBlock
          language="typescript"
          code={`interface UseMessageOperationsReturn {
  messages: Message[]
  editMessage: (id: string, newContent: string) => void
  deleteMessage: (id: string) => void
  regenerateMessage: (id: string) => Promise<void>
  branchFromMessage: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/components">Components API</a> - Component reference</li>
          <li><a href="/reference/api/types">Types</a> - Type definitions</li>
          <li><a href="/examples">Examples</a> - See hooks in action</li>
          <li><a href="/cookbook">Cookbook</a> - Common patterns</li>
        </ul>
      </section>
    </div>
  )
}
