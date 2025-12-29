'use client'

import { Check, X, Minus } from 'lucide-react'

const competitors = [
  { name: 'Clarity Chat', slug: 'clarity' },
  { name: 'assistant-ui', slug: 'assistant-ui' },
  { name: 'CopilotKit', slug: 'copilotkit' },
  { name: 'AI Elements', slug: 'ai-elements' },
  { name: '@llamaindex/chat-ui', slug: 'llamaindex' },
  { name: 'llm-ui', slug: 'llm-ui' },
] as const

type FeatureSupport = 'full' | 'partial' | 'none'

interface Feature {
  name: string
  category: string
  clarity: FeatureSupport
  'assistant-ui': FeatureSupport
  copilotkit: FeatureSupport
  'ai-elements': FeatureSupport
  llamaindex: FeatureSupport
  'llm-ui': FeatureSupport
}

const features: Feature[] = [
  // Core Features
  { name: 'One-line setup', category: 'Setup', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'full', 'ai-elements': 'partial', llamaindex: 'full', 'llm-ui': 'none' },
  { name: 'CLI installer', category: 'Setup', clarity: 'full', 'assistant-ui': 'partial', copilotkit: 'partial', 'ai-elements': 'full', llamaindex: 'full', 'llm-ui': 'none' },
  { name: 'AI SDK compatible', category: 'Setup', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'full', 'ai-elements': 'full', llamaindex: 'full', 'llm-ui': 'full' },

  // Streaming
  { name: 'SSE streaming', category: 'Streaming', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'full', 'ai-elements': 'full', llamaindex: 'full', 'llm-ui': 'full' },
  { name: '60fps smoothing', category: 'Streaming', clarity: 'full', 'assistant-ui': 'none', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'full' },
  { name: 'WebSocket support', category: 'Streaming', clarity: 'full', 'assistant-ui': 'partial', copilotkit: 'full', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },

  // Components
  { name: 'Drop-in chat', category: 'Components', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'full', 'ai-elements': 'partial', llamaindex: 'full', 'llm-ui': 'none' },
  { name: 'Composable primitives', category: 'Components', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'partial', 'ai-elements': 'partial', llamaindex: 'partial', 'llm-ui': 'full' },
  { name: 'Tool calling UI', category: 'Components', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'full', 'ai-elements': 'partial', llamaindex: 'partial', 'llm-ui': 'full' },
  { name: 'Mermaid diagrams', category: 'Components', clarity: 'full', 'assistant-ui': 'none', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },
  { name: 'LaTeX/math', category: 'Components', clarity: 'full', 'assistant-ui': 'partial', copilotkit: 'partial', 'ai-elements': 'partial', llamaindex: 'full', 'llm-ui': 'partial' },

  // Memory & Context
  { name: 'Memory strategies', category: 'Memory', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },
  { name: 'Token optimization', category: 'Memory', clarity: 'full', 'assistant-ui': 'none', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },
  { name: 'Context compression', category: 'Memory', clarity: 'full', 'assistant-ui': 'none', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'partial', 'llm-ui': 'none' },

  // Enterprise
  { name: 'RBAC', category: 'Enterprise', clarity: 'full', 'assistant-ui': 'partial', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },
  { name: 'Multi-tenancy', category: 'Enterprise', clarity: 'full', 'assistant-ui': 'partial', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },
  { name: 'Analytics', category: 'Enterprise', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'partial', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },

  // Performance
  { name: 'Virtualized lists', category: 'Performance', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },
  { name: 'Offline support', category: 'Performance', clarity: 'full', 'assistant-ui': 'none', copilotkit: 'none', 'ai-elements': 'none', llamaindex: 'none', 'llm-ui': 'none' },

  // Accessibility
  { name: 'WCAG AAA', category: 'Accessibility', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'partial', 'ai-elements': 'partial', llamaindex: 'partial', 'llm-ui': 'none' },
  { name: 'Keyboard nav', category: 'Accessibility', clarity: 'full', 'assistant-ui': 'full', copilotkit: 'partial', 'ai-elements': 'partial', llamaindex: 'partial', 'llm-ui': 'none' },
]

function FeatureIcon({ support }: { support: FeatureSupport }) {
  switch (support) {
    case 'full':
      return <Check className="w-5 h-5 text-green-500" />
    case 'partial':
      return <Minus className="w-5 h-5 text-yellow-500" />
    case 'none':
      return <X className="w-5 h-5 text-gray-300" />
  }
}

function FeatureCell({ support, isClarity }: { support: FeatureSupport; isClarity?: boolean }) {
  return (
    <td className={`px-4 py-3 text-center ${isClarity ? 'bg-brand-50 dark:bg-brand-950/30' : ''}`}>
      <div className="flex justify-center">
        <FeatureIcon support={support} />
      </div>
    </td>
  )
}

export default function WhyClarityPage() {
  const categories = [...new Set(features.map((f) => f.category))]

  return (
    <div className="container-docs py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
            Comparison
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            Why Clarity Chat?
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            See how Clarity Chat compares to other React AI chat libraries.
            We built what we needed—and couldn't find elsewhere.
          </p>
        </div>

        {/* Key Differentiators */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-2">Token Optimization</h3>
            <p className="text-sm text-text-secondary">
              Built-in memory compression and context management saves 60-90% on API costs.
              <strong className="block mt-2">No competitor has this.</strong>
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-lg mb-2">Ship Fast, Scale Later</h3>
            <p className="text-sm text-text-secondary">
              One line to working chat. Composable primitives when you need control.
              Enterprise features when you scale.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-bold text-lg mb-2">60fps Streaming</h3>
            <p className="text-sm text-text-secondary">
              Smooth character-by-character rendering like llm-ui, but integrated into a complete component library.
            </p>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-bg-secondary">
                <th className="px-4 py-4 text-left font-semibold">Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.slug}
                    className={`px-4 py-4 text-center font-semibold whitespace-nowrap ${
                      c.slug === 'clarity' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : ''
                    }`}
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <>
                  <tr key={`cat-${category}`} className="bg-bg-secondary/50">
                    <td colSpan={competitors.length + 1} className="px-4 py-2 font-semibold text-text-secondary text-xs uppercase tracking-wider">
                      {category}
                    </td>
                  </tr>
                  {features
                    .filter((f) => f.category === category)
                    .map((feature) => (
                      <tr key={feature.name} className="border-b border-border/50 hover:bg-bg-secondary/30">
                        <td className="px-4 py-3 font-medium">{feature.name}</td>
                        <FeatureCell support={feature.clarity} isClarity />
                        <FeatureCell support={feature['assistant-ui']} />
                        <FeatureCell support={feature.copilotkit} />
                        <FeatureCell support={feature['ai-elements']} />
                        <FeatureCell support={feature.llamaindex} />
                        <FeatureCell support={feature['llm-ui']} />
                      </tr>
                    ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-8 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Full support</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-yellow-500" />
            <span>Partial/basic</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-gray-300" />
            <span>Not supported</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to try it?</h2>
          <div className="flex justify-center gap-4">
            <a
              href="/learn/quick-start"
              className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors"
            >
              Get Started
            </a>
            <a
              href="https://github.com/christireid/Clarity-ai-chat-components"
              className="px-6 py-3 border border-border font-semibold rounded-lg hover:bg-bg-secondary transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
