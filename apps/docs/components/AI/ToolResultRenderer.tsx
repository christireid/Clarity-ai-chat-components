'use client'

/**
 * Tool Result Renderer
 *
 * Renders the results from docs assistant tool calls:
 * - generate_diagram: Mermaid diagrams
 * - lookup_component: Component API documentation
 * - lookup_hook: Hook API documentation
 * - generate_code_example: Code examples with syntax highlighting
 * - calculate_bundle_impact: Bundle size analysis
 */

import { useState, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Box,
  GitBranch,
  Code,
  Package,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useClipboard, useReducedMotion } from '@clarity-chat/react/internal'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { createFadeVariant, createSlideVariant } from '@/lib/animations'

// ============================================================================
// Types
// ============================================================================

export interface ToolResult {
  tool_name: string
  tool_use_id: string
  tool_result: unknown
}

export interface ToolUseProgress {
  tool_name: string
  tool_use_id: string
  tool_input?: unknown
}

interface DiagramResult {
  success: boolean
  diagram_type: string
  title: string
  mermaid_code: string
  description: string
}

interface ComponentResult {
  success: boolean
  name: string
  description: string
  category: string
  props: Array<{
    name: string
    type: string
    required: boolean
    description: string
    default?: string
  }>
  examples: string[]
  docUrl: string
}

interface HookResult {
  success: boolean
  name: string
  description: string
  category: string
  parameters: Array<{
    name: string
    type: string
    description: string
  }>
  returns: {
    type: string
    description: string
  }
  examples: string[]
  docUrl: string
}

interface CodeExampleResult {
  success: boolean
  language: string
  title: string
  code: string
  explanation: string
}

interface BundleImpactResult {
  success: boolean
  totalSize: string
  gzippedSize: string
  components: Array<{
    name: string
    size: string
    percentage: number
  }>
  recommendations: string[]
}

// ============================================================================
// Tool Progress Component
// ============================================================================

const TOOL_LABELS: Record<string, string> = {
  generate_diagram: 'Generating diagram',
  lookup_component: 'Looking up component',
  lookup_hook: 'Looking up hook',
  generate_code_example: 'Generating code example',
  calculate_bundle_impact: 'Calculating bundle impact',
}

const TOOL_ICONS: Record<string, typeof Box> = {
  generate_diagram: GitBranch,
  lookup_component: Box,
  lookup_hook: Code,
  generate_code_example: Code,
  calculate_bundle_impact: Package,
}

// Animation variants for reduced motion support
const toolUseVariants: Variants = createSlideVariant('up', 10, 'fast')
const toolUseVariantsReduced: Variants = createFadeVariant('fast')

export const ToolUseIndicator = memo(function ToolUseIndicator({
  toolUse,
}: {
  toolUse: ToolUseProgress
}) {
  const Icon = TOOL_ICONS[toolUse.tool_name] || Box
  const label = TOOL_LABELS[toolUse.tool_name] || 'Processing'
  const prefersReducedMotion = useReducedMotion()
  const variants = prefersReducedMotion
    ? toolUseVariantsReduced
    : toolUseVariants

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm"
    >
      <Loader2 className="w-4 h-4 animate-spin" />
      <Icon className="w-4 h-4" />
      <span>{label}...</span>
    </motion.div>
  )
})

// ============================================================================
// Mermaid Diagram Renderer
// ============================================================================

const MermaidDiagram = memo(function MermaidDiagram({
  code,
  title,
}: {
  code: string
  title: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [rendered, setRendered] = useState(false)
  const { copy, copied } = useClipboard({ timeout: 2000 })

  useEffect(() => {
    if (!containerRef.current) return

    const renderDiagram = async () => {
      try {
        const mermaid = await import('mermaid')
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          suppressErrorRendering: true,
        })

        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.default.render(id, code)

        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          setRendered(true)
          setError(null)
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to render diagram'
        )
      }
    }

    renderDiagram()
  }, [code])

  const handleCopy = async () => {
    await copy(code)
    toast.success('Mermaid code copied to clipboard')
  }

  return (
    <div className="my-4 border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-accent transition-colors"
          title="Copy Mermaid code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="p-4">
        {error ? (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Diagram rendering failed</p>
              <pre className="mt-1 text-xs opacity-75 whitespace-pre-wrap">
                {error}
              </pre>
            </div>
          </div>
        ) : !rendered ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        <div
          ref={containerRef}
          className={cn(
            'mermaid-diagram overflow-x-auto',
            '[&_svg]:max-w-full [&_svg]:h-auto',
            error && 'hidden'
          )}
        />
      </div>
    </div>
  )
})

// ============================================================================
// Component/Hook API Renderer
// ============================================================================

// Use fade animation for expandable sections (avoids layout thrashing with height)
const expandVariants = createFadeVariant('fast')

