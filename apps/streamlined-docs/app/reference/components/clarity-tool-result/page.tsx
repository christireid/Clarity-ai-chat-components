'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Shield, Zap, Cpu, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Mock tool result components for demo
interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

function WeatherToolUI({ data }: { data: WeatherData }) {
  const weatherIcons: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
  }

  return (
    <div className="mt-3 rounded-lg border border-border/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.location}</h3>
          <p className="text-sm text-muted-foreground">{data.condition}</p>
        </div>
        <span className="text-4xl" role="img" aria-label={data.condition}>
          {weatherIcons[data.icon] || '🌡️'}
        </span>
      </div>
      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        {data.temperature}°F
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Humidity:</span>
          <span className="font-medium">{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Wind:</span>
          <span className="font-medium">{data.windSpeed} mph</span>
        </div>
      </div>
    </div>
  )
}

interface SearchResult {
  title: string
  snippet: string
  url: string
  relevance: number
}

interface SearchData {
  query: string
  results: SearchResult[]
  totalResults: number
}

function SearchToolUI({ data }: { data: SearchData }) {
  return (
    <div className="mt-3 rounded-lg border border-border/50 bg-card p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Search: "{data.query}"
        </h3>
        <p className="text-sm text-muted-foreground">
          Found {data.totalResults} results
        </p>
      </div>
      <div className="space-y-3">
        {data.results.map((result, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-3 rounded-lg border border-border/30 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                {result.title}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                {Math.round(result.relevance * 100)}% match
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{result.snippet}</p>
            <a
              href={result.url}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.url}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface CalculatorData {
  operation: string
  operands: number[]
  result: number
  formula: string
}

function CalculatorToolUI({ data }: { data: CalculatorData }) {
  return (
    <div className="mt-3 rounded-lg border border-border/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-foreground">Calculator</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 rounded-md bg-white/50 dark:bg-black/20 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-muted-foreground mb-1">Formula</p>
          <code className="text-base font-mono text-foreground">{data.formula}</code>
        </div>
        <div className="p-3 rounded-md bg-purple-500/10 border border-purple-500/20">
          <p className="text-sm text-muted-foreground mb-1">Result</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {data.result.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

// Demo component registry
const createDemoRegistry = () => ({
  get_weather: WeatherToolUI,
  search_web: SearchToolUI,
  calculate: CalculatorToolUI,
})

// Simplified ClarityToolResult for demo
function DemoClarityToolResult({
  registry,
  toolCall,
  result,
  showHeader,
  variant,
  enableErrorBoundary,
}: {
  registry: any
  toolCall: { name: string; args?: Record<string, any> }
  result: any
  showHeader: boolean
  variant: 'default' | 'compact' | 'detailed'
  enableErrorBoundary: boolean
}) {
  const Component = registry[toolCall.name]

  if (!Component) {
    return (
      <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="text-sm font-semibold text-foreground">
            Unregistered Tool: {toolCall.name}
          </h4>
        </div>
        <pre className="text-xs overflow-auto scrollbar-hide max-h-64 bg-muted/50 p-3 rounded-md">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    )
  }

  const content = (
    <>
      {showHeader && (
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            Tool: {toolCall.name}
          </span>
        </div>
      )}
      <Component data={result} />
    </>
  )

  const wrapperClass = cn(
    variant === 'compact' && 'text-sm',
    variant === 'detailed' && 'p-2 border border-border/30 rounded-lg'
  )

  if (enableErrorBoundary) {
    return (
      <div className={wrapperClass}>
        <ErrorBoundaryWrapper toolName={toolCall.name}>
          {content}
        </ErrorBoundaryWrapper>
      </div>
    )
  }

  return <div className={wrapperClass}>{content}</div>
}

// Simple error boundary for demo
function ErrorBoundaryWrapper({
  children,
  toolName,
}: {
  children: React.ReactNode
  toolName: string
}) {
  const [hasError, setHasError] = React.useState(false)

  if (hasError) {
    return (
      <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h4 className="text-sm font-semibold text-destructive">
            Error rendering tool: {toolName}
          </h4>
        </div>
        <p className="text-xs text-muted-foreground">
          An error occurred while rendering this tool result.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export const revalidate = 3600

export default function ClarityToolResultPage() {
  const [activeDemo, setActiveDemo] = React.useState<'weather' | 'search' | 'calculator'>('weather')
  const [showHeader, setShowHeader] = React.useState(false)
  const [variant, setVariant] = React.useState<'default' | 'compact' | 'detailed'>('default')
  const [enableErrorBoundary, setEnableErrorBoundary] = React.useState(true)

  const registry = createDemoRegistry()

  const demoData = {
    weather: {
      toolCall: { name: 'get_weather', args: { location: 'San Francisco' } },
      result: {
        location: 'San Francisco, CA',
        temperature: 68,
        condition: 'Sunny',
        humidity: 65,
        windSpeed: 12,
        icon: 'sunny',
      },
    },
    search: {
      toolCall: { name: 'search_web', args: { query: 'AI best practices' } },
      result: {
        query: 'AI best practices',
        results: [
          {
            title: 'Top 10 AI Development Best Practices',
            snippet: 'Learn essential best practices for building production-ready AI applications...',
            url: 'https://example.com/ai-best-practices',
            relevance: 0.95,
          },
          {
            title: 'Security Guidelines for AI Systems',
            snippet: 'Comprehensive security guidelines for implementing AI in enterprise...',
            url: 'https://example.com/ai-security',
            relevance: 0.87,
          },
          {
            title: 'Optimizing AI Performance',
            snippet: 'Performance optimization techniques for AI models and applications...',
            url: 'https://example.com/ai-optimization',
            relevance: 0.82,
          },
        ],
        totalResults: 3,
      },
    },
    calculator: {
      toolCall: { name: 'calculate', args: { expression: '(1250 * 12) + 500' } },
      result: {
        operation: 'arithmetic',
        operands: [1250, 12, 500],
        result: 15500,
        formula: '(1,250 × 12) + 500 = 15,500',
      },
    },
  }

  const currentDemo = demoData[activeDemo]

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">ClarityToolResult</h1>
              <p className="text-sm text-muted-foreground mt-1">AI Tool Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Renders tool execution results using registered UI components with built-in security features, error boundaries, and customizable fallbacks.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="max-w-2xl mx-auto">
                <DemoClarityToolResult
                  registry={registry}
                  toolCall={currentDemo.toolCall}
                  result={currentDemo.result}
                  showHeader={showHeader}
                  variant={variant}
                  enableErrorBoundary={enableErrorBoundary}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Tool Type</label>
                <div className="flex flex-wrap gap-2">
                  {(['weather', 'search', 'calculator'] as const).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setActiveDemo(tool)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        activeDemo === tool
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Variant</label>
                <div className="flex flex-wrap gap-2">
                  {(['default', 'compact', 'detailed'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        variant === v
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeader}
                    onChange={(e) => setShowHeader(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Header</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableErrorBoundary}
                    onChange={(e) => setEnableErrorBoundary(e.target.checked)}
                    className="rounded"
                  />
                  <span>Enable Error Boundary</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Tool Result</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'

// Define custom UI component for weather tool
function WeatherUI({ data }) {
  return (
    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
      <h3 className="font-semibold">{data.location}</h3>
      <p className="text-2xl">{data.temperature}°F</p>
    </div>
  )
}

// Create tool registry
const registry = createToolUIRegistry({
  get_weather: WeatherUI,
})

function MyChat() {
  return (
    <ClarityToolResult
      registry={registry}
      toolCall={{ name: 'get_weather', args: { location: 'SF' } }}
      result={{ location: 'San Francisco', temperature: 68 }}
      messages={messages}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Custom Tool UI Components</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ToolComponentProps } from '@clarity-chat/react'

interface SearchData {
  query: string
  results: Array<{ title: string; url: string }>
}

function SearchResultsUI({ data }: ToolComponentProps<SearchData>) {
  return (
    <div className="space-y-2">
      <h3>Search: {data.query}</h3>
      {data.results.map((result, idx) => (
        <div key={idx} className="p-2 border rounded">
          <a href={result.url} className="text-blue-600">
            {result.title}
          </a>
        </div>
      ))}
    </div>
  )
}

const registry = createToolUIRegistry({
  search_web: SearchResultsUI,
  get_weather: WeatherUI,
  calculate: CalculatorUI,
})`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Tool Registry Setup</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import {
  createToolUIRegistry,
  validateToolRegistry,
  getRegistryStats
} from '@clarity-chat/react'

// Create registry with multiple tools
const registry = createToolUIRegistry({
  get_weather: WeatherUI,
  search_web: SearchUI,
  calculate: CalculatorUI,
  get_stock_price: StockPriceUI,
})

// Validate registry (development mode)
const validation = validateToolRegistry(registry)
if (!validation.valid) {
  console.error('Registry validation errors:', validation.errors)
}

// Get registry statistics
const stats = getRegistryStats(registry)
console.log(\`Registered \${stats.totalTools} tools\`)
// Output: "Registered 4 tools"

// Use in component
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Error Handling with Fallback</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// Custom error fallback component
function ToolErrorFallback({ error, toolCall }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h4 className="font-semibold text-red-900">
        Error in {toolCall.name}
      </h4>
      <p className="text-sm text-red-700">{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  )
}

// Custom fallback for unregistered tools
function UnregisteredToolFallback({ toolCall, result }) {
  return (
    <div className="p-4 bg-amber-50 border rounded-lg">
      <p className="text-sm text-amber-900">
        No UI component registered for: {toolCall.name}
      </p>
      <details className="mt-2">
        <summary className="cursor-pointer">View raw data</summary>
        <pre className="text-xs mt-2 overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  )
}

// Use custom fallbacks
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
  enableErrorBoundary={true}
  errorFallback={ToolErrorFallback}
  fallback={UnregisteredToolFallback}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Message Context</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// Tool component with access to message history
function ContextAwareToolUI({
  data,
  messages,
  toolCall
}: ToolComponentProps) {
  // Access conversation context
  const previousMessages = messages.slice(0, -1)
  const userContext = previousMessages
    .filter(m => m.role === 'user')
    .map(m => m.content)

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        Based on your conversation about: {userContext.join(', ')}
      </div>
      <div className="p-4 border rounded-lg">
        {/* Render tool result with context */}
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  )
}

<ClarityToolResult
  registry={{ smart_tool: ContextAwareToolUI }}
  toolCall={{ name: 'smart_tool' }}
  result={result}
  messages={conversationMessages}
  showHeader={true}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>registry</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ToolComponentRegistry</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Registry mapping tool names to React components
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>toolCall</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ClarityToolCall</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Tool call information (name, args, id)
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>result</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">unknown</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Tool execution result data
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>messages</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">CoreMessage[]</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    All messages in conversation for context
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>fallback</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    ComponentType&lt;Props&gt;
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">DefaultToolResult</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Fallback component for unregistered tools
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>componentProps</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Record&lt;string, unknown&gt;
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{'{}'}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Additional props passed to tool component
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showHeader</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Show tool name header above result
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Custom CSS classes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>enableErrorBoundary</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Wrap component in error boundary
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>errorFallback</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    ComponentType&lt;ErrorProps&gt;
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    Custom error fallback component
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Type Definitions
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p>
                <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">
                  ClarityToolCall
                </code>
                : {'{}'} name: string, args?: Record&lt;string, unknown&gt;, id?: string {'}'}
              </p>
              <p>
                <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded">
                  ToolComponentProps&lt;TData&gt;
                </code>
                : {'{}'} data: TData, messages: CoreMessage[], toolCall?: {'{}'} name: string,
                args: Record&lt;string, any&gt; {'}'} {'}'}
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Type-Safe Registry</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Type-safe tool component registry with automatic component resolution by tool name
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Built-in Security</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                XSS prevention with DOMPurify sanitization and HTML escaping for all tool data
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Error Boundaries</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatic error boundary wrapping with customizable error fallback components
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Smart Fallbacks</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatic fallback rendering for unregistered tools with JSON preview
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 className="font-semibold">Message Context</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Tool components receive full conversation context for context-aware rendering
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold">Registry Validation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Runtime registry validation with detailed error reporting for development
              </p>
            </motion.div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/tool-approval"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ToolApproval</h3>
              <p className="text-sm text-muted-foreground">
                User approval workflow for tool execution
              </p>
            </Link>

            <Link
              href="/reference/components/tool-card"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ToolCard</h3>
              <p className="text-sm text-muted-foreground">
                Display tool metadata and execution status
              </p>
            </Link>

            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">
                Real-time streaming message display with tool results
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
