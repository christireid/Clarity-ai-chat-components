import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Security Guide - Clarity Chat',
    description: 'Apply safety guardrails, audit logging, quotas, RBAC, and webhook alerts to ship compliant AI chat experiences.',
};
export default function SecurityGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Security & Compliance" }), _jsx("p", { className: "docs-lead", children: "Put guardrails around AI responses, keep regulators happy, and protect your customers\u2019 data with the enterprise subsystems shipped alongside the React package." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Enterprise-Grade Controls" }), _jsx("p", { children: "Clarity Chat includes everything you need to meet SOC2, HIPAA, and GDPR requirements out of the box:" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDEE1\uFE0F Safety engine with PII detection, content filtering, prompt injection guards" }), _jsx("li", { children: "\uD83E\uDEAA RBAC + multi-tenancy utilities to isolate customer data" }), _jsx("li", { children: "\uD83E\uDDFE Audit logging with retention policies and redaction" }), _jsx("li", { children: "\uD83D\uDCCA Usage quotas, cost tracking, and rate limiting" }), _jsx("li", { children: "\uD83D\uDCEC Webhook framework for moderation alerts and downstream integrations" }), _jsx("li", { children: "\uD83D\uDD0D Observability + tracing for incident response" })] }), _jsx(Callout, { type: "info", children: "All modules are opt-in. Import what you need, provide your storage backend, and you get compliant behaviour without rebuilding the wheel." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Guardrails & Safety Checks" }), _jsx(CodeBlock, { language: "tsx", code: `import {
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
}` }), _jsxs("p", { children: ["Safety results are compatible with the ", _jsx("code", { children: "SafetyStatusCard" }), " UI component and will automatically integrate with the audit logger when you pass the same guardrail instance."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Audit Logging & Redaction" }), _jsx(CodeBlock, { language: "tsx", code: `import {
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
` }), _jsxs("p", { children: ["Swap ", _jsx("code", { children: "MemoryAuditStorage" }), " for a Postgres, DynamoDB, or BigQuery storage adapter. The logger supports append-only tables, geo tags, and retention policies."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "RBAC & Multi-Tenancy Isolation" }), _jsx(CodeBlock, { language: "tsx", code: `import {
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
` }), _jsxs("p", { children: ["Use the tenant context to namespace vector stores, cache keys, quotas, and webhook secrets. All enterprise helpers accept a", ' ', _jsx("code", { children: "tenantId" }), " so that cross-customer data leaks become impossible."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Usage Quotas & Rate Limits" }), _jsx(CodeBlock, { language: "tsx", code: `import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'

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
` }), _jsxs(Callout, { type: "tip", children: ["The quota system integrates with the ", _jsx("code", { children: "UsageDashboard" }), " and", _jsx("code", { children: "TokenCounter" }), " components. Expose current usage to customers in real time, not just in billing emails."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Webhooks & Incident Response" }), _jsx(CodeBlock, { language: "tsx", code: `import { WebhookManager, WebhookEvents } from '@clarity-chat/react'

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
` }), _jsx("p", { children: "Retry logic, exponential backoff, HMAC signatures, and wildcard event subscriptions are supported. Plug into PagerDuty, Slack, or on-call tooling with minimal glue code." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Security Checklist" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\u2705 Wrap every user input with ", _jsx("code", { children: "SafetyChecker" })] }), _jsxs("li", { children: ["\u2705 Log every model invocation via ", _jsx("code", { children: "AuditLogger" })] }), _jsxs("li", { children: ["\u2705 Apply ", _jsx("code", { children: "TenantManager" }), " + ", _jsx("code", { children: "RBACManager" }), " before generating responses"] }), _jsxs("li", { children: ["\u2705 Enforce usage budgets with ", _jsx("code", { children: "QuotaManager" })] }), _jsxs("li", { children: ["\u2705 Stream alerts to ", _jsx("code", { children: "WebhookManager" }), " for review queues"] }), _jsxs("li", { children: ["\u2705 Trace requests with ", _jsx("code", { children: "getTracer()" }), " for forensics"] }), _jsx("li", { children: "\u2705 Store secrets in server environment variables\u2014never ship them to the client" }), _jsxs("li", { children: ["\u2705 Rotate API keys regularly; use the CLI ", _jsx("code", { children: "clarity-chat keys rotate" })] })] }), _jsx(Callout, { type: "success", children: "Need to evidence compliance? Export the audit logs, quota history, and guardrail reports as part of your SOC2/HIPAA documentation. Everything is designed to be auditor-friendly." })] })] }));
}
//# sourceMappingURL=page.js.map