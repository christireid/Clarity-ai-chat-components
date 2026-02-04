'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Command, Search, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'

// Types
export interface Hotkey {
  id: string
  keys: string[]
  label: string
  description?: string
  category?: string
  action: () => void
  disabled?: boolean
}

export interface HotkeyCategory {
  name: string
  hotkeys: Hotkey[]
}

// Key display component
interface KeyProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Key({ children, size = 'md', className }: KeyProps) {
  const sizeClasses = {
    sm: 'h-5 min-w-5 px-1 text-xs',
    md: 'h-6 min-w-6 px-1.5 text-xs',
    lg: 'h-7 min-w-7 px-2 text-sm',
  }

  // Format special keys
  const formatKey = (key: string): React.ReactNode => {
    const keyMap: Record<string, React.ReactNode> = {
      cmd: <Command className="h-3 w-3" />,
      command: <Command className="h-3 w-3" />,
      meta: <Command className="h-3 w-3" />,
      ctrl: 'Ctrl',
      control: 'Ctrl',
      alt: 'Alt',
      option: 'Alt',
      shift: 'Shift',
      enter: 'Enter',
      return: 'Enter',
      escape: 'Esc',
      esc: 'Esc',
      space: 'Space',
      tab: 'Tab',
      backspace: 'Backspace',
      delete: 'Del',
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
    }

    const normalized = key.toLowerCase()
    return keyMap[normalized] || key.toUpperCase()
  }

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border bg-muted font-mono font-medium',
        sizeClasses[size],
        className
      )}
    >
      {typeof children === 'string' ? formatKey(children) : children}
    </kbd>
  )
}

// Keyboard shortcut display
interface KeyboardShortcutProps {
  keys: string[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function KeyboardShortcut({
  keys,
  size = 'md',
  className,
}: KeyboardShortcutProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <Key size={size}>{key}</Key>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
        </React.Fragment>
      ))}
    </span>
  )
}

// Hotkey hook
export function useHotkey(
  keys: string[],
  callback: () => void,
  options: { enabled?: boolean; preventDefault?: boolean } = {}
) {
  const { enabled = true, preventDefault = true } = options

  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = new Set<string>()

      if (event.metaKey || event.ctrlKey) pressedKeys.add('cmd')
      if (event.altKey) pressedKeys.add('alt')
      if (event.shiftKey) pressedKeys.add('shift')

      // Add the main key
      const key = event.key.toLowerCase()
      if (
        key !== 'meta' &&
        key !== 'control' &&
        key !== 'alt' &&
        key !== 'shift'
      ) {
        pressedKeys.add(key)
      }

      // Normalize and compare
      const normalizedTarget = keys.map((k) => {
        const lower = k.toLowerCase()
        if (lower === 'ctrl' || lower === 'command' || lower === 'meta')
          return 'cmd'
        if (lower === 'option') return 'alt'
        return lower
      })

      const matches =
        normalizedTarget.length === pressedKeys.size &&
        normalizedTarget.every((k) => pressedKeys.has(k))

      if (matches) {
        if (preventDefault) event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keys, callback, enabled, preventDefault])
}

// Multiple hotkeys hook
export function useHotkeys(
  hotkeys: Hotkey[],
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options

  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = new Set<string>()

      if (event.metaKey || event.ctrlKey) pressedKeys.add('cmd')
      if (event.altKey) pressedKeys.add('alt')
      if (event.shiftKey) pressedKeys.add('shift')

      const key = event.key.toLowerCase()
      if (
        key !== 'meta' &&
        key !== 'control' &&
        key !== 'alt' &&
        key !== 'shift'
      ) {
        pressedKeys.add(key)
      }

      for (const hotkey of hotkeys) {
        if (hotkey.disabled) continue

        const normalizedTarget = hotkey.keys.map((k) => {
          const lower = k.toLowerCase()
          if (lower === 'ctrl' || lower === 'command' || lower === 'meta')
            return 'cmd'
          if (lower === 'option') return 'alt'
          return lower
        })

        const matches =
          normalizedTarget.length === pressedKeys.size &&
          normalizedTarget.every((k) => pressedKeys.has(k))

        if (matches) {
          event.preventDefault()
          hotkey.action()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hotkeys, enabled])
}

// Hotkey help dialog
interface HotkeyHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: HotkeyCategory[]
}

export function HotkeyHelpDialog({
  open,
  onOpenChange,
  categories,
}: HotkeyHelpDialogProps) {
  const [search, setSearch] = React.useState('')

  const filteredCategories = React.useMemo(() => {
    if (!search) return categories
    const lower = search.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        hotkeys: cat.hotkeys.filter(
          (h) =>
            h.label.toLowerCase().includes(lower) ||
            h.description?.toLowerCase().includes(lower) ||
            h.keys.some((k) => k.toLowerCase().includes(lower))
        ),
      }))
      .filter((cat) => cat.hotkeys.length > 0)
  }, [categories, search])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shortcuts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <ScrollArea className="h-80 -mx-6 px-6">
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No shortcuts found
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    {category.name}
                  </h4>
                  <div className="space-y-2">
                    {category.hotkeys.map((hotkey) => (
                      <div
                        key={hotkey.id}
                        className={cn(
                          'flex items-center justify-between gap-4 p-2 rounded-md',
                          hotkey.disabled && 'opacity-50'
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium">{hotkey.label}</p>
                          {hotkey.description && (
                            <p className="text-xs text-muted-foreground">
                              {hotkey.description}
                            </p>
                          )}
                        </div>
                        <KeyboardShortcut keys={hotkey.keys} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Press <KeyboardShortcut keys={['cmd', '/']} size="sm" /> to open this
          dialog
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Inline shortcut hint
interface ShortcutHintProps {
  keys: string[]
  label?: string
  className?: string
}

export function ShortcutHint({ keys, label, className }: ShortcutHintProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs text-muted-foreground',
        className
      )}
    >
      {label && <span>{label}</span>}
      <KeyboardShortcut keys={keys} size="sm" />
    </span>
  )
}
