import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Production Deployment Guide - Clarity Chat',
    description: 'Ship Clarity Chat to production with confidence: environment setup, observability, fallbacks, rate limits, and incident response.',
};
export default function ProductionDeploymentGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Production Deployment" }), _jsx("p", { className: "docs-lead", children: "Everything you need to move from a polished demo to a production-grade deployment that your SRE, compliance, and security teams will sign off on." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Pre-Launch Checklist" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\u2705 Clean ", _jsx("code", { children: "npm run build" }), " for every workspace (docs, storybook, packages)"] }), _jsxs("li", { children: ["\u2705 CI passes (", _jsx("code", { children: "npm run lint" }), ", ", _jsx("code", { children: "npm run test" }), ", ", _jsx("code", { children: "npm run test:e2e" }), ")"] }), _jsx("li", { children: "\u2705 Accessibility reports archived (jest-axe + Playwright axe)" }), _jsxs("li", { children: ["\u2705 Bundle analysis reports stored in artifacts (", _jsx("code", { children: "npm run analyze" }), ")"] }), _jsx("li", { children: "\u2705 Secrets stored via platform KV / environment variables (no secrets in the repo)" }), _jsx("li", { children: "\u2705 Audit, quota, and safety systems wired to persistent storage" })] }), _jsxs(Callout, { type: "info", children: [_jsx("code", { children: "CI_CD_FINAL_STATUS.md" }), " contains the original audit logs and recommended GitHub Actions workflows. Use it as a starting point."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Recommended Architecture" }), _jsx("p", { children: "Clarity Chat supports any React runtime. The reference deployment leverages Next.js App Router with server actions for AI calls:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\u2699\uFE0F ", _jsx("strong", { children: "Hosting:" }), " Vercel, Netlify, or AWS Amplify"] }), _jsxs("li", { children: ["\uD83E\uDDE0 ", _jsx("strong", { children: "AI Providers:" }), " OpenAI, Anthropic, Google AI, or custom adapters"] }), _jsxs("li", { children: ["\uD83D\uDDC3\uFE0F ", _jsx("strong", { children: "Persistence:" }), " PlanetScale / Postgres for conversations, S3 for attachments"] }), _jsxs("li", { children: ["\uD83D\uDD10 ", _jsx("strong", { children: "Secrets:" }), " Vercel Environment Variables / AWS Secrets Manager"] }), _jsxs("li", { children: ["\uD83D\uDCE6 ", _jsx("strong", { children: "Packaging:" }), " Monorepo with ", _jsx("code", { children: "turbo" }), " + workspaces (already configured)"] }), _jsxs("li", { children: ["\uD83D\uDD04 ", _jsx("strong", { children: "CI/CD:" }), " GitHub Actions (tests + lint) + Vercel preview deployments"] })] }), _jsx(Callout, { type: "tip", children: "Need edge latency? The React package has no Node.js-only dependencies. You can stream responses from edge runtimes or serverless workers." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Resilience Patterns" }), _jsxs("p", { children: ["Use the utilities in ", _jsx("code", { children: "@clarity-chat/react" }), " to withstand provider downtime, spikes, and user abuse."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  withModelFallback,
  RateLimiter,
  getTracer,
  QuotaManager,
  WebhookManager,
} from '@clarity-chat/react'

const rateLimiter = new RateLimiter({
  storage: new RedisRateLimitStorage({ url: process.env.UPSTASH_URL! }),
  windowMs: 60_000,
  limit: 60,
})

const quotas = new QuotaManager({ /* ... */ })
const tracer = getTracer({ sampleRate: 0.3 })
const webhooks = new WebhookManager({ maxRetries: 3, signatureSecret: process.env.WEBHOOK_SECRET })

export async function generateResponse({ tenantId, userId, messages }: GenerateRequest) {
  await rateLimiter.consume(\`\${tenantId}:\${userId}\`)
  const quota = await quotas.checkQuota(tenantId, 'tokens', 2_000)
  if (!quota.allowed) {
    await webhooks.emit({
      id: crypto.randomUUID(),
      type: 'billing.quota.exceeded',
      data: { tenantId, quota },
      timestamp: Date.now(),
    })
    throw new Error('Quota exceeded - contact support')
  }

  tracer.startTrace('chat.completion', { tenantId, userId })
  const result = await withModelFallback(async (model) => {
    return await callProvider(model, messages)
  }, {
    models: [
      { provider: 'openai', model: 'gpt-4o', priority: 1 },
      { provider: 'anthropic', model: 'claude-3-sonnet', priority: 2 },
      { provider: 'google', model: 'gemini-1.5-flash', priority: 3 },
    ],
  })
  tracer.endSpan(result.usage)
  await tracer.endTrace()

  await quotas.recordUsage(tenantId, 'tokens', result.usage.total_tokens, { cost: result.cost })
  return result
}
` }), _jsx("p", { children: "Fallbacks give you multi-provider redundancy. Combine with audit logging to track which vendor served each request for finance teams." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Observability & Alerting" }), _jsx("p", { children: "Send traces, metrics, and errors to your monitoring stack. Every helper accepts a custom backend implementation so you can plug in OpenTelemetry, Datadog, Honeycomb, or your in-house solution." }), _jsx(CodeBlock, { language: "ts", code: `import { getTracer, ObservabilityBackend, Trace } from '@clarity-chat/react'
import { trace, context, SpanKind } from '@opentelemetry/api'

class OpenTelemetryBackend implements ObservabilityBackend {
  name = 'otel'

  async sendTrace(traceRecord: Trace) {
    const tracer = trace.getTracer('clarity-chat')
    const span = tracer.startSpan(traceRecord.name, {
      startTime: traceRecord.startTime,
      kind: SpanKind.SERVER,
    })

    traceRecord.spans.forEach((child) => {
      const childSpan = tracer.startSpan(child.name, { parent: span })
      childSpan.setAttributes(child.metadata ?? {})
      childSpan.end(child.endTime)
    })

    span.setAttributes(traceRecord.metadata ?? {})
    span.end(traceRecord.endTime)
  }

  async sendSpan() {
    // handled in sendTrace
  }

  async sendEvaluation(evaluation) {
    console.log('Evaluation', evaluation)
  }
}

getTracer({ backend: new OpenTelemetryBackend() })
` }), _jsxs("p", { children: ["Expose dashboards for engineering and customer success teams using the built-in ", _jsx("code", { children: "UsageDashboard" }), ", ", _jsx("code", { children: "PerformanceDashboard" }), ", and analytics provider hooks."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Release Automation" }), _jsx("p", { children: "Use the provided scripts and CLI commands to automate releases:" }), _jsx(CodeBlock, { language: "bash", code: `# Run the full quality gate locally
npm run lint && npm run test && npm run build
npm run analyze && npm run benchmark

# Prepare release notes (Changesets is already configured)
npm run changeset
npm run version-packages

# Publish packages (if distributing private npm packages)
npm run release

# Deploy docs + marketing site
npm run docs:build
vercel deploy --prod apps/docs` }), _jsxs(Callout, { type: "tip", children: ["Version locking and changelog generation are handled by Changesets. Update ", _jsx("code", { children: ".changeset/" }), " with human-readable notes for every release."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Incident Response Runbook" }), _jsx("p", { children: "When something goes wrong, follow this sequence:" }), _jsxs("ol", { children: [_jsxs("li", { children: ["\u23F1\uFE0F Check rate limits and quotas \u2014 look for spikes or abuse in the", ' ', _jsx("code", { children: "UsageDashboard" }), " and quota logs."] }), _jsxs("li", { children: ["\uD83D\uDD0D Inspect traces for provider failures \u2014 ", _jsx("code", { children: "getTracer()" }), ' ', "records every fallback path."] }), _jsx("li", { children: "\uD83E\uDDFE Review audit logs \u2014 confirm user actions, surface PII redactions, capture evidence." }), _jsx("li", { children: "\uD83D\uDCEC Trigger webhook notifications \u2014 send alerts to on-call if thresholds are exceeded." }), _jsxs("li", { children: ["\uD83D\uDD01 Roll back gracefully \u2014 the CLI ", _jsx("code", { children: "clarity-chat upgrade --rollback" }), ' ', "command helps revert dependency changes if needed."] })] }), _jsx(Callout, { type: "success", children: "Document the outputs in your incident report. Compliance teams love that all data (logs, quotas, traces) is captured with tenant IDs and user IDs pre-populated." })] })] }));
}
//# sourceMappingURL=page.js.map