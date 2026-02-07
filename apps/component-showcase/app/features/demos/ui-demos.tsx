'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Separator,
  Kbd,
  cn,
} from '@clarity-chat/primitives'
import {
  Plus,
  Code,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  Keyboard,
} from 'lucide-react'

// ============================================================================
// SNIPPET MANAGER
// ============================================================================
export function SnippetManagerDemo() {
  const snippets = [
    { name: 'React useEffect', language: 'typescript', category: 'Hooks' },
    { name: 'API Fetch Pattern', language: 'typescript', category: 'Async' },
    { name: 'Error Boundary', language: 'tsx', category: 'Components' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Snippet Manager</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Snippet
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {snippets.map((snippet, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
            >
              <Code className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{snippet.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {snippet.language}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {snippet.category}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Use
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SCHEMA DISPLAY
// ============================================================================
export function SchemaDisplayDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Schema Display</CardTitle>
        <CardDescription>API or data schema visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-sm bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">interface</span>
            <span className="text-blue-500">Message</span>
            <span>{'{'}</span>
          </div>
          <div className="pl-4 space-y-1">
            <div>
              <span className="text-muted-foreground">id:</span>{' '}
              <span className="text-green-500">string</span>
            </div>
            <div>
              <span className="text-muted-foreground">role:</span>{' '}
              <span className="text-orange-500">"user" | "assistant"</span>
            </div>
            <div>
              <span className="text-muted-foreground">content:</span>{' '}
              <span className="text-green-500">string</span>
            </div>
            <div>
              <span className="text-muted-foreground">timestamp:</span>{' '}
              <span className="text-green-500">Date</span>
            </div>
            <div>
              <span className="text-muted-foreground">metadata?:</span>{' '}
              <span className="text-blue-500">
                Record{'<'}string, any{'>'}
              </span>
            </div>
          </div>
          <div>{'}'}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STATS DISPLAY
// ============================================================================
export function StatsDisplayDemo() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[
        {
          label: 'Total Messages',
          value: '12,847',
          change: '+12%',
          positive: true,
        },
        {
          label: 'Avg Response Time',
          value: '1.2s',
          change: '-8%',
          positive: true,
        },
        {
          label: 'Active Users',
          value: '3,421',
          change: '+24%',
          positive: true,
        },
        {
          label: 'Error Rate',
          value: '0.3%',
          change: '+0.1%',
          positive: false,
        },
      ].map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p
              className={cn(
                'text-xs mt-1',
                stat.positive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// BEFORE/AFTER COMPARISON
// ============================================================================
export function BeforeAfterDemo() {
  const [position, setPosition] = useState(50)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Before/After Slider</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
            <span className="text-sm font-medium">Before (Original)</span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <span className="text-sm font-medium">After (Optimized)</span>
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <ArrowLeft className="h-3 w-3 text-primary-foreground" />
              <ArrowRight className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {position}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// LINK PREVIEW
// ============================================================================
export function LinkPreviewDemo() {
  const links = [
    {
      url: 'https://github.com/clarity-chat/react',
      title: 'Clarity Chat React Components',
      description:
        'Production-ready AI chat components for React with streaming, memory, and more.',
      image: null,
      favicon: '🔗',
    },
    {
      url: 'https://docs.anthropic.com',
      title: 'Anthropic Documentation',
      description: 'Official documentation for Claude API and best practices.',
      image: null,
      favicon: '📚',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Link Previews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
              {link.favicon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{link.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {link.description}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-primary truncate">
                  {link.url}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONTEXT MENU
// ============================================================================
export function ContextMenuDemo() {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
    setShowMenu(true)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Context Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative h-40 bg-muted rounded-lg flex items-center justify-center cursor-context-menu"
          onContextMenu={handleContextMenu}
          onClick={() => setShowMenu(false)}
        >
          <p className="text-sm text-muted-foreground">Right-click anywhere</p>
          {showMenu && (
            <div
              className="absolute z-10 bg-popover border rounded-lg shadow-lg py-1 min-w-[160px]"
              style={{ left: menuPosition.x, top: menuPosition.y }}
            >
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                <Edit className="h-4 w-4" /> Edit
              </button>
              <Separator className="my-1" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MODEL SELECTOR
// ============================================================================
export function ModelSelectorDemo() {
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet')
  const models = [
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      speed: 'Fast',
      quality: '95%',
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      speed: 'Medium',
      quality: '99%',
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      speed: 'Fast',
      quality: '94%',
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      speed: 'Very Fast',
      quality: '85%',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Model Selector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={cn(
              'w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
              selectedModel === model.id
                ? 'border-primary bg-primary/5'
                : 'hover:bg-muted'
            )}
          >
            <div>
              <p className="font-medium text-sm">{model.name}</p>
              <p className="text-xs text-muted-foreground">{model.provider}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">
                {model.speed}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {model.quality} quality
              </p>
            </div>
            {selectedModel === model.id && (
              <Check className="h-4 w-4 text-primary ml-2" />
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================
export function KeyboardShortcutsDemo() {
  const shortcuts = [
    { shortcut: 'mod+k', action: 'Open Command Palette' },
    { shortcut: 'mod+enter', action: 'Send Message' },
    { shortcut: 'mod+shift+c', action: 'Copy Code' },
    { shortcut: 'escape', action: 'Close Dialog' },
    { shortcut: 'mod+/', action: 'Toggle Sidebar' },
    { shortcut: 'mod+b', action: 'Bold Text' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-muted"
            >
              <span className="text-sm">{item.action}</span>
              <Kbd shortcut={item.shortcut} size="sm" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SUGGESTION CHIPS
// ============================================================================
export function SuggestionChipsDemo() {
  const suggestions = [
    'How does this work?',
    'Show me an example',
    'What are the alternatives?',
    'Explain in simple terms',
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Suggestion Chips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {s}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
