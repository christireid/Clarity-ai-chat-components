'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import {
  Activity,
  Database,
  Zap,
  Minimize2,
  Settings,
  Sliders,
  Layers,
} from 'lucide-react'
import { ScrollArea } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import { Message } from '../chat/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'

export interface SDKConfig {
  systemPrompt: string
  temperature: number
  model: string
  provider: 'mock' | 'openai' | 'anthropic' | 'litellm' // Added provider
}

interface DevToolsProps {
  optimizerStats?: any
  streamLogs?: string[]
  ragContext?: any[]
  config?: SDKConfig
  onConfigChange?: (config: SDKConfig) => void
  contextWindow?: Message[]
}

export function SDKDevTools({
  optimizerStats,
  streamLogs = [],
  ragContext = [],
  config = {
    systemPrompt: 'You are a helpful assistant.',
    temperature: 0.7,
    model: 'gpt-4o',
    provider: 'mock',
  },
  onConfigChange,
  contextWindow = [],
}: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tokens')
  const [localConfig, setLocalConfig] = useState<SDKConfig>(config)

  useEffect(() => {
    setLocalConfig(config)
  }, [config])

  const handleConfigChange = (key: keyof SDKConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value }
    setLocalConfig(newConfig)
    onConfigChange?.(newConfig)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg gap-2 bg-background"
        onClick={() => setIsOpen(true)}
      >
        <Activity className="w-4 h-4" />
        SDK DevTools
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[400px] h-[600px] shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 border-2 border-primary/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Activity className="w-4 h-4" />
          SDK Inspector
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-3 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="tokens" className="flex-1 text-xs">
              Tokens
            </TabsTrigger>
            <TabsTrigger value="context" className="flex-1 text-xs">
              Context
            </TabsTrigger>
            <TabsTrigger value="stream" className="flex-1 text-xs">
              Stream
            </TabsTrigger>
            <TabsTrigger value="config" className="flex-1 text-xs">
              Config
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden p-3">
          {/* TOKENS TAB */}
          <TabsContent value="tokens" className="h-full m-0 space-y-4">
            {optimizerStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-xs text-muted-foreground">
                      Original
                    </div>
                    <div className="text-xl font-bold">
                      {optimizerStats.original}
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground">
                      Optimized
                    </div>
                    <div className="text-xl font-bold text-emerald-600">
                      {optimizerStats.optimized}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm p-2 border rounded-md">
                  <span>Savings</span>
                  <Badge variant="secondary">
                    {optimizerStats.savedPercentage?.toFixed(1)}%
                  </Badge>
                </div>

                {ragContext.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-2">
                      <Database className="w-3 h-3" /> RAG Context (
                      {ragContext.length})
                    </div>
                    <ScrollArea className="h-[200px] rounded-md border p-2 bg-muted/30">
                      <div className="space-y-2">
                        {ragContext.map((doc, i) => (
                          <div
                            key={i}
                            className="p-2 bg-background border rounded text-xs space-y-1"
                          >
                            <div className="font-semibold flex justify-between">
                              <span>{doc.id}</span>
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4"
                              >
                                Doc
                              </Badge>
                            </div>
                            <div className="text-muted-foreground line-clamp-2">
                              {doc.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                No optimization data
              </div>
            )}
          </TabsContent>

          {/* CONTEXT TAB */}
          <TabsContent value="context" className="h-full m-0">
            <div className="mb-2 text-xs text-muted-foreground flex items-center gap-2">
              <Layers className="w-3 h-3" /> Active Context Window (
              {contextWindow.length} msgs)
            </div>
            <ScrollArea className="h-full rounded-md border p-2 bg-muted/30">
              <div className="space-y-2">
                {contextWindow.length > 0 ? (
                  contextWindow.map((msg, i) => (
                    <div
                      key={msg.id}
                      className="p-2 bg-background border rounded text-xs space-y-1 relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      <div className="font-semibold flex justify-between pl-2">
                        <span className="capitalize">{msg.role}</span>
                        <span className="text-[10px] text-muted-foreground">
                          Token Est: {Math.ceil(msg.content.length / 4)}
                        </span>
                      </div>
                      <div className="pl-2 text-muted-foreground line-clamp-2">
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground pt-8">
                    No context window data
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* STREAM TAB */}
          <TabsContent value="stream" className="h-full m-0">
            <ScrollArea className="h-full rounded-md border p-2 bg-muted/30">
              <div className="space-y-1 font-mono text-xs">
                {streamLogs.length > 0 ? (
                  streamLogs.map((log, i) => (
                    <div
                      key={i}
                      className="break-all border-b border-border/50 pb-1 mb-1 last:border-0"
                    >
                      <span className="text-muted-foreground opacity-50">
                        [{i}]
                      </span>{' '}
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground pt-8">
                    No stream logs
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* CONFIG TAB */}
          <TabsContent value="config" className="h-full m-0 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Provider (Adapter)</Label>
                <Select
                  value={localConfig.provider}
                  onValueChange={(val) => handleConfigChange('provider', val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mock">Mock Provider</SelectItem>
                    <SelectItem value="openai">OpenAI (Real)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Real)</SelectItem>
                    <SelectItem value="litellm">LiteLLM (Universal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  System Prompt (Supports {'{{variable}}'})
                </Label>
                <Textarea
                  value={localConfig.systemPrompt}
                  onChange={(e) =>
                    handleConfigChange('systemPrompt', e.target.value)
                  }
                  className="text-xs font-mono min-h-[100px]"
                  placeholder="Enter system prompt..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Temperature</Label>
                  <span className="text-xs font-mono">
                    {localConfig.temperature}
                  </span>
                </div>
                <Slider
                  value={[localConfig.temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([val]) =>
                    handleConfigChange('temperature', val)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Model ID</Label>
                <Input
                  value={localConfig.model}
                  onChange={(e) => handleConfigChange('model', e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}
