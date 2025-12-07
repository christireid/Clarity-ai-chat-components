'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useMessageOperations | Clarity Chat',
  description: 'CRUD operations for messages with undo/redo, branching, and versioning.',
}

const useMessageOperationsOptions: Prop[] = [
  {
    name: 'initialMessages',
    type: 'MessageWithOperations[]',
    description: 'Initial messages to load.',
  },
  {
    name: 'maxHistorySize',
    type: 'number',
    default: '50',
    description: 'Maximum undo history size.',
  },
  {
    name: 'onEdit',
    type: '(messageId: string, newContent: string) => void',
    description: 'Callback when message is edited.',
  },
  {
    name: 'onRegenerate',
    type: '(messageId: string) => void',
    description: 'Callback when message is regenerated.',
  },
  {
    name: 'onBranch',
    type: '(branchId: string, parentMessageId: string) => void',
    description: 'Callback when conversation is branched.',
  },
  {
    name: 'onDelete',
    type: '(messageId: string) => void',
    description: 'Callback when message is deleted.',
  },
]

const useMessageOperationsReturn: Prop[] = [
  {
    name: 'messages',
    type: 'MessageWithOperations[]',
    description: 'All messages in the conversation.',
  },
  {
    name: 'addMessage',
    type: '(message: Omit<MessageWithOperations, "id" | "timestamp">) => string',
    description: 'Add a new message. Returns message ID.',
  },
  {
    name: 'editMessage',
    type: '(messageId: string, newContent: string) => void',
    description: 'Edit message content with version tracking.',
  },
  {
    name: 'startEditing',
    type: '(messageId: string) => void',
    description: 'Start editing mode for a message.',
  },
  {
    name: 'cancelEditing',
    type: '(messageId: string) => void',
    description: 'Cancel editing mode.',
  },
  {
    name: 'regenerateMessage',
    type: '(messageId: string) => void',
    description: 'Regenerate an assistant message.',
  },
  {
    name: 'deleteMessage',
    type: '(messageId: string) => void',
    description: 'Delete a message.',
  },
  {
    name: 'branchConversation',
    type: '(messageId: string) => string',
    description: 'Create a new conversation branch from a message. Returns branch ID.',
  },
  {
    name: 'getMessagesUpTo',
    type: '(messageId: string) => MessageWithOperations[]',
    description: 'Get all messages up to a specific message.',
  },
  {
    name: 'getBranches',
    type: '() => Map<string, MessageWithOperations[]>',
    description: 'Get all conversation branches.',
  },
  {
    name: 'switchToBranch',
    type: '(branchId: string) => void',
    description: 'Switch to a different conversation branch.',
  },
  {
    name: 'undo',
    type: '() => void',
    description: 'Undo last operation.',
  },
  {
    name: 'redo',
    type: '() => void',
    description: 'Redo last undone operation.',
  },
  {
    name: 'canUndo',
    type: 'boolean',
    description: 'Whether undo is available.',
  },
  {
    name: 'canRedo',
    type: 'boolean',
    description: 'Whether redo is available.',
  },
]

export default function UseMessageOperationsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useMessageOperations</h1>

      <p className="lead">
        Complete message management with CRUD operations, undo/redo, conversation branching,
        and edit history. Perfect for building advanced chat interfaces with message editing
        and conversation exploration.
      </p>

      <Callout type="info" title="Message Management">
        <p>
          This hook provides a complete solution for managing messages with undo/redo,
          branching, and version tracking. Ideal for chat applications that need
          advanced message manipulation features.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useMessageOperations } from '@clarity-chat/react'

