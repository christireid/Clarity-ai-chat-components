import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Testing Toolkit - Developer Tools',
  description:
    'All test suites, utilities, and scripts shipped with Clarity Chat to keep quality high.',
}

export default function TestingToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Tooling</span>
        <h1>Testing Toolkit</h1>
        <p className="docs-lead">
          Fast feedback, accessibility, and confidence. These tools power the
          “Complete Testing Summary” report delivered with the repository.
        </p>
      </div>

      <section className="docs-section">
        <h2>Test Layers</h2>
        <ul>
          <li>✅ 61 enterprise unit tests (embeddings, prompts, plugins, safety)</li>
          <li>✅ jest-axe accessibility tests on all core components</li>
          <li>✅ Playwright end-to-end suites (Chromium, WebKit, mobile viewports)</li>
          <li>✅ Benchmark scripts and bundle analyzer to catch regressions</li>
        </ul>
        <Callout type="info">
          See the{' '}
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components/blob/main/COMPLETE_TESTING_SUMMARY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            COMPLETE_TESTING_SUMMARY.md
          </a>{' '}
          on GitHub for the original audit logs and pass/fail history.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Local Commands</h2>
        <CodeBlock
          language="bash"
          code={`# Run unit tests with coverage
npm run test

# Watch mode
npm run test:watch

# Playwright (headless)
npm run test:e2e

# Playwright UI runner
npm run test:e2e:ui

# Lint + typecheck
npm run lint
npm run typecheck`}
        />
      </section>

      <section className="docs-section">
        <h2>@clarity-chat/dev-tools</h2>
        <p>
          Utilities for logging, profiling, mocking, and validation purpose-built
          for AI applications.
        </p>
        <ul>
          <li>
            <strong>Mock providers</strong>: deterministic completions &amp; streaming
          </li>
          <li>
            <strong>API inspector</strong>: log calls, token usage, latency
          </li>
          <li>
            <strong>Profiler</strong>: measure operation times &amp; streaming throughput
          </li>
          <li>
            <strong>Validation helpers</strong>: ensure responses and configs match schema
          </li>
        </ul>
        <CodeBlock
          language="ts"
          code={`import {
  createMockProviders,
  getAPIInspector,
  getProfiler,
} from '@clarity-chat/dev-tools'

const { openai } = createMockProviders()
const inspector = getAPIInspector()
const profiler = getProfiler()

inspector.setEnabled(true)

const { result, metrics } = await profiler.profile('chat', async () => {
  return await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
  })
})

console.log('Duration', metrics.duration)
console.log('Response', result.choices[0].message)
`}
        />
      </section>

      <section className="docs-section">
        <h2>CI/CD Integration</h2>
        <ul>
          <li>Pre-commit: lint-staged + husky run formatting + lint</li>
          <li>CI: GitHub Actions (lint, tests, Playwright, analyze, benchmark)</li>
          <li>Deploy: Vercel preview builds, main branch gated on tests</li>
          <li>Reports: bundle/benchmark artifacts uploaded with each run</li>
        </ul>
        <p>
          📄 Reference pipeline:{' '}
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components/blob/main/CI_CD_FINAL_STATUS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            CI_CD_FINAL_STATUS.md
          </a>
        </p>
      </section>

      <section className="docs-section">
        <h2>Recommended Workflow</h2>
        <ol>
          <li>Run <code>clarity-chat doctor</code> to verify environment variables</li>
          <li>Use Storybook for visual regression / manual QA</li>
          <li>Before merging, run <code>npm run test</code> + <code>npm run test:e2e</code></li>
          <li>Review bundle + benchmark reports in CI artifacts</li>
        </ol>
        <Callout type="success">
          The tooling stack is built to scale. Add more tests without worrying
          about memory leaks or flaky streaming behaviour—everything runs in strict
          mode with mocked providers.
        </Callout>
      </section>
    </div>
  )
}

