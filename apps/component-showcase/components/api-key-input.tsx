'use client'

import { useState, useEffect } from 'react'
import { Button, Badge, cn } from '@clarity-chat/primitives'
import { useLocalStorage } from '@clarity-chat/react'
import { Key, Check, AlertCircle, Eye, EyeOff } from 'lucide-react'

const MODELS = [
  { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
  { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
  { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku' },
]

interface ApiKeyInputProps {
  onKeyChange?: (key: string) => void
  onModelChange?: (model: string) => void
  className?: string
  compact?: boolean
}

export function ApiKeyInput({
  onKeyChange,
  onModelChange,
  className,
  compact,
}: ApiKeyInputProps) {
  const [storedApiKey, setStoredApiKey] = useLocalStorage(
    'clarity-showcase-api-key',
    ''
  )
  const [storedModel, setStoredModel] = useLocalStorage(
    'clarity-showcase-model',
    'claude-sonnet-4-5-20250929'
  )
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('claude-sonnet-4-5-20250929')
  const [showKey, setShowKey] = useState(false)
  const [status, setStatus] = useState<'empty' | 'saved' | 'invalid'>('empty')

  useEffect(() => {
    if (storedApiKey) {
      setApiKey(storedApiKey)
      setStatus('saved')
      onKeyChange?.(storedApiKey)
    }
    if (storedModel) {
      setModel(storedModel)
      onModelChange?.(storedModel)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    const trimmed = apiKey.trim()
    if (!trimmed) {
      setStatus('empty')
      return
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setStatus('invalid')
      return
    }
    setStoredApiKey(trimmed)
    setStatus('saved')
    onKeyChange?.(trimmed)
  }

  const handleModelChange = (value: string) => {
    setModel(value)
    setStoredModel(value)
    onModelChange?.(value)
  }

  const maskedKey = apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : ''

  if (compact && status === 'saved') {
    return (
      <div className={cn('flex items-center gap-2 flex-wrap', className)}>
        <Badge variant="outline" className="font-mono text-xs gap-1">
          <Key className="h-3 w-3" />
          {maskedKey}
        </Badge>
        <select
          value={model}
          onChange={(e) => handleModelChange(e.target.value)}
          className="text-xs bg-muted/30 border border-border/50 rounded-md px-2 py-1"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs"
          onClick={() => setStatus('empty')}
        >
          Change
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('glass-panel p-4 rounded-xl', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Key className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Anthropic API Key</span>
        {status === 'saved' && (
          <Badge variant="default" className="text-[10px] h-4 gap-0.5">
            <Check className="h-2.5 w-2.5" /> Connected
          </Badge>
        )}
        {status === 'invalid' && (
          <Badge variant="destructive" className="text-[10px] h-4 gap-0.5">
            <AlertCircle className="h-2.5 w-2.5" /> Invalid format
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Enter your Anthropic API key to enable live AI responses. Your key is
        stored locally in your browser and sent only to Anthropic via our server
        proxy.
      </p>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value)
              setStatus('empty')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="sk-ant-api03-..."
            className="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button onClick={handleSave} size="sm">
          Save
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">Model:</label>
        <select
          value={model}
          onChange={(e) => handleModelChange(e.target.value)}
          className="text-xs bg-muted/30 border border-border/50 rounded-md px-2 py-1.5 flex-1"
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
