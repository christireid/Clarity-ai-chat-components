import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Testing Strategy',
  description: 'Validate Clarity Chat with unit, integration, accessibility, and E2E tooling.',
}

export default function TestingGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Testing Strategy</h1>

      <p className="lead">
        Clarity Chat ships with a full testing stack—Vitest, Playwright, Storybook, Axe—and a CLI
        that scaffolds new tests automatically. This guide shows how to plug it into your CI.
      </p>

      <h2 id="unit-testing">Unit &amp; Component Testing</h2>
      <ul>
        <li>
          Use <code>vitest</code> + <code>@testing-library/react</code> (preconfigured in{' '}
          <code>packages/react/vitest.config.mts</code>).
        </li>
        <li>Mock streaming APIs with the provided <code>createMockStream</code> helper.</li>
        <li>
          Run <code>npm run test --workspace=@clarity-chat/react</code> for watch mode and coverage.
        </li>
      </ul>

      <CodeBlock
        language="tsx"
        title="Example component test"
        code={`import { render, screen } from '@testing-library/react'
import { ChatWindow } from '@clarity-chat/react'

test('renders initial messages', () => {
  render(<ChatWindow messages={[{ id: '1', role: 'user', content: 'Hi!' }]} />)
  expect(screen.getByText('Hi!')).toBeInTheDocument()
})`}
      />

      <h2 id="storybook">Visual Regression</h2>
      <p>
        Storybook stories live in <code>apps/storybook</code>. Use Chromatic or Loki for visual
        regression testing—stories already include interaction tests for critical components.
      </p>

      <h2 id="e2e-testing">End-to-End &amp; Accessibility</h2>
      <ul>
        <li>
          Playwright specs reside in <code>tests/e2e</code>; run them with{' '}
          <code>npm run test:e2e</code> or <code>npm run test:e2e:ui</code>.
        </li>
        <li>
          Accessibility checks integrate <code>@axe-core/playwright</code>—see{' '}
          <code>tests/e2e/accessibility.spec.ts</code>.
        </li>
        <li>
          CI workflows in <code>.github/workflows/test.yml</code> run unit + E2E suites on every PR.
        </li>
      </ul>

      <h2 id="cli-scaffolding">CLI Scaffolding</h2>
      <p>
        The <code>@clarity-chat/cli</code> command <code>clarity-chat generate test</code> scaffolds
        Vitest + Testing Library suites aligned with our conventions.
      </p>

      <CodeBlock
        language="bash"
        code={`clarity-chat generate test --name ChatWindow

# Generates:
# ├── ChatWindow.test.tsx
# └── __snapshots__/ChatWindow.test.tsx.snap`}
      />

      <Callout type="info">
        <p>
          Use the <a href="/tools/testing">Testing Tools</a> page for an overview of available scripts,
          coverage targets, and CI status.
        </p>
      </Callout>
    </>
  )
}
