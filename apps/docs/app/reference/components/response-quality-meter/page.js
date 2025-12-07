import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Response Quality Meter - Clarity Chat Components',
    description: 'Visualize AI response quality metrics like groundedness, coverage, and confidence scores.',
};
export default function ResponseQualityMeterPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Response Quality Meter" }), _jsx("p", { className: "docs-lead", children: "Show how good the AI's answer was. Like a report card for each response - is it grounded in facts? Did it cover everything? How confident is it?" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "When you evaluate AI responses (using tools like LangSmith, Braintrust, or custom scoring), this component displays those scores in a beautiful, easy-to-understand way." }), _jsx(Callout, { type: "info", title: "What Are Quality Metrics?", children: "AI evaluation tools measure things like: Is the answer based on real data (groundedness)? Did it answer the full question (coverage)? How confident is the AI? This shows those scores." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function SimpleQuality() {
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

render(<SimpleQuality />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Targets" }), _jsx("p", { children: "Show target thresholds to highlight metrics that need improvement." }), _jsx(CodePlayground, { initialCode: `function MetricsWithTargets() {
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

render(<MetricsWithTargets />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Real-World: RAG Quality Dashboard" }), _jsx(CodePlayground, { initialCode: `import { useState, useEffect } from 'react'

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

render(<RAGQualityDashboard />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "ResponseQualityMeter Props", data: qualityProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Integration Example" }), _jsx("pre", { children: _jsx("code", { children: `// Integrate with LangSmith evaluation
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
)` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Show metrics after AI responses in admin/debug mode" }), _jsx("li", { children: "Use 3-6 key metrics (too many is overwhelming)" }), _jsx("li", { children: "Set realistic targets based on your use case" }), _jsx("li", { children: "Highlight metrics below target for quick scanning" }), _jsx("li", { children: "Include descriptions to explain what each metric means" })] }), _jsx(Callout, { type: "tip", title: "When to Show This", children: "Great for admin dashboards, quality monitoring, and debugging. Don't show to end users - they just want answers, not technical scores." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/usage-dashboard", className: "docs-card", children: [_jsx("h3", { children: "Usage Dashboard" }), _jsx("p", { children: "API usage and limits" })] }), _jsxs("a", { href: "/reference/components/performance-dashboard", className: "docs-card", children: [_jsx("h3", { children: "Performance Dashboard" }), _jsx("p", { children: "Speed and latency metrics" })] })] })] })] }));
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
];
//# sourceMappingURL=page.js.map