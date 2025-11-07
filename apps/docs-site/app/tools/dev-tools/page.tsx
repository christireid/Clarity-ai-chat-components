import { Wrench, Activity, FileWarning, Cpu } from 'lucide-react'

export default function DevToolsPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">Developer Tooling Suite</h1>
        </div>
        <p className="text-xl text-text-secondary max-w-2xl">
          Time-travel debugging, API inspection, mock providers, and performance profiling—everything
          you need to build and debug AI chat applications with confidence.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <ToolCard
          icon={<Activity className="w-6 h-6" />}
          title="API Inspector"
          description="Track provider calls, streaming chunks, token usage, and errors in real time."
          bullets={[
            'TTFB, duration, and chunk metrics',
            'Token + cost tracking per provider',
            'Redacts secrets automatically',
          ]}
        />
        <ToolCard
          icon={<Cpu className="w-6 h-6" />}
          title="Performance Profiler"
          description="Measure latency, throughput, and memory usage across adapters and hooks."
          bullets={[
            'Start/stop timers around critical paths',
            'Streaming benchmarks with chunk stats',
            'HTML reports for regression tracking',
          ]}
        />
        <ToolCard
          icon={<FileWarning className="w-6 h-6" />}
          title="Config Validator"
          description="Ensure environment variables, API keys, and chat configs are production safe."
          bullets={[
            'validateEnv + printValidationResults helpers',
            'API key pattern detection',
            'Chat configuration schema validation',
          ]}
        />
        <ToolCard
          icon={<Wrench className="w-6 h-6" />}
          title="Mock Providers & Test Helpers"
          description="Simulate success, streaming, rate limits, and network failures without hitting real APIs."
          bullets={[
            'Prebuilt scenarios (success, multi-turn, slow, auth error)',
            'collectStream helper for streaming assertions',
            'Assertion + test suite utilities',
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Installation</h2>
        <pre className="bg-bg-secondary rounded-lg p-4 overflow-x-auto">
          <code>npm install @clarity-chat/dev-tools</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Quick Start</h2>
        <pre className="bg-bg-secondary rounded-lg p-4 overflow-x-auto">
          <code>{`import {
  getAPIInspector,
  createLogger,
  createMockProviders,
  validateEnv,
  getProfiler
} from '@clarity-chat/dev-tools'

const inspector = getAPIInspector()
inspector.setEnabled(true)

const logger = createLogger({ level: 'debug', prefix: '[Clarity]' })
logger.info('Debugger ready')

const { openai } = createMockProviders()
const profiler = getProfiler()

profiler.start('chat-completion')
// ... execute chat call ...
profiler.end('chat-completion')
profiler.printReport()`}</code>
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Works With</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-1">
          <li>Next.js (API routes and App Router actions)</li>
          <li>Edge runtimes (inspector works with fetch instrumentation)</li>
          <li>Playwright + Vitest (mock providers + assertion utilities)</li>
          <li>Serverless environments (config validator for env fallback)</li>
        </ul>
      </section>
    </div>
  )
}

function ToolCard({
  icon,
  title,
  description,
  bullets,
}: {
  icon: React.ReactNode
  title: string
  description: string
  bullets: string[]
}) {
  return (
    <div className="bg-bg border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
      <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
