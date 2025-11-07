import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Accessibility Guide',
  description: 'Ship inclusive chat experiences that meet WCAG 2.1 AA.',
}

export default function AccessibilityGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Accessibility Guide</h1>

      <p className="lead">
        Clarity Chat is built to meet WCAG 2.1 AA guidelines out of the box. Use this checklist to
        ensure customisations stay accessible.
      </p>

      <h2 id="keyboard-navigation">Keyboard Navigation</h2>
      <ul>
        <li>All interactive elements expose focus states and logical tab ordering.</li>
        <li>
          <code>MessageList</code> with <code>enableFocusManagement</code> enables arrow-key traversal of
          transcripts.
        </li>
        <li>
          Composer shortcuts (<kbd>Enter</kbd>, <kbd>Shift+Enter</kbd>, <kbd>Esc</kbd>) are configurable via
          props.
        </li>
      </ul>

      <h2 id="screen-readers">Screen Readers</h2>
      <ul>
        <li>Messages announce role and timestamp for context.</li>
        <li>Streaming responses use polite ARIA regions to avoid interrupting current speech.</li>
        <li>Status updates (typing, errors) emit <code>aria-live="polite"</code> notifications.</li>
      </ul>

      <h2 id="color-contrast">Color Contrast</h2>
      <p>
        Maintain 4.5:1 contrast ratios when applying custom themes. ThemeBuilder validates contrast and
        suggests accessible variants. Audit with Axe, Lighthouse, or the built-in Accessibility Panel in
        the playground.
      </p>

      <h2 id="testing-checklist">Testing Checklist</h2>
      <ol>
        <li>Navigate the entire chat via keyboard, including modals and drawers.</li>
        <li>Validate headings, landmarks, and lists in screen-reader workflows.</li>
        <li>Confirm focus returns to the composer after sending, retrying, or editing a message.</li>
        <li>
          Run automated audits with <code>@axe-core/playwright</code> inside the provided CI workflows.
        </li>
      </ol>

      <Callout type="success">
        <p>
          Pair this guide with the <a href="/tools/accessibility">Accessibility Tooling</a> panel in the
          playground to inspect keyboard shortcuts, ARIA attributes, and WCAG status in real time.
        </p>
      </Callout>
    </>
  )
}
