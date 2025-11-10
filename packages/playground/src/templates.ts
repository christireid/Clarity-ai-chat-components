/**
 * Code Templates for Playground
 * All templates use actual Clarity Chat components
 */

export const templates = {
  // Getting Started
  basic: `import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@clarity-chat/primitives'

export default function BasicExample() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Clarity Chat</CardTitle>
          <CardDescription>
            Premium AI chat components with beautiful design
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Try editing the code to see live changes!
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  )
}`,

  'simple-chat': `import { useState } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'

export default function SimpleChatExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ])

  const addMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: 'This is a user message',
      timestamp: new Date(),
    }
    setMessages([...messages, newMessage])
  }

  return (
    <div className="h-screen p-8">
      <ChatWindow
        title="AI Assistant"
        subtitle="Powered by Clarity Chat"
      >
        {messages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
      </ChatWindow>
      
      <div className="mt-4 flex justify-center">
        <Button onClick={addMessage}>Add Message</Button>
      </div>
    </div>
  )
}`,

  streaming: `import { useState } from 'react'
import { Message, ThinkingIndicator } from '@clarity-chat/react'
import { Button, Card } from '@clarity-chat/primitives'

export default function StreamingExample() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')

  const simulateStreaming = async () => {
    setIsStreaming(true)
    setStreamedText('')
    
    const text = 'This is a simulated streaming response. Each word appears one at a time, mimicking real AI streaming behavior. Watch as the text builds up gradually!'
    const words = text.split(' ')
    
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setStreamedText(prev => prev + word + ' ')
    }
    
    setIsStreaming(false)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Streaming Response Demo</h2>
      
      {isStreaming && (
        <ThinkingIndicator
          stage="generating"
          message="AI is thinking..."
        />
      )}
      
      <Card className="p-6">
        {streamedText && (
          <Message
            role="assistant"
            content={streamedText}
            timestamp={new Date()}
            isStreaming={isStreaming}
          />
        )}
      </Card>

      <Button
        onClick={simulateStreaming}
        disabled={isStreaming}
        className="w-full"
      >
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </Button>
    </div>
  )
}`,

  conversation: `import { useState } from 'react'
import { ChatWindow, Message, ChatInput } from '@clarity-chat/react'

export default function ConversationExample() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'system' as const,
      content: 'You are a helpful assistant.',
      timestamp: new Date(Date.now() - 10000),
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Hello! How can I help you today?',
      timestamp: new Date(Date.now() - 5000),
    },
  ])

  const handleSend = (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'This is a simulated AI response. In a real app, this would come from your AI provider.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div className="h-screen flex flex-col p-8">
      <ChatWindow
        title="Multi-Turn Conversation"
        subtitle="Full chat experience"
        className="flex-1"
      >
        {messages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
      </ChatWindow>
      
      <ChatInput
        onSend={handleSend}
        placeholder="Type your message..."
        className="mt-4"
      />
    </div>
  )
}`,

  'chat-window': `import { ChatWindow, Message } from '@clarity-chat/react'

const sampleMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: 'Hi! I can help you with questions about React, TypeScript, and web development.',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: '2',
    role: 'user' as const,
    content: 'What are React hooks?',
    timestamp: new Date(Date.now() - 20000),
  },
  {
    id: '3',
    role: 'assistant' as const,
    content: 'React Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useCallback, and useMemo.',
    timestamp: new Date(Date.now() - 10000),
  },
]

export default function ChatWindowExample() {
  return (
    <div className="h-screen p-8">
      <ChatWindow
        title="AI Assistant"
        subtitle="Ask me anything"
        onClear={() => console.log('Clear clicked')}
        onExport={() => console.log('Export clicked')}
      >
        {sampleMessages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            avatar={msg.role === 'assistant' ? '🤖' : '👤'}
          />
        ))}
      </ChatWindow>
    </div>
  )
}`,

  'message-bubble': `import { Message } from '@clarity-chat/react'
import { Card } from '@clarity-chat/primitives'

export default function MessageBubbleExample() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6">Message Component Variants</h2>
      
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Assistant Message
          </h3>
          <Message
            role="assistant"
            content="I'm an AI assistant. I can help you with various tasks like answering questions, writing code, and providing information."
            timestamp={new Date()}
            avatar="🤖"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            User Message
          </h3>
          <Message
            role="user"
            content="Can you explain React hooks in simple terms?"
            timestamp={new Date()}
            avatar="👤"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            System Message
          </h3>
          <Message
            role="system"
            content="System: Conversation started at " + new Date().toLocaleTimeString()
            timestamp={new Date()}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Streaming Message
          </h3>
          <Message
            role="assistant"
            content="This message is currently streaming"
            timestamp={new Date()}
            isStreaming={true}
          />
        </div>
      </Card>
    </div>
  )
}`,

  'chat-input': `import { useState } from 'react'
import { ChatInput } from '@clarity-chat/react'
import { Card } from '@clarity-chat/primitives'

export default function ChatInputExample() {
  const [messages, setMessages] = useState<string[]>([])

  const handleSend = (content: string) => {
    setMessages([...messages, content])
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Chat Input Component</h2>
      
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Default</h3>
          <ChatInput
            onSend={handleSend}
            placeholder="Type a message..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">With Character Limit</h3>
          <ChatInput
            onSend={handleSend}
            placeholder="Max 100 characters..."
            maxLength={100}
            showCount={true}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Disabled</h3>
          <ChatInput
            onSend={handleSend}
            placeholder="Disabled input..."
            disabled={true}
          />
        </div>
      </Card>

      {messages.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-3">Sent Messages:</h3>
          <ul className="space-y-2">
            {messages.map((msg, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {i + 1}. {msg}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}`,

  'all-components': `import { Button, Input, Card, CardHeader, CardTitle, CardContent, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Badge } from '@clarity-chat/primitives'
import { useState } from 'react'

export default function AllComponentsShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Clarity Chat Components</h1>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Default input" />
          <Input placeholder="Small input" size="sm" />
          <Input placeholder="Large input" size="lg" />
          <Input placeholder="Error state" variant="error" />
          <Input placeholder="Success state" variant="success" />
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Example Dialog</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This is a dialog component with smooth animations.
              </p>
              <Button onClick={() => setDialogOpen(false)} className="mt-4">
                Close
              </Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}`,

  'thinking-indicator': `import { ThinkingIndicator } from '@clarity-chat/react'
import { Card } from '@clarity-chat/primitives'

export default function ThinkingIndicatorExample() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Thinking Indicators</h2>
      
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Analyzing</h3>
          <ThinkingIndicator
            stage="analyzing"
            message="Analyzing your request..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Generating</h3>
          <ThinkingIndicator
            stage="generating"
            message="Generating response..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Processing</h3>
          <ThinkingIndicator
            stage="processing"
            message="Processing data..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">With Progress</h3>
          <ThinkingIndicator
            stage="generating"
            message="Generating response..."
            progress={65}
            topic="About React hooks and best practices"
          />
        </div>
      </Card>
    </div>
  )
}`,

  'form-example': `import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge } from '@clarity-chat/primitives'

export default function FormExample() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Example</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Message
              </label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message..."
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit">Submit</Button>
              {submitted && (
                <Badge variant="success">Submitted!</Badge>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}`,

  'full-chat-app': `import { useState } from 'react'
import { ChatWindow, Message, ChatInput, ThinkingIndicator } from '@clarity-chat/react'
import { Button, Badge } from '@clarity-chat/primitives'

export default function FullChatApp() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Welcome! I\\'m your AI assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [messageCount, setMessageCount] = useState(1)

  const handleSend = async (content: string) => {
    // Add user message
    const userMsg = {
      id: (Date.now()).toString(),
      role: 'user' as const,
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setMessageCount(prev => prev + 1)

    // Show typing indicator
    setIsTyping(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const responses = [
      'That\\'s a great question! Let me help you with that.',
      'I understand what you\\'re looking for. Here\\'s what I think...',
      'Interesting! Based on your question, here\\'s my response...',
      'Let me explain that in more detail for you.',
    ]

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, aiMsg])
    setMessageCount(prev => prev + 1)
    setIsTyping(false)
  }

  const handleClear = () => {
    setMessages([messages[0]])
    setMessageCount(1)
  }

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {messageCount} {messageCount === 1 ? 'message' : 'messages'}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleClear}>
          Clear Chat
        </Button>
      </div>

      <ChatWindow
        title="Full-Featured Chat"
        subtitle="Complete example with all features"
        onClear={handleClear}
        className="flex-1"
      >
        {messages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            avatar={msg.role === 'assistant' ? '🤖' : '👤'}
          />
        ))}
        
        {isTyping && (
          <ThinkingIndicator
            stage="generating"
            message="AI is typing..."
          />
        )}
      </ChatWindow>

      <ChatInput
        onSend={handleSend}
        placeholder="Ask me anything..."
        className="mt-4"
        maxLength={500}
        showCount={true}
        disabled={isTyping}
      />
    </div>
  )
}`,

  'button-showcase': `import { Button } from '@clarity-chat/primitives'
import { Send, Loader2, Trash2, Download } from 'lucide-react'

export default function ButtonShowcase() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Button Showcase</h1>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Send className="h-4 w-4" /></Button>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">With Icons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">States</h2>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </Button>
        </div>
      </section>
    </div>
  )
}`,

  'input-showcase': `import { Input, Card, CardHeader, CardTitle, CardContent } from '@clarity-chat/primitives'
import { Search, Mail, Lock } from 'lucide-react'

export default function InputShowcase() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Input Showcase</h1>

      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Default input" />
          <Input placeholder="Error state" variant="error" />
          <Input placeholder="Success state" variant="success" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Small input" size="sm" />
          <Input placeholder="Default input" />
          <Input placeholder="Large input" size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>With Icons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="Email" className="pl-10" />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="Password" className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Read only" readOnly value="Read only value" />
        </CardContent>
      </Card>
    </div>
  )
}`,

  'card-showcase': `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '@clarity-chat/primitives'

export default function CardShowcase() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Card Showcase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Card */}
        <Card>
          <CardHeader>
            <CardTitle>Default Card</CardTitle>
            <CardDescription>
              This is a standard card with all sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Card content goes here. You can put any content inside.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Action</Button>
          </CardFooter>
        </Card>

        {/* Hoverable Card */}
        <Card hoverable>
          <CardHeader>
            <CardTitle>Hoverable Card</CardTitle>
            <CardDescription>
              This card has hover effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hover over this card to see the subtle elevation effect.
            </p>
          </CardContent>
        </Card>

        {/* Card with Badge */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Featured</CardTitle>
                <CardDescription>
                  With badge indicator
                </CardDescription>
              </div>
              <Badge>New</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This card includes a badge indicator.
            </p>
          </CardContent>
        </Card>

        {/* Borderless Card */}
        <Card bordered={false} className="bg-muted">
          <CardHeader>
            <CardTitle>Borderless Card</CardTitle>
            <CardDescription>
              With custom background
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This card has no border and a muted background.
            </p>
          </CardContent>
        </Card>

        {/* Interactive Card */}
        <Card hoverable className="cursor-pointer">
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
            <CardDescription>
              Click me!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This card is fully interactive and clickable.
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button size="sm" variant="outline">Cancel</Button>
            <Button size="sm">Confirm</Button>
          </CardFooter>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-4xl font-bold text-primary">2,847</div>
              <div className="text-sm text-muted-foreground">Total Messages</div>
              <Badge variant="success" className="mt-2">+12% this week</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`,

  'theme-demo': `import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Badge } from '@clarity-chat/primitives'
import { ChatWindow, Message } from '@clarity-chat/react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen p-8 space-y-6">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Theme Demonstration</h1>
          <p className="text-muted-foreground mt-2">
            Toggle between light and dark modes
          </p>
        </div>
        
        <Button onClick={toggleTheme} variant="outline" size="lg">
          {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Components Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Component Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">Outline</Button>
              <Button size="sm" variant="ghost">Ghost</Button>
            </div>
            
            <Input placeholder="Type something..." />
            
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Chat Preview */}
        <div className="h-[500px]">
          <ChatWindow
            title="Chat Preview"
            subtitle="See how components look in {theme} mode"
          >
            <Message
              role="assistant"
              content="This chat automatically adapts to light and dark themes!"
              timestamp={new Date()}
            />
            <Message
              role="user"
              content="That's amazing! The colors look great in both modes."
              timestamp={new Date()}
            />
          </ChatWindow>
        </div>
      </div>
    </div>
  )
}`,

  'responsive-demo': `import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@clarity-chat/primitives'
import { ChatWindow, Message } from '@clarity-chat/react'

export default function ResponsiveDemo() {
  const [view, setView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  const widths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%',
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Responsive Design Demo</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === 'mobile' ? 'default' : 'outline'}
            onClick={() => setView('mobile')}
          >
            📱 Mobile
          </Button>
          <Button
            size="sm"
            variant={view === 'tablet' ? 'default' : 'outline'}
            onClick={() => setView('tablet')}
          >
            📱 Tablet
          </Button>
          <Button
            size="sm"
            variant={view === 'desktop' ? 'default' : 'outline'}
            onClick={() => setView('desktop')}
          >
            💻 Desktop
          </Button>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg flex justify-center">
        <div 
          style={{ width: widths[view], maxWidth: '100%' }}
          className="bg-background rounded-lg shadow-lg transition-all duration-300"
        >
          <div className="h-[600px]">
            <ChatWindow
              title="Responsive Chat"
              subtitle={view} mode"
            >
              <Message
                role="assistant"
                content="This chat adapts to different screen sizes!"
                timestamp={new Date()}
              />
              <Message
                role="user"
                content="It looks great on all devices!"
                timestamp={new Date()}
              />
            </ChatWindow>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current View: {widths[view]}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Components automatically adapt to different screen sizes.
            Try switching between mobile, tablet, and desktop views!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}`,
}
