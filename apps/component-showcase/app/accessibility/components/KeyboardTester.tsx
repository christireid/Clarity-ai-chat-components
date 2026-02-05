'use client'

import { useState, useEffect } from 'react'
import { Keyboard, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface KeyboardShortcut {
  key: string
  description: string
  tested: boolean
  working: boolean
}

export function KeyboardTester() {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([
    { key: 'Tab', description: 'Navigate forward', tested: false, working: false },
    { key: 'Shift + Tab', description: 'Navigate backward', tested: false, working: false },
    { key: 'Enter', description: 'Activate button/link', tested: false, working: false },
    { key: 'Space', description: 'Activate button', tested: false, working: false },
    { key: 'Escape', description: 'Close dialog/menu', tested: false, working: false },
    { key: 'Arrow Keys', description: 'Navigate lists/menus', tested: false, working: false },
    { key: 'Home', description: 'Go to first item', tested: false, working: false },
    { key: 'End', description: 'Go to last item', tested: false, working: false },
  ])

  const [lastKey, setLastKey] = useState<string>('')
  const [testMode, setTestMode] = useState(false)
  const [focusOrder, setFocusOrder] = useState<string[]>([])

  useEffect(() => {
    if (!testMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      const modifiers = []
      if (e.shiftKey) modifiers.push('Shift')
      if (e.ctrlKey) modifiers.push('Ctrl')
      if (e.altKey) modifiers.push('Alt')
      if (e.metaKey) modifiers.push('Meta')

      const keyCombo = modifiers.length > 0 ? `${modifiers.join(' + ')} + ${key}` : key
      setLastKey(keyCombo)

      // Mark shortcut as tested
      setShortcuts((prev) =>
        prev.map((shortcut) => {
          if (shortcut.key.toLowerCase() === keyCombo.toLowerCase()) {
            return { ...shortcut, tested: true, working: true }
          }
          return shortcut
        })
      )
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [testMode])

  const testedCount = shortcuts.filter((s) => s.tested).length
  const workingCount = shortcuts.filter((s) => s.working).length

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setTestMode(!testMode)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2',
            testMode ? 'gradient-accent text-white' : 'glass hover:bg-primary/5'
          )}
        >
          <Keyboard className="h-4 w-4" />
          {testMode ? 'Stop Testing' : 'Start Testing'}
        </button>

        <button
          onClick={() =>
            setShortcuts((prev) =>
              prev.map((s) => ({ ...s, tested: false, working: false }))
            )
          }
          className="px-4 py-2 rounded-lg glass text-sm font-medium"
        >
          Reset Tests
        </button>
      </div>

      {testMode && (
        <div className="glass-panel p-4 border-l-4 border-blue-500">
          <p className="text-sm">
            <strong>Test Mode Active:</strong> Press any keyboard key to test shortcuts.
          </p>
          {lastKey && (
            <p className="text-sm mt-2">
              Last key pressed:{' '}
              <code className="badge-glass font-mono">{lastKey}</code>
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold">{shortcuts.length}</p>
          <p className="text-sm text-muted-foreground">Total Shortcuts</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold text-blue-500">{testedCount}</p>
          <p className="text-sm text-muted-foreground">Tested</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-2xl font-bold text-green-500">{workingCount}</p>
          <p className="text-sm text-muted-foreground">Working</p>
        </div>
      </div>

      {/* Shortcuts List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Keyboard Shortcuts</h3>
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className={cn(
              'glass-panel p-4 flex items-center justify-between',
              shortcut.tested && 'border-l-4 border-green-500'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'icon-container-sm',
                  shortcut.tested
                    ? shortcut.working
                      ? 'text-green-500'
                      : 'text-red-500'
                    : 'text-muted-foreground'
                )}
              >
                {shortcut.tested ? (
                  shortcut.working ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )
                ) : (
                  <Keyboard className="h-4 w-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded bg-background/50 border border-border font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                  {shortcut.tested && (
                    <span className="badge-glass text-xs text-green-500">Tested</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {shortcut.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Focus Order Testing */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Focus Order Testing</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tab through interactive elements to verify logical focus order
        </p>

        <div className="space-y-2 mb-4">
          <button className="w-full px-4 py-2 rounded-lg glass text-sm font-medium text-left">
            1. First Interactive Element
          </button>
          <button className="w-full px-4 py-2 rounded-lg glass text-sm font-medium text-left">
            2. Second Interactive Element
          </button>
          <button className="w-full px-4 py-2 rounded-lg glass text-sm font-medium text-left">
            3. Third Interactive Element
          </button>
          <button className="w-full px-4 py-2 rounded-lg glass text-sm font-medium text-left">
            4. Fourth Interactive Element
          </button>
        </div>

        <div className="glass-panel p-4 bg-background/30">
          <p className="text-sm font-semibold mb-2">Best Practices:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Focus order should follow reading order (left-to-right, top-to-bottom)</li>
            <li>• All interactive elements should be keyboard accessible</li>
            <li>• Skip links should be provided for long navigation</li>
            <li>• Focus should not be trapped unless in a modal</li>
          </ul>
        </div>
      </div>

      {/* Custom Shortcuts */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Custom Keyboard Shortcuts</h3>
        <div className="space-y-3">
          {[
            { key: 'Ctrl + K', description: 'Open command palette', type: 'Application' },
            { key: 'Ctrl + /', description: 'Toggle help menu', type: 'Application' },
            { key: 'Ctrl + Enter', description: 'Send message', type: 'Chat' },
            { key: 'Ctrl + N', description: 'New conversation', type: 'Chat' },
          ].map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between glass-panel p-3 bg-background/30"
            >
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded bg-background/50 border border-border font-mono text-xs">
                  {shortcut.key}
                </kbd>
                <span className="text-sm">{shortcut.description}</span>
              </div>
              <span className="badge-glass text-xs">{shortcut.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
