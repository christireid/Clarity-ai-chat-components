import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: '@clarity-chat/dev-tools - Developer Tools',
  description:
    'Inspection, logging, mocking, validation, and profiling utilities tailored for AI chat applications.',
}

export default function DevToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Package</span>
        <h1>@clarity-chat/dev-tools</h1>
        <p className="docs-lead">
          Everything you need to debug, profile, and test AI integrations without
          relying on production providers.
        </p>
      </div>

      <section className="docs-section">
        <h2>Installation</h2>
        <CodeBlock language="bash" code="npm install @clarity-chat/dev-tools" />
      </section>

      <section className="docs-section">
        <h2>Highlights</h2>
        <ul>
          <li>🔍 <strong>API Inspector</strong> — log provider calls, latency, token usage</li>
          <li>🧪 <strong>Mock Providers</strong> — deterministic streaming &amp; error scenarios</li>
          <li>📊 <strong>Performance Profiler</strong> — measure duration, throughput, memory</li>
          <li>✅ <strong>Validation</strong> — ensure responses and configs meet schema</li>
          <li>🧰 <strong>Test Helpers</strong> — assertions, suites, stream collectors</li>
          <li>🔐 <strong>Config Validator</strong> — check env vars, API keys, chat configs</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Mock Providers</h2>
        <CodeBlock
          language="ts"
          code={`import {
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
`}
        />
        <Callout type="info">
          Scenarios include success, streaming, slow responses, rate limits,
          authentication errors, and network failures. Pass custom arrays for bespoke
          behaviour.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>API Inspector</h2>
        <CodeBlock
          language="ts"
          code={`import { getAPIInspector } from '@clarity-chat/dev-tools'

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

console.log(inspector.getStats())
`}
        />
        <Callout type="tip">
          Enable verbose mode to stream every chunk and token usage to the console.
          Perfect for debugging streaming anomalies.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Performance Profiling</h2>
        <CodeBlock
          language="ts"
          code={`import { getProfiler } from '@clarity-chat/dev-tools'

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
`}
        />
      </section>

      <section className="docs-section">
        <h2>Validation Helpers</h2>
        <CodeBlock
          language="ts"
          code={`import {
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
`}
        />
      </section>

      <section className="docs-section">
        <h2>Recommended Usage</h2>
        <ol>
          <li>Integrate in unit tests for deterministic provider responses</li>
          <li>Instrument production APIs with the inspector + profiler</li>
          <li>Validate configuration at startup using CLI or validation helpers</li>
          <li>Export reports for audits and performance tuning sessions</li>
        </ol>
        <Callout type="success">
          Combine <code>@clarity-chat/dev-tools</code> with the{' '}
          <code>CLI</code> “doctor” command for a comprehensive health check across
          local and CI environments.
        </Callout>
      </section>
    </div>
  )
}

