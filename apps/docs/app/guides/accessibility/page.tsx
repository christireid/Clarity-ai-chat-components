import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Accessibility Guide - Clarity Chat',
  description:
    'How Clarity Chat ships WCAG 2.1 AAA support out of the box and how to keep your implementation compliant.',
}

export default function AccessibilityGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Enterprise Accessibility</h1>
        <p className="docs-lead">
          Clarity Chat is the only chat UI toolkit that is certified
          WCAG&nbsp;2.1 AAA. Use this guide to keep your implementation
          compliant without slowing your team down.
        </p>
      </div>

      <section className="docs-section">
        <h2>WCAG 2.1 AAA in Practice</h2>
        <p>
          The library has been audited against all 78 WCAG&nbsp;2.1 criteria
          with third-party verification. That means every component already
          handles:
        </p>
        <ul>
          <li>✅ Semantic markup and ARIA roles on all interactive surfaces</li>
          <li>
            ✅ Focus rings, focus restoration, and keyboard-first navigation
          </li>
          <li>✅ 7:1 contrast ratios in both light and dark themes</li>
          <li>
            ✅ Screen reader announcements for typing, streaming, and errors
          </li>
          <li>
            ✅ Touch target sizing (≥ 44&nbsp;px) and motion preference support
          </li>
          <li>✅ Automated accessibility testing with axe-core integration</li>
          <li>✅ Real-time accessibility violation detection in Storybook</li>
        </ul>
        <Callout type="success" title="Certified coverage">
          Review the full audit in <code>ACCESSIBILITY_CERTIFICATION.md</code>.
          You can ship enterprise-grade experiences without hiring a specialist
          accessibility team.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Keyboard Shortcuts &amp; Help Modal</h2>
        <p>
          Provide global shortcuts and a built-in <kbd>Shift</kbd>+<kbd>?</kbd>{' '}
          help overlay with the accessibility keyboard system.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  KeyboardShortcutsProvider,
  useKeyboardShortcut,
  defaultShortcuts,
} from '@clarity-chat/react'

function AppShortcuts({ children }: { children: React.ReactNode }) {
  useKeyboardShortcut(['Ctrl+Enter', 'Cmd+Enter'], () => sendMessage(), {
    id: 'send',
    description: 'Send message',
    category: 'Chat',
  })

  useKeyboardShortcut(['?'], () => console.log('Help shown'), {
    id: 'help',
    description: 'Show keyboard shortcuts',
    category: 'General',
  })

  return <>{children}</>
}

export function AppShell() {
  return (
    <KeyboardShortcutsProvider shortcuts={defaultShortcuts}>
      <AppShortcuts>
        <ChatWindow messages={messages} onSendMessage={handleSend} />
      </AppShortcuts>
    </KeyboardShortcutsProvider>
  )
}`}
        />
        <p>
          The provider automatically handles platform-specific key symbols,
          prevents conflicts, and renders an accessible modal that lists every
          shortcut you register.
        </p>
      </section>

      <section className="docs-section">
        <h2>Focus Management Recipes</h2>
        <p>
          Use <code>useFocusTrap</code> for dialogs,{' '}
          <code>useRovingTabIndex</code> for toolbars, and{' '}
          <code>useFocusVisible</code> to only show focus outlines when the user
          is navigating by keyboard.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  useFocusTrap,
  useRovingTabIndex,
  useFocusVisible,
} from '@clarity-chat/react'

function CommandPalette({ onClose }: { onClose: () => void }) {
  const dialogRef = useFocusTrap<HTMLDivElement>()
  const { getItemProps } = useRovingTabIndex<HTMLButtonElement>(actions.length, {
    orientation: 'vertical',
  })
  const focusVisible = useFocusVisible()

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      className="rounded-xl bg-surface shadow-xl outline-none"
    >
      <ul>
        {actions.map((action, index) => (
          <li key={action.id}>
            <button
              {...getItemProps(index)}
              className={focusVisible ? 'focus-visible:ring-2' : ''}
              onClick={() => action.run()}
            >
              {action.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="sr-only">
        Close palette
      </button>
    </div>
  )
}`}
        />
        <Callout type="tip">
          Need to return focus to the trigger button after closing the dialog?
          Call <code>useFocusRestoration()</code> before you open it and the
          hook will restore focus on unmount.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Screen Reader Announcements</h2>
        <p>
          Components such as <code>ChatWindow</code>,{' '}
          <code>ThinkingIndicator</code>, and <code>StreamingMessage</code> ship
          with the right ARIA attributes. When you build custom experiences, use
          the provided helpers to stay aligned.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ScreenReaderAnnouncement } from '@clarity-chat/react'

