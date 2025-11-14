import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Building2, FileText, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Enterprise Features',
  description: 'Enterprise-grade features, security, and compliance documentation',
}

const enterpriseDocs = [
  {
    title: 'Enterprise Features',
    href: '/enterprise-standalone/enterprise-features',
    description: 'Complete overview of enterprise features including SSO, audit logs, advanced security, and compliance',
    icon: Building2,
  },
  {
    title: 'Quick Reference',
    href: '/enterprise-standalone/quick-reference',
    description: 'Quick reference guide for enterprise features and configuration',
    icon: FileText,
  },
]

const enterpriseFeatures = [
  'Single Sign-On (SSO)',
  'Advanced Audit Logging',
  'Role-Based Access Control (RBAC)',
  'Data Residency Controls',
  'HIPAA Compliance',
  'SOC 2 Type II',
  'GDPR Compliance',
  'Custom SLA Agreements',
  'Dedicated Support',
  'On-Premise Deployment',
]

export default function EnterpriseStandalonePage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-brand-500" />
            <h1 className="text-5xl font-bold">Enterprise Features</h1>
          </div>
          <p className="text-xl text-text-secondary">
            Enterprise-grade features, security, compliance, and support for large-scale deployments.
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          {enterpriseDocs.map((doc) => {
            const Icon = doc.icon
            return (
              <Link
                key={doc.href}
                href={doc.href}
                className="group block p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-2">
                      {doc.title}
                    </h2>
                    <p className="text-text-secondary">{doc.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="border border-border rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Enterprise Capabilities</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {enterpriseFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span className="text-text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Enterprise Support</h2>
          <p className="text-text-secondary mb-6">
            Need enterprise features or have questions about compliance and security? Our enterprise team is here to help.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="mailto:enterprise@clarity-chat.dev"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Contact Enterprise Sales
            </a>
            <a
              href="/commercial"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              View Commercial Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
