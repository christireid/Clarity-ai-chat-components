# Interactive Examples

Try out Clarity Chat components directly in your browser! Edit the code and see changes in real-time.

## Basic Chat Window

<Playground
  title="Simple Chat Interface"
  description="A minimal chat window with message sending capability"
  :code="`
import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

function BasicChatDemo() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hello! I\\'m your AI assistant. How can I help you today?',
      createdAt: new Date(Date.now() - 5000),
      updatedAt: new Date(Date.now() - 5000),
      status: 'sent',
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: \`You said: "\${content}". This is a simulated response from the AI.\`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default BasicChatDemo
`"
/>

## Message with Markdown

<Playground
  title="Rich Message Formatting"
  description="Messages support Markdown formatting including code blocks, lists, and emphasis"
  :code="`
import React from 'react'
import { Message } from '@clarity-chat/react'

function MarkdownDemo() {
  const message = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: \`# Hello! I support Markdown 👋

Here are some formatting examples:

## Text Formatting
- **Bold text**
- *Italic text*
- \\\`inline code\\\`

## Code Block
\\\`\\\`\\\`javascript
function greet(name) {
  return \\\`Hello, \\\${name}!\\\`
}
\\\`\\\`\\\`

## Lists
1. First item
2. Second item
3. Third item

> This is a blockquote

[Links are supported too](https://example.com)\`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <Message message={message} />
    </div>
  )
}

export default MarkdownDemo
`"
/>

## Streaming Messages

<Playground
  title="Real-time Streaming"
  description="Simulate streaming responses with typing animation"
  :code="`
import React, { useState, useEffect } from 'react'
import { ChatWindow } from '@clarity-chat/react'

function StreamingDemo() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)

  const streamMessage = async (content) => {
    const words = content.split(' ')
    let accumulated = ''
    
    const streamingMsg = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'streaming',
    }
    
    setMessages(prev => [...prev, streamingMsg])
    setIsStreaming(true)

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100))
      accumulated += word + ' '
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === streamingMsg.id 
            ? { ...msg, content: accumulated.trim() }
            : msg
        )
      )
    }

    setMessages(prev => 
      prev.map(msg => 
        msg.id === streamingMsg.id 
          ? { ...msg, status: 'sent' }
          : msg
      )
    )
    setIsStreaming(false)
  }

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMessage])
    
    await streamMessage(
      'This is a simulated streaming response. Watch as the text appears word by word, creating a more engaging user experience.'
    )
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isStreaming}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default StreamingDemo
`"
/>

## Custom Styling

<Playground
  title="Themed Chat Interface"
  description="Customize the appearance with your own styles"
  :code="`
import React, { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react'

function ThemedDemo() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'This chat has custom styling! Try sending a message.',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
  ])

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    setMessages(prev => [...prev, newMessage])

    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: \`Echo: \${content}\`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '600px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '12px',
    }}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        className="custom-chat"
      />
    </div>
  )
}

export default ThemedDemo
`"
/>

## Message Actions

<Playground
  title="Interactive Message Actions"
  description="Messages with feedback, copy, and retry functionality"
  :code="`
import React, { useState } from 'react'
import { Message } from '@clarity-chat/react'

function ActionsDemo() {
  const [feedback, setFeedback] = useState(null)
  const [copied, setCopied] = useState(false)
  const [retries, setRetries] = useState(0)

  const message = {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: \`# Interactive Message

Try these actions:
- 👍 Thumbs up/down for feedback
- 📋 Copy button to copy content
- 🔄 Retry for error messages

Current feedback: \${feedback || 'None'}
Copy status: \${copied ? 'Copied!' : 'Not copied'}
Retries: \${retries}\`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <Message
        message={message}
        onFeedback={(type) => setFeedback(type)}
        onCopy={() => setCopied(true)}
        onRetry={() => setRetries(prev => prev + 1)}
      />
    </div>
  )
}

export default ActionsDemo
`"
/>

## Tips for Customization

### Styling
- Use the `className` prop to add custom CSS classes
- Override CSS variables for theme customization
- Use Tailwind utility classes for quick styling

### Behavior
- Control loading states with `isLoading` prop
- Handle errors with `onError` callbacks
- Customize placeholders and labels

### Advanced
- Integrate with your backend API
- Add custom middleware for message processing
- Implement file upload and preview
- Add emoji picker and mentions

## Next Steps

- Explore the [API Reference](/api/components) for complete prop documentation
- Check out the [Cookbook](/cookbook) for more advanced recipes
- View the [Examples](/examples/) for full application demos
