import React from 'react'
import Link from 'next/link'

const integrations = [
  {
    name: 'Next.js 15 App Router',
    description: 'Complete integration with Server Components, Streaming, and advanced caching patterns',
    href: '/guides/integrations/nextjs-app-router',
    tags: ['SSR', 'Streaming', 'React Server Components', 'Production-Ready'],
    difficulty: 'Intermediate',
    time: '15-30 min',
    features: [
      'Server-side rendering',
      'Streaming with Suspense',
      'Route handlers with validation',
      'ISR and caching strategies',
      'Error boundaries',
    ],
  },
  {
    name: 'Vite',
    description: 'Optimized Vite configuration with tree shaking, code splitting, and build optimization',
    href: '/guides/integrations/vite-optimization',
    tags: ['Fast', 'Modern', 'ESM', 'Tree Shaking'],
    difficulty: 'Beginner',
    time: '10-15 min',
    features: [
      'Lightning-fast HMR',
      'Optimal bundle splitting',
      'Tree shaking configuration',
      '60-80% smaller bundles',
      'Bundle analysis tools',
    ],
  },
  {
    name: 'Create React App',
    description: 'Zero-config setup with Tailwind CSS, TypeScript, and optimization tips',
    href: '/guides/integrations/create-react-app',
    tags: ['Simple', 'Zero-Config', 'Beginner-Friendly'],
    difficulty: 'Beginner',
    time: '10 min',
    features: [
      'Zero configuration',
      'Tailwind CSS integration',
      'TypeScript support',
      'Migration path to Vite',
      'Code splitting patterns',
    ],
  },
  {
    name: 'Remix',
    description: 'Server-side rendering with loaders, actions, and streaming for optimal performance',
    href: '/guides/integrations/remix',
    tags: ['SSR', 'Progressive Enhancement', 'Forms'],
    difficulty: 'Intermediate',
    time: '20-30 min',
    features: [
      'Server-side rendering',
      'Form actions',
      'Streaming responses',
      'Nested routes',
      'Optimistic UI',
    ],
  },
  {
    name: 'Astro',
    description: 'Islands architecture with partial hydration and zero JavaScript by default',
    href: '/guides/integrations/astro',
    tags: ['Islands', 'Zero-JS', 'Performance', 'Content-First'],
    difficulty: 'Beginner',
    time: '15 min',
    features: [
      'Zero JavaScript default',
      'Partial hydration',
      'Framework agnostic',
      'Content collections',
      '90+ Lighthouse scores',
    ],
  },
  {
    name: 'React 19 Concurrent',
    description: 'Concurrent features, transitions, and React 19 best practices',
    href: '/guides/integrations/react-19-concurrent',
    tags: ['React 19', 'Concurrent', 'Transitions'],
    difficulty: 'Advanced',
    time: '20-30 min',
    features: [
      'Concurrent rendering',
      'Transitions API',
      'Suspense boundaries',
      'useTransition hook',
      'Performance optimization',
    ],
  },
]

const tooling = [
  {
    name: 'TypeScript Strict Mode',
    description: 'Strict TypeScript configuration with branded types and full type safety',
    href: '/guides/integrations/typescript-strict',
    icon: '🔷',
  },
  {
    name: 'Tailwind CSS + OKLCH',
    description: 'Modern color system with perceptually uniform colors',
    href: '/guides/integrations/tailwind-oklch',
    icon: '🎨',
  },
  {
    name: 'ESLint Setup',
    description: 'Comprehensive linting rules for TypeScript, React, and accessibility',
    href: '/guides/integrations/eslint-setup',
    icon: '🔍',
  },
  {
    name: 'Vercel AI SDK',
    description: 'Integration with Vercel AI SDK for streaming and tool calling',
    href: '/guides/integrations/vercel-ai-sdk',
    icon: '▲',
  },
]

