'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Sparkles,
  Send,
  History,
  Command,
  FileText,
  ChevronRight,
  Plus,
  Star,
  Clock,
  Zap,
  Settings,
  Copy,
  Check,
  RefreshCw,
  X,
} from 'lucide-react'

// =============================================================================
// AI PROMPT PANEL - Telerik-inspired but superior
// Features: Prompt input, commands, output view, history, suggestions
// =============================================================================

interface AIPromptCommand {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  action?: () => void
}

interface AIPromptHistoryItem {
  id: string
  prompt: string
  output?: string
  timestamp: Date
  starred?: boolean
}

interface AIPromptPanelProps {
  onSubmit?: (prompt: string, command?: string) => void
  onClear?: () => void
  commands?: AIPromptCommand[]
  history?: AIPromptHistoryItem[]
  suggestions?: string[]
  output?: string
  isLoading?: boolean
  placeholder?: string
  defaultView?: 'prompt' | 'commands' | 'output' | 'history'
  showViews?: ('prompt' | 'commands' | 'output' | 'history')[]
  className?: string
}

export function AIPromptPanel({
  onSubmit,
  onClear,
  commands = [],
  history = [],
  suggestions = [],
  output,
  isLoading = false,
  placeholder = 'Ask AI to help you...',
  defaultView = 'prompt',
  showViews = ['prompt', 'commands', 'output', 'history'],
  className,
}: AIPromptPanelProps) {
  const [prompt, setPrompt] = React.useState('')
  const [activeView, setActiveView] = React.useState(defaultView)
  const [selectedCommand, setSelectedCommand] = React.useState<string | null>(
    null
  )
  const [copied, setCopied] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return
    onSubmit?.(prompt, selectedCommand || undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCopyOutput = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleHistorySelect = (item: AIPromptHistoryItem) => {
    setPrompt(item.prompt)
    setActiveView('prompt')
    textareaRef.current?.focus()
  }

  const viewIcons = {
    prompt: <Sparkles className="h-4 w-4" />,
    commands: <Command className="h-4 w-4" />,
    output: <FileText className="h-4 w-4" />,
    history: <History className="h-4 w-4" />,
  }

  const viewLabels = {
    prompt: 'Prompt',
    commands: 'Commands',
    output: 'Output',
    history: 'History',
  }

  return (
    <div
      className={cn(
        'flex flex-col border border-border rounded-xl bg-card overflow-hidden',
        className
      )}
    >
      {/* Header Tabs */}
      <Tabs
        value={activeView}
        onValueChange={(v) => setActiveView(v as typeof activeView)}
      >
        <div className="border-b border-border bg-muted/30">
          <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0 gap-0">
            {showViews.map((view) => (
              <TabsTrigger
                key={view}
                value={view}
                className="relative h-12 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <span className="flex items-center gap-2">
                  {viewIcons[view]}
                  <span className="hidden sm:inline">{viewLabels[view]}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Prompt View */}
        <TabsContent value="prompt" className="m-0">
          <div className="p-4 space-y-4">
            {/* Suggestions */}
            {suggestions.length > 0 && !prompt && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(suggestion)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-background hover:bg-muted transition-colors"
                    >
                      <Zap className="h-3 w-3 text-primary" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Command Badge */}
            {selectedCommand && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  <Command className="h-3 w-3" />
                  {commands.find((c) => c.id === selectedCommand)?.label}
                  <button
                    onClick={() => setSelectedCommand(null)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}

            {/* Prompt Input */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="min-h-[120px] resize-none pr-12 text-base"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
                </span>
                <Button
                  size="icon"
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isLoading}
                  className="h-8 w-8 rounded-full"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Commands */}
            {commands.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Quick:</span>
                {commands.slice(0, 4).map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      setSelectedCommand(cmd.id)
                      cmd.action?.()
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border transition-colors',
                      selectedCommand === cmd.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {cmd.icon || <Command className="h-3 w-3" />}
                    {cmd.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Commands View */}
        <TabsContent value="commands" className="m-0">
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {commands.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Command className="h-10 w-10 mb-3 opacity-50" />
                  <p className="text-sm">No commands available</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {commands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        setSelectedCommand(cmd.id)
                        setActiveView('prompt')
                        cmd.action?.()
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                        selectedCommand === cmd.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                        {cmd.icon || <Command className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{cmd.label}</p>
                        {cmd.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {cmd.description}
                          </p>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <span className="flex-shrink-0 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {cmd.shortcut}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Output View */}
        <TabsContent value="output" className="m-0">
          <div className="relative">
            <ScrollArea className="h-[300px]">
              <div className="p-4">
                {output ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                      {output}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <FileText className="h-10 w-10 mb-3 opacity-50" />
                    <p className="text-sm">No output yet</p>
                    <p className="text-xs">Submit a prompt to see results</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            {output && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopyOutput}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                {onClear && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* History View */}
        <TabsContent value="history" className="m-0">
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <History className="h-10 w-10 mb-3 opacity-50" />
                  <p className="text-sm">No history yet</p>
                  <p className="text-xs">Your prompts will appear here</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistorySelect(item)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg text-left hover:bg-muted transition-colors group"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {item.starred ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{item.prompt}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.timestamp.toLocaleDateString()} at{' '}
                          {item.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =============================================================================
// AI PROMPT FLOATING - Floating variant
// =============================================================================

interface AIPromptFloatingProps {
  onSubmit?: (prompt: string) => void
  suggestions?: string[]
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function AIPromptFloating({
  onSubmit,
  suggestions = [],
  isLoading = false,
  placeholder = 'Ask AI anything...',
  className,
}: AIPromptFloatingProps) {
  const [prompt, setPrompt] = React.useState('')
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return
    onSubmit?.(prompt)
    setPrompt('')
    setIsExpanded(false)
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 transition-all',
        className
      )}
    >
      <div
        className={cn(
          'bg-card border border-border rounded-2xl shadow-2xl transition-all',
          isExpanded ? 'p-4' : 'p-2'
        )}
      >
        {/* Suggestions */}
        {isExpanded && suggestions.length > 0 && !prompt && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.slice(0, 3).map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="h-10 w-10 rounded-full flex-shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// AI PROMPT MINIMAL - Inline minimal variant
// =============================================================================

interface AIPromptMinimalProps {
  onSubmit?: (prompt: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function AIPromptMinimal({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask AI...',
  className,
}: AIPromptMinimalProps) {
  const [prompt, setPrompt] = React.useState('')

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return
    onSubmit?.(prompt)
    setPrompt('')
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-1 pl-3 rounded-full border border-border bg-background',
        className
      )}
    >
      <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 outline-none text-sm min-w-0"
        disabled={isLoading}
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
        className="h-8 rounded-full px-4"
      >
        {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Ask'}
      </Button>
    </div>
  )
}

// =============================================================================
// PROMPT OUTPUT CARD - Display AI output
// =============================================================================

interface PromptOutputCardProps {
  prompt: string
  output: string
  timestamp?: Date
  onCopy?: () => void
  onRegenerate?: () => void
  onEdit?: () => void
  isLoading?: boolean
  className?: string
}

export function PromptOutputCard({
  prompt,
  output,
  timestamp,
  onCopy,
  onRegenerate,
  onEdit,
  isLoading = false,
  className,
}: PromptOutputCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div
      className={cn(
        'border border-border rounded-xl overflow-hidden bg-card',
        className
      )}
    >
      {/* Prompt Header */}
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{prompt}</p>
            {timestamp && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {timestamp.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating...</span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{output}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isLoading && (
        <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1.5" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={onRegenerate}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Regenerate
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={onEdit}
            >
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
