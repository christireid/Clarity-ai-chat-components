'use client'

import { useMemo } from 'react'
import { cn, Badge, ScrollArea } from '@clarity-chat/primitives'
import { AtSign, Layers, Code2, Plug } from 'lucide-react'

export interface MentionItem {
  id: string
  label: string
  type: 'component' | 'hook' | 'adapter'
}

const MENTION_ITEMS: MentionItem[] = [
  // Components
  { id: 'chatwindow', label: 'ChatWindow', type: 'component' },
  { id: 'chatinput', label: 'ChatInput', type: 'component' },
  { id: 'streamingmessage', label: 'StreamingMessage', type: 'component' },
  { id: 'messagebubble', label: 'MessageBubble', type: 'component' },
  { id: 'codeblock', label: 'CodeBlock', type: 'component' },
  { id: 'typingindicator', label: 'TypingIndicator', type: 'component' },
  { id: 'thinkingindicator', label: 'ThinkingIndicator', type: 'component' },
  { id: 'modelselector', label: 'ModelSelector', type: 'component' },
  { id: 'tokenusagemeter', label: 'TokenUsageMeter', type: 'component' },
  { id: 'promptlibrary', label: 'PromptLibrary', type: 'component' },
  { id: 'commandpalette', label: 'CommandPalette', type: 'component' },
  { id: 'fileupload', label: 'FileUpload', type: 'component' },
  { id: 'voiceinput', label: 'VoiceInput', type: 'component' },
  { id: 'exportdialog', label: 'ExportDialog', type: 'component' },
  { id: 'citationcard', label: 'CitationCard', type: 'component' },
  { id: 'toolcard', label: 'ToolCard', type: 'component' },
  { id: 'mentionsystem', label: 'MentionSystem', type: 'component' },
  { id: 'claritychatapp', label: 'ClarityChatApp', type: 'component' },
  // Hooks
  { id: 'useclaritychat', label: 'useClarityChat', type: 'hook' },
  { id: 'usestreaming', label: 'useStreaming', type: 'hook' },
  { id: 'usetokenbudgetmonitor', label: 'useTokenBudgetMonitor', type: 'hook' },
  { id: 'usechat', label: 'useChat', type: 'hook' },
  { id: 'usememorystore', label: 'useMemoryStore', type: 'hook' },
  // Adapters
  { id: 'openai-adapter', label: 'OpenAI Adapter', type: 'adapter' },
  { id: 'anthropic-adapter', label: 'Anthropic Adapter', type: 'adapter' },
  { id: 'google-adapter', label: 'Google Adapter', type: 'adapter' },
]

const typeConfig = {
  component: {
    icon: Layers,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Component',
  },
  hook: {
    icon: Code2,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Hook',
  },
  adapter: {
    icon: Plug,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: 'Adapter',
  },
}

export interface MentionPopupProps {
  items?: MentionItem[]
  filter: string
  onSelect: (item: MentionItem) => void
  onClose?: () => void
  visible?: boolean
  className?: string
}

export function MentionPopup({
  items,
  filter,
  onSelect,
  onClose: _onClose,
  visible = true,
  className,
}: MentionPopupProps) {
  const sourceItems = items ?? MENTION_ITEMS
  const filteredItems = useMemo(() => {
    if (!filter) return sourceItems
    const lowerFilter = filter.toLowerCase()
    return sourceItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerFilter) ||
        item.type.toLowerCase().includes(lowerFilter)
    )
  }, [filter, sourceItems])

  if (!visible || filteredItems.length === 0) return null

  // Group by type
  const grouped = filteredItems.reduce<Record<string, MentionItem[]>>(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item)
      return acc
    },
    {}
  )

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
          <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Mention a component, hook, or adapter
          </span>
        </div>
      </div>

      <ScrollArea className="max-h-60">
        <div className="p-1.5">
          {Object.entries(grouped).map(([type, items]) => {
            const config = typeConfig[type as keyof typeof typeConfig]
            const TypeIcon = config.icon

            return (
              <div key={type}>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <TypeIcon className={cn('h-3 w-3', config.color)} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {config.label}s
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    ({items.length})
                  </span>
                </div>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg hover:bg-muted/70 transition-colors text-left"
                  >
                    <div
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        config.color.replace('text-', 'bg-')
                      )}
                    />
                    <span className="text-sm font-mono">@{item.label}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] px-1.5 py-0 ml-auto',
                        config.color
                      )}
                    >
                      {config.label}
                    </Badge>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="px-3 py-1.5 border-t bg-muted/20">
        <p className="text-[10px] text-muted-foreground">
          Type{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">
            @
          </kbd>{' '}
          followed by a name to mention
        </p>
      </div>
    </div>
  )
}

export { MENTION_ITEMS }
