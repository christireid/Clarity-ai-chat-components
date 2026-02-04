'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'
import {
  ChevronDown,
  Check,
  Sparkles,
  Zap,
  Brain,
  Eye,
  Code,
  Wrench,
  MessageSquare,
  Settings,
  Info,
} from 'lucide-react'
import type { Model, ModelCapability } from './types/ai-types'

interface ModelSelectorProps {
  models?: Model[]
  selectedModel?: Model | null
  onSelect?: (model: Model) => void
  compact?: boolean
  showCapabilities?: boolean
  className?: string
}

const defaultModels: Model[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable model for complex tasks with vision support',
    contextWindow: 128000,
    maxOutput: 16384,
    capabilities: ['text', 'vision', 'code', 'function-calling', 'streaming'],
    pricing: { input: 2.5, output: 10 },
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast and cost-effective for simpler tasks',
    contextWindow: 128000,
    maxOutput: 16384,
    capabilities: ['text', 'vision', 'code', 'function-calling', 'streaming'],
    pricing: { input: 0.15, output: 0.6 },
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    description: 'Balanced performance with extended thinking',
    contextWindow: 200000,
    maxOutput: 64000,
    capabilities: [
      'text',
      'vision',
      'code',
      'function-calling',
      'streaming',
      'reasoning',
    ],
    pricing: { input: 3, output: 15 },
  },
  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    description: 'Most capable Claude model for complex reasoning',
    contextWindow: 200000,
    maxOutput: 32000,
    capabilities: [
      'text',
      'vision',
      'code',
      'function-calling',
      'streaming',
      'reasoning',
    ],
    pricing: { input: 15, output: 75 },
  },
  {
    id: 'grok-3',
    name: 'Grok 3',
    provider: 'xAI',
    description: 'Real-time knowledge and fast responses',
    contextWindow: 131072,
    maxOutput: 32000,
    capabilities: ['text', 'code', 'function-calling', 'streaming'],
    pricing: { input: 5, output: 15 },
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Multimodal with strong reasoning',
    contextWindow: 1000000,
    maxOutput: 8192,
    capabilities: ['text', 'vision', 'code', 'function-calling', 'streaming'],
    pricing: { input: 1.25, output: 5 },
  },
]

const capabilityIcons: Record<ModelCapability, React.ReactNode> = {
  text: <MessageSquare className="h-3 w-3" />,
  vision: <Eye className="h-3 w-3" />,
  code: <Code className="h-3 w-3" />,
  'function-calling': <Wrench className="h-3 w-3" />,
  streaming: <Zap className="h-3 w-3" />,
  reasoning: <Brain className="h-3 w-3" />,
}

const capabilityLabels: Record<ModelCapability, string> = {
  text: 'Text',
  vision: 'Vision',
  code: 'Code',
  'function-calling': 'Tools',
  streaming: 'Streaming',
  reasoning: 'Reasoning',
}

const providerColors: Record<string, string> = {
  OpenAI: 'bg-emerald-500/10 text-emerald-500',
  Anthropic: 'bg-orange-500/10 text-orange-500',
  xAI: 'bg-blue-500/10 text-blue-500',
  Google: 'bg-red-500/10 text-red-500',
  Meta: 'bg-indigo-500/10 text-indigo-500',
}

export function ModelSelector({
  models = defaultModels,
  selectedModel,
  onSelect,
  compact = false,
  showCapabilities = true,
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [detailsModel, setDetailsModel] = React.useState<Model | null>(null)

  const selected = selectedModel || models[0]

  const handleSelect = (model: Model) => {
    onSelect?.(model)
    setOpen(false)
  }

  if (compact) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-7 gap-1.5 text-xs', className)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {selected.name}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Select Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => handleSelect(model)}
              className="gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  {model.id === selected.id && (
                    <Check className="h-4 w-4 text-ai-user" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {model.provider}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn('justify-between min-w-[200px]', className)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ai-user" />
              <span>{selected.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80">
          <DropdownMenuLabel>Select Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[300px]">
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleSelect(model)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] px-1.5',
                        providerColors[model.provider]
                      )}
                    >
                      {model.provider}
                    </Badge>
                    {model.id === selected.id && (
                      <Check className="h-4 w-4 text-ai-user ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {model.description}
                  </p>
                  {showCapabilities && (
                    <div className="flex items-center gap-1 mt-2">
                      {model.capabilities.slice(0, 4).map((cap) => (
                        <Badge
                          key={cap}
                          variant="secondary"
                          className="text-[10px] px-1.5 gap-1"
                        >
                          {capabilityIcons[cap]}
                          {capabilityLabels[cap]}
                        </Badge>
                      ))}
                      {model.capabilities.length > 4 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5"
                        >
                          +{model.capabilities.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDetailsModel(model)
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Model Details Dialog */}
      <Dialog
        open={!!detailsModel}
        onOpenChange={(open) => !open && setDetailsModel(null)}
      >
        <DialogContent>
          {detailsModel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {detailsModel.name}
                  <Badge
                    variant="outline"
                    className={cn(providerColors[detailsModel.provider])}
                  >
                    {detailsModel.provider}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {detailsModel.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Context Window
                    </p>
                    <p className="font-medium">
                      {formatNumber(detailsModel.contextWindow)} tokens
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Max Output</p>
                    <p className="font-medium">
                      {formatNumber(detailsModel.maxOutput)} tokens
                    </p>
                  </div>
                  {detailsModel.pricing && (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Input Price
                        </p>
                        <p className="font-medium">
                          ${detailsModel.pricing.input} / 1M tokens
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Output Price
                        </p>
                        <p className="font-medium">
                          ${detailsModel.pricing.output} / 1M tokens
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {detailsModel.capabilities.map((cap) => (
                      <Badge key={cap} variant="secondary" className="gap-1.5">
                        {capabilityIcons[cap]}
                        {capabilityLabels[cap]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    handleSelect(detailsModel)
                    setDetailsModel(null)
                  }}
                >
                  Select {detailsModel.name}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toString()
}

// Model comparison component
export function ModelComparison({
  models = defaultModels,
}: {
  models?: Model[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium">Model</th>
            <th className="text-left py-3 px-4 font-medium">Provider</th>
            <th className="text-right py-3 px-4 font-medium">Context</th>
            <th className="text-right py-3 px-4 font-medium">Output</th>
            <th className="text-right py-3 px-4 font-medium">Price (In/Out)</th>
            <th className="text-left py-3 px-4 font-medium">Capabilities</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr
              key={model.id}
              className="border-b border-border hover:bg-secondary/50"
            >
              <td className="py-3 px-4 font-medium">{model.name}</td>
              <td className="py-3 px-4">
                <Badge
                  variant="outline"
                  className={cn(providerColors[model.provider])}
                >
                  {model.provider}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right text-muted-foreground">
                {formatNumber(model.contextWindow)}
              </td>
              <td className="py-3 px-4 text-right text-muted-foreground">
                {formatNumber(model.maxOutput)}
              </td>
              <td className="py-3 px-4 text-right text-muted-foreground">
                {model.pricing
                  ? `$${model.pricing.input}/$${model.pricing.output}`
                  : '-'}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {model.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-muted-foreground"
                      title={capabilityLabels[cap]}
                    >
                      {capabilityIcons[cap]}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
