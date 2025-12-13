/**
 * Model Comparison Panel Component
 * Premium model comparison with visual charts and insights
 * React 19 component using useOptimistic for real-time comparisons
 */

'use client'

import * as React from 'react'
import { useModelComparison } from '../hooks/use-model-comparison'
import type {
  ModelResponse,
  ComparisonResult,
} from '../../compare/model-comparison'

export interface ModelComparisonPanelProps {
  /** Additional CSS classes */
  className?: string
  /** Initial prompt ID */
  promptId?: string
  /** Show visual comparison charts */
  showCharts?: boolean
  /** Enable cost tracking */
  enableCostTracking?: boolean
}

/**
 * Icons for the comparison panel
 */
const Icons = {
  Scale: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
      <path d="m15 9 6-6" />
    </svg>
  ),
  Zap: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  DollarSign: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Hash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Trophy: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Lightbulb: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  BarChart: () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
}

/**
 * Model Comparison Panel Component
 * Displays model comparison results with optimistic updates
 */
export function ModelComparisonPanel({
  className,
  promptId,
  showCharts = true,
  enableCostTracking = true,
}: ModelComparisonPanelProps) {
  const {
    addResponse,
    compare,
    clear,
    getComparison,
    getResponses,
    allComparisons,
    stats,
  } = useModelComparison()

  const [prompt, setPrompt] = React.useState('')
  const [currentPromptId, setCurrentPromptId] = React.useState(
    promptId || 'prompt-1'
  )
  const [isComparing, setIsComparing] = React.useState(false)

  const comparison = promptId
    ? getComparison(promptId)
    : getComparison(currentPromptId)
  const responses = promptId
    ? getResponses(promptId)
    : getResponses(currentPromptId)

  const handleCompare = React.useCallback(async () => {
    if (prompt) {
      setIsComparing(true)
      try {
        compare(currentPromptId, prompt)
      } finally {
        setIsComparing(false)
      }
    }
  }, [compare, currentPromptId, prompt])

  const handleClear = React.useCallback(() => {
    clear(currentPromptId)
  }, [clear, currentPromptId])

  // Calculate max values for bar chart scaling
  const maxLatency = comparison?.responses.length
    ? Math.max(...comparison.responses.map((r) => r.metadata.latency))
    : 1
  const maxCost = comparison?.responses.length
    ? Math.max(...comparison.responses.map((r) => r.metadata.cost))
    : 1
  const maxTokens = comparison?.responses.length
    ? Math.max(...comparison.responses.map((r) => r.metadata.totalTokens))
    : 1

  return (
    <div
      className={`model-comparison-panel ${className || ''}`}
      data-testid="model-comparison-panel"
    >
      {/* Header */}
      <header className="comparison-header">
        <h2>
          <Icons.Scale />
          Model Comparison
        </h2>
        <div className="comparison-controls">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt to compare models..."
            className="prompt-input"
            aria-label="Prompt for model comparison"
          />
          <button
            className="dt-btn dt-btn-primary"
            onClick={handleCompare}
            disabled={!prompt || isComparing}
          >
            {isComparing ? (
              <>
                <span className="loading-spinner small" />
                Comparing...
              </>
            ) : (
              <>
                <Icons.Scale />
                Compare
              </>
            )}
          </button>
          <button
            className="dt-btn dt-btn-ghost dt-btn-icon"
            onClick={handleClear}
            aria-label="Clear comparison"
            title="Clear"
          >
            <Icons.Trash />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      {stats.totalPrompts > 0 && (
        <div
          className="comparison-stats"
          role="region"
          aria-label="Comparison statistics"
        >
          <div className="stat">
            <span className="stat-label">Prompts</span>
            <span className="stat-value">{stats.totalPrompts}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Responses</span>
            <span className="stat-value">{stats.totalResponses}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg Latency</span>
            <span className="stat-value">
              {stats.averageLatency.toFixed(0)}ms
            </span>
          </div>
          {enableCostTracking && (
            <div className="stat">
              <span className="stat-label">Total Cost</span>
              <span className="stat-value">${stats.totalCost.toFixed(4)}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="comparison-content">
        {comparison ? (
          <ComparisonResults
            comparison={comparison}
            showCharts={showCharts}
            enableCostTracking={enableCostTracking}
            maxLatency={maxLatency}
            maxCost={maxCost}
            maxTokens={maxTokens}
          />
        ) : responses.length > 0 ? (
          <div className="responses-preview">
            <h3>Collected Responses ({responses.length})</h3>
            <p className="responses-hint">
              Enter a prompt and click Compare to analyze these responses.
            </p>
            <div className="responses-grid">
              {responses.map((response, i) => (
                <ResponseCard key={i} response={response} compact />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Previous Comparisons */}
      {allComparisons.length > 1 && (
        <div
          className="previous-comparisons"
          role="region"
          aria-label="Previous comparisons"
        >
          <h3>Previous Comparisons</h3>
          <div className="comparisons-list">
            {allComparisons
              .filter((c) => c.prompt !== comparison?.prompt)
              .slice(0, 3)
              .map((comp, i) => (
                <ComparisonSummary key={i} comparison={comp} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        <Icons.BarChart />
      </div>
      <h3 className="empty-state-title">No comparisons yet</h3>
      <p className="empty-state-description">
        Enter a prompt and compare model responses to see insights on latency,
        cost, and quality across different AI models.
      </p>
    </div>
  )
}

/**
 * Comparison results component
 */
interface ComparisonResultsProps {
  comparison: ComparisonResult
  showCharts: boolean
  enableCostTracking: boolean
  maxLatency: number
  maxCost: number
  maxTokens: number
}

function ComparisonResults({
  comparison,
  showCharts,
  enableCostTracking,
  maxLatency,
  maxCost,
  maxTokens,
}: ComparisonResultsProps) {
  return (
    <div className="comparison-results">
      {/* Analysis Summary */}
      <div className="analysis-section">
        <h3>Analysis Summary</h3>
        <div className="analysis-grid">
          <AnalysisCard
            icon={<Icons.Zap />}
            label="Fastest"
            value={comparison.analysis.fastest}
            highlight="success"
          />
          {enableCostTracking && (
            <AnalysisCard
              icon={<Icons.DollarSign />}
              label="Most Affordable"
              value={comparison.analysis.cheapest}
              highlight="primary"
            />
          )}
          <AnalysisCard
            icon={<Icons.Hash />}
            label="Most Tokens"
            value={comparison.analysis.mostTokens}
            highlight="warning"
          />
          <AnalysisCard
            icon={<Icons.Clock />}
            label="Avg Latency"
            value={`${comparison.analysis.averageLatency.toFixed(0)}ms`}
          />
          {enableCostTracking && (
            <AnalysisCard
              icon={<Icons.DollarSign />}
              label="Total Cost"
              value={`$${comparison.analysis.totalCost.toFixed(4)}`}
            />
          )}
        </div>
      </div>

      {/* Recommendations */}
      {comparison.analysis.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>
            <Icons.Lightbulb />
            Recommendations
          </h3>
          <ul className="recommendations-list">
            {comparison.analysis.recommendations.map((rec, i) => (
              <li key={i} className="recommendation-item">
                <Icons.ArrowRight />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Visual Comparison Charts */}
      {showCharts && comparison.responses.length > 1 && (
        <div className="charts-section">
          <h3>Visual Comparison</h3>
          <div className="charts-grid">
            <ComparisonChart
              title="Latency"
              responses={comparison.responses}
              getValue={(r) => r.metadata.latency}
              maxValue={maxLatency}
              formatValue={(v) => `${v.toFixed(0)}ms`}
              colorClass="latency"
              winner={comparison.analysis.fastest}
            />
            {enableCostTracking && (
              <ComparisonChart
                title="Cost"
                responses={comparison.responses}
                getValue={(r) => r.metadata.cost}
                maxValue={maxCost}
                formatValue={(v) => `$${v.toFixed(4)}`}
                colorClass="cost"
                winner={comparison.analysis.cheapest}
                lowerIsBetter
              />
            )}
            <ComparisonChart
              title="Tokens"
              responses={comparison.responses}
              getValue={(r) => r.metadata.totalTokens}
              maxValue={maxTokens}
              formatValue={(v) => v.toLocaleString()}
              colorClass="tokens"
              winner={comparison.analysis.mostTokens}
            />
          </div>
        </div>
      )}

      {/* Response Cards */}
      <div className="responses-section">
        <h3>Responses ({comparison.responses.length})</h3>
        <div className="responses-grid">
          {comparison.responses.map((response, i) => (
            <ResponseCard
              key={i}
              response={response}
              isFastest={
                `${response.provider}/${response.model}` ===
                comparison.analysis.fastest
              }
              isCheapest={
                `${response.provider}/${response.model}` ===
                comparison.analysis.cheapest
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Analysis card component
 */
interface AnalysisCardProps {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: 'success' | 'primary' | 'warning'
}

function AnalysisCard({ icon, label, value, highlight }: AnalysisCardProps) {
  return (
    <div className={`analysis-card ${highlight || ''}`}>
      <div className="analysis-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="analysis-content">
        <span className="analysis-label">{label}</span>
        <span className="analysis-value">{value}</span>
      </div>
    </div>
  )
}

/**
 * Comparison chart component
 */
interface ComparisonChartProps {
  title: string
  responses: ModelResponse[]
  getValue: (response: ModelResponse) => number
  maxValue: number
  formatValue: (value: number) => string
  colorClass: string
  winner: string
  lowerIsBetter?: boolean
}

function ComparisonChart({
  title,
  responses,
  getValue,
  maxValue,
  formatValue,
  colorClass,
  winner,
  lowerIsBetter = false,
}: ComparisonChartProps) {
  return (
    <div className="comparison-chart">
      <h4>{title}</h4>
      <div className="chart-bars">
        {responses.map((response, i) => {
          const value = getValue(response)
          const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0
          const modelName = `${response.provider}/${response.model}`
          const isWinner = modelName === winner

          return (
            <div
              key={i}
              className={`chart-bar-item ${isWinner ? 'winner' : ''}`}
            >
              <div className="bar-label">
                <span className="model-name">{response.model}</span>
                {isWinner && (
                  <span className="winner-badge">
                    <Icons.Trophy />
                  </span>
                )}
              </div>
              <div className="bar-container">
                <div
                  className={`bar-fill ${colorClass}`}
                  style={{ width: `${barWidth}%` }}
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={maxValue}
                />
              </div>
              <span className="bar-value">{formatValue(value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Response card component
 */
interface ResponseCardProps {
  response: ModelResponse
  compact?: boolean
  isFastest?: boolean
  isCheapest?: boolean
}

function ResponseCard({
  response,
  compact = false,
  isFastest,
  isCheapest,
}: ResponseCardProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <article className={`response-card ${compact ? 'compact' : ''}`}>
      <header className="response-header">
        <div className="response-model">
          <span className={`provider-badge ${response.provider.toLowerCase()}`}>
            {response.provider}
          </span>
          <span className="model-name">{response.model}</span>
        </div>
        <div className="response-badges">
          {isFastest && (
            <span className="badge badge-success" title="Fastest response">
              <Icons.Zap /> Fastest
            </span>
          )}
          {isCheapest && (
            <span className="badge badge-primary" title="Most affordable">
              <Icons.DollarSign /> Cheapest
            </span>
          )}
        </div>
      </header>

      <div className="response-metrics">
        <div className="metric">
          <Icons.Clock />
          <span>{response.metadata.latency.toFixed(0)}ms</span>
        </div>
        <div className="metric">
          <Icons.Hash />
          <span>{response.metadata.totalTokens.toLocaleString()} tokens</span>
        </div>
        <div className="metric">
          <Icons.DollarSign />
          <span>${response.metadata.cost.toFixed(4)}</span>
        </div>
      </div>

      {!compact && (
        <>
          <div className={`response-content ${expanded ? 'expanded' : ''}`}>
            <p>{response.content}</p>
          </div>
          {response.content.length > 200 && (
            <button
              className="expand-button"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </>
      )}

      <footer className="response-footer">
        <span className="timestamp">
          {response.timestamp.toLocaleTimeString()}
        </span>
      </footer>
    </article>
  )
}

/**
 * Comparison summary component (for previous comparisons)
 */
interface ComparisonSummaryProps {
  comparison: ComparisonResult
}

function ComparisonSummary({ comparison }: ComparisonSummaryProps) {
  return (
    <div className="comparison-summary">
      <div className="summary-prompt">
        {comparison.prompt.substring(0, 60)}
        {comparison.prompt.length > 60 ? '...' : ''}
      </div>
      <div className="summary-results">
        <span className="summary-badge fastest">
          <Icons.Zap /> {comparison.analysis.fastest.split('/')[1]}
        </span>
        <span className="summary-badge cheapest">
          <Icons.DollarSign /> {comparison.analysis.cheapest.split('/')[1]}
        </span>
      </div>
    </div>
  )
}