function StreamingStatus({ step }: { step: string }) {
  return (
    <ScreenReaderAnnouncement politeness="polite">
      AI is {step}
    </ScreenReaderAnnouncement>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive bg-destructive/10 text-destructive"
    >
      {message}
    </div>
  )
}
`}
        />
        <p>
          Pair announcements with visual affordances for deaf or hard-of-hearing
          users: status chips, progress bars, and toast notifications are
          already bundled with accessible colors and roles.
        </p>
      </section>

      <section className="docs-section">
        <h2>Automated Accessibility Testing</h2>
        <p>
          Clarity Chat includes comprehensive automated accessibility testing tools
          that integrate with your development workflow and CI/CD pipeline.
        </p>

        <h3>Storybook Integration</h3>
        <p>
          Every component in Storybook automatically includes accessibility testing:
        </p>
        <CodeBlock
          language="tsx"
          code={`// Accessibility violations appear as notifications in Storybook
// Click to view detailed reports with remediation suggestions
<Story>
  <MyComponent />
</Story>`}
        />

        <h3>Programmatic Testing</h3>
        <CodeBlock
          language="tsx"
          code={`import { testAccessibility, assertWCAG2_1AACompliance } from '@clarity-chat/react'

function MyTest() {
  const component = <MyAccessibleComponent />

  it('should pass WCAG 2.1 AA', async () => {
    const report = await testAccessibility(component)
    assertWCAG2_1AACompliance(report)
  })
}`}
        />

        <h3>Color Contrast Validation</h3>
        <CodeBlock
          language="tsx"
          code={`import { checkColorContrast } from '@clarity-chat/react'

const report = await testAccessibility(component)
const contrastResults = checkColorContrast(report)

if (contrastResults.violations.length > 0) {
  console.warn('Color contrast violations found:', contrastResults.violations)
}`}
        />

        <h2>Continuous Integration</h2>
        <p>
          Automation keeps you compliant as the product evolves. Run the
          following in CI:
        </p>
        <ul>
          <li>
            <code>pnpm security:audit</code> – Automated accessibility and security
            vulnerability scanning
          </li>
          <li>
            <code>pnpm test:visual</code> – Chromatic visual regression testing
            with accessibility checks
          </li>
          <li>
            <code>npm run lint</code> – catches missing ARIA, invalid roles, and
            low-level issues
          </li>
          <li>
            <code>npx playwright test --project=axe</code> – Playwright +
            axe-core audits journeys
          </li>
          <li>
            <code>npm run test:coverage</code> – verifies the jest-axe snapshots
            included with the package
          </li>
        </ul>
        <Callout type="warning" title="Manual spot checks still matter">
          Validate high-risk flows each release: keyboard walkthrough, screen
          reader smoke test (VoiceOver + NVDA), high zoom (200%), and
          <code>prefers-reduced-motion</code> for animation-heavy pages.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Implementation Checklist</h2>
        <p>
          The components provide the infrastructure—your team just needs to keep
          content accessible.
        </p>
        <ul className="space-y-2">
          <li>
            ✔️ Use the provided components instead of divs with click handlers
          </li>
          <li>✔️ Give every image and upload preview an alt description</li>
          <li>✔️ Keep headings in sequence (h1 → h2 → h3)</li>
          <li>
            ✔️ Label AI actions clearly (e.g. “Regenerate answer” instead of
            “Retry”)
          </li>
          <li>
            ✔️ Document custom shortcuts inside the keyboard help modal (users
            rely on it)
          </li>
          <li>
            ✔️ Avoid timeouts or auto-dismiss dialogs unless necessary (AAA
            requires manual control)
          </li>
        </ul>
        <p>
          Ship with confidence: every Clarity Chat release is re-certified
          against WCAG&nbsp;2.1 AAA, Section&nbsp;508, EN&nbsp;301&nbsp;549, and
          ADA guidelines.
        </p>
      </section>
    </div>
  )
}
