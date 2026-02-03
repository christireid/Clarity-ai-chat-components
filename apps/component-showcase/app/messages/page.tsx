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
import {
  User,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Check,
  Clock,
  CheckCheck,
  MoreHorizontal,
  Reply,
  Forward,
  Pin,
  Bookmark,
  Flag,
  Trash2,
  Edit,
  Smile,
} from 'lucide-react'

// ============================================================================
// MESSAGE BUBBLE VARIANTS
// ============================================================================
function MessageBubbleVariants() {
  return (
    <div className="space-y-6">
      {/* Basic Messages */}
      <div>
        <h4 className="text-sm font-medium mb-3">Basic Messages</h4>
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          {/* User Message */}
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[70%]">
              <p className="text-sm">
                Hello! Can you help me with a coding question?
              </p>
              <span className="text-xs opacity-70 mt-1 block text-right">
                10:32 AM
              </span>
            </div>
          </div>

          {/* Assistant Message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[70%]">
              <p className="text-sm">
                Of course! I&apos;d be happy to help. What would you like to
                know?
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                10:32 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages with Actions */}
      <div>
        <h4 className="text-sm font-medium mb-3">Messages with Actions</h4>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex gap-3 group">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[70%]">
                <p className="text-sm">
                  Here&apos;s a code example that demonstrates the concept:
                </p>
                <pre className="mt-2 p-2 bg-background rounded text-xs font-mono overflow-x-auto">
                  {`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`}
                </pre>
              </div>
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>
          </div>
        </div>
      </div>

      {/* Messages with Status */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          Messages with Delivery Status
        </h4>
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-3">
              <p className="text-sm">Sending message...</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:35</span>
                <Clock className="h-3 w-3 opacity-70" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-3">
              <p className="text-sm">Message delivered</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:34</span>
                <Check className="h-3 w-3 opacity-70" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-primary text-primary-foreground rounded-lg p-3">
              <p className="text-sm">Message read</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:33</span>
                <CheckCheck className="h-3 w-3 text-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STREAMING MESSAGE DEMO
// ============================================================================
function StreamingMessageDemo() {
  const [isStreaming, setIsStreaming] = useState(true)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Streaming Message</CardTitle>
            <CardDescription>
              Real-time text streaming with cursor
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? 'Stop' : 'Start'} Streaming
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
              <p className="text-sm">
                React Hooks are a powerful feature that allows you to use state
                and other React features in functional components.
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                )}
              </p>
              {isStreaming && (
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Generating...
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TYPING INDICATOR DEMO
// ============================================================================
function TypingIndicatorDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Typing Indicators</CardTitle>
        <CardDescription>Various styles of typing indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Dots Animation */}
          <div>
            <h4 className="text-sm font-medium mb-3">Bouncing Dots</h4>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg rounded-tl-none p-3">
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text with Dots */}
          <div>
            <h4 className="text-sm font-medium mb-3">Text with Animation</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4" />
              <span>AI is thinking</span>
              <span className="flex gap-0.5">
                <span className="animate-pulse">.</span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: '200ms' }}
                >
                  .
                </span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: '400ms' }}
                >
                  .
                </span>
              </span>
            </div>
          </div>

          {/* Progress Bar Style */}
          <div>
            <h4 className="text-sm font-medium mb-3">Progress Style</h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1 max-w-[200px]">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-primary rounded-full animate-pulse" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Generating response...
                </p>
              </div>
            </div>
          </div>

          {/* Skeleton Style */}
          <div>
            <h4 className="text-sm font-medium mb-3">Skeleton Loading</h4>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg rounded-tl-none p-3 space-y-2 min-w-[200px]">
                <div className="h-3 w-full bg-muted-foreground/20 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted-foreground/20 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE ACTIONS DEMO
// ============================================================================
function MessageActionsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Message Actions</CardTitle>
        <CardDescription>
          Comprehensive action toolbar for messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Inline Actions */}
          <div>
            <h4 className="text-sm font-medium mb-3">Inline Actions</h4>
            <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg w-fit">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Extended Actions Menu */}
          <div>
            <h4 className="text-sm font-medium mb-3">Extended Actions Menu</h4>
            <div className="w-48 border rounded-lg overflow-hidden">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted">
                <Reply className="h-4 w-4" /> Reply
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted">
                <Forward className="h-4 w-4" /> Forward
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted">
                <Pin className="h-4 w-4" /> Pin
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted">
                <Bookmark className="h-4 w-4" /> Bookmark
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted">
                <Edit className="h-4 w-4" /> Edit
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>

          {/* Reactions */}
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Reactions</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-muted rounded-full">
                {['👍', '❤️', '😂', '😮', '😢', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    className="w-8 h-8 rounded-full hover:bg-background flex items-center justify-center text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE GROUPING DEMO
// ============================================================================
function MessageGroupingDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Message Grouping</CardTitle>
        <CardDescription>
          Group consecutive messages with date separators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            {/* Date Separator */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground px-2">Today</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Grouped Messages */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="bg-muted rounded-lg rounded-tl-none p-3">
                  <p className="text-sm">Hello! How can I help you today?</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm">Feel free to ask me anything.</p>
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  10:30 AM
                </span>
              </div>
            </div>

            {/* User Messages */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="space-y-1 items-end flex flex-col">
                <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3">
                  <p className="text-sm">Hi there!</p>
                </div>
                <div className="bg-primary text-primary-foreground rounded-lg p-3">
                  <p className="text-sm">I have a question about React.</p>
                </div>
                <span className="text-xs text-muted-foreground mr-1">
                  10:31 AM
                </span>
              </div>
            </div>

            {/* Another Date Separator */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground px-2">
                Yesterday
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Earlier Messages */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[70%]">
                <p className="text-sm">
                  This is a message from yesterday&apos;s conversation.
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  4:15 PM
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description="Message bubbles, streaming, typing indicators, and more"
      />

      <Tabs defaultValue="bubbles" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="bubbles">Message Bubbles</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="typing">Typing Indicators</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="grouping">Grouping</TabsTrigger>
        </TabsList>

        <TabsContent value="bubbles">
          <ComponentSection
            title="Message Bubble Variants"
            description="Different styles and layouts for chat messages"
          >
            <MessageBubbleVariants />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="streaming">
          <ComponentSection
            title="Streaming Messages"
            description="Real-time text generation with visual feedback"
          >
            <StreamingMessageDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="typing">
          <ComponentSection
            title="Typing Indicators"
            description="Show when someone is composing a message"
          >
            <TypingIndicatorDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="actions">
          <ComponentSection
            title="Message Actions"
            description="Interactive actions for messages"
          >
            <MessageActionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="grouping">
          <ComponentSection
            title="Message Grouping"
            description="Group messages by sender and time"
          >
            <MessageGroupingDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
