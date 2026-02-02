'use client'

import * as React from 'react'
import {
  Send,
  Paperclip,
  Settings,
  ChevronDown,
  Sparkles,
  Code,
  Eye,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  Maximize2,
  Plus,
  MessageSquare,
  History,
  Zap,
  Terminal,
  Globe,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
interface V0Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  code?: string
  preview?: boolean
  timestamp?: Date
}

interface V0CloneProps {
  messages?: V0Message[]
  onSendMessage?: (message: string) => void
  onRegenerate?: () => void
  isGenerating?: boolean
}

// Main V0 Clone Component
export function V0Clone({
  messages = [],
  onSendMessage,
  onRegenerate,
  isGenerating = false,
}: V0CloneProps) {
  const [input, setInput] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('preview')
  const [copied, setCopied] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return
    onSendMessage?.(input)
    setInput('')
  }

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant')

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col bg-muted/30">
        <div className="p-4 border-b">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">Landing page with...</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">Dashboard layout</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">Auth form compon...</span>
            </Button>
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
          >
            <History className="h-4 w-4" />
            History
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-bold">v0</span>
              </div>
              <span className="font-semibold">v0</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold mb-2">
                      What can I help you build?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Describe the UI you want to create and v0 will generate it
                      for you.
                    </p>
                    <div className="grid gap-2 max-w-md mx-auto">
                      {[
                        'A modern landing page for a SaaS product',
                        'A dashboard with charts and stats',
                        'A pricing page with toggle',
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          className="justify-start text-sm h-auto py-3 px-4 bg-transparent"
                          onClick={() => setInput(suggestion)}
                        >
                          <Sparkles className="h-4 w-4 mr-2 text-accent" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="space-y-4">
                      {message.role === 'user' ? (
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <span className="text-sm font-medium">U</span>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded bg-foreground flex items-center justify-center shrink-0">
                            <span className="text-background text-xs font-bold">
                              v0
                            </span>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-sm mb-4">{message.content}</p>
                            {message.code && (
                              <div className="rounded-lg border bg-card overflow-hidden">
                                <Tabs
                                  value={activeTab}
                                  onValueChange={setActiveTab}
                                >
                                  <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/50">
                                    <TabsList className="h-8 bg-transparent p-0">
                                      <TabsTrigger
                                        value="preview"
                                        className="h-8 px-3 text-xs data-[state=active]:bg-background"
                                      >
                                        <Eye className="h-3 w-3 mr-1.5" />
                                        Preview
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="code"
                                        className="h-8 px-3 text-xs data-[state=active]:bg-background"
                                      >
                                        <Code className="h-3 w-3 mr-1.5" />
                                        Code
                                      </TabsTrigger>
                                    </TabsList>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() =>
                                          handleCopy(message.code!)
                                        }
                                      >
                                        {copied ? (
                                          <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                      >
                                        <Maximize2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                  <TabsContent value="preview" className="m-0">
                                    <div className="p-6 min-h-[300px] bg-white dark:bg-zinc-950">
                                      <div className="text-center py-8 text-muted-foreground">
                                        Preview would render here
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="code" className="m-0">
                                    <ScrollArea className="h-[300px]">
                                      <pre className="p-4 text-xs font-mono">
                                        <code>{message.code}</code>
                                      </pre>
                                    </ScrollArea>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isGenerating && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded bg-foreground flex items-center justify-center shrink-0">
                      <span className="text-background text-xs font-bold">
                        v0
                      </span>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Generating...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe what you want to build..."
                    className="min-h-[60px] pr-24 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!input.trim() || isGenerating}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          <Terminal className="h-3 w-3 mr-1.5" />
                          Next.js
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Next.js</DropdownMenuItem>
                        <DropdownMenuItem>React</DropdownMenuItem>
                        <DropdownMenuItem>Vue</DropdownMenuItem>
                        <DropdownMenuItem>Svelte</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// V0 Artifact Card (mini preview)
interface V0ArtifactCardProps {
  title: string
  description?: string
  previewUrl?: string
  code?: string
  onOpen?: () => void
  onCopy?: () => void
  onDownload?: () => void
}

export function V0ArtifactCard({
  title,
  description,
  previewUrl,
  code,
  onOpen,
  onCopy,
  onDownload,
}: V0ArtifactCardProps) {
  return (
    <div className="rounded-lg border overflow-hidden bg-card">
      <div className="aspect-video bg-muted relative">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title={title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Code className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <Button size="sm" variant="secondary" onClick={onOpen}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs flex-1 bg-transparent"
            onClick={onCopy}
          >
            <Copy className="h-3 w-3 mr-1.5" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs flex-1 bg-transparent"
            onClick={onDownload}
          >
            <Download className="h-3 w-3 mr-1.5" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}

// V0 Generation Status
interface V0GenerationStatusProps {
  status: 'idle' | 'generating' | 'complete' | 'error'
  progress?: number
  message?: string
}

export function V0GenerationStatus({
  status,
  progress = 0,
  message,
}: V0GenerationStatusProps) {
  const statusConfig = {
    idle: { icon: Sparkles, label: 'Ready', color: 'text-muted-foreground' },
    generating: { icon: RefreshCw, label: 'Generating', color: 'text-accent' },
    complete: { icon: Check, label: 'Complete', color: 'text-green-500' },
    error: { icon: Terminal, label: 'Error', color: 'text-destructive' },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center',
          status === 'generating' ? 'bg-accent/10' : 'bg-muted'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            config.color,
            status === 'generating' && 'animate-spin'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', config.color)}>
          {config.label}
        </p>
        {message && (
          <p className="text-xs text-muted-foreground truncate">{message}</p>
        )}
        {status === 'generating' && progress > 0 && (
          <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