const APIDocRenderer = memo(function APIDocRenderer({
  result,
  type,
}: {
  result: ComponentResult | HookResult
  type: 'component' | 'hook'
}) {
  const [expanded, setExpanded] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="my-4 border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          {type === 'component' ? (
            <Box className="w-4 h-4 text-primary" />
          ) : (
            <Code className="w-4 h-4 text-primary" />
          )}
          <span className="font-mono text-sm font-semibold">{result.name}</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
            {result.category}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={prefersReducedMotion ? undefined : expandVariants}
            initial={prefersReducedMotion ? false : 'initial'}
            animate={prefersReducedMotion ? undefined : 'animate'}
            exit={prefersReducedMotion ? undefined : 'exit'}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {result.description}
              </p>

              {/* Props/Parameters table */}
              {'props' in result && result.props.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Props</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Type
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Required
                          </th>
                          <th className="px-3 py-2 text-left font-medium">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.props.map((prop) => (
                          <tr
                            key={prop.name}
                            className="border-t border-border"
                          >
                            <td className="px-3 py-2 font-mono text-xs">
                              {prop.name}
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-primary">
                              {prop.type}
                            </td>
                            <td className="px-3 py-2">
                              {prop.required ? (
                                <span className="text-destructive">✓</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {prop.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {'parameters' in result && result.parameters.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                  <div className="space-y-2">
                    {result.parameters.map((param) => (
                      <div
                        key={param.name}
                        className="flex items-start gap-2 text-sm"
                      >
                        <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                          {param.name}
                        </code>
                        <code className="text-primary text-xs">
                          {param.type}
                        </code>
                        <span className="text-muted-foreground">
                          {param.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {'returns' in result && result.returns && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Returns</h4>
                  <div className="flex items-start gap-2 text-sm">
                    <code className="text-primary text-xs">
                      {result.returns.type}
                    </code>
                    <span className="text-muted-foreground">
                      {result.returns.description}
                    </span>
                  </div>
                </div>
              )}

              {result.examples.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Example</h4>
                  <pre className="p-3 bg-muted rounded-lg overflow-x-auto text-xs">
                    <code>{result.examples[0]}</code>
                  </pre>
                </div>
              )}

              <a
                href={result.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                View full documentation
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

// ============================================================================
// Code Example Renderer
// ============================================================================

const CodeExampleRenderer = memo(function CodeExampleRenderer({
  result,
}: {
  result: CodeExampleResult
}) {
  const { copy, copied } = useClipboard({ timeout: 2000 })

  const handleCopy = async () => {
    await copy(result.code)
    toast.success('Code copied to clipboard')
  }

  return (
    <div className="my-4 border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{result.title}</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
            {result.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-accent transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-sm">
        <code className={`language-${result.language}`}>{result.code}</code>
      </pre>

      {result.explanation && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground">{result.explanation}</p>
        </div>
      )}
    </div>
  )
})

// ============================================================================
// Bundle Impact Renderer
// ============================================================================

const BundleImpactRenderer = memo(function BundleImpactRenderer({
  result,
}: {
  result: BundleImpactResult
}) {
  return (
    <div className="my-4 border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
        <Package className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Bundle Size Analysis</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Total sizes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Size</p>
            <p className="text-lg font-semibold">{result.totalSize}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Gzipped</p>
            <p className="text-lg font-semibold text-green-600">
              {result.gzippedSize}
            </p>
          </div>
        </div>

        {/* Component breakdown */}
        {result.components.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Component Breakdown</h4>
            <div className="space-y-2">
              {result.components.map((comp) => (
                <div key={comp.name} className="flex items-center gap-2">
                  <span className="text-sm font-mono w-32 truncate">
                    {comp.name}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${comp.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    {comp.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {result.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
})

// ============================================================================
// Main Tool Result Renderer
// ============================================================================

export const ToolResultRenderer = memo(function ToolResultRenderer({
  result,
}: {
  result: ToolResult
}) {
  const toolResult = result.tool_result as Record<string, unknown>

  // Handle error results
  if (toolResult && !toolResult.success && toolResult.error) {
    return (
      <div className="my-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">
              Tool execution failed
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {String(toolResult.error)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Render based on tool type
  switch (result.tool_name) {
    case 'generate_diagram': {
      const diagramResult = toolResult as unknown as DiagramResult
      return (
        <MermaidDiagram
          code={diagramResult.mermaid_code}
          title={diagramResult.title}
        />
      )
    }

    case 'lookup_component':
      return (
        <APIDocRenderer
          result={toolResult as unknown as ComponentResult}
          type="component"
        />
      )

    case 'lookup_hook':
      return <APIDocRenderer result={toolResult as unknown as HookResult} type="hook" />

    case 'generate_code_example':
      return <CodeExampleRenderer result={toolResult as unknown as CodeExampleResult} />

    case 'calculate_bundle_impact':
      return <BundleImpactRenderer result={toolResult as unknown as BundleImpactResult} />

    default:
      // Fallback: render as JSON
      return (
        <div className="my-4 p-4 bg-muted rounded-lg">
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(toolResult, null, 2)}
          </pre>
        </div>
      )
  }
})
