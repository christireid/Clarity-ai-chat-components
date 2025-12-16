import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMessageOperations } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useMessageOperations Hook**
 * 
 * Comprehensive hook for managing message CRUD operations with undo/redo,
 * editing, regeneration, and conversation branching.
 * 
 * **Key Features:**
 * - Add, edit, delete messages
 * - Undo/redo functionality
 * - Message editing with versioning
 * - Message regeneration
 * - Conversation branching
 * - Operation history tracking
 * 
 * **Use Cases:**
 * - Chat applications with editing
 * - Conversation management
 * - Message history
 * - Branching conversations
 */
const meta = {
  title: 'Hooks/State/UseMessageOperations',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useMessageOperations\` hook provides comprehensive message management
with CRUD operations, undo/redo, editing, regeneration, and branching.

## Features

- ✅ Add, edit, delete messages
- ✅ Undo/redo functionality
- ✅ Message editing with versioning
- ✅ Message regeneration
- ✅ Conversation branching
- ✅ Operation history tracking

## Basic Usage

\`\`\`tsx
const {
  messages,
  addMessage,
  editMessage,
  deleteMessage,
  regenerateMessage,
  undo,
  redo,
  canUndo,
  canRedo
} = useMessageOperations({
  initialMessages: [],
  onEdit: (id, content) => SecureLogger.debug('Edited:', id, content),
  onRegenerate: (id) => SecureLogger.debug('Regenerating:', id)
})
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function BasicOperationsDemo() {
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

  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    addMessage({
      role: 'user',
      content: input,
    })
    setInput('')
  }

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      editMessage(editingId, editContent)
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Add a message to get started!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg border ${
                msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'
              }`}
            >
              {editingId === msg.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs font-medium mb-1">{msg.role}</div>
                  <div className="text-sm">{msg.content}</div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartEdit(msg.id, msg.content)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <Button onClick={handleAdd} disabled={!input.trim()}>
          Add
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={undo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="outline" onClick={redo} disabled={!canRedo}>
          Redo
        </Button>
      </div>

      <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
        <div>
          <strong>Messages:</strong> {messages.length}
        </div>
        <div>
          <strong>Can Undo:</strong> {canUndo ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Can Redo:</strong> {canRedo ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  )
}

export const BasicOperations: Story = {
  render: () => <BasicOperationsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic message operations: add, edit, delete with undo/redo support.',
      },
    },
  },
}

function MessageEditingDemo() {
  const { messages, addMessage, editMessage, startEditing, cancelEditing } =
    useMessageOperations({
      initialMessages: [
        {
          id: '1',
          role: 'user',
          content: 'Hello, this is a message that can be edited.',
          timestamp: Date.now(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'This is a response that can also be edited.',
          timestamp: Date.now(),
        },
      ],
    })

  const [input, setInput] = useState('')

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg border ${
              msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'
            } ${msg.isEditing ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="text-xs font-medium mb-1">
              {msg.role} {msg.version && `(v${msg.version})`}
            </div>
            {msg.isEditing ? (
              <div className="space-y-2">
                <textarea
                  defaultValue={msg.content}
                  className="w-full px-2 py-1 border rounded text-sm"
                  rows={3}
                  id={`edit-${msg.id}`}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const textarea = document.getElementById(
                        `edit-${msg.id}`
                      ) as HTMLTextAreaElement
                      if (textarea) {
                        editMessage(msg.id, textarea.value)
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => cancelEditing(msg.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm">{msg.content}</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEditing(msg.id)}
                  className="mt-2"
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              addMessage({ role: 'user', content: input })
              setInput('')
            }
          }}
          placeholder="Add a new message..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <Button onClick={() => addMessage({ role: 'user', content: input })}>
          Add
        </Button>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
        <strong>Editing Mode:</strong> Click "Edit" on any message to enter editing mode.
        Messages track version numbers when edited.
      </div>
    </div>
  )
}

export const MessageEditing: Story = {
  render: () => <MessageEditingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates message editing with version tracking.',
      },
    },
  },
}

function RegenerationDemo() {
  const { messages, addMessage, regenerateMessage } = useMessageOperations({
    initialMessages: [
      {
        id: '1',
        role: 'user',
        content: 'Tell me a joke',
        timestamp: Date.now() - 60000,
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Why did the chicken cross the road? To get to the other side!',
        timestamp: Date.now() - 30000,
      },
    ],
    onRegenerate: (id) => {
      SecureLogger.debug('Regenerating message:', id)
      // In a real app, this would trigger an API call
    },
  })

  const [input, setInput] = useState('')

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg border ${
              msg.role === 'user' ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            <div className="text-xs font-medium mb-1">{msg.role}</div>
            <div className="text-sm">{msg.content}</div>
            {msg.role === 'assistant' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => regenerateMessage(msg.id)}
                className="mt-2"
              >
                Regenerate
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              addMessage({ role: 'user', content: input })
              setInput('')
            }
          }}
          placeholder="Ask for something to regenerate..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <Button onClick={() => addMessage({ role: 'user', content: input })}>
          Send
        </Button>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs">
        <strong>Regeneration:</strong> Click "Regenerate" on assistant messages to
        request a new response. In a real app, this would trigger an API call.
      </div>
    </div>
  )
}

export const Regeneration: Story = {
  render: () => <RegenerationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates message regeneration functionality.',
      },
    },
  },
}
