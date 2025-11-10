/**
 * Component Demo
 * 
 * Comprehensive demonstration of Clarity Chat Components
 */

import { useState, useCallback } from 'react'
import { 
  Button, 
  Input, 
  Card, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  Tooltip,
  Badge,
} from '@clarity-chat/primitives'
import { 
  ChatInput, 
  EmptyState, 
  Message, 
  ThinkingIndicator,
  ToastProvider,
  useToast,
  useAutoScroll,
  TokenCounter,
  NetworkStatus,
  useTokenTracker,
  ErrorBoundary,
  Progress,
  Skeleton,
} from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'
import '@clarity-chat/primitives/dist/index.css'
import '@clarity-chat/react/dist/styles/index.css'

function ComponentDemoApp() {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Form state
  const [inputValue, setInputValue] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '' })
  
  // Chat state
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Hooks
  const toast = useToast()
  const { scrollRef } = useAutoScroll({ dependencies: [messages] })
  const { 
    tokens: totalTokens,
    addMessage: addTokenMessage
  } = useTokenTracker({
    modelName: 'gpt-3.5-turbo'
  })

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return
    
    const userMessage: MessageType = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content: inputValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, userMessage])
    const messageContent = inputValue
    setInputValue('')
    setIsLoading(true)
    
    // Track tokens
    addTokenMessage({ role: 'user', content: messageContent })
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiResponse = `I received your message: "${messageContent}". This is a demo response showcasing the Message component!`
    
    const aiMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      chatId: 'demo',
      role: 'assistant',
      content: aiResponse,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }
    
    setMessages(prev => [...prev, aiMessage])
    addTokenMessage({ role: 'assistant', content: aiResponse })
    setIsLoading(false)
  }, [inputValue, addTokenMessage])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Component Demo</h1>
              <p className="text-sm text-muted-foreground">
                Common patterns with Clarity Chat Components
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <TokenCounter 
                currentTokens={totalTokens}
                maxTokens={16000}
                costPerToken={0.0000015}
                showCost={false}
                size="sm"
              />
              <NetworkStatus />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Form Elements</h2>
          <Card className="p-6 max-w-md">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input 
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => toast.success(
                  `Welcome, ${formData.name || 'Guest'}!`,
                  'Form Submitted!'
                )}
              >
                Submit Form
              </Button>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Basic Card</h3>
              <p className="text-sm text-muted-foreground">
                Simple card with shadow and border
              </p>
            </Card>
            <Card className="p-6 hover:shadow-sm hover:-translate-y-[2px] transition-all cursor-pointer">
              <h3 className="font-semibold mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">
                Hover for lift effect
              </p>
            </Card>
            <Card className="p-6 ring-2 ring-primary">
              <h3 className="font-semibold mb-2">Selected Card</h3>
              <p className="text-sm text-muted-foreground">
                With primary ring
              </p>
            </Card>
          </div>
        </section>

        {/* Badges & Status */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Badges & Status</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Progress & Loading */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Progress & Loading</h2>
          <Card className="p-6 max-w-md space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Progress Bar</label>
              <Progress value={65} />
              <p className="text-xs text-muted-foreground mt-1">65% complete</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Loading Skeleton</label>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Card>
        </section>

        {/* Dialog */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Dialog / Modal</h2>
          <Button onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Example Dialog</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground py-4">
                This is a modal dialog built with Clarity Chat primitives.
                It includes backdrop blur and smooth animations.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setDialogOpen(false)
                  toast.success(
                    'Dialog action was successful',
                    'Action Confirmed'
                  )
                }}>
                  Confirm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Tooltips */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Tooltips</h2>
          <div className="flex gap-4">
            <Tooltip content="This is a helpful tooltip">
              <Button>Hover for tooltip</Button>
            </Tooltip>
            <Tooltip content="Tooltips help provide context" side="right">
              <Button variant="outline">Hover me too</Button>
            </Tooltip>
          </div>
        </section>

        {/* Chat Interface */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Chat Interface</h2>
          <Card className="max-w-2xl">
            <div className="h-[400px] flex flex-col">
              {/* Messages */}
              <div ref={scrollRef as any} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <EmptyState
                    icon={
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    }
                    title="No messages yet"
                    description="Send a message to start the conversation"
                  />
                ) : (
                  messages.map((message) => (
                    <Message key={message.id} message={message} />
                  ))
                )}
                
                {isLoading && <ThinkingIndicator />}
              </div>
              
              {/* Input */}
              <div className="border-t border-border/50 p-4">
                <ChatInput
                  value={inputValue}
                  onChange={(value) => setInputValue(value)}
                  onSubmit={handleSend}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Feature Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Feature Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🎨', title: 'Design System', desc: '50+ refined components' },
              { emoji: '⚡', title: 'Performance', desc: 'Optimized for speed' },
              { emoji: '♿', title: 'Accessible', desc: 'WCAG 2.1 AA compliant' },
              { emoji: '📱', title: 'Responsive', desc: 'Mobile-first design' },
            ].map((feature, i) => (
              <Card 
                key={i}
                className="p-6 text-center cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]"
              >
                <div className="text-4xl mb-2">{feature.emoji}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

// Wrap in ErrorBoundary and ToastProvider
function App() {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 max-w-md text-center">
            <h1 className="text-xl font-semibold text-destructive mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </Card>
        </div>
      )}
    >
      <ToastProvider>
        <ComponentDemoApp />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
