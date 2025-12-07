import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import Link from 'next/link';
export const metadata = {
    title: 'Testing Toolkit - Developer Tools',
    description: 'All test suites, utilities, and scripts shipped with Clarity Chat to keep quality high.',
};
export default function TestingToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Tooling" }), _jsx("h1", { children: "Testing Toolkit" }), _jsx("p", { className: "docs-lead", children: "Fast feedback, accessibility, and confidence. These tools power the \u201CComplete Testing Summary\u201D report delivered with the repository." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Test Layers" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 61 enterprise unit tests (embeddings, prompts, plugins, safety)" }), _jsx("li", { children: "\u2705 jest-axe accessibility tests on all core components" }), _jsx("li", { children: "\u2705 Playwright end-to-end suites (Chromium, WebKit, mobile viewports)" }), _jsx("li", { children: "\u2705 Benchmark scripts and bundle analyzer to catch regressions" })] }), _jsxs(Callout, { type: "info", children: ["See ", _jsx(Link, { href: "/COMPLETE_TESTING_SUMMARY", children: "COMPLETE_TESTING_SUMMARY.md" }), ' ', "for the original audit logs and pass/fail history."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Local Commands" }), _jsx(CodeBlock, { language: "bash", code: `# Run unit tests with coverage
npm run test

# Watch mode
npm run test:watch

# Playwright (headless)
npm run test:e2e

# Playwright UI runner
npm run test:e2e:ui

# Lint + typecheck
npm run lint
npm run typecheck` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "@clarity-chat/dev-tools" }), _jsx("p", { children: "Utilities for logging, profiling, mocking, and validation purpose-built for AI applications." }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Mock providers" }), ": deterministic completions & streaming"] }), _jsxs("li", { children: [_jsx("strong", { children: "API inspector" }), ": log calls, token usage, latency"] }), _jsxs("li", { children: [_jsx("strong", { children: "Profiler" }), ": measure operation times & streaming throughput"] }), _jsxs("li", { children: [_jsx("strong", { children: "Validation helpers" }), ": ensure responses and configs match schema"] })] }), _jsx(CodeBlock, { language: "ts", code: `import {
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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "CI/CD Integration" }), _jsxs("ul", { children: [_jsx("li", { children: "Pre-commit: lint-staged + husky run formatting + lint" }), _jsx("li", { children: "CI: GitHub Actions (lint, tests, Playwright, analyze, benchmark)" }), _jsx("li", { children: "Deploy: Vercel preview builds, main branch gated on tests" }), _jsx("li", { children: "Reports: bundle/benchmark artifacts uploaded with each run" })] }), _jsxs("p", { children: ["\uD83D\uDCC4 Reference pipeline: ", _jsx(Link, { href: "/CI_CD_FINAL_STATUS", children: "CI_CD_FINAL_STATUS.md" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Recommended Workflow" }), _jsxs("ol", { children: [_jsxs("li", { children: ["Run ", _jsx("code", { children: "clarity-chat doctor" }), " to verify environment variables"] }), _jsx("li", { children: "Use Storybook for visual regression / manual QA" }), _jsxs("li", { children: ["Before merging, run ", _jsx("code", { children: "npm run test" }), " + ", _jsx("code", { children: "npm run test:e2e" })] }), _jsx("li", { children: "Review bundle + benchmark reports in CI artifacts" })] }), _jsx(Callout, { type: "success", children: "The tooling stack is built to scale. Add more tests without worrying about memory leaks or flaky streaming behaviour\u2014everything runs in strict mode with mocked providers." })] })] }));
}
//# sourceMappingURL=page.js.map