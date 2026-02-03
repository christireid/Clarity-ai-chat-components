'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import { ClarityComponents } from '@clarity-chat/react'
import {
  MessageSquare,
  Send,
  Mic,
  Paperclip,
  Settings,
  Maximize,
  User,
  Bot,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  MoreHorizontal,
} from 'lucide-react'

// ============================================================================
// CHAT WINDOW DEMO
// ============================================================================
function ChatWindowDemo() {
  const messages = [
    {
      id: '1',
      role: 'user',
      content: 'Can you explain how React hooks work?',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      role: 'assistant',
      content: `React Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are the main hooks:

**useState** - Adds state to functional components
\`\`\`javascript
const [count, setCount] = useState(0)
\`\`\`

**useEffect** - Performs side effects in function components
\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])
\`\`\`

**useContext** - Subscribes to React context without nesting`,
      timestamp: new Date(),
    },
  ]

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Clarity Assistant</CardTitle>
              <CardDescription className="text-xs">
                GPT-4o • Online
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  msg.role === 'user' ? 'bg-primary' : 'bg-muted'
                )}
              >
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  'flex-1 max-w-[80%] rounded-lg p-3',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/50">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// CHAT SIDEBAR DEMO
// ============================================================================
function ChatSidebarDemo() {
  const conversations = [
    { id: '1', title: 'React Hooks Guide', messages: 12, active: true },
    { id: '2', title: 'API Design Discussion', messages: 8, active: false },
    { id: '3', title: 'Debug Authentication', messages: 15, active: false },
    { id: '4', title: 'Code Review Help', messages: 6, active: false },
    { id: '5', title: 'Database Schema', messages: 20, active: false },
  ]

  return (
    <Card className="w-72 h-[400px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-colors',
                conv.active
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {conv.messages} messages
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

// ============================================================================
// CHAT INPUT VARIANTS
// ============================================================================
function ChatInputVariants() {
  return (
    <div className="space-y-4">
      {/* Basic Input */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Basic Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <Button size="sm">Send</Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Input with Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Enhanced Input with Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-2">
            <textarea
              placeholder="Ask me anything..."
              className="w-full bg-transparent text-sm outline-none resize-none min-h-[80px]"
              rows={3}
            />
            <div className="flex items-center justify-between pt-2 border-t mt-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="text-xs">
                  GPT-4o
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">0/4000</span>
                <Button size="sm" className="gap-1">
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multimodal Input */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Multimodal Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="p-2 border-b bg-muted/50">
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">image.png</p>
                  <p className="text-xs text-muted-foreground">2.4 MB</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 mt-1 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <input
                type="text"
                placeholder="Describe this image or ask a question..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-2 border-t">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button size="sm">Analyze Image</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// CHAT CONTAINER DEMO
// ============================================================================
function ChatContainerDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ChatContainer Component</CardTitle>
        <CardDescription>
          Full-featured chat container with header, messages, and input
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden h-[350px] flex flex-col">
          {/* Header */}
          <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Badge variant="secondary">Claude 3.5</Badge>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hello! How can I help you today?</p>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">I need help with a React component</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EXPANDABLE CHAT DEMO
// ============================================================================
function ExpandableChatDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ExpandableChat Widget</CardTitle>
        <CardDescription>
          Floating chat widget that expands on click
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] bg-muted/30 rounded-lg overflow-hidden">
          {/* Page content simulation */}
          <div className="p-4">
            <div className="h-4 w-3/4 bg-muted rounded mb-2" />
            <div className="h-4 w-1/2 bg-muted rounded mb-4" />
            <div className="h-20 w-full bg-muted rounded" />
          </div>

          {/* Chat Widget */}
          <div className="absolute bottom-4 right-4">
            {isOpen ? (
              <div className="w-80 h-96 bg-card border rounded-lg shadow-lg flex flex-col">
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Chat Support</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg">×</span>
                  </Button>
                </div>
                <div className="flex-1 p-3">
                  <p className="text-sm text-muted-foreground">
                    How can we help you?
                  </p>
                </div>
                <div className="p-3 border-t">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-muted rounded px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            ) : (
              <Button
                size="lg"
                className="rounded-full h-14 w-14 shadow-lg"
                onClick={() => setIsOpen(true)}
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function CoreChatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Core Chat"
        description="Essential components for building chat interfaces"
      />

      <Tabs defaultValue="window" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="window">Chat Window</TabsTrigger>
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          <TabsTrigger value="input">Input Variants</TabsTrigger>
          <TabsTrigger value="container">Container</TabsTrigger>
          <TabsTrigger value="expandable">Expandable</TabsTrigger>
        </TabsList>

        <TabsContent value="window">
          <ComponentSection
            title="ChatWindow"
            description="Complete chat window with messages, input, and actions"
          >
            <ChatWindowDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="sidebar">
          <ComponentSection
            title="ChatSidebar"
            description="Conversation list with search and management"
          >
            <ChatSidebarDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="input">
          <ComponentSection
            title="ChatInput Variants"
            description="Different input styles for various use cases"
          >
            <ChatInputVariants />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="container">
          <ComponentSection
            title="ChatContainer"
            description="Full-featured chat container component"
          >
            <ChatContainerDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="expandable">
          <ComponentSection
            title="ExpandableChat"
            description="Floating chat widget for websites"
          >
            <ExpandableChatDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
