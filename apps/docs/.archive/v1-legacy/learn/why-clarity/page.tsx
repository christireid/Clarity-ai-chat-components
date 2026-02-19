import { Metadata } from 'next'
import Link from 'next/link'
import { LIBRARY_STATS } from '@/lib/library-stats'

export const metadata: Metadata = {
  title: 'Why Clarity Chat - Comparison & Benefits',
  description:
    'Compare Clarity Chat to alternatives. See why teams choose Clarity for building AI chat interfaces.',
}

const features = [
  {
    name: 'Components',
    clarity: LIBRARY_STATS.components,
    vercelAI: '~10',
    chatUI: '~15',
    custom: '0',
  },
  {
    name: 'Hooks',
    clarity: LIBRARY_STATS.hooks,
    vercelAI: '~5',
    chatUI: '~3',
    custom: '0',
  },
  {
    name: 'Themes',
    clarity: String(LIBRARY_STATS.themes),
    vercelAI: '1',
    chatUI: '2',
    custom: '0',
  },
  {
    name: 'TypeScript',
    clarity: 'Full',
    vercelAI: 'Full',
    chatUI: 'Partial',
    custom: 'Varies',
  },
  {
    name: 'Streaming',
    clarity: 'SSE + WebSocket',
    vercelAI: 'SSE',
    chatUI: 'SSE',
    custom: 'DIY',
  },
  {
    name: 'Memory/Context',
    clarity: 'Built-in',
    vercelAI: 'Manual',
    chatUI: 'None',
    custom: 'DIY',
  },
  {
    name: 'Token Optimization',
    clarity: 'Built-in',
    vercelAI: 'None',
    chatUI: 'None',
    custom: 'DIY',
  },
  {
    name: 'RAG Support',
    clarity: 'Built-in',
    vercelAI: 'Manual',
    chatUI: 'None',
    custom: 'DIY',
  },
  {
    name: 'Enterprise Features',
    clarity: 'RBAC, SSO, Multi-tenant',
    vercelAI: 'None',
    chatUI: 'None',
    custom: 'DIY',
  },
  {
    name: 'Accessibility',
    clarity: 'WCAG AAA',
    vercelAI: 'Basic',
    chatUI: 'Basic',
    custom: 'Varies',
  },
  {
    name: 'Bundle Size (min)',
    clarity: '~30KB',
    vercelAI: '~15KB',
    chatUI: '~20KB',
    custom: 'Varies',
  },
  {
    name: 'Learning Curve',
    clarity: 'Low',
    vercelAI: 'Low',
    chatUI: 'Low',
    custom: 'High',
  },
]

const benefits = [
  {
    title: 'Ship Faster',
    description:
      'Pre-built components mean you can have a robust chat interface in minutes, not weeks.',
    metric: '10x faster development',
  },
  {
    title: 'Reduce Costs',
    description:
      'Built-in token optimization and prompt caching can reduce your AI API costs significantly.',
    metric: 'Up to 70% cost savings',
  },
  {
    title: 'Scale Confidently',
    description:
      'Enterprise features like RBAC, multi-tenancy, and audit logging are ready when you need them.',
    metric: 'Enterprise-ready from day 1',
  },
  {
    title: 'Maintain Easily',
    description:
      'Comprehensive documentation, TypeScript support, and consistent APIs make maintenance a breeze.',
    metric: `${LIBRARY_STATS.components} documented components`,
  },
]

const useCases = [
  {
    title: 'Customer Support',
    description: 'Build AI-powered support chatbots with conversation history, file uploads, and agent handoff.',
    features: ['Memory management', 'File upload', 'Multi-turn conversations'],
  },
  {
    title: 'Internal Tools',
    description: 'Create internal AI assistants for your team with SSO, RBAC, and audit logging.',
    features: ['Enterprise SSO', 'Role-based access', 'Audit trails'],
  },
  {
    title: 'SaaS Products',
    description: 'Add AI chat to your SaaS with multi-tenancy, usage quotas, and white-labeling.',
    features: ['Multi-tenancy', 'Usage quotas', 'Custom theming'],
  },
  {
    title: 'Developer Tools',
    description: 'Build code assistants with syntax highlighting, markdown rendering, and tool calling.',
    features: ['Code highlighting', 'Markdown support', 'Function calling'],
  },
]

export default function WhyClarityPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Overview</span>
        <h1>Why Clarity Chat?</h1>
        <p className="docs-lead">
          The most complete React component library for building AI chat interfaces.
          Compare features, see benefits, and understand when Clarity is the right choice.
        </p>
      </div>

      {/* Benefits Section */}
      <section className="docs-section">
        <h2>Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {benefit.description}
              </p>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {benefit.metric}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="docs-section">
        <h2>Feature Comparison</h2>
        <p className="mb-6">
          See how Clarity Chat compares to other solutions for building AI chat interfaces.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                  Clarity Chat
                </th>
                <th className="text-left py-3 px-4 font-semibold">Vercel AI SDK</th>
                <th className="text-left py-3 px-4 font-semibold">Chat UI Libs</th>
                <th className="text-left py-3 px-4 font-semibold">Custom Build</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={feature.name}
                  className={
                    index % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-800/50'
                      : ''
                  }
                >
                  <td className="py-3 px-4 font-medium">{feature.name}</td>
                  <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-medium">
                    {feature.clarity}
                  </td>
                  <td className="py-3 px-4">{feature.vercelAI}</td>
                  <td className="py-3 px-4">{feature.chatUI}</td>
                  <td className="py-3 px-4">{feature.custom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Use Cases */}
      <section className="docs-section">
        <h2>Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {useCase.description}
              </p>
              <ul className="space-y-1">
                {useCase.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* When to Choose */}
      <section className="docs-section">
        <h2>When to Choose Clarity Chat</h2>

        <h3 className="mt-6 mb-3 font-semibold">Choose Clarity if you need:</h3>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <span className="mr-2 text-green-500 mt-1">✓</span>
            <span>A complete, robust chat UI with minimal setup</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500 mt-1">✓</span>
            <span>Enterprise features like SSO, RBAC, and audit logging</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500 mt-1">✓</span>
            <span>Built-in token optimization to reduce API costs</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500 mt-1">✓</span>
            <span>Comprehensive accessibility (WCAG AAA compliance)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500 mt-1">✓</span>
            <span>Multiple themes and extensive customization options</span>
          </li>
        </ul>

        <h3 className="mb-3 font-semibold">Consider alternatives if:</h3>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <span className="mr-2 text-gray-400 mt-1">•</span>
            <span>You only need basic streaming and prefer minimal dependencies</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-gray-400 mt-1">•</span>
            <span>You want to build everything from scratch for full control</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-gray-400 mt-1">•</span>
            <span>Your project has very specific UI requirements that don&apos;t fit component libraries</span>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="docs-section">
        <div className="p-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 opacity-90">
            Build your first AI chat interface in under 5 minutes.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/learn/quick-start"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Quick Start Guide
            </Link>
            <Link
              href="/playground"
              className="px-6 py-3 bg-transparent border-2 border-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Try the Playground
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
