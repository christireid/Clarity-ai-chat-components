import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Conversation Branching Example - Clarity Chat Components',
  description:
    'Implement Claude-style speculative branches with ConversationBranchVisualizer and useBranchManagement.',
}

export default function ConversationBranchingExamplePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <span className="docs-badge">Blueprint v2.1</span>
        <h1>Conversation Branching</h1>
        <p className="docs-lead">
          Give reviewers and power users the ability to explore alternative
          responses, compare iterations, and merge winning paths back into the
          main conversation.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This example pairs <code>ConversationBranchVisualizer</code> with{' '}
          <code>useBranchManagement</code> and the standard{' '}
          <code>ChatWindow</code>. Users can fork from any message, rename
          branches, and jump between paths without losing context.
        </p>
        <ul>
          <li>Create, rename, and delete branches inline.</li>
          <li>Highlight the active branch path so users never lose track.</li>
          <li>
            Persist branch metadata for analytics (message counts, last message
            preview, token usage).
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Live Demo</h2>
        <CodePlayground
          initialCode={`function ConversationBranchingDemo() {
  // Branch state management
  const [branches, setBranches] = useState([
    { id: 'main', name: 'Main', messages: [
      { id: 'm1', chatId: 'demo', role: 'user', content: 'Draft a press release about our new AI feature.', status: 'sent', createdAt: new Date(), updatedAt: new Date() },
      { id: 'm2', chatId: 'demo', role: 'assistant', content: 'Sure! Here is a first pass at the press release...', status: 'sent', createdAt: new Date(), updatedAt: new Date() },
    ]},
    { id: 'branch-1', name: 'Formal Tone', messages: [
      { id: 'm1', chatId: 'demo', role: 'user', content: 'Draft a press release about our new AI feature.', status: 'sent', createdAt: new Date(), updatedAt: new Date() },
      { id: 'm3', chatId: 'demo', role: 'assistant', content: 'Here is a more formal version of the press release...', status: 'sent', createdAt: new Date(), updatedAt: new Date() },
    ]}
  ])
  const [currentBranchId, setCurrentBranchId] = useState('main')

  const currentBranch = branches.find(b => b.id === currentBranchId)
  const messages = currentBranch?.messages || []

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setBranches(prev => prev.map(b =>
      b.id === currentBranchId
        ? { ...b, messages: [...b.messages, newMessage] }
        : b
    ))
  }

  const createBranch = () => {
    const newBranch = {
      id: \`branch-\${Date.now()}\`,
      name: \`Branch \${branches.length}\`,
      messages: [...messages] // Fork from current
    }
    setBranches(prev => [...prev, newBranch])
    setCurrentBranchId(newBranch.id)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[520px]">
      {/* Branch Selector */}
      <div className="md:w-64 border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm">Branches</h3>
          <button onClick={createBranch} className="text-xs px-2 py-1 bg-blue-500 text-white rounded">
            + Fork
          </button>
        </div>
        <div className="space-y-2">
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => setCurrentBranchId(branch.id)}
              className={\`w-full text-left p-2 rounded text-sm \${
                branch.id === currentBranchId
                  ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }\`}
            >
              <div className="font-medium">{branch.name}</div>
              <div className="text-xs text-gray-500">{branch.messages.length} messages</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 border rounded-lg h-full">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}

render(<ConversationBranchingDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <Callout type="info">
          <p>
            Store branches in your database (e.g., Postgres, Supabase,
            Firestore) and hydrate <code>useBranchManagement</code> on mount.
            Branch metadata can power reports for red teaming and QA.
          </p>
        </Callout>
      </section>
    </div>
  )
}
