'use client'

import { useState } from 'react'
import { MODEL_PROVIDERS, type ModelProvider, type ModelOption } from './types'
import {
  Button,
  Badge,
  Input,
  cn,
} from '@clarity-chat/primitives'
import {
  Key,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Zap,
  Shield,
} from 'lucide-react'

interface ApiKeyBarProps {
  provider: string
  onProviderChange: (provider: string) => void
  model: string
  onModelChange: (model: string) => void
  apiKey: string
  onApiKeyChange: (key: string) => void
  className?: string
}

export function ApiKeyBar({
  provider,
  onProviderChange,
  model,
  onModelChange,
  apiKey,
  onApiKeyChange,
  className,
}: ApiKeyBarProps) {
  const [showKey, setShowKey] = useState(false)
  const [providerOpen, setProviderOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)

  const currentProvider = MODEL_PROVIDERS.find(p => p.id === provider) || MODEL_PROVIDERS[0]
  const currentModel = currentProvider.models.find(m => m.id === model) || currentProvider.models[0]

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-2.5 border-b bg-card/50 backdrop-blur-sm',
      className
    )}>
      {/* Provider Selector */}
      <div className="relative">
        <button
          onClick={() => { setProviderOpen(!providerOpen); setModelOpen(false) }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
        >
          <div className={cn(
            'w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center text-white',
            provider === 'openai' && 'bg-green-600',
            provider === 'anthropic' && 'bg-orange-600',
            provider === 'google' && 'bg-blue-600',
          )}>
            {currentProvider.icon}
          </div>
          {currentProvider.name}
          <ChevronDown className={cn('h-3 w-3 transition-transform', providerOpen && 'rotate-180')} />
        </button>
        {providerOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-xl border bg-card shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {MODEL_PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  onProviderChange(p.id)
                  onModelChange(p.models[0].id)
                  setProviderOpen(false)
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors',
                  p.id === provider && 'bg-muted'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center text-white',
                  p.id === 'openai' && 'bg-green-600',
                  p.id === 'anthropic' && 'bg-orange-600',
                  p.id === 'google' && 'bg-blue-600',
                )}>
                  {p.icon}
                </div>
                {p.name}
                {p.id === provider && <Check className="h-3 w-3 ml-auto" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Model Selector */}
      <div className="relative">
        <button
          onClick={() => { setModelOpen(!modelOpen); setProviderOpen(false) }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
        >
          <Zap className="h-3 w-3 text-yellow-500" />
          {currentModel.name}
          <ChevronDown className={cn('h-3 w-3 transition-transform', modelOpen && 'rotate-180')} />
        </button>
        {modelOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border bg-card shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {currentProvider.models.map(m => (
              <button
                key={m.id}
                onClick={() => { onModelChange(m.id); setModelOpen(false) }}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-muted transition-colors',
                  m.id === model && 'bg-muted'
                )}
              >
                <div className="flex-1 text-left">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.description} &middot; {(m.contextWindow / 1000).toFixed(0)}K ctx</div>
                </div>
                {m.id === model && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* API Key Input */}
      <div className="flex-1 flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => onApiKeyChange(e.target.value)}
            placeholder={`${currentProvider.name} API Key`}
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Adapter Badge */}
      <Badge variant="outline" className="gap-1.5 text-xs shrink-0">
        <Shield className="h-3 w-3" />
        Adapter: {currentProvider.name}
      </Badge>
    </div>
  )
}
