import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'


export const metadata: Metadata = {
  title: 'Security Guide - Clarity Chat',
  description:
    'Apply safety guardrails, audit logging, quotas, RBAC, and webhook alerts to ship compliant AI chat experiences.',
}

export default function SecurityGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Security &amp; Compliance</h1>
        <p className="docs-lead">
          Put guardrails around AI responses, keep regulators happy, and protect
          your customers’ data with the enterprise subsystems shipped alongside
          the React package.
        </p>
      </div>

      <section className="docs-section">
        <h2>Enterprise-Grade Controls</h2>
        <p>
          Clarity Chat includes everything you need to meet SOC2, HIPAA, and GDPR
          requirements out of the box:
        </p>
        <ul>
          <li>🛡️ Safety engine with PII detection, content filtering, prompt injection guards</li>
          <li>🪪 RBAC + multi-tenancy utilities to isolate customer data</li>
          <li>🧾 Audit logging with retention policies and redaction</li>
          <li>📊 Usage quotas, cost tracking, and rate limiting</li>
          <li>📬 Webhook framework for moderation alerts and downstream integrations</li>
          <li>🔍 Observability + tracing for incident response</li>
        </ul>
        <Callout type="info">
          All modules are opt-in. Import what you need, provide your storage
          backend, and you get compliant behaviour without rebuilding the wheel.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Guardrails &amp; Safety Checks</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  SafetyChecker,
  PIIGuardrail,
  ContentFilterGuardrail,
  PromptInjectionGuardrail,
} from '@clarity-chat/react'

const safety = new SafetyChecker([
  new PIIGuardrail({ action: 'redact', logMatches: true }),
  new ContentFilterGuardrail({
    categories: {
      hate: 'block',
      self_harm: 'review',
    },
  }),
  new PromptInjectionGuardrail(),
])

export async function secureCompletion(messages: Message[]) {
  const latest = messages[messages.length - 1]
  const result = await safety.check(latest.content)

  if (!result.safe) {
    await audit.log('safety.violation.detected', { result })
    return { content: 'Sorry, I cannot help with that.' }
  }

  return await callModel(messages)
}`}
        />
        <p>
          Safety results are compatible with the <code>SafetyStatusCard</code> UI
          component and will automatically integrate with the audit logger when
          you pass the same guardrail instance.
        </p>
      </section>

      <section className="docs-section">
        <h2>Audit Logging &amp; Redaction</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  AuditLogger,
  MemoryAuditStorage,
  AuditActions,
} from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new MemoryAuditStorage(), // replace with your DB implementation
  retentionDays: 90,
  redactFields: ['apiKey', 'accessToken', 'attachments.content'],
})

export async function logMessageSend({
  userId,
  conversationId,
  content,
}: {
  userId: string
  conversationId: string
  content: string
}) {
  await audit.log(
    AuditActions.CHAT_MESSAGE_SENT,
    { conversationId, content },
    {
      userId,
      result: 'success',
    },
  )
}
`}
        />
        <p>
          Swap <code>MemoryAuditStorage</code> for a Postgres, DynamoDB, or BigQuery
          storage adapter. The logger supports append-only tables, geo tags, and
          retention policies.
        </p>
      </section>

      <section className="docs-section">
        <h2>RBAC &amp; Multi-Tenancy Isolation</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  RBACManager,
  MemoryRBACStorage,
  TenantManager,
  MemoryTenantStorage,
  CommonRoles,
} from '@clarity-chat/react'

const rbac = new RBACManager(
  new MemoryRBACStorage({
    roles: [
      CommonRoles.ADMIN,
      CommonRoles.AGENT,
      {
        id: 'viewer',
        name: 'Viewer',
        permissions: ['chat.read'],
      },
    ],
  }),
)

const tenants = new TenantManager(new MemoryTenantStorage())

export async function withTenantContext<T>(
  tenantId: string,
  user: { id: string; roles: string[] },
  fn: () => Promise<T>,
) {
  tenants.setContext({ tenant: { id: tenantId }, userId: user.id })

  const canSend = await rbac.hasPermission(user, 'chat.send')
  if (!canSend) {
    throw new Error('Permission denied')
  }

  return await fn()
}
`}
        />
        <p>
          Use the tenant context to namespace vector stores, cache keys, quotas,
          and webhook secrets. All enterprise helpers accept a{' '}
          <code>tenantId</code> so that cross-customer data leaks become
          impossible.
        </p>
      </section>

      <section className="docs-section">
        <h2>Usage Quotas &amp; Rate Limits</h2>
        <CodeBlock
          language="tsx"
          code={`import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  storage: new MemoryQuotaStorage(),
  limits: {
    tokens: 250_000,  // per tenant / month
    requests: 5_000,
  },
  resetPeriod: 'monthly',
  onWarning(quota) {
    console.warn('Quota warning', quota)
  },
  onExceeded(quota) {
    // raise webhook, alert, or notify billing
  },
})

export async function guardProviderCall(
  tenantId: string,
  estimatedTokens: number,
) {
  const check = await quotas.checkQuota(tenantId, 'tokens', estimatedTokens)
  if (!check.allowed) {
    throw new Error('Quota exceeded — upgrade to increase limits.')
  }

  const response = await callModel()

  await quotas.recordUsage(tenantId, 'tokens', response.usage.total_tokens, {
    cost: response.cost,
  })

  return response
}
`}
        />
        <Callout type="tip">
          The quota system integrates with the <code>UsageDashboard</code> and
          <code>TokenCounter</code> components. Expose current usage to customers
          in real time, not just in billing emails.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Webhooks &amp; Incident Response</h2>
        <CodeBlock
          language="tsx"
          code={`import { WebhookManager, WebhookEvents } from '@clarity-chat/react'

const webhooks = new WebhookManager({
  maxRetries: 5,
  timeout: 7_000,
  signatureSecret: process.env.WEBHOOK_SECRET,
})

webhooks.register({
  id: 'security-ops',
  url: 'https://hooks.yourcompany.com/security/alert',
  events: [WebhookEvents.SAFETY_CONTENT_FLAGGED, WebhookEvents.SYSTEM_RATE_LIMITED],
})

export async function notify(event: typeof WebhookEvents[keyof typeof WebhookEvents], data: any) {
  await webhooks.emit({
    id: crypto.randomUUID(),
    type: event,
    data,
    timestamp: Date.now(),
  })
}
`}
        />
        <p>
          Retry logic, exponential backoff, HMAC signatures, and wildcard event
          subscriptions are supported. Plug into PagerDuty, Slack, or on-call
          tooling with minimal glue code.
        </p>
      </section>

      <section className="docs-section">
        <h2>Security Checklist</h2>
        <ul>
          <li>✅ Wrap every user input with <code>SafetyChecker</code></li>
          <li>✅ Log every model invocation via <code>AuditLogger</code></li>
          <li>✅ Apply <code>TenantManager</code> + <code>RBACManager</code> before generating responses</li>
          <li>✅ Enforce usage budgets with <code>QuotaManager</code></li>
          <li>✅ Stream alerts to <code>WebhookManager</code> for review queues</li>
          <li>✅ Trace requests with <code>getTracer()</code> for forensics</li>
          <li>✅ Store secrets in server environment variables—never ship them to the client</li>
          <li>✅ Rotate API keys regularly; use the CLI <code>clarity-chat keys rotate</code></li>
        </ul>
        <Callout type="success">
          Need to evidence compliance? Export the audit logs, quota history, and
          guardrail reports as part of your SOC2/HIPAA documentation. Everything
          is designed to be auditor-friendly.
        </Callout>
      </section>
    </div>
  )
}

