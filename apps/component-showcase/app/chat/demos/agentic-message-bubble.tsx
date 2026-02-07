'use client'

import type { ChatMessage } from '../types'
import { MarkdownRenderer } from '@clarity-chat/react'
import { Button, Badge, Avatar, cn } from '@clarity-chat/primitives'
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Forward,
  Pin,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react'

export function AgenticMessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div
      className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
    >
      <Avatar
        fallback={msg.role === 'assistant' ? 'AI' : 'U'}
        className={cn(
          'w-8 h-8 shrink-0',
          msg.role === 'assistant'
            ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
            : 'bg-primary text-primary-foreground'
        )}
      />
      <div
        className={cn(
          'flex-1 space-y-2',
          msg.role === 'user' && 'flex flex-col items-end'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3 max-w-[85%]',
            msg.role === 'assistant'
              ? 'bg-muted'
              : 'bg-primary text-primary-foreground'
          )}
        >
          <MarkdownRenderer content={msg.content} />
        </div>

        {/* Status Indicator */}
        {msg.role === 'user' && msg.status && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {msg.status === 'pending' && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {msg.status === 'streaming' && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {msg.status === 'complete' && (
              <CheckCircle className="h-3 w-3 text-blue-500" />
            )}
            {msg.status === 'error' && <X className="h-3 w-3 text-red-500" />}
            <span className="capitalize">{msg.status}</span>
          </div>
        )}

        {/* Tool Executions */}
        {msg.tools && msg.tools.length > 0 && (
          <div className="space-y-2 max-w-[85%]">
            <p className="text-xs text-muted-foreground font-medium">
              Tools Used
            </p>
            {msg.tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm"
              >
                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span className="font-mono">{tool.name}</span>
                <span className="text-muted-foreground">{tool.duration}</span>
              </div>
            ))}
          </div>
        )}

        {/* Citations */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-[85%]">
            {msg.citations.map((cite, i) => (
              <div
                key={cite.id}
                className="flex-shrink-0 w-40 p-2 border rounded-lg text-xs cursor-pointer hover:bg-muted"
              >
                <div className="flex items-center gap-1 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {i + 1}
                  </Badge>
                </div>
                <p className="font-medium truncate">{cite.title}</p>
                <p className="text-muted-foreground truncate">{cite.url}</p>
              </div>
            ))}
          </div>
        )}

        {/* Message Actions */}
        {msg.role === 'assistant' && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Forward className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Pin className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
