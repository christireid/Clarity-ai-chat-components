import Link from 'next/link'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Performance Quickstart - Learn Clarity Chat',
  description:
    'Immediate steps to keep Clarity Chat responsive before diving into the full performance guide.',
}

export default function LearnPerformanceGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Quick Guide</span>
        <h1>Performance</h1>
        <p className="docs-lead">
          These are the fast wins to keep your chat experience feeling instant.
          Adopt them first, then explore the full performance guide for deeper
          tooling.
        </p>
      </div>

      <section className="docs-section">
        <h2>Checklist</h2>
        <ul>
          <li>Enable <strong>virtualized message lists</strong> when > 400 messages</li>
          <li>Use <strong>streaming</strong> (SSE/WebSockets) for long responses</li>
          <li>Memoize expensive render props (Markdown, code blocks)</li>
          <li>Track render times with <strong>PerformanceDashboard</strong></li>
          <li>Run <code>npm run analyze</code> and <code>npm run benchmark</code> before releases</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Key APIs</h2>
        <ul>
          <li>
            <code>VirtualizedMessageList</code> — drop into <code>ChatWindow</code> to render large histories
          </li>
          <li>
            <code>useRenderPerformance</code> — grab render metrics per component
          </li>
          <li>
            <code>usePerformance</code> — track FPS, CPU, and memory usage
          </li>
          <li>
            <code>TokenCounter</code> — expose token usage to users to prevent runaway payloads
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Run the Tooling</h2>
        <ul>
          <li>
            <code>npm run analyze</code> — generates bundle report (<code>bundle-reports/</code>)
          </li>
          <li>
            <code>npm run benchmark</code> — measures render throughput (<code>benchmark-results/</code>)
          </li>
          <li>
            <code>clarity-chat analyze --report</code> — CLI report of bundle size, code splitting, and dependency drift
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <Callout type="success">
          Want to instrument production, set up webhooks, and enforce budgets? Read
          the <Link href="/guides/performance">Performance Optimization Guide</Link>.
        </Callout>
      </section>
    </div>
  )
}

