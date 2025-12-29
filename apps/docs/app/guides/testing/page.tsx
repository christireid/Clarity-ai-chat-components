import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Testing Guide - Clarity Chat',
  description:
    'Automate confidence with mocked providers, axe accessibility checks, Playwright E2E flows, and the Clarity Chat dev-tools.',
}

export default function TestingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Testing Strategy</h1>
        <p className="docs-lead">
          A production chat surface touches models, storage, streams, and
          accessibility. This guide shows how to keep all of it covered with
          fast feedback loops.
        </p>
      </div>

      <section className="docs-section">
        <h2>Testing Layers</h2>
        <ul>
          <li>
            🧪 <strong>Unit &amp; Hook Tests</strong> —{' '}
            <code>@clarity-chat/dev-tools</code> mocks models
          </li>
          <li>
            🧭 <strong>Accessibility Tests</strong> — axe-core &amp; jest-axe
            enforce WCAG AAA
          </li>
          <li>
            🌐 <strong>Integration Tests</strong> — Playwright runs full chat
            flows in Chromium/WebKit
          </li>
          <li>
            🔍 <strong>Performance Budgets</strong> — benchmark scripts catch
            regression drift
          </li>
          <li>
            🩺 <strong>Health Checks</strong> — CLI doctor command validates
            project configuration
          </li>
        </ul>
        <Callout type="info">
          The repository already includes evidence of every layer in{' '}
          <code>COMPLETE_TESTING_SUMMARY.md</code>. Extend or customise these
          patterns for your product.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Mocking AI Providers</h2>
        <p>
          Use <code>createMockProviders</code> from{' '}
          <code>@clarity-chat/dev-tools</code> to unit test hooks and components
          without hitting real APIs.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { createMockProviders, mockScenarios } from '@clarity-chat/dev-tools'
import { renderHook, act } from '@testing-library/react'
import { useChat } from '@clarity-chat/react/internal'

describe('useChat', () => {
  it('streams responses using mocked provider', async () => {
    const { openai } = createMockProviders(mockScenarios.streaming)

    const { result } = renderHook(() =>
      useChat({ experimentalProvider: openai })
    )

    await act(async () => {
      await result.current.handleSubmit('Explain rate limiting')
    })

    expect(result.current.messages.at(-1)?.role).toBe('assistant')
    expect(result.current.messages.at(-1)?.content).toContain('rate limiting')
  })
})
`}
        />
        <p>
          Mock scenarios cover timeouts, rate limits, multi-turn threads,
          streaming chunks, and auth failures. You can provide custom responses
          for edge cases.
        </p>
      </section>

      <section className="docs-section">
        <h2>Accessibility Unit Tests</h2>
        <p>
          Ensure every component passes axe checks and retains WCAG AAA
          guarantees.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ChatWindow } from '@clarity-chat/react/internal'

it('ChatWindow is accessible', async () => {
  const { container } = render(
    <ChatWindow
      messages={[{ id: '1', role: 'user', content: 'Hello' }]}
      onSendMessage={() => {}}
    />,
  )

  const results = await axe(container, {
    rules: {
      // Example: allow landmark duplication in nested layouts
      'landmark-one-main': { enabled: false },
    },
  })

  expect(results).toHaveNoViolations()
})
`}
        />
        <Callout type="warning">
          Run accessibility tests in CI. They catch regressions from
          innocuous-looking markup changes faster than manual QA.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Playwright E2E Flows</h2>
        <p>
          Drive the entire chat stack (frontend + API route) with Playwright.
          The repo already includes mobile and desktop projects.
        </p>
        <CodeBlock
          language="ts"
          code={`import { test, expect } from '@playwright/test'

test.describe('Chat happy path', () => {
  test('user sends a message and sees streaming response', async ({ page }) => {
    await page.goto('/examples/support-chat')

    await page.getByPlaceholder('Ask anything…').fill('How do I reset my password?')
    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByTestId('streaming-indicator')).toBeVisible()

    const reply = page.getByTestId('message-assistant').last()
    await expect(reply).toContainText('reset')

    // Cancel stream mid-way
    await page.getByRole('button', { name: 'Stop response' }).click()
    await expect(page.getByTestId('streaming-indicator')).toBeHidden()
  })
})
`}
        />
        <p>
          Add Playwright to your CI pipeline with <code>npm run test:e2e</code>.
          For visual regression coverage, integrate with Chromatic or
          Playwright’s built-in snapshot tooling.
        </p>
      </section>

      <section className="docs-section">
        <h2>Project Health Checks</h2>
        <p>
          The CLI includes commands that catch misconfigurations before QA
          touches the app.
        </p>
        <CodeBlock
          language="bash"
          code={`# Run project doctor (checks env vars, API keys, missing packages)
clarity-chat doctor --fix

# Verify analytics, quotas, safety, vector store integrations
clarity-chat analyze --report

# Upgrade packages safely (prompts for breaking changes)
clarity-chat upgrade --interactive`}
        />
        <Callout type="tip">
          Combine health checks with the <code>CI_CD_FINAL_STATUS.md</code>{' '}
          recommendations to keep pipelines green and reproducible.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Testing Checklist</h2>
        <ul>
          <li>
            ✅ Unit tests with mocked providers cover success + failure paths
          </li>
          <li>✅ jest-axe suite runs on every PR</li>
          <li>✅ Playwright runs headless in CI against production build</li>
          <li>
            ✅ <code>npm run analyze</code> and <code>npm run benchmark</code>{' '}
            publishing artifacts
          </li>
          <li>
            ✅ CLI <code>doctor</code> runs before deploy to validate env config
          </li>
          <li>
            ✅ Manual exploration: streaming interruptions, offline/online
            toggles, accessibility shortcuts
          </li>
        </ul>
        <Callout type="success">
          The repository already documents 61 passing enterprise tests. Use that
          baseline to negotiate SLAs with stakeholders and grow coverage over
          time.
        </Callout>
      </section>
    </div>
  )
}
