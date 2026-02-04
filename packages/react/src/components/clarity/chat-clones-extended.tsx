'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Chat } from './chat/Chat'
import { useChat } from './chat/Chat'
import {
  Code,
  MoreVertical,
  User,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Plus,
  Send,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import type { Message } from './chat/types'

// =============================================================================
// MANUS CHAT CLONE
// =============================================================================

function ManusBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          !isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-500'
            : 'bg-accent'
        )}
      >
        {!isUser ? (
          <Code className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-lg p-3 text-sm',
          !isUser ? 'bg-muted' : 'bg-primary text-primary-foreground'
        )}
      >
        {message.content}
        <div className="flex items-center gap-1 mt-1 text-xs opacity-60">
          <Clock className="w-3 h-3" />
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.status === 'sent' && (
            <CheckCircle2 className="w-3 h-3 ml-1" />
          )}
        </div>
      </div>
    </div>
  )
}

function ManusChatInner() {
  const { addMessage } = useChat()

  const handleSend = (content: string) => {
    addMessage({ role: 'user', content, status: 'sent' })

    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content:
          'I can help you with that! Let me analyze your code and suggest improvements...',
        status: 'sent',
      })
    }, 1000)
  }

  const slashCommands = [
    {
      id: '1',
      label: 'explain',
      description: 'Explain code',
      action: () => handleSend('/explain'),
    },
    {
      id: '2',
      label: 'fix',
      description: 'Fix bugs',
      action: () => handleSend('/fix'),
    },
    {
      id: '3',
      label: 'test',
      description: 'Generate tests',
      action: () => handleSend('/test'),
    },
  ]

  return (
    <Chat className="h-[600px] border-border shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Manus</h3>
            <p className="text-xs text-muted-foreground">AI Coding Assistant</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <Chat.Messages renderBubble={(msg) => <ManusBubble message={msg} />} />

      <Chat.Input
        onSend={handleSend}
        placeholder="Ask Manus anything about code..."
        className="border-t border-border p-4"
        slashCommands={slashCommands}
      />
    </Chat>
  )
}

export function ManusChat({ className }: { className?: string }) {
  const initialMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content:
        "Hey! I'm Manus. I can help you build, debug, and ship code faster.",
      timestamp: new Date(),
      status: 'sent',
    },
  ]

  return (
    <div className={className}>
      <Chat.Provider initialMessages={initialMessages}>
        <ManusChatInner />
      </Chat.Provider>
    </div>
  )
}

// =============================================================================
// EMERGENT CHAT CLONE
// =============================================================================

function EmergentBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
          !isUser
            ? 'bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500'
            : 'bg-gradient-to-br from-orange-400 to-pink-500'
        )}
      >
        {!isUser ? (
          <Sparkles className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1 max-w-[85%] space-y-2">
        <div
          className={cn(
            'rounded-2xl p-4 text-sm shadow-sm',
            !isUser
              ? 'bg-card border border-border'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {message.content}
        </div>
        {message.metadata?.tools && (
          <div className="flex gap-2 flex-wrap">
            {message.metadata.tools.map((tool: string) => (
              <span
                key={tool}
                className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

function EmergentChatInner() {
  const { addMessage } = useChat()
  const [isThinking, setIsThinking] = React.useState(false)

  const handleSend = (content: string) => {
    addMessage({ role: 'user', content })
    setIsThinking(true)

    setTimeout(() => {
      setIsThinking(false)
      addMessage({
        role: 'assistant',
        content:
          "I'll help you build that! Let me start by analyzing the requirements...",
        metadata: { tools: ['Code Generation', 'File System'] },
      })
    }, 2000)
  }

  return (
    <Chat className="h-[600px] bg-gradient-to-b from-background to-accent/5 border-border shadow-lg">
      <div className="flex items-center justify-between border-b border-border/50 p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Emergent AI</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500" /> E1 Agent - Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            New Chat
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Chat.Messages
          renderBubble={(msg) => <EmergentBubble message={msg} />}
          className="p-6"
        />
        {isThinking && (
          <div className="px-6 pb-4 animate-pulse flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              E1 is thinking...
            </div>
          </div>
        )}
      </div>

      <Chat.Input
        onSend={handleSend}
        placeholder="Describe what you want to build..."
        className="border-t border-border/50 p-4 bg-background/50 backdrop-blur-sm"
      />
    </Chat>
  )
}

export function EmergentChat({ className }: { className?: string }) {
  const initialMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm E1, your AI coding agent.",
      timestamp: new Date(),
    },
  ]

  return (
    <div className={className}>
      <Chat.Provider initialMessages={initialMessages}>
        <EmergentChatInner />
      </Chat.Provider>
    </div>
  )
}

// =============================================================================
// LOVEABLE CHAT CLONE
// =============================================================================

function LoveableBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3 items-start', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md',
          !isUser
            ? 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'
            : 'bg-gradient-to-br from-orange-400 to-rose-400'
        )}
      >
        {!isUser ? (
          <span className="text-sm">💜</span>
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1 max-w-[80%] space-y-2">
        <div
          className={cn(
            'rounded-3xl p-4 text-sm shadow-md',
            !isUser
              ? 'bg-white dark:bg-gray-900 border border-pink-200 dark:border-pink-800'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
          )}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-2">
          {message.metadata?.reaction && (
            <span className="text-lg">{message.metadata.reaction}</span>
          )}
          <p className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function LoveableChatInner() {
  const { addMessage } = useChat()

  const handleSend = (content: string) => {
    addMessage({ role: 'user', content })

    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: 'That sounds wonderful! ✨ I love it!',
        metadata: { reaction: '🎨' },
      })
    }, 1500)
  }

  return (
    <Chat className="h-[600px] bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-800 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between border-b border-pink-200 dark:border-pink-800 p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center animate-pulse">
            <span className="text-xl">💜</span>
          </div>
          <div>
            <h3 className="font-bold text-sm bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Loveable
            </h3>
            <p className="text-xs text-muted-foreground">
              Your Creative AI Partner
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <Chat.Messages
        renderBubble={(msg) => <LoveableBubble message={msg} />}
        className="p-6"
      />

      <div className="border-t border-pink-200 dark:border-pink-800 p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-b-2xl">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-pink-300 hover:bg-pink-100"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Chat.Input
            onSend={handleSend}
            placeholder="Tell me what you'd love to create... ✨"
            className="flex-1 border-0 p-0"
          />
        </div>
      </div>
    </Chat>
  )
}

export function LoveableChat({ className }: { className?: string }) {
  const initialMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 I'm here to help you create something amazing!",
      timestamp: new Date(),
      metadata: { reaction: '💜' },
    },
  ]

  return (
    <div className={className}>
      <Chat.Provider initialMessages={initialMessages}>
        <LoveableChatInner />
      </Chat.Provider>
    </div>
  )
}
