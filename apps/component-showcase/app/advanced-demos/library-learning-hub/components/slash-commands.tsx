'use client'

import { useMemo } from 'react'
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
  name: string
  description: string
  icon: React.ReactNode
  category: string
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    name: 'components',
    description: 'List all available components',
    icon: <Layers className="h-3.5 w-3.5" />,
    category: 'Browse',
  },
  {
    name: 'hooks',
    description: 'List all available hooks',
    icon: <Code2 className="h-3.5 w-3.5" />,
    category: 'Browse',
  },
  {
    name: 'adapters',
    description: 'Show adapter documentation',
    icon: <Plug className="h-3.5 w-3.5" />,
    category: 'Browse',
  },
  {
    name: 'example',
    description: 'Show code example for a component or hook',
    icon: <FileCode className="h-3.5 w-3.5" />,
    category: 'Code',
  },
  {
    name: 'memory',
    description: 'Memory system documentation',
    icon: <Brain className="h-3.5 w-3.5" />,
    category: 'Docs',
  },
  {
    name: 'tokens',
    description: 'Token optimization documentation',
    icon: <Coins className="h-3.5 w-3.5" />,
    category: 'Docs',
  },
]

interface SlashCommandMenuProps {
  filter: string
  onSelect: (command: SlashCommand) => void
  visible: boolean
  className?: string
}

export function SlashCommandMenu({
  filter,
  onSelect,
  visible,
  className,
}: SlashCommandMenuProps) {
  const filteredCommands = useMemo(() => {
    if (!filter) return SLASH_COMMANDS
    const lowerFilter = filter.toLowerCase()
    return SLASH_COMMANDS.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(lowerFilter) ||
        cmd.description.toLowerCase().includes(lowerFilter) ||
        cmd.category.toLowerCase().includes(lowerFilter)
    )
  }, [filter])

  if (!visible || filteredCommands.length === 0) return null

  return (
    <div
      className={cn(
        'absolute bottom-full left-0 right-0 mb-2 rounded-xl border bg-card shadow-xl z-50 overflow-hidden',
        'animate-in fade-in slide-in-from-bottom-2 duration-200',
        className
      )}
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
        <div className="p-1.5">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.name}
              onClick={() => onSelect(cmd)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted/70 transition-colors text-left group"
            >
              <div className="p-1.5 rounded-md bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {cmd.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-mono">
                    /{cmd.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0"
                  >
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
          Type <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">/</kbd> followed by a command name
        </p>
      </div>
    </div>
  )
}

export { SLASH_COMMANDS }
