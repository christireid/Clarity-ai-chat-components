import { logger } from '@clarity-chat/utils/logger';
import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Shield,
  Eye,
  Layers,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { ToolCallingShowcase } from './components/ToolCallingShowcase'
import { Component, type ReactNode, type ErrorInfo } from 'react'

// ============================================================================
// Top-Level Error Boundary
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ShowcaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ShowcaseErrorBoundary caught error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-[700px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-red-200 dark:border-red-800 overflow-hidden shadow-xl flex items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              The demo encountered an unexpected error.
            </p>
            {this.state.error && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              aria-label="Retry loading the demo"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export const metadata: Metadata = {
  title: 'Advanced Tool Calling Showcase | Clarity Chat',
  description:
    'Interactive demo showcasing multi-step tool chains, generative UI, and human-in-the-loop patterns with AI.',
}

export default function ToolCallingShowcasePage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/25">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Advanced Tool Calling</h1>
            <p className="text-xl text-text-secondary">
              The AI isn't just chatting — it's orchestrating. Watch it call tools, render
              interactive UI, and ask for your approval on critical actions.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm font-medium">
            Generative UI
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full text-sm">
            Human-in-the-Loop
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
            Multi-Step Chains
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
            Glass Box Debugging
          </span>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800">
            <GitBranch className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-semibold mb-1">Tool Chains</h3>
            <p className="text-sm text-text-secondary">
              AI calls Tool A, analyzes result, then decides to call Tool B
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800">
            <Layers className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-semibold mb-1">Generative UI</h3>
            <p className="text-sm text-text-secondary">
              Tool calls render live React components, not just JSON
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200 dark:border-amber-800">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
            <h3 className="font-semibold mb-1">Human-in-the-Loop</h3>
            <p className="text-sm text-text-secondary">
              Critical actions require your explicit approval
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200 dark:border-blue-800">
            <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="font-semibold mb-1">Glass Box Debug</h3>
            <p className="text-sm text-text-secondary">
              See the AI's thought process in real-time
            </p>
          </div>
        </div>

        {/* Live Demo */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-500" />
            <h2 className="text-2xl font-bold">Live Demo</h2>
          </div>
          <ShowcaseErrorBoundary>
            <ToolCallingShowcase />
          </ShowcaseErrorBoundary>
        </div>

        {/* How It Works */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <h2>How It Works</h2>

          <h3>1. Multi-Step Tool Chains</h3>
          <p>
            When you ask "Analyze Apple stock", the AI doesn't just call one tool. It orchestrates a
            chain:
          </p>
          <ol>
            <li>
              <strong>search_ticker</strong> → Finds the correct symbol (AAPL)
            </li>
            <li>
              <strong>get_financials</strong> → Fetches price, P/E ratio, market cap
            </li>
            <li>
              <strong>render_chart</strong> → Generates an interactive price chart
            </li>
          </ol>
          <p>
            Each step builds on the previous one. The AI analyzes results and decides what to do
            next.
          </p>

          <h3>2. Generative UI</h3>
          <p>
            Instead of returning raw JSON, each tool renders a custom React component. This is the
            heart of "Generative UI":
          </p>
          <pre className="bg-surface-muted p-4 rounded-lg text-sm">
            <code>{`// Tool Registry maps tool names to React components
const registry = createToolUIRegistry({
  search_ticker: TickerSearchCard,
  get_financials: StockAnalysisCard,
  render_chart: InteractiveStockChart,
  execute_trade: TradeConfirmationModal,
})`}</code>
          </pre>

          <h3>3. Human-in-the-Loop</h3>
          <p>
            Some actions are too important to execute automatically. When you say "Buy 10 shares of
            AAPL", the AI:
          </p>
          <ol>
            <li>Detects this is a "critical tool" (execute_trade)</li>
            <li>Pauses and shows a confirmation modal</li>
            <li>Waits for your explicit Approve/Reject</li>
            <li>Only then executes the trade</li>
          </ol>

          <h3>4. Glass Box Debugging</h3>
          <p>
            The debug panel at the bottom shows every event in real-time:
          </p>
          <ul>
            <li>User messages and AI responses</li>
            <li>Tool calls with full argument payloads</li>
            <li>Tool results and execution times</li>
            <li>Approval requests and user decisions</li>
          </ul>
          <p>
            This "glass box" transparency is crucial for developers building with AI — you need to
            see exactly what's happening under the hood.
          </p>
        </div>

        {/* Tools Used */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Tools in This Demo</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: 'search_ticker',
                icon: '🔍',
                description: 'Search for stock ticker symbols by company name',
                args: 'query, limit',
              },
              {
                name: 'get_financials',
                icon: '📊',
                description: 'Get detailed financial data for a stock',
                args: 'symbol, metrics, includeHistory',
              },
              {
                name: 'render_chart',
                icon: '📈',
                description: 'Render an interactive price chart',
                args: 'symbol, chartType, timeframe, indicators',
              },
              {
                name: 'execute_trade',
                icon: '💰',
                description: 'Execute a buy/sell trade (requires approval)',
                args: 'symbol, action, quantity, orderType',
              },
            ].map((tool) => (
              <div
                key={tool.name}
                className="p-4 rounded-xl border border-border bg-surface-elevated"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{tool.icon}</span>
                  <code className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {tool.name}
                  </code>
                  {tool.name === 'execute_trade' && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
                      Requires Approval
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">{tool.description}</p>
                <p className="text-xs text-muted-foreground">
                  Args: <code>{tool.args}</code>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <h2>Key Implementation Details</h2>

          <h3>State Machine</h3>
          <pre className="bg-surface-muted p-4 rounded-lg text-sm">
            <code>{`type OrchestratorState =
  | 'idle'              // Waiting for user input
  | 'streaming'         // AI is generating response
  | 'tool_pending'      // Tool call detected, preparing
  | 'awaiting_approval' // Critical tool needs user OK
  | 'executing_tool'    // Tool is running
  | 'completed'         // Done with current request`}</code>
          </pre>

          <h3>Critical Tool Detection</h3>
          <pre className="bg-surface-muted p-4 rounded-lg text-sm">
            <code>{`const CRITICAL_TOOLS = ['execute_trade'] as const

// In the orchestrator:
if (CRITICAL_TOOLS.includes(toolCall.name)) {
  setOrchestratorState('awaiting_approval')
  setPendingApproval(toolCall)
  // Render confirmation modal instead of executing
}`}</code>
          </pre>
        </div>

        {/* Why This Matters */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why This Matters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Beyond Chatbots</h4>
                <p className="text-sm text-text-secondary">
                  This isn't a chatbot — it's an AI-powered application that can perform real
                  actions in the world.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Trust Through Transparency</h4>
                <p className="text-sm text-text-secondary">
                  The glass box debug panel builds user trust by showing exactly what the AI is
                  doing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Safety First</h4>
                <p className="text-sm text-text-secondary">
                  Human-in-the-loop ensures critical actions always have human oversight.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 border border-brand-200 dark:border-brand-800">
          <h3 className="text-2xl font-bold mb-4">Build Your Own AI-Powered App</h3>
          <p className="text-text-secondary mb-6">
            This demo showcases what's possible with Clarity Chat's tool calling infrastructure.
            Start building your own intelligent applications today.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/learn/quick-start"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Get Started →
            </Link>
            <Link
              href="/reference/components/clarity-tool-result"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Tool API Reference
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
