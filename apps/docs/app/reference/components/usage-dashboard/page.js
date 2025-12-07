import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'UsageDashboard - Clarity Chat Components',
    description: 'Monitor usage, quotas, and rate limits in real time.',
};
export default function UsageDashboardPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "UsageDashboard" }), _jsx("p", { className: "docs-lead", children: "Visual dashboard for tracking token usage, requests, cost estimates, and limits." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "UsageDashboard" }), " component provides real-time visibility into model usage across sessions. It is useful for audits, cost awareness, and operational dashboards."] }), _jsx(Callout, { type: "info", title: "Use Case", children: "Perfect for admin panels, billing dashboards, and monitoring tools where you need to track token consumption and costs across users or tenants." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <UsageDashboard />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Custom Refresh Rate" }), _jsx(CodePlayground, { initialCode: `function Example() {
  return (
    <div className="p-6">
      <UsageDashboard refreshIntervalMs={5000} />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "With Quota Limits" }), _jsx(CodePlayground, { initialCode: `function Example() {
  const quotas = {
    tokensPerDay: 100000,
    requestsPerMinute: 50,
    costPerMonth: 1000
  }

  return (
    <div className="p-6">
      <UsageDashboard 
        quotas={quotas}
        showWarnings={true}
      />
    </div>
  )
}

render(<Example />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "UsageDashboard Props", data: usageDashboardProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Features" }), _jsxs("ul", { children: [_jsx("li", { children: "Real-time token counting per model and session" }), _jsx("li", { children: "Request rate tracking with per-minute/hour/day breakdowns" }), _jsx("li", { children: "Cost estimation based on model pricing" }), _jsx("li", { children: "Quota warnings when approaching limits" }), _jsx("li", { children: "Historical trends and charts" }), _jsx("li", { children: "Export data as CSV or JSON" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Integration Example" }), _jsx("pre", { children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'
import { QuotaManager } from '@clarity-chat/react/utils'

export default function AdminPanel() {
  const quotaManager = new QuotaManager({
    tokensPerDay: 100000,
    requestsPerMinute: 50
  })

  return (
    <div className="admin-layout">
      <h1>Usage & Billing</h1>
      <UsageDashboard 
        quotaManager={quotaManager}
        showBilling={true}
        showExport={true}
      />
    </div>
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs(Callout, { type: "warning", title: "Performance", children: ["Set ", _jsx("code", { children: "refreshIntervalMs" }), " \u2265 1000ms to avoid excessive re-renders and API calls. For high-traffic systems, consider 5000ms or higher."] }), _jsxs("ul", { children: [_jsx("li", { children: "Place in admin or developer views, not end-user chat UIs" }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "refreshIntervalMs" }), " \u2265 1000 to avoid unnecessary updates"] }), _jsxs("li", { children: ["Pair with ", _jsx("code", { children: "QuotaManager" }), " and ", _jsx("code", { children: "RateLimiter" }), " utilities"] }), _jsxs("li", { children: ["Enable ", _jsx("code", { children: "showWarnings" }), " to alert users approaching quotas"] }), _jsx("li", { children: "Export data regularly for historical analysis" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/performance-dashboard", className: "docs-card", children: [_jsx("h3", { children: "PerformanceDashboard" }), _jsx("p", { children: "Monitor latency and throughput" })] }), _jsxs("a", { href: "/reference/components/token-optimization-dashboard", className: "docs-card", children: [_jsx("h3", { children: "TokenOptimizationDashboard" }), _jsx("p", { children: "Track optimization savings" })] }), _jsxs("a", { href: "/guides/token-optimization", className: "docs-card", children: [_jsx("h3", { children: "Token Optimization Guide" }), _jsx("p", { children: "Reduce costs and usage" })] })] })] })] }));
}
const usageDashboardProps = [
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    },
    {
        name: 'refreshIntervalMs',
        type: 'number',
        required: false,
        default: '3000',
        description: 'Update interval in milliseconds'
    },
    {
        name: 'quotas',
        type: 'QuotaConfig',
        required: false,
        description: 'Quota limits for warnings'
    },
    {
        name: 'showWarnings',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Display warnings when approaching quotas'
    },
    {
        name: 'showBilling',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show cost estimates and billing info'
    },
    {
        name: 'showExport',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Enable data export functionality'
    },
    {
        name: 'onQuotaExceeded',
        type: '(quota: string) => void',
        required: false,
        description: 'Callback when a quota is exceeded'
    }
];
//# sourceMappingURL=page.js.map