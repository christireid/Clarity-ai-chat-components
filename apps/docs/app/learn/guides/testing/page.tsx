import Link from 'next/link'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Testing Quickstart - Learn Clarity Chat',
  description:
    'High-level testing plan before exploring the full testing/QA guide.',
}

export default function LearnTestingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Quick Guide</span>
        <h1>Testing Clarity Chat</h1>
        <p className="docs-lead">
          Use this cheat sheet to set up essential tests in minutes. When you are
          ready, the full Testing Strategy guide dives into mocked providers,
          accessibility tooling, and CI/CD integration.
        </p>
      </div>

      <section className="docs-section">
        <h2>Baseline Commands</h2>
        <ul>
          <li>
            <code>npm run test</code> — runs jest + jest-axe suites (fast feedback)
          </li>
          <li>
            <code>npm run test:e2e</code> — Playwright powered end-to-end flows
          </li>
          <li>
            <code>clarity-chat doctor</code> — validates project configuration before deploy
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Mocked Providers</h2>
        <p>
          Install <code>@clarity-chat/dev-tools</code> and swap real providers for{' '}
          <code>createMockProviders</code>. You get deterministic completions,
          streaming, and error scenarios for unit and integration tests.
        </p>
      </section>

      <section className="docs-section">
        <h2>Accessibility Always-On</h2>
        <ul>
          <li>Integrate jest-axe into your component tests</li>
          <li>Add Playwright axe project for end-to-end coverage</li>
          <li>Include manual keyboard + screen reader smoke checks in your release checklist</li>
        </ul>
      </section>

      <section className="docs-section">
        <Callout type="success">
          Ready for the full playbook (mock providers, profiling, CLI health
          checks, incident response)? Read the{' '}
          <Link href="/guides/testing">Testing Strategy Guide</Link>.
        </Callout>
      </section>
    </div>
  )
}

