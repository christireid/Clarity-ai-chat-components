import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Response Quality Meter - Clarity Chat Components',
  description: 'Visualize AI response quality metrics like groundedness, coverage, and confidence scores.',
}

export default function ResponseQualityMeterPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Response Quality Meter</h1>
        <p className="docs-lead">
          Show how good the AI's answer was. Like a report card for each response - is it grounded in facts? Did it cover everything? How confident is it?
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          When you evaluate AI responses (using tools like LangSmith, Braintrust, or custom scoring), this component displays those scores in a beautiful, easy-to-understand way.
        </p>
        
        <Callout type="info" title="What Are Quality Metrics?">
          AI evaluation tools measure things like: Is the answer based on real data (groundedness)?
          Did it answer the full question (coverage)? How confident is the AI? This shows those scores.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function SimpleQuality() {
  const metrics = [
    {
      id: '1',
      label: 'Groundedness',
      score: 0.92,
      description: 'Based on source documents'
    },
    {
      id: '2',
      label: 'Coverage',
      score: 0.88,
      description: 'Answered all parts of question'
    },
    {
      id: '3',
      label: 'Confidence',
      score: 0.85,
      description: 'AI certainty in response'
    }
  ]

  return (
    <ResponseQualityMeter
      metrics={metrics}
      overallScore={0.88}
    />
  )
}

render(<SimpleQuality />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Targets</h2>
        <p>
          Show target thresholds to highlight metrics that need improvement.
        </p>
        <CodePlayground
          initialCode={`function MetricsWithTargets() {
  const metrics = [
    {
      id: '1',
      label: 'Factual Accuracy',
      score: 0.95,
      target: 0.90,
      description: 'Verified against knowledge base'
    },
    {
      id: '2',
      label: 'Completeness',
      score: 0.72,
      target: 0.85,
      description: 'Below target - missing details'
    },
    {
      id: '3',
      label: 'Relevance',
      score: 0.88,
      target: 0.80,
      description: 'On-topic and helpful'
    },
    {
      id: '4',
      label: 'Safety',
      score: 0.98,
      target: 0.95,
      description: 'No harmful content detected'
    }
  ]

  return (
    <ResponseQualityMeter
      metrics={metrics}
      overallScore={0.88}
      title="AI Response Evaluation"
      subtitle="Automated quality checks"
    />
  )
}

render(<MetricsWithTargets />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Real-World: RAG Quality Dashboard</h2>
        <CodePlayground
          initialCode={`import { useState, useEffect } from 'react'

function RAGQualityDashboard() {
  const [metrics, setMetrics] = useState([])
  const [overall, setOverall] = useState(0)

  // Simulate evaluation pipeline
  useEffect(() => {
    setTimeout(() => {
      setMetrics([
        {
          id: '1',
          label: 'Source Groundedness',
          score: 0.94,
          target: 0.90,
          description: '15 of 16 claims verified in sources'
        },
        {
          id: '2',
          label: 'Query Coverage',
          score: 0.89,
          target: 0.85,
          description: 'Addressed 3 of 3 sub-questions'
        },
        {
          id: '3',
          label: 'Hallucination Check',
          score: 0.96,
          target: 0.95,
          description: 'No unsupported claims detected'
        },
        {
          id: '4',
          label: 'Citation Accuracy',
          score: 0.87,
          target: 0.80,
          description: 'All citations have valid sources'
        }
      ])
      setOverall(0.91)
    }, 1000)
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">Overall</div>
          <div className="text-2xl font-bold text-success">
            {(overall * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">Passed</div>
          <div className="text-2xl font-bold">
            {metrics.filter(m => m.score >= (m.target || 0)).length}/{metrics.length}
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground">Checks</div>
          <div className="text-2xl font-bold">{metrics.length}</div>
        </div>
      </div>

      <ResponseQualityMeter
        metrics={metrics}
        overallScore={overall}
        title="Response Quality Report"
        subtitle="Evaluation metrics from your RAG pipeline"
      />
    </div>
  )
}

render(<RAGQualityDashboard />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="ResponseQualityMeter Props" data={qualityProps} />
      </section>

      <section className="docs-section">
        <h2>Integration Example</h2>
        <pre><code>{`// Integrate with LangSmith evaluation
import { ResponseQualityMeter } from '@clarity-chat/react'
import { evaluate } from 'langsmith'

async function evaluateResponse(response: string, context: string) {
  const results = await evaluate(response, {
    criteria: ['groundedness', 'coverage', 'safety'],
    context
  })

  const metrics = results.map(r => ({
    id: r.id,
    label: r.name,
    score: r.score,
    target: r.threshold,
    description: r.explanation
  }))

  return { metrics, overall: results.averageScore }
}

// In your component
const { metrics, overall } = await evaluateResponse(aiResponse, docs)

return (
  <ResponseQualityMeter
    metrics={metrics}
    overallScore={overall}
  />
)`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Show metrics after AI responses in admin/debug mode</li>
          <li>Use 3-6 key metrics (too many is overwhelming)</li>
          <li>Set realistic targets based on your use case</li>
          <li>Highlight metrics below target for quick scanning</li>
          <li>Include descriptions to explain what each metric means</li>
        </ul>

        <Callout type="tip" title="When to Show This">
          Great for admin dashboards, quality monitoring, and debugging. Don't show
          to end users - they just want answers, not technical scores.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/usage-dashboard" className="docs-card">
            <h3>Usage Dashboard</h3>
            <p>API usage and limits</p>
          </a>
          <a href="/reference/components/performance-dashboard" className="docs-card">
            <h3>Performance Dashboard</h3>
            <p>Speed and latency metrics</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const qualityProps = [
  {
    name: 'metrics',
    type: 'ResponseQualityMetric[]',
    required: true,
    description: 'Array of quality metrics to display'
  },
  {
    name: 'overallLabel',
    type: 'string',
    required: false,
    default: "'Overall score'",
    description: 'Label for the overall score'
  },
  {
    name: 'overallScore',
    type: 'number',
    required: false,
    description: 'Overall quality score (0-1)'
  },
  {
    name: 'title',
    type: 'string',
    required: false,
    description: 'Section heading'
  },
  {
    name: 'subtitle',
    type: 'string',
    required: false,
    description: 'Description text'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes'
  }
]

