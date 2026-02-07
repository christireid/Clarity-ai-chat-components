'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import {
  useKeyboardShortcuts,
  useReducedMotion,
  useCharacterCounter,
} from '@clarity-chat/react'

export function KeyboardShortcutsDemo() {
  const [lastKey, setLastKey] = useState<string | null>(null)
  const [actionLog, setActionLog] = useState<string[]>([])

  const addAction = useCallback((action: string) => {
    setActionLog((prev) => [...prev.slice(-4), action])
  }, [])

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => {
        setLastKey('Mod+K')
        addAction('Search opened')
      },
      description: 'Open search',
    },
    {
      key: 'mod+b',
      callback: () => {
        setLastKey('Mod+B')
        addAction('Sidebar toggled')
      },
      description: 'Toggle sidebar',
    },
    {
      key: 'mod+shift+p',
      callback: () => {
        setLastKey('Mod+Shift+P')
        addAction('Command palette opened')
      },
      description: 'Command palette',
    },
  ])

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-lg">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          Registered shortcuts
        </p>
        <div className="space-y-2">
          {[
            { keys: 'Mod+K', action: 'Open search' },
            { keys: 'Mod+B', action: 'Toggle sidebar' },
            { keys: 'Mod+Shift+P', action: 'Command palette' },
          ].map(({ keys, action }) => (
            <div key={keys} className="flex items-center justify-between">
              <span className="text-sm">{action}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel p-4 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2">Last key pressed:</p>
        <p className="text-lg font-mono font-bold">
          {lastKey || (
            <span className="text-muted-foreground">Press a shortcut...</span>
          )}
        </p>
      </div>
      {actionLog.length > 0 && (
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Action log:</p>
          <div className="space-y-1">
            {actionLog.map((action, i) => (
              <p key={i} className="text-xs font-mono text-muted-foreground">
                {action}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ReducedMotionDemo() {
  const prefersReducedMotion = useReducedMotion()
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">System preference</p>
          <p className="text-xs text-muted-foreground">
            prefers-reduced-motion
          </p>
        </div>
        <Badge variant={prefersReducedMotion ? 'destructive' : 'default'}>
          {prefersReducedMotion ? 'Reduce' : 'No preference'}
        </Badge>
      </div>

      <div className="glass-panel p-4 rounded-lg">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          Animation demo
        </p>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'h-12 w-12 rounded-lg bg-primary',
              !prefersReducedMotion && isAnimating && 'animate-bounce',
              prefersReducedMotion && isAnimating && 'opacity-50'
            )}
          />
          <div className="flex-1">
            <p className="text-sm">
              {prefersReducedMotion
                ? 'Animation replaced with opacity change'
                : isAnimating
                  ? 'Bouncing animation active'
                  : 'Click to start animation'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? 'Stop' : 'Animate'}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Toggle reduced motion in your OS accessibility settings to see the hook
        respond in real time.
      </p>
    </div>
  )
}

export function MediaQueryDemo() {
  const [matches, setMatches] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const queries: Record<string, string> = {
      'Mobile (< 640px)': '(max-width: 639px)',
      'Tablet (640-1023px)': '(min-width: 640px) and (max-width: 1023px)',
      'Desktop (>= 1024px)': '(min-width: 1024px)',
      'Wide (>= 1280px)': '(min-width: 1280px)',
      'Dark mode': '(prefers-color-scheme: dark)',
      'Reduced motion': '(prefers-reduced-motion: reduce)',
      'High contrast': '(prefers-contrast: more)',
      Portrait: '(orientation: portrait)',
    }

    const updateMatches = () => {
      const results: Record<string, boolean> = {}
      for (const [label, query] of Object.entries(queries)) {
        results[label] = window.matchMedia(query).matches
      }
      setMatches(results)
    }

    updateMatches()

    const mediaQueryLists = Object.values(queries).map((q) =>
      window.matchMedia(q)
    )
    const handler = () => updateMatches()
    mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler))
    return () => {
      mediaQueryLists.forEach((mql) =>
        mql.removeEventListener('change', handler)
      )
    }
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Reactive media query matching. Updates in real-time when viewport or
        system preferences change.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(matches).map(([label, isMatch]) => (
          <div
            key={label}
            className={cn(
              'glass-panel p-3 rounded-lg flex items-center justify-between',
              isMatch && 'ring-1 ring-primary/50'
            )}
          >
            <span className="text-xs font-medium">{label}</span>
            <Badge
              variant={isMatch ? 'default' : 'secondary'}
              className="text-[10px]"
            >
              {isMatch ? 'Match' : 'No match'}
            </Badge>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Resize the browser window or change system settings to see live updates.
      </p>
    </div>
  )
}

export function CharacterCounterDemo() {
  const [text, setText] = useState('')
  const maxChars = 280

  const {
    charCount,
    isOverLimit,
    isNearLimit,
    counterColor,
    progressColor,
    progressPercentage,
  } = useCharacterCounter({
    value: text,
    maxLength: maxChars,
    warningThreshold: 0.9,
  })

  const remaining = maxChars - charCount

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Character counter with configurable limits, warnings, and percentage
        tracking — powered by{' '}
        <code className="text-primary">useCharacterCounter</code>.
      </p>
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars + 20))}
          placeholder="Type your message (max 280 characters)..."
          className="w-full h-24 glass-panel rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <span
          className={cn(
            'absolute bottom-3 right-3 text-xs font-mono',
            counterColor
          )}
        >
          {remaining}
        </span>
      </div>
      <div className="glass-panel p-3 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Character usage</span>
          <span className="text-xs font-mono">
            {charCount} / {maxChars}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-200',
              progressColor
            )}
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">maxLength: {maxChars}</Badge>
        <Badge variant="secondary">
          words: {text.split(/\s+/).filter(Boolean).length}
        </Badge>
        <Badge
          variant={
            isOverLimit ? 'destructive' : isNearLimit ? 'default' : 'secondary'
          }
        >
          {isOverLimit ? 'Over limit!' : `${remaining} remaining`}
        </Badge>
      </div>
    </div>
  )
}
