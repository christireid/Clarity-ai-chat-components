'use client'

/**
 * TokenAnalyzer Component - API Reference Documentation
 *
 * An advanced token analysis tool with encoding breakdown, cost estimation,
 * and optimization suggestions for deep token usage insights.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Scan,
  Copy,
  Check,
  ChevronRight,
  Code2,
  DollarSign,
  Lightbulb,
  TrendingDown,
  Activity,
  Eye,
  AlertCircle,
  Keyboard,
  Zap,
  Target,
  FileText,
  Gauge,
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
  const [text, setText] = React.useState(
    'Analyze this text to see token-by-token encoding breakdown and cost estimates.'
  )
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o')
  const [showHeatmap, setShowHeatmap] = React.useState(true)
  const [showBreakdown, setShowBreakdown] = React.useState(true)

  // Mock analysis results
  const tokenCount = 15
  const estimatedCost = 0.00003
  const avgTokenLength = 4.2
  const compressionRatio = 0.68

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-2 py-1 rounded border border-border/50 bg-background text-foreground text-sm"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="claude-3-5-haiku">Claude 3.5 Haiku</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            className="rounded"
          />
          Show Heatmap
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showBreakdown}
            onChange={(e) => setShowBreakdown(e.target.checked)}
            className="rounded"
          />
          Show Breakdown
        </label>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
        {/* Input Area */}
        <div className="p-4 bg-muted/20 border-b border-border/50">
          <label className="block text-sm font-medium text-foreground mb-2">
            Text to Analyze
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-border/50',
              'bg-background text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
              'font-mono text-sm min-h-[100px]'
            )}
            placeholder="Enter text to analyze..."
          />
        </div>

        {/* Analysis Results */}
        <div className="p-6 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {tokenCount}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total Tokens
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${estimatedCost.toFixed(5)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Est. Cost
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {avgTokenLength.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Avg Length
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(compressionRatio * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Compression
              </div>
            </div>
          </div>

          {/* Token Heatmap */}
          {showHeatmap && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Token Density Heatmap
              </h4>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex flex-wrap gap-1 font-mono text-sm">
                  {text.split(' ').map((word, i) => {
                    const intensity = Math.random()
                    return (
                      <span
                        key={i}
                        className="px-2 py-1 rounded transition-colors cursor-pointer hover:ring-2 hover:ring-brand-500/50"
                        style={{
                          backgroundColor: `rgba(139, 92, 246, ${intensity * 0.3})`,
                        }}
                        title={`${Math.ceil(word.length / 4)} tokens`}
                      >
                        {word}
                      </span>
                    )
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500/10" />
                    <span>Low density</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500/30" />
                    <span>High density</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Encoding Breakdown */}
          {showBreakdown && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Encoding Breakdown
              </h4>

              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        Text Tokens
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        12 (80%)
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Regular text content
                    </div>
                    <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: '80%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border/50">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        Special Tokens
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        3 (20%)
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Punctuation and formatting
                    </div>
                    <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: '20%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-200/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Optimization Tips
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use abbreviations where context is clear</li>
                  <li>• Remove redundant words and phrases</li>
                  <li>• Consider model-specific encoding efficiency</li>
                </ul>
              </div>
            </div>
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
  { id: 'props', title: 'Props Reference' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-cost-comparison', title: 'Cost Comparison' },
      { id: 'example-optimization', title: 'With Optimization' },
      { id: 'example-custom-tokenizer', title: 'Custom Tokenizer' },
    ],
  },
  { id: 'analysis-features', title: 'Analysis Features' },
  { id: 'model-support', title: 'Model Support' },
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

const mainProps: PropDefinition[] = [
  {
    name: 'text',
    type: 'string',
    required: true,
    description: 'Text content to analyze for token encoding and costs.',
  },
  {
    name: 'model',
    type: 'string',
    default: '"gpt-4o"',
    description:
      'AI model to use for tokenization. Affects encoding strategy and cost calculations.',
  },
  {
    name: 'showEncodingBreakdown',
    type: 'boolean',
    default: 'true',
    description:
      'Display token-by-token encoding breakdown with type classification.',
  },
  {
    name: 'showCostEstimate',
    type: 'boolean',
    default: 'true',
    description: 'Show estimated costs based on current model pricing.',
  },
  {
    name: 'showOptimizationTips',
    type: 'boolean',
    default: 'true',
    description:
      'Display automated suggestions for reducing token count and costs.',
  },
  {
    name: 'showHeatmap',
    type: 'boolean',
    default: 'false',
    description:
      'Visualize token density with color-coded heatmap overlay on text.',
  },
  {
    name: 'compareModels',
    type: 'string[]',
    description:
      'Array of model IDs to compare costs across. Shows cost comparison table.',
  },
  {
    name: 'customTokenizer',
    type: '(text: string) => Token[]',
    description:
      'Custom tokenization function for specialized encoding requirements.',
  },
  {
    name: 'onAnalysisComplete',
    type: '(analysis: TokenAnalysis) => void',
    description: 'Callback fired when analysis finishes with full results.',
  },
  {
    name: 'highlightPattern',
    type: 'RegExp | string',
    description:
      'Pattern to highlight in the text. Useful for finding inefficient patterns.',
  },
  {
    name: 'maxTokensWarning',
    type: 'number',
    description:
      'Show warning when token count exceeds this threshold. Helps prevent context overflow.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the analyzer container.',
  },
]

const analysisConfigProps: PropDefinition[] = [
  {
    name: 'includeWhitespace',
    type: 'boolean',
    default: 'true',
    description: 'Include whitespace tokens in analysis and counts.',
  },
  {
    name: 'includePunctuation',
    type: 'boolean',
    default: 'true',
    description: 'Include punctuation tokens in analysis.',
  },
  {
    name: 'includeSpecialTokens',
    type: 'boolean',
    default: 'true',
    description:
      'Include model-specific special tokens (e.g., BOS, EOS markers).',
  },
  {
    name: 'groupByType',
    type: 'boolean',
    default: 'false',
    description:
      'Group tokens by type (text, number, punctuation, special) in breakdown.',
  },
]

const visualizationProps: PropDefinition[] = [
  {
    name: 'heatmapColors',
    type: '{ low: string; high: string }',
    default: '{ low: "#f0f9ff", high: "#7c3aed" }',
    description: 'Color gradient for token density heatmap visualization.',
  },
  {
    name: 'showTooltips',
    type: 'boolean',
    default: 'true',
    description:
      'Show tooltips with detailed token info on hover over heatmap.',
  },
  {
    name: 'animateChanges',
    type: 'boolean',
    default: 'true',
    description: 'Animate transitions when text or settings change.',
  },
  {
    name: 'compactMode',
    type: 'boolean',
    default: 'false',
    description:
      'Use compact layout with condensed metrics and minimal spacing.',
  },
]

const advancedProps: PropDefinition[] = [
  {
    name: 'cacheResults',
    type: 'boolean',
    default: 'true',
    description:
      'Cache analysis results for identical inputs to improve performance.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '300',
    description: 'Debounce delay in milliseconds for analysis updates.',
  },
  {
    name: 'lazyLoad',
    type: 'boolean',
    default: 'false',
    description:
      'Defer analysis until component is visible in viewport (good for lists).',
  },
  {
    name: 'maxTextLength',
    type: 'number',
    default: '100000',
    description:
      'Maximum text length to analyze. Prevents performance issues with huge inputs.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { TokenAnalyzer } from '@clarity-chat/token-optimization/react'
import type { TokenAnalysis } from '@clarity-chat/token-optimization/react'

// Don't forget to import styles
import '@clarity-chat/token-optimization/styles.css'`

const basicUsageCode = `import { TokenAnalyzer } from '@clarity-chat/token-optimization/react'

function App() {
  const [text, setText] = useState('')

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..."
        className="w-full px-3 py-2 rounded border"
      />

      <TokenAnalyzer
        text={text}
        model="gpt-4o"
        showEncodingBreakdown
        showCostEstimate
        showOptimizationTips
      />
    </div>
  )
}`

const costComparisonCode = `import { TokenAnalyzer } from '@clarity-chat/token-optimization/react'

function CostComparison() {
  const text = "Analyze costs across multiple models"

  return (
    <TokenAnalyzer
      text={text}
      model="gpt-4o"
      compareModels={[
        'gpt-4o',
        'gpt-4o-mini',
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'gemini-2.0-flash-exp',
      ]}
      showCostEstimate
    />
  )
}`

const optimizationCode = `import { TokenAnalyzer } from '@clarity-chat/token-optimization/react'
import { useState } from 'react'

function OptimizationHelper() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const handleOptimize = () => {
    if (!analysis?.suggestions) return

    // Apply first suggestion
    const optimized = applyOptimization(text, analysis.suggestions[0])
    setText(optimized)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-3 py-2 rounded border"
      />

      <TokenAnalyzer
        text={text}
        model="gpt-4o"
        showOptimizationTips
        maxTokensWarning={4000}
        onAnalysisComplete={setAnalysis}
      />

      {analysis?.suggestions?.length > 0 && (
        <button
          onClick={handleOptimize}
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
        >
          Apply First Suggestion
        </button>
      )}
    </div>
  )
}`

const customTokenizerCode = `import { TokenAnalyzer } from '@clarity-chat/token-optimization/react'
import { encode } from 'gpt-tokenizer'

function CustomTokenizerExample() {
  const text = "Custom tokenization logic"

  const customTokenizer = (text: string) => {
    const tokens = encode(text)
    return tokens.map((id, i) => ({
      id,
      text: text.slice(i, i + 1),
      type: detectTokenType(id),
      position: i,
    }))
  }

  return (
    <TokenAnalyzer
      text={text}
      customTokenizer={customTokenizer}
      showEncodingBreakdown
      showHeatmap
    />
  )
}

function detectTokenType(tokenId: number) {
  // Custom logic to classify tokens
  if (tokenId < 256) return 'special'
  if (tokenId < 50000) return 'text'
  return 'rare'
}`

const typescriptCode = `// Main component props
interface TokenAnalyzerProps {
  /** Text to analyze */
  text: string
  /** Model for tokenization */
  model?: string
  /** Show encoding breakdown */
  showEncodingBreakdown?: boolean
  /** Show cost estimates */
  showCostEstimate?: boolean
  /** Show optimization suggestions */
  showOptimizationTips?: boolean
  /** Show token density heatmap */
  showHeatmap?: boolean
  /** Models to compare costs */
  compareModels?: string[]
  /** Custom tokenization function */
  customTokenizer?: (text: string) => Token[]
  /** Analysis complete callback */
  onAnalysisComplete?: (analysis: TokenAnalysis) => void
  /** Pattern to highlight */
  highlightPattern?: RegExp | string
  /** Warning threshold */
  maxTokensWarning?: number
  /** Analysis configuration */
  config?: AnalysisConfig
  /** Visualization options */
  visualization?: VisualizationConfig
  /** Advanced options */
  advanced?: AdvancedConfig
  /** Custom CSS class */
  className?: string
}

// Token analysis result
interface TokenAnalysis {
  /** Total token count */
  totalTokens: number
  /** Estimated cost in dollars */
  estimatedCost: number
  /** Average token length */
  avgTokenLength: number
  /** Compression ratio */
  compressionRatio: number
  /** Encoding breakdown by type */
  breakdown: {
    text: number
    numbers: number
    punctuation: number
    special: number
    whitespace: number
  }
  /** Optimization suggestions */
  suggestions: OptimizationSuggestion[]
  /** Individual tokens */
  tokens: Token[]
  /** Cost comparison across models */
  modelComparison?: ModelCostComparison[]
}

// Individual token
interface Token {
  /** Token ID from encoder */
  id: number
  /** Text representation */
  text: string
  /** Token type classification */
  type: 'text' | 'number' | 'punctuation' | 'special' | 'whitespace'
  /** Character position in original text */
  position: number
  /** Token length in characters */
  length: number
}

// Optimization suggestion
interface OptimizationSuggestion {
  /** Suggestion type */
  type: 'abbreviation' | 'redundancy' | 'formatting' | 'encoding'
  /** Description of optimization */
  description: string
  /** Potential token savings */
  tokensSaved: number
  /** Cost savings in dollars */
  costSaved: number
  /** Original text span */
  original: string
  /** Suggested replacement */
  replacement: string
  /** Confidence score (0-1) */
  confidence: number
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function TokenAnalyzerPage() {
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
                  <Scan className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      Experimental
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Priority 3
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                TokenAnalyzer
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Advanced token analysis tool with encoding breakdown, cost
                estimation, and optimization suggestions. Provides deep
                insights into token usage with visual heatmaps and
                multi-model cost comparisons.
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
                  icon: Code2,
                  label: 'Encoding Analysis',
                  desc: 'Token-by-token breakdown',
                },
                {
                  icon: DollarSign,
                  label: 'Cost Calculator',
                  desc: 'Multi-model comparison',
                },
                {
                  icon: Lightbulb,
                  label: 'Optimization Tips',
                  desc: 'Automated suggestions',
                },
                {
                  icon: Activity,
                  label: 'Visual Heatmap',
                  desc: 'Token density viz',
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
                  <code>TokenAnalyzer</code> provides comprehensive analysis of
                  text tokenization for AI models. It helps developers
                  understand token usage patterns, estimate costs accurately,
                  and optimize prompts for efficiency.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Why Analyze Tokens?
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Cost Control:</strong> Understand exactly what
                    you're paying for with token-level granularity
                  </li>
                  <li>
                    <strong>Optimization:</strong> Identify opportunities to
                    reduce token count without losing meaning
                  </li>
                  <li>
                    <strong>Model Selection:</strong> Compare costs across
                    models to choose the most cost-effective option
                  </li>
                  <li>
                    <strong>Context Management:</strong> Track token usage to
                    stay within model context limits
                  </li>
                  <li>
                    <strong>Encoding Insights:</strong> Learn how different
                    models tokenize your specific content
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Real-time Analysis:</strong> Instant token
                    breakdown as you type
                  </li>
                  <li>
                    <strong>Visual Heatmap:</strong> Color-coded visualization
                    of token density
                  </li>
                  <li>
                    <strong>Multi-Model Comparison:</strong> Compare costs
                    across 20+ AI models
                  </li>
                  <li>
                    <strong>Smart Suggestions:</strong> Automated optimization
                    recommendations
                  </li>
                  <li>
                    <strong>Custom Tokenizers:</strong> Bring your own
                    tokenization logic
                  </li>
                  <li>
                    <strong>Export Results:</strong> Download analysis data for
                    further processing
                  </li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/token-optimization"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">
                  Import the component and types:
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
                Try the TokenAnalyzer with live text analysis. Change models,
                toggle visualizations, and see real-time token breakdowns.
              </p>

              <LiveDemo />
            </Section>

            {/* Props Reference Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                Complete API reference for TokenAnalyzer props organized by
                category.
              </p>

              <PropsTable props={mainProps} title="Core Props" />

              <div className="mt-8">
                <PropsTable
                  props={analysisConfigProps}
                  title="Analysis Configuration (config)"
                />
              </div>

              <div className="mt-8">
                <PropsTable
                  props={visualizationProps}
                  title="Visualization Options (visualization)"
                />
              </div>

              <div className="mt-8">
                <PropsTable
                  props={advancedProps}
                  title="Advanced Options (advanced)"
                />
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple token analysis with encoding breakdown and cost
                  estimates:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicAnalysis.tsx"
                />
              </SubSection>

              <SubSection
                id="example-cost-comparison"
                title="Multi-Model Cost Comparison"
              >
                <p className="text-muted-foreground mb-4">
                  Compare costs across multiple AI models:
                </p>
                <CodeBlock
                  code={costComparisonCode}
                  language="tsx"
                  filename="CostComparison.tsx"
                />
              </SubSection>

              <SubSection
                id="example-optimization"
                title="With Optimization Suggestions"
              >
                <p className="text-muted-foreground mb-4">
                  Get and apply automated optimization suggestions:
                </p>
                <CodeBlock
                  code={optimizationCode}
                  language="tsx"
                  filename="OptimizationHelper.tsx"
                />
              </SubSection>

              <SubSection
                id="example-custom-tokenizer"
                title="Custom Tokenizer"
              >
                <p className="text-muted-foreground mb-4">
                  Use a custom tokenization function for specialized needs:
                </p>
                <CodeBlock
                  code={customTokenizerCode}
                  language="tsx"
                  filename="CustomTokenizer.tsx"
                />
              </SubSection>
            </Section>

            {/* Analysis Features Section */}
            <Section id="analysis-features" title="Analysis Features">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  TokenAnalyzer provides 8 types of analysis to help you
                  understand and optimize token usage:
                </p>

                <div className="grid gap-4 mt-6">
                  {[
                    {
                      title: 'Token Count Analysis',
                      icon: Gauge,
                      desc: 'Total tokens, average length, and compression ratio.',
                    },
                    {
                      title: 'Cost Estimation',
                      icon: DollarSign,
                      desc: 'Precise cost calculations based on current model pricing.',
                    },
                    {
                      title: 'Encoding Breakdown',
                      icon: Code2,
                      desc: 'Token-by-token analysis with type classification.',
                    },
                    {
                      title: 'Density Heatmap',
                      icon: Activity,
                      desc: 'Visual representation of token density across text.',
                    },
                    {
                      title: 'Model Comparison',
                      icon: Target,
                      desc: 'Side-by-side cost comparison across 20+ models.',
                    },
                    {
                      title: 'Optimization Tips',
                      icon: Lightbulb,
                      desc: 'Automated suggestions for reducing token count.',
                    },
                    {
                      title: 'Pattern Highlighting',
                      icon: Eye,
                      desc: 'Highlight specific patterns to find inefficiencies.',
                    },
                    {
                      title: 'Threshold Warnings',
                      icon: AlertCircle,
                      desc: 'Alerts when approaching token limits.',
                    },
                  ].map(({ title, icon: Icon, desc }) => (
                    <div
                      key={title}
                      className="p-4 rounded-lg border border-border/50 bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Model Support Section */}
            <Section id="model-support" title="Model Support">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  TokenAnalyzer supports accurate tokenization and cost
                  estimation for 20+ AI models:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-3">
                      OpenAI Models
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• GPT-4o (gpt-4o)</li>
                      <li>• GPT-4o Mini (gpt-4o-mini)</li>
                      <li>• GPT-4 Turbo (gpt-4-turbo)</li>
                      <li>• GPT-4 (gpt-4)</li>
                      <li>• GPT-3.5 Turbo (gpt-3.5-turbo)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-3">
                      Anthropic Models
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Claude 3.5 Sonnet</li>
                      <li>• Claude 3.5 Haiku</li>
                      <li>• Claude 3 Opus</li>
                      <li>• Claude 3 Sonnet</li>
                      <li>• Claude 3 Haiku</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-3">
                      Google Models
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Gemini 2.0 Flash (Experimental)</li>
                      <li>• Gemini 1.5 Pro</li>
                      <li>• Gemini 1.5 Flash</li>
                      <li>• Gemini 1.0 Pro</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <h4 className="font-semibold text-foreground mb-3">
                      Other Models
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Llama 3.3 70B (Meta)</li>
                      <li>• Mistral Large (Mistral AI)</li>
                      <li>• DeepSeek V3 (DeepSeek)</li>
                      <li>• Qwen 2.5 (Alibaba)</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Cost
                    estimates are based on current published pricing and may
                    vary. Always verify with your provider's pricing page.
                  </p>
                </div>
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for TokenAnalyzer with detailed
                interfaces:
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
                <p>
                  TokenAnalyzer is built with comprehensive accessibility
                  support:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" aria-hidden="true" />
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    All metrics announced with semantic labels via{' '}
                    <code>aria-label</code>
                  </li>
                  <li>
                    Token breakdown navigable with keyboard via{' '}
                    <code>role="listitem"</code>
                  </li>
                  <li>
                    Analysis updates announced via <code>aria-live="polite"</code>
                  </li>
                  <li>
                    Heatmap tooltips accessible through keyboard navigation
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    - Navigate between tokens in heatmap
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Show detailed token information
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Escape
                    </kbd>{' '}
                    - Close token details dialog
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Color Contrast
                </h4>
                <p>
                  Meets WCAG 2.1 AA standards with 4.5:1 minimum contrast.
                  Heatmap colors are tested for colorblind users with
                  alternative pattern indicators.
                </p>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Incorrect token counts
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Token counts don't match API responses.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Verify model name matches API exactly (case
                          sensitive)
                        </li>
                        <li>
                          Check if model uses special preprocessing (e.g.,
                          Claude system prompt tokens)
                        </li>
                        <li>
                          Consider using <code>customTokenizer</code> for exact
                          matching
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Performance issues with large texts
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Analyzer is slow with large inputs.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Increase <code>debounceMs</code> to reduce analysis
                          frequency
                        </li>
                        <li>
                          Set <code>lazyLoad</code> to defer analysis until
                          visible
                        </li>
                        <li>
                          Disable <code>showHeatmap</code> for texts over 10K
                          characters
                        </li>
                        <li>
                          Use <code>maxTextLength</code> to enforce limits
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Heatmap not showing
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Token density heatmap is not visible.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>showHeatmap</code> is set to{' '}
                          <code>true</code>
                        </li>
                        <li>Check that text is not empty</li>
                        <li>
                          Verify heatmap colors have sufficient contrast with
                          background
                        </li>
                        <li>
                          Try custom <code>heatmapColors</code> for better
                          visibility
                        </li>
                      </ul>
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
                    name: 'TokenOptimizationDashboard',
                    type: 'component',
                    description:
                      'Comprehensive dashboard for token optimization metrics',
                    href: '/reference/components/token-optimization-dashboard',
                  },
                  {
                    name: 'AccurateTokenCounter',
                    type: 'component',
                    description:
                      'Simple token counter with model-specific accuracy',
                    href: '/reference/components/accurate-token-counter',
                  },
                  {
                    name: 'useTokenAnalysis',
                    type: 'hook',
                    description:
                      'Hook for programmatic token analysis and optimization',
                    href: '/reference/hooks/use-token-analysis',
                  },
                  {
                    name: 'estimateTokenCost',
                    type: 'utility',
                    description: 'Utility function for cost estimation',
                    href: '/reference/utilities/estimate-token-cost',
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
                            : api.type === 'component'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
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
                  href="/reference/components/token-optimization-dashboard"
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
                      TokenOptimizationDashboard
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/accurate-token-counter"
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
                      AccurateTokenCounter
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
