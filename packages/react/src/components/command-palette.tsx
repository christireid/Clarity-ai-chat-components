'use client'

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  cn,
} from '@clarity-chat/primitives'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  shortcut?: string[]
  category?: string
  onSelect: () => void
}

export interface CommandPaletteProps {
  items: CommandItem[]
  open: boolean
  onClose: () => void
  placeholder?: string
  className?: string
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ items, open, onClose, placeholder = 'Type a command…', className }, ref) => {
    const [search, setSearch] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const filteredItems = useMemo(() => {
      if (!search) return items
      const query = search.toLowerCase().trim()
      return items.filter((item) => {
        const haystack = [
          item.label,
          item.description ?? '',
          item.category ?? '',
          ...(item.shortcut ?? []),
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(query)
      })
    }, [items, search])

    const groupedItems = useMemo(() => {
      return filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
        const key = item.category || 'Commands'
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item)
        return acc
      }, {})
    }, [filteredItems])

    useEffect(() => {
      if (open) {
        setSearch('')
        queueMicrotask(() => inputRef.current?.focus())
      }
    }, [open])

    const handleSelect = (item: CommandItem) => {
      item.onSelect()
      onClose()
    }

    const handleOpenChange = (nextOpen: boolean) => {
      if (!nextOpen) {
        onClose()
      }
    }

    return (
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div ref={ref} className={cn('flex max-h-[60vh] flex-col', className)}>
          <CommandInput
            ref={inputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            aria-label="Search commands"
          />
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>
              <div className="py-10 text-center text-sm text-muted-foreground">
                No commands found. Try a different query.
              </div>
            </CommandEmpty>
            {Object.keys(groupedItems).map((group, index) => (
              <div key={group}>
                {index > 0 ? <CommandSeparator className="mx-2" /> : null}
                <CommandGroup heading={group}>
                  {groupedItems[group].map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.description ?? ''}`}
                      onSelect={() => handleSelect(item)}
                    >
                      {item.icon ? (
                        <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
                          {item.icon}
                        </span>
                      ) : null}
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate font-medium">{item.label}</div>
                        {item.description ? (
                          <p className="truncate text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      {item.shortcut ? (
                        <div className="flex gap-1">
                          {item.shortcut.map((key, shortcutIndex) => (
                            <kbd
                              key={`${item.id}-shortcut-${shortcutIndex}`}
                              className="rounded border border-border px-2 py-1 text-xs font-mono text-muted-foreground"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
          <div className="flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            <div className="flex gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-border/60 px-2 py-1 font-mono text-[11px]">
                  ↑↓
                </kbd>
                <span className="hidden sm:inline">Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-border/60 px-2 py-1 font-mono text-[11px]">
                  ↵
                </kbd>
                <span className="hidden sm:inline">Select</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-border/60 px-2 py-1 font-mono text-[11px]">
                  Esc
                </kbd>
                <span className="hidden sm:inline">Close</span>
              </span>
            </div>
            <span className="font-medium">
              {filteredItems.length} {filteredItems.length === 1 ? 'command' : 'commands'}
            </span>
          </div>
        </div>
      </CommandDialog>
    )
  }
)

CommandPalette.displayName = 'CommandPalette'
