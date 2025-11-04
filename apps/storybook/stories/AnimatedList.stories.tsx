import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedList } from '@clarity-chat/react'
import { useState } from 'react'
import { Button } from '@clarity-chat/primitives'

/**
 * AnimatedList provides smooth enter/exit animations for list items.
 * 
 * **Key Features:**
 * - Staggered animations
 * - Smooth transitions
 * - Performance optimized
 * - Customizable timing
 * 
 * **Use Cases:**
 * - Message lists
 * - Notification feeds
 * - Dynamic content
 * - Search results
 */
const meta = {
  title: 'Components/AnimatedList',
  component: AnimatedList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated list with smooth enter/exit transitions for dynamic content.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnimatedList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, text: 'First item' },
      { id: 2, text: 'Second item' },
      { id: 3, text: 'Third item' },
    ])
    
    const addItem = () => {
      const newId = Math.max(...items.map(i => i.id)) + 1
      setItems([...items, { id: newId, text: `Item ${newId}` }])
    }
    
    const removeItem = (id: number) => {
      setItems(items.filter(item => item.id !== id))
    }
    
    return (
      <div className="space-y-4">
        <AnimatedList>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
            >
              <span>{item.text}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </AnimatedList>
        
        <Button onClick={addItem} className="w-full">
          Add Item
        </Button>
      </div>
    )
  },
}

export const NotificationList: Story = {
  render: () => {
    const [notifications, setNotifications] = useState([
      { id: 1, title: 'New message', message: 'You have a new message from John', time: '2m ago' },
      { id: 2, title: 'Task completed', message: 'Your export task has finished', time: '5m ago' },
    ])
    
    const addNotification = () => {
      const newId = Math.max(...notifications.map(n => n.id), 0) + 1
      setNotifications([
        { id: newId, title: 'New notification', message: 'This is a new notification', time: 'Just now' },
        ...notifications,
      ])
    }
    
    const dismiss = (id: number) => {
      setNotifications(notifications.filter(n => n.id !== id))
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <Button size="sm" onClick={addNotification}>
            Add Notification
          </Button>
        </div>
        
        <AnimatedList className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold">{notification.title}</div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
                </div>
                <button
                  onClick={() => dismiss(notification.id)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </AnimatedList>
        
        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications
          </div>
        )}
      </div>
    )
  },
}

export const MessageList: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      { id: 1, user: 'Alice', text: 'Hey there!', time: '10:30 AM' },
      { id: 2, user: 'Bob', text: 'Hi Alice, how are you?', time: '10:31 AM' },
    ])
    
    const [input, setInput] = useState('')
    
    const sendMessage = () => {
      if (!input.trim()) return
      
      const newId = Math.max(...messages.map(m => m.id), 0) + 1
      setMessages([
        ...messages,
        {
          id: newId,
          user: 'You',
          text: input,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setInput('')
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h3 className="font-semibold">Chat</h3>
        </div>
        
        <div className="h-80 overflow-y-auto p-4">
          <AnimatedList className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {message.user[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{message.user}</span>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm mt-1">{message.text}</p>
                </div>
              </div>
            ))}
          </AnimatedList>
        </div>
        
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    )
  },
}

export const TodoList: Story = {
  render: () => {
    const [todos, setTodos] = useState([
      { id: 1, text: 'Review pull request', completed: false },
      { id: 2, text: 'Update documentation', completed: true },
      { id: 3, text: 'Fix bug in login flow', completed: false },
    ])
    
    const [input, setInput] = useState('')
    
    const addTodo = () => {
      if (!input.trim()) return
      const newId = Math.max(...todos.map(t => t.id), 0) + 1
      setTodos([...todos, { id: newId, text: input, completed: false }])
      setInput('')
    }
    
    const toggleTodo = (id: number) => {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    }
    
    const deleteTodo = (id: number) => {
      setTodos(todos.filter(todo => todo.id !== id))
    }
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Todo List</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        
        <AnimatedList className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </AnimatedList>
      </div>
    )
  },
}