function Chat() {
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    initialMessages: [],
  })

  const handleSend = (content: string) => {
    addMessage({
      role: 'user',
      content,
    })
  }

  return (
    <div>
      <MessageList messages={messages} />
      <div>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useMessageOperations:
        </p>
        <CodePlayground
          initialCode={`import { useMessageOperations } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations()

  return (
    <div>
      <button onClick={() => addMessage({ role: 'user', content: 'Hello' })}>
        Add Message
      </button>
      {messages.length > 0 && (
        <>
          <button onClick={() => editMessage(messages[0].id, 'Edited!')}>
            Edit First
          </button>
          <button onClick={() => deleteMessage(messages[0].id)}>
            Delete First
          </button>
        </>
      )}
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <div>
        {messages.map(m => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">Message Editing</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useMessageOperations } from '@clarity-chat/react'

function EditableChat() {
  const {
    messages,
    addMessage,
    editMessage,
    startEditing,
    cancelEditing,
  } = useMessageOperations()

  const handleEdit = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent)
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.isEditing ? (
            <input
              defaultValue={message.content}
              onBlur={(e) => handleEdit(message.id, e.target.value)}
            />
          ) : (
            <div onClick={() => startEditing(message.id)}>
              {message.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Conversation Branching</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useMessageOperations } from '@clarity-chat/react'

function BranchingChat() {
  const {
    messages,
    branchConversation,
    getBranches,
    switchToBranch,
  } = useMessageOperations()

  const handleBranch = (messageId: string) => {
    const branchId = branchConversation(messageId)
    console.log('Created branch:', branchId)
  }

  const branches = getBranches()

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.content}</div>
          <button onClick={() => handleBranch(message.id)}>
            Branch from here
          </button>
        </div>
      ))}
      <div>
        <h3>Branches</h3>
        {Array.from(branches.keys()).map((branchId) => (
          <button key={branchId} onClick={() => switchToBranch(branchId)}>
            Switch to branch {branchId}
          </button>
        ))}
      </div>
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Undo/Redo</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useMessageOperations } from '@clarity-chat/react'

function UndoableChat() {
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    maxHistorySize: 100,
  })

  return (
    <div>
      <div className="toolbar">
        <button onClick={undo} disabled={!canUndo}>
          ↶ Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          ↷ Redo
        </button>
      </div>
      <MessageList messages={messages} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Message Regeneration</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useMessageOperations } from '@clarity-chat/react'

function RegeneratableChat() {
  const {
    messages,
    regenerateMessage,
  } = useMessageOperations({
    onRegenerate: async (messageId) => {
      // Regenerate AI response
      const newResponse = await fetch('/api/regenerate', {
        method: 'POST',
        body: JSON.stringify({ messageId }),
      }).then(r => r.json())

      // Update message with new response
      editMessage(messageId, newResponse.content)
    },
  })

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.content}
          {message.role === 'assistant' && (
            <button onClick={() => regenerateMessage(message.id)}>
              Regenerate
            </button>
          )}
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useMessageOperationsOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useMessageOperationsReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>CRUD Operations</strong> - Add, edit, delete messages with full state management</li>
          <li><strong>Undo/Redo</strong> - Complete operation history with undo/redo support</li>
          <li><strong>Conversation Branching</strong> - Create multiple conversation paths from any message</li>
          <li><strong>Message Versioning</strong> - Track edit history and versions</li>
          <li><strong>Editing Mode</strong> - Track which messages are currently being edited</li>
          <li><strong>Regeneration</strong> - Regenerate AI responses with callback support</li>
          <li><strong>Branch Management</strong> - Switch between conversation branches</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Use callbacks</strong> - Implement onEdit, onRegenerate to sync with backend</li>
          <li><strong>Limit history size</strong> - Set maxHistorySize to prevent memory issues</li>
          <li><strong>Track editing state</strong> - Use isEditing to show edit UI</li>
          <li><strong>Persist branches</strong> - Save branches to backend for multi-session support</li>
          <li><strong>Version tracking</strong> - Use version field to show edit history</li>
          <li><strong>Optimistic updates</strong> - Update UI immediately, sync with backend asynchronously</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>Core chat hook</p>
          </a>
          <a href="/reference/hooks/use-chat-enhanced" className="docs-card">
            <h3>useChatEnhanced Hook</h3>
            <p>Enhanced chat with Vercel AI SDK compatibility</p>
          </a>
          <a href="/reference/components/clarity-chat" className="docs-card">
            <h3>ClarityChat Component</h3>
            <p>Complete chat component</p>
          </a>
          <a href="/cookbook/message-operations" className="docs-card">
            <h3>Message Operations Recipe</h3>
            <p>Advanced message management patterns</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useSmartCache', href: '/reference/hooks/use-smart-cache' }}
        next={{ title: 'useAssistant', href: '/reference/hooks/use-assistant' }}
      />
    </>
  )
}
