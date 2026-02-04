'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Send,
  Plus,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  Zap,
  Globe,
  ArrowUp,
  Paperclip,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Share,
  Bot,
  User,
  ChevronDown,
  X,
  ExternalLink,
  ImageIcon,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@clarity-chat/primitives'

// Types
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface ChatCloneProps {
  messages?: ChatMessage[]
  onSend?: (message: string) => void
  placeholder?: string
  className?: string
}

// ChatGPT Clone
export function ChatGPTClone({
  messages = [],
  onSend,
  placeholder = 'Message ChatGPT...',
  className,
}: ChatCloneProps) {
  const [input, setInput] = React.useState('')
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const handleSend = () => {
    if (input.trim() && onSend) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div
      className={cn(
        'flex h-[600px] bg-background rounded-lg overflow-hidden border',
        className
      )}
    >
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <div className="p-3">
            <Button
              className="w-full justify-start gap-2 bg-transparent"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New chat
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 pb-3">
              <p className="text-xs text-muted-foreground px-2 py-1">Today</p>
              {['Previous conversation 1', 'Previous conversation 2'].map(
                (title, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm truncate"
                  >
                    {title}
                  </button>
                )
              )}
            </div>
          </ScrollArea>
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm">ChatGPT</span>
            <Badge variant="secondary" className="text-xs">
              4o
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-background" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                How can I help you today?
              </h2>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  <Avatar className="h-8 w-8 shrink-0">
                    {msg.role === 'assistant' ? (
                      <AvatarFallback className="bg-emerald-500 text-white">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-sm">
                      {msg.role === 'assistant' ? 'ChatGPT' : 'You'}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="relative max-w-3xl mx-auto">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[52px] pr-12 resize-none rounded-2xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  )
}

// Claude Clone
export function ClaudeClone({
  messages = [],
  onSend,
  placeholder = 'Message Claude...',
  className,
}: ChatCloneProps) {
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    if (input.trim() && onSend) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-[600px] bg-background rounded-lg overflow-hidden border',
        className
      )}
    >
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-800 font-semibold text-sm">C</span>
          </div>
          <div>
            <p className="font-medium text-sm">Claude</p>
            <p className="text-xs text-muted-foreground">by Anthropic</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Claude 3.5 Sonnet
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Claude 3.5 Sonnet</DropdownMenuItem>
            <DropdownMenuItem>Claude 3 Opus</DropdownMenuItem>
            <DropdownMenuItem>Claude 3 Haiku</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
            <h1 className="text-2xl font-semibold mb-3">Good afternoon.</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              How can I help you today? I can assist with analysis, writing,
              coding, math, and more.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {[
                'Help me write an email',
                'Explain a concept',
                'Review my code',
                'Brainstorm ideas',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="p-3 text-left rounded-xl border hover:bg-muted transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'px-4',
                  msg.role === 'user' && 'flex justify-end'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    msg.role === 'user' ? 'bg-muted' : 'bg-transparent'
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-end gap-2 rounded-2xl border bg-muted/30 p-2">
            <Button variant="ghost" size="sm" className="shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-h-[40px] max-h-32 border-0 bg-transparent resize-none focus-visible:ring-0 p-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              size="sm"
              className="shrink-0 rounded-xl"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Perplexity Clone
export function PerplexityClone({
  messages = [],
  onSend,
  placeholder = 'Ask anything...',
  className,
}: ChatCloneProps) {
  const [input, setInput] = React.useState('')
  const [focus, setFocus] = React.useState<
    'all' | 'academic' | 'writing' | 'video'
  >('all')

  const handleSend = () => {
    if (input.trim() && onSend) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-[600px] bg-background rounded-lg overflow-hidden border',
        className
      )}
    >
      {/* Header */}
      <div className="h-12 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-500" />
          <span className="font-bold">perplexity</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Thread
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Globe className="h-16 w-16 text-cyan-500 mb-6" />
            <h1 className="text-3xl font-bold mb-2">Where knowledge begins</h1>
            <p className="text-muted-foreground mb-8">
              Search with AI for up-to-date answers
            </p>

            {/* Focus selector */}
            <div className="flex items-center gap-2 mb-6">
              {[
                { id: 'all', label: 'All', icon: Search },
                { id: 'academic', label: 'Academic', icon: MessageSquare },
                { id: 'writing', label: 'Writing', icon: Sparkles },
                { id: 'video', label: 'Video', icon: ImageIcon },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={focus === item.id ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFocus(item.id as any)}
                  className="gap-1"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Search input */}
            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="pl-12 pr-12 h-14 text-base rounded-2xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-500 hover:bg-cyan-600"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>

            {/* Trending topics */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-xl">
              {[
                'Latest AI news',
                'Stock market today',
                'Weather forecast',
                'Sports scores',
              ].map((topic, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setInput(topic)
                  }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="px-4">
                {msg.role === 'user' ? (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium pt-1">{msg.content}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sources */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="shrink-0 w-48 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                        >
                          <p className="text-xs text-muted-foreground mb-1 truncate">
                            source-{i}.com
                          </p>
                          <p className="text-sm font-medium line-clamp-2">
                            Relevant source title
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Answer */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4 text-cyan-500" />
                        Answer
                      </div>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {messages.length > 0 && (
        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask follow-up..."
              className="min-h-[48px] pr-12 resize-none rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              size="sm"
              className="absolute right-2 bottom-2 rounded-lg bg-cyan-500 hover:bg-cyan-600"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Grok Clone
export function GrokClone({
  messages = [],
  onSend,
  placeholder = 'Ask Grok anything...',
  className,
}: ChatCloneProps) {
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    if (input.trim() && onSend) {
      onSend(input)
      setInput('')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col h-[600px] bg-black text-white rounded-lg overflow-hidden border border-zinc-800',
        className
      )}
    >
      {/* Header */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <span className="font-bold">Grok</span>
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-400 text-xs"
          >
            Beta
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{"Hey, I'm Grok!"}</h1>
            <p className="text-zinc-400 mb-8 max-w-md">
              I have real-time knowledge and a rebellious streak. Ask me
              anything.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {[
                "What's happening on X?",
                'Tell me a joke',
                'Explain quantum physics',
                'Write some code',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="p-3 text-left rounded-xl border border-zinc-800 hover:bg-zinc-900 transition-colors text-sm text-zinc-300"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="px-4 flex gap-4">
                <Avatar className="h-8 w-8 shrink-0">
                  {msg.role === 'assistant' ? (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                      <Zap className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-zinc-800">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">
                    {msg.role === 'assistant' ? 'Grok' : 'You'}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[52px] pr-12 resize-none rounded-2xl bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            size="sm"
            className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
