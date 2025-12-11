'use client'

/**
 * Theming Demo Component
 *
 * Showcases Clarity Chat theming capabilities:
 * - Preset theme selection
 * - Live preview
 * - CSS variable export
 * - Light/dark mode support
 */

import { useState, useEffect } from 'react'
import {
  THEMES,
  applyTheme,
  generateCSSVariables,
  type Theme,
} from '@/lib/themes'

// ============================================================================
// Theme Card Component
// ============================================================================

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: Theme
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${
          isSelected
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-primary/50'
        }
      `}
    >
      {/* Theme preview colors */}
      <div className="flex gap-1 mb-3">
        <div
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
          title="Primary"
        />
        <div
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: `hsl(${theme.colors.background})` }}
          title="Background"
        />
        <div
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: `hsl(${theme.colors.userBubble})` }}
          title="User bubble"
        />
        <div
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: `hsl(${theme.colors.assistantBubble})` }}
          title="Assistant bubble"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{theme.name}</h3>
          <p className="text-xs text-muted-foreground">{theme.description}</p>
        </div>
        <span
          className={`
            text-xs px-2 py-0.5 rounded-full
            ${
              theme.mode === 'dark'
                ? 'bg-gray-800 text-gray-200'
                : 'bg-gray-100 text-gray-800'
            }
          `}
        >
          {theme.mode}
        </span>
      </div>
    </button>
  )
}

// ============================================================================
// Chat Preview Component
// ============================================================================

function ChatPreview() {
  const sampleMessages = [
    {
      id: '1',
      role: 'user' as const,
      content: 'Hello! Can you help me with a React question?',
    },
    {
      id: '2',
      role: 'assistant' as const,
      content:
        "Of course! I'd be happy to help you with React. What would you like to know?",
    },
    {
      id: '3',
      role: 'user' as const,
      content: "What's the best way to manage state in a large application?",
    },
    {
      id: '4',
      role: 'assistant' as const,
      content:
        'Great question! For large React applications, you have several options:\n\n1. **React Context** - Built-in, good for simpler cases\n2. **Redux/Zustand** - External stores with predictable state\n3. **React Query/SWR** - For server state management\n\nThe best choice depends on your specific needs.',
    },
  ]

  return (
    <div className="h-full flex flex-col bg-background rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-card">
        <h3 className="font-semibold">Chat Preview</h3>
        <p className="text-xs text-muted-foreground">
          See how your theme looks in action
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {sampleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                  : 'bg-muted text-foreground rounded-2xl rounded-bl-md'
              }`}
              style={{
                borderRadius: `var(--radius)`,
              }}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            readOnly
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CSS Export Modal
// ============================================================================

function CSSExportModal({
  theme,
  onClose,
}: {
  theme: Theme
  onClose: () => void
}) {
  const css = generateCSSVariables(theme)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-2xl rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Export Theme CSS</h3>
            <p className="text-sm text-muted-foreground">
              Copy these CSS variables to your project
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{css}</code>
          </pre>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-muted"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function ThemingDemo() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0])
  const [showExport, setShowExport] = useState(false)
  const [filter, setFilter] = useState<'all' | 'light' | 'dark'>('all')

  // Apply theme on change
  useEffect(() => {
    applyTheme(selectedTheme)
    // Save to localStorage
    localStorage.setItem('clarity-theme', selectedTheme.id)
  }, [selectedTheme])

  // Load saved theme on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('clarity-theme')
    if (savedThemeId) {
      const saved = THEMES.find((t) => t.id === savedThemeId)
      if (saved) setSelectedTheme(saved)
    }
  }, [])

  const filteredThemes = THEMES.filter((t) =>
    filter === 'all' ? true : t.mode === filter
  )

  return (
    <div className="h-screen flex">
      {/* Theme selector sidebar */}
      <aside className="w-96 border-r p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Theme Studio</h1>
          <p className="text-muted-foreground mt-1">
            Explore preset themes for Clarity Chat
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'light', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`
                px-3 py-1.5 text-sm rounded-lg capitalize transition-colors
                ${
                  filter === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }
              `}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Theme list */}
        <div className="space-y-3">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={selectedTheme.id === theme.id}
              onSelect={() => setSelectedTheme(theme)}
            />
          ))}
        </div>

        {/* Export button */}
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => setShowExport(true)}
            className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
          >
            Export CSS Variables
          </button>
        </div>
      </aside>

      {/* Preview area */}
      <div className="flex-1 p-6">
        <div className="h-full max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <p className="text-sm text-muted-foreground">
                Current theme: {selectedTheme.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Border radius:
              </span>
              <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                {selectedTheme.radius}
              </code>
            </div>
          </div>

          <div className="h-[calc(100%-4rem)]">
            <ChatPreview />
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <CSSExportModal
          theme={selectedTheme}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}

export default ThemingDemo
