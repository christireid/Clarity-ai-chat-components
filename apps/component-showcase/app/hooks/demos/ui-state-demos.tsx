'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Badge } from '@clarity-chat/primitives'
import {
  useClipboard,
  useLocalStorage,
  useDebounce,
  useThrottle,
  useToggle,
} from '@clarity-chat/react'
import {
  Clipboard,
  Check,
  Plus,
  Minus,
  Trash2,
  Search,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useRef } from 'react'
import { cn } from '@clarity-chat/primitives'

export function ClipboardDemo() {
  const [text, setText] = useState('Hello from Clarity Chat!')
  const { copy, copied, value } = useClipboard({ timeout: 2000 })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
          placeholder="Type text to copy..."
          className="flex-1"
        />
        <Button
          onClick={() => copy(text).catch(() => {})}
          variant={copied ? 'default' : 'outline'}
          className="min-w-[100px]"
        >
          {copied ? (
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Clipboard className="h-4 w-4" />
              Copy
            </span>
          )}
        </Button>
      </div>
      {value && (
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">
            Last copied value:
          </p>
          <p className="text-sm font-mono break-all">{value}</p>
        </div>
      )}
      <div className="flex gap-2">
        <Badge variant="outline">timeout: 2000ms</Badge>
        <Badge variant={copied ? 'default' : 'secondary'}>
          copied: {copied ? 'true' : 'false'}
        </Badge>
      </div>
    </div>
  )
}

export function LocalStorageDemo() {
  const [count, setCount, removeCount] = useLocalStorage(
    'hooks-demo-counter',
    0
  )

  return (
    <div className="space-y-4">
      <div className="glass-panel p-6 rounded-lg text-center">
        <p className="text-4xl font-bold gradient-text mb-2">{count}</p>
        <p className="text-sm text-muted-foreground">
          Persisted in localStorage
        </p>
      </div>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCount((c: number) => c - 1)}
        >
          <Minus className="h-4 w-4 mr-1" />
          Decrement
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCount((c: number) => c + 1)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Increment
        </Button>
        <Button variant="outline" size="sm" onClick={removeCount}>
          <Trash2 className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Refresh the page -- the counter value will persist.
      </p>
      <div className="flex gap-2 justify-center">
        <Badge variant="outline">key: hooks-demo-counter</Badge>
        <Badge variant="secondary">value: {count}</Badge>
      </div>
    </div>
  )
}

export function DebounceDemo() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [searchCount, setSearchCount] = useState(0)

  useEffect(() => {
    if (debouncedSearch) {
      setSearchCount((c) => c + 1)
    }
  }, [debouncedSearch])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          placeholder="Type to search (debounced at 500ms)..."
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Raw value:</p>
          <p className="text-sm font-mono truncate">
            {search || <span className="text-muted-foreground">--</span>}
          </p>
        </div>
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Debounced value:</p>
          <p className="text-sm font-mono truncate">
            {debouncedSearch || (
              <span className="text-muted-foreground">--</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline">delay: 500ms</Badge>
        <Badge variant="secondary">
          API calls saved: {Math.max(0, search.length - searchCount)}
        </Badge>
      </div>
    </div>
  )
}

export function ToggleDemo() {
  const featureFlag = useToggle(false)
  const darkMode = useToggle(false)
  const autoSave = useToggle(true)

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Simple boolean toggle with on/off/toggle functions. Replaces verbose{' '}
        <code className="text-primary">useState + setter</code> patterns.
      </p>
      <div className="space-y-3">
        {[
          { label: 'Feature Flag', hook: featureFlag },
          { label: 'Dark Mode', hook: darkMode },
          { label: 'Auto-save', hook: autoSave },
        ].map(({ label, hook }) => (
          <div
            key={label}
            className="glass-panel p-3 rounded-lg flex items-center justify-between"
          >
            <span className="text-sm font-medium">{label}</span>
            <button
              onClick={hook.toggle}
              className={cn(
                'transition-colors',
                hook.value ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {hook.value ? (
                <ToggleRight className="h-8 w-8" />
              ) : (
                <ToggleLeft className="h-8 w-8" />
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant={featureFlag.value ? 'default' : 'secondary'}>
          feature: {featureFlag.value ? 'on' : 'off'}
        </Badge>
        <Badge variant={darkMode.value ? 'default' : 'secondary'}>
          dark: {darkMode.value ? 'on' : 'off'}
        </Badge>
        <Badge variant={autoSave.value ? 'default' : 'secondary'}>
          autoSave: {autoSave.value ? 'on' : 'off'}
        </Badge>
      </div>
    </div>
  )
}

export function ThrottleDemo() {
  const [mouseX, setMouseX] = useState(0)
  const [moveCount, setMoveCount] = useState(0)
  const throttledX = useThrottle(mouseX, 200)
  const [throttledCount, setThrottledCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setThrottledCount((c) => c + 1)
  }, [throttledX])

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMouseX(Math.round(e.clientX - rect.left))
          setMoveCount((c) => c + 1)
        }}
        className="glass-panel p-6 rounded-lg h-32 flex items-center justify-center cursor-crosshair relative overflow-hidden"
      >
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary/50 transition-none"
          style={{
            left: `${Math.min(100, (throttledX / (containerRef.current?.offsetWidth || 400)) * 100)}%`,
          }}
        />
        <p className="text-sm text-muted-foreground pointer-events-none">
          Move your mouse here (throttled at 200ms)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Raw events:</p>
          <p className="text-lg font-mono font-bold">{moveCount}</p>
        </div>
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">
            Throttled updates:
          </p>
          <p className="text-lg font-mono font-bold">{throttledCount}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline">interval: 200ms</Badge>
        <Badge variant="secondary">
          Events reduced: {Math.max(0, moveCount - throttledCount)}
        </Badge>
      </div>
    </div>
  )
}
