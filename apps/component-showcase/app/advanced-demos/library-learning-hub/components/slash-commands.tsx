'use client'

import { useMemo, useState, useEffect, useCallback, useRef, memo } from 'react'
import { cn, Badge, ScrollArea } from '@clarity-chat/primitives'
import {
  Layers,
  Code2,
  Plug,
  FileCode,
  Brain,
  Coins,
  Terminal,
} from 'lucide-react'

export interface SlashCommand {
  id: string
  name: string
  label: string
  description: string
  icon: React.ReactNode
  category: string
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: 'components',
    name: 'components',
    label: '/components',
    description: 'List all available components',
    icon: <Layers className="h-3.5 w-3.5" />,
    category: 'Browse',
  },
  {
    id: 'hooks',
    name: 'hooks',
    label: '/hooks',
    description: 'List all available hooks',
    icon: <Code2 className="h-3.5 w-3.5" />,
    category: 'Browse',
  },
  {
    id: 'adapters',
    name: 'adapters',
    label: '/adapters',
    description: 'Show adapter documentation',
    icon: <Plug className="h-3.5 w-3.5" />,
    category: 'Browse',
  },
  {
    id: 'example',
    name: 'example',
    label: '/example',
    description: 'Show code example for a component or hook',
    icon: <FileCode className="h-3.5 w-3.5" />,
    category: 'Code',
  },
  {
    id: 'memory',
    name: 'memory',
    label: '/memory',
    description: 'Memory system documentation',
    icon: <Brain className="h-3.5 w-3.5" />,
    category: 'Docs',
  },
  {
    id: 'tokens',
    name: 'tokens',
    label: '/tokens',
    description: 'Token optimization documentation',
    icon: <Coins className="h-3.5 w-3.5" />,
    category: 'Docs',
  },
]

export interface SlashCommandMenuProps {
  commands?: SlashCommand[]
  filter: string
  onSelect: (command: SlashCommand) => void
  onClose?: () => void
  visible?: boolean
  className?: string
}

export const SlashCommandMenu = memo(function SlashCommandMenu({
  commands,
  filter,
  onSelect,
  onClose,
  visible = true,
  className,
}: SlashCommandMenuProps) {
  const [highlightIdx, setHighlightIdx] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const sourceCommands = commands ?? SLASH_COMMANDS
  const filteredCommands = useMemo(() => {
    if (!filter) return sourceCommands
    const lowerFilter = filter.toLowerCase()
    return sourceCommands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(lowerFilter) ||
        cmd.description.toLowerCase().includes(lowerFilter) ||
        cmd.category.toLowerCase().includes(lowerFilter)
    )
  }, [filter, sourceCommands])

  // Reset highlight when filter changes
  useEffect(() => {
    setHighlightIdx(0)
  }, [filter])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!visible || filteredCommands.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightIdx((i) => Math.min(i + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightIdx((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          onSelect(filteredCommands[highlightIdx])
          break
        case 'Escape':
          e.preventDefault()
          onClose?.()
          break
      }
    },
    [visible, filteredCommands, highlightIdx, onSelect, onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Scroll highlighted item into view
  useEffect(() => {
    const container = listRef.current
    if (!container) return
    const highlighted = container.querySelector('[data-highlighted="true"]')
    highlighted?.scrollIntoView({ block: 'nearest' })
  }, [highlightIdx])

  if (!visible || filteredCommands.length === 0) return null

  const highlightedId = filteredCommands[highlightIdx]?.name

  return (
    <div
      className={cn(
        'absolute bottom-full left-0 right-0 mb-2 rounded-xl border bg-card shadow-xl z-50 overflow-hidden',
        'animate-in fade-in slide-in-from-bottom-2 duration-200',
        className
      )}
      role="listbox"
      aria-label="Slash commands"
      aria-activedescendant={
        highlightedId ? `slash-cmd-${highlightedId}` : undefined
      }
    >
      <div className="px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Slash Commands
          </span>
          <Badge variant="outline" className="text-[10px] ml-auto">
            {filteredCommands.length} available
          </Badge>
        </div>
      </div>
      <ScrollArea className="max-h-52">
        <div className="p-1.5" ref={listRef}>
          {filteredCommands.map((cmd, idx) => (
            <button
              key={cmd.name}
              id={`slash-cmd-${cmd.name}`}
              role="option"
              aria-selected={idx === highlightIdx}
              data-highlighted={idx === highlightIdx}
              onClick={() => onSelect(cmd)}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left group',
                idx === highlightIdx ? 'bg-muted/70' : 'hover:bg-muted/70'
              )}
            >
              <div className="p-1.5 rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {cmd.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-mono">
                    /{cmd.name}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                    {cmd.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {cmd.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="px-3 py-1.5 border-t bg-muted/20">
        <p className="text-[10px] text-muted-foreground">
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">
            ↑↓
          </kbd>{' '}
          navigate{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">
            ↵
          </kbd>{' '}
          select{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">
            esc
          </kbd>{' '}
          close
        </p>
      </div>
    </div>
  )
})

export { SLASH_COMMANDS }
