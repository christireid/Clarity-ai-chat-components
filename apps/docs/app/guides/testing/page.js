import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Testing Guide - Clarity Chat',
    description: 'Automate confidence with mocked providers, axe accessibility checks, Playwright E2E flows, and the Clarity Chat dev-tools.',
};
export default function TestingGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Testing Strategy" }), _jsx("p", { className: "docs-lead", children: "A production chat surface touches models, storage, streams, and accessibility. This guide shows how to keep all of it covered with fast feedback loops." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Testing Layers" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83E\uDDEA ", _jsx("strong", { children: "Unit & Hook Tests" }), " \u2014 ", _jsx("code", { children: "@clarity-chat/dev-tools" }), " mocks models"] }), _jsxs("li", { children: ["\uD83E\uDDED ", _jsx("strong", { children: "Accessibility Tests" }), " \u2014 axe-core & jest-axe enforce WCAG AAA"] }), _jsxs("li", { children: ["\uD83C\uDF10 ", _jsx("strong", { children: "Integration Tests" }), " \u2014 Playwright runs full chat flows in Chromium/WebKit"] }), _jsxs("li", { children: ["\uD83D\uDD0D ", _jsx("strong", { children: "Performance Budgets" }), " \u2014 benchmark scripts catch regression drift"] }), _jsxs("li", { children: ["\uD83E\uDE7A ", _jsx("strong", { children: "Health Checks" }), " \u2014 CLI doctor command validates project configuration"] })] }), _jsxs(Callout, { type: "info", children: ["The repository already includes evidence of every layer in", ' ', _jsx("code", { children: "COMPLETE_TESTING_SUMMARY.md" }), ". Extend or customise these patterns for your product."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Mocking AI Providers" }), _jsxs("p", { children: ["Use ", _jsx("code", { children: "createMockProviders" }), " from", ' ', _jsx("code", { children: "@clarity-chat/dev-tools" }), " to unit test hooks and components without hitting real APIs."] }), _jsx(CodeBlock, { language: "tsx", code: `import { createMockProviders, mockScenarios } from '@clarity-chat/dev-tools'
import { renderHook, act } from '@testing-library/react'
import { useChat } from '@clarity-chat/react'

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
` }), _jsx("p", { children: "Mock scenarios cover timeouts, rate limits, multi-turn threads, streaming chunks, and auth failures. You can provide custom responses for edge cases." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Accessibility Unit Tests" }), _jsx("p", { children: "Ensure every component passes axe checks and retains WCAG AAA guarantees." }), _jsx(CodeBlock, { language: "tsx", code: `import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ChatWindow } from '@clarity-chat/react'

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
` }), _jsx(Callout, { type: "warning", children: "Run accessibility tests in CI. They catch regressions from innocuous-looking markup changes faster than manual QA." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Playwright E2E Flows" }), _jsx("p", { children: "Drive the entire chat stack (frontend + API route) with Playwright. The repo already includes mobile and desktop projects." }), _jsx(CodeBlock, { language: "ts", code: `import { test, expect } from '@playwright/test'

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
` }), _jsxs("p", { children: ["Add Playwright to your CI pipeline with", ' ', _jsx("code", { children: "npm run test:e2e" }), ". For visual regression coverage, integrate with Chromatic or Playwright\u2019s built-in snapshot tooling."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Project Health Checks" }), _jsx("p", { children: "The CLI includes commands that catch misconfigurations before QA touches the app." }), _jsx(CodeBlock, { language: "bash", code: `# Run project doctor (checks env vars, API keys, missing packages)
clarity-chat doctor --fix

# Verify analytics, quotas, safety, vector store integrations
clarity-chat analyze --report

# Upgrade packages safely (prompts for breaking changes)
clarity-chat upgrade --interactive` }), _jsxs(Callout, { type: "tip", children: ["Combine health checks with the ", _jsx("code", { children: "CI_CD_FINAL_STATUS.md" }), ' ', "recommendations to keep pipelines green and reproducible."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Testing Checklist" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Unit tests with mocked providers cover success + failure paths" }), _jsx("li", { children: "\u2705 jest-axe suite runs on every PR" }), _jsx("li", { children: "\u2705 Playwright runs headless in CI against production build" }), _jsxs("li", { children: ["\u2705 ", _jsx("code", { children: "npm run analyze" }), " and ", _jsx("code", { children: "npm run benchmark" }), " publishing artifacts"] }), _jsxs("li", { children: ["\u2705 CLI ", _jsx("code", { children: "doctor" }), " runs before deploy to validate env config"] }), _jsx("li", { children: "\u2705 Manual exploration: streaming interruptions, offline/online toggles, accessibility shortcuts" })] }), _jsx(Callout, { type: "success", children: "The repository already documents 61 passing enterprise tests. Use that baseline to negotiate SLAs with stakeholders and grow coverage over time." })] })] }));
}
//# sourceMappingURL=page.js.map