import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useMessageOperations | Clarity Chat',
  description: 'CRUD operations for messages with undo/redo, branching, and versioning.'
}

export default function UseMessageOperationsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useMessageOperations</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Complete message management with CRUD operations, undo/redo, conversation branching, and edit history.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useMessageOperations } from '@clarity-chat/react'

const {
  messages,
  addMessage,
  editMessage,
  deleteMessage,
  regenerateMessage,
  branchConversation,
  undo,
  redo,
  canUndo,
  canRedo
} = useMessageOperations({
  initialMessages: [],
  onEdit: (id, content) => console.log('Edited:', id)
})

// Add message
const id = addMessage({
  role: 'user',
  content: 'Hello'
})

// Edit with version tracking
editMessage(id, 'Hello, world!')

// Undo/redo
<button onClick={undo} disabled={!canUndo}>Undo</button>
<button onClick={redo} disabled={!canRedo}>Redo</button>`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Add, edit, delete messages</li>
          <li>Regenerate AI responses</li>
          <li>Branch conversations</li>
          <li>Undo/redo with history</li>
          <li>Message versioning</li>
          <li>Editing mode tracking</li>
        </ul>
      </section>
    </div>
  )
}
