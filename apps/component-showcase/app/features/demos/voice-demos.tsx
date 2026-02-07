'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import {
  ChevronRight,
  Copy,
  RefreshCw,
  Share,
  Bookmark,
  Trash2,
  Play,
  Loader2,
  Settings,
  FileText,
  Globe,
  CheckCircle,
  Check,
} from 'lucide-react'

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================
export function CalendarDemo() {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const dates = Array.from({ length: 35 }, (_, i) => i - 3)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">January 2024</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day) => (
            <div key={day} className="text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {dates.map((date, i) => (
            <button
              key={i}
              className={cn(
                'h-8 w-8 rounded-full text-sm',
                date <= 0 || date > 31
                  ? 'text-muted-foreground/50'
                  : 'hover:bg-muted',
                date === 15 && 'bg-primary text-primary-foreground'
              )}
            >
              {date <= 0 ? 31 + date : date > 31 ? date - 31 : date}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE ACTIONS
// ============================================================================
export function MessageActionsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Message Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm mb-3">
            This is an AI response that can have various actions.
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Share className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// VOICE COMPONENTS
// ============================================================================
export function VoiceComponentsDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Voice Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-2xl">🎤</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Listening...</p>
            <div className="flex gap-1 mt-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 24}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Audio Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Button size="icon" className="h-10 w-10 rounded-full">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: '35%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1:24</span>
                <span>4:02</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// QUEUE DISPLAY
// ============================================================================
export function QueueDisplayDemo() {
  const queueItems = [
    { position: 1, task: 'Generate report', status: 'processing' },
    { position: 2, task: 'Analyze data', status: 'waiting' },
    { position: 3, task: 'Send notifications', status: 'waiting' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Task Queue</CardTitle>
        <CardDescription>3 tasks in queue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {queueItems.map((item) => (
            <div
              key={item.position}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {item.position}
              </div>
              <span className="flex-1 text-sm">{item.task}</span>
              {item.status === 'processing' ? (
                <Badge className="bg-blue-500/20 text-blue-600 gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processing
                </Badge>
              ) : (
                <Badge variant="secondary">Waiting</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PRESETS SELECTOR
// ============================================================================
export function PresetsSelectorDemo() {
  const presets = [
    { name: 'Creative Writing', temperature: 0.9, maxTokens: 2000 },
    { name: 'Code Generation', temperature: 0.2, maxTokens: 4000 },
    { name: 'Balanced', temperature: 0.7, maxTokens: 1000 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Model Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {presets.map((preset, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                i === 2 && 'border-primary bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2',
                  i === 2
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{preset.name}</p>
                <p className="text-xs text-muted-foreground">
                  Temp: {preset.temperature} · Max: {preset.maxTokens}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RAG SOURCES
// ============================================================================
export function RAGSourcesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Retrieved Sources (RAG)</CardTitle>
        <CardDescription>
          Documents used to generate this response
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { title: 'Company Policy Document', relevance: 0.95, chunks: 3 },
            { title: 'Product Documentation', relevance: 0.87, chunks: 2 },
            { title: 'FAQ Database', relevance: 0.72, chunks: 1 },
          ].map((source, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{source.title}</p>
                <p className="text-xs text-muted-foreground">
                  {source.chunks} chunks retrieved
                </p>
              </div>
              <Badge variant="outline">
                {Math.round(source.relevance * 100)}% match
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RICH EMBED
// ============================================================================
export function RichEmbedDemo() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <Play className="h-16 w-16 text-white opacity-80" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">youtube.com</p>
            <h3 className="font-medium">Introduction to AI Chat Components</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Learn how to build powerful AI chat interfaces with Clarity
              Chat...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// READ RECEIPT
// ============================================================================
export function ReadReceiptDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Read Receipts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-[70%]">
              <p className="text-sm">Here is the report you requested.</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:24 AM</span>
                <CheckCircle className="h-3 w-3 text-blue-300" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-[70%]">
              <p className="text-sm">Let me know if you have questions.</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">10:25 AM</span>
                <Check className="h-3 w-3 opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