const comparisonData = [
  {
    framework: 'Next.js',
    type: 'Full-stack',
    rendering: 'SSR/SSG/ISR',
    complexity: 'Medium',
    buildSpeed: 'Medium',
    bundleSize: 'Medium',
    bestFor: 'Production apps',
  },
  {
    framework: 'Vite',
    type: 'Build tool',
    rendering: 'CSR',
    complexity: 'Low',
    buildSpeed: 'Fast',
    bundleSize: 'Small',
    bestFor: 'SPAs',
  },
  {
    framework: 'CRA',
    type: 'Starter',
    rendering: 'CSR',
    complexity: 'Low',
    buildSpeed: 'Slow',
    bundleSize: 'Large',
    bestFor: 'Quick starts',
  },
  {
    framework: 'Remix',
    type: 'Full-stack',
    rendering: 'SSR',
    complexity: 'Medium',
    buildSpeed: 'Medium',
    bundleSize: 'Medium',
    bestFor: 'Data-driven',
  },
  {
    framework: 'Astro',
    type: 'MPA',
    rendering: 'Static',
    complexity: 'Low',
    buildSpeed: 'Fast',
    bundleSize: 'Minimal',
    bestFor: 'Content sites',
  },
]

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Framework Integrations</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Complete guides for integrating Clarity Chat Components with popular frameworks and build tools.
          Each guide includes setup instructions, best practices, and production-ready examples.
        </p>
      </div>

      {/* Quick Comparison */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Framework Comparison</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Framework</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Rendering</th>
                <th className="px-4 py-3 text-left font-semibold">Complexity</th>
                <th className="px-4 py-3 text-left font-semibold">Build Speed</th>
                <th className="px-4 py-3 text-left font-semibold">Bundle Size</th>
                <th className="px-4 py-3 text-left font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={row.framework} className={i % 2 === 0 ? 'bg-white dark:bg-neutral-950' : 'bg-neutral-50 dark:bg-neutral-900'}>
                  <td className="px-4 py-3 font-medium">{row.framework}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.rendering}</td>
                  <td className="px-4 py-3">{row.complexity}</td>
                  <td className="px-4 py-3">{row.buildSpeed}</td>
                  <td className="px-4 py-3">{row.bundleSize}</td>
                  <td className="px-4 py-3">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Framework Integrations */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Framework Guides</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {integrations.map((integration) => (
            <Link
              key={integration.name}
              href={integration.href}
              className="group relative overflow-hidden rounded-lg border bg-white p-6 transition-all hover:border-brand-500 hover:shadow-lg dark:bg-neutral-950"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-bold group-hover:text-brand-500">
                  {integration.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {integration.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                {integration.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="mb-4 flex items-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Difficulty:</span> {integration.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Time:</span> {integration.time}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-1 text-sm">
                {integration.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 text-brand-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Arrow indicator */}
              <div className="absolute right-6 top-6 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-500">
                →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tooling & Configuration */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Tooling & Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tooling.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group rounded-lg border bg-white p-6 transition-all hover:border-brand-500 hover:shadow-md dark:bg-neutral-950"
            >
              <div className="mb-3 text-3xl">{tool.icon}</div>
              <h3 className="mb-2 font-bold group-hover:text-brand-500">{tool.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="mb-16 rounded-lg border bg-gradient-to-br from-brand-50 to-blue-50 p-8 dark:from-brand-950 dark:to-blue-950">
        <h2 className="mb-4 text-2xl font-bold">Not Sure Where to Start?</h2>
        <div className="mb-6 text-neutral-600 dark:text-neutral-400">
          <p className="mb-4">Choose based on your needs:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-600">→</span>
              <span>
                <strong>New project?</strong> Start with <Link href="/guides/integrations/vite-optimization" className="font-semibold text-brand-600 hover:underline">Vite</Link> for best DX
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-600">→</span>
              <span>
                <strong>Production app?</strong> Use <Link href="/guides/integrations/nextjs-app-router" className="font-semibold text-brand-600 hover:underline">Next.js</Link> for full-stack features
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-600">→</span>
              <span>
                <strong>Content site?</strong> Choose <Link href="/guides/integrations/astro" className="font-semibold text-brand-600 hover:underline">Astro</Link> for minimal JavaScript
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-600">→</span>
              <span>
                <strong>Learning React?</strong> Start with <Link href="/guides/integrations/create-react-app" className="font-semibold text-brand-600 hover:underline">Create React App</Link> for simplicity
              </span>
            </li>
          </ul>
        </div>
        <Link
          href="/get-started/quick-start"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          View Quick Start Guide
          <span>→</span>
        </Link>
      </section>

      {/* Migration Guides */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Migration & Upgrades</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/guides/migration/v1-to-v2"
            className="group rounded-lg border bg-white p-6 transition-all hover:border-brand-500 hover:shadow-md dark:bg-neutral-950"
          >
            <h3 className="mb-2 font-bold group-hover:text-brand-500">v1 to v2 Migration</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Upgrade to v2 with breaking changes guide and migration checklist
            </p>
          </Link>
          <Link
            href="/guides/integrations/vite-optimization"
            className="group rounded-lg border bg-white p-6 transition-all hover:border-brand-500 hover:shadow-md dark:bg-neutral-950"
          >
            <h3 className="mb-2 font-bold group-hover:text-brand-500">CRA to Vite Migration</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Migrate from Create React App to Vite for better performance
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
