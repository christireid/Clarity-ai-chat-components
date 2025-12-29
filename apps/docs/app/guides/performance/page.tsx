import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Performance Guide - Clarity Chat',
  description:
    'Keep chat experiences under 16ms render time, virtualise long transcripts, and monitor real-world latency with the Clarity Chat performance stack.',
}

export default function PerformanceGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Performance Optimization</h1>
        <p className="docs-lead">
          Clarity Chat ships with virtualization, streaming-friendly helpers,
          and observability tooling so your UI stays under 16&nbsp;ms render
          budgets—even with thousands of messages.
        </p>
      </div>

      <section className="docs-section">
        <h2>Targets &amp; Baselines</h2>
        <ul>
          <li>🚀 Initial render under 200&nbsp;ms on mid-tier laptops</li>
          <li>
            ⚡ Re-renders under 16&nbsp;ms (60&nbsp;fps) even during streaming
          </li>
          <li>
            🧠 Memory usage stays below 80% of heap limit on long sessions
          </li>
          <li>
            📈 Bundle size &lt; 180&nbsp;KB for the main React entry
            (pre-tree-shake)
          </li>
        </ul>
        <Callout type="info">
          The React package is aggressively memoized and tree-shakeable. Use the
          supplied monitoring widgets to keep an eye on your own usage patterns
          in staging and production.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Virtualize Long Transcripts</h2>
        <p>
          The <code>VirtualizedMessageList</code> component renders only visible
          messages and smoothly handles threads with 10,000+ turns.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  VirtualizedMessageList,
  ChatWindow,
  useChat,
} from '@clarity-chat/react/internal'

export function LargeThreadPage() {
  const chat = useChat({ id: 'enterprise-escalation', api: '/api/chat/escalate' })

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={chat.handleSubmit}
      components={{
        MessageList: (props) => (
          <VirtualizedMessageList
            {...props}
            estimateHeight={() => 92} // micro-optimization
            overscan={6}
          />
        ),
      }}
    />
  )
}`}
        />
        <p>
          For knowledge-base heavy experiences, combine this with the{' '}
          <code>ContextVisualizer</code> so expensive metadata panes only render
          when in view.
        </p>
      </section>

      <section className="docs-section">
        <h2>Measure Client Rendering</h2>
        <p>
          The <code>useRenderPerformance</code> hook records render counts and
          timing. Display it with the <code>PerformanceDashboard</code> during
          development or for admin users.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  PerformanceDashboard,
  useRenderPerformance,
  TokenCounter,
} from '@clarity-chat/react/internal'

function ChatWithMetrics() {
  const chatPerf = useRenderPerformance('ChatWindow')

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),320px]">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSend}
          footer={
            <TokenCounter
              messages={messages}
              model="gpt-4o"
              showCost
              className="w-full"
            />
          }
        />

        <div className="space-y-4">
          <PerformanceDashboard detailed updateInterval={1500} />
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Render stats</p>
            <p>Last render: {chatPerf.lastRenderTime.toFixed(2)} ms</p>
            <p>Average render: {chatPerf.averageRenderTime.toFixed(2)} ms</p>
            <p>Total renders: {chatPerf.renderCount}</p>
          </div>
        </div>
      </div>
    </>
  )
}`}
        />
        <Callout type="tip">
          Wrap dashboards in{' '}
          <code>{`process.env.NODE_ENV !== 'production'`}</code> checks or a
          “Developer Mode” toggle so they do not leak into end-user bundles.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Profiling &amp; Benchmarks</h2>
        <p>
          Run the bundled scripts to analyse bundle bloat, detect accidental
          regressions, and measure throughput on CI hardware.
        </p>
        <CodeBlock
          language="bash"
          code={`# Bundle size report + HTML dashboard
npm run analyze

# Synthetic render + JSON parsing benchmarks
npm run benchmark

# Size-limit budget (fails build above thresholds)
npm run size`}
        />
        <p>
          The reports live in <code>bundle-reports/</code> and{' '}
          <code>benchmark-results/</code>. Commit them as build artifacts or
          pipe to your observability stack.
        </p>
      </section>

      <section className="docs-section">
        <h2>Production Instrumentation</h2>
        <p>
          Combine the performance hooks with observability utilities to collect
          real-world timing and model behaviour.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  getTracer,
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
} from '@clarity-chat/react/internal'

const gaProvider = createGoogleAnalyticsProvider(process.env.NEXT_PUBLIC_GA_ID!)
const tracer = getTracer({ sampleRate: 0.2 })

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [gaProvider],
        autoTrackPageViews: true,
        autoTrackErrors: true,
        eventPrefix: 'chat.',
      }}
    >
      {children}
    </AnalyticsProvider>
  )
}

async function streamWithTracing(request: ChatRequest) {
  tracer.startTrace('chat.completion', { model: request.model })
  const span = tracer.startSpan('provider-call', 'llm')

  try {
    const response = await callProvider(request)
    tracer.endSpan(response.usage)
    return response
  } catch (error) {
    tracer.endSpan(undefined, (error as Error).message)
    throw error
  } finally {
    await tracer.endTrace()
  }
}`}
        />
        <p>
          Send these traces to observability backends like Datadog, Honeycomb,
          or OpenTelemetry (implement the <code>ObservabilityBackend</code>{' '}
          interface). Correlate render spikes with API latency to pinpoint which
          models, browsers, or tenants need optimizations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Optimization Checklist</h2>
        <ul>
          <li>✅ Virtualize message lists when {'>'}400 items</li>
          <li>✅ Debounce streaming updates to 30–60&nbsp;ms intervals</li>
          <li>
            ✅ Use <code>startTransition</code> (built into{' '}
            <code>useChatEnhanced</code>) for heavy updates
          </li>
          <li>
            ✅ Memoize expensive render props (Markdown renderer, code blocks)
          </li>
          <li>
            ✅ Lazy-load rarely used enterprise widgets (UsageDashboard, AI Ops)
          </li>
          <li>
            ✅ Monitor <code>renderCount</code> in staging and ensure regression
            alerts
          </li>
        </ul>
        <Callout type="warning">
          Keep an eye on third-party SDKs (analytics, experimentation). They
          often cause more re-renders than the chat UI itself. Wrap them in{' '}
          <code>React.lazy</code> and only mount when required.
        </Callout>
      </section>
    </div>
  )
}
