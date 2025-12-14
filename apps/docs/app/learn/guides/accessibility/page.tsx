import Link from 'next/link'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Accessibility Quickstart - Learn Clarity Chat',
  description:
    'Fast checklist for keeping Clarity Chat WCAG 2.1 AAA compliant in your application.',
}

export default function LearnAccessibilityGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Quick Guide</span>
        <h1>Accessibility</h1>
        <p className="docs-lead">
          Clarity Chat is certified WCAG 2.1 AAA. Follow this quickstart to keep
          your implementation compliant as you add custom logic and styles.
        </p>
      </div>

      <section className="docs-section">
        <h2>Keyboard Support</h2>
        <ul>
          <li>
            Ensure every new interactive element is focusable and reachable via
            Tab
          </li>
          <li>
            Use <code>KeyboardShortcutsProvider</code> to register app-wide
            shortcuts
          </li>
          <li>
            Keep focus states visible (never remove outlines without
            replacement)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Screen Readers</h2>
        <ul>
          <li>
            Announce custom actions with <code>ScreenReaderAnnouncement</code>
          </li>
          <li>
            Mark error banners with <code>role="alert"</code>
          </li>
          <li>
            Provide descriptive <code>aria-label</code> values for icon-only
            buttons
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Visual Design</h2>
        <ul>
          <li>
            Maintain ≥ 7:1 text contrast (the default theme already complies)
          </li>
          <li>
            Respect <code>prefers-reduced-motion</code> when adding new
            animations
          </li>
          <li>
            Keep touch targets ≥ 44 × 44&nbsp;px (use{' '}
            <code>getTouchTargetClass</code>)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Testing Checklist</h2>
        <ul>
          <li>
            Run <code>npm run test</code> to execute jest-axe suites
          </li>
          <li>
            Use Playwright axe project (<code>npm run test:e2e</code>) for
            end-to-end flows
          </li>
          <li>
            Manual spot check: keyboard-only navigation + VoiceOver/NVDA smoke
            test
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <Callout type="success">
          Ready for the full deep dive—including WCAG audit results and
          guardrail code? Read the{' '}
          <Link href="/guides/accessibility">
            Enterprise Accessibility Guide
          </Link>
          .
        </Callout>
      </section>
    </div>
  )
}
