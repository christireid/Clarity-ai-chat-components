import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: '@clarity-chat/dev-tools - Developer Tools',
    description: 'Inspection, logging, mocking, validation, and profiling utilities tailored for AI chat applications.',
};
export default function DevToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Package" }), _jsx("h1", { children: "@clarity-chat/dev-tools" }), _jsx("p", { className: "docs-lead", children: "Everything you need to debug, profile, and test AI integrations without relying on production providers." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Installation" }), _jsx(CodeBlock, { language: "bash", code: "npm install @clarity-chat/dev-tools" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Highlights" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83D\uDD0D ", _jsx("strong", { children: "API Inspector" }), " \u2014 log provider calls, latency, token usage"] }), _jsxs("li", { children: ["\uD83E\uDDEA ", _jsx("strong", { children: "Mock Providers" }), " \u2014 deterministic streaming & error scenarios"] }), _jsxs("li", { children: ["\uD83D\uDCCA ", _jsx("strong", { children: "Performance Profiler" }), " \u2014 measure duration, throughput, memory"] }), _jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "Validation" }), " \u2014 ensure responses and configs meet schema"] }), _jsxs("li", { children: ["\uD83E\uDDF0 ", _jsx("strong", { children: "Test Helpers" }), " \u2014 assertions, suites, stream collectors"] }), _jsxs("li", { children: ["\uD83D\uDD10 ", _jsx("strong", { children: "Config Validator" }), " \u2014 check env vars, API keys, chat configs"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Mock Providers" }), _jsx(CodeBlock, { language: "ts", code: `import {
  createMockProviders,
  mockScenarios,
} from '@clarity-chat/dev-tools'

const { openai, anthropic } = createMockProviders(
  mockScenarios.multiTurn,
)

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages,
})

console.log(response.choices[0].message.content)
` }), _jsx(Callout, { type: "info", children: "Scenarios include success, streaming, slow responses, rate limits, authentication errors, and network failures. Pass custom arrays for bespoke behaviour." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "API Inspector" }), _jsx(CodeBlock, { language: "ts", code: `import { getAPIInspector } from '@clarity-chat/dev-tools'

const inspector = getAPIInspector()
inspector.setEnabled(true)

const callId = inspector.startCall({
  provider: 'openai',
  model: 'gpt-4o',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: { messages },
})

// ... make request ...

inspector.completeCall(callId, {
  status: 200,
  body: { usage: { prompt_tokens: 20, completion_tokens: 40 } },
})

console.table(inspector.getStats())
` }), _jsx(Callout, { type: "tip", children: "Enable verbose mode to stream every chunk and token usage to the console. Perfect for debugging streaming anomalies." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Profiling" }), _jsx(CodeBlock, { language: "ts", code: `import { getProfiler } from '@clarity-chat/dev-tools'

const profiler = getProfiler()

const { result, metrics } = await profiler.profile(
  'chat-completion',
  async () => {
    return await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
    })
  },
  { trackMemory: true },
)

console.log('Duration', metrics.duration, 'ms')
console.log('Tokens/sec', metrics.tokensPerSecond)
profiler.printReport()
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Validation Helpers" }), _jsx(CodeBlock, { language: "ts", code: `import {
  validateChatResponse,
  validateMessages,
  validateEnv,
  printValidationResults,
} from '@clarity-chat/dev-tools'

const envValidation = validateEnv()
if (!envValidation.valid) {
  printValidationResults(envValidation, 'Environment')
  process.exit(1)
}

const messageValidation = validateMessages(messages)
if (!messageValidation.valid) {
  throw new Error('Invalid messages: ' + messageValidation.errors.join(', '))
}

const responseValidation = validateChatResponse(response)
if (!responseValidation.valid) {
  throw new Error('Provider returned unexpected payload')
}
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Recommended Usage" }), _jsxs("ol", { children: [_jsx("li", { children: "Integrate in unit tests for deterministic provider responses" }), _jsx("li", { children: "Instrument production APIs with the inspector + profiler" }), _jsx("li", { children: "Validate configuration at startup using CLI or validation helpers" }), _jsx("li", { children: "Export reports for audits and performance tuning sessions" })] }), _jsxs(Callout, { type: "success", children: ["Combine ", _jsx("code", { children: "@clarity-chat/dev-tools" }), " with the", ' ', _jsx("code", { children: "CLI" }), " \u201Cdoctor\u201D command for a comprehensive health check across local and CI environments."] })] })] }));
}
//# sourceMappingURL=page.js.map