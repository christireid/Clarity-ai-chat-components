import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'QualityGate API | Clarity AI Chat Components',
  description:
    'Quality validation component with 85% minimum threshold, fallback strategies, and response quality assurance for LLM applications.',
  openGraph: {
    title: 'QualityGate API',
    description:
      'Ensure response quality with validation gates and fallback strategies',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'props', title: 'Props', level: 2 },
  { id: 'quality-thresholds', title: 'Quality Thresholds', level: 2 },
  { id: 'fallback-strategies', title: 'Fallback Strategies', level: 2 },
  { id: 'advanced-patterns', title: 'Advanced Patterns', level: 2 },
  { id: 'best-practices', title: 'Best Practices', level: 2 },
  { id: 'troubleshooting', title: 'Troubleshooting', level: 2 },
]

export default function QualityGateAPIPage() {
  return (
    <DocumentationPage
      title="QualityGate"
      description="Quality validation component with configurable thresholds and fallback strategies"
      category="Token Optimization"
      icon="🛡️"
      badges={[
        { label: 'API Reference', variant: 'info' },
        { label: 'Quality Assurance', variant: 'success' },
        { label: 'Stable', variant: 'primary' },
      ]}
      features={[
        'Configurable quality thresholds (default: 85%)',
        'Automatic response validation',
        'Multiple fallback strategies',
        'Real-time quality scoring',
        'Hallucination detection',
        'Citation verification',
        'Custom validation rules',
        'Performance monitoring',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          QualityGate ensures AI responses meet quality standards before reaching users. It
          validates responses against configurable thresholds, detects potential issues, and
          implements fallback strategies when quality is insufficient.
        </p>

        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>Key Features</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Quality Validation</h4>
              <p className="text-sm text-muted-foreground">
                Automatically score responses across multiple dimensions: relevance,
                groundedness, coherence, and safety.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Threshold Enforcement</h4>
              <p className="text-sm text-muted-foreground">
                Enforce minimum quality standards (default 85%) before allowing responses to
                reach users.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Fallback Strategies</h4>
              <p className="text-sm text-muted-foreground">
                Implement retry logic, alternative models, or graceful degradation when
                quality thresholds are not met.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Real-time Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Track quality metrics over time, identify patterns, and optimize for better
                performance.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-yellow-500 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>Why Quality Gates Matter</span>
          </h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Without quality validation, low-quality AI responses can damage user trust and
              brand reputation:
            </p>
            <ul className="space-y-2 ml-4">
              <li>
                • <strong className="text-foreground">Hallucinations</strong>: AI generates
                confident but incorrect information
              </li>
              <li>
                • <strong className="text-foreground">Irrelevant responses</strong>: AI
                misunderstands user intent
              </li>
              <li>
                • <strong className="text-foreground">Inconsistency</strong>: Response quality
                varies unpredictably
              </li>
              <li>
                • <strong className="text-foreground">Safety concerns</strong>: Inappropriate
                or harmful content slips through
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`# Install React components package
pnpm add @clarity-chat/react

# Or token-optimization package specifically
pnpm add @clarity-chat/token-optimization`}
          filename="terminal"
        />
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <p className="text-muted-foreground mb-6">
          Wrap your AI response handling with QualityGate to automatically validate responses
          before displaying them to users.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { QualityGate } from '@clarity-chat/react'

export function ChatInterface() {
  const [response, setResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true)
    try {
      const result = await generateAIResponse(prompt)
      setResponse(result)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <QualityGate
        response={response}
        minThreshold={0.85} // 85% minimum quality score
        onQualityCheck={(score, passed) => {
          console.log(\`Quality score: \${score}, Passed: \${passed}\`)
        }}
        fallbackStrategy="retry" // Retry with alternative prompt
        maxRetries={2}
      >
        {({ qualityScore, isPassing, retryCount }) => (
          <div className="response-container">
            {isPassing ? (
              <div className="response-content">
                {response}
                <div className="quality-badge">
                  Quality: {Math.round(qualityScore * 100)}%
                </div>
              </div>
            ) : (
              <div className="quality-warning">
                Response quality below threshold.
                {retryCount > 0 && \` Retry attempt \${retryCount}\`}
              </div>
            )}
          </div>
        )}
      </QualityGate>
    </div>
  )
}`}
          filename="ChatInterface.tsx"
        />
      </Section>

      <Section id="props" title="Props">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">response</td>
                <td className="py-3 px-4 font-mono text-xs">string</td>
                <td className="py-3 px-4 font-mono text-xs">-</td>
                <td className="py-3 px-4">The AI-generated response to validate</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">minThreshold</td>
                <td className="py-3 px-4 font-mono text-xs">number</td>
                <td className="py-3 px-4 font-mono text-xs">0.85</td>
                <td className="py-3 px-4">
                  Minimum quality score (0-1) required to pass validation
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">
                  fallbackStrategy
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  'retry' | 'alternative' | 'degrade' | 'none'
                </td>
                <td className="py-3 px-4 font-mono text-xs">'retry'</td>
                <td className="py-3 px-4">Strategy to use when quality check fails</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">maxRetries</td>
                <td className="py-3 px-4 font-mono text-xs">number</td>
                <td className="py-3 px-4 font-mono text-xs">2</td>
                <td className="py-3 px-4">
                  Maximum number of retry attempts before fallback
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">
                  onQualityCheck
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  (score: number, passed: boolean) =&gt; void
                </td>
                <td className="py-3 px-4 font-mono text-xs">-</td>
                <td className="py-3 px-4">
                  Callback fired when quality validation completes
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">onFallback</td>
                <td className="py-3 px-4 font-mono text-xs">
                  (strategy: string) =&gt; Promise&lt;string&gt;
                </td>
                <td className="py-3 px-4 font-mono text-xs">-</td>
                <td className="py-3 px-4">Custom fallback handler when quality check fails</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">
                  validationRules
                </td>
                <td className="py-3 px-4 font-mono text-xs">ValidationRule[]</td>
                <td className="py-3 px-4 font-mono text-xs">-</td>
                <td className="py-3 px-4">Custom validation rules to apply</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">
                  enableHallucinationDetection
                </td>
                <td className="py-3 px-4 font-mono text-xs">boolean</td>
                <td className="py-3 px-4 font-mono text-xs">true</td>
                <td className="py-3 px-4">Enable automatic hallucination detection</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-foreground">
                  citationRequired
                </td>
                <td className="py-3 px-4 font-mono text-xs">boolean</td>
                <td className="py-3 px-4 font-mono text-xs">false</td>
                <td className="py-3 px-4">Require citations for factual claims</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-xs text-foreground">
                  monitoringEnabled
                </td>
                <td className="py-3 px-4 font-mono text-xs">boolean</td>
                <td className="py-3 px-4 font-mono text-xs">true</td>
                <td className="py-3 px-4">Enable quality metrics collection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="quality-thresholds" title="Quality Thresholds">
        <p className="text-muted-foreground mb-6">
          Configure quality thresholds based on your application's requirements and risk
          tolerance.
        </p>

        <div className="space-y-6">
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Recommended Thresholds by Use Case</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Use Case</th>
                  <th className="text-center py-3 px-4 font-semibold">Threshold</th>
                  <th className="text-left py-3 px-4 font-semibold">Rationale</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">
                    Medical/Legal advice
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-red-500">95%</td>
                  <td className="py-3 px-4">High stakes, must be accurate</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">
                    Customer support
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-yellow-500">85%</td>
                  <td className="py-3 px-4">Balance quality and response time</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">
                    Creative writing
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-green-500">70%</td>
                  <td className="py-3 px-4">More flexible, prioritize creativity</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Casual chat</td>
                  <td className="py-3 px-4 text-center font-mono text-green-500">60%</td>
                  <td className="py-3 px-4">Low stakes, prioritize speed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <CodeBlock
            language="tsx"
            code={`// High-stakes medical application
<QualityGate
  response={medicalAdvice}
  minThreshold={0.95}
  citationRequired={true}
  enableHallucinationDetection={true}
  fallbackStrategy="none" // Don't show low-quality responses
>
  {/* ... */}
</QualityGate>

// Balanced customer support
<QualityGate
  response={supportResponse}
  minThreshold={0.85}
  fallbackStrategy="retry"
  maxRetries={2}
>
  {/* ... */}
</QualityGate>

// Creative writing assistant
<QualityGate
  response={creativeContent}
  minThreshold={0.70}
  fallbackStrategy="alternative"
  validationRules={[
    { dimension: 'creativity', weight: 0.5 },
    { dimension: 'coherence', weight: 0.5 }
  ]}
>
  {/* ... */}
</QualityGate>`}
            filename="ThresholdExamples.tsx"
          />
        </div>
      </Section>

      <Section id="fallback-strategies" title="Fallback Strategies">
        <p className="text-muted-foreground mb-6">
          QualityGate supports multiple fallback strategies to handle low-quality responses
          gracefully.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <span>🔄</span>
              <span>Retry Strategy</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically retry the same prompt with adjusted parameters. Best for
              intermittent quality issues.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Simple to implement</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No prompt modification needed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                <span>Increases latency</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
              <span>🔀</span>
              <span>Alternative Strategy</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Switch to a different model or prompt variant. Best for consistent quality
              issues.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Higher success rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Model-specific optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                <span>Requires alternative config</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h4 className="font-semibold text-yellow-500 mb-3 flex items-center gap-2">
              <span>⬇️</span>
              <span>Degrade Strategy</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Fall back to simpler, more reliable responses. Best for maintaining service
              availability.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Always provides response</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Lower latency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                <span>Reduced functionality</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
              <span>🚫</span>
              <span>None Strategy</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Block low-quality responses entirely. Best for high-stakes applications.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Maintains quality standards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Clear user expectations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>May frustrate users</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <CodeBlock
            language="tsx"
            code={`// Retry strategy with custom retry logic
<QualityGate
  response={response}
  fallbackStrategy="retry"
  maxRetries={3}
  onFallback={async (strategy) => {
    if (strategy === 'retry') {
      // Adjust temperature or other parameters
      return await generateWithHigherTemperature(prompt)
    }
  }}
/>

// Alternative model strategy
<QualityGate
  response={response}
  fallbackStrategy="alternative"
  onFallback={async () => {
    // Switch from GPT-4 to Claude
    return await generateWithClaude(prompt)
  }}
/>

// Graceful degradation
<QualityGate
  response={response}
  fallbackStrategy="degrade"
  onFallback={async () => {
    // Return template-based response
    return getTemplateResponse(userIntent)
  }}
/>

// Block low-quality responses
<QualityGate
  response={response}
  fallbackStrategy="none"
  onQualityCheck={(score, passed) => {
    if (!passed) {
      logQualityFailure({ score, response })
      showErrorToUser('Unable to generate quality response')
    }
  }}
/>`}
            filename="FallbackStrategies.tsx"
          />
        </div>
      </Section>

      <Section id="advanced-patterns" title="Advanced Patterns">
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Custom Validation Rules</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Define domain-specific validation rules for specialized use cases.
            </p>
            <CodeBlock
              language="tsx"
              code={`import { QualityGate, ValidationRule } from '@clarity-chat/react'

const medicalValidationRules: ValidationRule[] = [
  {
    dimension: 'accuracy',
    weight: 0.4,
    validator: (response, context) => {
      // Check for medical disclaimers
      const hasDisclaimer = response.includes('consult a healthcare professional')
      return hasDisclaimer ? 1.0 : 0.5
    }
  },
  {
    dimension: 'citations',
    weight: 0.3,
    validator: (response, context) => {
      // Count citations
      const citationCount = (response.match(/\\[\\d+\\]/g) || []).length
      return Math.min(citationCount / 3, 1.0) // Expect 3+ citations
    }
  },
  {
    dimension: 'safety',
    weight: 0.3,
    validator: (response, context) => {
      // Check for dangerous advice
      const dangerousTerms = ['self-diagnose', 'skip doctor', 'ignore symptoms']
      const hasDangerousAdvice = dangerousTerms.some(term =>
        response.toLowerCase().includes(term)
      )
      return hasDangerousAdvice ? 0.0 : 1.0
    }
  }
]

export function MedicalChatbot() {
  return (
    <QualityGate
      response={medicalResponse}
      minThreshold={0.90}
      validationRules={medicalValidationRules}
      fallbackStrategy="none"
    >
      {({ qualityScore, isPassing, validationDetails }) => (
        <div>
          {isPassing ? (
            <MedicalResponse
              content={medicalResponse}
              quality={qualityScore}
            />
          ) : (
            <QualityWarning
              score={qualityScore}
              details={validationDetails}
            />
          )}
        </div>
      )}
    </QualityGate>
  )
}`}
              filename="CustomValidation.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Multi-Stage Validation Pipeline</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Chain multiple quality gates for comprehensive validation.
            </p>
            <CodeBlock
              language="tsx"
              code={`export function MultiStageValidation() {
  return (
    <QualityGate
      response={response}
      minThreshold={0.80}
      validationStage="safety"
      enableHallucinationDetection={false}
    >
      {({ isPassing: isSafe, qualityScore: safetyScore }) => (
        <QualityGate
          response={response}
          minThreshold={0.85}
          validationStage="accuracy"
          enableHallucinationDetection={true}
        >
          {({ isPassing: isAccurate, qualityScore: accuracyScore }) => (
            <QualityGate
              response={response}
              minThreshold={0.75}
              validationStage="relevance"
              citationRequired={true}
            >
              {({ isPassing: isRelevant, qualityScore: relevanceScore }) => {
                const overallPassing = isSafe && isAccurate && isRelevant
                const overallScore = (safetyScore + accuracyScore + relevanceScore) / 3

                return (
                  <ResponseContainer
                    content={response}
                    isPassing={overallPassing}
                    metrics={{
                      safety: safetyScore,
                      accuracy: accuracyScore,
                      relevance: relevanceScore,
                      overall: overallScore
                    }}
                  />
                )
              }}
            </QualityGate>
          )}
        </QualityGate>
      )}
    </QualityGate>
  )
}`}
              filename="MultiStageValidation.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>Quality Monitoring Dashboard</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Track quality metrics over time for continuous improvement.
            </p>
            <CodeBlock
              language="tsx"
              code={`import { QualityGate, useQualityMetrics } from '@clarity-chat/react'

export function QualityMonitoringDashboard() {
  const metrics = useQualityMetrics()

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard
          title="Average Quality Score"
          value={\`\${Math.round(metrics.averageScore * 100)}%\`}
          trend={metrics.trend}
        />
        <MetricCard
          title="Pass Rate"
          value={\`\${Math.round(metrics.passRate * 100)}%\`}
          target={85}
        />
        <MetricCard
          title="Hallucinations Detected"
          value={metrics.hallucinationCount}
          alert={metrics.hallucinationCount > 10}
        />
        <MetricCard
          title="Fallback Rate"
          value={\`\${Math.round(metrics.fallbackRate * 100)}%\`}
          target={10}
        />
      </div>

      <QualityTrendChart data={metrics.history} />

      <ValidationRulePerformance rules={metrics.rulePerformance} />
    </div>
  )
}`}
              filename="QualityDashboard.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="best-practices" title="Best Practices">
        <div className="space-y-6">
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>1. Set Realistic Thresholds</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Start with the recommended 85% threshold and adjust based on your application's
              needs. Monitor pass rates and adjust thresholds to balance quality and
              availability.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Tip:</strong> If pass rate drops below 70%,
              your threshold may be too high.
            </div>
          </div>

          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
              <span>✅</span>
              <span>2. Implement Gradual Rollout</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Enable quality gates for a small percentage of traffic first. Monitor metrics
              and gradually increase coverage as confidence grows.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Example:</strong> Start with 10% of traffic,
              increase to 50% after 1 week, then 100% after 2 weeks.
            </div>
          </div>

          <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h4 className="font-semibold text-yellow-500 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>3. Handle Failures Gracefully</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Always provide fallback options when quality checks fail. Never leave users with
              a blank screen or cryptic error message.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Anti-pattern:</strong> Throwing an error and
              displaying "Quality check failed" to users.
            </div>
          </div>

          <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>4. Monitor and Iterate</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Collect quality metrics continuously. Analyze patterns in failures and adjust
              validation rules, thresholds, or prompts accordingly.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Key Metrics:</strong> Pass rate, average
              score, hallucination rate, fallback rate, user satisfaction.
            </div>
          </div>

          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
              <span>🔒</span>
              <span>5. Prioritize Safety</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              For high-stakes applications (medical, legal, financial), use stricter
              thresholds and the "none" fallback strategy. Better to provide no response than
              a harmful one.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Recommendation:</strong> 95%+ threshold,
              required citations, hallucination detection enabled.
            </div>
          </div>
        </div>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Common Issues</h4>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: Pass rate too low (below 50%)</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> Threshold too strict or
                  validation rules too demanding
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Lower minThreshold by
                  0.05-0.10, review validation rules, check prompt quality
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: High latency with retry strategy</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> Too many retry attempts
                  or slow fallback logic
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Reduce maxRetries to
                  1-2, optimize fallback handler, consider alternative strategy
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: False positives (good responses rejected)</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> Overly strict validation
                  rules or incorrect weights
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Review validation rule
                  weights, adjust dimension priorities, test with sample responses
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: Memory leaks with monitoring enabled</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> Unbounded metrics
                  collection
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Implement metric
                  retention limits, periodically flush old metrics, use sampling for
                  high-traffic apps
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="font-semibold text-blue-500 mb-3">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you encounter issues not covered here:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                • Check the{' '}
                <a
                  href="/reference/components/token-optimization"
                  className="text-blue-500 hover:underline"
                >
                  Token Optimization System overview
                </a>
              </li>
              <li>
                • Review validation rule examples in the source code
              </li>
              <li>
                • Open a GitHub issue with quality metrics and sample responses
              </li>
              <li>
                • Join the community Discord for real-time support
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
