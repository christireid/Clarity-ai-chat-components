import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'PerformanceDashboard - Clarity Chat Components',
    description: 'Track latency, throughput, render times, and streaming performance.',
};
export default function PerformanceDashboardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "PerformanceDashboard" }), _jsx("p", { className: "docs-lead", children: "Observability dashboard for live performance metrics across chat interactions." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: [_jsx("code", { children: "PerformanceDashboard" }), " surfaces key metrics like request latency, token speed, frame render times, and dropped frame counts for diagnosing UX issues."] }), _jsx(Callout, { type: "info", title: "Developer Tool", children: "This component is designed for development, staging, and internal monitoring. Remove it from production builds or gate it behind admin permissions." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <PerformanceDashboard />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Compact Mode" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <PerformanceDashboard 
        showCharts={false}
        compact={true}
      />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Thresholds" }), _jsx(CodePlayground, { initialCode: `function Example() {
  const thresholds = {
    maxLatencyMs: 2000,
    minTokensPerSecond: 10,
    maxDroppedFrames: 5
  }

  return (
    <div className="p-6">
      <PerformanceDashboard 
        thresholds={thresholds}
        onThresholdExceeded={(metric) => {
          console.warn('Performance issue:', metric)
        }}
      />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "PerformanceDashboard Props", data: performanceDashboardProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Metrics Tracked" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Request Latency:" }), " Time from request to first token (P50, P95, P99)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Token Throughput:" }), " Tokens per second during streaming"] }), _jsxs("li", { children: [_jsx("strong", { children: "Render Performance:" }), " Frame times and dropped frames"] }), _jsxs("li", { children: [_jsx("strong", { children: "Memory Usage:" }), " Heap size and GC pressure"] }), _jsxs("li", { children: [_jsx("strong", { children: "Network:" }), " Request/response sizes and compression ratios"] }), _jsxs("li", { children: [_jsx("strong", { children: "Error Rates:" }), " Failed requests and retry counts"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Integration with Observability" }), _jsx("pre", { children: _jsx("code", { children: `import { PerformanceDashboard, Tracer } from '@clarity-chat/react'

export default function DevTools() {
  const tracer = new Tracer({
    endpoint: '/api/traces',
    sampleRate: 1.0
  })

  return (
    <div className="dev-panel">
      <PerformanceDashboard 
        tracer={tracer}
        exportFormat="opentelemetry"
        showTraces={true}
      />
    </div>
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tips" }), _jsx(Callout, { type: "tip", title: "Performance Debugging", children: "Use the performance dashboard alongside browser DevTools to correlate metrics with actual user experience. Look for patterns in slow interactions." }), _jsxs("ul", { children: [_jsx("li", { children: "Enable in development and staging environments" }), _jsxs("li", { children: ["Use alongside ", _jsx("code", { children: "Tracer" }), " for end-to-end request spans"] }), _jsx("li", { children: "Profile slow renders and large DOM nodes causing reflows" }), _jsx("li", { children: "Set thresholds to catch regressions early" }), _jsx("li", { children: "Export metrics to external monitoring tools" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/usage-dashboard", className: "docs-card", children: [_jsx("h3", { children: "UsageDashboard" }), _jsx("p", { children: "Monitor token usage and costs" })] }), _jsxs("a", { href: "/guides/performance", className: "docs-card", children: [_jsx("h3", { children: "Performance Guide" }), _jsx("p", { children: "Optimization best practices" })] })] })] })] }));
}
const performanceDashboardProps = [
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    },
    {
        name: 'showCharts',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display performance charts'
    },
    {
        name: 'refreshIntervalMs',
        type: 'number',
        required: false,
        default: '1000',
        description: 'Metrics refresh interval'
    },
    {
        name: 'compact',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show compact view with fewer metrics'
    },
    {
        name: 'thresholds',
        type: 'PerformanceThresholds',
        required: false,
        description: 'Alert thresholds for metrics'
    },
    {
        name: 'onThresholdExceeded',
        type: '(metric: string, value: number) => void',
        required: false,
        description: 'Callback when threshold exceeded'
    },
    {
        name: 'tracer',
        type: 'Tracer',
        required: false,
        description: 'Tracer instance for distributed tracing'
    },
    {
        name: 'showTraces',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show distributed trace timeline'
    }
];
//# sourceMappingURL=page.js.map