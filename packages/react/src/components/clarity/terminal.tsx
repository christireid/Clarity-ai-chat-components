'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Check,
  Copy,
  Download,
  ChevronDown,
  Play,
  ExternalLink,
  Maximize2,
  Minimize2,
  WrapText,
  FileCode,
  Terminal as TerminalIcon,
  Eye,
} from 'lucide-react'

interface TerminalProps {
  lines: Array<{
    type: 'input' | 'output' | 'error' | 'success' | 'info' | 'warning'
    content: string
    timestamp?: Date
  }>
  showCursor?: boolean
  maxHeight?: number | string
  className?: string
  onCommand?: (command: string) => void
}

export function Terminal({
  lines = [],
  showCursor = true,
  maxHeight = '400px',
  className,
  onCommand,
}: TerminalProps) {
  const [inputValue, setInputValue] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onCommand?.(inputValue)
      setInputValue('')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-code-border bg-[#1a1b26] overflow-hidden font-mono text-sm shadow-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1b26]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs text-muted-foreground">terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground px-2 py-0.5 rounded border border-white/10 bg-white/5">
            bash
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-auto p-4 space-y-1 text-left', // Added text-left explicitly
          maxHeight && `max-h-[${maxHeight}]`
        )}
        style={{ maxHeight: maxHeight }}
      >
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2 min-h-[1.5em] text-left">
            {' '}
            {/* Added text-left here too */}
            {line.type === 'input' && (
              <span className="text-pink-400 select-none shrink-0">$</span>
            )}
            <span
              className={cn(
                'break-all whitespace-pre-wrap',
                line.type === 'input' && 'text-white font-medium',
                line.type === 'output' && 'text-gray-300',
                line.type === 'error' && 'text-red-400',
                line.type === 'success' && 'text-green-400',
                line.type === 'info' && 'text-blue-400',
                line.type === 'warning' && 'text-yellow-400'
              )}
            >
              {line.content}
            </span>
          </div>
        ))}

        {/* Input Line */}
        {onCommand && (
          <div className="flex gap-2 items-center text-left">
            {' '}
            {/* Added text-left */}
            <span className="text-pink-400 select-none shrink-0">$</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-white p-0 m-0 h-6 focus:ring-0"
                autoFocus
              />
              {showCursor && !inputValue && (
                <span className="absolute left-0 top-0 w-2.5 h-5 bg-white/50 animate-pulse block pointer-events-none" />
              )}
            </div>
          </div>
        )}

        {/* Blinking cursor for display-only mode */}
        {!onCommand && showCursor && (
          <div className="flex gap-2 items-center text-left">
            <span className="text-pink-400 select-none shrink-0">$</span>
            <span className="w-2.5 h-5 bg-white/50 animate-pulse block" />
          </div>
        )}
      </div>
    </div>
  )
}
