import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Production Deployment Guide - Clarity Chat',
  description:
    'Ship Clarity Chat to production with confidence: environment setup, observability, fallbacks, rate limits, and incident response.',
}

export default function ProductionDeploymentGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Production Deployment</h1>
        <p className="docs-lead">
          Everything you need to move from a polished demo to a production-grade
          deployment that your SRE, compliance, and security teams will sign off
          on.
        </p>
      </div>

      <section className="docs-section">
        <h2>Pre-Launch Checklist</h2>
        <ul>
          <li>✅ Clean <code>npm run build</code> for every workspace (docs, storybook, packages)</li>
          <li>✅ CI passes (<code>npm run lint</code>, <code>npm run test</code>, <code>npm run test:e2e</code>)</li>
          <li>✅ Accessibility reports archived (jest-axe + Playwright axe)</li>
          <li>✅ Bundle analysis reports stored in artifacts (<code>npm run analyze</code>)</li>
          <li>✅ Secrets stored via platform KV / environment variables (no secrets in the repo)</li>
          <li>✅ Audit, quota, and safety systems wired to persistent storage</li>
        </ul>
        <Callout type="info">
          <code>CI_CD_FINAL_STATUS.md</code> contains the original audit logs and
          recommended GitHub Actions workflows. Use it as a starting point.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Recommended Architecture</h2>
        <p>
          Clarity Chat supports any React runtime. The reference deployment
          leverages Next.js App Router with server actions for AI calls:
        </p>
        <ul>
          <li>⚙️ <strong>Hosting:</strong> Vercel, Netlify, or AWS Amplify</li>
          <li>🧠 <strong>AI Providers:</strong> OpenAI, Anthropic, Google AI, or custom adapters</li>
          <li>🗃️ <strong>Persistence:</strong> PlanetScale / Postgres for conversations, S3 for attachments</li>
          <li>🔐 <strong>Secrets:</strong> Vercel Environment Variables / AWS Secrets Manager</li>
          <li>📦 <strong>Packaging:</strong> Monorepo with <code>turbo</code> + workspaces (already configured)</li>
          <li>🔄 <strong>CI/CD:</strong> GitHub Actions (tests + lint) + Vercel preview deployments</li>
        </ul>
        <Callout type="tip">
          Need edge latency? The React package has no Node.js-only dependencies.
          You can stream responses from edge runtimes or serverless workers.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Resilience Patterns</h2>
        <p>
          Use the utilities in <code>@clarity-chat/react</code> to withstand
          provider downtime, spikes, and user abuse.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
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
  await rateLimiter.consume(`${tenantId}:${userId}`)
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
`}
        />
        <p>
          Fallbacks give you multi-provider redundancy. Combine with audit logging
          to track which vendor served each request for finance teams.
        </p>
      </section>

      <section className="docs-section">
        <h2>Observability &amp; Alerting</h2>
        <p>
          Send traces, metrics, and errors to your monitoring stack. Every helper
          accepts a custom backend implementation so you can plug in OpenTelemetry,
          Datadog, Honeycomb, or your in-house solution.
        </p>
        <CodeBlock
          language="ts"
          code={`import { getTracer, ObservabilityBackend, Trace } from '@clarity-chat/react'
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
`}
        />
        <p>
          Expose dashboards for engineering and customer success teams using the
          built-in <code>UsageDashboard</code>, <code>PerformanceDashboard</code>,
          and analytics provider hooks.
        </p>
      </section>

      <section className="docs-section">
        <h2>Release Automation</h2>
        <p>
          Use the provided scripts and CLI commands to automate releases:
        </p>
        <CodeBlock
          language="bash"
          code={`# Run the full quality gate locally
npm run lint && npm run test && npm run build
npm run analyze && npm run benchmark

# Prepare release notes (Changesets is already configured)
npm run changeset
npm run version-packages

# Publish packages (if distributing private npm packages)
npm run release

# Deploy docs + marketing site
npm run docs:build
vercel deploy --prod apps/docs-site`}
        />
        <Callout type="tip">
          Version locking and changelog generation are handled by Changesets.
          Update <code>.changeset/</code> with human-readable notes for every
          release.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Incident Response Runbook</h2>
        <p>
          When something goes wrong, follow this sequence:
        </p>
        <ol>
          <li>
            ⏱️ Check rate limits and quotas — look for spikes or abuse in the{' '}
            <code>UsageDashboard</code> and quota logs.
          </li>
          <li>
            🔍 Inspect traces for provider failures — <code>getTracer()</code>{' '}
            records every fallback path.
          </li>
          <li>
            🧾 Review audit logs — confirm user actions, surface PII redactions, capture evidence.
          </li>
          <li>
            📬 Trigger webhook notifications — send alerts to on-call if thresholds are exceeded.
          </li>
          <li>
            🔁 Roll back gracefully — the CLI <code>clarity-chat upgrade --rollback</code>{' '}
            command helps revert dependency changes if needed.
          </li>
        </ol>
        <Callout type="success">
          Document the outputs in your incident report. Compliance teams love that
          all data (logs, quotas, traces) is captured with tenant IDs and user IDs
          pre-populated.
        </Callout>
      </section>
    </div>
  )
}

