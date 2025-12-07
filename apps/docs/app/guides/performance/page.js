import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Performance Guide - Clarity Chat',
    description: 'Keep chat experiences under 16ms render time, virtualise long transcripts, and monitor real-world latency with the Clarity Chat performance stack.',
};
export default function PerformanceGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Performance Optimization" }), _jsx("p", { className: "docs-lead", children: "Clarity Chat ships with virtualization, streaming-friendly helpers, and observability tooling so your UI stays under 16\u00A0ms render budgets\u2014even with thousands of messages." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Targets & Baselines" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDE80 Initial render under 200\u00A0ms on mid-tier laptops" }), _jsx("li", { children: "\u26A1 Re-renders under 16\u00A0ms (60\u00A0fps) even during streaming" }), _jsx("li", { children: "\uD83E\uDDE0 Memory usage stays below 80% of heap limit on long sessions" }), _jsx("li", { children: "\uD83D\uDCC8 Bundle size < 180\u00A0KB for the main React entry (pre-tree-shake)" })] }), _jsx(Callout, { type: "info", children: "The React package is aggressively memoized and tree-shakeable. Use the supplied monitoring widgets to keep an eye on your own usage patterns in staging and production." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Virtualize Long Transcripts" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "VirtualizedMessageList" }), " component renders only visible messages and smoothly handles threads with 10,000+ turns."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  VirtualizedMessageList,
  ChatWindow,
  useChat,
} from '@clarity-chat/react'

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
}` }), _jsxs("p", { children: ["For knowledge-base heavy experiences, combine this with the", ' ', _jsx("code", { children: "ContextVisualizer" }), " so expensive metadata panes only render when in view."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Measure Client Rendering" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "useRenderPerformance" }), " hook records render counts and timing. Display it with the ", _jsx("code", { children: "PerformanceDashboard" }), " during development or for admin users."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  PerformanceDashboard,
  useRenderPerformance,
  TokenCounter,
} from '@clarity-chat/react'

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
}` }), _jsxs(Callout, { type: "tip", children: ["Wrap dashboards in ", _jsx("code", { children: `process.env.NODE_ENV !== 'production'` }), ' ', "checks or a \u201CDeveloper Mode\u201D toggle so they do not leak into end-user bundles."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Profiling & Benchmarks" }), _jsx("p", { children: "Run the bundled scripts to analyse bundle bloat, detect accidental regressions, and measure throughput on CI hardware." }), _jsx(CodeBlock, { language: "bash", code: `# Bundle size report + HTML dashboard
npm run analyze

# Synthetic render + JSON parsing benchmarks
npm run benchmark

# Size-limit budget (fails build above thresholds)
npm run size` }), _jsxs("p", { children: ["The reports live in ", _jsx("code", { children: "bundle-reports/" }), " and", ' ', _jsx("code", { children: "benchmark-results/" }), ". Commit them as build artifacts or pipe to your observability stack."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Production Instrumentation" }), _jsx("p", { children: "Combine the performance hooks with observability utilities to collect real-world timing and model behaviour." }), _jsx(CodeBlock, { language: "tsx", code: `import {
  getTracer,
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
} from '@clarity-chat/react'

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
}` }), _jsxs("p", { children: ["Send these traces to observability backends like Datadog, Honeycomb, or OpenTelemetry (implement the ", _jsx("code", { children: "ObservabilityBackend" }), ' ', "interface). Correlate render spikes with API latency to pinpoint which models, browsers, or tenants need optimizations."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Optimization Checklist" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\u2705 Virtualize message lists when ", '>', "400 items"] }), _jsx("li", { children: "\u2705 Debounce streaming updates to 30\u201360\u00A0ms intervals" }), _jsxs("li", { children: ["\u2705 Use ", _jsx("code", { children: "startTransition" }), " (built into ", _jsx("code", { children: "useChatEnhanced" }), ") for heavy updates"] }), _jsx("li", { children: "\u2705 Memoize expensive render props (Markdown renderer, code blocks)" }), _jsx("li", { children: "\u2705 Lazy-load rarely used enterprise widgets (UsageDashboard, AI Ops)" }), _jsxs("li", { children: ["\u2705 Monitor ", _jsx("code", { children: "renderCount" }), " in staging and ensure regression alerts"] })] }), _jsxs(Callout, { type: "warning", children: ["Keep an eye on third-party SDKs (analytics, experimentation). They often cause more re-renders than the chat UI itself. Wrap them in", ' ', _jsx("code", { children: "React.lazy" }), " and only mount when required."] })] })] }));
}
//# sourceMappingURL=page.js.map