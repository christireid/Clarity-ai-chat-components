// @ts-nocheck -- 'FileJson' may not exist in the installed lucide-react version (icon was renamed or removed). Also imports 'durations' from '@/lib/animations' and 'Breadcrumbs' from '@/components/Navigation/Breadcrumbs' which may have type mismatches with the actual module exports.
'use client'

/**
 * MODEL_REGISTRY Reference Documentation
 *
 * Complete reference for all supported AI models including pricing,
 * context windows, capabilities, and configuration details.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Database,
  DollarSign,
  Zap,
  Eye,
  Code,
  Brain,
  FileJson,
  CheckCircle2,
  XCircle,
  Info,
  TrendingDown,
  ArrowRight,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { durations } from '@/lib/animations'

interface ModelCapabilities {
  vision: boolean
  functionCalling: boolean
  reasoning: boolean
  jsonMode: boolean
}

interface ModelInfo {
  id: string
  displayName: string
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'meta' | 'mistral'
  encoding: string
  contextWindow: number
  maxOutputTokens: number
  inputCostPer1M: number
  outputCostPer1M: number
  cachedInputCostPer1M?: number
  supportsCaching: boolean
  capabilities: ModelCapabilities
  releaseDate?: string
  notes?: string
}

// Model data organized by provider
const modelsByProvider: Record<string, ModelInfo[]> = {
  OpenAI: [
    {
      id: 'gpt-4o',
      displayName: 'GPT-4o',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 128000,
      maxOutputTokens: 16384,
      inputCostPer1M: 2.5,
      outputCostPer1M: 10.0,
      cachedInputCostPer1M: 1.25,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'gpt-4o-mini',
      displayName: 'GPT-4o Mini',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 128000,
      maxOutputTokens: 16384,
      inputCostPer1M: 0.15,
      outputCostPer1M: 0.6,
      cachedInputCostPer1M: 0.075,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'gpt-4.1',
      displayName: 'GPT-4.1',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 1000000,
      maxOutputTokens: 32768,
      inputCostPer1M: 2.0,
      outputCostPer1M: 8.0,
      cachedInputCostPer1M: 0.5,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2025-04',
    },
    {
      id: 'gpt-4.1-mini',
      displayName: 'GPT-4.1 Mini',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 1000000,
      maxOutputTokens: 32768,
      inputCostPer1M: 0.4,
      outputCostPer1M: 1.6,
      cachedInputCostPer1M: 0.1,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2025-04',
    },
    {
      id: 'gpt-4.1-nano',
      displayName: 'GPT-4.1 Nano',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 1000000,
      maxOutputTokens: 32768,
      inputCostPer1M: 0.1,
      outputCostPer1M: 0.4,
      cachedInputCostPer1M: 0.025,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2025-04',
    },
    {
      id: 'gpt-4-turbo',
      displayName: 'GPT-4 Turbo',
      provider: 'openai',
      encoding: 'cl100k_base',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      inputCostPer1M: 10.0,
      outputCostPer1M: 30.0,
      cachedInputCostPer1M: 5.0,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'gpt-4',
      displayName: 'GPT-4',
      provider: 'openai',
      encoding: 'cl100k_base',
      contextWindow: 8192,
      maxOutputTokens: 4096,
      inputCostPer1M: 30.0,
      outputCostPer1M: 60.0,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      provider: 'openai',
      encoding: 'cl100k_base',
      contextWindow: 16385,
      maxOutputTokens: 4096,
      inputCostPer1M: 0.5,
      outputCostPer1M: 1.5,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'o1',
      displayName: 'O1',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 200000,
      maxOutputTokens: 100000,
      inputCostPer1M: 15.0,
      outputCostPer1M: 60.0,
      cachedInputCostPer1M: 7.5,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: true,
        jsonMode: true,
      },
      notes: 'Extended thinking model with reasoning tokens',
    },
    {
      id: 'o1-mini',
      displayName: 'O1 Mini',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 128000,
      maxOutputTokens: 65536,
      inputCostPer1M: 3.0,
      outputCostPer1M: 12.0,
      cachedInputCostPer1M: 1.5,
      supportsCaching: true,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: true,
        jsonMode: true,
      },
    },
    {
      id: 'o1-preview',
      displayName: 'O1 Preview',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 128000,
      maxOutputTokens: 32768,
      inputCostPer1M: 15.0,
      outputCostPer1M: 60.0,
      cachedInputCostPer1M: 7.5,
      supportsCaching: true,
      capabilities: {
        vision: false,
        functionCalling: false,
        reasoning: true,
        jsonMode: false,
      },
      notes: 'Preview version, limited capabilities',
    },
    {
      id: 'o3-mini',
      displayName: 'O3 Mini',
      provider: 'openai',
      encoding: 'o200k_base',
      contextWindow: 200000,
      maxOutputTokens: 100000,
      inputCostPer1M: 1.1,
      outputCostPer1M: 4.4,
      cachedInputCostPer1M: 0.55,
      supportsCaching: true,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: true,
        jsonMode: true,
      },
      releaseDate: '2025-01',
    },
  ],
  Anthropic: [
    {
      id: 'claude-opus-4',
      displayName: 'Claude Opus 4',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 1000000,
      maxOutputTokens: 32768,
      inputCostPer1M: 15.0,
      outputCostPer1M: 75.0,
      cachedInputCostPer1M: 1.5,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2025-01',
      notes: 'Context window upgraded to 1M',
    },
    {
      id: 'claude-sonnet-4',
      displayName: 'Claude Sonnet 4',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 1000000,
      maxOutputTokens: 16384,
      inputCostPer1M: 3.0,
      outputCostPer1M: 15.0,
      cachedInputCostPer1M: 0.3,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2024-12',
      notes: 'Context window upgraded to 1M in late 2024',
    },
    {
      id: 'claude-3-5-sonnet',
      displayName: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 200000,
      maxOutputTokens: 8192,
      inputCostPer1M: 3.0,
      outputCostPer1M: 15.0,
      cachedInputCostPer1M: 0.3,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'claude-3-5-haiku',
      displayName: 'Claude 3.5 Haiku',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 200000,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.8,
      outputCostPer1M: 4.0,
      cachedInputCostPer1M: 0.08,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'claude-3-opus',
      displayName: 'Claude 3 Opus',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 200000,
      maxOutputTokens: 4096,
      inputCostPer1M: 15.0,
      outputCostPer1M: 75.0,
      cachedInputCostPer1M: 1.5,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'claude-3-sonnet',
      displayName: 'Claude 3 Sonnet',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 200000,
      maxOutputTokens: 4096,
      inputCostPer1M: 3.0,
      outputCostPer1M: 15.0,
      cachedInputCostPer1M: 0.3,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'claude-3-haiku',
      displayName: 'Claude 3 Haiku',
      provider: 'anthropic',
      encoding: 'claude',
      contextWindow: 200000,
      maxOutputTokens: 4096,
      inputCostPer1M: 0.25,
      outputCostPer1M: 1.25,
      cachedInputCostPer1M: 0.03,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
  ],
  Google: [
    {
      id: 'gemini-2.0-pro',
      displayName: 'Gemini 2.0 Pro',
      provider: 'google',
      encoding: 'gemini',
      contextWindow: 2000000,
      maxOutputTokens: 8192,
      inputCostPer1M: 1.25,
      outputCostPer1M: 5.0,
      cachedInputCostPer1M: 0.31,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2025-01',
    },
    {
      id: 'gemini-2.0-flash',
      displayName: 'Gemini 2.0 Flash',
      provider: 'google',
      encoding: 'gemini',
      contextWindow: 1000000,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.1,
      outputCostPer1M: 0.4,
      cachedInputCostPer1M: 0.025,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2024-12',
    },
    {
      id: 'gemini-1.5-pro',
      displayName: 'Gemini 1.5 Pro',
      provider: 'google',
      encoding: 'gemini',
      contextWindow: 2000000,
      maxOutputTokens: 8192,
      inputCostPer1M: 1.25,
      outputCostPer1M: 5.0,
      cachedInputCostPer1M: 0.31,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'gemini-1.5-flash',
      displayName: 'Gemini 1.5 Flash',
      provider: 'google',
      encoding: 'gemini',
      contextWindow: 1000000,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.075,
      outputCostPer1M: 0.3,
      cachedInputCostPer1M: 0.01875,
      supportsCaching: true,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'gemini-pro',
      displayName: 'Gemini Pro',
      provider: 'google',
      encoding: 'gemini',
      contextWindow: 32760,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.5,
      outputCostPer1M: 1.5,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
  ],
  DeepSeek: [
    {
      id: 'deepseek-r1',
      displayName: 'DeepSeek R1',
      provider: 'deepseek',
      encoding: 'deepseek',
      contextWindow: 128000,
      maxOutputTokens: 32768,
      inputCostPer1M: 0.55,
      outputCostPer1M: 2.19,
      cachedInputCostPer1M: 0.14,
      supportsCaching: true,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: true,
        jsonMode: true,
      },
      releaseDate: '2025-01',
      notes: 'Reasoning model with extended thinking',
    },
    {
      id: 'deepseek-chat',
      displayName: 'DeepSeek Chat',
      provider: 'deepseek',
      encoding: 'deepseek',
      contextWindow: 65536,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.14,
      outputCostPer1M: 0.28,
      cachedInputCostPer1M: 0.014,
      supportsCaching: true,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'deepseek-coder',
      displayName: 'DeepSeek Coder',
      provider: 'deepseek',
      encoding: 'deepseek',
      contextWindow: 65536,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.14,
      outputCostPer1M: 0.28,
      cachedInputCostPer1M: 0.014,
      supportsCaching: true,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
  ],
  Meta: [
    {
      id: 'llama-3.3',
      displayName: 'Llama 3.3',
      provider: 'meta',
      encoding: 'llama3',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.4,
      outputCostPer1M: 0.4,
      supportsCaching: false,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
      releaseDate: '2024-12',
    },
    {
      id: 'llama-3.2',
      displayName: 'Llama 3.2',
      provider: 'meta',
      encoding: 'llama3',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      inputCostPer1M: 0.2,
      outputCostPer1M: 0.2,
      supportsCaching: false,
      capabilities: {
        vision: true,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'llama-3.1',
      displayName: 'Llama 3.1',
      provider: 'meta',
      encoding: 'llama3',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      inputCostPer1M: 0.25,
      outputCostPer1M: 0.25,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'llama-3',
      displayName: 'Llama 3',
      provider: 'meta',
      encoding: 'llama3',
      contextWindow: 8192,
      maxOutputTokens: 4096,
      inputCostPer1M: 0.25,
      outputCostPer1M: 0.25,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: false,
        reasoning: false,
        jsonMode: false,
      },
    },
  ],
  Mistral: [
    {
      id: 'mistral-large',
      displayName: 'Mistral Large',
      provider: 'mistral',
      encoding: 'mistral',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      inputCostPer1M: 2.0,
      outputCostPer1M: 6.0,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'mistral-medium',
      displayName: 'Mistral Medium',
      provider: 'mistral',
      encoding: 'mistral',
      contextWindow: 32768,
      maxOutputTokens: 8192,
      inputCostPer1M: 2.7,
      outputCostPer1M: 8.1,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
    {
      id: 'mistral-small',
      displayName: 'Mistral Small',
      provider: 'mistral',
      encoding: 'mistral',
      contextWindow: 32768,
      maxOutputTokens: 8192,
      inputCostPer1M: 0.2,
      outputCostPer1M: 0.6,
      supportsCaching: false,
      capabilities: {
        vision: false,
        functionCalling: true,
        reasoning: false,
        jsonMode: true,
      },
    },
  ],
}

// Helper to format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toString()
}

// Helper to format cost
function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}/M (${cost.toFixed(4)}/K)`
  }
  return `$${cost.toFixed(2)}/M`
}

// Capability icon component
function CapabilityBadge({
  icon: Icon,
  label,
  enabled,
}: {
  icon: React.ElementType
  label: string
  enabled: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
        enabled
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-muted/50 text-muted-foreground/40'
      )}
      title={enabled ? `Supports ${label}` : `No ${label} support`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label}</span>
      {enabled ? (
        <CheckCircle2 className="w-3 h-3 ml-0.5" aria-label="Supported" />
      ) : (
        <XCircle className="w-3 h-3 ml-0.5" aria-label="Not supported" />
      )}
    </div>
  )
}

// Model card component
function ModelCard({ model }: { model: ModelInfo }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.moderate }}
      className="group rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {model.displayName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono">
                {model.id}
              </code>
              <span className="text-xs text-muted-foreground">
                {model.encoding}
              </span>
              {model.releaseDate && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {model.releaseDate}
                </span>
              )}
            </div>
          </div>
          {model.supportsCaching && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-sm"
              title="Supports prompt caching for reduced costs"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Caching
            </div>
          )}
        </div>

        {model.notes && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-200/20 dark:border-blue-800/20">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{model.notes}</p>
          </div>
        )}
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-muted/20">
        {/* Context Window */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Context Window
            </div>
            <div className="text-lg font-bold text-foreground">
              {formatNumber(model.contextWindow)}
            </div>
          </div>
        </div>

        {/* Max Output */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Max Output
            </div>
            <div className="text-lg font-bold text-foreground">
              {formatNumber(model.maxOutputTokens)}
            </div>
          </div>
        </div>

        {/* Input Cost */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Input Cost
            </div>
            <div className="text-sm font-bold text-foreground">
              {formatCost(model.inputCostPer1M)}
            </div>
          </div>
        </div>

        {/* Output Cost */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Output Cost
            </div>
            <div className="text-sm font-bold text-foreground">
              {formatCost(model.outputCostPer1M)}
            </div>
          </div>
        </div>

        {/* Cached Cost (if available) */}
        {model.cachedInputCostPer1M && (
          <div className="flex items-start gap-3 col-span-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Cached Input Cost
              </div>
              <div className="text-sm font-bold text-foreground">
                {formatCost(model.cachedInputCostPer1M)}
                <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 ml-2">
                  (
                  {Math.round(
                    ((model.inputCostPer1M - model.cachedInputCostPer1M) /
                      model.inputCostPer1M) *
                      100
                  )}
                  % savings)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Capabilities */}
      <div className="p-6 border-t border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Capabilities
        </h4>
        <div className="flex flex-wrap gap-2">
          <CapabilityBadge
            icon={Eye}
            label="Vision"
            enabled={model.capabilities.vision}
          />
          <CapabilityBadge
            icon={Code}
            label="Function Calling"
            enabled={model.capabilities.functionCalling}
          />
          <CapabilityBadge
            icon={Brain}
            label="Reasoning"
            enabled={model.capabilities.reasoning}
          />
          <CapabilityBadge
            icon={FileJson}
            label="JSON Mode"
            enabled={model.capabilities.jsonMode}
          />
        </div>
      </div>

      {/* Code Example (expandable) */}
      <div className="border-t border-border/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
        >
          <span>Usage Example</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4 transform rotate-90" />
          </motion.div>
        </button>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: durations.moderate }}
            className="px-4 pb-4 overflow-hidden"
          >
            <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
              <code className="text-xs font-mono text-foreground">{`import { TokenCounter } from '@clarity-chat/token-optimization'

const counter = new TokenCounter({
  model: '${model.id}',
})

const tokens = counter.countTokens('Hello, world!')
console.log(\`Tokens: \${tokens}\`)
console.log(\`Cost: $\${counter.estimateCost(tokens)}\`)`}</code>
            </pre>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function ModelRegistryPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedProvider, setSelectedProvider] = React.useState<string>('all')

  // Filter models based on search and provider
  const filteredProviders = React.useMemo(() => {
    const providers = { ...modelsByProvider }

    if (selectedProvider !== 'all') {
      const providerKey = Object.keys(providers).find(
        (key) => key.toLowerCase() === selectedProvider.toLowerCase()
      )
      if (providerKey) {
        return { [providerKey]: providers[providerKey] }
      }
      return {}
    }

    if (!searchQuery.trim()) {
      return providers
    }

    const query = searchQuery.toLowerCase()
    const filtered: typeof providers = {}

    Object.entries(providers).forEach(([provider, models]) => {
      const matchingModels = models.filter(
        (model) =>
          model.displayName.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query) ||
          model.encoding.toLowerCase().includes(query)
      )

      if (matchingModels.length > 0) {
        filtered[provider] = matchingModels
      }
    })

    return filtered
  }, [searchQuery, selectedProvider])

  const totalModels = Object.values(modelsByProvider).reduce(
    (acc, models) => acc + models.length,
    0
  )

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Database className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">
              Token Optimization
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            MODEL_REGISTRY
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Complete reference for all {totalModels} supported AI models
            including pricing, context windows, capabilities, and tokenization
            details. The single source of truth for token optimization and cost
            estimation.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search models by name, ID, or encoding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
              />
            </div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow min-w-[160px]"
            >
              <option value="all">All Providers</option>
              {Object.keys(modelsByProvider).map((provider) => (
                <option key={provider} value={provider.toLowerCase()}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
        </motion.header>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.1,
          }}
          className="grid gap-4 md:grid-cols-3 mb-12"
        >
          <Link
            href="/api/token-optimization"
            className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Token Optimization
              </h3>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground">
              Learn how to optimize token usage and reduce costs
            </p>
          </Link>

          <Link
            href="/reference/hooks/use-token-optimization"
            className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                useTokenOptimization
              </h3>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground">
              React hook for token counting and cost estimation
            </p>
          </Link>

          <Link
            href="/examples/token-optimization"
            className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Examples
              </h3>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground">
              See token optimization in action with examples
            </p>
          </Link>
        </motion.div>

        {/* Models by Provider */}
        <div className="space-y-12">
          {Object.entries(filteredProviders).map(([provider, models]) => (
            <motion.section
              key={provider}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
              }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span>{provider}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({models.length} model{models.length !== 1 ? 's' : ''})
                </span>
              </h2>

              <div className="grid gap-6 lg:grid-cols-2">
                {models.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            </motion.section>
          ))}

          {Object.keys(filteredProviders).length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No models found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>

        {/* Usage Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.slow,
            delay: 0.2,
          }}
          className="mt-16 p-8 rounded-xl border bg-gradient-to-br from-brand-500/5 via-accent-500/5 to-brand-500/5"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Using the Model Registry
          </h2>

          <div className="space-y-6 text-sm text-muted-foreground">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Import
              </h3>
              <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
                <code className="text-xs font-mono text-foreground">
                  {`import { MODEL_REGISTRY, getModelConfig } from '@clarity-chat/token-optimization'`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Get Model Configuration
              </h3>
              <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
                <code className="text-xs font-mono text-foreground">
                  {`const config = getModelConfig('gpt-4o')
console.log(config.contextWindow)  // 128000
console.log(config.inputCostPer1M)  // 2.5`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Filter Models
              </h3>
              <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
                <code className="text-xs font-mono text-foreground">
                  {`import {
  getModelsByProvider,
  getModelsWithCapability,
  getModelsWithMinContextWindow
} from '@clarity-chat/token-optimization'

// Get all OpenAI models
const openaiModels = getModelsByProvider('openai')

// Get models with vision support
const visionModels = getModelsWithCapability('vision')

// Get models with 1M+ context window
const largeContextModels = getModelsWithMinContextWindow(1000000)`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Register Custom Models
              </h3>
              <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
                <code className="text-xs font-mono text-foreground">
                  {`import { registerModel } from '@clarity-chat/token-optimization'

registerModel('my-fine-tuned-gpt-4o', {
  displayName: 'My Fine-Tuned GPT-4o',
  provider: 'openai',
  encoding: 'o200k_base',
  charsPerToken: 4,
  contextWindow: 128000,
  maxOutputTokens: 16384,
  recommendedOutputReserve: 16384,
  inputCostPer1M: 5.0,  // Custom pricing
  outputCostPer1M: 15.0,
  supportsCaching: true,
  capabilities: {
    vision: true,
    functionCalling: true,
    reasoning: false,
    jsonMode: true,
  },
})`}
                </code>
              </pre>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
