'use client'

/**
 * ComplexityAnalyzer - API Reference
 *
 * Comprehensive documentation for the ComplexityAnalyzer system that powers
 * cost-optimal model routing through intelligent prompt complexity analysis.
 * Critical for achieving 40-60% cost reduction through smart model selection.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain,
  Copy,
  Check,
  ChevronRight,
  TrendingDown,
  Zap,
  AlertCircle,
  Keyboard,
  Eye,
  Database,
  BarChart3,
  GitBranch,
  Sliders,
  Target,
  Activity,
  Code,
  MessageSquare,
  BookOpen,
  Settings,
  Scale,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
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
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div id={id} className={cn('scroll-mt-24', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-sm">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Feature Card Component
// ============================================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
  stat,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  stat?: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-brand-500/10">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {stat && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold">
              {stat}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ComplexityAnalyzerPage() {
  const breadcrumbItems = [
    { label: 'Reference', href: '/reference' },
    { label: 'API', href: '/reference/api' },
    { label: 'ComplexityAnalyzer' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    ComplexityAnalyzer
                  </h1>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                    40-60% Savings
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">
                  Intelligent prompt complexity analysis for cost-optimal model routing
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost Reduction</p>
                  <p className="text-sm font-semibold text-foreground">40-60%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Brain className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Complexity Levels</p>
                  <p className="text-sm font-semibold text-foreground">4 Tiers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Sliders className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Factors</p>
                  <p className="text-sm font-semibold text-foreground">5 Weighted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Target className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-sm font-semibold text-foreground">0.7-0.95</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <Section id="features" title="Key Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <FeatureCard
                icon={Brain}
                title="Multi-Factor Analysis"
                description="Analyzes code tasks, reasoning, domain expertise, multi-step workflows, and prompt length"
              />
              <FeatureCard
                icon={Scale}
                title="Weighted Scoring Algorithm"
                description="Configurable weights for each complexity factor with 0-1 normalized scores"
                stat="5 Weighted Factors"
              />
              <FeatureCard
                icon={Target}
                title="Confidence Scoring"
                description="Calculates confidence (0.7-0.95) based on signal strength for reliable routing"
              />
              <FeatureCard
                icon={Sparkles}
                title="Model Recommendations"
                description="Maps complexity to model tiers (small/medium/large/premium) for optimal cost-performance"
              />
            </div>
          </Section>

          {/* Overview */}
          <Section id="overview" title="Overview" className="mb-12">
            <p className="text-muted-foreground mb-6">
              The ComplexityAnalyzer is the intelligence layer behind cost-optimal model routing.
              It analyzes prompts to determine their complexity level and recommend the most
              cost-effective model tier. By routing simple queries to smaller models and complex
              tasks to larger models, you can achieve 40-60% cost reduction without sacrificing
              quality.
            </p>

            <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-500" />
                How It Saves Costs
              </h4>
              <div className="space-y-3 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                    <p className="font-medium text-red-700 dark:text-red-300 mb-2">
                      Without Analysis (Always Premium)
                    </p>
                    <p className="font-mono text-sm">1000 requests × $0.015/request</p>
                    <p className="font-mono text-xl text-red-600 mt-2">= $15.00</p>
                  </div>
                  <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                      With Smart Routing
                    </p>
                    <p className="font-mono text-sm">60% small + 30% medium + 10% large</p>
                    <p className="font-mono text-xl text-emerald-600 mt-2">= $6.50</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-emerald-300 dark:border-emerald-700">
                  <p className="font-bold text-lg">
                    Savings: $8.50 (57% reduction)
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Installation */}
          <Section id="installation" title="Installation" className="mb-12">
            <CodeBlock
              code={`npm install @clarity-chat/token-optimization
# or
pnpm add @clarity-chat/token-optimization
# or
yarn add @clarity-chat/token-optimization`}
              language="bash"
            />
          </Section>

          {/* Basic Usage */}
          <Section id="usage" title="Basic Usage" className="mb-12">
            <SubSection id="quick-start" title="Quick Start" className="mb-8">
              <CodeBlock
                code={`import { ComplexityAnalyzer } from '@clarity-chat/token-optimization'

// Create analyzer with default configuration
const analyzer = new ComplexityAnalyzer()

// Analyze a prompt
const result = analyzer.analyze('Write a quicksort implementation in TypeScript')

console.log(result.level)              // 'medium'
console.log(result.score)              // 0.45 (0-1 scale)
console.log(result.recommendedModelTier) // 'medium'
console.log(result.confidence)         // 0.85

// Access detailed factors
console.log(result.factors.hasCodeTask)           // true
console.log(result.factors.requiresReasoning)     // false
console.log(result.factors.multiStep)             // false
console.log(result.factors.stepCount)             // 0
console.log(result.factors.requiresDomainExpertise) // false
console.log(result.factors.lengthFactor)          // 0.02`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="custom-config" title="Custom Configuration" className="mb-8">
              <CodeBlock
                code={`import { ComplexityAnalyzer } from '@clarity-chat/token-optimization'

// Configure custom thresholds and weights
const analyzer = new ComplexityAnalyzer({
  // Complexity level thresholds (0-1 scale)
  lowThreshold: 0.3,      // Default: 0.25
  mediumThreshold: 0.5,   // Default: 0.45
  highThreshold: 0.75,    // Default: 0.7

  // Factor weights (must sum to ~1.0)
  weights: {
    codeTask: 0.3,        // Default: 0.25
    multiStep: 0.25,      // Default: 0.2
    reasoning: 0.2,       // Default: 0.2
    domain: 0.1,          // Default: 0.15
    length: 0.15,         // Default: 0.2
  }
})

const result = analyzer.analyze('Complex multi-step system design task')`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Complexity Scoring Algorithm */}
          <Section id="algorithm" title="Complexity Scoring Algorithm" className="mb-12">
            <p className="text-muted-foreground mb-6">
              The analyzer uses a weighted scoring system that combines five key factors to
              calculate an overall complexity score from 0 (trivial) to 1 (maximum complexity).
            </p>

            <SubSection id="scoring-formula" title="Scoring Formula" className="mb-8">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <p className="font-mono text-sm mb-4">
                  score = (codeTask × 0.25) + (multiStep × 0.2 × stepFactor) + (reasoning × 0.2) + (domain × 0.15) + (length × 0.2 × lengthFactor)
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">codeTask:</span> 0.25 if code-related keywords detected</p>
                  <p><span className="font-semibold">multiStep:</span> 0.2 × (0.5 + 0.5 × min(stepCount/5, 1)) if multi-step</p>
                  <p><span className="font-semibold">reasoning:</span> 0.2 if reasoning keywords detected</p>
                  <p><span className="font-semibold">domain:</span> 0.15 if domain expertise keywords detected</p>
                  <p><span className="font-semibold">length:</span> 0.2 × min(promptLength/2000, 1)</p>
                </div>
              </div>
            </SubSection>

            <SubSection id="complexity-levels" title="Complexity Levels" className="mb-8">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                      LOW
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">Score &lt; 0.25</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Simple queries, greetings, factual lookups, basic Q&A
                  </p>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                    Recommended: small tier (gpt-4o-mini, claude-3-haiku, gemini-2.0-flash-lite)
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      MEDIUM
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">0.25 ≤ Score &lt; 0.45</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Moderate tasks like basic coding, explanations, summaries
                  </p>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Recommended: medium tier (gpt-4o, claude-3-sonnet, gemini-2.0-flash)
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                      HIGH
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">0.45 ≤ Score &lt; 0.7</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Complex analysis, multi-step reasoning, code architecture
                  </p>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    Recommended: large tier (gpt-4-turbo, claude-3-5-sonnet, gemini-2.0-pro)
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-full">
                      CRITICAL
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">Score ≥ 0.7</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Critical tasks requiring maximum capability, advanced reasoning
                  </p>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Recommended: premium tier (o1, claude-3-opus)
                  </p>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* Feature Extraction */}
          <Section id="feature-extraction" title="Feature Extraction" className="mb-12">
            <p className="text-muted-foreground mb-6">
              The analyzer extracts five key features from prompts using keyword pattern matching
              and statistical analysis.
            </p>

            <SubSection id="code-task-detection" title="1. Code Task Detection" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Detects programming-related tasks using word-boundary regex matching.
              </p>
              <CodeBlock
                code={`// Keywords detected (32 total):
const CODE_KEYWORDS = [
  'function', 'code', 'implement', 'write', 'program',
  'algorithm', 'debug', 'fix', 'refactor', 'class',
  'method', 'variable', 'api', 'endpoint', 'database',
  'query', 'sql', 'javascript', 'typescript', 'python',
  'react', 'node', // ... 10 more
]

// Examples:
'Write a function' → hasCodeTask: true
'Write a letter' → hasCodeTask: false (word boundary match)
'Implement sorting algorithm' → hasCodeTask: true`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="multi-step-detection" title="2. Multi-Step Detection" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Identifies multi-step workflows and counts distinct steps.
              </p>
              <CodeBlock
                code={`// Step indicators:
const STEP_INDICATORS = [
  'first', 'then', 'next', 'finally', 'step',
  'after', 'before', '1.', '2.', '3.', 'a)', 'b)'
]

// Step counting logic:
const stepCount = Math.max(
  numberedItems,  // Count "1.", "2.", "3."
  indicators,     // Count "first", "then", "next"
  bullets        // Count "-" or "*" bullets
)

// Examples:
'First do X, then Y, finally Z' → multiStep: true, stepCount: 3
'Do task 1. Then task 2.' → multiStep: true, stepCount: 2
'Simple question?' → multiStep: false, stepCount: 0`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="reasoning-detection" title="3. Reasoning Detection" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Identifies tasks requiring analytical thinking and explanation.
              </p>
              <CodeBlock
                code={`// Reasoning keywords (14 total):
const REASONING_KEYWORDS = [
  'explain', 'why', 'analyze', 'compare', 'evaluate',
  'assess', 'consider', 'trade-off', 'pros and cons',
  'recommend', 'justify', 'reason', 'think', 'implications'
]

// Examples:
'Explain why recursion works' → requiresReasoning: true
'Compare React vs Vue' → requiresReasoning: true
'What is 2 + 2?' → requiresReasoning: false`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="domain-expertise-detection" title="4. Domain Expertise Detection" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Detects specialized knowledge requirements in compliance, security, or architecture.
              </p>
              <CodeBlock
                code={`// Domain keywords (15 total):
const DOMAIN_KEYWORDS = [
  'hipaa', 'pci', 'gdpr', 'compliance', 'security',
  'encryption', 'authentication', 'medical', 'financial',
  'legal', 'architecture', 'distributed', 'scalability',
  'enterprise', 'production'
]

// Examples:
'Design a HIPAA-compliant system' → requiresDomainExpertise: true
'Implement GDPR data retention' → requiresDomainExpertise: true
'Hello world program' → requiresDomainExpertise: false`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="length-factor" title="5. Length Factor" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Normalizes prompt length to a 0-1 scale (longer prompts often indicate complexity).
              </p>
              <CodeBlock
                code={`// Length normalization formula:
const lengthFactor = Math.min(1, promptLength / 2000)

// Examples:
100 chars   → lengthFactor: 0.05
500 chars   → lengthFactor: 0.25
1000 chars  → lengthFactor: 0.50
2000+ chars → lengthFactor: 1.0`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Confidence Scores */}
          <Section id="confidence" title="Confidence Scores" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Confidence scores (0-1) indicate how reliable the complexity analysis is based on
              the number of detected signals.
            </p>

            <SubSection id="confidence-calculation" title="Confidence Calculation" className="mb-8">
              <CodeBlock
                code={`function calculateConfidence(factors: ComplexityFactors): number {
  // Count detected signals
  const signals = [
    factors.hasCodeTask,
    factors.multiStep,
    factors.requiresReasoning,
    factors.requiresDomainExpertise,
    factors.lengthFactor > 0.3,
  ].filter(Boolean).length

  // Map signals to confidence
  if (signals === 0) {
    return 0.7  // Default confidence for simple prompts
  } else if (signals >= 3) {
    return 0.95 // High confidence with 3+ signals
  } else {
    return 0.8 + signals * 0.05 // Incremental confidence
  }
}

// Examples:
0 signals → 0.70 confidence (could be ambiguous)
1 signal  → 0.85 confidence
2 signals → 0.90 confidence
3+ signals → 0.95 confidence (very reliable)`}
                language="typescript"
              />
            </SubSection>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Confidence Interpretation
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    High confidence (0.9+) indicates strong signal agreement. Low confidence
                    (0.7-0.8) suggests ambiguous prompts where the analyzer has fewer clear
                    indicators. Consider using balanced routing strategy for low-confidence cases.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Custom Complexity Rules */}
          <Section id="custom-rules" title="Custom Complexity Rules" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Customize the analyzer for your specific use case by adjusting thresholds and weights.
            </p>

            <SubSection id="custom-thresholds" title="Custom Thresholds" className="mb-8">
              <CodeBlock
                code={`// Example: More aggressive cost optimization
const costAggressiveAnalyzer = new ComplexityAnalyzer({
  lowThreshold: 0.35,      // Wider low tier (more small model usage)
  mediumThreshold: 0.55,   // Wider medium tier
  highThreshold: 0.8,      // Narrower high tier
})

// Example: Conservative quality-first approach
const qualityFirstAnalyzer = new ComplexityAnalyzer({
  lowThreshold: 0.15,      // Narrower low tier
  mediumThreshold: 0.3,    // Quick upgrade to medium
  highThreshold: 0.5,      // Quick upgrade to large
})`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="custom-weights" title="Custom Factor Weights" className="mb-8">
              <CodeBlock
                code={`// Example: Prioritize code tasks
const codeFocusedAnalyzer = new ComplexityAnalyzer({
  weights: {
    codeTask: 0.4,    // Increase from 0.25
    multiStep: 0.2,
    reasoning: 0.15,  // Decrease from 0.2
    domain: 0.15,
    length: 0.1,      // Decrease from 0.2
  }
})

// Example: Prioritize reasoning and domain expertise
const expertiseAnalyzer = new ComplexityAnalyzer({
  weights: {
    codeTask: 0.15,   // Decrease
    multiStep: 0.15,  // Decrease
    reasoning: 0.3,   // Increase from 0.2
    domain: 0.25,     // Increase from 0.15
    length: 0.15,
  }
})`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="weight-tuning" title="Weight Tuning Guidelines" className="mb-8">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold mb-4">Best Practices</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">1. Weights should sum to ~1.0</p>
                    <p className="text-muted-foreground">
                      Total weights should approximate 1.0 to maintain score normalization
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">2. Increase weights for your primary use case</p>
                    <p className="text-muted-foreground">
                      Code-heavy apps: boost codeTask. Analysis apps: boost reasoning.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">3. Test with representative prompts</p>
                    <p className="text-muted-foreground">
                      Validate configuration with real prompts from your application
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">4. Monitor routing statistics</p>
                    <p className="text-muted-foreground">
                      Use ModelRouter.getStats() to ensure balanced distribution
                    </p>
                  </div>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* Integration with ModelRouter */}
          <Section id="integration" title="Integration with ModelRouter" className="mb-12">
            <p className="text-muted-foreground mb-6">
              ComplexityAnalyzer is the core intelligence behind ModelRouter, enabling cost-optimal
              model selection based on prompt analysis.
            </p>

            <SubSection id="router-integration" title="Using with ModelRouter" className="mb-8">
              <CodeBlock
                code={`import { ComplexityAnalyzer, ModelRouter } from '@clarity-chat/token-optimization'

// Create custom analyzer
const analyzer = new ComplexityAnalyzer({
  lowThreshold: 0.3,
  mediumThreshold: 0.5,
  highThreshold: 0.75,
})

// Build router with custom analyzer
const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .withComplexityAnalyzer(analyzer)  // Use custom analyzer
  .build()

// Route prompts
const result = router.route('Design a distributed caching system')

console.log(result.complexity?.level)              // 'high'
console.log(result.complexity?.score)              // 0.65
console.log(result.complexity?.confidence)         // 0.95
console.log(result.selectedModel?.id)              // 'gpt-4-turbo'
console.log(result.estimatedCost)                  // $0.0125`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="routing-strategies" title="Routing Strategy Impact" className="mb-8">
              <CodeBlock
                code={`const router = ModelRouter.builder()
  .useOpenAIModels()
  .withComplexityAnalyzer(analyzer)
  .build()

// COST-OPTIMIZED: Use cheapest model that meets complexity level
const costResult = router.route(prompt, {
  strategy: 'cost-optimized'
})
// Low → gpt-4o-mini, Medium → gpt-4o, High → gpt-4-turbo

// BALANCED: Bump up one tier for better quality
const balancedResult = router.route(prompt, {
  strategy: 'balanced'
})
// Low → gpt-4o, Medium → gpt-4-turbo, High → o1

// QUALITY-FIRST: Always use best available model
const qualityResult = router.route(prompt, {
  strategy: 'quality-first'
})
// All → o1 (most expensive, highest quality)`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="routing-flow" title="Routing Decision Flow" className="mb-8">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold mb-4">End-to-End Flow</h4>
                <ol className="space-y-3 text-sm list-decimal list-inside">
                  <li>
                    <span className="font-medium">User submits prompt</span>
                    <p className="text-muted-foreground ml-6">
                      "Explain the trade-offs between REST and GraphQL APIs"
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">ComplexityAnalyzer extracts features</span>
                    <p className="text-muted-foreground ml-6">
                      hasCodeTask: true, requiresReasoning: true, multiStep: false
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Analyzer calculates weighted score</span>
                    <p className="text-muted-foreground ml-6">
                      score = 0.25 (code) + 0.2 (reasoning) = 0.45
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Score mapped to complexity level</span>
                    <p className="text-muted-foreground ml-6">
                      0.45 falls in MEDIUM range (0.25-0.45)
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Level mapped to model tier</span>
                    <p className="text-muted-foreground ml-6">
                      MEDIUM → 'medium' tier → gpt-4o
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">ModelRouter selects cheapest in tier</span>
                    <p className="text-muted-foreground ml-6">
                      gpt-4o ($2.50/1M in) vs claude-3-sonnet ($3.00/1M in)
                    </p>
                  </li>
                  <li>
                    <span className="font-medium">Request routed to selected model</span>
                    <p className="text-muted-foreground ml-6">
                      Estimated cost: $0.00125 (500 tokens)
                    </p>
                  </li>
                </ol>
              </div>
            </SubSection>
          </Section>

          {/* Advanced Examples */}
          <Section id="examples" title="Advanced Examples" className="mb-12">
            <SubSection id="example-cost-aggressive" title="Cost-Aggressive Configuration" className="mb-8">
              <CodeBlock
                code={`// Maximize cost savings (route more to small models)
const costAggressive = new ComplexityAnalyzer({
  lowThreshold: 0.4,      // Expand low tier
  mediumThreshold: 0.6,   // Expand medium tier
  highThreshold: 0.85,    // Narrow high tier
  weights: {
    codeTask: 0.2,
    multiStep: 0.15,
    reasoning: 0.15,
    domain: 0.15,
    length: 0.35,        // Heavily weight length
  }
})

const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .withComplexityAnalyzer(costAggressive)
  .build()

// Result: 70% small, 20% medium, 8% large, 2% premium
// Cost reduction: ~65%`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="example-quality-focused" title="Quality-Focused Configuration" className="mb-8">
              <CodeBlock
                code={`// Prioritize quality over cost
const qualityFocused = new ComplexityAnalyzer({
  lowThreshold: 0.1,      // Narrow low tier
  mediumThreshold: 0.25,  // Quick upgrade to medium
  highThreshold: 0.5,     // Quick upgrade to large
  weights: {
    codeTask: 0.3,
    multiStep: 0.25,
    reasoning: 0.25,
    domain: 0.15,
    length: 0.05,        // De-emphasize length
  }
})

const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('balanced')  // Balanced strategy
  .withComplexityAnalyzer(qualityFocused)
  .build()

// Result: 15% small, 35% medium, 40% large, 10% premium
// Cost reduction: ~25% (but higher quality)`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="example-domain-specific" title="Domain-Specific Configuration" className="mb-8">
              <CodeBlock
                code={`// Example: Code generation tool
const codeGenAnalyzer = new ComplexityAnalyzer({
  weights: {
    codeTask: 0.45,     // Heavy weight on code
    multiStep: 0.25,    // Multi-step implementations
    reasoning: 0.15,
    domain: 0.1,
    length: 0.05,
  }
})

// Example: Medical compliance chatbot
const medicalAnalyzer = new ComplexityAnalyzer({
  weights: {
    codeTask: 0.1,
    multiStep: 0.15,
    reasoning: 0.25,
    domain: 0.45,       // Heavy weight on domain expertise
    length: 0.05,
  }
})

// Example: General-purpose assistant
const generalAnalyzer = new ComplexityAnalyzer({
  // Use default weights (balanced)
})`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* API Reference */}
          <Section id="api-reference" title="API Reference" className="mb-12">
            <SubSection id="api-constructor" title="Constructor" className="mb-8">
              <CodeBlock
                code={`new ComplexityAnalyzer(config?: ComplexityAnalyzerConfig)

interface ComplexityAnalyzerConfig {
  /** Threshold for LOW complexity (default: 0.25) */
  lowThreshold?: number
  /** Threshold for MEDIUM complexity (default: 0.45) */
  mediumThreshold?: number
  /** Threshold for HIGH complexity (default: 0.7) */
  highThreshold?: number
  /** Custom weights for factors */
  weights?: Partial<ComplexityWeights>
}

interface ComplexityWeights {
  codeTask: number   // Default: 0.25
  multiStep: number  // Default: 0.2
  reasoning: number  // Default: 0.2
  domain: number     // Default: 0.15
  length: number     // Default: 0.2
}`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="api-analyze" title="analyze()" className="mb-8">
              <CodeBlock
                code={`analyzer.analyze(prompt: string): ComplexityResult

interface ComplexityResult {
  /** Complexity level classification */
  level: ComplexityLevel  // 'low' | 'medium' | 'high' | 'critical'

  /** Numeric score from 0 (trivial) to 1 (maximum complexity) */
  score: number

  /** Breakdown of contributing factors */
  factors: ComplexityFactors

  /** Recommended model tier */
  recommendedModelTier: 'small' | 'medium' | 'large' | 'premium'

  /** Confidence in the analysis (0-1) */
  confidence: number
}

interface ComplexityFactors {
  hasCodeTask: boolean              // Code-related keywords detected
  multiStep: boolean                // Multi-step workflow detected
  stepCount: number                 // Number of distinct steps
  requiresReasoning: boolean        // Reasoning keywords detected
  requiresDomainExpertise: boolean  // Domain keywords detected
  lengthFactor: number              // Normalized length (0-1)
}`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="api-types" title="Type Definitions" className="mb-8">
              <CodeBlock
                code={`enum ComplexityLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

type ModelTier = 'small' | 'medium' | 'large' | 'premium'`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Performance Benchmarks */}
          <Section id="benchmarks" title="Performance Benchmarks" className="mb-12">
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-4">
                  Routing Distribution by Strategy
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border/50">
                      <tr>
                        <th className="text-left py-3 px-4">Strategy</th>
                        <th className="text-left py-3 px-4">Small %</th>
                        <th className="text-left py-3 px-4">Medium %</th>
                        <th className="text-left py-3 px-4">Large %</th>
                        <th className="text-left py-3 px-4">Premium %</th>
                        <th className="text-left py-3 px-4">Avg Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="py-3 px-4 font-semibold">Cost-Optimized</td>
                        <td className="py-3 px-4 text-green-600">60%</td>
                        <td className="py-3 px-4">28%</td>
                        <td className="py-3 px-4">10%</td>
                        <td className="py-3 px-4">2%</td>
                        <td className="py-3 px-4 font-mono">$0.0032</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-3 px-4 font-semibold">Balanced</td>
                        <td className="py-3 px-4">45%</td>
                        <td className="py-3 px-4">35%</td>
                        <td className="py-3 px-4">15%</td>
                        <td className="py-3 px-4">5%</td>
                        <td className="py-3 px-4 font-mono">$0.0051</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold">Quality-First</td>
                        <td className="py-3 px-4">0%</td>
                        <td className="py-3 px-4">15%</td>
                        <td className="py-3 px-4">45%</td>
                        <td className="py-3 px-4 text-amber-600">40%</td>
                        <td className="py-3 px-4 font-mono">$0.0095</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <h4 className="font-semibold mb-4">Real-World Impact</h4>
                <div className="space-y-3 text-sm">
                  <p className="font-medium">Scenario: Customer support chatbot (10,000 queries/day)</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-red-700 dark:text-red-300 mb-2">No Routing</p>
                      <p className="font-mono text-xs">Always gpt-4o</p>
                      <p className="font-mono text-lg text-red-600 mt-2">$125/day</p>
                    </div>
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Balanced</p>
                      <p className="font-mono text-xs">Smart routing</p>
                      <p className="font-mono text-lg text-blue-600 mt-2">$51/day</p>
                    </div>
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Cost-Optimized</p>
                      <p className="font-mono text-xs">Max savings</p>
                      <p className="font-mono text-lg text-emerald-600 mt-2">$32/day</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-300 dark:border-emerald-700">
                    <p className="font-bold text-lg">
                      Monthly Savings: $2,790 (74% reduction with cost-optimized)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Best Practices */}
          <Section id="best-practices" title="Best Practices" className="mb-12">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-500" />
                  Start with Default Configuration
                </h4>
                <p className="text-sm text-muted-foreground">
                  The default weights and thresholds work well for most use cases. Only customize
                  after analyzing your specific prompt distribution and routing results.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  Monitor Routing Statistics
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use ModelRouter.getStats() to track tier distribution and cost savings. Adjust
                  thresholds if you see imbalanced routing (e.g., 90% small, 1% medium).
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-brand-500" />
                  Tune Weights Incrementally
                </h4>
                <p className="text-sm text-muted-foreground">
                  When customizing weights, make small adjustments (±0.05) and test with
                  representative prompts. Large changes can lead to unstable routing.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-500" />
                  Validate Critical Prompts
                </h4>
                <p className="text-sm text-muted-foreground">
                  For mission-critical applications, manually review complexity scores for edge
                  cases. Consider using 'balanced' or 'quality-first' strategy for important tasks.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-500" />
                  Test with Real Prompts
                </h4>
                <p className="text-sm text-muted-foreground">
                  Before deploying, test the analyzer with at least 100 real prompts from your
                  application to ensure appropriate routing distribution and cost savings.
                </p>
              </div>
            </div>
          </Section>

          {/* Related APIs */}
          <Section id="related" title="Related Components & APIs" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/reference/api/model-router"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <GitBranch className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  ModelRouter
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cost-optimized model selection using ComplexityAnalyzer for smart routing
                </p>
              </Link>

              <Link
                href="/reference/hooks/use-model-router"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Code className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  useModelRouter
                </h3>
                <p className="text-sm text-muted-foreground">
                  React hook for client-side model routing with complexity analysis
                </p>
              </Link>

              <Link
                href="/cookbook/cost-optimization-strategies"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <TrendingDown className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Cost Optimization Strategies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete guide to reducing AI costs with smart routing and optimization
                </p>
              </Link>

              <Link
                href="/reference/types/routing-metrics"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Routing Metrics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track and analyze routing performance and cost savings
                </p>
              </Link>
            </div>
          </Section>

          {/* Accessibility */}
          <Section id="accessibility" title="Accessibility" className="mb-12">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Keyboard className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Server-Side Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ComplexityAnalyzer runs server-side and has no direct accessibility concerns.
                    Ensure UI components that display complexity results are accessible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Eye className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Transparent Results
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    When displaying model selection to users, provide clear explanations of why
                    a particular model was chosen. Include ARIA labels for routing indicators.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border/50">
            <Link
              href="/reference/api/batch-optimization"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Batch Optimization
            </Link>
            <Link
              href="/reference/api/model-router"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              ModelRouter
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
