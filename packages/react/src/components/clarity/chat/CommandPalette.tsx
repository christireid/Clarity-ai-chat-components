'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Command } from 'lucide-react'
import type { KeyboardShortcut, SlashCommand } from './types'

interface CommandPaletteProps {
  commands?: SlashCommand[]
  shortcuts?: KeyboardShortcut[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function CommandPalette({
  commands = [],
  shortcuts = [],
  open = false,
  onOpenChange,
  className,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(open)
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sync with external open state
  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  // Global keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const newOpen = !isOpen
        setIsOpen(newOpen)
        onOpenChange?.(newOpen)
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onOpenChange])

  // Execute registered shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const matches =
          e.key === shortcut.key &&
          (!shortcut.ctrlKey || e.ctrlKey) &&
          (!shortcut.metaKey || e.metaKey) &&
          (!shortcut.shiftKey || e.shiftKey) &&
          (!shortcut.altKey || e.altKey)

        if (matches) {
          e.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Filter commands and shortcuts
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands
    const lowerQuery = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description.toLowerCase().includes(lowerQuery) ||
        cmd.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))
    )
  }, [commands, query])

  const filteredShortcuts = React.useMemo(() => {
    if (!query) return shortcuts
    const lowerQuery = query.toLowerCase()
    return shortcuts.filter(
      (sc) =>
        sc.description.toLowerCase().includes(lowerQuery) ||
        sc.key.toLowerCase().includes(lowerQuery)
    )
  }, [shortcuts, query])

  const allItems = [...filteredCommands, ...filteredShortcuts]

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(allItems.length - 1, prev + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = allItems[selectedIndex]
      if (item) {
        if ('action' in item) {
          item.action()
        }
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }
  }

  // Group commands by group
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, SlashCommand[]> = {}
    filteredCommands.forEach((cmd) => {
      const group = cmd.group || 'Commands'
      if (!groups[group]) groups[group] = []
      groups[group].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Format keyboard shortcut
  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys = []
    if (shortcut.metaKey) keys.push('⌘')
    if (shortcut.ctrlKey) keys.push('Ctrl')
    if (shortcut.shiftKey) keys.push('⇧')
    if (shortcut.altKey) keys.push('⌥')
    keys.push(shortcut.key.toUpperCase())
    return keys.join('+')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with forced blur */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)', // For Safari support
        }}
        onClick={() => {
          setIsOpen(false)
          onOpenChange?.(false)
        }}
        aria-hidden="true"
      />

      {/* Command Palette */}
      <div
        className={cn(
          'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50',
          'bg-popover text-popover-foreground rounded-xl shadow-2xl border',
          'animate-in fade-in slide-in-from-top-4 duration-300',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Command
            className="w-5 h-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Command search"
            aria-controls="command-list"
            aria-activedescendant={`command-item-${selectedIndex}`}
          />
          <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          id="command-list"
          className="max-h-96 overflow-y-auto scrollbar-none"
          role="listbox"
        >
          {allItems.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No commands found
            </div>
          )}

          {/* Commands */}
          {Object.entries(groupedCommands).map(([group, cmds]) => (
            <div key={group} className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                {group}
              </div>
              {cmds.map((cmd, index) => {
                const globalIndex = filteredCommands.indexOf(cmd)
                return (
                  <button
                    key={cmd.id}
                    id={`command-item-${globalIndex}`}
                    onClick={() => {
                      cmd.action()
                      setIsOpen(false)
                      onOpenChange?.(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                      globalIndex === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted/50'
                    )}
                    role="option"
                    aria-selected={globalIndex === selectedIndex}
                  >
                    {cmd.icon && <span className="shrink-0">{cmd.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{cmd.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {cmd.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}

          {/* Keyboard Shortcuts */}
          {filteredShortcuts.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                Keyboard Shortcuts
              </div>
              {filteredShortcuts.map((shortcut, index) => {
                const globalIndex = filteredCommands.length + index
                return (
                  <div
                    key={`${shortcut.key}-${shortcut.group}`}
                    id={`command-item-${globalIndex}`}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg',
                      globalIndex === selectedIndex &&
                        'bg-accent text-accent-foreground'
                    )}
                    role="option"
                    aria-selected={globalIndex === selectedIndex}
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground font-mono">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↓</kbd>
              <span className="ml-1">to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
              <span className="ml-1">to select</span>
            </span>
          </div>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </>
  )
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const matches =
          e.key === shortcut.key &&
          (!shortcut.ctrlKey || e.ctrlKey) &&
          (!shortcut.metaKey || e.metaKey) &&
          (!shortcut.shiftKey || e.shiftKey) &&
          (!shortcut.altKey || e.altKey)

        if (matches) {
          e.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
