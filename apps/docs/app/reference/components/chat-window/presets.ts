import { PlaygroundPreset, PlaygroundControl } from '@/components/Demo/EnhancedPlayground'

export const chatWindowPresets: PlaygroundPreset[] = [
  {
    name: 'Basic',
    description: 'Simple chat window',
    code: `import { ChatWindow, Message } from '@clarity-chat/react'

export default function Example() {
  const messages = [
    { id: '1', role: 'user', content: 'Hello!' },
    { id: '2', role: 'assistant', content: 'Hi! How can I help you today?' },
  ]

  return (
    <div className="h-96 border rounded-lg">
      <ChatWindow messages={messages} />
    </div>
  )
}`,
  },
  {
    name: 'With Avatar',
    description: 'Messages with avatars',
    code: `import { ChatWindow, Message } from '@clarity-chat/react'

export default function Example() {
  const messages = [
    {
      id: '1',
      role: 'user',
      content: 'Can you help me with something?',
      avatar: '👤',
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Of course! I\'d be happy to help. What do you need?',
      avatar: '🤖',
    },
  ]

  return (
    <div className="h-96 border rounded-lg">
      <ChatWindow messages={messages} showAvatars />
    </div>
  )
}`,
  },
  {
    name: 'With Timestamps',
    description: 'Show message timestamps',
    code: `import { ChatWindow } from '@clarity-chat/react'

export default function Example() {
  const messages = [
    {
      id: '1',
      role: 'user',
      content: 'What time is it?',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      role: 'assistant',
      content: 'It\'s time to build amazing things!',
      timestamp: new Date(Date.now() - 120000),
    },
  ]

  return (
    <div className="h-96 border rounded-lg">
      <ChatWindow messages={messages} showTimestamps />
    </div>
  )
}`,
  },
  {
    name: 'Loading State',
    description: 'Chat with loading indicator',
    code: `import { ChatWindow } from '@clarity-chat/react'

export default function Example() {
  const messages = [
    { id: '1', role: 'user', content: 'Tell me a joke' },
    { id: '2', role: 'assistant', content: 'Let me think...' },
  ]

  return (
    <div className="h-96 border rounded-lg">
      <ChatWindow messages={messages} isLoading />
    </div>
  )
}`,
  },
  {
    name: 'With Input',
    description: 'Full chat interface with input',
    code: `import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function Example() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Hi! Send me a message!' },
  ])

  const handleSend = (content: string) => {
    setMessages([...messages, {
      id: Date.now().toString(),
      role: 'user',
      content,
    }])
  }

  return (
    <div className="h-96 border rounded-lg">
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        placeholder="Type a message..."
      />
    </div>
  )
}`,
  },
]

export const chatWindowControls: PlaygroundControl[] = [
  {
    name: 'showAvatars',
    label: 'Show Avatars',
    type: 'boolean',
    defaultValue: true,
    description: 'Display user avatars',
  },
  {
    name: 'showTimestamps',
    label: 'Show Timestamps',
    type: 'boolean',
    defaultValue: false,
    description: 'Display message timestamps',
  },
  {
    name: 'isLoading',
    label: 'Loading State',
    type: 'boolean',
    defaultValue: false,
    description: 'Show loading indicator',
  },
  {
    name: 'enableMarkdown',
    label: 'Enable Markdown',
    type: 'boolean',
    defaultValue: true,
    description: 'Render markdown in messages',
  },
]
