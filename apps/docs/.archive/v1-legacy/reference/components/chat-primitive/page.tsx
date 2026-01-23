'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function ChatPrimitivePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
          <span>Low-Level Primitives</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">ChatPrimitive</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Unstyled, accessible, composable building blocks for custom chat UIs.
          Inspired by Radix UI primitives - bring your own styles while we handle
          accessibility, keyboard navigation, and ARIA attributes.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Low-Level (Primitives) •{' '}
          <strong>Domain:</strong> Chat UI •{' '}
          <strong>Style:</strong> Headless (Unstyled)
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { ChatPrimitive, useClarityChat } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatPrimitive.Root messages={chat.messages} isLoading={chat.isLoading}>
      <ChatPrimitive.Messages>
        {chat.messages.map((msg) => (
          <ChatPrimitive.Message key={msg.id} message={msg}>
            <ChatPrimitive.MessageContent />
          </ChatPrimitive.Message>
        ))}
      </ChatPrimitive.Messages>

      <ChatPrimitive.Input
        onSubmit={(content) => chat.append({ role: 'user', content })}
      />
    </ChatPrimitive.Root>
  )
}`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Headless / Unstyled
          </span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            Accessible (WCAG 2.1)
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Composable
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
            asChild Pattern
          </span>
        </div>
      </section>

      {/* Why ChatPrimitive */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Why ChatPrimitive?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
              When to Use Primitives
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-purple-500">&#10003;</span>
                Need complete control over styling
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">&#10003;</span>
                Building a custom design system
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">&#10003;</span>
                Integrating with existing UI libraries
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">&#10003;</span>
                Want accessibility handled for you
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
              Built-in Accessibility
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Proper ARIA roles (region, log, article)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Live regions for dynamic content
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Keyboard navigation support
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Screen reader announcements
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Component Hierarchy */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Component Hierarchy</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`ChatPrimitive
├── Root               // Container with chat context
│   ├── Messages       // Message list container (role="log")
│   │   └── Message    // Individual message (role="article")
│   │       ├── MessageContent   // Message text
│   │       └── MessageActions   // Action buttons group
│   │           ├── CopyButton
│   │           ├── RegenerateButton
│   │           └── DeleteButton
│   ├── EmptyState     // Shown when no messages
│   ├── LoadingIndicator // Shown when loading
│   └── Input          // Message input (Enter to send)`}</code>
        </pre>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Usage Examples</h2>

        <CollapsibleSection title="Complete Chat UI with Tailwind" defaultOpen={true}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ChatPrimitive, useClarityChat } from '@clarity-chat/react'

function TailwindChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatPrimitive.Root
      messages={chat.messages}
      isLoading={chat.isLoading}
      className="flex flex-col h-[600px] border rounded-xl"
    >
      {/* Empty state */}
      <ChatPrimitive.EmptyState className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      </ChatPrimitive.EmptyState>

      {/* Messages */}
      <ChatPrimitive.Messages className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((msg) => (
          <ChatPrimitive.Message
            key={msg.id}
            message={msg}
            className={\`max-w-[80%] p-4 rounded-2xl \${
              msg.role === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }\`}
          >
            <ChatPrimitive.MessageContent className="prose prose-sm" />

            <ChatPrimitive.MessageActions className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChatPrimitive.CopyButton
                className="text-xs text-muted-foreground hover:text-foreground"
                onCopy={() => toast.success('Copied!')}
              >
                Copy
              </ChatPrimitive.CopyButton>
              {msg.role === 'assistant' && (
                <ChatPrimitive.RegenerateButton
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onRegenerate={() => chat.reload()}
                >
                  Retry
                </ChatPrimitive.RegenerateButton>
              )}
            </ChatPrimitive.MessageActions>
          </ChatPrimitive.Message>
        ))}

        {/* Loading indicator */}
        <ChatPrimitive.LoadingIndicator className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        </ChatPrimitive.LoadingIndicator>
      </ChatPrimitive.Messages>

      {/* Input */}
      <div className="border-t p-4">
        <ChatPrimitive.Input
          onSubmit={(content) => chat.append({ role: 'user', content })}
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
      </div>
    </ChatPrimitive.Root>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Using asChild Pattern" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Use <code className="px-1 bg-muted rounded">asChild</code> to render primitives
            as your own components (like Radix UI). The primitive&apos;s props merge with your component.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ChatPrimitive } from '@clarity-chat/react'
import { motion } from 'framer-motion'

function AnimatedChat() {
  return (
    <ChatPrimitive.Root messages={messages}>
      {/* Use Framer Motion for animations */}
      <ChatPrimitive.Messages asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {messages.map((msg) => (
            <ChatPrimitive.Message
              key={msg.id}
              message={msg}
              asChild
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="p-4 rounded-lg bg-muted"
              >
                <ChatPrimitive.MessageContent />
              </motion.div>
            </ChatPrimitive.Message>
          ))}
        </motion.div>
      </ChatPrimitive.Messages>

      {/* Use custom Button component */}
      <ChatPrimitive.CopyButton asChild>
        <MyCustomButton variant="ghost" size="sm">
          <CopyIcon /> Copy
        </MyCustomButton>
      </ChatPrimitive.CopyButton>
    </ChatPrimitive.Root>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="With Streaming Support" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ChatPrimitive, useClarityChat } from '@clarity-chat/react'

function StreamingChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatPrimitive.Root messages={chat.messages} isLoading={chat.isLoading}>
      <ChatPrimitive.Messages>
        {chat.messages.map((msg, index) => {
          // Check if this is the last assistant message and still streaming
          const isStreaming =
            msg.role === 'assistant' &&
            index === chat.messages.length - 1 &&
            chat.isLoading

          return (
            <ChatPrimitive.Message
              key={msg.id}
              message={msg}
              isStreaming={isStreaming}
              className={\`relative \${isStreaming ? 'animate-pulse' : ''}\`}
            >
              <ChatPrimitive.MessageContent />

              {/* Show cursor when streaming */}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-current animate-blink ml-1" />
              )}
            </ChatPrimitive.Message>
          )
        })}
      </ChatPrimitive.Messages>

      <ChatPrimitive.Input
        onSubmit={(content) => chat.append({ role: 'user', content })}
        disabled={chat.isLoading}
      />
    </ChatPrimitive.Root>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Integration with shadcn/ui" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ChatPrimitive } from '@clarity-chat/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

function ShadcnChat({ messages, onSend }) {
  return (
    <ChatPrimitive.Root messages={messages}>
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 p-0">
          <ChatPrimitive.Messages asChild>
            <ScrollArea className="h-full p-4">
              {messages.map((msg) => (
                <ChatPrimitive.Message
                  key={msg.id}
                  message={msg}
                  className="mb-4"
                >
                  <Card className={msg.role === 'user' ? 'ml-auto max-w-[80%]' : 'max-w-[80%]'}>
                    <CardContent className="p-3">
                      <ChatPrimitive.MessageContent />
                    </CardContent>
                  </Card>
                </ChatPrimitive.Message>
              ))}
            </ScrollArea>
          </ChatPrimitive.Messages>

          <div className="p-4 border-t flex gap-2">
            <ChatPrimitive.Input asChild>
              <Textarea
                placeholder="Type a message..."
                className="min-h-[40px] resize-none"
              />
            </ChatPrimitive.Input>
            <Button onClick={() => onSend(inputValue)}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </ChatPrimitive.Root>
  )
}`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">API Reference</h2>

        {/* Root */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">ChatPrimitive.Root</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Container that provides chat context to all child primitives.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-semibold">Prop</th>
                  <th className="text-left p-2 font-semibold">Type</th>
                  <th className="text-left p-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-2 font-mono text-xs text-brand-600">messages</td>
                  <td className="p-2 font-mono text-xs">CoreMessage[]</td>
                  <td className="p-2 text-xs text-muted-foreground">Chat messages array</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 font-mono text-xs text-brand-600">isLoading</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-xs text-muted-foreground">Loading state</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 font-mono text-xs text-brand-600">onSend</td>
                  <td className="p-2 font-mono text-xs">(content: string) =&gt; void</td>
                  <td className="p-2 text-xs text-muted-foreground">Send handler for Input</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 font-mono text-xs text-brand-600">asChild</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-xs text-muted-foreground">Render as child element</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">ChatPrimitive.Message</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Individual message wrapper. Provides message context to children.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-semibold">Prop</th>
                  <th className="text-left p-2 font-semibold">Type</th>
                  <th className="text-left p-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-2 font-mono text-xs text-brand-600">message</td>
                  <td className="p-2 font-mono text-xs">CoreMessage</td>
                  <td className="p-2 text-xs text-muted-foreground">Message object (required)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-2 font-mono text-xs text-brand-600">isStreaming</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 text-xs text-muted-foreground">Streaming indicator</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Sets <code className="px-1 bg-background rounded">data-role</code> and{' '}
            <code className="px-1 bg-background rounded">data-streaming</code> attributes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Action Buttons</h3>
          <div className="grid md:grid-cols-3 gap-4 mt-3">
            <div className="p-3 bg-background rounded">
              <h4 className="font-semibold text-sm mb-1">CopyButton</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Copies message content to clipboard
              </p>
              <code className="text-xs">onCopy?: (content) =&gt; void</code>
            </div>
            <div className="p-3 bg-background rounded">
              <h4 className="font-semibold text-sm mb-1">RegenerateButton</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Triggers message regeneration
              </p>
              <code className="text-xs">onRegenerate?: (id) =&gt; void</code>
            </div>
            <div className="p-3 bg-background rounded">
              <h4 className="font-semibold text-sm mb-1">DeleteButton</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Triggers message deletion
              </p>
              <code className="text-xs">onDelete?: (id) =&gt; void</code>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">ChatPrimitive.Input</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Textarea input with Enter-to-submit. Extends textarea props.
          </p>
          <pre className="bg-background p-3 rounded text-xs">
            <code>{`interface ChatInputProps extends TextareaHTMLAttributes {
  onSubmit?: (content: string) => void  // Called on Enter (not Shift+Enter)
  asChild?: boolean
}`}</code>
          </pre>
        </div>
      </section>

      {/* Data Attributes */}
      <section className="mb-12 p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
        <h2 className="text-xl font-semibold mb-4">Data Attributes for Styling</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Primitives expose data attributes for styling different states:
        </p>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`/* Target user vs assistant messages */
[data-role="user"] { /* user message styles */ }
[data-role="assistant"] { /* assistant message styles */ }

/* Target streaming state */
[data-streaming="true"] { animation: pulse 1s infinite; }

/* CSS example */
.message[data-role="user"] {
  margin-left: auto;
  background: var(--color-primary);
  color: white;
}

.message[data-role="assistant"] {
  margin-right: auto;
  background: var(--color-muted);
}`}</code>
        </pre>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Related Components</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/clarity-chat"
            className="block p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <h3 className="font-semibold mb-1">ClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Fully styled, drop-in chat component
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="block p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <h3 className="font-semibold mb-1">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Chat state hook to pair with primitives
            </p>
          </Link>
        </div>
      </section>

      {/* Feedback */}
      <section className="border-t pt-8">
        <FeedbackWidget pageId="chat-primitive" />
      </section>
    </div>
  )
}
