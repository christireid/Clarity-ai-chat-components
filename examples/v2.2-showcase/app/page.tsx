'use client'

import { useState } from 'react'
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@clarity-chat/primitives'
import { Message, ChatWindow, ChatInput } from '@clarity-chat/react'

export default function V22Showcase() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! Notice the refined shadows, subtle borders, and soft focus glows in v2.2.',
      createdAt: new Date(),
    },
  ])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Clarity Chat v2.2</h1>
          <p className="text-xl text-muted-foreground">
            Premium Visual Refinements Showcase
          </p>
          <div className="flex gap-2 justify-center">
            <Badge variant="default">v2.2.0</Badge>
            <Badge variant="success">Premium Quality</Badge>
            <Badge variant="info">AI SDK Level</Badge>
          </div>
        </header>

        {/* Key Improvements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">✨ Key Improvements</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Whisper-Soft Shadows</CardTitle>
                <CardDescription>
                  40% softer shadows create premium elevation without visual weight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg shadow-xs bg-card border border-border/40">
                    <code className="text-xs">shadow-xs</code> - Ultra-soft
                  </div>
                  <div className="p-4 rounded-lg shadow-sm bg-card border border-border/40">
                    <code className="text-xs">shadow-sm</code> - Subtle
                  </div>
                  <div className="p-4 rounded-lg shadow-md bg-card border border-border/40">
                    <code className="text-xs">shadow-md</code> - Refined
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refined Borders</CardTitle>
                <CardDescription>
                  1px borders with subtle opacity create clean separation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-card border border-border/30">
                    <code className="text-xs">border-border/30</code> - Very subtle
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border/40">
                    <code className="text-xs">border-border/40</code> - Default
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border/60">
                    <code className="text-xs">border-border/60</code> - Hover
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Button Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🔘 Button Refinements</h2>
          <Card>
            <CardHeader>
              <CardTitle>All Button Variants</CardTitle>
              <CardDescription>
                Notice the subtle shadows, refined hover lift (1px), and soft focus glows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-4">
                💡 Tip: Hover to see 1px lift. Tab to see soft focus glows.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Input Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">📝 Input Refinements</h2>
          <Card>
            <CardHeader>
              <CardTitle>Input States</CardTitle>
              <CardDescription>
                Light borders (1px at 40%), soft focus glows, refined placeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Default input - notice the subtle border" />
                <Input 
                  placeholder="Focus me to see soft glow" 
                  className="focus:ring-1 focus:ring-primary/20"
                />
                <Input 
                  variant="error" 
                  error="Error state with soft red glow"
                  placeholder="Error example"
                />
                <Input 
                  variant="success" 
                  placeholder="Success state with soft green glow"
                />
              </div>
              <p className="text-xs text-muted-foreground/70 mt-4">
                💡 Tip: Click into each input to see refined focus states
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Badge Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🏷️ Badge Refinements</h2>
          <Card>
            <CardHeader>
              <CardTitle>New Badge Style</CardTitle>
              <CardDescription>
                Borderless with transparent backgrounds - cleaner, more modern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="subtle">Subtle</Badge>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-4">
                💡 Notice: No borders, transparent backgrounds, colored text
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Card Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🃏 Card Refinements</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>
                  Subtle border (40% opacity), refined shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Notice the light border and soft shadow. The card feels present but not heavy.
                </p>
              </CardContent>
            </Card>

            <Card hoverable>
              <CardHeader>
                <CardTitle>Hoverable Card</CardTitle>
                <CardDescription>
                  Hover to see 1px lift and refined shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Hover over this card to see the subtle 1px lift and shadow increase.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dialog Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💬 Dialog Refinements</h2>
          <Card>
            <CardHeader>
              <CardTitle>Modal Example</CardTitle>
              <CardDescription>
                Lighter backdrop (50%), refined border, smooth animation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
              <p className="text-xs text-muted-foreground/70 mt-3">
                💡 Notice: Lighter backdrop with blur, whisper-light border on content
              </p>
            </CardContent>
          </Card>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>v2.2 Dialog Refinements</DialogTitle>
                <DialogDescription>
                  Notice the lighter backdrop, subtle border, and smooth animation
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  The backdrop is now 50% opacity (vs 60%), creating a lighter feel. 
                  The content border is whisper-light at 20% opacity. The close button 
                  is smaller and positioned tighter. Animation is faster at 200ms.
                </p>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Chat Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💬 Chat Component Refinements</h2>
          <Card className="h-[600px]">
            <ChatWindow
              messages={messages}
              onSendMessage={(content) => {
                setMessages([...messages, {
                  id: Date.now().toString(),
                  role: 'user',
                  content,
                  createdAt: new Date(),
                }])
                
                // Simulate AI response
                setTimeout(() => {
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `You said: "${content}". Notice the refined message styling with tighter padding, softer shadows, and chat-style bubble corners!`,
                    createdAt: new Date(),
                  }])
                }, 1000)
              }}
              showHeader
              sessionTitle="v2.2 Chat Refinements"
              sessionSubtitle="Refined header, tighter spacing, polished messages"
              showMessageCount
            />
          </Card>
          <p className="text-xs text-muted-foreground/70">
            💡 Try: Type a message to see refined chat bubbles, notice the header's frosted glass effect, 
            and observe the subtle shadows throughout.
          </p>
        </section>

        {/* Focus State Gallery */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">✨ Focus State Gallery</h2>
          <Card>
            <CardHeader>
              <CardTitle>Soft Focus Glows</CardTitle>
              <CardDescription>
                Tab through these elements to see modern, accessible focus states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button>Focus me (Tab key)</Button>
                <Input placeholder="Focus to see soft glow" />
                <div className="flex gap-2">
                  <Badge variant="default" tabIndex={0}>Focusable Badge</Badge>
                  <Badge variant="success" tabIndex={0}>Another Badge</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-4">
                💡 Tip: Use Tab key to navigate. Notice the soft glowing halos instead of hard outlines.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Design Tokens Reference */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🎨 Design Tokens</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>New Shadow Utilities</CardTitle>
                <CardDescription>Refined shadow system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs font-mono">
                <div>shadow-xs → 0 1px 2px rgba(0,0,0,0.04)</div>
                <div>shadow-sm → 0 1px 3px rgba(0,0,0,0.04)</div>
                <div>shadow-md → 0 2px 4px rgba(0,0,0,0.06)</div>
                <div>shadow-lg → 0 4px 12px rgba(0,0,0,0.08)</div>
                <div>shadow-xl → 0 8px 20px rgba(0,0,0,0.10)</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Focus Utilities</CardTitle>
                <CardDescription>Soft focus glow shadows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs font-mono">
                <div>shadow-focus-primary</div>
                <div>shadow-focus-destructive</div>
                <div>shadow-focus-success</div>
                <div className="mt-2 pt-2 border-t border-border/40">
                  ring-1 ring-ring/50 (vs ring-2)
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comparison Summary */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">📊 v2.1 → v2.2 Summary</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Visual Changes</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ Shadows 40% softer</li>
                    <li>✅ Borders 50% lighter (1px vs 2px)</li>
                    <li>✅ Focus states use soft glows</li>
                    <li>✅ Hover lifts reduced to 1px</li>
                    <li>✅ Typography weights refined</li>
                    <li>✅ Animations 25% faster</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">No Changes</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ All APIs identical</li>
                    <li>✅ All props work the same</li>
                    <li>✅ All functionality preserved</li>
                    <li>✅ Zero breaking changes</li>
                    <li>✅ 100% backward compatible</li>
                    <li>✅ Instant upgrade</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center space-y-3 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            Clarity Chat v2.2 - Premium visual quality with comprehensive features
          </p>
          <div className="flex gap-4 justify-center text-xs">
            <a href="/docs" className="text-primary hover:underline">Documentation</a>
            <a href="/examples" className="text-primary hover:underline">More Examples</a>
            <a href="https://github.com" className="text-primary hover:underline">GitHub</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
