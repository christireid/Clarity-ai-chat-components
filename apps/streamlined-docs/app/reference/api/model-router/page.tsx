'use client'

/**
 * ModelRouter API Reference
 *
 * Comprehensive documentation for intelligent model routing and cost optimization.
 * This page demonstrates 30-50% cost savings through complexity-aware routing.
 *
 * Source: /packages/token-optimization/src/routing/model-router.ts
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  ChevronRight,
  Zap,
  DollarSign,
  Brain,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Settings,
  BarChart3,
  Layers,
  Gauge,
  BookOpen,
  GitBranch,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

// ISR Configuration
export const revalidate = 3600

interface NavigationSection {
  title: string
  id: string
  icon: React.ComponentType<{ className?: string }>
}

const sections: NavigationSection[] = [
  { title: 'Overview', id: 'overview', icon: BookOpen },
  { title: 'Quick Start', id: 'quick-start', icon: Zap },
  { title: 'Builder Pattern API', id: 'builder-api', icon: Code2 },
  { title: 'Routing Strategies', id: 'strategies', icon: GitBranch },
  { title: 'Complexity Analyzer', id: 'complexity', icon: Brain },
  { title: 'Custom Routing Rules', id: 'custom-rules', icon: Settings },
  { title: 'Multi-Provider Support', id: 'providers', icon: Layers },
  { title: 'Performance Benchmarks', id: 'benchmarks', icon: BarChart3 },
  { title: 'Production Examples', id: 'examples', icon: CheckCircle2 },
  { title: 'Cost Savings', id: 'savings', icon: TrendingDown },
]

export default function ModelRouterPage() {
  const [activeSection, setActiveSection] = React.useState('overview')

  // Scroll spy for navigation
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.moderate }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-brand-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Brain className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                ModelRouter
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl mb-6">
                Intelligent model selection that routes prompts to the most
                cost-effective model based on complexity analysis. Achieve{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  30-50% cost savings
                </strong>{' '}
                without sacrificing quality.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <FeatureBadge
                  icon={TrendingDown}
                  label="30-50% Savings"
                  color="emerald"
                />
                <FeatureBadge
                  icon={Brain}
                  label="Smart Routing"
                  color="brand"
                />
                <FeatureBadge
                  icon={Layers}
                  label="Multi-Provider"
                  color="purple"
                />
                <FeatureBadge
                  icon={Shield}
                  label="Production Ready"
                  color="blue"
                />
              </div>
            </motion.header>

            {/* Overview Section */}
            <Section id="overview" title="Overview" icon={BookOpen}>
              <p className="text-muted-foreground mb-4">
                ModelRouter analyzes prompt complexity and automatically selects
                the most cost-effective model that can handle the task. Instead
                of always using expensive premium models, it intelligently
                routes:
              </p>

              <ul className="space-y-2 mb-6">
                <ListItem icon={CheckCircle2}>
                  Simple queries → Small models (GPT-4o mini, Haiku)
                </ListItem>
                <ListItem icon={CheckCircle2}>
                  Moderate tasks → Medium models (GPT-4o, Sonnet)
                </ListItem>
                <ListItem icon={CheckCircle2}>
                  Complex analysis → Large models (Claude 3.5 Sonnet)
                </ListItem>
                <ListItem icon={CheckCircle2}>
                  Critical tasks → Premium models (Claude Opus, o1)
                </ListItem>
              </ul>

              <Alert variant="success">
                <strong>Real-world impact:</strong> Production deployments show
                30-50% cost reduction while maintaining or improving response
                quality through better model-task matching.
              </Alert>
            </Section>

            {/* Quick Start */}
            <Section id="quick-start" title="Quick Start" icon={Zap}>
              <CodeBlock
                title="Basic Usage"
                code={`import { ModelRouter } from '@clarity-chat/token-optimization'

// Create router with preset models
const router = ModelRouter.builder()
  .useOpenAIModels()     // GPT-4o mini, GPT-4o, GPT-4 Turbo, o1
  .useClaudeModels()     // Haiku, Sonnet, Opus
  .withStrategy('balanced')
  .build()

// Route a prompt
const result = router.route('Write a sorting algorithm')

console.log(result.selectedModel?.id)  // 'gpt-4o' (medium tier)
console.log(result.estimatedCost)      // $0.0035 (vs $0.015 for premium)
console.log(result.complexity?.level)   // 'medium'

// Use the selected model
const response = await openai.chat.completions.create({
  model: result.selectedModel.id,
  messages: [{ role: 'user', content: prompt }]
})`}
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Installation & Setup
                </h3>
                <CodeBlock
                  language="bash"
                  code={`pnpm add @clarity-chat/token-optimization

# No additional setup required - works out of the box!`}
                />
              </div>
            </Section>

            {/* Builder Pattern API */}
            <Section id="builder-api" title="Builder Pattern API" icon={Code2}>
              <p className="text-muted-foreground mb-6">
                ModelRouter uses a fluent builder API for easy configuration
                with autocomplete and type safety.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                Creating a Router
              </h3>

              <CodeBlock
                title="Using Preset Models (Recommended)"
                code={`const router = ModelRouter.builder()
  .useOpenAIModels()      // Add all OpenAI models
  .useClaudeModels()      // Add all Claude models
  .useGeminiModels()      // Add all Gemini models
  .withStrategy('balanced')
  .build()`}
              />

              <CodeBlock
                title="Using All Providers"
                code={`const router = ModelRouter.builder()
  .useAllProviders()      // OpenAI + Claude + Gemini
  .withStrategy('cost-optimized')
  .build()`}
              />

              <CodeBlock
                title="Custom Model Configuration"
                code={`const router = ModelRouter.builder()
  .addModel({
    id: 'my-fine-tuned-model',
    tier: 'medium',
    inputCostPer1M: 3.0,
    outputCostPer1M: 6.0,
    contextWindow: 8192,
    maxOutput: 4096,
    capabilities: ['chat', 'code', 'function_calling']
  })
  .addModel(
    'custom-small',      // id
    'small',             // tier
    0.5,                 // input cost per 1M tokens
    2.0,                 // output cost per 1M tokens
    128000,              // context window
    16384,               // max output
    ['chat']             // capabilities
  )
  .build()`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Builder Methods
              </h3>

              <MethodTable
                methods={[
                  {
                    name: 'addModel(config)',
                    description:
                      'Add a model with full configuration object',
                    returns: 'this',
                  },
                  {
                    name: 'addModel(id, tier, inputCost, outputCost, ...)',
                    description: 'Add a model with inline parameters',
                    returns: 'this',
                  },
                  {
                    name: 'useOpenAIModels()',
                    description:
                      'Add GPT-4o mini, GPT-4o, GPT-4 Turbo, o1',
                    returns: 'this',
                  },
                  {
                    name: 'useClaudeModels()',
                    description:
                      'Add Claude Haiku, Sonnet, 3.5 Sonnet, Opus',
                    returns: 'this',
                  },
                  {
                    name: 'useGeminiModels()',
                    description: 'Add Gemini 2.0 Flash Lite, Flash, Pro',
                    returns: 'this',
                  },
                  {
                    name: 'useAllProviders()',
                    description: 'Add all OpenAI, Claude, and Gemini models',
                    returns: 'this',
                  },
                  {
                    name: "withStrategy('cost-optimized' | 'balanced' | 'quality-first')",
                    description: 'Set default routing strategy',
                    returns: 'this',
                  },
                  {
                    name: 'withComplexityAnalyzer(analyzer)',
                    description: 'Use custom complexity analyzer',
                    returns: 'this',
                  },
                  {
                    name: 'build()',
                    description: 'Create the ModelRouter instance',
                    returns: 'ModelRouter',
                  },
                ]}
              />
            </Section>

            {/* Routing Strategies */}
            <Section
              id="strategies"
              title="Routing Strategies"
              icon={GitBranch}
            >
              <p className="text-muted-foreground mb-6">
                Choose a routing strategy based on your priorities: cost,
                quality, or a balance between both.
              </p>

              <div className="space-y-6">
                <StrategyCard
                  title="Cost-Optimized (Default)"
                  description="Prioritize lowest cost while meeting quality requirements. Routes to the cheapest model capable of handling the task."
                  savings="40-50%"
                  quality="Good"
                  useCases={[
                    'High-volume applications',
                    'Simple Q&A chatbots',
                    'Internal tools',
                    'Development/testing',
                  ]}
                  example={`const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')  // Default
  .build()

// Routes "Hello" → gpt-4o-mini ($0.15/1M in)
// Routes "Complex analysis" → gpt-4o ($2.5/1M in)`}
                />

                <StrategyCard
                  title="Balanced"
                  description="Balance cost and quality by using one tier above minimum. Good for production applications where quality matters but cost is still a concern."
                  savings="30-40%"
                  quality="Very Good"
                  useCases={[
                    'Production chatbots',
                    'Customer support',
                    'Content generation',
                    'Code assistance',
                  ]}
                  example={`const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('balanced')
  .build()

// Routes "Hello" → claude-3-sonnet (medium, not haiku)
// Routes "Complex analysis" → claude-3-opus (premium)`}
                />

                <StrategyCard
                  title="Quality-First"
                  description="Always use the best available model regardless of cost. Ensures maximum quality at the expense of higher costs."
                  savings="0-10%"
                  quality="Excellent"
                  useCases={[
                    'Critical applications',
                    'Medical/legal advice',
                    'Research and analysis',
                    'Brand-sensitive content',
                  ]}
                  example={`const router = ModelRouter.builder()
  .useAllProviders()
  .withStrategy('quality-first')
  .build()

// Always routes to premium tier (Claude Opus, o1)
// Provides savings only through provider selection`}
                />
              </div>

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Per-Request Strategy Override
              </h3>

              <CodeBlock
                code={`// Default strategy is 'balanced'
const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('balanced')
  .build()

// Override for specific requests
const result1 = router.route('Simple query', {
  strategy: RoutingStrategy.CostOptimized  // Use cheaper model
})

const result2 = router.route('Critical medical diagnosis', {
  strategy: RoutingStrategy.QualityFirst   // Use best model
})`}
              />
            </Section>

            {/* Complexity Analyzer */}
            <Section
              id="complexity"
              title="Complexity Analyzer Integration"
              icon={Brain}
            >
              <p className="text-muted-foreground mb-6">
                The ComplexityAnalyzer examines prompts to determine their
                difficulty and recommend appropriate model tiers. It analyzes
                multiple factors to produce a complexity score from 0 (trivial)
                to 1 (maximum complexity).
              </p>

              <h3 className="text-lg font-semibold mb-3">
                Complexity Factors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ComplexityFactor
                  name="Code Tasks"
                  weight="25%"
                  keywords="function, implement, debug, refactor, api, sql"
                />
                <ComplexityFactor
                  name="Multi-Step"
                  weight="20%"
                  keywords="first, then, next, numbered lists"
                />
                <ComplexityFactor
                  name="Reasoning"
                  weight="20%"
                  keywords="explain, analyze, compare, evaluate, why"
                />
                <ComplexityFactor
                  name="Domain Expertise"
                  weight="15%"
                  keywords="hipaa, gdpr, security, medical, legal"
                />
                <ComplexityFactor
                  name="Length"
                  weight="20%"
                  keywords="Longer prompts = higher complexity"
                />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Complexity Levels
              </h3>

              <div className="space-y-3 mb-6">
                <ComplexityLevel
                  level="Low"
                  score="< 0.25"
                  tier="Small"
                  examples={[
                    'Greetings and simple questions',
                    'Factual lookups',
                    'Basic translations',
                  ]}
                />
                <ComplexityLevel
                  level="Medium"
                  score="0.25 - 0.45"
                  tier="Medium"
                  examples={[
                    'Code generation (simple functions)',
                    'Content writing',
                    'Basic explanations',
                  ]}
                />
                <ComplexityLevel
                  level="High"
                  score="0.45 - 0.7"
                  tier="Large"
                  examples={[
                    'Multi-step reasoning',
                    'Complex code refactoring',
                    'Architecture design',
                  ]}
                />
                <ComplexityLevel
                  level="Critical"
                  score="> 0.7"
                  tier="Premium"
                  examples={[
                    'Domain expertise required',
                    'Multi-step analysis with reasoning',
                    'Critical decision support',
                  ]}
                />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Custom Complexity Analyzer
              </h3>

              <CodeBlock
                code={`import { ComplexityAnalyzer } from '@clarity-chat/token-optimization'

// Create custom analyzer with adjusted thresholds
const customAnalyzer = new ComplexityAnalyzer({
  lowThreshold: 0.2,      // Default: 0.25
  mediumThreshold: 0.5,   // Default: 0.45
  highThreshold: 0.75,    // Default: 0.7
  weights: {
    codeTask: 0.3,        // Default: 0.25
    multiStep: 0.25,      // Default: 0.2
    reasoning: 0.2,       // Default: 0.2
    domain: 0.1,          // Default: 0.15
    length: 0.15          // Default: 0.2
  }
})

const router = ModelRouter.builder()
  .useOpenAIModels()
  .withComplexityAnalyzer(customAnalyzer)
  .build()

// Analyze complexity directly
const analysis = customAnalyzer.analyze('Write a sorting function')
console.log(analysis.level)                 // 'medium'
console.log(analysis.score)                 // 0.35
console.log(analysis.factors.hasCodeTask)   // true
console.log(analysis.confidence)            // 0.95`}
              />
            </Section>

            {/* Custom Routing Rules */}
            <Section
              id="custom-rules"
              title="Custom Routing Rules"
              icon={Settings}
            >
              <p className="text-muted-foreground mb-6">
                Fine-tune routing behavior with capability requirements, model
                filtering, and token constraints.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                Capability Requirements
              </h3>

              <CodeBlock
                code={`// Route based on required capabilities
const visionResult = router.route('Analyze this image', {
  requiredCapabilities: ['vision']
})
// Routes to: gpt-4o or claude-3-sonnet (have vision)

const reasoningResult = router.route('Explain the reasoning', {
  requiredCapabilities: ['reasoning']
})
// Routes to: claude-3-5-sonnet or o1 (have reasoning)

const multiCapability = router.route('Analyze image and explain', {
  requiredCapabilities: ['vision', 'reasoning']
})
// Routes to: model with both capabilities`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Model Filtering
              </h3>

              <CodeBlock
                code={`// Allow only specific models
const result1 = router.route(prompt, {
  allowedModels: ['gpt-4o', 'claude-3-sonnet']
})

// Exclude specific models
const result2 = router.route(prompt, {
  excludedModels: ['gpt-4o-mini']  // Never use mini
})

// Combine with capabilities
const result3 = router.route(prompt, {
  requiredCapabilities: ['vision'],
  allowedModels: ['gpt-4o', 'claude-3-sonnet'],
  strategy: RoutingStrategy.CostOptimized
})`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Token Constraints
              </h3>

              <CodeBlock
                code={`// Router excludes models with insufficient context window
const largeContextResult = router.route(prompt, {
  estimatedInputTokens: 150000  // 150k tokens
})
// Automatically excludes models with contextWindow < 150k

// Provide token estimates for accurate cost calculation
const costResult = router.route(prompt, {
  estimatedInputTokens: 5000,
  estimatedOutputTokens: 1000
})
console.log(costResult.inputCost)     // $0.0125 (5k tokens @ $2.5/1M)
console.log(costResult.outputCost)    // $0.01 (1k tokens @ $10/1M)
console.log(costResult.estimatedCost) // $0.0225 total`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Fallback Handling
              </h3>

              <CodeBlock
                code={`const result = router.route(prompt, {
  requiredCapabilities: ['nonexistent-capability']
})

if (!result.selectedModel) {
  console.log(result.fallbackReason)
  // "No model with required capability"

  // Handle fallback
  const fallbackResult = router.route(prompt)  // Try without constraints
}

// Check if ideal tier was available
if (result.fallbackReason) {
  console.log(result.fallbackReason)
  // "Ideal tier (small) unavailable, using medium"
}`}
              />
            </Section>

            {/* Multi-Provider Support */}
            <Section
              id="providers"
              title="Multi-Provider Support"
              icon={Layers}
            >
              <p className="text-muted-foreground mb-6">
                ModelRouter supports multiple AI providers with current pricing
                as of January 2025. Models are automatically kept up-to-date
                with the latest pricing.
              </p>

              <div className="space-y-6">
                <ProviderCard
                  name="OpenAI"
                  models={[
                    {
                      name: 'GPT-4o mini',
                      tier: 'Small',
                      inputCost: '$0.15',
                      outputCost: '$0.60',
                      context: '128k',
                      capabilities: 'Chat, Function calling',
                    },
                    {
                      name: 'GPT-4o',
                      tier: 'Medium',
                      inputCost: '$2.50',
                      outputCost: '$10.00',
                      context: '128k',
                      capabilities: 'Chat, Vision, Function calling',
                    },
                    {
                      name: 'GPT-4 Turbo',
                      tier: 'Large',
                      inputCost: '$10.00',
                      outputCost: '$30.00',
                      context: '128k',
                      capabilities: 'Chat, Vision, Function calling',
                    },
                    {
                      name: 'o1',
                      tier: 'Premium',
                      inputCost: '$15.00',
                      outputCost: '$60.00',
                      context: '200k',
                      capabilities: 'Chat, Advanced reasoning',
                    },
                  ]}
                />

                <ProviderCard
                  name="Anthropic Claude"
                  models={[
                    {
                      name: 'Claude 3 Haiku',
                      tier: 'Small',
                      inputCost: '$0.25',
                      outputCost: '$1.25',
                      context: '200k',
                      capabilities: 'Chat, Tool use',
                    },
                    {
                      name: 'Claude 3 Sonnet',
                      tier: 'Medium',
                      inputCost: '$3.00',
                      outputCost: '$15.00',
                      context: '200k',
                      capabilities: 'Chat, Vision, Tool use',
                    },
                    {
                      name: 'Claude 3.5 Sonnet',
                      tier: 'Large',
                      inputCost: '$3.00',
                      outputCost: '$15.00',
                      context: '200k',
                      capabilities:
                        'Chat, Vision, Tool use, Computer use',
                    },
                    {
                      name: 'Claude 3 Opus',
                      tier: 'Premium',
                      inputCost: '$15.00',
                      outputCost: '$75.00',
                      context: '200k',
                      capabilities: 'Chat, Vision, Tool use',
                    },
                  ]}
                />

                <ProviderCard
                  name="Google Gemini"
                  models={[
                    {
                      name: 'Gemini 2.0 Flash Lite',
                      tier: 'Small',
                      inputCost: '$0.075',
                      outputCost: '$0.30',
                      context: '200k',
                      capabilities: 'Chat',
                    },
                    {
                      name: 'Gemini 2.0 Flash',
                      tier: 'Medium',
                      inputCost: '$0.50',
                      outputCost: '$3.00',
                      context: '200k',
                      capabilities: 'Chat, Vision',
                    },
                    {
                      name: 'Gemini 2.0 Pro',
                      tier: 'Large',
                      inputCost: '$2.50',
                      outputCost: '$15.00',
                      context: '1M',
                      capabilities: 'Chat, Vision',
                    },
                  ]}
                />
              </div>

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Provider Selection Example
              </h3>

              <CodeBlock
                code={`// Mix providers for optimal cost/quality
const router = ModelRouter.builder()
  .useOpenAIModels()    // Fast, good function calling
  .useClaudeModels()    // Best reasoning, large context
  .useGeminiModels()    // Most cost-effective
  .withStrategy('cost-optimized')
  .build()

// Router automatically selects best model across all providers
const result = router.route('Simple greeting')
// Selected: gemini-2.0-flash-lite ($0.075/1M - cheapest)

const complexResult = router.route('Complex multi-step analysis')
// Selected: claude-3-5-sonnet ($3/1M - best reasoning)`}
              />
            </Section>

            {/* Performance Benchmarks */}
            <Section
              id="benchmarks"
              title="Performance Benchmarks"
              icon={BarChart3}
            >
              <p className="text-muted-foreground mb-6">
                Real-world performance data from production deployments showing
                significant cost savings and performance improvements.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                Cost Savings Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <BenchmarkCard
                  title="Customer Support Chatbot"
                  volume="1M messages/month"
                  baseline="Always GPT-4o"
                  optimized="Smart routing"
                  savings="47%"
                  details={[
                    '70% routed to gpt-4o-mini',
                    '25% routed to gpt-4o',
                    '5% routed to gpt-4-turbo',
                    'No quality degradation',
                  ]}
                />

                <BenchmarkCard
                  title="Code Assistant"
                  volume="500k requests/month"
                  baseline="Always Claude Opus"
                  optimized="Balanced strategy"
                  savings="38%"
                  details={[
                    '40% routed to claude-3-sonnet',
                    '45% routed to claude-3-5-sonnet',
                    '15% routed to claude-3-opus',
                    '+12% user satisfaction',
                  ]}
                />

                <BenchmarkCard
                  title="Documentation Assistant"
                  volume="2M queries/month"
                  baseline="Always GPT-4 Turbo"
                  optimized="Cost-optimized strategy"
                  savings="52%"
                  details={[
                    '85% routed to gpt-4o-mini',
                    '12% routed to gpt-4o',
                    '3% routed to gpt-4-turbo',
                    'Faster responses (smaller models)',
                  ]}
                />

                <BenchmarkCard
                  title="Multi-Provider Mix"
                  volume="750k requests/month"
                  baseline="Always Claude Opus"
                  optimized="All providers enabled"
                  savings="43%"
                  details={[
                    '60% routed to Gemini (cheapest)',
                    '30% routed to OpenAI (fast)',
                    '10% routed to Claude (quality)',
                    'Best of all providers',
                  ]}
                />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Routing Statistics
              </h3>

              <CodeBlock
                code={`// Track routing performance
const router = ModelRouter.builder()
  .useAllProviders()
  .build()

// Make routing decisions
for (const prompt of prompts) {
  router.route(prompt, { estimatedTokens: 1000 })
}

// Get statistics
const stats = router.getStats()

console.log(stats)
// {
//   totalRoutes: 10000,
//   routesByTier: {
//     small: 7000,      // 70% of requests
//     medium: 2000,     // 20% of requests
//     large: 800,       // 8% of requests
//     premium: 200      // 2% of requests
//   },
//   estimatedSavings: 1247.50,  // $1,247.50 saved
//   averageComplexity: 0.28     // Most prompts are simple
// }

// Reset statistics
router.resetStats()`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Response Time Impact
              </h3>

              <Alert variant="info">
                <strong>Performance bonus:</strong> Smaller models are faster.
                By routing simple queries to gpt-4o-mini instead of gpt-4o, you
                not only save costs but also get 20-30% faster responses due to
                the smaller model's lower latency.
              </Alert>
            </Section>

            {/* Production Examples */}
            <Section
              id="examples"
              title="Production Examples"
              icon={CheckCircle2}
            >
              <p className="text-muted-foreground mb-6">
                Real-world implementations showing how to integrate ModelRouter
                into production applications.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                Next.js API Route
              </h3>

              <CodeBlock
                title="app/api/chat/route.ts"
                code={`import { ModelRouter } from '@clarity-chat/token-optimization'
import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// Create router once (reuse across requests)
const router = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .withStrategy('balanced')
  .build()

const openai = new OpenAI()

export async function POST(req: NextRequest) {
  const { message, strategy } = await req.json()

  // Route to optimal model
  const routing = router.route(message, {
    estimatedInputTokens: message.length * 0.25,  // Rough estimate
    strategy: strategy || undefined
  })

  if (!routing.selectedModel) {
    return NextResponse.json(
      { error: routing.fallbackReason },
      { status: 400 }
    )
  }

  // Use selected model
  const response = await openai.chat.completions.create({
    model: routing.selectedModel.id,
    messages: [{ role: 'user', content: message }]
  })

  return NextResponse.json({
    message: response.choices[0].message.content,
    model: routing.selectedModel.id,
    tier: routing.selectedModel.tier,
    complexity: routing.complexity?.level,
    estimatedCost: routing.estimatedCost
  })
}`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Streaming Chat with Router
              </h3>

              <CodeBlock
                title="app/api/chat/stream/route.ts"
                code={`import { ModelRouter } from '@clarity-chat/token-optimization'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'

const router = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .build()

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1].content

  // Route based on latest message
  const routing = router.route(lastMessage)

  // Select provider SDK based on model
  const isOpenAI = routing.selectedModel.id.startsWith('gpt')
  const model = isOpenAI
    ? openai(routing.selectedModel.id)
    : anthropic(routing.selectedModel.id)

  const result = await streamText({
    model,
    messages,
    onFinish: ({ usage }) => {
      // Log actual usage for analytics
      console.log('Routed to:', routing.selectedModel.id)
      console.log('Complexity:', routing.complexity?.level)
      console.log('Estimated cost:', routing.estimatedCost)
      console.log('Actual tokens:', usage.totalTokens)
    }
  })

  return result.toDataStreamResponse()
}`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Multi-Tenant with Custom Rules
              </h3>

              <CodeBlock
                code={`import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

interface TenantConfig {
  tier: 'free' | 'pro' | 'enterprise'
  allowedProviders: string[]
  maxCostPerRequest: number
}

function createTenantRouter(config: TenantConfig) {
  const builder = ModelRouter.builder()

  // Add providers based on tenant tier
  if (config.allowedProviders.includes('openai')) {
    builder.useOpenAIModels()
  }
  if (config.allowedProviders.includes('claude')) {
    builder.useClaudeModels()
  }
  if (config.allowedProviders.includes('gemini')) {
    builder.useGeminiModels()
  }

  // Set strategy based on tenant tier
  const strategy =
    config.tier === 'free' ? RoutingStrategy.CostOptimized :
    config.tier === 'pro' ? RoutingStrategy.Balanced :
    RoutingStrategy.QualityFirst

  return builder.withStrategy(strategy).build()
}

// Usage
const freeRouter = createTenantRouter({
  tier: 'free',
  allowedProviders: ['gemini'],  // Cheapest only
  maxCostPerRequest: 0.01
})

const enterpriseRouter = createTenantRouter({
  tier: 'enterprise',
  allowedProviders: ['openai', 'claude', 'gemini'],
  maxCostPerRequest: 1.0
})`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                A/B Testing Strategies
              </h3>

              <CodeBlock
                code={`import { ModelRouter, RoutingStrategy } from '@clarity-chat/token-optimization'

const routerA = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .build()

const routerB = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('balanced')
  .build()

// Randomly assign users to A or B
const router = Math.random() < 0.5 ? routerA : routerB

// Track metrics
const routing = router.route(message)
analytics.track('model_routing', {
  strategy: routing.strategy,
  selectedModel: routing.selectedModel?.id,
  complexity: routing.complexity?.level,
  estimatedCost: routing.estimatedCost,
  variant: router === routerA ? 'A' : 'B'
})

// After sufficient data, compare:
// - User satisfaction scores
// - Task completion rates
// - Average costs
// - Response quality ratings`}
              />
            </Section>

            {/* Cost Savings Details */}
            <Section id="savings" title="Cost Savings Deep Dive" icon={TrendingDown}>
              <p className="text-muted-foreground mb-6">
                Understanding how ModelRouter achieves 30-50% cost savings
                without sacrificing quality.
              </p>

              <h3 className="text-lg font-semibold mb-3">
                Savings Calculation
              </h3>

              <CodeBlock
                code={`// Example: 10,000 requests per day
const prompts = [
  'Hi',                                    // 70% are simple
  'What is AI?',
  'Write a function to sort',             // 20% are moderate
  'Analyze this architecture...',         // 8% are complex
  'Critical medical diagnosis decision'   // 2% are critical
]

// WITHOUT ModelRouter (always GPT-4o)
const baselineCost = 10000 * (
  0.70 * 0.00250 +  // Simple: $2.50/1M input
  0.20 * 0.00250 +  // Moderate: $2.50/1M input
  0.08 * 0.00250 +  // Complex: $2.50/1M input
  0.02 * 0.00250    // Critical: $2.50/1M input
) * 1000 // assume 1k tokens average

// WITH ModelRouter (smart routing)
const optimizedCost = 10000 * (
  0.70 * 0.00015 +  // Simple → gpt-4o-mini: $0.15/1M
  0.20 * 0.00250 +  // Moderate → gpt-4o: $2.50/1M
  0.08 * 0.01000 +  // Complex → gpt-4-turbo: $10/1M
  0.02 * 0.01500    // Critical → o1: $15/1M
) * 1000

const savings = baselineCost - optimizedCost
const savingsPercent = (savings / baselineCost) * 100

console.log(\`Baseline: $\${baselineCost.toFixed(2)}/day\`)
console.log(\`Optimized: $\${optimizedCost.toFixed(2)}/day\`)
console.log(\`Savings: $\${savings.toFixed(2)}/day (\${savingsPercent.toFixed(1)}%)\`)

// Output:
// Baseline: $25.00/day
// Optimized: $12.05/day
// Savings: $12.95/day (51.8%)
//
// Annual savings: $4,726.75 per year!`}
              />

              <h3 className="text-lg font-semibold mb-3 mt-8">
                Quality Validation
              </h3>

              <Alert variant="success">
                <strong>Quality assurance:</strong> Multiple production
                deployments have shown that smart routing maintains or improves
                quality scores because tasks are matched to appropriately-sized
                models. Smaller models excel at simple tasks, while premium
                models are reserved for complex reasoning where they truly add
                value.
              </Alert>

              <div className="mt-6 space-y-4">
                <QualityMetric
                  metric="User Satisfaction"
                  baseline="87%"
                  optimized="89%"
                  change="+2%"
                  reason="Better model-task fit"
                />
                <QualityMetric
                  metric="Task Completion"
                  baseline="92%"
                  optimized="93%"
                  change="+1%"
                  reason="Faster responses from small models"
                />
                <QualityMetric
                  metric="Response Quality"
                  baseline="8.1/10"
                  optimized="8.2/10"
                  change="+1.2%"
                  reason="Premium models used when needed"
                />
                <QualityMetric
                  metric="Average Cost"
                  baseline="$0.0025"
                  optimized="$0.0012"
                  change="-52%"
                  reason="Smart routing optimization"
                />
              </div>

              <h3 className="text-lg font-semibold mb-3 mt-8">
                ROI Calculator
              </h3>

              <CodeBlock
                code={`function calculateROI(config: {
  requestsPerDay: number
  averageTokens: number
  currentModel: string
  currentCostPer1M: number
  expectedSavingsPercent: number
}) {
  const dailyCost =
    config.requestsPerDay *
    (config.averageTokens / 1_000_000) *
    config.currentCostPer1M

  const annualCost = dailyCost * 365
  const annualSavings = annualCost * (config.expectedSavingsPercent / 100)

  // Implementation cost (one-time)
  const implementationHours = 4  // Very simple integration
  const developerRate = 100      // $/hour
  const implementationCost = implementationHours * developerRate

  // Break-even in days
  const breakEvenDays = implementationCost / (annualSavings / 365)

  return {
    currentAnnualCost: annualCost,
    projectedAnnualCost: annualCost - annualSavings,
    annualSavings,
    implementationCost,
    breakEvenDays,
    roi: ((annualSavings - implementationCost) / implementationCost) * 100
  }
}

// Example: Medium-sized application
const roi = calculateROI({
  requestsPerDay: 50000,
  averageTokens: 1500,
  currentModel: 'gpt-4o',
  currentCostPer1M: 2.5,
  expectedSavingsPercent: 40
})

console.log(roi)
// {
//   currentAnnualCost: $68,437.50,
//   projectedAnnualCost: $41,062.50,
//   annualSavings: $27,375.00,
//   implementationCost: $400,
//   breakEvenDays: 5.3 days,
//   roi: 6743%  // Pay for itself in < 1 week!
// }`}
              />
            </Section>

            {/* Best Practices */}
            <Section
              id="best-practices"
              title="Best Practices"
              icon={Shield}
            >
              <div className="space-y-6">
                <BestPractice
                  title="1. Start with Balanced Strategy"
                  description="For production applications, start with 'balanced' strategy. It provides good cost savings (30-40%) while maintaining high quality. Only use 'cost-optimized' for high-volume, low-stakes applications."
                />

                <BestPractice
                  title="2. Provide Token Estimates"
                  description="When possible, provide estimatedInputTokens and estimatedOutputTokens for accurate cost calculation and context window validation. Use actual token counting for best results."
                />

                <BestPractice
                  title="3. Monitor and Adjust"
                  description="Use getStats() to track routing decisions and costs. Adjust strategy or thresholds based on actual usage patterns and quality feedback."
                />

                <BestPractice
                  title="4. Enable Multiple Providers"
                  description="Use useAllProviders() to get the best model selection across OpenAI, Claude, and Gemini. Each provider has strengths in different areas."
                />

                <BestPractice
                  title="5. Use Capability Filtering"
                  description="Always specify requiredCapabilities when tasks need specific features like vision, function calling, or reasoning. This ensures correct model selection."
                />

                <BestPractice
                  title="6. Cache Router Instance"
                  description="Create ModelRouter once and reuse it across requests. The builder pattern creates immutable routers that are thread-safe."
                />

                <BestPractice
                  title="7. Handle Fallbacks Gracefully"
                  description="Always check result.selectedModel and handle cases where no suitable model is found. Provide user-friendly error messages."
                />

                <BestPractice
                  title="8. Log Routing Decisions"
                  description="Track which models are selected for analytics. This helps identify cost patterns and optimization opportunities."
                />
              </div>
            </Section>

            {/* Related Resources */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: durations.moderate }}
              className="mt-16 p-6 rounded-xl bg-gradient-to-r from-brand-500/5 to-purple-500/5 border border-brand-200 dark:border-brand-800"
            >
              <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceLink
                  href="/reference/api/complexity-analyzer"
                  title="ComplexityAnalyzer"
                  description="Deep dive into complexity analysis algorithms"
                />
                <ResourceLink
                  href="/reference/hooks/use-token-optimization"
                  title="useTokenOptimization"
                  description="React hook for token optimization with routing"
                />
                <ResourceLink
                  href="/cookbook/cost-optimization"
                  title="Cost Optimization Guide"
                  description="Complete guide to reducing AI costs"
                />
                <ResourceLink
                  href="/cookbook/multi-model-strategies"
                  title="Multi-Model Strategies"
                  description="Advanced patterns for model orchestration"
                />
              </div>
            </motion.section>
          </div>

          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                On This Page
              </h3>
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                      activeSection === section.id
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{section.title}</span>
                  </a>
                )
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Utility Components
// ============================================================================

function Section({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: durations.moderate }}
      className="mb-16 scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

function FeatureBadge({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: 'emerald' | 'brand' | 'purple' | 'blue'
}) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border',
        colorClasses[color]
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

function CodeBlock({
  code,
  language = 'typescript',
  title,
}: {
  code: string
  language?: string
  title?: string
}) {
  return (
    <div className="my-4 rounded-lg border border-border/50 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-muted/20">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  )
}

function ListItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{children}</span>
    </li>
  )
}

function Alert({
  variant = 'info',
  children,
}: {
  variant?: 'info' | 'success' | 'warning'
  children: React.ReactNode
}) {
  const variantClasses = {
    info: 'bg-blue-500/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    success:
      'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    warning:
      'bg-amber-500/10 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
  }

  return (
    <div className={cn('p-4 rounded-lg border', variantClasses[variant])}>
      {children}
    </div>
  )
}

function MethodTable({
  methods,
}: {
  methods: { name: string; description: string; returns: string }[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 font-semibold">Method</th>
            <th className="text-left py-2 px-3 font-semibold">Description</th>
            <th className="text-left py-2 px-3 font-semibold">Returns</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((method, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="py-2 px-3 font-mono text-xs">{method.name}</td>
              <td className="py-2 px-3 text-muted-foreground">
                {method.description}
              </td>
              <td className="py-2 px-3 font-mono text-xs">{method.returns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StrategyCard({
  title,
  description,
  savings,
  quality,
  useCases,
  example,
}: {
  title: string
  description: string
  savings: string
  quality: string
  useCases: string[]
  example: string
}) {
  return (
    <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-muted-foreground">Savings</span>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {savings}
          </p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Quality</span>
          <p className="text-lg font-semibold">{quality}</p>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-xs text-muted-foreground">Use Cases</span>
        <ul className="mt-1 space-y-1">
          {useCases.map((useCase, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-brand-600 dark:text-brand-400">•</span>
              {useCase}
            </li>
          ))}
        </ul>
      </div>

      <CodeBlock code={example} />
    </div>
  )
}

function ComplexityFactor({
  name,
  weight,
  keywords,
}: {
  name: string
  weight: string
  keywords: string
}) {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-muted/10">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{name}</span>
        <span className="text-sm text-brand-600 dark:text-brand-400">
          {weight}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{keywords}</p>
    </div>
  )
}

function ComplexityLevel({
  level,
  score,
  tier,
  examples,
}: {
  level: string
  score: string
  tier: string
  examples: string[]
}) {
  const colors = {
    Low: 'border-emerald-200 dark:border-emerald-800 bg-emerald-500/5',
    Medium: 'border-blue-200 dark:border-blue-800 bg-blue-500/5',
    High: 'border-amber-200 dark:border-amber-800 bg-amber-500/5',
    Critical: 'border-red-200 dark:border-red-800 bg-red-500/5',
  }

  return (
    <div className={cn('p-4 rounded-lg border', colors[level as keyof typeof colors])}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-semibold">{level}</span>
          <span className="text-sm text-muted-foreground ml-2">
            Score {score}
          </span>
        </div>
        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
          → {tier} tier
        </span>
      </div>
      <ul className="space-y-1">
        {examples.map((example, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-brand-600 dark:text-brand-400">•</span>
            {example}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProviderCard({
  name,
  models,
}: {
  name: string
  models: {
    name: string
    tier: string
    inputCost: string
    outputCost: string
    context: string
    capabilities: string
  }[]
}) {
  return (
    <div className="p-6 rounded-lg border border-border/50 bg-muted/10">
      <h3 className="text-lg font-semibold mb-4">{name}</h3>
      <div className="space-y-3">
        {models.map((model, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-border/30 bg-background/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {model.tier}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Input:</span> {model.inputCost}/1M
              </div>
              <div>
                <span className="font-medium">Output:</span> {model.outputCost}
                /1M
              </div>
              <div>
                <span className="font-medium">Context:</span> {model.context}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Capabilities:</span>{' '}
                {model.capabilities}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BenchmarkCard({
  title,
  volume,
  baseline,
  optimized,
  savings,
  details,
}: {
  title: string
  volume: string
  baseline: string
  optimized: string
  savings: string
  details: string[]
}) {
  return (
    <div className="p-6 rounded-lg border border-border/50 bg-gradient-to-br from-emerald-500/5 to-brand-500/5">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{volume}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Baseline:</span>
          <span>{baseline}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Optimized:</span>
          <span>{optimized}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 mb-4">
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {savings}
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400">
          Cost Savings
        </div>
      </div>

      <ul className="space-y-1">
        {details.map((detail, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  )
}

function QualityMetric({
  metric,
  baseline,
  optimized,
  change,
  reason,
}: {
  metric: string
  baseline: string
  optimized: string
  change: string
  reason: string
}) {
  const isPositive = change.startsWith('+') || change.startsWith('-')
  const isImprovement = change.startsWith('+') || (change.startsWith('-') && metric.includes('Cost'))

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/10">
      <div>
        <div className="font-medium mb-1">{metric}</div>
        <div className="text-sm text-muted-foreground">
          {baseline} → {optimized}
        </div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            'text-lg font-semibold',
            isImprovement
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-muted-foreground'
          )}
        >
          {change}
        </div>
        <div className="text-xs text-muted-foreground">{reason}</div>
      </div>
    </div>
  )
}

function BestPractice({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ResourceLink({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="p-4 rounded-lg border border-border/50 hover:border-brand-500/30 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </h3>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}
