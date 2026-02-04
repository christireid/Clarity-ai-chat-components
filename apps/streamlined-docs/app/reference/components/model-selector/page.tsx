'use client'

/**
 * ModelSelector Component - API Reference Documentation
 *
 * A dropdown component for selecting AI models with visual indicators
 * for speed, cost, and quality metrics.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Zap,
  DollarSign,
  Star,
  Accessibility,
  Code2,
  Play,
  Wrench,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  Layers,
  Settings,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  // Sample models with different providers and metrics
  const sampleModels = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai' as const,
      speed: 'fast' as const,
      cost: 'medium' as const,
      quality: 'best' as const,
      contextWindow: 128000,
      description: 'Most capable OpenAI model, optimized for speed',
      vision: true,
      toolCalling: true,
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai' as const,
      speed: 'fast' as const,
      cost: 'low' as const,
      quality: 'good' as const,
      contextWindow: 16000,
      description: 'Fast and efficient for most tasks',
      toolCalling: true,
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'anthropic' as const,
      speed: 'medium' as const,
      cost: 'high' as const,
      quality: 'best' as const,
      contextWindow: 200000,
      description: 'Most powerful Claude model',
      vision: true,
      toolCalling: true,
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic' as const,
      speed: 'fast' as const,
      cost: 'medium' as const,
      quality: 'excellent' as const,
      contextWindow: 200000,
      description: 'Balanced performance and intelligence',
      vision: true,
      toolCalling: true,
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'anthropic' as const,
      speed: 'fast' as const,
      cost: 'low' as const,
      quality: 'good' as const,
      contextWindow: 200000,
      description: 'Fast and cost-effective',
      toolCalling: true,
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google' as const,
      speed: 'fast' as const,
      cost: 'low' as const,
      quality: 'excellent' as const,
      contextWindow: 32000,
      description: 'Google\'s advanced AI model',
      vision: true,
      toolCalling: true,
    },
  ]

  const [selectedModel, setSelectedModel] = React.useState('gpt-4-turbo')
  const [showMetrics, setShowMetrics] = React.useState(true)
  const [showDescription, setShowDescription] = React.useState(true)

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    console.log('Model selected:', modelId)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showMetrics}
            onChange={(e) => setShowMetrics(e.target.checked)}
            className="rounded"
          />
          Show Metrics
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showDescription}
            onChange={(e) => setShowDescription(e.target.checked)}
            className="rounded"
          />
          Show Descriptions
        </label>
        <div className="ml-auto text-xs text-muted-foreground">
          Selected: <span className="font-mono">{selectedModel}</span>
        </div>
      </div>

      {/* Demo Component */}
      <div className="p-6 rounded-xl border border-border/50 bg-card shadow-lg">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select AI Model
          </label>

          {/* Simulated ModelSelector */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className={cn(
                'w-full rounded-xl border border-border/40 bg-card/95 backdrop-blur-md',
                'px-4 py-3 text-sm shadow-sm hover:shadow-md hover:border-border/60',
                'transition-all duration-200 ease-out',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                'appearance-none cursor-pointer'
              )}
            >
              {sampleModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>

            {/* Model Info Display */}
            {sampleModels
              .filter((m) => m.id === selectedModel)
              .map((model) => (
                <div key={model.id} className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{model.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {model.provider}
                      </p>
                    </div>
                    {showMetrics && (
                      <div className="flex flex-wrap gap-1.5">
                        {/* Speed Badge */}
                        <span
                          className={cn(
                            'px-2 py-0.5 text-xs rounded-full capitalize',
                            model.speed === 'fast'
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : model.speed === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          )}
                        >
                          {model.speed}
                        </span>
                        {/* Cost Badge */}
                        <span
                          className={cn(
                            'px-2 py-0.5 text-xs rounded-full capitalize',
                            model.cost === 'low'
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : model.cost === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          )}
                        >
                          ${model.cost}
                        </span>
                        {/* Quality Badge */}
                        <span
                          className={cn(
                            'px-2 py-0.5 text-xs rounded-full capitalize',
                            model.quality === 'best'
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : model.quality === 'excellent'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                          )}
                        >
                          {model.quality}
                        </span>
                      </div>
                    )}
                  </div>
                  {showDescription && model.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {model.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{(model.contextWindow / 1000).toFixed(0)}K context</span>
                    {model.vision && <span>· Vision</span>}
                    {model.toolCalling && <span>· Tools</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
  },
  {
    id: 'model-info',
    title: 'ModelInfo Type',
  },
  {
    id: 'provider-support',
    title: 'Provider Support',
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-with-custom-models', title: 'Custom Models' },
      { id: 'example-compact', title: 'Compact Mode' },
      { id: 'example-filtered', title: 'Filtered by Provider' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'models',
    type: 'ModelInfo[]',
    required: true,
    description:
      'Array of available models to choose from. Each model includes metadata like provider, speed, cost, and quality.',
  },
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Currently selected model ID. Must match a model.id in the models array.',
  },
  {
    name: 'onChange',
    type: '(modelId: string, config: ModelConfig) => void',
    required: true,
    description:
      'Callback when a model is selected. Receives the model ID and a ModelConfig object.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
  {
    name: 'showMetrics',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to show speed, cost, and quality badges in the dropdown.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled state for the selector.',
  },
  {
    name: 'showDescription',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show model descriptions in the dropdown.',
  },
]

const modelInfoProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique model identifier (e.g., "gpt-4-turbo", "claude-3-opus").',
  },
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Display name for the model.',
  },
  {
    name: 'provider',
    type: '"openai" | "anthropic" | "google"',
    required: true,
    description: 'AI provider for this model.',
  },
  {
    name: 'speed',
    type: '"fast" | "medium" | "slow"',
    required: true,
    description: 'Speed rating for the model.',
  },
  {
    name: 'cost',
    type: '"low" | "medium" | "high"',
    required: true,
    description: 'Cost rating for the model.',
  },
  {
    name: 'quality',
    type: '"good" | "excellent" | "best"',
    required: true,
    description: 'Quality rating for the model.',
  },
  {
    name: 'contextWindow',
    type: 'number',
    required: true,
    description: 'Context window size in tokens.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Optional description of the model\'s capabilities.',
  },
  {
    name: 'streaming',
    type: 'boolean',
    description: 'Whether the model supports streaming responses.',
  },
  {
    name: 'toolCalling',
    type: 'boolean',
    description: 'Whether the model supports tool/function calling.',
  },
  {
    name: 'vision',
    type: 'boolean',
    description: 'Whether the model supports image inputs.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo, ModelConfig } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo } from '@clarity-chat/react'
import { useState } from 'react'

const models: ModelInfo[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'medium',
    quality: 'best',
    contextWindow: 128000,
    description: 'Most capable OpenAI model',
    vision: true,
    toolCalling: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    speed: 'medium',
    cost: 'high',
    quality: 'best',
    contextWindow: 200000,
    description: 'Most powerful Claude model',
    vision: true,
    toolCalling: true,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    speed: 'fast',
    cost: 'low',
    quality: 'excellent',
    contextWindow: 32000,
    description: 'Google\\'s advanced AI model',
    vision: true,
    toolCalling: true,
  },
]

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')

  const handleModelChange = (modelId: string, config: ModelConfig) => {
    console.log('Model changed:', modelId, config)
    setSelectedModel(modelId)
  }

  return (
    <ModelSelector
      models={models}
      value={selectedModel}
      onChange={handleModelChange}
    />
  )
}`

const customModelsCode = `import { ModelSelector } from '@clarity-chat/react'
import type { ModelInfo } from '@clarity-chat/react'

// Add your custom models or fine-tuned versions
const customModels: ModelInfo[] = [
  {
    id: 'custom-gpt-4',
    name: 'Custom GPT-4 (Fine-tuned)',
    provider: 'openai',
    speed: 'fast',
    cost: 'high',
    quality: 'best',
    contextWindow: 8000,
    description: 'Fine-tuned for customer support',
    toolCalling: true,
  },
  {
    id: 'ft:gpt-3.5-turbo:org:model:id',
    name: 'Support Assistant',
    provider: 'openai',
    speed: 'fast',
    cost: 'medium',
    quality: 'excellent',
    contextWindow: 4000,
    description: 'Specialized for product support',
    toolCalling: true,
  },
]

function SupportChat() {
  const [model, setModel] = useState(customModels[0].id)

  return (
    <ModelSelector
      models={customModels}
      value={model}
      onChange={(id, config) => {
        setModel(id)
        // Update your chat configuration
        updateChatConfig(config)
      }}
    />
  )
}`

const compactModeCode = `import { ModelSelector } from '@clarity-chat/react'

function CompactSelector() {
  return (
    <ModelSelector
      models={models}
      value={selectedModel}
      onChange={handleChange}
      showMetrics={false}
      showDescription={false}
      className="max-w-xs"
    />
  )
}`

const filteredCode = `import { ModelSelector } from '@clarity-chat/react'
import { useMemo, useState } from 'react'

function FilteredSelector() {
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google'>('openai')

  // Filter models by provider
  const filteredModels = useMemo(() =>
    allModels.filter(m => m.provider === provider),
    [provider]
  )

  return (
    <div className="space-y-4">
      {/* Provider selector */}
      <div className="flex gap-2">
        {(['openai', 'anthropic', 'google'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            className={provider === p ? 'btn-primary' : 'btn-secondary'}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Model selector for chosen provider */}
      <ModelSelector
        models={filteredModels}
        value={selectedModel}
        onChange={handleChange}
      />
    </div>
  )
}`

const typescriptCode = `// Main component props
interface ModelSelectorProps {
  /** Available models */
  models: ModelInfo[]
  /** Currently selected model ID */
  value: string
  /** Callback when model is selected */
  onChange: (modelId: string, config: ModelConfig) => void
  /** Additional CSS class */
  className?: string
  /** Show speed/cost/quality badges */
  showMetrics?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Show extended info */
  showDescription?: boolean
}

// Model information
interface ModelInfo {
  /** Model ID */
  id: string
  /** Display name */
  name: string
  /** Provider */
  provider: 'openai' | 'anthropic' | 'google'
  /** Speed rating */
  speed: 'fast' | 'medium' | 'slow'
  /** Cost rating */
  cost: 'low' | 'medium' | 'high'
  /** Quality rating */
  quality: 'good' | 'excellent' | 'best'
  /** Context window size */
  contextWindow: number
  /** Description */
  description?: string
  /** Supports streaming */
  streaming?: boolean
  /** Supports tool/function calling */
  toolCalling?: boolean
  /** Supports vision/images */
  vision?: boolean
}

// Model configuration passed to onChange
interface ModelConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  /** Model identifier */
  model: string
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function ModelSelectorPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      AI Component
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                ModelSelector
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A dropdown component for selecting AI models with visual
                indicators for speed, cost, and quality. Supports OpenAI,
                Anthropic, and Google models out of the box, with full
                customization for fine-tuned models.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Zap,
                  label: 'Performance Metrics',
                  desc: 'Speed, cost, quality',
                },
                {
                  icon: Layers,
                  label: 'Multi-Provider',
                  desc: 'OpenAI, Anthropic, Google',
                },
                {
                  icon: Settings,
                  label: 'Customizable',
                  desc: 'Fine-tuned models',
                },
                {
                  icon: Accessibility,
                  label: 'Accessible',
                  desc: 'WCAG AA compliant',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>ModelSelector</code> provides an intuitive interface for
                  users to choose between different AI models. Each model
                  displays key metrics to help users make informed decisions
                  based on their needs.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Visual Metrics:</strong> Speed, cost, and quality
                    badges help users understand trade-offs
                  </li>
                  <li>
                    <strong>Provider Support:</strong> Built-in support for
                    OpenAI, Anthropic, and Google models
                  </li>
                  <li>
                    <strong>Model Capabilities:</strong> Shows context window,
                    vision support, and tool calling
                  </li>
                  <li>
                    <strong>Custom Models:</strong> Easy to add fine-tuned or
                    custom model configurations
                  </li>
                  <li>
                    <strong>Responsive:</strong> Mobile-first design with
                    self-contained styles
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use ModelSelector
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Model Comparison:</strong> When users need to compare
                    different models
                  </li>
                  <li>
                    <strong>Multi-Provider Apps:</strong> When your app supports
                    multiple AI providers
                  </li>
                  <li>
                    <strong>Cost Optimization:</strong> When users should choose
                    based on cost/performance
                  </li>
                  <li>
                    <strong>Fine-Tuned Models:</strong> When offering custom or
                    specialized models
                  </li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">
                  Import the component and required types:
                </p>

                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Try the ModelSelector component. Toggle metrics and descriptions
                to see different display modes.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  ModelSelector requires <code>models</code>, <code>value</code>
                  , and <code>onChange</code> props:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="App.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                ModelSelector accepts the following props for configuration:
              </p>
              <PropsTable props={coreProps} />
            </Section>

            {/* ModelInfo Type Section */}
            <Section id="model-info" title="ModelInfo Type">
              <p className="text-muted-foreground mb-6">
                Each model in the <code>models</code> array should conform to
                the <code>ModelInfo</code> interface:
              </p>
              <PropsTable props={modelInfoProps} title="ModelInfo Properties" />
            </Section>

            {/* Provider Support Section */}
            <Section id="provider-support" title="Provider Support">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mb-3">OpenAI Models</h4>
                <p className="text-muted-foreground mb-4">
                  GPT-4 Turbo, GPT-4, GPT-3.5 Turbo, and custom fine-tuned models.
                </p>

                <h4 className="text-lg font-semibold mb-3">Anthropic Models</h4>
                <p className="text-muted-foreground mb-4">
                  Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku, and earlier Claude versions.
                </p>

                <h4 className="text-lg font-semibold mb-3">Google Models</h4>
                <p className="text-muted-foreground mb-4">
                  Gemini Pro, Gemini Pro Vision, and other Gemini variants.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Model Capabilities Comparison
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">Model</th>
                        <th className="px-4 py-3 text-left font-semibold">Context</th>
                        <th className="px-4 py-3 text-left font-semibold">Vision</th>
                        <th className="px-4 py-3 text-left font-semibold">Tools</th>
                        <th className="px-4 py-3 text-left font-semibold">Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">GPT-4 Turbo</td>
                        <td className="px-4 py-3">128K</td>
                        <td className="px-4 py-3">✓</td>
                        <td className="px-4 py-3">✓</td>
                        <td className="px-4 py-3">Fast</td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3">Claude 3 Opus</td>
                        <td className="px-4 py-3">200K</td>
                        <td className="px-4 py-3">✓</td>
                        <td className="px-4 py-3">✓</td>
                        <td className="px-4 py-3">Medium</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">Gemini Pro</td>
                        <td className="px-4 py-3">32K</td>
                        <td className="px-4 py-3">✓</td>
                        <td className="px-4 py-3">✓</td>
                        <td className="px-4 py-3">Fast</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple model selector with all default options:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicSelector.tsx"
                />
              </SubSection>

              <SubSection
                id="example-with-custom-models"
                title="With Custom Models"
              >
                <p className="text-muted-foreground mb-4">
                  Add your own fine-tuned or custom models:
                </p>
                <CodeBlock
                  code={customModelsCode}
                  language="tsx"
                  filename="CustomModels.tsx"
                />
              </SubSection>

              <SubSection id="example-compact" title="Compact Mode">
                <p className="text-muted-foreground mb-4">
                  Hide metrics and descriptions for a minimal display:
                </p>
                <CodeBlock
                  code={compactModeCode}
                  language="tsx"
                  filename="CompactSelector.tsx"
                />
              </SubSection>

              <SubSection id="example-filtered" title="Filtered by Provider">
                <p className="text-muted-foreground mb-4">
                  Filter models by provider dynamically:
                </p>
                <CodeBlock
                  code={filteredCode}
                  language="tsx"
                  filename="FilteredSelector.tsx"
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for all props and configurations:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>ModelSelector includes comprehensive accessibility features:</p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    - Focus the selector
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Space
                    </kbd>{' '}
                    or{' '}
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Open dropdown
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Up/Down
                    </kbd>{' '}
                    - Navigate models
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Escape
                    </kbd>{' '}
                    - Close dropdown
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  ARIA Attributes
                </h4>
                <ul className="space-y-2">
                  <li>
                    <code>aria-haspopup="listbox"</code> on trigger button
                  </li>
                  <li>
                    <code>aria-expanded</code> reflects dropdown state
                  </li>
                  <li>
                    <code>role="listbox"</code> on dropdown menu
                  </li>
                  <li>
                    <code>role="option"</code> on each model option
                  </li>
                  <li>
                    <code>aria-selected</code> on currently selected model
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion Support
                </h4>
                <p>
                  Animations are automatically disabled when{' '}
                  <code>prefers-reduced-motion</code> is set.
                </p>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Selected model not displaying
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The selected model is not shown in the dropdown.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>value</code> matches a <code>model.id</code> in
                          the <code>models</code> array
                        </li>
                        <li>Check for typos in model IDs</li>
                        <li>Verify the models array is not empty</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        onChange not firing
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The onChange callback is not being called.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>onChange</code> is a function
                        </li>
                        <li>Check that the component is not disabled</li>
                        <li>Verify no errors in the console</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Adding custom model metrics
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Want to add custom metrics beyond speed/cost/quality?
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You can add custom properties to your <code>ModelInfo</code>{' '}
                        objects and access them in your <code>onChange</code>{' '}
                        handler. The component will display the standard metrics,
                        but your application can use additional data for decision
                        making.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'Complete chat interface with model selection',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'Hook for chat state with model configuration',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'ModelConfig',
                    type: 'type',
                    description: 'Type definition for model configuration',
                    href: '/reference/types/model-config',
                  },
                  {
                    name: 'Adapters',
                    type: 'guide',
                    description: 'Provider adapters for OpenAI, Anthropic, Google',
                    href: '/guides/adapters',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : api.type === 'type'
                              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                              : api.type === 'guide'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/chat-window"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      ChatWindow
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/message-list"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      MessageList
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
