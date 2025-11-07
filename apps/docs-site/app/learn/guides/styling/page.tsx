import Link from 'next/link'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Styling Guide - Learn Clarity Chat',
  description:
    'Quick tips for customizing Clarity Chat visual design before diving into the full theming documentation.',
}

export default function LearnStylingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Quick Guide</span>
        <h1>Styling Clarity Chat</h1>
        <p className="docs-lead">
          Brand the chat experience in minutes. This page highlights the fastest
          wins and points you to deeper resources.
        </p>
      </div>

      <section className="docs-section">
        <h2>Start with ThemeProvider</h2>
        <p>
          Wrap your app with <code>ThemeProvider</code> and use the built-in
          <code>ThemeSwitcher</code> while you iterate. Once you’re happy with the
          look, disable the switcher or replace it with your own toggle.
        </p>
        <Callout type="info">
          Each theme is just a JSON object of CSS variables. Store them in your CMS
          or database to deliver customer-specific branding.
        </Callout>
        <p>
          📚 Go deeper: <Link href="/learn/concepts/theming">Theming System Overview</Link>
        </p>
      </section>

      <section className="docs-section">
        <h2>Customising Components</h2>
        <ul>
          <li>
            Use <code>className</code> to apply utility classes (Tailwind works out of the box)
          </li>
          <li>
            Override slots via the <code>components</code> prop for structural changes
          </li>
          <li>
            Target CSS variables (e.g. <code>--chat-surface</code>) for fine-grained colour tweaks
          </li>
        </ul>
        <p>
          📚 Examples: <Link href="/guides/state-management">State Management Guide</Link>{' '}
          demonstrates slot overrides in a real layout.
        </p>
      </section>

      <section className="docs-section">
        <h2>Animations &amp; Motion</h2>
        <p>
          Motion tokens keep transitions consistent. Override them in your theme or
          use <code>AnimatedList</code>, <code>FeedbackAnimation</code>, and
          framer-motion variants for bespoke experiences.
        </p>
        <p>
          📚 Learn more: <Link href="/learn/concepts/animations">Animations Concept</Link>{' '}
          + <Link href="/guides/performance">Performance Guide</Link> (motion tips).
        </p>
      </section>

      <section className="docs-section">
        <h2>Design System Checklist</h2>
        <ul>
          <li>✅ ⚖️ Confirm 7:1 contrast ratios still hold after colour changes</li>
          <li>✅ 🌓 Verify both light and dark themes</li>
          <li>✅ 🧩 Ensure tokens integrate with your design system naming (map variables)</li>
          <li>✅ 🎨 Document component overrides for designers &amp; engineers</li>
        </ul>
        <Callout type="success">
          Ready for more? Read the <Link href="/guides/accessibility">Accessibility Guide</Link>{' '}
          to ensure your customisations retain WCAG AAA compliance.
        </Callout>
      </section>
    </div>
  )
}

