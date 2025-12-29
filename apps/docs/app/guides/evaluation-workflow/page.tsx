import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Evaluation Workflow Guide - Clarity Chat Components',
  description:
    'Learn how to set up evaluation workflows for AI systems, including metrics, quality checks, and continuous monitoring.',
}

export default function EvaluationWorkflowPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Evaluation Workflow</h1>
        <p className="docs-lead">
          Learn how to set up evaluation workflows for AI systems, including
          metrics, quality checks, trend tracking, and continuous monitoring.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up evaluation metrics',
          'Run quality checks',
          'Track trends over time',
          'Monitor system performance',
          'Automate evaluations',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Evaluation workflows help you monitor and improve AI system
          performance over time.
        </p>
      </section>

      <section className="docs-section">
        <h2>Evaluation Dashboard</h2>
        <p>Set up evaluation dashboard:</p>
        <CodePlayground
          initialCode={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function EvaluationSetup() {
  const [results, setResults] = useState([])

  return (
    <EvaluationDashboard
      results={results}
      metrics={{
        accuracy: 0.92,
        latency: 1200,
        tokenUsage: 1500,
        cost: 0.05,
      }}
      onQualityCheck={(result) => {
        return result.score > 0.8
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Quality Metrics</h2>
        <p>Define quality metrics:</p>
        <CodePlayground
          initialCode={`interface QualityMetrics {
  accuracy: number
  latency: number
  tokenUsage: number
  cost: number
  relevance: number
  completeness: number
}

function calculateMetrics(results: TestResult[]): QualityMetrics {
  return {
    accuracy: calculateAccuracy(results),
    latency: calculateAverageLatency(results),
    tokenUsage: calculateTotalTokens(results),
    cost: calculateTotalCost(results),
    relevance: calculateRelevance(results),
    completeness: calculateCompleteness(results),
  }
}

function calculateAccuracy(results: TestResult[]): number {
  const correct = results.filter(r => r.passed).length
  return correct / results.length
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Trend Tracking</h2>
        <p>Track trends over time:</p>
        <CodePlayground
          initialCode={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function TrendTracking() {
  const [trends, setTrends] = useState([])

  useEffect(() => {
    // Fetch historical data
    fetchEvaluationHistory().then(data => {
      setTrends(data)
    })
  }, [])

  return (
    <EvaluationDashboard
      results={currentResults}
      trends={trends}
      onTrendAnalysis={(trend) => {
        if (trend.direction === 'down') {
          logger.warn('Quality declining:', trend)
        }
      }}
    />
  )
}

async function fetchEvaluationHistory() {
  const response = await fetch('/api/evaluations/history')
  return response.json()
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Automated Evaluation</h2>
        <p>Automate evaluation workflows:</p>
        <CodePlayground
          initialCode={`// Scheduled evaluation
import { runEvaluation } from '@clarity-chat/react/evaluation'

async function scheduledEvaluation() {
  const results = await runEvaluation({
    dataset: testDataset,
    prompt: currentPrompt,
    metrics: ['accuracy', 'latency', 'cost'],
  })

  // Check thresholds
  if (results.accuracy < 0.9) {
    await sendAlert('Accuracy below threshold')
  }

  // Store results
  await storeEvaluationResults(results)

  return results
}

// Run daily
setInterval(scheduledEvaluation, 24 * 60 * 60 * 1000)`}
        />
      </section>

      <section className="docs-section">
        <h2>Quality Checks</h2>
        <p>Implement quality checks:</p>
        <CodePlayground
          initialCode={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function QualityChecks() {
  return (
    <EvaluationDashboard
      results={results}
      onQualityCheck={(result) => {
        // Check multiple criteria
        const checks = {
          accuracy: result.accuracy > 0.8,
          latency: result.latency < 2000,
          relevance: result.relevance > 0.7,
          completeness: result.completeness > 0.8,
        }

        return Object.values(checks).every(check => check)
      }}
      onQualityAlert={(alert) => {
        // Send alert if quality drops
        if (alert.severity === 'high') {
          sendAlert(alert)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Define clear quality metrics</li>
          <li>Track trends over time</li>
          <li>Set quality thresholds</li>
          <li>Automate evaluations</li>
          <li>Monitor system performance</li>
          <li>Alert on quality degradation</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/evaluation-dashboard">
              EvaluationDashboard
            </a>{' '}
            - Evaluation dashboard
          </li>
          <li>
            <a href="/guides/prompt-testing">Prompt Testing</a> - Prompt testing
            guide
          </li>
        </ul>
      </section>
    </div>
  )
}
