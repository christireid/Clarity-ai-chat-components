/**
 * Component Demo
 * 
 * Simple demonstrations of common component patterns
 */

import { useState } from 'react'
import { Button, Input, Card, Dialog, DialogContent, DialogHeader, DialogTitle, Tooltip } from '@clarity-chat/primitives'
import { Message, ChatInput, EmptyState } from '@clarity-chat/react'

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Array<{id: string; role: 'user' | 'assistant'; content: string; createdAt: Date}>>([])

  const handleSend = () => {
    if (!inputValue.trim()) return
    
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputValue,
      createdAt: new Date(),
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${newMessage.content}". This is a demo response!`,
        createdAt: new Date(),
      }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Component Demo</h1>
          <p className="text-sm text-muted-foreground">
            Common patterns with Clarity Chat Components
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Buttons */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Form */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Form Example</h2>
          <Card className="p-6 max-w-md">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Card Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-muted-foreground">
                A basic card with default styling
              </p>
            </Card>
            <Card className="p-6 cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]">
              <h3 className="font-semibold mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">
                Hover me to see the effect
              </p>
            </Card>
            <Card className="p-6 ring-2 ring-primary/50">
              <h3 className="font-semibold mb-2">Selected Card</h3>
              <p className="text-sm text-muted-foreground">
                With ring-2 ring-primary/50
              </p>
            </Card>
          </div>
        </section>

        {/* Dialog */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Dialog Example</h2>
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground py-4">
                Are you sure you want to continue with this action?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Confirm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Tooltips */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Tooltip Example</h2>
          <div className="flex gap-4">
            <Tooltip content="This is a helpful tooltip">
              <Button>Hover for Tooltip</Button>
            </Tooltip>
            <Tooltip content="You can use tooltips to provide context">
              <Button variant="outline">Another Tooltip</Button>
            </Tooltip>
          </div>
        </section>

        {/* Chat Interface */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Chat Interface</h2>
          <Card className="max-w-2xl">
            <div className="h-[400px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
              </div>
              
              {/* Input */}
              <div className="border-t ring-1 ring-border/50">
                <ChatInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSubmit={handleSend}
                  placeholder="Type your message..."
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Feature Grid */}
        <section>
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
                <div className="text-4xl mb-3">{feature.emoji}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            Clarity Chat Components v2.0 • Production Ready ✅
          </p>
        </footer>
      </div>
    </div>
  )
}
