'use client'

import React from 'react'
import {
  Shield,
  Lock,
  Users,
  Key,
  FileText,
  CheckCircle,
  AlertTriangle,
  Database,
  Eye,
  Settings,
} from 'lucide-react'

function FeatureCard({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
      <code>{code}</code>
    </pre>
  )
}

export default function EnterpriseGuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Guides</span>
          <span>/</span>
          <span className="text-foreground">Enterprise</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Enterprise Features</h1>
        <p className="text-xl text-muted-foreground">
          Security, compliance, and governance features for enterprise
          deployments.
        </p>
      </div>

      {/* Feature Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Enterprise Capabilities</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<Shield className="h-5 w-5" />}
            title="Security"
            description="End-to-end encryption and secure data handling."
            features={[
              'TLS 1.3 for all communications',
              'AES-256 encryption at rest',
              'Secure API key management',
              'Content filtering and moderation',
            ]}
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            title="Access Control"
            description="Role-based access control (RBAC) for teams."
            features={[
              'Custom roles and permissions',
              'Team and organization management',
              'SSO/SAML integration',
              'Multi-tenancy support',
            ]}
          />
          <FeatureCard
            icon={<FileText className="h-5 w-5" />}
            title="Compliance"
            description="Meet regulatory requirements."
            features={[
              'SOC 2 Type II certified',
              'GDPR compliant',
              'HIPAA ready (with BAA)',
              'Data residency options',
            ]}
          />
          <FeatureCard
            icon={<Eye className="h-5 w-5" />}
            title="Audit & Monitoring"
            description="Complete visibility into system usage."
            features={[
              'Comprehensive audit logs',
              'Real-time monitoring',
              'Usage analytics',
              'Anomaly detection',
            ]}
          />
        </div>
      </section>

      {/* Role-Based Access Control */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Role-Based Access Control (RBAC)
        </h2>
        <p className="text-muted-foreground mb-6">
          Define custom roles with granular permissions to control who can
          access what features.
        </p>

        <h3 className="text-lg font-medium mb-3">Default Roles</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Permissions
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>admin</code>
                </td>
                <td className="py-3 px-4">All permissions</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Full system access
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>developer</code>
                </td>
                <td className="py-3 px-4">chat, tools, api_keys</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Development and testing
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>analyst</code>
                </td>
                <td className="py-3 px-4">chat, analytics</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Usage monitoring
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>user</code>
                </td>
                <td className="py-3 px-4">chat</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Basic chat access
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium mb-3">Custom Role Configuration</h3>
        <CodeBlock
          code={`// clarity.config.ts
import { defineConfig } from '@clarity/config';

export default defineConfig({
  enterprise: {
    rbac: {
      roles: [
        {
          name: 'support_agent',
          permissions: [
            'chat:read',
            'chat:write',
            'history:read',
            'tools:customer_lookup',
            'tools:ticket_create',
          ],
          restrictions: {
            maxTokensPerDay: 100000,
            allowedModels: ['gpt-4o-mini'],
          },
        },
        {
          name: 'power_user',
          permissions: [
            'chat:*',
            'tools:*',
            'history:*',
          ],
          restrictions: {
            maxTokensPerDay: 500000,
          },
        },
      ],
    },
  },
});`}
        />
      </section>

      {/* SSO Integration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">SSO Integration</h2>
        <p className="text-muted-foreground mb-6">
          Integrate with your existing identity provider for seamless
          authentication.
        </p>

        <h3 className="text-lg font-medium mb-3">Supported Providers</h3>
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {[
            { name: 'Okta', status: 'Supported' },
            { name: 'Azure AD', status: 'Supported' },
            { name: 'Google Workspace', status: 'Supported' },
            { name: 'Auth0', status: 'Supported' },
            { name: 'OneLogin', status: 'Supported' },
            { name: 'SAML 2.0 (Generic)', status: 'Supported' },
          ].map((provider) => (
            <div
              key={provider.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <span className="font-medium">{provider.name}</span>
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ {provider.status}
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-3">SAML Configuration</h3>
        <CodeBlock
          code={`// clarity.config.ts
export default defineConfig({
  enterprise: {
    sso: {
      provider: 'saml',
      config: {
        entryPoint: 'https://your-idp.com/sso/saml',
        issuer: 'clarity-chat',
        cert: process.env.SAML_CERT,
        callbackUrl: 'https://your-app.com/api/auth/saml/callback',
        signatureAlgorithm: 'sha256',
        attributeMapping: {
          email: 'email',
          name: 'displayName',
          role: 'groups', // Map IDP groups to roles
        },
      },
    },
  },
});`}
        />
      </section>

      {/* Audit Logging */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Audit Logging</h2>
        <p className="text-muted-foreground mb-6">
          Track all user actions and system events for compliance and security
          monitoring.
        </p>

        <h3 className="text-lg font-medium mb-3">Logged Events</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Event</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Data Captured
                </th>
                <th className="text-left py-3 px-4 font-semibold">Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>user.login</code>
                </td>
                <td className="py-3 px-4">User ID, IP, timestamp, method</td>
                <td className="py-3 px-4">90 days</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>chat.message</code>
                </td>
                <td className="py-3 px-4">Session ID, token count, model</td>
                <td className="py-3 px-4">30 days</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>tool.execution</code>
                </td>
                <td className="py-3 px-4">Tool name, args, result status</td>
                <td className="py-3 px-4">90 days</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>config.change</code>
                </td>
                <td className="py-3 px-4">
                  Changed fields, before/after values
                </td>
                <td className="py-3 px-4">1 year</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>data.export</code>
                </td>
                <td className="py-3 px-4">Export type, recipient, scope</td>
                <td className="py-3 px-4">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium mb-3">Export Logs</h3>
        <CodeBlock
          code={`// Export audit logs to your SIEM
import { AuditLogger } from '@clarity/enterprise';

const logger = new AuditLogger({
  destinations: [
    {
      type: 'splunk',
      config: {
        endpoint: process.env.SPLUNK_HEC_URL,
        token: process.env.SPLUNK_TOKEN,
        index: 'clarity-audit',
      },
    },
    {
      type: 'datadog',
      config: {
        apiKey: process.env.DD_API_KEY,
        service: 'clarity-chat',
      },
    },
  ],
  // Filter sensitive data
  redact: ['messages.content', 'user.email'],
});`}
        />
      </section>

      {/* Data Governance */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Governance</h2>

        <h3 className="text-lg font-medium mb-3">Data Retention Policies</h3>
        <CodeBlock
          code={`export default defineConfig({
  enterprise: {
    dataRetention: {
      chatHistory: {
        enabled: true,
        duration: '90d', // Keep for 90 days
        anonymize: true, // Anonymize before deletion
      },
      auditLogs: {
        duration: '1y',
        exportBeforeDelete: true,
      },
      userContent: {
        onUserDelete: 'delete', // or 'anonymize'
        gdprExportFormat: 'json',
      },
    },
  },
});`}
        />

        <h3 className="text-lg font-medium mt-6 mb-3">Content Filtering</h3>
        <CodeBlock
          code={`export default defineConfig({
  enterprise: {
    contentModeration: {
      enabled: true,
      providers: ['openai', 'perspective'],
      policies: {
        blockCategories: ['hate', 'violence', 'self-harm'],
        warnCategories: ['sexual', 'harassment'],
        customFilters: [
          {
            name: 'pii_detection',
            pattern: /\\b\\d{3}-\\d{2}-\\d{4}\\b/, // SSN
            action: 'block',
            message: 'Personal information detected',
          },
        ],
      },
      onViolation: async (violation) => {
        await notifySecurityTeam(violation);
      },
    },
  },
});`}
        />
      </section>

      {/* Compliance Certifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Compliance Certifications
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'SOC 2 Type II',
              status: 'Certified',
              description: 'Security, availability, processing integrity',
            },
            {
              name: 'GDPR',
              status: 'Compliant',
              description: 'EU data protection regulation',
            },
            {
              name: 'HIPAA',
              status: 'Ready',
              description: 'Healthcare data protection (BAA available)',
            },
            {
              name: 'ISO 27001',
              status: 'In Progress',
              description: 'Information security management',
            },
            {
              name: 'CCPA',
              status: 'Compliant',
              description: 'California consumer privacy',
            },
            {
              name: 'FedRAMP',
              status: 'Planned',
              description: 'Federal cloud security',
            },
          ].map((cert) => (
            <div key={cert.name} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{cert.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    cert.status === 'Certified'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : cert.status === 'Compliant' || cert.status === 'Ready'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {cert.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mb-12 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Enterprise Support</h2>
        <p className="text-muted-foreground mb-4">
          Need help with enterprise deployment or have custom requirements?
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:enterprise@clarity-chat.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Contact Sales
          </a>
          <a
            href="/docs/enterprise-setup"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted"
          >
            Enterprise Setup Guide
          </a>
        </div>
      </section>

      {/* Related */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Related</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/guides/providers"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">AI Providers</h3>
            <p className="text-sm text-muted-foreground">
              Configure providers for enterprise use.
            </p>
          </a>
          <a
            href="/get-started/deployment"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Deployment Guide</h3>
            <p className="text-sm text-muted-foreground">
              Self-hosted and cloud deployment options.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
