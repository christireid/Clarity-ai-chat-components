/**
 * Model Comparison Panel Component
 * React 19 component using useOptimistic for real-time comparisons
 */

'use client'

import * as React from 'react'
import { useModelComparison } from '../hooks/use-model-comparison'
import type { ModelResponse, ComparisonResult } from '../../compare/model-comparison'

export interface ModelComparisonPanelProps {
  className?: string
  promptId?: string
}

/**
 * Model Comparison Panel Component
 * Displays model comparison results with optimistic updates
 */
export function ModelComparisonPanel({ className, promptId }: ModelComparisonPanelProps) {
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
  const [currentPromptId, setCurrentPromptId] = React.useState(promptId || 'prompt-1')
  const comparison = promptId ? getComparison(promptId) : getComparison(currentPromptId)
  const responses = promptId ? getResponses(promptId) : getResponses(currentPromptId)

  const handleAddResponse = React.useCallback((response: ModelResponse) => {
    addResponse(currentPromptId, response)
  }, [addResponse, currentPromptId])

  const handleCompare = React.useCallback(() => {
    if (prompt) {
      compare(currentPromptId, prompt)
    }
  }, [compare, currentPromptId, prompt])

  const handleClear = React.useCallback(() => {
    clear(currentPromptId)
  }, [clear, currentPromptId])

  return (
    <div className={className} data-testid="model-comparison-panel">
      <div className="comparison-header">
        <h2>Model Comparison</h2>
        <div className="comparison-controls">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt..."
            className="prompt-input"
          />
          <button onClick={handleCompare} disabled={!prompt}>
            Compare
          </button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      {stats.totalPrompts > 0 && (
        <div className="comparison-stats">
          <div className="stat">
            <span className="stat-label">Total Prompts:</span>
            <span className="stat-value">{stats.totalPrompts}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Responses:</span>
            <span className="stat-value">{stats.totalResponses}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg Latency:</span>
            <span className="stat-value">{stats.averageLatency.toFixed(2)}ms</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Cost:</span>
            <span className="stat-value">${stats.totalCost.toFixed(4)}</span>
          </div>
        </div>
      )}

      {comparison ? (
        <div className="comparison-results">
          <h3>Comparison Results</h3>
          <div className="analysis">
            <div className="analysis-item">
              <span>Fastest:</span>
              <span>{comparison.analysis.fastest}</span>
            </div>
            <div className="analysis-item">
              <span>Cheapest:</span>
              <span>{comparison.analysis.cheapest}</span>
            </div>
            <div className="analysis-item">
              <span>Most Tokens:</span>
              <span>{comparison.analysis.mostTokens}</span>
            </div>
            <div className="analysis-item">
              <span>Average Latency:</span>
              <span>{comparison.analysis.averageLatency.toFixed(2)}ms</span>
            </div>
            <div className="analysis-item">
              <span>Total Cost:</span>
              <span>${comparison.analysis.totalCost.toFixed(4)}</span>
            </div>
          </div>

          {comparison.analysis.recommendations.length > 0 && (
            <div className="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                {comparison.analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="responses-list">
            <h4>Responses ({comparison.responses.length}):</h4>
            {comparison.responses.map((response, i) => (
              <ResponseCard key={i} response={response} />
            ))}
          </div>
        </div>
      ) : responses.length > 0 ? (
        <div className="responses-list">
          <h3>Responses ({responses.length})</h3>
          {responses.map((response, i) => (
            <ResponseCard key={i} response={response} />
          ))}
          <button onClick={handleCompare} disabled={!prompt}>
            Compare Responses
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <p>No responses yet. Add responses to compare models.</p>
        </div>
      )}

      {allComparisons.length > 0 && (
        <div className="all-comparisons">
          <h3>All Comparisons ({allComparisons.length})</h3>
          {allComparisons.map((comp, i) => (
            <div key={i} className="comparison-summary">
              <h4>{comp.prompt.substring(0, 50)}...</h4>
              <p>Fastest: {comp.analysis.fastest} | Cheapest: {comp.analysis.cheapest}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ResponseCardProps {
  response: ModelResponse
}

function ResponseCard({ response }: ResponseCardProps) {
  return (
    <div className="response-card">
      <div className="response-header">
        <span className="model-name">{response.provider}/{response.model}</span>
        <span className="timestamp">{response.timestamp.toLocaleTimeString()}</span>
      </div>
      <div className="response-content">{response.content}</div>
      <div className="response-metadata">
        <span>Tokens: {response.metadata.totalTokens}</span>
        <span>Latency: {response.metadata.latency.toFixed(2)}ms</span>
        <span>Cost: ${response.metadata.cost.toFixed(4)}</span>
      </div>
    </div>
  )
}
