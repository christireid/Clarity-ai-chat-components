import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from '@clarity-chat/primitives'

/**
 * ScrollArea component provides a styled scrollable container.
 * 
 * **Key Features:**
 * - Custom styled scrollbars
 * - Smooth scrolling
 * - Cross-browser consistent
 * - Keyboard accessible
 * 
 * **Use Cases:**
 * - Message lists
 * - Sidebar navigation
 * - Content overflow
 * - Long form content
 */
const meta = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A styled scrollable container with custom scrollbars.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border p-4">
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold">Line {i + 1}:</span> This is a scrollable
            content area with custom styled scrollbars. Scroll to see more content.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const MessageList: Story = {
  render: () => (
    <div className="w-96 border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b">
        <h3 className="font-semibold">Chat Messages</h3>
      </div>
      
      <ScrollArea className="h-96 p-4">
        <div className="space-y-4">
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  i % 2 === 0
                    ? 'bg-gray-100'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <p className="text-sm">
                  {i % 2 === 0
                    ? 'Hello! This is a user message.'
                    : 'Hi there! This is an AI response message.'}
                </p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}

export const TagList: Story = {
  render: () => (
    <div className="w-80">
      <h3 className="font-semibold mb-3">Available Tags</h3>
      <ScrollArea className="h-48 border rounded-lg p-3">
        <div className="flex flex-wrap gap-2">
          {[
            'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'AI',
            'Machine Learning', 'Data Science', 'Web Development', 'Mobile',
            'Cloud', 'DevOps', 'Security', 'API', 'Database', 'Testing',
            'Design', 'UX', 'UI', 'Performance', 'Optimization', 'SEO',
            'Analytics', 'Marketing', 'Product', 'Startup'
          ].map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}

export const CodeBlock: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm">example.tsx</span>
          <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
            Copy
          </button>
        </div>
        
        <ScrollArea className="h-64">
          <pre className="p-4 text-sm">
            <code>{`import React from 'react'
import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  const [messages, setMessages] = React.useState([])
  
  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    
    setMessages([...messages, newMessage])
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a response from the AI',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }
  
  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}`}</code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  ),
}

export const Sidebar: Story = {
  render: () => (
    <div className="flex h-96 border rounded-lg overflow-hidden">
      <div className="w-64 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Navigation</h3>
        </div>
        
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-2 space-y-1">
            {Array.from({ length: 20 }, (_, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded"
              >
                Menu Item {i + 1}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Content Area</h2>
        <p className="text-gray-600">
          The sidebar on the left has custom scrollbars and scrolls independently
          from the main content area.
        </p>
      </div>
    </div>
  ),
}

export const HorizontalScroll: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="font-semibold mb-3">Horizontal Scroll</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
        <div className="flex gap-4 p-4">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold"
            >
              Card {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}

export const DataTable: Story = {
  render: () => (
    <div className="w-full max-w-4xl border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-semibold">Chat Sessions</h3>
      </div>
      
      <ScrollArea className="h-96">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 50 }, (_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">#{1000 + i}</td>
                <td className="px-4 py-3 text-sm">user_{i}@example.com</td>
                <td className="px-4 py-3 text-sm">{Math.floor(Math.random() * 50)}</td>
                <td className="px-4 py-3 text-sm">{Math.floor(Math.random() * 60)} min</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    i % 3 === 0 ? 'bg-green-100 text-green-700' :
                    i % 3 === 1 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Closed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  ),
}
