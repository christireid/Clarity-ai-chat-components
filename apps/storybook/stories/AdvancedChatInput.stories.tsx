import type { Meta, StoryObj } from '@storybook/react'
import { AdvancedChatInput, type Suggestion } from '@clarity-chat/react'
import { useState } from 'react'
import type { SavedPrompt } from '@clarity-chat/types'

const meta = {
  title: 'Components/AdvancedChatInput',
  component: AdvancedChatInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdvancedChatInput>

export default meta
type Story = StoryObj<typeof meta>

// Mock prompts
const mockPrompts: SavedPrompt[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'code-review',
    content: 'Please review this code and provide feedback on: 1) Code quality, 2) Best practices, 3) Potential bugs',
    description: 'Request a thorough code review',
    category: 'Development',
    tags: ['code', 'review'],
    variables: [],
    usageCount: 45,
    isFavorite: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'explain',
    content: 'Explain {{topic}} in simple terms that a beginner can understand',
    description: 'Simplify complex topics',
    category: 'Education',
    tags: ['explain', 'beginner'],
    variables: [{ name: 'topic', required: true }],
    usageCount: 32,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'debug',
    content: 'Help me debug this issue: {{description}}. Provide step-by-step troubleshooting',
    description: 'Debug assistance',
    category: 'Development',
    tags: ['debug', 'help'],
    variables: [{ name: 'description', required: true }],
    usageCount: 28,
    isFavorite: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const InteractiveStory = () => {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleSubmit = (content: string, attachments?: any[]) => {
    setMessages((prev) => [...prev, content])
    console.log('Message submitted:', content, attachments)
  }

  const handleSuggestionRequest = async (query: string, trigger: '@' | '/'): Promise<Suggestion[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (trigger === '@') {
      return mockPrompts
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .map((p) => ({
          id: p.id,
          type: 'prompt',
          label: p.name,
          description: p.description,
          value: p.content,
          icon: '💡',
        }))
    }

    // Commands
    const commands: Suggestion[] = [
      { id: '1', type: 'command', label: 'help', description: 'Show available commands', value: '/help', icon: '❓' },
      { id: '2', type: 'command', label: 'clear', description: 'Clear conversation', value: '/clear', icon: '🧹' },
      { id: '3', type: 'command', label: 'export', description: 'Export chat history', value: '/export', icon: '📥' },
      { id: '4', type: 'command', label: 'model', description: 'Switch AI model', value: '/model', icon: '🤖' },
      { id: '5', type: 'command', label: 'summarize', description: 'Summarize conversation', value: '/summarize', icon: '📝' },
    ]

    return commands.filter((c) => c.label.includes(query.toLowerCase()))
  }

  const handleFileUpload = async (files: File[]) => {
    console.log('Files uploaded:', files)
    return files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      mimeType: file.type,
    }))
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium mb-2">Try these features:</p>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Type <kbd className="px-1 py-0.5 text-xs border rounded">@</kbd> to see prompt suggestions</li>
          <li>• Type <kbd className="px-1 py-0.5 text-xs border rounded">/</kbd> to see available commands</li>
          <li>• Use <kbd className="px-1 py-0.5 text-xs border rounded">Tab</kbd> or <kbd className="px-1 py-0.5 text-xs border rounded">Enter</kbd> to autocomplete</li>
          <li>• Click the 📎 button or drag & drop files</li>
          <li>• Press <kbd className="px-1 py-0.5 text-xs border rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 text-xs border rounded">Shift+Enter</kbd> for new line</li>
        </ul>
      </div>

      {messages.length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <p className="font-semibold text-sm">Sent Messages:</p>
          {messages.map((msg, i) => (
            <div key={i} className="p-2 bg-background rounded text-sm">
              {msg}
            </div>
          ))}
        </div>
      )}

      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        onSuggestionRequest={handleSuggestionRequest}
        onFileUpload={handleFileUpload}
        savedPrompts={mockPrompts}
        maxFiles={5}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveStory />,
}

export const WithCharacterLimit: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={console.log}
        maxLength={280}
      />
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState('This input is disabled...')
    return (
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={console.log}
        disabled
      />
    )
  },
}
