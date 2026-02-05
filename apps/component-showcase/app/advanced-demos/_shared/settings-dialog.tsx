'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Settings,
  X,
  Zap,
  Brain,
  Coins,
  Shield,
  Palette,
  Database,
  Globe,
  Code,
  Download,
} from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
  temperature: number
  onTemperatureChange: (t: number) => void
  maxTokens: number
  onMaxTokensChange: (t: number) => void
  codeTheme: string
  onCodeThemeChange: (theme: string) => void
  responseLength: string
  onResponseLengthChange: (length: string) => void
  children?: React.ReactNode
}

export function SettingsDialog({
  open,
  onClose,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  codeTheme,
  onCodeThemeChange,
  responseLength,
  onResponseLengthChange,
  children,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState('general')

  if (!open) return null

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'model', label: 'Model', icon: Zap },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'tokens', label: 'Tokens', icon: Coins },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] rounded-2xl border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-[60vh]">
          {/* Tab Nav */}
          <div className="w-44 border-r p-2 space-y-0.5 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-1">Response Length</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Control the default response length
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['concise', 'balanced', 'detailed'].map((len) => (
                      <button
                        key={len}
                        onClick={() => onResponseLengthChange(len)}
                        className={cn(
                          'py-2 px-3 rounded-lg text-sm capitalize transition-colors',
                          responseLength === len
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Code Theme</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Syntax highlighting theme for code blocks
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['monokai', 'github-dark', 'one-dark', 'catppuccin'].map(
                      (theme) => (
                        <button
                          key={theme}
                          onClick={() => onCodeThemeChange(theme)}
                          className={cn(
                            'py-2 px-3 rounded-lg text-sm transition-colors capitalize',
                            codeTheme === theme
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          )}
                        >
                          {theme}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'model' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-1">Temperature</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Controls creativity. 0 = deterministic, 2 = very creative
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={temperature * 100}
                      onChange={(e) =>
                        onTemperatureChange(Number(e.target.value) / 100)
                      }
                      className="flex-1 accent-primary h-1.5"
                    />
                    <span className="text-sm font-mono w-10 text-right">
                      {temperature.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Precise</span>
                    <span>Balanced</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Max Output Tokens</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Maximum tokens in the model response
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={256}
                      max={8192}
                      step={256}
                      value={maxTokens}
                      onChange={(e) =>
                        onMaxTokensChange(Number(e.target.value))
                      }
                      className="flex-1 accent-primary h-1.5"
                    />
                    <span className="text-sm font-mono w-14 text-right">
                      {maxTokens.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Memory settings can be configured in the right panel of each
                  chat.
                </p>
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <h4 className="text-sm font-medium">
                    About Memory Strategies
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      <strong className="text-foreground">
                        Sliding Window:
                      </strong>{' '}
                      Keeps recent messages. Best for short conversations.
                    </p>
                    <p>
                      <strong className="text-foreground">
                        Semantic Chunks:
                      </strong>{' '}
                      Groups and retrieves similar content. Good for
                      topic-focused chats.
                    </p>
                    <p>
                      <strong className="text-foreground">Vector Store:</strong>{' '}
                      Full embedding-based search. Best for long, complex
                      sessions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Token optimization settings can be configured in the right
                  panel of each chat.
                </p>
                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <h4 className="text-sm font-medium">
                    Optimization Techniques
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Compression:</strong>{' '}
                      Reduces context size by removing redundant information.
                    </p>
                    <p>
                      <strong className="text-foreground">
                        Summarization:
                      </strong>{' '}
                      Replaces old messages with concise summaries.
                    </p>
                    <p>
                      <strong className="text-foreground">Pruning:</strong>{' '}
                      Removes low-importance context when approaching budget
                      limits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-4">
                {children || (
                  <p className="text-sm text-muted-foreground">
                    No additional settings available.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
